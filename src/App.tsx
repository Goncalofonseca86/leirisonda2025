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
];

function App() {
  // SECURITY: Always start as not authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Auto-login para funcionar corretamente
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
    console.log("✅ Auto-login efetuado com sucesso");
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

  // Data cleanup hook - temporarily disabled
  const cleanAllData = () => Promise.resolve({ success: true });
  const cleanupLoading = false;
  const cleanupError = null;

  // Auto-sync hook - temporarily disabled
  const syncStatus = "completed";
  const isAutoSyncing = false;
  const autoSyncLastSync = new Date();

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

  // Clickable links settings
  const [enablePhoneDialer, setEnablePhoneDialer] = useState(() => {
    return localStorage.getItem("enablePhoneDialer") === "true";
  });
  const [enableMapsRedirect, setEnableMapsRedirect] = useState(() => {
    return localStorage.getItem("enableMapsRedirect") === "true";
  });

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

    // Ensure all arrays are defined
    const safeWorks = works || [];
    const safePools = pools || [];
    const safeMaintenance = maintenance || [];
    const safeFutureMaintenance = futureMaintenance || [];
    const safeClients = clients || [];

    switch (activeSection) {
      case "dashboard":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-4">
              {/* Header Card */}
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
                      {hasPermission("obras", "create") && (
                        <button
                          onClick={() => navigateToSection("nova-obra")}
                          className="mt-3 px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700"
                        >
                          Criar Nova Obra
                        </button>
                      )}
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
                          className="border-l-4 border-purple-500 bg-purple-50 rounded-r-lg p-4 cursor-pointer hover:bg-purple-100 transition-colors"
                          onClick={() => {
                            // Navigate to work details
                            console.log("Viewing work:", work.title);
                          }}
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
                                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                                  <span>📍</span>
                                  <span>
                                    Criada em:{" "}
                                    {new Date(
                                      work.createdAt,
                                    ).toLocaleDateString("pt-PT")}
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
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (work.status !== "in_progress") {
                                    // Update work status
                                    console.log("Starting work:", work.title);
                                  }
                                }}
                                className={`px-3 py-1 text-white text-sm rounded-lg transition-colors ${
                                  work.status === "in_progress"
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700"
                                }`}
                                disabled={work.status === "in_progress"}
                              >
                                {work.status === "in_progress"
                                  ? "Em Progresso"
                                  : "Iniciar"}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("View details:", work.title);
                                }}
                                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded-lg transition-colors"
                              >
                                Ver Detalhes
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Próximas Manutenções */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center p-4 border-b border-gray-100">
                  <button
                    onClick={() => navigateToSection("futuras-manutencoes")}
                    className="p-1 mr-3 hover:bg-gray-100 rounded"
                  >
                    <span className="text-gray-600 text-lg">→</span>
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Próximas Manutenções
                  </h2>
                </div>

                <div className="p-4 space-y-3">
                  {(futureMaintenance || []).length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Waves className="h-6 w-6 text-cyan-600" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">
                        Nenhuma manutenção agendada
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        As futuras manutenções aparecerão aqui
                      </p>
                      {hasPermission("manutencoes", "create") && (
                        <button
                          onClick={() => navigateToSection("nova-manutencao")}
                          className="mt-3 px-3 py-1 bg-cyan-600 text-white text-xs rounded-lg hover:bg-cyan-700"
                        >
                          Agendar Manutenção
                        </button>
                      )}
                    </div>
                  ) : (
                    futureMaintenance
                      .sort(
                        (a, b) =>
                          new Date(a.scheduledDate).getTime() -
                          new Date(b.scheduledDate).getTime(),
                      )
                      .slice(0, 4)
                      .map((maint) => {
                        const scheduledDate = new Date(maint.scheduledDate);
                        const today = new Date();
                        const diffTime =
                          scheduledDate.getTime() - today.getTime();
                        const diffDays = Math.ceil(
                          diffTime / (1000 * 60 * 60 * 24),
                        );

                        let timeText = "";
                        if (diffDays === 0) {
                          timeText = "Hoje";
                        } else if (diffDays === 1) {
                          timeText = "Amanhã";
                        } else if (diffDays > 0) {
                          timeText = `Em ${diffDays} dias`;
                        } else {
                          timeText = "Atrasada";
                        }

                        return (
                          <div
                            key={maint.id}
                            className="border-l-4 border-cyan-500 bg-cyan-50 rounded-r-lg p-4"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                  <Waves className="h-5 w-5 text-cyan-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">
                                    {maint.poolName}
                                  </h3>
                                  <div className="flex items-center space-x-1 text-gray-600 text-sm">
                                    <span>🔧</span>
                                    <span>{maint.type}</span>
                                  </div>
                                  <div className="flex items-center space-x-1 text-gray-500 text-sm">
                                    <span>⏰</span>
                                    <span>{timeText}</span>
                                  </div>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Data:{" "}
                                    {scheduledDate.toLocaleDateString("pt-PT")}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start space-x-2">
                                <span
                                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    diffDays < 0
                                      ? "bg-red-200 text-red-800"
                                      : diffDays <= 3
                                        ? "bg-yellow-200 text-yellow-800"
                                        : "bg-green-200 text-green-800"
                                  }`}
                                >
                                  {timeText}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "obras":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold text-gray-900">
                        Gestão de Obras
                      </h1>
                      <p className="text-sm text-gray-600">
                        {works.length} obras no sistema
                      </p>
                    </div>
                  </div>
                  {hasPermission("obras", "create") && (
                    <button
                      onClick={() => navigateToSection("nova-obra")}
                      className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Nova Obra</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Pesquisar obras..."
                      value={globalSearchTerm}
                      onChange={(e) => setGlobalSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <select
                    value={activeWorkFilter}
                    onChange={(e) => setActiveWorkFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Todas as obras</option>
                    <option value="pending">Pendentes</option>
                    <option value="in_progress">Em progresso</option>
                    <option value="completed">Concluídas</option>
                  </select>
                </div>
              </div>

              {/* Works List */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">
                    Lista de Obras
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  {works
                    .filter((work) => {
                      const matchesSearch =
                        globalSearchTerm === "" ||
                        work.title
                          .toLowerCase()
                          .includes(globalSearchTerm.toLowerCase()) ||
                        work.client
                          .toLowerCase()
                          .includes(globalSearchTerm.toLowerCase()) ||
                        work.location
                          .toLowerCase()
                          .includes(globalSearchTerm.toLowerCase());

                      const matchesFilter =
                        activeWorkFilter === "all" ||
                        work.status === activeWorkFilter;

                      return matchesSearch && matchesFilter;
                    })
                    .map((work) => (
                      <div
                        key={work.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => {
                          console.log("View work details:", work.title);
                        }}
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
                              <p className="text-sm text-gray-600">
                                Cliente: {work.client}
                              </p>
                              <p className="text-sm text-gray-500">
                                Local: {work.location}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span
                                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                                    work.status === "in_progress"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : work.status === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {work.status}
                                </span>
                                {work.budget && (
                                  <span className="text-xs text-gray-500">
                                    Orçamento: €{work.budget}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {hasPermission("obras", "edit") && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log("Edit work:", work.title);
                                }}
                                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                            )}
                            {hasPermission("obras", "delete") && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (
                                    window.confirm(
                                      `Tem certeza que deseja eliminar a obra "${work.title}"?`,
                                    )
                                  ) {
                                    console.log("Delete work:", work.title);
                                  }
                                }}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                  {works.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Building2 className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">
                        Nenhuma obra encontrada
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Comece criando uma nova obra
                      </p>
                      {hasPermission("obras", "create") && (
                        <button
                          onClick={() => navigateToSection("nova-obra")}
                          className="mt-3 px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700"
                        >
                          Criar Nova Obra
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "piscinas":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Waves className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold text-gray-900">
                        Gestão de Piscinas
                      </h1>
                      <p className="text-sm text-gray-600">
                        {pools.length} piscinas no sistema
                      </p>
                    </div>
                  </div>
                  {hasPermission("piscinas", "create") && (
                    <button
                      onClick={() => navigateToSection("nova-piscina")}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Nova Piscina</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Pools List */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">
                    Lista de Piscinas
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  {pools.map((pool) => (
                    <div
                      key={pool.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Waves className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {pool.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Cliente: {pool.client}
                            </p>
                            <p className="text-sm text-gray-500">
                              Local: {pool.location}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded-full ${
                                  pool.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : pool.status === "maintenance"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {pool.status}
                              </span>
                              <span className="text-xs text-gray-500">
                                Tipo: {pool.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {hasPermission("piscinas", "edit") && (
                            <button
                              onClick={() => {
                                console.log("Edit pool:", pool.name);
                              }}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          )}
                          {hasPermission("piscinas", "delete") && (
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Tem certeza que deseja eliminar a piscina "${pool.name}"?`,
                                  )
                                ) {
                                  console.log("Delete pool:", pool.name);
                                }
                              }}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {pools.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Waves className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">
                        Nenhuma piscina encontrada
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Comece registrando uma nova piscina
                      </p>
                      {hasPermission("piscinas", "create") && (
                        <button
                          onClick={() => navigateToSection("nova-piscina")}
                          className="mt-3 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
                        >
                          Registrar Nova Piscina
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "manutencoes":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div>
                      <h1 className="text-lg font-semibold text-gray-900">
                        Manutenções
                      </h1>
                      <p className="text-sm text-gray-600">
                        {maintenance.length} manutenções registradas
                      </p>
                    </div>
                  </div>
                  {hasPermission("manutencoes", "create") && (
                    <button
                      onClick={() => navigateToSection("nova-manutencao")}
                      className="flex items-center space-x-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Nova Manutenção</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Maintenance List */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">
                    Lista de Manutenções
                  </h2>
                </div>
                <div className="p-4 space-y-3">
                  {maintenance.map((maint) => (
                    <div
                      key={maint.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                            <Wrench className="h-5 w-5 text-cyan-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {maint.poolName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Tipo: {maint.type}
                            </p>
                            <p className="text-sm text-gray-500">
                              Técnico: {maint.technician}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded-full ${
                                  maint.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : maint.status === "in_progress"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : maint.status === "scheduled"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {maint.status}
                              </span>
                              {maint.scheduledDate && (
                                <span className="text-xs text-gray-500">
                                  Data:{" "}
                                  {new Date(
                                    maint.scheduledDate,
                                  ).toLocaleDateString("pt-PT")}
                                </span>
                              )}
                            </div>
                            {maint.description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {maint.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {hasPermission("manutencoes", "edit") && (
                            <button
                              onClick={() => {
                                console.log("Edit maintenance:", maint.id);
                              }}
                              className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          )}
                          {hasPermission("manutencoes", "delete") && (
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Tem certeza que deseja eliminar esta manutenção?",
                                  )
                                ) {
                                  console.log("Delete maintenance:", maint.id);
                                }
                              }}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {maintenance.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Wrench className="h-6 w-6 text-cyan-600" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">
                        Nenhuma manutenção encontrada
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Comece agendando uma nova manutenção
                      </p>
                      {hasPermission("manutencoes", "create") && (
                        <button
                          onClick={() => navigateToSection("nova-manutencao")}
                          className="mt-3 px-3 py-1 bg-cyan-600 text-white text-xs rounded-lg hover:bg-cyan-700"
                        >
                          Agendar Nova Manutenção
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "utilizadores":
        if (currentUser?.role !== "super_admin") {
          return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Acesso Negado
                </h2>
                <p className="text-gray-600">
                  Apenas super administradores podem gerir utilizadores.
                </p>
              </div>
            </div>
          );
        }

        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-6">
              <UserPermissionsManager />
            </div>
          </div>
        );

      case "relatorios":
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="px-4 py-4 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900">
                      Relatórios
                    </h1>
                    <p className="text-sm text-gray-600">
                      Geração de relatórios do sistema
                    </p>
                  </div>
                </div>
              </div>

              {/* Report Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Relatório de Obras
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Relatório completo de todas as obras
                  </p>
                  <button
                    onClick={() => {
                      const doc = new jsPDF();
                      doc.text("Relatório de Obras", 20, 20);
                      doc.text(`Total de obras: ${works.length}`, 20, 40);
                      works.forEach((work, index) => {
                        doc.text(
                          `${index + 1}. ${work.title} - ${work.status}`,
                          20,
                          60 + index * 10,
                        );
                      });
                      doc.save("relatorio-obras.pdf");
                    }}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Gerar PDF
                  </button>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                    <Wrench className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Relatório de Manutenções
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Relatório de todas as manutenções
                  </p>
                  <button
                    onClick={() => {
                      const doc = new jsPDF();
                      doc.text("Relatório de Manutenções", 20, 20);
                      doc.text(
                        `Total de manutenções: ${maintenance.length}`,
                        20,
                        40,
                      );
                      maintenance.forEach((maint, index) => {
                        doc.text(
                          `${index + 1}. ${maint.poolName} - ${maint.type} - ${maint.status}`,
                          20,
                          60 + index * 10,
                        );
                      });
                      doc.save("relatorio-manutencoes.pdf");
                    }}
                    className="w-full bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors"
                  >
                    Gerar PDF
                  </button>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Waves className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Relatório de Piscinas
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Relatório de todas as piscinas
                  </p>
                  <button
                    onClick={() => {
                      const doc = new jsPDF();
                      doc.text("Relatório de Piscinas", 20, 20);
                      doc.text(`Total de piscinas: ${pools.length}`, 20, 40);
                      pools.forEach((pool, index) => {
                        doc.text(
                          `${index + 1}. ${pool.name} - ${pool.client} - ${pool.status}`,
                          20,
                          60 + index * 10,
                        );
                      });
                      doc.save("relatorio-piscinas.pdf");
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Gerar PDF
                  </button>
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

            {hasPermission("piscinas", "view") && (
              <button
                onClick={() => {
                  navigateToSection("piscinas");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === "piscinas"
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Waves className="mr-3 h-5 w-5" />
                Piscinas
              </button>
            )}

            {hasPermission("manutencoes", "view") && (
              <button
                onClick={() => {
                  navigateToSection("manutencoes");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === "manutencoes"
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Wrench className="mr-3 h-5 w-5" />
                Manutenções
              </button>
            )}

            {hasPermission("utilizadores", "view") && (
              <button
                onClick={() => {
                  navigateToSection("utilizadores");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === "utilizadores"
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Users className="mr-3 h-5 w-5" />
                Utilizadores
              </button>
            )}

            {hasPermission("relatorios", "view") && (
              <button
                onClick={() => {
                  navigateToSection("relatorios");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === "relatorios"
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BarChart3 className="mr-3 h-5 w-5" />
                Relatórios
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
  );
}

export default App;
