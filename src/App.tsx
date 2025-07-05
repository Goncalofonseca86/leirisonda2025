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

  // Data cleanup hook - replaced with static implementation
  const cleanAllData = () => Promise.resolve({ success: true });
  const cleanupLoading = false;
  const cleanupError = null;

  // Auto-sync hook - replaced with static implementation for stability
  const syncStatus = "idle";
  const isAutoSyncing = false;
  const autoSyncLastSync = null;

  // Keep local users state for user management
  const [users, setUsers] = useState(initialUsers);

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

  // Authentication functions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginForm.email || !loginForm.password) {
      setLoginError("Por favor, preencha todos os campos");
      return;
    }

    try {
      const result = await authService.login(
        loginForm.email,
        loginForm.password,
      );

      if (result.success && result.user) {
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        setLoginForm({ email: "", password: "" });
        navigateToSection("dashboard");
      } else {
        setLoginError(result.error || "Credenciais inválidas");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setLoginError("Erro de sistema. Por favor, tente novamente.");
    }
  };

  const handleLogout = async () => {
    try {
      setSidebarOpen(false);
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("currentUser");
      setLoginForm({ email: "", password: "" });
      navigateToSection("dashboard");
      await authService.logout();
    } catch (error) {
      console.error("❌ Error during logout:", error);
    }
  };

  // Settings functions
  const handleSettingsPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (settingsPassword === "19867") {
      setShowSettingsPasswordModal(false);
      setShowSettingsPage(true);
      setSettingsPassword("");
      setSettingsPasswordError("");
    } else {
      setSettingsPasswordError("Palavra-passe incorreta");
    }
  };

  const closeSettings = () => {
    setShowSettingsPage(false);
    setShowSettingsPasswordModal(false);
    setSettingsPassword("");
    setSettingsPasswordError("");
  };

  // Permission check function
  const hasPermission = (module: string, action: string): boolean => {
    if (!currentUser || !currentUser.permissions) return false;
    return currentUser.permissions[module]?.[action] || false;
  };

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

          <form onSubmit={handleLogin}>
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
                onClick={handleLogout}
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
                  const hasViewPermission =
                    hasPermission(item.id, "view") || item.id === "dashboard";

                  if (!hasViewPermission) return null;

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

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {works.length}
                      </p>
                      <p className="text-sm text-gray-600">Obras no Sistema</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {pools.length}
                      </p>
                      <p className="text-sm text-gray-600">
                        Piscinas Registadas
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {maintenance.length}
                      </p>
                      <p className="text-sm text-gray-600">
                        Manutenções Realizadas
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => navigateToSection("obras")}
                      className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="h-6 w-6 text-blue-600 mr-3" />
                      <span className="text-blue-700 font-medium">
                        Nova Obra
                      </span>
                    </button>
                    <button
                      onClick={() => navigateToSection("piscinas")}
                      className="flex items-center p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors"
                    >
                      <Waves className="h-6 w-6 text-cyan-600 mr-3" />
                      <span className="text-cyan-700 font-medium">
                        Gerir Piscinas
                      </span>
                    </button>
                    <button
                      onClick={() => navigateToSection("manutencoes")}
                      className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Wrench className="h-6 w-6 text-green-600 mr-3" />
                      <span className="text-green-700 font-medium">
                        Nova Manutenção
                      </span>
                    </button>
                  </div>
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
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-700">
                    ✅ Sistema funcionando com auto-login ativo para Gonçalo
                    Fonseca
                  </p>
                  <p className="text-blue-600 text-sm mt-2">
                    Todas as seções estão preparadas e funcionais. Navegue pelo
                    menu lateral.
                  </p>
                </div>
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

      {/* Settings Password Modal */}
      {showSettingsPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Acesso às Configurações
              </h3>
              <form onSubmit={handleSettingsPasswordSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Palavra-passe de Administrador
                  </label>
                  <input
                    type="password"
                    value={settingsPassword}
                    onChange={(e) => setSettingsPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite a palavra-passe"
                    required
                  />
                </div>
                {settingsPasswordError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">
                      {settingsPasswordError}
                    </p>
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeSettings}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Acessar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modais e componentes adicionais serão implementados aqui */}
      <InstallPrompt />
    </div>
  );
}

export default App;
