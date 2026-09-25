import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Radio,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Thermometer,
  Droplets,
  Wind,
  Compass,
  Gauge,
  Waves,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { MapComponent } from '../components/common/MapComponent';
import { WeatherStation } from '../types';
import apiClient from '../services/api';

export const LiveMonitoringPage: React.FC = () => {
  const { t } = useApp();

  const [stations, setStations] = useState<WeatherStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<WeatherStation | null>(null);
  const [timeframe, setTimeframe] = useState<'1h' | '3h' | '6h' | '24h'>('1h');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  const frames = ['T-60m', 'T-45m', 'T-30m', 'T-15m', 'Current Scan'];

  useEffect(() => {
    apiClient.get('/api/monitoring/stations').then((res) => {
      setStations(res.data);
      if (res.data.length > 0) setSelectedStation(res.data[0]);
    });
  }, []);

  // Time animation loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Radio className="h-5 w-5 text-brand-400" />
            <span>Live Weather & Rainfall Monitoring</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time Doppler weather radar scans, automatic rain gauge telemetries, and river stage hydro-gauges.
          </p>
        </div>

        {/* Timeframe & Animation Controls */}
        <div className="flex items-center gap-3">
          {/* Timeframe Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-semibold">
            {(['1h', '3h', '6h', '24h'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  timeframe === tf ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf === '1h' ? '1 Hour' : tf === '3h' ? '3 Hours' : tf === '6h' ? '6 Hours' : '24 Hours'}
              </button>
            ))}
          </div>

          {/* Animation Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5 text-amber-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
            <span>{isPlaying ? 'Pause Loop' : 'Play Loop'}</span>
          </button>
        </div>
      </div>

      {/* Frame Timeline Indicator */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-lg px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-brand-400" />
          <span className="text-slate-400">Doppler Radar Scan Series:</span>
          <span className="font-mono font-bold text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {frames[currentFrameIndex]}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {frames.map((f, idx) => (
            <button
              key={f}
              onClick={() => {
                setCurrentFrameIndex(idx);
                setIsPlaying(false);
              }}
              className={`h-2.5 w-8 rounded-full transition-all ${
                idx === currentFrameIndex ? 'bg-brand-500 scale-110' : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={f}
            />
          ))}
        </div>
      </div>

      {/* Map & Station Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map */}
        <div className="lg:col-span-8">
          <MapComponent
            stations={stations}
            height="550px"
            onSelectStation={(st) => setSelectedStation(st)}
          />
        </div>

        {/* Station Telemetry Detail Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-brand-400 uppercase">Selected Monitoring Node</span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedStation?.name || 'Select a Weather Station'}
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {selectedStation?.station_id || 'STA-N/A'}
              </span>
            </div>

            {selectedStation ? (
              <div className="space-y-4 text-xs">
                {/* 1h, 3h, 24h Rainfall Cards */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">1h Rain</span>
                    <span className="text-sm font-extrabold text-brand-300 font-mono">
                      {selectedStation.rainfall_1h_mm} mm
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">3h Rain</span>
                    <span className="text-sm font-extrabold text-sky-300 font-mono">
                      {selectedStation.rainfall_3h_mm} mm
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">24h Total</span>
                    <span className="text-sm font-extrabold text-indigo-300 font-mono">
                      {selectedStation.rainfall_24h_mm} mm
                    </span>
                  </div>
                </div>

                {/* Atmospheric Parameters */}
                <div className="space-y-2 pt-1 border-t border-slate-800">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/60">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Thermometer className="h-3.5 w-3.5 text-rose-400" /> Temperature
                    </span>
                    <strong className="text-slate-200 font-mono">{selectedStation.temperature_c} °C</strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/60">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Droplets className="h-3.5 w-3.5 text-sky-400" /> Relative Humidity
                    </span>
                    <strong className="text-slate-200 font-mono">{selectedStation.relative_humidity_pct}%</strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/60">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Wind className="h-3.5 w-3.5 text-teal-400" /> Wind Speed & Heading
                    </span>
                    <strong className="text-slate-200 font-mono">
                      {selectedStation.wind_speed_kmh} km/h ({selectedStation.wind_direction_deg}°)
                    </strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-slate-950/60">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Gauge className="h-3.5 w-3.5 text-purple-400" /> Barometric Pressure
                    </span>
                    <strong className="text-slate-200 font-mono">{selectedStation.pressure_hpa} hPa</strong>
                  </div>

                  {selectedStation.water_level_m !== null && selectedStation.water_level_m !== undefined && (
                    <div className="flex items-center justify-between p-2 rounded bg-slate-950/60">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Waves className="h-3.5 w-3.5 text-blue-400" /> River Stage / Water Level
                      </span>
                      <strong className={`font-mono ${selectedStation.water_level_m >= (selectedStation.river_danger_level_m || 7.5) ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
                        {selectedStation.water_level_m} m
                        {selectedStation.river_danger_level_m && (
                          <span className="text-[10px] text-slate-500 ml-1">
                            (Danger: {selectedStation.river_danger_level_m}m)
                          </span>
                        )}
                      </strong>
                    </div>
                  )}
                </div>

                {/* Quality & Metadata */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    Quality: <strong className="text-emerald-400">{selectedStation.data_quality}</strong>
                  </span>
                  <span>Updated: {selectedStation.last_updated}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">Click any blue station icon on the map.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
