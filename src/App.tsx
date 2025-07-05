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

import { SyncStatusIcon } from "./components/SyncStatusIndicator";
import { FirebaseQuotaWarning } from "./components/FirebaseQuotaWarning";

// SECURITY: RegisterForm removed - only super admin can create users
import { AdminLogin } from "./admin/AdminLogin";
import { AdminPage } from "./admin/AdminPage";
import { useDataSync } from "./hooks/useDataSync_simple";
import { authService, UserProfile } from "./services/authService";

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
  {
    id: 4,
    name: "Alexandre Costa",
    email: "alexandre.costa@leirisonda.pt",
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
    createdAt: "2024-02-15",
  },
  {
    id: 5,
    name: "Carla Oliveira",
    email: "carla.oliveira@leirisonda.pt",
    password: "123456",
    role: "viewer",
    permissions: {
      obras: { view: true, create: false, edit: false, delete: false },
      manutencoes: { view: true, create: false, edit: false, delete: false },
      piscinas: { view: true, create: false, edit: false, delete: false },
      utilizadores: { view: false, create: false, edit: false, delete: false },
      relatorios: { view: true, create: false, edit: false, delete: false },
      clientes: { view: true, create: false, edit: false, delete: false },
    },
    active: true,
    createdAt: "2024-03-01",
  },
];

function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Auto-login setup para desenvolvimento
  useEffect(() => {
    console.log("🔒 SECURITY: Auto-login initializing");
    const mainUser = {
      uid: "goncalo-main-user", // Propriedade uid obrigatória
      id: 1,
      name: "Gonçalo Fonseca",
      email: "gongonsilva@gmail.com",
      role: "super_admin" as const,
      permissions: {
        obras: { view: true, create: true, edit: true, delete: true },
        manutencoes: { view: true, create: true, edit: true, delete: true },
        piscinas: { view: true, create: true, edit: true, delete: true },
        relatorios: { view: true, create: true, edit: true, delete: true },
        utilizadores: { view: true, create: true, edit: true, delete: true },
        admin: { view: true, create: true, edit: true, delete: true },
        dashboard: { view: true },
        clientes: { view: true, create: true, edit: true, delete: true },
      },
      active: true,
      createdAt: "2024-01-01",
    };
    setCurrentUser(mainUser);
    setIsAuthenticated(true);
    console.log("✅ Auto-login completed for:", mainUser.name);
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
    // Update URL hash for PWA support
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

  // Data sync hook - manages all data with optional Firebase sync
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

  // Data cleanup hook - temporarily disabled to debug hooks issue
  // Substitui os hooks problemáticos por implementações estáticas
  const cleanAllData = () => Promise.resolve({ success: true });
  const cleanupLoading = false;
  const cleanupError = null;

  // Auto-sync hook for automatic Firebase to localStorage synchronization - disabled
  const syncStatus = "idle";
  const isAutoSyncing = false;
  const autoSyncLastSync = null;

  // Keep local users state for user management
  const [users, setUsers] = useState(initialUsers);
  const [selectedWorkType, setSelectedWorkType] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [interventionSaved, setInterventionSaved] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [pushPermission, setPushPermission] = useState("default");
  const [assignedWorks, setAssignedWorks] = useState<any[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<any[]>([]);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<any[]>([]);
  const [workVehicles, setWorkVehicles] = useState<string[]>([]);
  const [workTechnicians, setWorkTechnicians] = useState<string[]>([]);
  const [currentVehicle, setCurrentVehicle] = useState("");
  const [currentTechnician, setCurrentTechnician] = useState("");
  const [currentAssignedUser, setCurrentAssignedUser] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [editAssignedUsers, setEditAssignedUsers] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [currentEditAssignedUser, setCurrentEditAssignedUser] = useState("");

  // Edit and view states
  const [editingWork, setEditingWork] = useState(null);
  const [editingPool, setEditingPool] = useState(null);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [selectedWork, setSelectedWork] = useState(null);
  const [viewingWork, setViewingWork] = useState(false);

  // Clickable links settings
  const [enablePhoneDialer, setEnablePhoneDialer] = useState(() => {
    return localStorage.getItem("enablePhoneDialer") === "true";
  });
  const [enableMapsRedirect, setEnableMapsRedirect] = useState(() => {
    return localStorage.getItem("enableMapsRedirect") === "true";
  });

  // Maintenance form state
  const [maintenanceForm, setMaintenanceForm] = useState({
    poolId: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    technician: "",
    vehicle: "",
    pH: "",
    chlorine: "",
    alkalinity: "",
    temperature: "",
    workPerformed: "",
    otherWork: "",
    problems: "",
    observations: "",
    nextMaintenance: "",
    status: "completed",
  });

  // Initialize authentication state with security checks
  useEffect(() => {
    console.log("�� SECURITY: App initialization started");

    // Try to restore user from localStorage first
    const storedUser =
      localStorage.getItem("currentUser") ||
      localStorage.getItem("mock-current-user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log(
          "👤 App init: Restoring user from localStorage:",
          user.email,
          user.role,
        );

        // Validate user data structure
        if (
          user.id &&
          user.name &&
          user.email &&
          user.role &&
          user.permissions
        ) {
          // Validate user against mock database
          const validUser = initialUsers.find(
            (u) => u.email === user.email && u.id === user.id,
          );

          if (validUser && validUser.active) {
            setCurrentUser(user);
            setIsAuthenticated(true);
            console.log(
              "✅ SECURITY: User restored and validated from localStorage",
            );
          } else {
            console.warn("⚠️ SECURITY: User not found in database or inactive");
            localStorage.removeItem("currentUser");
            localStorage.removeItem("mock-current-user");
          }
        } else {
          console.warn("⚠️ SECURITY: Invalid user data structure");
          localStorage.removeItem("currentUser");
          localStorage.removeItem("mock-current-user");
        }
      } catch (error) {
        console.error(
          "❌ SECURITY: Error parsing user from localStorage:",
          error,
        );
        localStorage.removeItem("currentUser");
        localStorage.removeItem("mock-current-user");
      }
    }

    // PWA Service Worker registration
    if ("serviceWorker" in navigator) {
      setTimeout(() => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log(
              "✅ Service Worker registered successfully:",
              registration,
            );
            if (registration.waiting) {
              registration.waiting.postMessage({ type: "SKIP_WAITING" });
            }
          })
          .catch((error) => {
            console.error("❌ Service Worker registration failed:", error);
          });
      }, 1000);
    }

    // Handle URL hash for PWA shortcuts
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // Remove the '#'
      if (hash && isAuthenticated) {
        setActiveSection(hash);
      }
    };

    // Check initial hash on load if authenticated
    if (isAuthenticated) {
      handleHashChange();
    }

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [isAuthenticated]);

  // Continue with rest of the app implementation...
  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  // User form state
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "technician",
    permissions: {
      obras: { view: false, create: false, edit: false, delete: false },
      manutencoes: { view: false, create: false, edit: false, delete: false },
      piscinas: { view: false, create: false, edit: false, delete: false },
      utilizadores: { view: false, create: false, edit: false, delete: false },
      relatorios: { view: false, create: false, edit: false, delete: false },
      clientes: { view: false, create: false, edit: false, delete: false },
    },
    active: true,
  });

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <Building2 className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">Leirisonda</h1>
            <p className="text-gray-600">Sistema de Gestão</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Logic for login will be implemented here
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main app interface quando autenticado
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Leirisonda
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <SyncStatusIcon />
              <FirebaseQuotaWarning />

              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {currentUser?.name}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {currentUser?.role}
                </span>
              </div>

              <button
                onClick={() => {
                  setCurrentUser(null);
                  setIsAuthenticated(false);
                  localStorage.removeItem("currentUser");
                  localStorage.removeItem("mock-current-user");
                }}
                className="text-gray-500 hover:text-gray-700"
                title="Sair"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b md:hidden">
              <span className="text-lg font-semibold">Menu</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {[
                  { id: "dashboard", label: "Dashboard", icon: Home },
                  { id: "obras", label: "Obras", icon: Building2 },
                  { id: "piscinas", label: "Piscinas", icon: Waves },
                  { id: "manutencoes", label: "Manutenções", icon: Wrench },
                  { id: "relatorios", label: "Relatórios", icon: BarChart3 },
                  { id: "utilizadores", label: "Utilizadores", icon: Users },
                ].map((item) => {
                  const Icon = item.icon;
                  const hasPermission =
                    currentUser?.permissions?.[item.id]?.view !== false;

                  if (!hasPermission && item.id !== "dashboard") return null;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigateToSection(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === item.id
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 pt-8 border-t">
                <button
                  onClick={() => setShowSettingsPasswordModal(true)}
                  className="w-full flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Configurações
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-0">
          <main className="p-6">
            {/* Dashboard Section */}
            {activeSection === "dashboard" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Dashboard
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <Building2 className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Obras Ativas
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {works?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <Waves className="h-8 w-8 text-cyan-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Piscinas
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {pools?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <Wrench className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Manutenções
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {maintenance?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Utilizadores
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {users?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status da Sincronização */}
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Estado do Sistema
                  </h3>
                  <SyncStatusDisplay />
                </div>
              </div>
            )}

            {/* Placeholder para outras seções */}
            {activeSection !== "dashboard" && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {activeSection === "obras" && "Gestão de Obras"}
                  {activeSection === "piscinas" && "Gestão de Piscinas"}
                  {activeSection === "manutencoes" && "Gestão de Manutenções"}
                  {activeSection === "relatorios" && "Relatórios"}
                  {activeSection === "utilizadores" && "Gestão de Utilizadores"}
                </h2>
                <p className="text-gray-600">
                  Seção {activeSection} - Funcionalidade completa em
                  desenvolvimento.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modals e componentes adicionais serão implementados aqui */}
      <InstallPrompt />
    </div>
  );
}

export default App;
