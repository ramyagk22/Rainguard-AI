import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { StatusBadge } from './StatusBadge';
import { WeatherStation, InundationZone, StatusLevel } from '../../types';
import { Layers, Droplets, ShieldAlert, Radio, Eye, Info, Sliders } from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Custom SVG marker icons for Leaflet without broken image links
const createCustomIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        color: white;
        border: 2px solid white;
        border-radius: 9999px;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: bold;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
      ">
        ${label}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

const stationIcon = createCustomIcon('#0284c7', '⚡');
const criticalZoneIcon = createCustomIcon('#dc2626', '⚠');
const severeZoneIcon = createCustomIcon('#ea580c', '🌊');
const alertZoneIcon = createCustomIcon('#d97706', '▲');

interface MapProps {
  stations?: WeatherStation[];
  zones?: InundationZone[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onSelectZone?: (zone: InundationZone) => void;
  onSelectStation?: (station: WeatherStation) => void;
  enableLayerControls?: boolean;
}

export const MapComponent: React.FC<MapProps> = ({
  stations = [],
  zones = [],
  center = [13.0400, 80.2200], // Chennai Basin
  zoom = 11,
  height = '500px',
  onSelectZone,
  onSelectStation,
  enableLayerControls = true
}) => {
  const { lowBandwidthMode } = useApp();
  
  // Layer visibility toggles
  const [showRadar, setShowRadar] = useState(true);
  const [showStations, setShowStations] = useState(true);
  const [showInundation, setShowInundation] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  const [radarOpacity, setRadarOpacity] = useState(0.45);

  // Adyar and Cooum River coordinates
  const adyarRiverCoords: [number, number][] = [
    [13.0119, 80.0575], // Chembarambakkam
    [13.0180, 80.1450], // Porur / Ramapuram
    [13.0198, 80.2215], // Saidapet
    [13.0120, 80.2550], // Kotturpuram
    [13.0080, 80.2720]  // Adyar estuary
  ];

  const cooumRiverCoords: [number, number][] = [
    [13.0720, 80.1200], // Koyambedu
    [13.0740, 80.1900], // Aminjikarai
    [13.0710, 80.2500], // Egmore
    [13.0650, 80.2850]  // Marina mouth
  ];

  const getRiskColor = (level: StatusLevel) => {
    switch (level) {
      case 'CRITICAL': return '#dc2626';
      case 'SEVERE': return '#ea580c';
      case 'ALERT': return '#d97706';
      case 'WATCH': return '#f59e0b';
      default: return '#0284c7';
    }
  };

  return (
    <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 shadow-inner" style={{ height }}>
      {/* Interactive Layer & Opacity Control Bar */}
      {enableLayerControls && (
        <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 shadow-xl text-xs space-y-2 max-w-[220px]">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200 border-b border-slate-800 pb-1.5">
            <Layers className="h-3.5 w-3.5 text-brand-400" />
            <span>GIS Map Layers</span>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={showStations}
                onChange={(e) => setShowStations(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-brand-600 focus:ring-0"
              />
              <span>Weather Stations ({stations.length})</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={showInundation}
                onChange={(e) => setShowInundation(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-brand-600 focus:ring-0"
              />
              <span>Inundation Zones ({zones.length})</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={showRivers}
                onChange={(e) => setShowRivers(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-brand-600 focus:ring-0"
              />
              <span>Rivers & Canal Basin</span>
            </label>

            {!lowBandwidthMode && (
              <label className="flex items-center gap-2 text-slate-300 hover:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={showRadar}
                  onChange={(e) => setShowRadar(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-brand-600 focus:ring-0"
                />
                <span>Radar Reflectivity</span>
              </label>
            )}
          </div>

          {showRadar && !lowBandwidthMode && (
            <div className="pt-1.5 border-t border-slate-800">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Radar Opacity</span>
                <span>{Math.round(radarOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={radarOpacity}
                onChange={(e) => setRadarOpacity(parseFloat(e.target.value))}
                className="w-full accent-brand-500 h-1 bg-slate-800 rounded"
              />
            </div>
          )}
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 shadow-xl text-xs space-y-1.5 pointer-events-auto max-w-[200px]">
        <span className="font-semibold text-slate-300 text-[11px] block border-b border-slate-800 pb-1">
          Hazard Severity Index
        </span>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
            <span className="text-slate-300">CRITICAL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-300">SEVERE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-300">ALERT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
            <span className="text-slate-300">WATCH</span>
          </div>
        </div>
      </div>

      {/* Leaflet Map Container */}
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} zoomControl={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={
            lowBandwidthMode
              ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />

        {/* Rivers and Canals */}
        {showRivers && (
          <>
            <Polyline
              positions={adyarRiverCoords}
              pathOptions={{ color: '#0284c7', weight: 4, opacity: 0.85, dashArray: '6, 6' }}
            />
            <Polyline
              positions={cooumRiverCoords}
              pathOptions={{ color: '#0ea5e9', weight: 3, opacity: 0.85 }}
            />
          </>
        )}

        {/* Simulated Doppler Radar High-Reflectivity Swath */}
        {showRadar && !lowBandwidthMode && (
          <>
            <Circle
              center={[13.02, 80.22]}
              radius={7500}
              pathOptions={{
                color: '#dc2626',
                fillColor: '#ef4444',
                fillOpacity: radarOpacity,
                weight: 1
              }}
            />
            <Circle
              center={[12.98, 80.20]}
              radius={4500}
              pathOptions={{
                color: '#ea580c',
                fillColor: '#f97316',
                fillOpacity: radarOpacity * 1.2,
                weight: 1
              }}
            />
          </>
        )}

        {/* Inundation Zones */}
        {showInundation &&
          zones.map((zone) => {
            const color = getRiskColor(zone.risk_category);
            const radius = Math.max(1200, Math.sqrt(zone.predicted_inundation_km2) * 900);
            return (
              <React.Fragment key={zone.zone_id}>
                <Circle
                  center={[zone.center_lat, zone.center_lon]}
                  radius={radius}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.35,
                    weight: 2
                  }}
                  eventHandlers={{
                    click: () => onSelectZone && onSelectZone(zone)
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-2 space-y-1.5 text-xs text-slate-800">
                      <div className="flex items-center justify-between gap-2 border-b pb-1">
                        <span className="font-bold text-slate-900">{zone.name}</span>
                        <StatusBadge level={zone.risk_category} size="sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px]">
                        <div>
                          <span className="text-slate-500 block">Predicted Depth:</span>
                          <span className="font-semibold text-rose-700">{zone.depth_range_label}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Inundation Area:</span>
                          <span className="font-semibold text-slate-800">{zone.predicted_inundation_km2} km²</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Elevation (DEM):</span>
                          <span className="font-medium text-slate-800">{zone.elevation_dem_m} m</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Reliability:</span>
                          <span className="font-semibold text-emerald-700">{zone.prediction_reliability}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 pt-1">Click to analyze explainability attributions</p>
                    </div>
                  </Popup>
                </Circle>
                <Marker
                  position={[zone.center_lat, zone.center_lon]}
                  icon={
                    zone.risk_category === 'CRITICAL'
                      ? criticalZoneIcon
                      : zone.risk_category === 'SEVERE'
                      ? severeZoneIcon
                      : alertZoneIcon
                  }
                  eventHandlers={{
                    click: () => onSelectZone && onSelectZone(zone)
                  }}
                />
              </React.Fragment>
            );
          })}

        {/* Weather Stations */}
        {showStations &&
          stations.map((st) => (
            <Marker
              key={st.station_id}
              position={[st.latitude, st.longitude]}
              icon={stationIcon}
              eventHandlers={{
                click: () => onSelectStation && onSelectStation(st)
              }}
            >
              <Popup>
                <div className="p-2 space-y-1.5 text-xs text-slate-800">
                  <div className="flex items-center justify-between border-b pb-1 gap-2">
                    <span className="font-bold text-slate-900">{st.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-mono">
                      {st.station_id}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">1h Rainfall:</span>
                      <span className="font-bold text-sky-700">{st.rainfall_1h_mm} mm</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">3h Rainfall:</span>
                      <span className="font-bold text-sky-700">{st.rainfall_3h_mm} mm</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Water Stage:</span>
                      <span className="font-bold text-slate-800">
                        {st.water_level_m !== null ? `${st.water_level_m} m` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Data Quality:</span>
                      <span className="font-semibold text-emerald-700">{st.data_quality}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 pt-1">Last Telemetry: {st.last_updated}</p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
};
