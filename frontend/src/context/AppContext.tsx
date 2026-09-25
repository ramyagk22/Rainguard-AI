import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { translations, Language } from '../i18n/translations';
import { getPendingActions, removePendingAction } from '../services/offlineStorage';
import apiClient from '../services/api';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  networkStatus: 'online' | 'syncing' | 'offline';
  lowBandwidthMode: boolean;
  setLowBandwidthMode: (enabled: boolean) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  syncOfflineQueue: () => Promise<void>;
  pendingSyncCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('rainguard_lang') as Language) || 'en';
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rainguard_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default demo user so evaluation is instantaneous
    return {
      id: 'usr-1',
      email: 'operator@rainguard.ai',
      name: 'Kavitha R.',
      role: 'Emergency Operator',
      department: 'State Emergency Operations Center (SEOC)'
    };
  });

  const [networkStatus, setNetworkStatus] = useState<'online' | 'syncing' | 'offline'>('online');
  const [lowBandwidthMode, setLowBandwidthModeState] = useState<boolean>(() => {
    return localStorage.getItem('rainguard_low_bw') === 'true';
  });

  const [selectedLocation, setSelectedLocation] = useState<string>('Chennai Metro Basin (Coromandel)');
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('rainguard_lang', lang);
  };

  const setLowBandwidthMode = (enabled: boolean) => {
    setLowBandwidthModeState(enabled);
    localStorage.setItem('rainguard_low_bw', enabled ? 'true' : 'false');
    if (enabled) {
      document.body.classList.add('low-bandwidth-mode');
    } else {
      document.body.classList.remove('low-bandwidth-mode');
    }
  };

  const login = (token: string, userData: User) => {
    localStorage.setItem('rainguard_token', token);
    localStorage.setItem('rainguard_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('rainguard_token');
    localStorage.removeItem('rainguard_user');
    setUser(null);
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  // Sync offline queued actions to backend
  const syncOfflineQueue = async () => {
    try {
      const pending = await getPendingActions();
      setPendingSyncCount(pending.length);
      if (pending.length === 0) return;

      setNetworkStatus('syncing');
      for (const action of pending) {
        if (action.type === 'ACKNOWLEDGE_ALERT') {
          await apiClient.post(`/api/alerts/${action.payload.alert_id}/acknowledge`);
        } else if (action.type === 'ESCALATE_ALERT') {
          await apiClient.post(`/api/alerts/${action.payload.alert_id}/escalate`);
        } else if (action.type === 'CLOSE_ALERT') {
          await apiClient.post(`/api/alerts/${action.payload.alert_id}/close`);
        }
        await removePendingAction(action.id);
      }
      setPendingSyncCount(0);
      setNetworkStatus('online');
    } catch (e) {
      console.warn('Sync attempt failed, network still unavailable:', e);
      setNetworkStatus('offline');
    }
  };

  useEffect(() => {
    if (lowBandwidthMode) {
      document.body.classList.add('low-bandwidth-mode');
    }

    const handleOnline = () => {
      setNetworkStatus('online');
      syncOfflineQueue();
    };
    const handleOffline = () => setNetworkStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check for offline actions
    getPendingActions().then((actions) => setPendingSyncCount(actions.length)).catch(() => {});

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [lowBandwidthMode]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        user,
        login,
        logout,
        networkStatus,
        lowBandwidthMode,
        setLowBandwidthMode,
        selectedLocation,
        setSelectedLocation,
        syncOfflineQueue,
        pendingSyncCount
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
