import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';

// Import All 18 Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { RainfallForecastPage } from './pages/RainfallForecastPage';
import { InundationPage } from './pages/InundationPage';
import { RiskMapPage } from './pages/RiskMapPage';
import { AlertManagementPage } from './pages/AlertManagementPage';
import { EmergencyResponsePage } from './pages/EmergencyResponsePage';
import { ExplainableAIPage } from './pages/ExplainableAIPage';
import { ReliabilityPage } from './pages/ReliabilityPage';
import { EarlyWarningPage } from './pages/EarlyWarningPage';
import { HistoricalAnalysisPage } from './pages/HistoricalAnalysisPage';
import { ForecastVsObservedPage } from './pages/ForecastVsObservedPage';
import { ModelInsightsPage } from './pages/ModelInsightsPage';
import { ReportsPage } from './pages/ReportsPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { SettingsPage } from './pages/SettingsPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/dashboard': return 'Command Center Dashboard';
      case '/live-monitoring': return 'Live Weather & Radar Monitoring';
      case '/rainfall-forecast': return 'AI Rainfall Prediction';
      case '/inundation': return 'AI Inundation Depth Prediction';
      case '/risk-map': return 'Full-Screen GIS Risk Map';
      case '/alerts': return 'Alert Management & Audit Log';
      case '/emergency-response': return 'Emergency Operations Dashboard';
      case '/explainable-ai': return 'Explainable AI (XAI) Attribution';
      case '/reliability': return 'AI Decision-Support Reliability';
      case '/early-warning': return 'Early Warning Center';
      case '/historical': return 'Historical Flood Benchmarks';
      case '/forecast-vs-observed': return 'Forecast vs Observed Validation';
      case '/model-insights': return 'Model Insights & Provenance';
      case '/reports': return 'Situation Briefings & Reports';
      case '/data-sources': return 'Data Sources & Quality Monitor';
      case '/settings': return 'System Settings';
      default: return 'RainGuard AI';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-sans text-slate-100">
      {/* Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          title={getPageTitle(location.pathname)}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Login Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Authenticated Application Command Center Views */}
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            }
          />
          <Route
            path="/live-monitoring"
            element={
              <AppLayout>
                <LiveMonitoringPage />
              </AppLayout>
            }
          />
          <Route
            path="/rainfall-forecast"
            element={
              <AppLayout>
                <RainfallForecastPage />
              </AppLayout>
            }
          />
          <Route
            path="/inundation"
            element={
              <AppLayout>
                <InundationPage />
              </AppLayout>
            }
          />
          <Route
            path="/risk-map"
            element={
              <AppLayout>
                <RiskMapPage />
              </AppLayout>
            }
          />
          <Route
            path="/alerts"
            element={
              <AppLayout>
                <AlertManagementPage />
              </AppLayout>
            }
          />
          <Route
            path="/emergency-response"
            element={
              <AppLayout>
                <EmergencyResponsePage />
              </AppLayout>
            }
          />
          <Route
            path="/explainable-ai"
            element={
              <AppLayout>
                <ExplainableAIPage />
              </AppLayout>
            }
          />
          <Route
            path="/reliability"
            element={
              <AppLayout>
                <ReliabilityPage />
              </AppLayout>
            }
          />
          <Route
            path="/early-warning"
            element={
              <AppLayout>
                <EarlyWarningPage />
              </AppLayout>
            }
          />
          <Route
            path="/historical"
            element={
              <AppLayout>
                <HistoricalAnalysisPage />
              </AppLayout>
            }
          />
          <Route
            path="/forecast-vs-observed"
            element={
              <AppLayout>
                <ForecastVsObservedPage />
              </AppLayout>
            }
          />
          <Route
            path="/model-insights"
            element={
              <AppLayout>
                <ModelInsightsPage />
              </AppLayout>
            }
          />
          <Route
            path="/reports"
            element={
              <AppLayout>
                <ReportsPage />
              </AppLayout>
            }
          />
          <Route
            path="/data-sources"
            element={
              <AppLayout>
                <DataSourcesPage />
              </AppLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
