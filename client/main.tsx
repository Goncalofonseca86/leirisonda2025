import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./global.css";

// Components
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProviderFixed } from "./components/AuthProviderFixed";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

// Pages
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { WorksList } from "./pages/WorksList";
import { WorkDetail } from "./pages/WorkDetail";
import { CreateWork } from "./pages/CreateWork";
import { EditWork } from "./pages/EditWork";
import { CreateUser } from "./pages/CreateUser";
import { UsersList } from "./pages/UsersList";
import { EditUser } from "./pages/EditUser";
import { UserDataManager } from "./pages/UserDataManager";
import { PoolMaintenancePage } from "./pages/PoolMaintenance";
import { MaintenanceList } from "./pages/MaintenanceList";
import { CreateMaintenance } from "./pages/CreateMaintenance";
import { MaintenanceDetail } from "./pages/MaintenanceDetail";
import { CreateIntervention } from "./pages/CreateIntervention";
import { NewMaintenanceSelector } from "./pages/NewMaintenanceSelector";
import { MobileDeploy } from "./pages/MobileDeploy";
import { SystemStatus } from "./pages/SystemStatus";
import { UserSyncDiagnostic } from "./pages/UserSyncDiagnostic";
import { DebugWorks } from "./pages/DebugWorks";
import { SyncMonitor } from "./pages/SyncMonitor";
import SyncDiagnostic from "./pages/SyncDiagnostic";
import { NotFound } from "./pages/NotFound";
import { EmergencyDiagnostic } from "./pages/EmergencyDiagnostic";
import { NotificationSettingsPage } from "./pages/NotificationSettingsPage";
import NotificationTest from "./pages/NotificationTest";
import { NotificationDiagnostic } from "./pages/NotificationDiagnostic";
import { LoginDirect } from "./pages/LoginDirect";
import { MobileLogin } from "./pages/MobileLogin";

function App() {
  console.log("🚀 App component iniciando com AuthProvider corrigido...");

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProviderFixed>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/login-direct" element={<LoginDirect />} />
            <Route path="/mobile-login" element={<MobileLogin />} />
            <Route path="/system-status" element={<SystemStatus />} />
            <Route
              path="/emergency-diagnostic"
              element={<EmergencyDiagnostic />}
            />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="works" element={<WorksList />} />
              <Route path="works/:id" element={<WorkDetail />} />
              <Route path="create-work" element={<CreateWork />} />
              <Route path="edit-work/:id" element={<EditWork />} />
              <Route path="users" element={<UsersList />} />
              <Route path="create-user" element={<CreateUser />} />
              <Route path="edit-user/:id" element={<EditUser />} />
              <Route path="user-data" element={<UserDataManager />} />
              <Route
                path="user-sync-diagnostic"
                element={<UserSyncDiagnostic />}
              />
              <Route path="debug-works" element={<DebugWorks />} />
              <Route path="sync-monitor" element={<SyncMonitor />} />
              <Route path="sync-diagnostic" element={<SyncDiagnostic />} />
              <Route path="pool-maintenance" element={<MaintenanceList />} />
              <Route
                path="create-maintenance"
                element={<CreateMaintenance />}
              />
              <Route path="maintenance/:id" element={<MaintenanceDetail />} />
              <Route
                path="maintenance/:maintenanceId/new-intervention"
                element={<CreateIntervention />}
              />
              <Route
                path="maintenance/new-general"
                element={<NewMaintenanceSelector />}
              />
              <Route path="mobile-deploy" element={<MobileDeploy />} />
              <Route
                path="old-pool-maintenance"
                element={<PoolMaintenancePage />}
              />
              <Route
                path="notification-settings"
                element={<NotificationSettingsPage />}
              />
              <Route path="notification-test" element={<NotificationTest />} />
              <Route
                path="notification-diagnostic"
                element={<NotificationDiagnostic />}
              />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProviderFixed>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

// Inicialização com proteção contra múltiplos roots
const initializeApp = () => {
  try {
    console.log("🚀 Starting Leirisonda com AuthProvider corrigido...");

    // Verify DOM is ready
    if (document.readyState === "loading") {
      console.log("⏳ DOM still loading, waiting...");
      document.addEventListener("DOMContentLoaded", initializeApp);
      return;
    }

    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }

    // Check for React availability
    if (!React || !ReactDOM) {
      throw new Error("React or ReactDOM not available");
    }

    // Clear any previous content
    rootElement.innerHTML = "";

    // Verificar se já existe um root (para HMR)
    let root;
    if (!(window as any).__react_root__) {
      root = ReactDOM.createRoot(rootElement);
      (window as any).__react_root__ = root;
      console.log("✅ Novo root criado");
    } else {
      root = (window as any).__react_root__;
      console.log("✅ Usando root existente (HMR)");
    }

    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );

    console.log("✅ Leirisonda carregado com AuthProvider corrigido!");
  } catch (error) {
    console.error("❌ Error loading app:", error);
    showFallbackError(error);
  }
};

const showFallbackError = (error: any) => {
  console.error("💥 Showing fallback error interface");

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    document.body.innerHTML = createErrorHTML(error);
    return;
  }

  rootElement.innerHTML = createErrorHTML(error);
};

const createErrorHTML = (error: any) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return `
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f9fafb; padding: 1rem; font-family: system-ui, -apple-system, sans-serif;">
      <div style="max-width: 32rem; width: 100%; background: white; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); padding: 2rem; text-align: center;">
        <h1 style="color: #dc2626; margin-bottom: 1rem;">Erro de Inicialização</h1>
        <p style="color: #6b7280; margin-bottom: 1.5rem;">${errorMessage}</p>
        <button onclick="window.location.reload()" style="background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; cursor: pointer;">
          Recarregar Página
        </button>
      </div>
    </div>
  `;
};

// Handle different loading states
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
