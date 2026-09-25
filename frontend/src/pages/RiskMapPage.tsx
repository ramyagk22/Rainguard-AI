import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Map, Layers, ShieldAlert, MapPin, Building, Hospital, School, Navigation } from 'lucide-react';
import { MapComponent } from '../components/common/MapComponent';
import { StatusBadge } from '../components/common/StatusBadge';
import { InundationZone } from '../types';
import apiClient from '../services/api';

export const RiskMapPage: React.FC = () => {
  const [zones, setZones] = useState<InundationZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<InundationZone | null>(null);
  const [riskData, setRiskData] = useState<any>(null);

  useEffect(() => {
    apiClient.get('/api/risk/layers').then((res) => {
      setRiskData(res.data);
      setZones(res.data.zones || []);
      if (res.data.zones && res.data.zones.length > 0) {
        setSelectedZone(res.data.zones[0]);
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Map className="h-5 w-5 text-brand-400" />
            <span>Integrated Disaster Risk Assessment Map</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hazard × Exposure × Vulnerability full GIS geospatial framework covering arterial infrastructure and shelters.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800">
            GIS Standard: WGS84 EPSG:4326
          </span>
        </div>
      </div>

      {/* Main Map & Detailed Risk Assessment Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Full Map (Col 8) */}
        <div className="lg:col-span-8 space-y-2">
          <MapComponent
            zones={zones}
            height="620px"
            onSelectZone={(z) => setSelectedZone(z)}
          />
        </div>

        {/* Selected Risk Panel (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-brand-400 font-bold uppercase tracking-wider">
                  Risk Assessment Dossier
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  {selectedZone?.name || 'Select Basin'}
                </h3>
              </div>
              {selectedZone && <StatusBadge level={selectedZone.risk_category} size="md" showPulse />}
            </div>

            {selectedZone ? (
              <div className="space-y-4">
                {/* 3 Pillars: Hazard, Exposure, Vulnerability */}
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-amber-400 flex items-center gap-1.5">
                        <ShieldAlert className="h-3.5 w-3.5" /> 1. Hazard Component
                      </span>
                      <span className="font-mono text-slate-200">HIGH (0.84)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Forecast rainfall 118mm, Adyar river overtopping, high soil wetness (94%).
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-sky-400 flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5" /> 2. Exposure Component
                      </span>
                      <span className="font-mono text-slate-200">CRITICAL (0.92)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {selectedZone.population_density_sqkm.toLocaleString()} residents/km², {selectedZone.critical_infrastructure_count} critical healthcare/relief nodes.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-rose-400 flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" /> 3. Vulnerability Component
                      </span>
                      <span className="font-mono text-slate-200">SEVERE (0.88)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Flat terrain slope ({selectedZone.slope_pct}%), low elevation ({selectedZone.elevation_dem_m}m MSL), tidal canal lock.
                    </p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800">
                  <div className="p-2 rounded bg-slate-950">
                    <span className="text-slate-500 block text-[10px]">Water Depth</span>
                    <strong className="text-rose-400 font-mono text-xs">{selectedZone.depth_range_label}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950">
                    <span className="text-slate-500 block text-[10px]">Predicted Inundation</span>
                    <strong className="text-slate-200 font-mono text-xs">{selectedZone.predicted_inundation_km2} km²</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950">
                    <span className="text-slate-500 block text-[10px]">Reliability Rating</span>
                    <strong className="text-emerald-400 font-mono text-xs">{selectedZone.prediction_reliability}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950">
                    <span className="text-slate-500 block text-[10px]">Telemetry Update</span>
                    <strong className="text-slate-300 font-mono text-xs">{selectedZone.last_updated}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">Click a zone on the map.</p>
            )}
          </div>

          {/* Methodology Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Documented Methodology
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              Risk = Hazard (Rain + Runoff) × Exposure (Population + Assets) × Vulnerability (Slope + DEM)
            </p>
            <p className="text-[10px] text-slate-500 pt-1">
              Methodology calibrated against National Disaster Management Guidelines for urban flood risk evaluation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
