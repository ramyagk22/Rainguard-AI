import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Waves, Mountain, Droplets, Sliders, ArrowRight, ShieldAlert, CheckCircle2, Layers } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { MapComponent } from '../components/common/MapComponent';
import { InundationZone } from '../types';
import apiClient from '../services/api';

export const InundationPage: React.FC = () => {
  const [zones, setZones] = useState<InundationZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<InundationZone | null>(null);

  // Simulation inputs
  const [rainfallMm, setRainfallMm] = useState(85.0);
  const [demElevation, setDemElevation] = useState(3.4);
  const [slopePct, setSlopePct] = useState(0.4);
  const [soilSatPct, setSoilSatPct] = useState(94.0);
  const [drainageDischarge, setDrainageDischarge] = useState(12.5);
  const [riverStage, setRiverStage] = useState(7.65);
  const [simResult, setSimResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    apiClient.get('/api/inundation/zones').then((res) => {
      setZones(res.data);
      if (res.data.length > 0) {
        setSelectedZone(res.data[0]);
        setDemElevation(res.data[0].elevation_dem_m);
        setSlopePct(res.data[0].slope_pct);
        setSoilSatPct(res.data[0].soil_saturation_pct);
        setDrainageDischarge(res.data[0].drainage_discharge_m3s);
      }
    });
  }, []);

  const runHydroSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await apiClient.post('/api/inundation/simulate', {
        zone_id: selectedZone?.zone_id || 'ZN-VEL-01',
        rainfall_mm: rainfallMm,
        dem_elevation_m: demElevation,
        slope_pct: slopePct,
        soil_saturation_pct: soilSatPct,
        drainage_discharge_m3s: drainageDischarge,
        river_stage_m: riverStage,
        river_danger_level_m: 7.50
      });
      setSimResult(res.data.prediction);
    } catch (e) {
      console.warn('Simulation error:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    runHydroSimulation();
  }, [selectedZone, rainfallMm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Waves className="h-5 w-5 text-brand-400" />
            <span>AI Inundation & Hydrodynamic Depth Prediction</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Physics-guided SCS-CN kinematic wave runoff modeling coupled with High-Resolution DEM elevation and river backwater stage.
          </p>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 self-start sm:self-auto font-semibold">
          Demo data (Prototype / Simulation)
        </span>
      </div>

      {/* Map & Hydro Simulation Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Showing Inundation Zones (Col 7) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Inundation Depth & Risk Zones</span>
            <span className="text-[11px] text-slate-400">Click a zone to load parameters</span>
          </div>

          <MapComponent
            zones={zones}
            height="560px"
            onSelectZone={(z) => {
              setSelectedZone(z);
              setDemElevation(z.elevation_dem_m);
              setSlopePct(z.slope_pct);
              setSoilSatPct(z.soil_saturation_pct);
              setDrainageDischarge(z.drainage_discharge_m3s);
            }}
          />
        </div>

        {/* Hydrodynamic Parameter Controls & Simulation Output (Col 5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Output Card */}
          {simResult && (
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-brand-400 uppercase font-bold">Predicted Submergence</span>
                  <h3 className="text-sm font-bold text-white">{selectedZone?.name || 'Selected Catchment'}</h3>
                </div>
                <StatusBadge level={simResult.risk_category} size="md" showPulse />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Predicted Inundation Depth</span>
                  <span className="text-lg font-extrabold text-rose-400 font-mono">
                    {simResult.predicted_depth_m} m
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{simResult.depth_range_label}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Predicted Extent</span>
                  <span className="text-lg font-extrabold text-slate-200 font-mono">
                    {simResult.predicted_inundation_km2} km²
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Catchment footprint</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-slate-800">
                <div className="p-2 rounded bg-slate-950/60">
                  <span className="text-[10px] text-slate-500 block">Overland Runoff</span>
                  <strong className="text-brand-300 font-mono">{simResult.runoff_mm} mm</strong>
                </div>
                <div className="p-2 rounded bg-slate-950/60">
                  <span className="text-[10px] text-slate-500 block">Ponding Head</span>
                  <strong className="text-sky-300 font-mono">{simResult.effective_ponding_mm} mm</strong>
                </div>
                <div className="p-2 rounded bg-slate-950/60">
                  <span className="text-[10px] text-slate-500 block">Reliability</span>
                  <strong className="text-emerald-400 font-mono">{simResult.prediction_reliability}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Input Sliders Form */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">Hydrological Model Inputs</span>
              <button
                onClick={runHydroSimulation}
                className="text-[11px] px-2 py-0.5 rounded bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-colors"
              >
                Re-calculate
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Forecast Rainfall Volume:</span>
                  <strong className="text-brand-400 font-mono">{rainfallMm} mm</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="250"
                  step="5"
                  value={rainfallMm}
                  onChange={(e) => setRainfallMm(parseFloat(e.target.value))}
                  className="w-full accent-brand-500 h-1.5 bg-slate-800 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Digital Elevation Model (DEM):</span>
                  <strong className="text-slate-200 font-mono">{demElevation} m above MSL</strong>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="20.0"
                  step="0.2"
                  value={demElevation}
                  onChange={(e) => setDemElevation(parseFloat(e.target.value))}
                  className="w-full accent-brand-500 h-1.5 bg-slate-800 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Soil Moisture Saturation Index:</span>
                  <strong className="text-amber-400 font-mono">{soilSatPct}%</strong>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="2"
                  value={soilSatPct}
                  onChange={(e) => setSoilSatPct(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Storm Drain Discharge Capacity:</span>
                  <strong className="text-teal-400 font-mono">{drainageDischarge} m³/s</strong>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="45.0"
                  step="1.0"
                  value={drainageDischarge}
                  onChange={(e) => setDrainageDischarge(parseFloat(e.target.value))}
                  className="w-full accent-teal-500 h-1.5 bg-slate-800 rounded"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Adyar River Stage:</span>
                  <strong className={`font-mono ${riverStage >= 7.5 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                    {riverStage} m (Danger: 7.50m)
                  </strong>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="9.5"
                  step="0.1"
                  value={riverStage}
                  onChange={(e) => setRiverStage(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
