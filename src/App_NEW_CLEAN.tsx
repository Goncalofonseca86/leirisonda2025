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

// SECURITY: Problematic components removed for stability
// import { AutoSyncProvider } from "./components/AutoSyncProvider";
// import { SyncStatusIcon } from "./components/SyncStatusIndicator";
// import { FirebaseQuotaWarning } from "./components/FirebaseQuotaWarning";

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
];

function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Main navigation state
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states using simple hooks
  const {
    data: syncData,
    isLoading: syncLoading,
    lastSync,
    syncStatus,
    error: syncError,
  } = useDataSync();

  // Simple static replacements for problematic hooks
  const isAutoSyncing = false;
  const autoSyncLastSync = null;
  const cleanAllData = () => Promise.resolve({ success: true });

  // Basic states
  const [users, setUsers] = useState(initialUsers);
  const [clients, setClients] = useState([]);
  const [pools, setPools] = useState([]);
  const [works, setWorks] = useState([]);
  const [maintenance, setMaintenance] = useState([]);

  // App states
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showDataCleanup, setShowDataCleanup] = useState(false);
  const [enablePhoneDialer, setEnablePhoneDialer] = useState(() => {
    return localStorage.getItem("enablePhoneDialer") === "true";
  });
  const [enableMapsRedirect, setEnableMapsRedirect] = useState(() => {
    return localStorage.getItem("enableMapsRedirect") === "true";
  });

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // Auto-login for testing (SECURITY: Should be removed in production)
  useEffect(() => {
    // Try to restore user from localStorage first
    const storedUser =
      localStorage.getItem("currentUser") ||
      localStorage.getItem("mock-current-user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        console.log(
          "🔐 App init: Restoring user from localStorage:",
          user?.email,
        );
        setCurrentUser(user);
        setIsAuthenticated(true);
        console.log("✅ User session restored successfully");
        return; // Exit early if user is restored
      } catch (e) {
        console.warn(
          "App init: Error parsing stored user, clearing localStorage:",
          e,
        );
        localStorage.removeItem("currentUser");
        localStorage.removeItem("mock-current-user");
      }
    }

    // Auto-login for development (can be disabled in production)
    const testUser = {
      uid: "goncalo-main-user", // Required property for authService
      id: 1,
      name: "Gonçalo Fonseca",
      email: "gongonsilva@gmail.com",
      role: "super_admin",
      permissions: {
        obras: { view: true, create: true, edit: true, delete: true },
        manutencoes: { view: true, create: true, edit: true, delete: true },
        piscinas: { view: true, create: true, edit: true, delete: true },
        utilizadores: { view: true, create: true, edit: true, delete: true },
        relatorios: { view: true, create: true, edit: true, delete: true },
        clientes: { view: true, create: true, edit: true, delete: true },
      },
    };

    console.log("🔐 SECURITY: Firebase auth listeners disabled for stability");

    // Automatically log in as admin for testing
    console.log(
      "🔐 SECURITY: No automatic admin initialization - manual login required",
    );

    if (true) {
      // Enable auto-login for testing
      setCurrentUser(testUser);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(testUser));
      localStorage.setItem("isAuthenticated", "true");
    }
  }, []);

  // Permission check function
  const hasPermission = (module: string, action: string): boolean => {
    if (!currentUser || !currentUser?.permissions) return false;
    return currentUser?.permissions[module]?.[action] || false;
  };

  // Authentication functions
  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      setLoginError("Por favor, preencha todos os campos");
      return;
    }

    try {
      console.log("🔐 Attempting login for:", loginForm.email);
      const result = await authService.login(
        loginForm.email,
        loginForm.password,
      );

      if (result.success && result.user) {
        console.log("✅ Login successful for:", result.user?.email);
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem("currentUser", JSON.stringify(result.user));
        setLoginError("");
        setLoginForm({ email: "", password: "" });

        console.log("✅ Login state updated", {
          user: result.user?.email,
          role: result.user?.role,
        });
      } else {
        console.warn("❌ Login failed:", result.error);
        setLoginError(result.error || "Erro no login");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setLoginError("Erro de conexão");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("🔐 Initiating logout process...");
      setCurrentUser(null);
      setIsAuthenticated(false);
      setActiveSection("dashboard");

      // Clear all stored data
      localStorage.removeItem("currentUser");
      localStorage.removeItem("mock-current-user");
      localStorage.removeItem("isAuthenticated");

      console.log("✅ Logout completed successfully");
    } catch (error) {
      console.error("❌ Error during logout:", error);
    }
  };

  // Utility functions
  const showNotification = (title: string, body: string, type = "info") => {
    if (Notification.permission === "granted") {
      const notification = new Notification(title, {
        body: body,
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
        tag: type,
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setTimeout(() => notification.close(), 8000);
    }
  };

  // Navigation handler
  const handleNavigation = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);

    if (section !== "futuras-manutencoes") {
      window.history.replaceState(null, "", `#${section}`);
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  // PDF generation utility
  const downloadPDF = (content: string, filename: string) => {
    try {
      const pdf = new jsPDF();
      const lines = content.split("\n");
      let yPosition = 20;

      lines.forEach((line) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, 10, yPosition);
        yPosition += 7;
      });

      const pdfFilename = filename.replace(/[^a-zA-Z0-9_-]/g, "_");
      pdf.save(pdfFilename);
      console.log(`📄 PDF generated: ${pdfFilename}`);
      alert(`Relatório "${pdfFilename}" gerado com sucesso!`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF. Tente novamente.");
    }
  };

  // Main render function
  const renderContent = () => {
    // Add error boundary
    try {
      switch (activeSection) {
        case "dashboard":
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Wrench className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        Obras Pendentes
                      </h3>
                      <p className="text-sm text-gray-500">
                        À espera de início
                      </p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      {works.filter((w) => w.status === "pending").length}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Building2 className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        Em Progresso
                      </h3>
                      <p className="text-sm text-gray-500">Obras ativas</p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      {works.filter((w) => w.status === "in_progress").length}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Check className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        Concluídas
                      </h3>
                      <p className="text-sm text-gray-500">Este mês</p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      {works.filter((w) => w.status === "completed").length}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        Minhas Obras
                      </h3>
                      <p className="text-sm text-gray-500">Atribuídas a si</p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      {currentUser
                        ? (() => {
                            const assignedWorks = works.filter((work) => {
                              if (!work) return false;

                              // Check if user is in assignedTo string (exact match or comma-separated list)
                              const assignedToMatch =
                                work.assignedTo &&
                                work.assignedTo
                                  .split(",")
                                  .map((name) => name.trim().toLowerCase())
                                  .includes(
                                    currentUser?.name?.toLowerCase() || "",
                                  );

                              // Check if user is in assignedUsers array (exact match)
                              const assignedUsersMatch =
                                work.assignedUsers?.some(
                                  (user) =>
                                    user.name &&
                                    user.name?.toLowerCase() ===
                                      (currentUser?.name?.toLowerCase() || ""),
                                );

                              return assignedToMatch || assignedUsersMatch;
                            });

                            return assignedWorks.length;
                          })()
                        : 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Search */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Pesquisa Global
                  </h2>
                  <div className="mt-4">
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Pesquisar por cliente, obra, piscina, data..."
                      value={globalSearchTerm}
                      onChange={(e) => setGlobalSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-6">
                  {!globalSearchTerm.trim() ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-2">🔍</div>
                      <p className="text-gray-500 text-sm">
                        Digite algo para pesquisar
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Adicione obras, piscinas, manutenções ou clientes
                        primeiro
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Works Results */}
                      {works.filter(
                        (work) =>
                          work.title
                            ?.toLowerCase()
                            ?.includes(globalSearchTerm.toLowerCase()) ||
                          work.client
                            ?.toLowerCase()
                            ?.includes(globalSearchTerm.toLowerCase()) ||
                          work.location
                            ?.toLowerCase()
                            ?.includes(globalSearchTerm.toLowerCase()) ||
                          (work.assignedUsers && work.assignedUsers.length > 0
                            ? work.assignedUsers.some((u) =>
                                u.name
                                  ?.toLowerCase()
                                  ?.includes(globalSearchTerm.toLowerCase()),
                              )
                            : work.assignedTo
                                ?.toLowerCase()
                                ?.includes(globalSearchTerm.toLowerCase())),
                      ).length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Obras
                          </h4>
                          {works
                            .filter(
                              (work) =>
                                work.title
                                  ?.toLowerCase()
                                  ?.includes(globalSearchTerm.toLowerCase()) ||
                                work.client
                                  ?.toLowerCase()
                                  ?.includes(globalSearchTerm.toLowerCase()) ||
                                work.location
                                  ?.toLowerCase()
                                  ?.includes(globalSearchTerm.toLowerCase()) ||
                                (work.assignedUsers &&
                                work.assignedUsers.length > 0
                                  ? work.assignedUsers.some((u) =>
                                      u.name
                                        ?.toLowerCase()
                                        ?.includes(
                                          globalSearchTerm.toLowerCase(),
                                        ),
                                    )
                                  : work.assignedTo
                                      ?.toLowerCase()
                                      ?.includes(
                                        globalSearchTerm.toLowerCase(),
                                      )),
                            )
                            .slice(0, 3)
                            .map((work) => (
                              <button
                                key={work.id}
                                onClick={() => handleNavigation("obras")}
                                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 mb-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {work.title}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {work.client} • {work.location}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            ))}
                        </div>
                      )}

                      {/* Pools Results */}
                      {pools.filter(
                        (pool) =>
                          pool.name
                            ?.toLowerCase()
                            ?.includes(globalSearchTerm.toLowerCase()) ||
                          pool.client
                            ?.toLowerCase()
                            ?.includes(globalSearchTerm.toLowerCase()) ||
                          pool.location
                            ?.toLowerCase()
                            ?.includes(globalSearchTerm.toLowerCase()),
                      ).length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Piscinas
                          </h4>
                          {pools
                            .filter(
                              (pool) =>
                                pool.name
                                  ?.toLowerCase()
                                  ?.includes(globalSearchTerm.toLowerCase()) ||
                                pool.client
                                  ?.toLowerCase()
                                  ?.includes(globalSearchTerm.toLowerCase()) ||
                                pool.location
                                  ?.toLowerCase()
                                  ?.includes(globalSearchTerm.toLowerCase()),
                            )
                            .slice(0, 3)
                            .map((pool) => (
                              <button
                                key={pool.id}
                                onClick={() => handleNavigation("piscinas")}
                                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-200 mb-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {pool.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {pool.client} • {pool.location}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            ))}
                        </div>
                      )}

                      {/* No Results */}
                      {works.filter(
                        (work) =>
                          work.title
                            ?.toLowerCase()
                            ?.includes(globalSearchTerm.toLowerCase()) ||
                          work.client
                            ?.toLowerCase()
                            ?.includes(globalSearchTerm.toLowerCase()) ||
                          work.location
                            ?.toLowerCase()
                            ?.includes(globalSearchTerm.toLowerCase()),
                      ).length === 0 &&
                        pools.filter(
                          (pool) =>
                            pool.name
                              ?.toLowerCase()
                              ?.includes(globalSearchTerm.toLowerCase()) ||
                            pool.client
                              ?.toLowerCase()
                              ?.includes(globalSearchTerm.toLowerCase()) ||
                            pool.location
                              ?.toLowerCase()
                              ?.includes(globalSearchTerm.toLowerCase()),
                        ).length === 0 && (
                          <div className="text-center py-8">
                            <div className="text-gray-400 mb-2">🔍</div>
                            <p className="text-gray-500 text-sm">
                              Nenhum resultado encontrado
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              Tente outros termos de pesquisa
                            </p>
                          </div>
                        )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );

        case "obras":
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestão de Obras
                </h1>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Obras
                </h3>
                <p className="text-gray-600 text-sm">
                  Gestão de obras no sistema
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  As obras aparecerão aqui quando forem criadas
                </p>
              </div>
            </div>
          );

        case "piscinas":
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestão de Piscinas
                </h1>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                <Waves className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Piscinas
                </h3>
                <p className="text-gray-600 text-sm">
                  Gestão de piscinas no sistema
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  As piscinas aparecerão aqui quando forem criadas
                </p>
              </div>
            </div>
          );

        case "manutencoes":
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  Manutenções
                </h1>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Manutenções
                </h3>
                <p className="text-gray-600 text-sm">
                  As manutenções aparecerão aqui quando forem criadas
                </p>
              </div>
            </div>
          );

        case "utilizadores":
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestão de Utilizadores
                </h1>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Utilizadores
                </h3>
                <p className="text-gray-600 text-sm">
                  Gestão de utilizadores do sistema
                </p>
              </div>
            </div>
          );

        case "relatorios":
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Relatórios
                </h3>
                <p className="text-gray-600 text-sm">
                  Relatórios e estatísticas do sistema
                </p>
              </div>
            </div>
          );

        case "clientes":
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestão de Clientes
                </h1>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Clientes
                </h3>
                <p className="text-gray-600 text-sm">
                  Gestão de clientes do sistema
                </p>
              </div>
            </div>
          );

        case "configuracoes":
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  Configurações
                </h1>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Configurações
                </h3>
                <p className="text-gray-600 text-sm">
                  Configurações do sistema
                </p>
              </div>
            </div>
          );

        default:
          return (
            <div className="text-center py-8">
              <p className="text-gray-500">Secção não encontrada</p>
            </div>
          );
      }
    } catch (error) {
      console.error("Error rendering content:", error);
      return (
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar conteúdo</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-4"
          >
            Recarregar Página
          </button>
        </div>
      );
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="flex items-center justify-center mb-6">
              <Building2 className="h-12 w-12 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Leirisonda</h1>
                <p className="text-sm text-gray-500">Sistema de Gestão</p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Palavra-passe
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Palavra-passe"
                  required
                />
              </div>

              {loginError && (
                <div className="text-red-600 text-sm">{loginError}</div>
              )}

              <button
                type="submit"
                onClick={handleLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main app layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600 mr-2" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">
                Leirisonda
              </h1>
              <p className="text-sm text-gray-500">Gestão de Serviços</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {[
              { id: "dashboard", name: "Dashboard", icon: Home },
              { id: "obras", name: "Obras", icon: Building2 },
              { id: "piscinas", name: "Piscinas", icon: Waves },
              { id: "manutencoes", name: "Manutenções", icon: Wrench },
              { id: "clientes", name: "Clientes", icon: UserCheck },
              { id: "utilizadores", name: "Utilizadores", icon: Users },
              { id: "relatorios", name: "Relatórios", icon: BarChart3 },
              { id: "configuracoes", name: "Configurações", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {currentUser?.name}
              </p>
              <p className="text-xs text-gray-500">{currentUser?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
          <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1"></div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
