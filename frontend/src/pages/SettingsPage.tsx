import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Globe,
  Sliders,
  HardDrive,
  RefreshCw,
  Shield,
  UserCheck,
  Zap,
  Info,
  CheckCircle2
} from 'lucide-react';
import apiClient from '../services/api';

export const SettingsPage: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    user,
    lowBandwidthMode,
    setLowBandwidthMode,
    syncOfflineQueue,
    pendingSyncCount
  } = useApp();

  const [thresholds, setThresholds] = useState<any>({
    watch_rainfall_1h_mm: 15.0,
    alert_rainfall_1h_mm: 35.0,
    severe_rainfall_1h_mm: 65.0,
    critical_rainfall_1h_mm: 100.0,
    watch_inundation_depth_m: 0.2,
    alert_inundation_depth_m: 0.5,
    severe_inundation_depth_m: 0.9,
    critical_inundation_depth_m: 1.4
  });

  const [saveNotice, setSaveNotice] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    apiClient.get('/api/warnings/thresholds').then((res) => {
      if (res.data.thresholds) setThresholds(res.data.thresholds);
    });
  }, []);

  const handleSaveThresholds = async () => {
    setIsSaving(true);
    try {
      await apiClient.post('/api/warnings/thresholds', thresholds);
      setSaveNotice('Warning thresholds updated and recorded in audit log.');
      setTimeout(() => setSaveNotice(''), 4000);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="h-5 w-5 text-brand-400" />
          <span>System Settings & Operational Configurations</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Language preferences, offline telemetry storage, threshold calibration, and identity management.
        </p>
      </div>

      {saveNotice && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* Section 1: User Profile & Security */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <UserCheck className="h-4 w-4 text-brand-400" />
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">Logged-in Operator Profile</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Name</span>
            <strong className="text-slate-200 text-xs">{user?.name || 'Kavitha R.'}</strong>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Official Email</span>
            <strong className="text-slate-200 text-xs">{user?.email || 'operator@rainguard.ai'}</strong>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Assigned Role</span>
            <strong className="text-brand-400 font-mono text-xs">{user?.role || 'Emergency Operator'}</strong>
          </div>
        </div>
      </div>

      {/* Section 2: Language & Regional Localization */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Globe className="h-4 w-4 text-sky-400" />
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">Language & Regional Localization</h3>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700">
            <input
              type="radio"
              name="lang"
              checked={language === 'en'}
              onChange={() => setLanguage('en')}
              className="text-brand-600 focus:ring-0"
            />
            <div>
              <span className="font-bold text-slate-200 block">English (United States / International)</span>
              <span className="text-[11px] text-slate-400">Full meteorological terminology in English</span>
            </div>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-800 bg-slate-950 hover:border-slate-700">
            <input
              type="radio"
              name="lang"
              checked={language === 'ta'}
              onChange={() => setLanguage('ta')}
              className="text-brand-600 focus:ring-0"
            />
            <div>
              <span className="font-bold text-slate-200 block">தமிழ் (Tamil — தமிழ்நாடு பேரிடர் மேலாண்மை)</span>
              <span className="text-[11px] text-slate-400">முழுமையான தமிழ் மொழிபெயர்ப்பு</span>
            </div>
          </label>
        </div>
      </div>

      {/* Section 3: Low-Bandwidth Mode & Offline PWA Sync */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Zap className="h-4 w-4 text-amber-400" />
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">Field Resilience: Low-Bandwidth & Offline PWA</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200 block">Low Bandwidth Mode</span>
              <p className="text-[11px] text-slate-400">
                Reduces high-resolution map tile fetching, disables heavy animations, and prioritizes warning alerts during emergency grid blackouts.
              </p>
            </div>
            <button
              onClick={() => setLowBandwidthMode(!lowBandwidthMode)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                lowBandwidthMode ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {lowBandwidthMode ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200 block">IndexedDB Offline Queue</span>
              <p className="text-[11px] text-slate-400">
                Operator acknowledgments and situation dispatches are stored locally when offline and synchronized once connectivity resumes.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Queued: {pendingSyncCount}</span>
              <button
                onClick={() => syncOfflineQueue()}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
              >
                Sync Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Warning Thresholds Configuration */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-rose-400" />
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">Prototype Warning Threshold Calibration</h3>
          </div>
          <span className="text-[10px] text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
            Decision-Support Only
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">WATCH 1h Rain (mm)</label>
            <input
              type="number"
              value={thresholds.watch_rainfall_1h_mm}
              onChange={(e) => setThresholds({ ...thresholds, watch_rainfall_1h_mm: parseFloat(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">ALERT 1h Rain (mm)</label>
            <input
              type="number"
              value={thresholds.alert_rainfall_1h_mm}
              onChange={(e) => setThresholds({ ...thresholds, alert_rainfall_1h_mm: parseFloat(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">SEVERE 1h Rain (mm)</label>
            <input
              type="number"
              value={thresholds.severe_rainfall_1h_mm}
              onChange={(e) => setThresholds({ ...thresholds, severe_rainfall_1h_mm: parseFloat(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">CRITICAL Depth (m)</label>
            <input
              type="number"
              step="0.1"
              value={thresholds.critical_inundation_depth_m}
              onChange={(e) => setThresholds({ ...thresholds, critical_inundation_depth_m: parseFloat(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100 font-mono"
            />
          </div>
        </div>

        <button
          onClick={handleSaveThresholds}
          disabled={isSaving}
          className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors"
        >
          {isSaving ? 'Updating...' : 'Save Warning Thresholds'}
        </button>
      </div>

      {/* Section 5: About RainGuard AI & Innovexa */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
        <h3 className="font-bold text-white uppercase tracking-wider text-[11px]">About RainGuard AI</h3>
        <p className="text-slate-300 leading-relaxed">
          Product: <strong>RainGuard AI</strong> | Team: <strong>Innovexa</strong> | Version: <strong>1.0.0-competition</strong>
        </p>
        <p className="text-slate-400 leading-relaxed">
          Tagline: <em>"From Rainfall Intelligence to Actionable Flood Warnings."</em>
        </p>
        <p className="text-[11px] text-slate-500">
          Built as an end-to-end competition-ready disaster intelligence web application integrating satellite, radar, surface telemetry, numerical models, terrain DEM, explainable AI, and actionable early warnings.
        </p>
      </div>
    </div>
  );
};
