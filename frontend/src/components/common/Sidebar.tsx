import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Radio,
  CloudRain,
  Waves,
  Map,
  AlertTriangle,
  History,
  BrainCircuit,
  FileText,
  Database,
  Settings,
  LifeBuoy,
  Sparkles,
  ShieldCheck,
  Wifi,
  WifiOff,
  RefreshCw,
  LogOut,
  UserCheck
} from 'lucide-react';

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen = false, onClose }) => {
  const { t, user, logout, networkStatus, pendingSyncCount, syncOfflineQueue } = useApp();

  const navItems = [
    { to: '/dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { to: '/live-monitoring', label: t('navLiveMonitoring'), icon: Radio },
    { to: '/rainfall-forecast', label: t('navRainfallForecast'), icon: CloudRain },
    { to: '/inundation', label: t('navInundationPrediction'), icon: Waves },
    { to: '/risk-map', label: t('navRiskMap'), icon: Map },
    { to: '/alerts', label: t('navAlerts'), icon: AlertTriangle },
    { to: '/emergency-response', label: t('navEmergencyResponse'), icon: LifeBuoy },
    { to: '/explainable-ai', label: t('navExplainableAI'), icon: Sparkles },
    { to: '/reliability', label: t('navReliability'), icon: ShieldCheck },
    { to: '/historical', label: t('navHistoricalAnalysis'), icon: History },
    { to: '/forecast-vs-observed', label: t('navForecastVsObserved'), icon: Radio },
    { to: '/model-insights', label: t('navModelInsights'), icon: BrainCircuit },
    { to: '/reports', label: t('navReports'), icon: FileText },
    { to: '/data-sources', label: t('navDataSources'), icon: Database },
    { to: '/settings', label: t('navSettings'), icon: Settings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <CloudRain className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-white tracking-tight">RainGuard</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">AI</span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 tracking-wider uppercase">Innovexa</p>
          </div>
        </NavLink>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white p-1">
            ✕
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600/20 text-brand-300 border-l-2 border-brand-500 pl-2.5 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Sidebar: Online/Offline Status & User Card */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2.5 text-xs">
        {/* Network & Sync Status */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2">
            {networkStatus === 'online' && (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <Wifi className="h-3.5 w-3.5" />
                <span>{t('online')}</span>
              </span>
            )}
            {networkStatus === 'syncing' && (
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>{t('syncing')}</span>
              </span>
            )}
            {networkStatus === 'offline' && (
              <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                <WifiOff className="h-3.5 w-3.5" />
                <span>{t('offline')}</span>
              </span>
            )}
          </div>

          {pendingSyncCount > 0 && (
            <button
              onClick={() => syncOfflineQueue()}
              title="Synchronize offline changes"
              className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
            >
              Sync ({pendingSyncCount})
            </button>
          )}
        </div>

        {/* User Role Card */}
        {user ? (
          <div className="flex items-center justify-between px-2 py-1.5 rounded bg-slate-900/60">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700 flex-shrink-0">
                <UserCheck className="h-3.5 w-3.5 text-brand-400" />
              </div>
              <div className="truncate">
                <p className="font-semibold text-slate-200 truncate">{user.name}</p>
                <p className="text-[10px] text-brand-400 font-mono truncate">{user.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title={t('logout')}
              className="text-slate-400 hover:text-rose-400 p-1 rounded hover:bg-slate-800"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="block text-center py-1.5 rounded bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs transition-colors"
          >
            {t('login')}
          </NavLink>
        )}
      </div>
    </aside>
  );
};
