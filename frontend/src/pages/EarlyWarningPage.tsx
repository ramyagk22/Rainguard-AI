import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, Clock, MapPin, ShieldAlert, FileText, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { EarlyWarningAlert } from '../types';
import apiClient from '../services/api';
import { useNavigate } from 'react-router-dom';

export const EarlyWarningPage: React.FC = () => {
  const { t } = useApp();
  const navigate = useNavigate();

  const [activeAlerts, setActiveAlerts] = useState<EarlyWarningAlert[]>([]);
  const [thresholds, setThresholds] = useState<any>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [ackNotice, setAckNotice] = useState('');

  const fetchWarnings = async () => {
    try {
      const [alRes, thRes] = await Promise.all([
        apiClient.get('/api/alerts?status=ACTIVE'),
        apiClient.get('/api/warnings/thresholds')
      ]);
      setActiveAlerts(alRes.data);
      setThresholds(thRes.data.thresholds);
    } catch (e) {
      console.warn('Warnings fetch error:', e);
    }
  };

  useEffect(() => {
    fetchWarnings();
  }, []);

  const handleAcknowledge = async (alertId: string) => {
    try {
      await apiClient.post(`/api/alerts/${alertId}/acknowledge`);
      setAckNotice(`Alert ${alertId} successfully acknowledged.`);
      setTimeout(() => setAckNotice(''), 4000);
      fetchWarnings();
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-500" />
            <span>Early Warning Center & Operational Advisories</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time automated hazard warnings, lead times, and actionable response dispatches.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium"
          >
            <Sliders className="h-3.5 w-3.5 text-brand-400" />
            <span>{showConfig ? 'Hide Thresholds' : 'Configure Thresholds'}</span>
          </button>
        </div>
      </div>

      {/* Prototype Warning Thresholds Banner */}
      <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-200 space-y-1">
        <p className="font-bold text-amber-300 flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4" /> Prototype Warning Thresholds Notice
        </p>
        <p className="leading-relaxed">
          Warning rules and trigger levels are configured for demonstration and research benchmarking.
          They do not replace official statutory alert bulletins issued by the India Meteorological Department (IMD) or State Disaster Management Authority (TNSDMA).
        </p>
      </div>

      {ackNotice && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{ackNotice}</span>
        </div>
      )}

      {/* Threshold Configuration Drawer */}
      {showConfig && thresholds && (
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Prototype Threshold Parameters (Adjustable)
            </span>
            <span className="text-[10px] text-slate-400">Values update alert trigger triggers immediately</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Watch 1h Rain (mm)</span>
              <span className="text-base font-bold text-amber-400 font-mono">{thresholds.watch_rainfall_1h_mm} mm</span>
            </div>
            <div className="p-3 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Alert 1h Rain (mm)</span>
              <span className="text-base font-bold text-orange-400 font-mono">{thresholds.alert_rainfall_1h_mm} mm</span>
            </div>
            <div className="p-3 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Severe 1h Rain (mm)</span>
              <span className="text-base font-bold text-rose-400 font-mono">{thresholds.severe_rainfall_1h_mm} mm</span>
            </div>
            <div className="p-3 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Critical Depth (m)</span>
              <span className="text-base font-bold text-red-500 font-mono">{thresholds.critical_inundation_depth_m} m</span>
            </div>
          </div>
        </div>
      )}

      {/* Active Warning Cards List */}
      <div className="space-y-4">
        {activeAlerts.length === 0 ? (
          <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs">
            No active severe warnings in the current catchment queue.
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <div
              key={alert.alert_id}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 shadow-md"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <StatusBadge level={alert.warning_level} size="lg" showPulse />
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">{alert.location}</h3>
                    <p className="text-xs text-slate-400">{alert.hazard} <span className="text-slate-500">|</span> Region: {alert.region}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-brand-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    Lead Time: {alert.lead_time_hours}h
                  </span>
                  <span className="text-slate-400">Window: {alert.expected_time_window}</span>
                </div>
              </div>

              {/* Numbers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Expected Precipitation</span>
                  <strong className="text-brand-300 font-mono text-sm">{alert.expected_rainfall_mm} mm</strong>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Expected Water Depth</span>
                  <strong className="text-rose-400 font-mono text-sm">{alert.expected_depth_m} m</strong>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Inundation Footprint</span>
                  <strong className="text-slate-200 font-mono text-sm">{alert.expected_inundation_km2} km²</strong>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Prediction Reliability</span>
                  <strong className="text-emerald-400 font-mono text-sm">{alert.reliability}</strong>
                </div>
              </div>

              {/* Meteorological Reason & Data Sources */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs space-y-1.5">
                <p className="text-slate-300 leading-relaxed">
                  <strong className="text-slate-200">Meteorological Reason:</strong> {alert.reason}
                </p>
                <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 pt-1">
                  <span>Fused Sensors:</span>
                  {alert.data_sources.map((ds, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {ds}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actionable Instructions */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
                  Actionable Emergency Response Directives
                </span>
                <ul className="space-y-1 text-slate-300">
                  {alert.actionable_instructions.map((inst, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-brand-400 font-bold">•</span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer Timestamps & Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span>Issued: <strong className="text-slate-300">{alert.issued_at}</strong></span>
                  <span>Expires: <strong className="text-slate-300">{alert.expires_at}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
                  >
                    {t('viewOnMap')}
                  </button>

                  <button
                    onClick={() => handleAcknowledge(alert.alert_id)}
                    className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-colors"
                  >
                    {t('acknowledge')}
                  </button>

                  <button
                    onClick={() => navigate('/reports')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
                  >
                    {t('exportReport')}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
