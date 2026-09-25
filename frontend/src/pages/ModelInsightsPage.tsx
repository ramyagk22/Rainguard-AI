import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BrainCircuit, Cpu, Layers, ShieldAlert, CheckCircle2, Clock, Info } from 'lucide-react';
import apiClient from '../services/api';

export const ModelInsightsPage: React.FC = () => {
  const [modelInfo, setModelInfo] = useState<any>(null);

  useEffect(() => {
    apiClient.get('/api/models/info').then((res) => setModelInfo(res.data));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-brand-400" />
            <span>AI Architecture, Model Provenance & Insights</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Machine learning model architectures, training datasets, spatio-temporal resolutions, and documented limitations.
          </p>
        </div>

        <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 self-start sm:self-auto">
          Inference Latency: 145 ms
        </span>
      </div>

      {modelInfo && (
        <div className="space-y-6">
          {/* Model 1: ConvRF Spatiotemporal Rainfall Model */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-brand-400 uppercase font-bold">Atmospheric Nowcasting Core</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{modelInfo.rainfall_model.model_name}</h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-brand-950 text-brand-300 border border-brand-800 self-start sm:self-auto">
                Version: {modelInfo.rainfall_model.model_version}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
                  Architecture Specifications
                </span>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {modelInfo.rainfall_model.architecture_type}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Spatio-Temporal Resolution</span>
                    <strong className="text-slate-200 font-mono text-xs">{modelInfo.rainfall_model.input_resolution}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Inference Latency</span>
                    <strong className="text-emerald-400 font-mono text-xs">{modelInfo.rainfall_model.inference_latency_ms} ms</strong>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
                  Input Telemetry Features
                </span>
                <ul className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300">
                  {modelInfo.rainfall_model.input_features?.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Datasets Provenance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-800">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Training Dataset</span>
                <p className="text-slate-300 mt-1 font-medium">{modelInfo.rainfall_model.training_dataset}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Validation Set</span>
                <p className="text-slate-300 mt-1 font-medium">{modelInfo.rainfall_model.validation_dataset}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Extreme Test Benchmark</span>
                <p className="text-slate-300 mt-1 font-medium">{modelInfo.rainfall_model.test_dataset}</p>
              </div>
            </div>

            {/* Known Limitations */}
            <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs space-y-1.5">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5" /> Documented Physical & Sensor Limitations
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {modelInfo.rainfall_model.known_limitations?.map((lim: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model 2: Hydro2D Kinematic Runoff Engine */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-teal-400 uppercase font-bold">Hydrodynamic Inundation Core</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{modelInfo.inundation_model.model_name}</h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-teal-950 text-teal-300 border border-teal-800 self-start sm:self-auto">
                Version: {modelInfo.inundation_model.model_version}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
                  Hydrodynamic Formulation
                </span>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {modelInfo.inundation_model.architecture_type}
                </p>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 mt-2">
                  <span className="text-slate-500 block text-[10px]">Elevation Grid Resolution</span>
                  <strong className="text-slate-200 font-mono text-xs">{modelInfo.inundation_model.input_resolution}</strong>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block">
                  Geospatial & Topographic Inputs
                </span>
                <ul className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300">
                  {modelInfo.inundation_model.input_features?.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Inundation Limitations */}
            <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs space-y-1.5">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5" /> Catchment Assumptions & Constraints
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {modelInfo.inundation_model.known_limitations?.map((lim: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400">•</span>
                    <span>{lim}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
