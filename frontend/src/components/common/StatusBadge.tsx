import React from 'react';
import { StatusLevel } from '../../types';
import { CheckCircle2, Eye, AlertTriangle, AlertOctagon, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface StatusBadgeProps {
  level: StatusLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ level, size = 'md', showPulse = false }) => {
  const { t } = useApp();
  const normalizedLevel = (level || 'NORMAL').toUpperCase() as StatusLevel;

  const config = {
    NORMAL: {
      label: t('statusNormal'),
      badgeText: 'NORMAL',
      icon: CheckCircle2,
      classes: 'bg-sky-950/80 text-sky-300 border-sky-600/50',
      iconClass: 'text-sky-400'
    },
    WATCH: {
      label: t('statusWatch'),
      badgeText: 'WATCH',
      icon: Eye,
      classes: 'bg-amber-950/80 text-amber-300 border-amber-600/50',
      iconClass: 'text-amber-400'
    },
    ALERT: {
      label: t('statusAlert'),
      badgeText: 'ALERT',
      icon: AlertTriangle,
      classes: 'bg-orange-950/80 text-orange-300 border-orange-600/50',
      iconClass: 'text-orange-400'
    },
    SEVERE: {
      label: t('statusSevere'),
      badgeText: 'SEVERE',
      icon: AlertOctagon,
      classes: 'bg-red-950/80 text-red-300 border-red-600/60',
      iconClass: 'text-red-400'
    },
    CRITICAL: {
      label: t('statusCritical'),
      badgeText: 'CRITICAL',
      icon: Flame,
      classes: 'bg-rose-950 text-rose-200 border-rose-500 font-bold',
      iconClass: 'text-rose-400'
    }
  }[normalizedLevel] || {
    label: normalizedLevel,
    badgeText: normalizedLevel,
    icon: AlertTriangle,
    classes: 'bg-slate-800 text-slate-300 border-slate-700',
    iconClass: 'text-slate-400'
  };

  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2'
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-wide uppercase shadow-sm ${config.classes} ${sizeClasses}`}
      role="status"
      aria-label={`Status: ${config.badgeText}`}
    >
      <IconComponent className={`h-3.5 w-3.5 flex-shrink-0 ${config.iconClass} ${showPulse && normalizedLevel !== 'NORMAL' ? 'animate-pulse' : ''}`} />
      <span>{config.badgeText}</span>
      <span className="sr-only">({config.label})</span>
    </span>
  );
};
