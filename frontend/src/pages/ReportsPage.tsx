import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Download, Printer, Plus, CheckCircle2, ShieldAlert, Sparkles, Building, ArrowDownToLine } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { SituationReport } from '../types';
import apiClient from '../services/api';

export const ReportsPage: React.FC = () => {
  const { user } = useApp();

  const [reports, setReports] = useState<SituationReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notice, setNotice] = useState('');

  const fetchReports = async () => {
    try {
      const res = await apiClient.get('/api/reports');
      setReports(res.data);
      if (res.data.length > 0 && !selectedReport) {
        setSelectedReport(res.data[0]);
      }
    } catch (e) {
      console.warn('Reports error:', e);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const res = await apiClient.post('/api/reports/generate?region=Greater%20Chennai%20Metro%20Basin');
      setNotice(`Report ${res.data.report_id} generated successfully.`);
      setTimeout(() => setNotice(''), 4000);
      setSelectedReport(res.data);
      fetchReports();
    } catch (e) {
      console.warn(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-400" />
            <span>Reports & Situation Briefings</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated intelligence dossiers for State Emergency Operations Center (SEOC) and District Collectors.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md shadow-brand-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{isGenerating ? 'Synthesizing Intelligence...' : 'Generate New Briefing'}</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Reports Registry Table */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-white uppercase tracking-wider block">
          Archived Situation Briefings ({reports.length})
        </span>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-3">Report ID</th>
                <th className="py-2.5 px-3">Basin / Region</th>
                <th className="py-2.5 px-3">Generated Timestamp</th>
                <th className="py-2.5 px-3">Hazard Level</th>
                <th className="py-2.5 px-3">Risk Index</th>
                <th className="py-2.5 px-3">Reliability</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {reports.map((rep) => (
                <tr
                  key={rep.report_id}
                  onClick={() => setSelectedReport(rep)}
                  className={`cursor-pointer transition-colors ${
                    selectedReport?.report_id === rep.report_id ? 'bg-brand-950/40 text-brand-200' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-200">{rep.report_id}</td>
                  <td className="py-3 px-3 font-semibold text-white">{rep.region}</td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{rep.generated_at}</td>
                  <td className="py-3 px-3">
                    <StatusBadge level={rep.hazard_level} size="sm" />
                  </td>
                  <td className="py-3 px-3 font-mono text-orange-400 font-bold">{rep.risk_level}</td>
                  <td className="py-3 px-3 text-emerald-400 font-semibold">{rep.reliability}</td>
                  <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{rep.status}</td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReport(rep);
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                    >
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReport(rep);
                        setTimeout(handlePrint, 300);
                      }}
                      className="px-2 py-1 rounded bg-brand-600/30 hover:bg-brand-600/50 text-brand-300 border border-brand-500/40 text-[11px] font-semibold"
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Dossier Printable Document View */}
      {selectedReport && (
        <div id="printable-report" className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl text-xs print:bg-white print:text-black print:border-none print:shadow-none">
          {/* Document Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white print:text-black">RainGuard AI</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30 font-bold">
                  Innovexa Core
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 print:text-black">{selectedReport.title}</h3>
              <p className="text-slate-400 print:text-slate-600">
                Region: <strong className="text-slate-200 print:text-black">{selectedReport.region}</strong> | Generated: {selectedReport.generated_at}
              </p>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block print:text-black">
              1. Executive Incident Briefing
            </span>
            <p className="text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800 print:bg-slate-50 print:text-black print:border-slate-300">
              {selectedReport.executive_summary || selectedReport.summary}
            </p>
          </div>

          {/* Key Intelligence Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-300">
              <span className="text-slate-500 block text-[10px]">Hazard Level</span>
              <strong className="text-rose-400 font-mono text-sm print:text-red-700">{selectedReport.hazard_level}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-300">
              <span className="text-slate-500 block text-[10px]">Inundation Extent</span>
              <strong className="text-slate-200 font-mono text-sm print:text-black">24.15 km²</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-300">
              <span className="text-slate-500 block text-[10px]">Model Reliability</span>
              <strong className="text-emerald-400 font-mono text-sm print:text-green-700">{selectedReport.reliability}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-300">
              <span className="text-slate-500 block text-[10px]">Author / Duty Officer</span>
              <strong className="text-slate-300 font-medium text-xs print:text-black">{selectedReport.author}</strong>
            </div>
          </div>

          {/* Actionable Early Warnings */}
          <div className="space-y-2">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] block print:text-black">
              2. Mandatory Early Warning Protocols
            </span>
            <ul className="space-y-1.5 p-4 rounded-xl bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-300 text-slate-300 print:text-black">
              {(selectedReport.actionable_early_warnings || [
                "Mandatory evacuation of riverbank habitations along Jafferkhanpet and Saidapet.",
                "Continuous operation of heavy dewatering pumps at inundated subways.",
                "Relief shelter activation at Saidapet Community Center and Velachery Higher Secondary School."
              ]).map((w: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Responsible AI Disclaimer Policy on Report */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs space-y-1 text-slate-400 print:bg-slate-100 print:text-slate-700 print:border-slate-300">
            <p className="font-bold text-amber-300 print:text-amber-800">
              Decision-Support Advisory & Statutory Warning Notice
            </p>
            <p className="leading-relaxed">
              {selectedReport.responsible_ai_disclaimer || "RainGuard AI is an AI-based decision-support prototype. Predictions contain uncertainty and must be verified in conjunction with official directives from the India Meteorological Department (IMD) and State Disaster Management Authority."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
