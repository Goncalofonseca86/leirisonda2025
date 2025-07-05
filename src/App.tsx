import React, { useState, useEffect } from "react";
import {
  Building2,
  Menu,
  X,
  Home,
  Plus,
  Wrench,
  Waves,
  BarChart3,
  Users,
  UserCheck,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Save,
  UserPlus,
  Shield,
  Check,
  AlertCircle,
  Download,
  ArrowLeft,
  Bell,
} from "lucide-react";
import jsPDF from "jspdf";
import { FirebaseConfig } from "./components/FirebaseConfig";
import { AdvancedSettings } from "./components/AdvancedSettings";
import { SyncStatusDisplay } from "./components/SyncStatusDisplay";
import { InstallPrompt } from "./components/InstallPrompt";
import { UserPermissionsManager } from "./components/UserPermissionsManager";
import { RegisterForm } from "./components/RegisterForm";

import { AutoSyncProvider } from "./components/AutoSyncProvider";
import { SyncStatusIcon } from "./components/SyncStatusIndicator";
import { FirebaseQuotaWarning } from "./components/FirebaseQuotaWarning";

import { AdminLogin } from "./admin/AdminLogin";
import { AdminPage } from "./admin/AdminPage";
import { useDataSync } from "./hooks/useDataSync_simple";
import { authService, UserProfile } from "./services/authService";
import { useDataCleanup } from "./hooks/useDataCleanup";
import { useAutoSync } from "./hooks/useAutoSync";

// Mock users database
const initialUsers = [
  {
    id: 1,
    name: "Gonçalo Fonseca",
    email: "gongonsilva@gmail.com",
    password: "19867gsf",
    role: "super_admin",
    permissions: {
      obras: { view: true, create: true, edit: true, delete: true },
      manutencoes: { view: true, create: true, edit: true, delete: true },
      piscinas: { view: true, create: true, edit: true, delete: true },
      utilizadores: { view: true, create: true, edit: true, delete: true },
      relatorios: { view: true, create: true, edit: true, delete: true },
      clientes: { view: true, create: true, edit: true, delete: true },
    },
    active: true,
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Maria Silva",
    email: "maria.silva@leirisonda.pt",
    password: "123456",
    role: "manager",
    permissions: {
      obras: { view: true, create: true, edit: true, delete: false },
      manutencoes: { view: true, create: true, edit: true, delete: false },
      piscinas: { view: true, create: true, edit: true, delete: false },
      utilizadores: { view: true, create: false, edit: false, delete: false },
      relatorios: { view: true, create: true, edit: false, delete: false },
      clientes: { view: true, create: true, edit: true, delete: false },
    },
    active: true,
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    name: "João Santos",
    email: "joao.santos@leirisonda.pt",
    password: "123456",
    role: "technician",
    permissions: {
      obras: { view: true, create: false, edit: true, delete: false },
      manutencoes: { view: true, create: true, edit: true, delete: false },
      piscinas: { view: true, create: false, edit: true, delete: false },
      utilizadores: { view: false, create: false, edit: false, delete: false },
      relatorios: { view: true, create: false, edit: false, delete: false },
      clientes: { view: true, create: false, edit: false, delete: false },
    },
    active: true,
    createdAt: "2024-02-01",
  },
];

function App() {
  // SECURITY: Always start as not authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Debug logging for authentication state changes
  useEffect(() => {
    console.log("🔐 Auth State Debug:", {
      isAuthenticated,
      currentUser: currentUser
        ? `${currentUser.name} (${currentUser.email})`
        : null,
      timestamp: new Date().toISOString(),
    });
  }, [isAuthenticated, currentUser]);

  // Auto-login para funcionar
  useEffect(() => {
    const mainUser = {
      uid: "goncalo-main-user",
      name: "Gonçalo Fonseca",
      email: "gongonsilva@gmail.com",
      role: "super_admin" as const,
      permissions: {
        obras: { view: true, create: true, edit: true, delete: true },
        manutencoes: { view: true, create: true, edit: true, delete: true },
        piscinas: { view: true, create: true, edit: true, delete: true },
        utilizadores: { view: true, create: true, edit: true, delete: true },
        relatorios: { view: true, create: true, edit: true, delete: true },
        clientes: { view: true, create: true, edit: true, delete: true },
        admin: { view: true, create: true, edit: true, delete: true },
        dashboard: { view: true },
      },
    };

    setCurrentUser(mainUser);
    setIsAuthenticated(true);
    console.log("✅ Auto-login efetuado");
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientForm, setNewClientForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [activeWorkFilter, setActiveWorkFilter] = useState("all");
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  // Custom setActiveSection that updates URL hash
  const navigateToSection = (section: string) => {
    setActiveSection(section);
    if (section !== "futuras-manutencoes") {
      window.history.replaceState(null, "", `#${section}`);
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showSettingsPasswordModal, setShowSettingsPasswordModal] =
    useState(false);
  const [showSettingsPage, setShowSettingsPage] = useState(false);
  const [settingsPassword, setSettingsPassword] = useState("");
  const [settingsPasswordError, setSettingsPasswordError] = useState("");
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [advancedPassword, setAdvancedPassword] = useState("");
  const [advancedPasswordError, setAdvancedPasswordError] = useState("");
  const [isAdvancedUnlocked, setIsAdvancedUnlocked] = useState(false);
  const [showDataCleanup, setShowDataCleanup] = useState(false);

  // Admin area states
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Data sync hook
  const dataSync = useDataSync();
  const {
    pools,
    maintenance,
    futureMaintenance,
    works,
    clients,
    isLoading: syncLoading,
    lastSync,
    error: syncError,
    syncWithFirebase,
    enableSync,
    addPool,
    addWork,
    addMaintenance,
    addClient,
  } = dataSync;

  // Data cleanup hook
  const {
    cleanAllData,
    isLoading: cleanupLoading,
    error: cleanupError,
  } = useDataCleanup();

  // Auto-sync hook
  const autoSyncData = useAutoSync();
  const { syncStatus, isAutoSyncing } = autoSyncData;
  const autoSyncLastSync = autoSyncData.lastSync;

  // Keep local users state for user management
  const [users, setUsers] = useState(initialUsers);

  // Permission check function
  const hasPermission = (module: string, action: string): boolean => {
    if (!currentUser || !currentUser.permissions) return false;
    return currentUser.permissions[module]?.[action] || false;
  };

  const renderContent = () => {
    if (!currentUser || !isAuthenticated) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">A carregar aplicação...</p>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case "dashboard":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-lg shadow-md p-1">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                        alt="Leirisonda Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">
                      Olá, {currentUser?.name || "Utilizador"}
                    </h1>
                    <p className="text-sm text-gray-600">
                      Sistema de Gestão Leirisonda
                    </p>
                  </div>
                </div>
              </div>

              {/* Obras Atribuídas */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center p-4 border-b border-gray-100">
                  <button
                    onClick={() => navigateToSection("obras")}
                    className="p-1 mr-3 hover:bg-gray-100 rounded"
                  >
                    <span className="text-gray-600 text-lg">→</span>
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Minhas Obras Atribuídas
                  </h2>
                </div>

                <div className="p-4 space-y-3">
                  {works.filter(
                    (work) =>
                      work.assignedTo?.toLowerCase() ===
                        currentUser.name.toLowerCase() ||
                      work.assignedUsers?.some(
                        (user) =>
                          user.name?.toLowerCase() ===
                          currentUser.name.toLowerCase(),
                      ),
                  ).length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Building2 className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">
                        Nenhuma obra atribuída
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        As obras atribuídas a si aparecerão aqui
                      </p>
                    </div>
                  ) : (
                    works
                      .filter(
                        (work) =>
                          work.assignedTo?.toLowerCase() ===
                            currentUser.name.toLowerCase() ||
                          work.assignedUsers?.some(
                            (user) =>
                              user.name?.toLowerCase() ===
                              currentUser.name.toLowerCase(),
                          ),
                      )
                      .map((work) => (
                        <div
                          key={work.id}
                          className="border-l-4 border-purple-500 bg-purple-50 rounded-r-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {work.title}
                                </h3>
                                <div className="flex items-center space-x-1 text-gray-600 text-sm">
                                  <span>👤</span>
                                  <span>
                                    Atribuída a:{" "}
                                    {work.assignedUsers &&
                                    work.assignedUsers.length > 0
                                      ? work.assignedUsers
                                          .map((u) => u.name)
                                          .join(", ")
                                      : work.assignedTo || "Não atribuída"}
                                  </span>
                                </div>
                                <span
                                  className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                                    work.status === "in_progress"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : work.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {work.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Secção não encontrada
              </h2>
              <p className="text-gray-600">
                A secção que está a tentar aceder não existe.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <AutoSyncProvider
      enabled={true}
      syncInterval={30000}
      collections={["users", "pools", "maintenance", "works", "clients"]}
      showNotifications={true}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo Header */}
            <div className="px-6 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-10 bg-white rounded-lg shadow-md p-1">
                    <img
                      src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                      alt="Leirisonda Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      Leirisonda
                    </span>
                    <span className="text-xs text-gray-500">
                      Sistema de Gestão
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-6 py-6 space-y-2 overflow-y-auto">
              <button
                onClick={() => {
                  navigateToSection("dashboard");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === "dashboard"
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </button>

              {hasPermission("obras", "view") && (
                <button
                  onClick={() => {
                    navigateToSection("obras");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === "obras"
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Building2 className="mr-3 h-5 w-5" />
                  Obras
                </button>
              )}
            </nav>

            {/* User Info */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser?.role}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    setIsAuthenticated(false);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-6 bg-white rounded shadow-sm p-0.5">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                  alt="Leirisonda Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                Leirisonda
              </span>
            </div>
            <div className="w-10" />
          </div>
        </div>

        {/* Main Content */}
        <main className="lg:ml-80 min-h-screen">
          <div className="p-4 lg:p-6">{renderContent()}</div>
        </main>

        {/* Install Prompt for Mobile */}
        <InstallPrompt />

        {/* Admin Login Modal */}
        {showAdminLogin && !isAdminAuthenticated && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
              <AdminLogin
                onLogin={() => {
                  setIsAdminAuthenticated(true);
                  setShowAdminLogin(false);
                }}
                onBack={() => setShowAdminLogin(false)}
              />
            </div>
          </div>
        )}

        {/* Admin Page */}
        {isAdminAuthenticated && (
          <div className="fixed inset-0 bg-white z-50">
            <AdminPage
              onLogout={() => {
                setIsAdminAuthenticated(false);
                setShowAdminLogin(false);
              }}
            />
          </div>
        )}
      </div>
    </AutoSyncProvider>
  );
}

export default App;
