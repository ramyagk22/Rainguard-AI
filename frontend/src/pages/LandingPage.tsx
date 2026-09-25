import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  CloudRain,
  Radio,
  Layers,
  Activity,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Sparkles,
  MapPin,
  Waves,
  Zap,
  Globe2,
  FileCheck2,
  AlertTriangle,
  Server,
  Database
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { ResponsibleAIDisclaimer } from '../components/common/ResponsibleAIDisclaimer';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { language, setLanguage, t } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <CloudRain className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">RainGuard</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">AI</span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Built by Innovexa</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#technology" className="hover:text-white transition-colors">Technology</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#responsible-ai" className="hover:text-white transition-colors">Responsible AI</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-md p-0.5 text-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded transition-colors ${language === 'en' ? 'bg-brand-600 text-white font-bold' : 'text-slate-400'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-2 py-1 rounded transition-colors ${language === 'ta' ? 'bg-brand-600 text-white font-bold' : 'text-slate-400'}`}
              >
                தமிழ்
              </button>
            </div>

            <NavLink
              to="/login"
              className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </NavLink>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-700/40 text-brand-300 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-brand-400" />
              <span>Competition-Ready Disaster Early Warning Prototype</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              AI-Powered Early Warning for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-300 to-teal-300">Heavy Rainfall & Inundation</span>
            </h1>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
              "Integrating satellite, radar, weather observations and numerical weather prediction data to transform rainfall intelligence into actionable flood-risk information."
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <NavLink
                to="/dashboard"
                className="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2"
              >
                <span>Launch Command Center</span>
                <ArrowRight className="h-4 w-4" />
              </NavLink>

              <a
                href="#how-it-works"
                className="px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm transition-all"
              >
                How It Works
              </a>
            </div>

            {/* System Status Card */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-md max-w-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  System Operational Status
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                  Ready for Benchmarking
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Data Sources</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Connected
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Prediction Engine</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Ready
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Risk Engine</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Ready
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Warning Engine</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-4 border border-slate-800 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500 animate-pulse" />
                  <span className="font-bold text-slate-200">Tamil Nadu Coastal Inundation Swath</span>
                </div>
                <StatusBadge level="SEVERE" size="sm" showPulse />
              </div>

              {/* Graphical radar / geospatial display */}
              <div className="relative h-64 rounded-lg bg-slate-950 border border-slate-800/80 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                
                {/* Simulated Radar rings */}
                <div className="absolute w-52 h-52 rounded-full border border-sky-500/20 animate-pulse" />
                <div className="absolute w-36 h-36 rounded-full border border-orange-500/30" />
                <div className="absolute w-20 h-20 rounded-full border border-rose-500/40 bg-rose-950/20" />

                {/* Markers */}
                <div className="absolute top-12 left-16 flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 rounded px-2 py-1 text-[10px] shadow">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="font-semibold text-slate-200">Saidapet Adyar (1.45m)</span>
                </div>

                <div className="absolute bottom-14 right-12 flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 rounded px-2 py-1 text-[10px] shadow">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="font-semibold text-slate-200">Velachery Basin (1.15m)</span>
                </div>

                <div className="absolute top-8 right-16 flex items-center gap-1.5 bg-slate-900/90 border border-slate-700 rounded px-2 py-1 text-[10px] shadow">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  <span className="font-semibold text-slate-200">DWR Chennai S-Band</span>
                </div>

                <div className="z-10 text-center p-3">
                  <p className="text-xs font-mono text-brand-400">RainGuard AI Telemetry Grid</p>
                  <p className="text-[11px] text-slate-400">1 km² Resolution Spatiotemporal Nowcast</p>
                </div>
              </div>

              {/* Bottom mini-bar */}
              <div className="mt-3 grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-xs">
                <div className="p-2 rounded bg-slate-900/60">
                  <span className="text-[10px] text-slate-500 block">Peak Rain</span>
                  <span className="font-bold text-brand-300">46.2 mm/h</span>
                </div>
                <div className="p-2 rounded bg-slate-900/60">
                  <span className="text-[10px] text-slate-500 block">Lead Time</span>
                  <span className="font-bold text-amber-300">4.5 Hours</span>
                </div>
                <div className="p-2 rounded bg-slate-900/60">
                  <span className="text-[10px] text-slate-500 block">Reliability</span>
                  <span className="font-bold text-emerald-400">88.4% (High)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge Section */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Operational Hurdles</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">The Challenge</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Modern heavy rainfall disasters overwhelm traditional static forecasting frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
              <div className="h-10 w-10 rounded-lg bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400">
                <CloudRain className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">Extreme Rainfall</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Short-duration intense cloudbursts rapidly increase urban flash flood and canal inundation risk before manual bulletins can issue.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
              <div className="h-10 w-10 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400">
                <Database className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">Fragmented Data</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Weather radar, geostationary satellite, rain gauges, and numerical predictions reside in disparate silos with varying latency and schemas.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
              <div className="h-10 w-10 rounded-lg bg-orange-950/60 border border-orange-800/40 flex items-center justify-center text-orange-400">
                <Waves className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">Rapid Local Impacts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rainfall and water levels can change drastically over 15 to 30 minutes, turning low-lying arterial roads and subways into critical traps.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors space-y-3">
              <div className="h-10 w-10 rounded-lg bg-sky-950/60 border border-sky-800/40 flex items-center justify-center text-sky-400">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">Limited Decision Time</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Disaster authorities need timely, explainable, and reliable information with actionable lead-time for evacuation and pump deployment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution Workflow */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2 max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Core Product Story</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">The RainGuard AI Pipeline</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            An uninterrupted 8-stage intelligence workflow transforming multi-source observations into life-saving response decisions.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold">
          {[
            { step: 'OBSERVE', desc: 'Satellite, Radar, AWS, Gauges' },
            { step: 'FUSE', desc: 'Spatiotemporal QC Fusion' },
            { step: 'PREDICT', desc: 'ConvRF Rainfall Nowcast' },
            { step: 'ASSESS', desc: 'Hydro2D Inundation Depth' },
            { step: 'EXPLAIN', desc: 'SHAP Feature Attribution' },
            { step: 'WARN', desc: 'Multi-Threshold Advisory' },
            { step: 'RESPOND', desc: 'Shelters & Pump Operations' },
            { step: 'TRACK', desc: 'Historical Benchmarks' }
          ].map((item, idx) => (
            <React.Fragment key={item.step}>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center min-w-[120px] shadow-sm">
                <span className="text-brand-400 font-mono text-[10px] block font-bold">0{idx + 1}</span>
                <span className="text-white font-bold block">{item.step}</span>
                <span className="text-[10px] text-slate-400 block font-normal">{item.desc}</span>
              </div>
              {idx < 7 && <span className="text-slate-600 font-bold hidden md:inline">→</span>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* 12 Features Grid */}
      <section id="features" className="py-16 bg-slate-900/30 border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">Comprehensive Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">12 Core System Features</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Engineered for state disaster centers, municipal corporations, and hydrometeorological analysts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[
              { title: '1. Multi-Source Weather Data Fusion', desc: 'Integrates geostationary INSAT-3DR, Doppler radar, ground AWS, and numerical models.' },
              { title: '2. AI Rainfall Prediction', desc: 'Nowcasts precipitation from 1h to 24h with convective storm tracking algorithms.' },
              { title: '3. Inundation Prediction', desc: 'Calculates overland runoff, water depth ranges, and extent using DEM and catchment slope.' },
              { title: '4. Interactive Risk Maps', desc: 'Full GIS layer visualization with population exposure and infrastructure vulnerability.' },
              { title: '5. Explainable AI (XAI)', desc: 'Computes SHAP feature importance showing why the model predicts severe flood risk.' },
              { title: '6. Reliability Indicators', desc: 'Calculates quantitative decision-support reliability scores from HIGH to LOW.' },
              { title: '7. Early Warning Generation', desc: 'Issues multi-level advisories with lead times and actionable emergency instructions.' },
              { title: '8. Historical Event Analysis', desc: 'Chronicles past mega-floods (Chennai 2015, Michaung 2023) with phased timelines.' },
              { title: '9. Low-Bandwidth Support', desc: 'One-click toggle reducing heavy tile requests and simplifying charts during field outages.' },
              { title: '10. Offline IndexedDB Capability', desc: 'PWA service worker queues operator actions locally and syncs automatically when online.' },
              { title: '11. Tamil + English Bilingual', desc: 'Seamless full-application language localization for localized ground emergency personnel.' },
              { title: '12. Complete Data Provenance', desc: 'Zero fabricated metrics; clear labeling of demo benchmarks and sensor latencies.' },
            ].map((f, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-brand-300 block">{f.title}</span>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Architecture Section */}
      <section id="technology" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-2 max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Technical Foundation</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">System Architecture</h2>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-xs">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono">SATELLITE (INSAT-3DR)</span>
            <span className="text-slate-600 font-bold">+</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono">RADAR (DWR S-BAND)</span>
            <span className="text-slate-600 font-bold">+</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono">GROUND RAIN GAUGES</span>
            <span className="text-slate-600 font-bold">+</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono">NWP (GFS/ECMWF)</span>
            <span className="text-slate-600 font-bold">+</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 font-mono">TERRAIN / DEM</span>
          </div>

          <div className="text-center text-slate-500 font-bold text-sm">↓</div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="px-4 py-2 rounded-lg bg-brand-950 text-brand-300 border border-brand-700 font-bold">DATA QUALITY CONTROL & FUSION ENGINE</span>
            <span className="text-slate-500 font-bold">→</span>
            <span className="px-4 py-2 rounded-lg bg-sky-950 text-sky-300 border border-sky-700 font-bold">AI RAINFALL PREDICTION (ConvRF)</span>
            <span className="text-slate-500 font-bold">→</span>
            <span className="px-4 py-2 rounded-lg bg-teal-950 text-teal-300 border border-teal-700 font-bold">HYDRO2D INUNDATION ENGINE</span>
          </div>

          <div className="text-center text-slate-500 font-bold text-sm">↓</div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-purple-950 text-purple-300 border border-purple-800 font-semibold">EXPLAINABLE AI (SHAP)</span>
            <span className="text-slate-500 font-bold">+</span>
            <span className="px-3 py-1.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 font-semibold">RELIABILITY INDEX</span>
            <span className="text-slate-500 font-bold">→</span>
            <span className="px-3 py-1.5 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 font-bold">ACTIONABLE EARLY WARNING CENTER</span>
          </div>
        </div>
      </section>

      {/* Responsible AI Section */}
      <section id="responsible-ai" className="py-12 bg-slate-900/60 border-t border-slate-800 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <ResponsibleAIDisclaimer />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-400">RainGuard AI — Built with excellence by Team Innovexa</p>
        <p>"From Rainfall Intelligence to Actionable Flood Warnings."</p>
        <p className="text-[11px] text-slate-600">Prototype Decision-Support System for Evaluation and Competition Benchmarking.</p>
      </footer>
    </div>
  );
};
