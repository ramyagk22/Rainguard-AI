import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
  className?: string;
  variant?: 'banner' | 'compact' | 'footer';
}

export const ResponsibleAIDisclaimer: React.FC<Props> = ({ className = '', variant = 'banner' }) => {
  const { t } = useApp();

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 border border-slate-800 rounded px-2.5 py-1.5 ${className}`}>
        <Info className="h-3.5 w-3.5 text-brand-400 flex-shrink-0" />
        <span>{t('responsibleAIDisclaimer')}</span>
      </div>
    );
  }

  return (
    <div className={`p-3.5 rounded-lg border border-amber-500/30 bg-amber-950/20 text-slate-200 text-xs shadow-sm ${className}`}>
      <div className="flex items-start gap-3">
        <ShieldAlert className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-300 tracking-wide">
            Responsible AI & Operational Decision-Support Policy
          </p>
          <p className="text-slate-300 leading-relaxed">
            {t('responsibleAIDisclaimer')}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[11px] text-slate-400">
            <span>• Predictions contain inherent meteorological uncertainty</span>
            <span>• Sensor telemetry latency affects nowcast resolution</span>
            <span>• AI does not replace IMD/TNSDMA authorized emergency bulletins</span>
            <span>• Decisions must be corroborated with ground hydrological gauges</span>
          </div>
        </div>
      </div>
    </div>
  );
};
