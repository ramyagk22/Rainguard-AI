import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Globe, Bell, Search, MapPin, Gauge, Wifi, Zap } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface NavbarProps {
  title?: string;
  onMenuToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ title = 'Command Dashboard', onMenuToggle }) => {
  const {
    language,
    setLanguage,
    t,
    user,
    selectedLocation,
    setSelectedLocation,
    lowBandwidthMode,
    setLowBandwidthMode,
    networkStatus
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const locations = [
    'Chennai Metro Basin (Coromandel)',
    'Adyar & Saidapet River Corridor',
    'Velachery South Marsh Basin',
    'Tambaram Mudichur Catchment',
    'Madhavaram & North Chennai Basin',
    'Cuddalore Coastal Corridor'
  ];

  return (
    <header className="sticky top-0 z-30 h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 md:px-6">
      {/* Left: Mobile Menu Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
          aria-label="Toggle navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-sm md:text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
            <span className="hidden sm:inline-flex text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Innovexa Core
            </span>
          </h1>
        </div>
      </div>

      {/* Middle: Location Selector & Search */}
      <div className="hidden lg:flex items-center gap-3 flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-400 pointer-events-none" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 font-medium"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc} className="bg-slate-900 text-slate-100">
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search stations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-md pl-8 pr-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Right: Low-BW Toggle, Language Selector, Notifications, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Low-Bandwidth Mode Quick Switch */}
        <button
          onClick={() => setLowBandwidthMode(!lowBandwidthMode)}
          title={lowBandwidthMode ? 'Disable Low-Bandwidth Mode' : 'Enable Low-Bandwidth Mode for Field Resilience'}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border font-medium transition-colors ${
            lowBandwidthMode
              ? 'bg-amber-950/80 text-amber-300 border-amber-600/50 shadow-sm'
              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          <span className="hidden xl:inline">{lowBandwidthMode ? 'Low-BW Active' : 'Low-BW'}</span>
        </button>

        {/* Language Selector (English / தமிழ்) */}
        <div className="flex items-center bg-slate-950/90 border border-slate-800 rounded-md p-0.5">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
              language === 'en' ? 'bg-brand-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('ta')}
            className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
              language === 'ta' ? 'bg-brand-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            தமிழ்
          </button>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 text-slate-300 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-lg shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="font-semibold text-slate-100">Live Warning Dispatch</span>
                <span className="text-[10px] text-brand-400 font-mono">2 Active Alerts</span>
              </div>
              <div className="space-y-2">
                <div className="p-2 rounded bg-rose-950/40 border border-rose-800/40">
                  <div className="flex items-center justify-between mb-1">
                    <StatusBadge level="CRITICAL" size="sm" />
                    <span className="text-[10px] text-slate-400">10m ago</span>
                  </div>
                  <p className="font-semibold text-slate-200">Saidapet Adyar Stage Overtopping</p>
                  <p className="text-[11px] text-slate-400">Stage: 7.65m (Danger mark: 7.50m). Immediate response required.</p>
                </div>
                <div className="p-2 rounded bg-orange-950/40 border border-orange-800/40">
                  <div className="flex items-center justify-between mb-1">
                    <StatusBadge level="SEVERE" size="sm" />
                    <span className="text-[10px] text-slate-400">25m ago</span>
                  </div>
                  <p className="font-semibold text-slate-200">Velachery South Subway Flooding</p>
                  <p className="text-[11px] text-slate-400">Predicted depth: 1.15m. Dewatering pump deployed.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Tag */}
        {user && (
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="h-7 w-7 rounded-full bg-brand-700/60 border border-brand-500/40 flex items-center justify-center text-xs font-bold text-white">
              {user.name.charAt(0)}
            </div>
            <div className="text-left text-xs">
              <p className="font-semibold text-slate-200 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-mono leading-tight">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
