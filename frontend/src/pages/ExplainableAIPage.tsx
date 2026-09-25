import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowUpRight, ArrowDownRight, Info, ShieldAlert, Sliders } from 'lucide-react';
import { FeatureAttribution } from '../types';
import apiClient from '../services/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

export const ExplainableAIPage: React.FC = () => {
  const [explainType, setExplainType] = useState<'rainfall' | 'inundation'>('rainfall');
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExplanation = async () => {
    setIsLoading(true);
    try {
      const endpoint = explainType === 'rainfall' ? '/api/xai/explain-rainfall' : '/api/xai/explain-inundation';
      const res = await apiClient.post(endpoint, {});
      setReport(res.data);
    } catch (e) {
      console.warn('XAI error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExplanation();
  }, [explainType]);

  const chartData = report?.feature_attributions?.map((attr: FeatureAttribution) => ({
    name: attr.feature_name.split(' (')[0],
    fullName: attr.feature_name,
    score: attr.contribution_score,
    direction: attr.impact_direction,
    percentage: attr.attribution_percentage,
    value: attr.feature_value
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-400" />
            <span>Explainable AI (XAI) Attribution Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            "Why is the system predicting this risk?" — Shapley value marginal attributions quantifying feature influence.
          </p>
        </div>

        {/* Toggle between Rainfall & Inundation Model Explanations */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setExplainType('rainfall')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              explainType === 'rainfall' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Rainfall Nowcast Model
          </button>
          <button
            onClick={() => setExplainType('inundation')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              explainType === 'inundation' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Inundation Depth Model
          </button>
        </div>
      </div>

      {/* Mandatory Scientific Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 text-brand-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1 text-slate-300">
            <p className="font-semibold text-brand-300">
              Scientific Attribution Methodology: {report?.methodology || 'SHAP TreeExplainer & Kernel Approximation'}
            </p>
            <p className="italic text-slate-300">
              "{report?.scientific_disclaimer || 'Highlighted features represent variables that contributed to the model output. Model attribution indicates association with the model output and should not be interpreted as proof of physical causation.'}"
            </p>
          </div>
        </div>
      </div>

      {/* Top Prediction Summary */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Baseline Unperturbed Reference</span>
            <span className="text-2xl font-extrabold text-slate-300 font-mono mt-1 block">
              {report.base_value} {explainType === 'rainfall' ? 'mm/h' : 'm'}
            </span>
            <span className="text-[10px] text-slate-500">Calm monsoonal conditions baseline</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Model Predicted Output</span>
            <span className="text-2xl font-extrabold text-orange-400 font-mono mt-1 block">
              {report.predicted_value} {explainType === 'rainfall' ? 'mm/h' : 'm'}
            </span>
            <span className="text-[10px] text-orange-400/90 font-medium">Under active synoptic forcing</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Net Attribution Delta (SHAP Sum)</span>
            <span className="text-2xl font-extrabold text-rose-400 font-mono mt-1 block">
              +{(report.predicted_value - report.base_value).toFixed(2)} {explainType === 'rainfall' ? 'mm/h' : 'm'}
            </span>
            <span className="text-[10px] text-slate-400">Total marginal increase from reference</span>
          </div>
        </div>
      )}

      {/* SHAP Waterfall / Bar Attribution Chart */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              SHAP Feature Attribution Values (Δ Marginal Contribution)
            </h3>
            <p className="text-[11px] text-slate-400">
              Positive values push the prediction toward higher flood hazard; negative values provide drainage relief.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-800">
            SHAP (Shapley Additive exPlanations)
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" tick={{ fontSize: 11 }} width={140} />
              <Tooltip
                formatter={(val: any, name: any, item: any) => [`${val} (${item.payload.value})`, 'SHAP Score']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
              />
              <ReferenceLine x={0} stroke="#475569" strokeWidth={1.5} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                {chartData.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.score > 0 ? '#ea580c' : '#0d9488'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Feature Attributions Table with Physical Interpretations */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Physical Parameter Interpretations
        </h3>
        <div className="space-y-2.5">
          {report?.feature_attributions?.map((attr: FeatureAttribution, idx: number) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100">{attr.feature_name}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    Value: {attr.feature_value}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{attr.physical_meaning}</p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
                <span
                  className={`flex items-center gap-1 font-mono font-bold text-xs ${
                    attr.contribution_score > 0 ? 'text-orange-400' : 'text-teal-400'
                  }`}
                >
                  {attr.contribution_score > 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {attr.contribution_score > 0 ? '+' : ''}
                  {attr.contribution_score}
                </span>

                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                  {attr.attribution_percentage}% share
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
