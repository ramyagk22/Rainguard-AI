import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, CheckCircle2, Flame, XCircle, History, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { EarlyWarningAlert, AuditRecord } from '../types';
import apiClient from '../services/api';

export const AlertManagementPage: React.FC = () => {
  const { t } = useApp();

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'ACKNOWLEDGED' | 'EXPIRED' | 'ALL'>('ACTIVE');
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<EarlyWarningAlert | null>(null);
  const [actionNotice, setActionNotice] = useState('');

  const fetchAlertsAndAudit = async () => {
    try {
      const [alRes, audRes] = await Promise.all([
        apiClient.get(`/api/alerts?status=${activeTab}`),
        apiClient.get('/api/alerts/audit-trail')
      ]);
      setAlerts(alRes.data);
      setAuditLogs(audRes.data);
    } catch (e) {
      console.warn('Alert fetch error:', e);
    }
  };

  useEffect(() => {
    fetchAlertsAndAudit();
  }, [activeTab]);

  const handleAction = async (action: 'acknowledge' | 'escalate' | 'close', alertId: string) => {
    try {
      await apiClient.post(`/api/alerts/${alertId}/${action}`);
      setActionNotice(`Action '${action.toUpperCase()}' applied to ${alertId}.`);
      setTimeout(() => setActionNotice(''), 4000);
      fetchAlertsAndAudit();
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-brand-400" />
            <span>Alert Management & Audit Log Surveillance</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch triage, operational acknowledgements, level escalation, and immutable operator audit logs.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-semibold">
          {(['ACTIVE', 'ACKNOWLEDGED', 'EXPIRED', 'ALL'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === tab ? 'bg-brand-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Alerts Table */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Operational Alerts Registry ({alerts.length})
          </span>
          <span className="text-[10px] text-slate-500 font-mono">All actions generate signed audit trails</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-3">Alert ID</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Hazard</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Issued</th>
                <th className="py-2.5 px-3">Expires</th>
                <th className="py-2.5 px-3">Reliability</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-slate-500">
                    No alerts in this status filter.
                  </td>
                </tr>
              ) : (
                alerts.map((al) => (
                  <tr key={al.alert_id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono font-bold text-slate-200">{al.alert_id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-200">{al.location}</td>
                    <td className="py-3 px-3 text-slate-300 max-w-[200px] truncate">{al.hazard}</td>
                    <td className="py-3 px-3">
                      <StatusBadge level={al.warning_level} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{al.issued_at}</td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{al.expires_at}</td>
                    <td className="py-3 px-3 text-emerald-400 font-semibold">{al.reliability}</td>
                    <td className="py-3 px-3 font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded ${
                        al.status === 'ACTIVE' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        al.status === 'ACKNOWLEDGED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {al.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                      {al.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleAction('acknowledge', al.alert_id)}
                          className="px-2 py-1 rounded bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 text-[11px] font-semibold"
                        >
                          Ack
                        </button>
                      )}
                      {al.warning_level !== 'CRITICAL' && al.status !== 'CLOSED' && (
                        <button
                          onClick={() => handleAction('escalate', al.alert_id)}
                          className="px-2 py-1 rounded bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-[11px] font-semibold"
                        >
                          Escalate
                        </button>
                      )}
                      {al.status !== 'CLOSED' && (
                        <button
                          onClick={() => handleAction('close', al.alert_id)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                        >
                          Close
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operator Audit Trail History */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <History className="h-4 w-4 text-brand-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Immutable Operations Audit Log
          </h3>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
          {auditLogs.map((log, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-brand-400 font-bold">{log.action}</span>
                  <span className="text-slate-200 font-semibold">{log.details}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Target: {log.target_id} <span className="text-slate-600">|</span> User: {log.user_email} ({log.user_role})
                </p>
              </div>

              <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
