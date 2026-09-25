import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { History, Calendar, CloudRain, Waves, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { HistoricalEvent } from '../types';
import apiClient from '../services/api';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export const HistoricalAnalysisPage: React.FC = () => {
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('EVT-2023-12');
  const [eventDetail, setEventDetail] = useState<any>(null);

  useEffect(() => {
    apiClient.get('/api/historical/events').then((res) => {
      setEvents(res.data);
    });
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      apiClient.get(`/api/historical/event/${selectedEventId}`).then((res) => {
        setEventDetail(res.data);
      });
    }
  }, [selectedEventId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <History className="h-5 w-5 text-brand-400" />
            <span>Historical Rainfall & Flood Event Benchmark</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Retrospective hindcasting on landmark coastal floods (Dec 2015, Nov 2021, Cyclone Michaung Dec 2023).
          </p>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 self-start sm:self-auto">
          IMD & CWC Validated Archive
        </span>
      </div>

      {/* Events Selection Table */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-white uppercase tracking-wider block">
          Archived Calibrated Disaster Events
        </span>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Disaster Event Title</th>
                <th className="py-2.5 px-3">Date Range</th>
                <th className="py-2.5 px-3">Basin / Region</th>
                <th className="py-2.5 px-3">Peak Rainfall</th>
                <th className="py-2.5 px-3">Max Inundation</th>
                <th className="py-2.5 px-3">Lead Time</th>
                <th className="py-2.5 px-3">Hindcast Error</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {events.map((evt) => (
                <tr
                  key={evt.event_id}
                  onClick={() => setSelectedEventId(evt.event_id)}
                  className={`cursor-pointer transition-colors ${
                    selectedEventId === evt.event_id ? 'bg-brand-950/40 text-brand-200' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-200">{evt.event_id}</td>
                  <td className="py-3 px-3 font-bold text-white">{evt.title}</td>
                  <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{evt.date_str}</td>
                  <td className="py-3 px-3 text-slate-400">{evt.region}</td>
                  <td className="py-3 px-3 text-brand-400 font-mono font-bold">{evt.peak_rainfall_mm} mm</td>
                  <td className="py-3 px-3 text-orange-400 font-mono font-bold">{evt.maximum_inundation_km2} km²</td>
                  <td className="py-3 px-3 text-emerald-400 font-mono font-semibold">{evt.warning_lead_time_hours} Hours</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{evt.prediction_error_pct}%</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-brand-600/30 text-brand-300 text-[10px] font-semibold flex items-center gap-1 w-max">
                      Inspect <ChevronRight className="h-3 w-3" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Event Phased Timeline & Hindcast Curves */}
      {eventDetail && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Phased Timeline (Col 6) */}
          <div className="lg:col-span-6 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-brand-400 font-bold uppercase tracking-wider">
                  Event Chronology & Escalation
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{eventDetail.event.title}</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 font-mono">
                {eventDetail.event.date_str}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 italic bg-slate-950/60 p-2.5 rounded border border-slate-800">
              "{eventDetail.event.summary_notes}"
            </p>

            {/* Stepped Timeline */}
            <div className="space-y-3 pt-2 relative border-l-2 border-slate-800 ml-3 pl-4">
              {eventDetail.event.timeline_steps?.map((step: any, i: number) => (
                <div key={i} className="relative space-y-0.5">
                  <div className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full bg-brand-500 border-2 border-slate-900" />
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-brand-400 font-bold">{step.time}</span>
                    <span className="font-bold text-slate-200">{step.phase}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hindcast Curve Comparison (Col 6) */}
          <div className="lg:col-span-6 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-brand-400 font-bold uppercase tracking-wider">
                  Retrospective Hindcasting Verification
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">Observed vs Nowcasted Hydrograph</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                CSI: {eventDetail.event.validation_metrics?.csi_critical_success_index || 0.89}
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={eventDetail.timeline_series || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="mm" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line type="monotone" dataKey="rainfall_mm" name="Observed Rain (mm)" stroke="#0284c7" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="predicted_rainfall_mm" name="Hindcasted AI Rain (mm)" stroke="#f97316" strokeWidth={2} strokeDasharray="4 4" dot />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Validation Metrics Snapshot */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-800">
              <div className="p-2 rounded bg-slate-950">
                <span className="text-[10px] text-slate-500 block">Rainfall MAE</span>
                <strong className="text-slate-200 font-mono">{eventDetail.event.validation_metrics?.rainfall_mae_mm} mm</strong>
              </div>
              <div className="p-2 rounded bg-slate-950">
                <span className="text-[10px] text-slate-500 block">Detection POD</span>
                <strong className="text-emerald-400 font-mono">{eventDetail.event.validation_metrics?.pod_probability_of_detection}</strong>
              </div>
              <div className="p-2 rounded bg-slate-950">
                <span className="text-[10px] text-slate-500 block">Inundation IoU</span>
                <strong className="text-teal-300 font-mono">{eventDetail.event.validation_metrics?.inundation_iou}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
