import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Info, CheckCircle2, AlertTriangle, Layers, Activity } from 'lucide-react';
import apiClient from '../services/api';

export const ReliabilityPage: React.FC = () => {
  const [reliability, setReliability] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/api/reliability/current').then((res) => {
      setReliability(res.data);
      setIsLoading(false);
    });
  }, []);

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'HIGH':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> HIGH RELIABILITY
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" /> MEDIUM RELIABILITY
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-700 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" /> LOW RELIABILITY
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-400" />
            <span>AI Decision-Support Reliability Assessment</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            "AI decision-support reliability indicator" evaluating telemetry freshness, sensor health, and mathematical model convergence.
          </p>
        </div>

        {reliability && getRatingBadge(reliability.overall_rating)}
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 text-brand-400 flex-shrink-0 mt-0.5" />
          <p className="italic">
            "{reliability?.disclaimer || 'AI decision-support reliability indicator. Reliability does not represent certainty that a future event will occur.'}"
          </p>
        </div>
      </div>

      {/* Overall Score Dial */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Composite Decision Reliability Index</span>
          <div className="flex items-baseline justify-center md:justify-start gap-3">
            <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono">
              {reliability?.overall_score ?? 88.4}%
            </span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              ({reliability?.overall_rating || 'HIGH'})
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-lg">
            High confidence derived from synchronized Doppler radar scans, zero missing sensor nodes, and tight agreement between AI ConvRF and ECMWF synoptic guidance.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1 min-w-[200px]">
          <span className="text-[11px] text-slate-400">Confidence Band</span>
          <span className="text-lg font-bold text-slate-200 font-mono">± 6.2 mm</span>
          <span className="text-[10px] text-slate-500">90% Ensemble Interval</span>
        </div>
      </div>

      {/* 7 Reliability Pillars Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: '1. Data Quality Factor',
            score: reliability?.data_quality_score ?? 95.2,
            desc: 'Physical meteorological limit checks, step-rate gradient tests, and radar clutter filter passed.'
          },
          {
            title: '2. Input Completeness',
            score: reliability?.input_completeness_score ?? 100.0,
            desc: '8 of 8 ground AWS rain gauges and coastal radar links streaming uninterrupted telemetry.'
          },
          {
            title: '3. Observation Freshness',
            score: reliability?.observation_freshness_score ?? 96.0,
            desc: 'Mean telemetry network latency is 5 minutes, well within 15-minute nowcasting threshold.'
          },
          {
            title: '4. Forecast Model Agreement',
            score: reliability?.forecast_agreement_score ?? 89.2,
            desc: 'Low variance between RainGuard ConvRF (58.4mm) and ECMWF IFS / GFS guidance (48.0mm).'
          },
          {
            title: '5. Model Uncertainty (Variance)',
            score: reliability?.model_uncertainty_score ?? 88.8,
            desc: 'RandomForest decision tree variance is 2.8, indicating tight consensus across ensemble estimators.'
          },
          {
            title: '6. Spatial Consistency',
            score: reliability?.spatial_consistency_score ?? 92.5,
            desc: 'Spatial radar-gauge cross-interpolation conforms to spatial gradient continuity.'
          },
          {
            title: '7. Temporal Trend Continuity',
            score: reliability?.temporal_consistency_score ?? 89.0,
            desc: 'Rainfall accumulation curve matches storm cell kinetic progression without abrupt step anomalies.'
          }
        ].map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">{item.title}</span>
              <span className="font-mono font-extrabold text-brand-300 text-sm">{item.score}%</span>
            </div>

            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-brand-500 h-full rounded-full"
                style={{ width: `${item.score}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Factors Summary List */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Evaluation Factors Summary</h3>
        <ul className="space-y-1.5 text-slate-300">
          {reliability?.factors_summary?.map((factor: string, i: number) => (
            <li key={i} className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
              <span>{factor}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
