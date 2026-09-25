import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  CloudRain,
  Waves,
  MapPin,
  Radio,
  Database,
  ArrowUpRight,
  Clock,
  Eye,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { MapComponent } from '../components/common/MapComponent';
import { ResponsibleAIDisclaimer } from '../components/common/ResponsibleAIDisclaimer';
import { WeatherStation, InundationZone, EarlyWarningAlert } from '../types';
import apiClient from '../services/api';
import { queueOfflineAction } from '../services/offlineStorage';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user, t, lowBandwidthMode } = useApp();

  const [summaryData, setSummaryData] = useState<any>(null);
  const [chartsData, setChartsData] = useState<any>(null);
  const [stations, setStations] = useState<WeatherStation[]>([]);
  const [zones, setZones] = useState<InundationZone[]>([]);
  const [priorityAlerts, setPriorityAlerts] = useState<EarlyWarningAlert[]>([]);
  const [selectedZone, setSelectedZone] = useState<InundationZone | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');
  const [ackSuccessMsg, setAckSuccessMsg] = useState<string>('');

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [sumRes, chartsRes, stationsRes, zonesRes, alertsRes] = await Promise.all([
        apiClient.get('/api/dashboard/summary'),
        apiClient.get('/api/dashboard/charts'),
        apiClient.get('/api/monitoring/stations'),
        apiClient.get('/api/inundation/zones'),
        apiClient.get('/api/alerts?status=ACTIVE')
      ]);

      setSummaryData(sumRes.data);
      setChartsData(chartsRes.data);
      setStations(stationsRes.data);
      setZones(zonesRes.data);
      setPriorityAlerts(alertsRes.data);
      setLastUpdatedTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAcknowledge = async (alertId: string) => {
    try {
      await apiClient.post(`/api/alerts/${alertId}/acknowledge`);
      setAckSuccessMsg(`Alert ${alertId} acknowledged.`);
      setTimeout(() => setAckSuccessMsg(''), 4000);
      fetchDashboardData();
    } catch (e) {
      // Offline fallback: queue action
      await queueOfflineAction({
        type: 'ACKNOWLEDGE_ALERT',
        payload: { alert_id: alertId }
      });
      setAckSuccessMsg(`Offline Mode: Acknowledgment queued locally for ${alertId}`);
      setTimeout(() => setAckSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {t('goodEvening')}, {user?.name || 'Operator'}
            </h2>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              DEMO MODE (Prototype Simulation)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t('dashboardSubtitle')} <span className="text-slate-500">|</span> Region: <span className="text-brand-300 font-semibold">Tamil Nadu Coastal (Chennai Basin)</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{t('lastUpdated')}: <strong className="text-slate-200">{lastUpdatedTime || 'Live'}</strong></span>
          </div>

          <button
            onClick={fetchDashboardData}
            title="Refresh telemetry"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-brand-400' : ''}`} />
          </button>
        </div>
      </div>

      {ackSuccessMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{ackSuccessMsg}</span>
        </div>
      )}

      {/* 6 High-Fidelity Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Active Warnings */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('activeAlerts')}</span>
            <AlertOctagon className="h-4 w-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              {summaryData?.stats?.active_alerts?.value ?? priorityAlerts.length}
            </span>
            <StatusBadge level="SEVERE" size="sm" />
          </div>
          <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1">
            <span>+1 in last 2 hours</span>
          </p>
        </div>

        {/* Card 2: Heavy Rainfall Zones */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('heavyRainfallZones')}</span>
            <CloudRain className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              {summaryData?.stats?.heavy_rainfall_zones?.value ?? 5}
            </span>
            <StatusBadge level="ALERT" size="sm" />
          </div>
          <p className="text-[11px] text-amber-400 font-medium">Stationary rainband</p>
        </div>

        {/* Card 3: High-Risk Areas */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('highRiskAreas')}</span>
            <Waves className="h-4 w-4 text-orange-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              {summaryData?.stats?.high_risk_areas?.value ?? 3}
            </span>
            <StatusBadge level="CRITICAL" size="sm" />
          </div>
          <p className="text-[11px] text-orange-400 font-medium">Adyar & Velachery</p>
        </div>

        {/* Card 4: Predicted Inundation km2 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('predictedInundation')}</span>
            <MapPin className="h-4 w-4 text-brand-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white font-mono">
              {summaryData?.stats?.predicted_inundation_km2?.value ?? 24.15}
            </span>
            <span className="text-xs font-semibold text-slate-400">km²</span>
          </div>
          <p className="text-[11px] text-brand-400 font-medium">+4.2 km² expected peak</p>
        </div>

        {/* Card 5: Monitoring Stations */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('monitoringStations')}</span>
            <Radio className="h-4 w-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              {stations.length || 8}
            </span>
            <span className="text-xs text-slate-400">/ 8 active</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">100% operational</p>
        </div>

        {/* Card 6: Data Sources Connected */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{t('dataSources')}</span>
            <Database className="h-4 w-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white font-mono">
              4 / 4
            </span>
            <span className="text-xs text-emerald-400 font-semibold">Synced</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium truncate">INSAT, DWR, AWS, NWP</p>
        </div>
      </div>

      {/* Main Command Map & Side Priority Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Leaflet Map (Col 8) */}
        <div className="lg:col-span-8 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Hydrological Basin Multi-Layer Situation Map</span>
            </div>
            <span className="text-[11px] text-slate-400">Click any zone or station to inspect details</span>
          </div>

          <MapComponent
            stations={stations}
            zones={zones}
            height="520px"
            onSelectZone={(zone) => setSelectedZone(zone)}
          />
        </div>

        {/* Priority Warnings & Selected Zone Inspection Panel (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Priority Alerts */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Priority Warning Queue</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                {priorityAlerts.length} Active
              </span>
            </div>

            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {priorityAlerts.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No unacknowledged warnings active.</p>
              ) : (
                priorityAlerts.map((alert) => (
                  <div
                    key={alert.alert_id}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 space-y-2 text-xs transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{alert.location}</span>
                      <StatusBadge level={alert.warning_level} size="sm" showPulse />
                    </div>

                    <p className="text-[11px] text-slate-300 leading-snug">{alert.hazard}</p>

                    <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 bg-slate-900/60 p-1.5 rounded">
                      <div>
                        <span>Lead Time:</span> <strong className="text-slate-200">{alert.lead_time_hours}h</strong>
                      </div>
                      <div>
                        <span>Max Depth:</span> <strong className="text-rose-400">{alert.expected_depth_m}m</strong>
                      </div>
                      <div>
                        <span>Reliability:</span> <strong className="text-emerald-400">{alert.reliability}</strong>
                      </div>
                      <div>
                        <span>Rainfall:</span> <strong className="text-brand-300">{alert.expected_rainfall_mm}mm</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => handleAcknowledge(alert.alert_id)}
                        className="px-2.5 py-1 rounded bg-brand-600/30 hover:bg-brand-600/50 text-brand-300 border border-brand-500/40 text-[11px] font-semibold transition-colors"
                      >
                        {t('acknowledge')}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Selected Location / Zone Inspection */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">Selected Basin Telemetry</span>
              {selectedZone ? (
                <StatusBadge level={selectedZone.risk_category} size="sm" />
              ) : (
                <span className="text-[10px] text-slate-500">Click map zone</span>
              )}
            </div>

            {selectedZone ? (
              <div className="space-y-2">
                <p className="font-bold text-slate-200 text-sm">{selectedZone.name}</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Predicted Depth</span>
                    <span className="font-bold text-rose-400 text-xs">{selectedZone.depth_range_label}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Inundation Area</span>
                    <span className="font-bold text-slate-200 text-xs">{selectedZone.predicted_inundation_km2} km²</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Terrain DEM</span>
                    <span className="font-bold text-slate-200 text-xs">{selectedZone.elevation_dem_m} m (MSL)</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Soil Saturation</span>
                    <span className="font-bold text-amber-400 text-xs">{selectedZone.soil_saturation_pct}%</span>
                  </div>
                </div>
                <div className="pt-1">
                  <span className="text-[10px] text-slate-400 block mb-1">Catchment Population Density</span>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-brand-500 h-full" style={{ width: '75%' }} />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{selectedZone.population_density_sqkm.toLocaleString()} / km²</span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500 space-y-1">
                <MapPin className="h-6 w-6 text-slate-600 mx-auto" />
                <p>Click on any catchment circle in the map to load hydrodynamic runoff diagnostics.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4 Professional Recharts Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Rainfall Trend (Observed vs Predicted) */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Chart 1: Rainfall Trend Analysis</h3>
              <p className="text-[11px] text-slate-400">Observed precipitation vs AI nowcasted trend (mm)</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-800">
              1-Hour Step
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartsData?.rainfall_trend || []}>
                <defs>
                  <linearGradient id="colorObserved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="mm" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="observed" name="Observed Rain (mm)" stroke="#0284c7" fillOpacity={1} fill="url(#colorObserved)" strokeWidth={2} />
                <Area type="monotone" dataKey="predicted" name="AI Prediction (mm)" stroke="#ea580c" fillOpacity={1} fill="url(#colorPredicted)" strokeWidth={2} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="nwp" name="NWP GFS Model (mm)" stroke="#10b981" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Multi-Horizon Forecast Comparison */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Chart 2: Multi-Horizon Forecast Comparison</h3>
              <p className="text-[11px] text-slate-400">Observed ground truth vs NWP GFS vs AI ConvRF (mm)</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
              Horizons 1h to 24h
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartsData?.forecast_comparison || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="horizon" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="mm" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="observed" name="Observed (mm)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="nwp" name="NWP Guidance (mm)" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ai_prediction" name="RainGuard AI (mm)" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Risk Level Distribution */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Chart 3: Regional Risk Distribution</h3>
              <p className="text-[11px] text-slate-400">Zone categorization across coastal basins</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              8 Catchments
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartsData?.risk_distribution || []}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
                  label={(entry: any) => `${entry.name}: ${entry.value ?? entry.count}`}
                >
                  {(chartsData?.risk_distribution || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Predicted Inundation Area vs Time */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Chart 4: Predicted Inundation Extent Curve</h3>
              <p className="text-[11px] text-slate-400">Catchment submergence area (km²) over 24-hour simulation</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
              Hydro2D
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartsData?.inundation_area_time || []}>
                <defs>
                  <linearGradient id="colorInundation" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="km²" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="inundation_km2" name="Total Inundated Area (km²)" stroke="#0d9488" fillOpacity={1} fill="url(#colorInundation)" strokeWidth={2} />
                <Line type="monotone" dataKey="critical_depth_km2" name="Critical Depth > 1.2m (km²)" stroke="#e11d48" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Responsible AI Disclaimer Policy */}
      <ResponsibleAIDisclaimer />
    </div>
  );
};
