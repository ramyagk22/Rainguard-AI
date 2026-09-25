import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LifeBuoy, Hospital, Home, AlertOctagon, Navigation, CheckCircle2, ShieldAlert } from 'lucide-react';
import apiClient from '../services/api';

export const EmergencyResponsePage: React.FC = () => {
  const [situation, setSituation] = useState<any>(null);
  const [actionList, setActionList] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/api/emergency/situation').then((res) => {
      setSituation(res.data);
      setActionList(res.data.response_actions || []);
    });
  }, []);

  const toggleActionStatus = (actionId: string) => {
    setActionList((prev) =>
      prev.map((act) =>
        act.id === actionId
          ? { ...act, status: act.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED' }
          : act
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-brand-400" />
            <span>Emergency Operations & Incident Response</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time evacuation shelter logistics, hospital protection, and potentially affected arterial corridors.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
          {situation?.status_summary?.operational_condition || 'LEVEL-3 INCIDENT COMMAND ACTIVE'}
        </span>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Total Shelter Capacity</span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-extrabold text-white font-mono">
              {situation?.status_summary?.total_shelter_capacity ?? 2050}
            </span>
            <span className="text-xs text-slate-400">persons</span>
          </div>
          <span className="text-[10px] text-emerald-400">Staged with food & water</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Current Shelter Occupancy</span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-extrabold text-amber-400 font-mono">
              {situation?.status_summary?.current_occupancy ?? 460}
            </span>
            <span className="text-xs text-slate-400">sheltered</span>
          </div>
          <span className="text-[10px] text-slate-400">Adyar & Velachery displaced</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Available Remaining Margin</span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              {situation?.status_summary?.available_capacity ?? 1590}
            </span>
            <span className="text-xs text-slate-400">spaces</span>
          </div>
          <span className="text-[10px] text-slate-400">Sufficient for 8h evacuation</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 block">Potentially Affected Assets</span>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-extrabold text-rose-400 font-mono">
              {situation?.status_summary?.potentially_affected_infrastructure_count ?? 3}
            </span>
            <span className="text-xs text-slate-400">critical</span>
          </div>
          <span className="text-[10px] text-rose-400">MIOT approach & subways</span>
        </div>
      </div>

      {/* Critical Infrastructure Registry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Relief Shelters */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Home className="h-4 w-4 text-emerald-400" /> Designated Evacuation Relief Centers
            </span>
            <span className="text-[10px] font-mono text-slate-400">Civil Defense</span>
          </div>

          <div className="space-y-2.5">
            {situation?.shelters?.map((shelter: any) => (
              <div key={shelter.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{shelter.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800">
                    {shelter.status}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Capacity: <strong className="text-slate-200">{shelter.capacity_people}</strong></span>
                  <span>Occupancy: <strong className="text-amber-400">{shelter.current_occupancy}</strong></span>
                  <span>Ground Elevation: <strong className="text-slate-300">{shelter.elevation_m}m MSL</strong></span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-brand-500 h-full"
                    style={{ width: `${(shelter.current_occupancy / shelter.capacity_people) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hospitals & Potentially Affected Roads */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Hospital className="h-4 w-4 text-rose-400" /> Hospitals & Potentially Affected Corridors
            </span>
            <span className="text-[10px] font-mono text-slate-400">Access Routes</span>
          </div>

          <div className="space-y-2.5">
            {situation?.hospitals?.map((hosp: any) => (
              <div key={hosp.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{hosp.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    hosp.potentially_affected
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {hosp.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Elevation: {hosp.elevation_m}m MSL</p>
              </div>
            ))}

            {situation?.potentially_affected_roads?.map((road: any) => (
              <div key={road.id} className="p-3 rounded-lg bg-slate-950 border border-rose-900/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-300">{road.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    Potentially Affected
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Status: {road.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Commander Response Checklist */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Incident Command Tactical Action Plan
        </h3>
        <div className="space-y-2">
          {actionList.map((act) => (
            <div
              key={act.id}
              onClick={() => toggleActionStatus(act.id)}
              className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 cursor-pointer hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={act.status === 'COMPLETED'}
                  onChange={() => {}}
                  className="rounded border-slate-700 bg-slate-900 text-brand-600 focus:ring-0 h-4 w-4"
                />
                <span className={`font-medium ${act.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {act.action}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  act.priority === 'HIGH' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                }`}>
                  {act.priority}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{act.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
