/**
 * RainGuard AI IndexedDB Offline Storage & Synchronization Service
 * Ensures zero data loss during severe disaster field operations with low or no connectivity.
 */

const DB_NAME = 'rainguard_offline_db';
const DB_VERSION = 1;

export interface QueuedAction {
  id: string;
  type: 'ACKNOWLEDGE_ALERT' | 'ESCALATE_ALERT' | 'CLOSE_ALERT' | 'FIELD_OBSERVATION' | 'GENERATE_REPORT';
  payload: any;
  timestamp: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('action_queue')) {
        db.createObjectStore('action_queue', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('cached_data')) {
        db.createObjectStore('cached_data', { keyPath: 'key' });
      }
    };
  });
}

export async function queueOfflineAction(action: Omit<QueuedAction, 'id' | 'timestamp'>): Promise<string> {
  const db = await openDB();
  const id = `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const item: QueuedAction = {
    ...action,
    id,
    timestamp: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction('action_queue', 'readwrite');
    const store = tx.objectStore('action_queue');
    const req = store.put(item);
    req.onsuccess = () => resolve(id);
    req.onerror = () => reject(req.error);
  });
}

export async function getPendingActions(): Promise<QueuedAction[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('action_queue', 'readonly');
    const store = tx.objectStore('action_queue');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function removePendingAction(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('action_queue', 'readwrite');
    const store = tx.objectStore('action_queue');
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function cacheData(key: string, data: any): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('cached_data', 'readwrite');
    const store = tx.objectStore('cached_data');
    const req = store.put({ key, data, updated_at: new Date().toISOString() });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getCachedData<T = any>(key: string): Promise<T | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('cached_data', 'readonly');
    const store = tx.objectStore('cached_data');
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result ? req.result.data : null);
    req.onerror = () => reject(req.error);
  });
}
