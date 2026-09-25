import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CloudRain, Compass, Clock, Sliders, ShieldCheck, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import apiClient from '../services/api';

export const RainfallForecastPage: React.FC = () => {
  const { t } = useApp();

  const [location, setLocation] = useState('Velachery South Basin');
  const [horizonHours, setHorizonHours] = useState(3);
  const [forecastResult, setForecastResult] = useState<any>(null);
  const [spatialGrid, setSpatialGrid] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Weather parameters for simulation
  const [radarDbz, setRadarDbz] = useState(48.5);
  const [pressureHpa, setPressureHpa] = useState(1002.5);
  const [rhPct, setRhPct] = useState(94.0);

  const locations = [
    'Velachery South Basin',
    'Saidapet Adyar River Corridor',
    'Tambaram Mudichur Lowland Basin',
    'Madhavaram Retteri Urban Catchment',
    'Ennore Creek Coastal Radar Link',
    'Cuddalore Coastal AWS'
  ];

  const runPrediction = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/api/rainfall/predict', {
        location,
        region: 'Tamil Nadu Coastal Corridor',
        horizon_hours: horizonHours,
        radar_reflectivity_dbz: radarDbz,
        pressure_hpa: pressureHpa,
        relative_humidity_pct: rhPct,
        lag1_rainfall_mm: 22.0,
        lag3_rainfall_mm: 54.0
      });
      setForecastResult(res.data);
    } catch (e) {
      console.warn('Prediction error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runPrediction();
    apiClient.get('/api/rainfall/spatial-grid').then((res) => {
      setSpatialGrid(res.data.points || []);
    });
  }, [location, horizonHours]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-brand-400" />
            <span>AI Rainfall Prediction & Nowcasting</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ConvRF Spatiotemporal Ensemble integrating Doppler radar, surface AWS, and ECMWF/GFS numerical guidance.
          </p>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 self-start sm:self-auto font-semibold">
          Demo data (Prototype / Simulation)
        </span>
      </div>

      {/* Control Bar: Location & Horizon Horizon Selector */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Location Dropdown */}
        <div className="md:col-span-4 space-y-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Target Catchment / Basin</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500 font-medium"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc} className="bg-slate-900 text-slate-100">
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Forecast Horizon Selector (1h, 3h, 6h, 12h, 24h) */}
        <div className="md:col-span-5 space-y-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Forecast Horizon Window</label>
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            {[1, 3, 6, 12, 24].map((h) => (
              <button
                key={h}
                onClick={() => setHorizonHours(h)}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  horizonHours === h ? 'bg-brand-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* Trigger Button */}
        <div className="md:col-span-3 pt-4 md:pt-0">
          <button
            onClick={runPrediction}
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-brand-600/30"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Execute Model Inference</span>
          </button>
        </div>
      </div>

      {/* Main Forecast Result Cards */}
      {forecastResult && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">AI Predicted Rainfall</span>
            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-3xl font-extrabold text-orange-400 font-mono">
                {forecastResult.ai_prediction_mm}
              </span>
              <span className="text-xs text-slate-400 font-semibold">mm</span>
            </div>
            <span className="text-[10px] text-orange-400/90 font-medium">Accumulated across {forecastResult.forecast_period}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">Peak Rain Intensity</span>
            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-3xl font-extrabold text-brand-300 font-mono">
                {forecastResult.peak_intensity_mm_hr}
              </span>
              <span className="text-xs text-slate-400 font-semibold">mm/h</span>
            </div>
            <span className="text-[10px] text-brand-400 font-medium">Surpasses storm drain discharge</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">NWP Guidance Comparison</span>
            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-3xl font-extrabold text-slate-200 font-mono">
                {forecastResult.nwp_forecast_mm}
              </span>
              <span className="text-xs text-slate-400 font-semibold">mm</span>
            </div>
            <span className="text-[10px] text-slate-400">ECMWF / GFS numerical baseline</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">Spatiotemporal Fused Estimate</span>
            <div className="flex items-baseline gap-1.5 pt-1">
              <span className="text-3xl font-extrabold text-teal-300 font-mono">
                {forecastResult.fused_prediction_mm}
              </span>
              <span className="text-xs text-slate-400 font-semibold">mm</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium">
              Reliability: <strong>{forecastResult.prediction_reliability} ({forecastResult.reliability_score_pct}%)</strong>
            </span>
          </div>
        </div>
      )}

      {/* Multi-Model Comparison & Spatial Differences Table */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Spatial Forecast Grid & Model Divergence</h3>
            <p className="text-[11px] text-slate-400">Comparison of Ground Observed vs AI Nowcast vs NWP Guidance across Tamil Nadu Basins</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Resolution: 1.0 km²
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-3">Catchment Node</th>
                <th className="py-2.5 px-3">Observed Rain</th>
                <th className="py-2.5 px-3">RainGuard AI Forecast</th>
                <th className="py-2.5 px-3">NWP Model</th>
                <th className="py-2.5 px-3">AI vs NWP Delta</th>
                <th className="py-2.5 px-3">Threat Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {spatialGrid.map((pt, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{pt.location}</td>
                  <td className="py-2.5 px-3 font-mono text-sky-400">{pt.observed} mm</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-orange-400">{pt.ai_forecast} mm</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">{pt.nwp_forecast} mm</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400">+{pt.diff} mm</td>
                  <td className="py-2.5 px-3">
                    <StatusBadge level={pt.ai_forecast > 50 ? 'SEVERE' : (pt.ai_forecast > 35 ? 'ALERT' : 'WATCH')} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Attribution Note */}
      <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">Model Architecture & Provenance:</p>
        <p>Inference powered by {forecastResult?.model_version || 'RainGuard-ConvRF-v2.4'}. Fused output utilizes dynamical radar-freshness weighting (0.85 weight for 1h-3h nowcasting, shifting to NWP synoptic steering at 12h-24h).</p>
      </div>
    </div>
  );
};
