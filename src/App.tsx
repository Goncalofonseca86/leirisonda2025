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
import { DataIntegrityAlert } from "./components/DataIntegrityAlert";
// SECURITY: RegisterForm removed - only super admin can create users
import { AdminLogin } from "./admin/AdminLogin";
import { AdminPage } from "./admin/AdminPage";
import { useDataSync } from "./hooks/useDataSync";
import { authService, UserProfile } from "./services/authService";
import { useDataCleanup } from "./hooks/useDataCleanup";
import { useAutoSync } from "./hooks/useAutoSync";
import { dataIntegrityService } from "./services/dataIntegrityService";
import {
  registerServiceWorkerWithCleanup,
  forceReloadAndClear,
} from "./utils/cacheCleanup";

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
    name: "Alexandre",
    email: "alexandre@leirisonda.pt",
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
];

function App() {
  // SECURITY: Always start as not authenticated - NUNCA mudar para true
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Debug logging for authentication state changes removed to prevent loops

  // Monitoramento de integridade de dados
  useEffect(() => {
    // Iniciar monitoramento de integridade de dados
    dataIntegrityService.startIntegrityMonitoring();

    // Cleanup ao desmontar componente
    return () => {
      dataIntegrityService.stopIntegrityMonitoring();
    };
  }, []);

  // No auto-login - users must login manually
  useEffect(() => {
    // Clear any existing auth data on app start
    localStorage.removeItem("currentUser");
    localStorage.removeItem("mock-current-user");
    console.log("🔒 SECURITY: Auth data cleared - manual login required");
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  // SECURITY: Register form removed - only super admin can create users
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

  // Data cleanup hook
  const {
    cleanAllData,
    isLoading: cleanupLoading,
    error: cleanupError,
  } = useDataCleanup();

  // Auto-sync hook for automatic Firebase �� localStorage synchronization
  const autoSyncData = useAutoSync();
  const { syncStatus, isAutoSyncing } = autoSyncData;
  const autoSyncLastSync = autoSyncData.lastSync;

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
    // Try to restore user from localStorage once on mount
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  // Auth state check disabled to prevent errors
  // useEffect(() => {
  //   if (isAuthenticated && !currentUser) {
  //     console.warn("SECURITY: Inconsistent auth state detected");
  //     setIsAuthenticated(false);
  //     setCurrentUser(null);
  //     localStorage.removeItem("currentUser");
  //   }
  // }, [isAuthenticated, currentUser]);

  // SECURITY: Periodic auth check to prevent tampering
  // Periodic auth check disabled to prevent errors
  // useEffect(() => {
  //   const authCheckInterval = setInterval(() => {
  //     if (isAuthenticated && !currentUser) {
  //       console.warn("SECURITY: Auth state compromised, forcing logout");
  //       setIsAuthenticated(false);
  //       setCurrentUser(null);
  //       localStorage.removeItem("currentUser");
  //     }
  //   }, 5000);
  //   return () => clearInterval(authCheckInterval);
  // }, [isAuthenticated, currentUser]);

  // Initialize notification permission state and register service worker
  useEffect(() => {
    console.log("🔔 Initializing notifications...");
    if ("Notification" in window) {
      const permission = Notification.permission;
      console.log("🔔 Current notification permission:", permission);
      setPushPermission(permission);
      setNotificationsEnabled(permission === "granted");

      if (permission === "granted") {
        console.log("✅ Notifications already granted");
      } else if (permission === "denied") {
        console.warn("❌ Notifications denied by user");
      } else {
        console.log("⏳ Notifications permission not yet requested");
      }
    } else {
      console.warn("��� Notifications not supported in this browser");
    }

    // Register service worker with cache cleanup to prevent white page issues
    registerServiceWorkerWithCleanup();

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

  // Hash routing handled by window.hashchange event listener instead

  // Notify Alexandre about assigned works when he logs in - DISABLED to prevent loops
  // useEffect(() => {
  //   if (
  //     currentUser?.name.toLowerCase().includes("alexandre") &&
  //     works.length > 0
  //   ) {
      console.log("🔍 DEBUG Alexandre - Data loaded:", {
        currentUser: currentUser.name,
        worksCount: works.length,
        works: works.map((w) => ({
          id: w.id,
          title: w.title,
          assignedTo: w.assignedTo,
          assignedUsers: w.assignedUsers,
        })),
        localStorage: {
          pools: JSON.parse(localStorage.getItem("pools") || "[]").length,
          works: JSON.parse(localStorage.getItem("works") || "[]").length,
          maintenance: JSON.parse(localStorage.getItem("maintenance") || "[]")
            .length,
        },
      });

      // Find works assigned to Alexandre
      const alexandreWorks = works.filter(
        (work) =>
          work &&
          work.assignedTo &&
          (work.assignedTo.toLowerCase().includes("alexandre") ||
            work.assignedUsers?.some(
              (user) =>
                user.name && user.name.toLowerCase().includes("alexandre"),
            )),
      );

      // Notify Alexandre about his assigned works
      if (
        alexandreWorks.length > 0 &&
        notificationsEnabled &&
        Notification.permission === "granted"
      ) {
        console.log(
          "🔔 Sending notification to Alexandre about assigned works:",
          alexandreWorks.length,
        );

        setTimeout(() => {
          showNotification(
            "Obras Atribuídas",
            `Olá Alexandre! Tens ${alexandreWorks.length} obra${alexandreWorks.length > 1 ? "s" : ""} atribuída${alexandreWorks.length > 1 ? "s" : ""}.`,
            "work",
          );
        }, 2000); // Delay to ensure notification system is ready
      } else if (alexandreWorks.length > 0) {
        console.log("ℹ️ Alexandre has works but notifications are not enabled");
      }
    }
  }, [currentUser, works, notificationsEnabled]);

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

  const handleSaveIntervention = () => {
    // Validate required fields
    if (!maintenanceForm.poolId || !maintenanceForm.technician) {
      alert("Por favor, preencha os campos obrigatórios (Piscina e Técnico).");
      return;
    }

    // Get pool and technician names for display
    const selectedPool = pools.find((p) => p.id === maintenanceForm.poolId);
    const selectedTechnician = users.find(
      (u) => u.id === parseInt(maintenanceForm.technician),
    );

    // Save complete intervention data
    const interventionData = {
      id: Date.now(),
      poolId: maintenanceForm.poolId,
      poolName: selectedPool ? selectedPool.name : "Piscina Desconhecida",
      client: selectedPool ? selectedPool.client : "",
      date: maintenanceForm.date,
      startTime: maintenanceForm.startTime,
      endTime: maintenanceForm.endTime,
      technician: selectedTechnician
        ? selectedTechnician.name
        : maintenanceForm.technician,
      vehicle: maintenanceForm.vehicle,
      waterValues: {
        pH: maintenanceForm.pH,
        chlorine: maintenanceForm.chlorine,
        alkalinity: maintenanceForm.alkalinity,
        temperature: maintenanceForm.temperature,
      },
      workPerformed: maintenanceForm.workPerformed,
      otherWork: maintenanceForm.otherWork,
      problems: maintenanceForm.problems,
      observations: maintenanceForm.observations,
      nextMaintenance: maintenanceForm.nextMaintenance,
      status: maintenanceForm.status,
      photos: uploadedPhotos,
      photoCount: uploadedPhotos.length,
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage for persistence (in real app, would save to backend)
    const savedInterventions = JSON.parse(
      localStorage.getItem("interventions") || "[]",
    );
    savedInterventions.push(interventionData);
    localStorage.setItem("interventions", JSON.stringify(savedInterventions));

    // Add to maintenance sync system
    const newMaintenance = {
      poolId: interventionData.poolId,
      poolName: interventionData.poolName,
      type: "Manutenção Regular",
      scheduledDate: maintenanceForm.date,
      technician: interventionData.technician,
      status: maintenanceForm.status as
        | "pending"
        | "in_progress"
        | "completed"
        | "cancelled",
      description: maintenanceForm.workPerformed || "Manutenção realizada",
      notes: maintenanceForm.observations,
    };

    // Use sync system to add maintenance (will handle Firebase and localStorage)
    addMaintenance(newMaintenance);

    // Create future maintenance if next maintenance date is selected
    if (maintenanceForm.nextMaintenance) {
      const nextMaintenanceDate = new Date(maintenanceForm.nextMaintenance);
      const today = new Date();

      // Only create future maintenance if the date is in the future
      if (nextMaintenanceDate > today) {
        const futureMaintenance = {
          poolId: interventionData.poolId,
          poolName: interventionData.poolName,
          type: "Manutenção Programada",
          scheduledDate: maintenanceForm.nextMaintenance,
          technician: interventionData.technician,
          status: "scheduled" as const,
          description: "Manutenção programada automaticamente",
          notes: "Agendada automaticamente após manutenção anterior",
          clientName: selectedPool ? selectedPool.client : "",
          clientContact: "", // Could be populated from client data if available
          location: selectedPool ? selectedPool.location : "",
        };

        addMaintenance(futureMaintenance);
        console.log("Futura manutenção criada:", futureMaintenance);
      }
    }

    console.log("Manutenção salva com sucesso:", interventionData);

    let alertMessage = `Manutenção salva com sucesso! Piscina: ${interventionData.poolName}, Técnico: ${interventionData.technician}`;

    if (maintenanceForm.nextMaintenance) {
      const nextDate = new Date(
        maintenanceForm.nextMaintenance,
      ).toLocaleDateString("pt-PT");
      alertMessage += `\n\nPróxima manutenção agendada para: ${nextDate}`;
    }

    alert(alertMessage);

    // Clear form and photos after saving
    setMaintenanceForm({
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
    setUploadedPhotos([]);

    // Navigate back to maintenance list
    setActiveSection("manutencoes");
  };

  const handleShare = (platform) => {
    // Generate PDF and share logic would go here
    console.log(`Sharing via ${platform}`);
    // For demo purposes, just close modal and go back to piscinas
    setShowShareModal(false);
    setInterventionSaved(false);
    setActiveSection("piscinas");
  };

  // Authentication functions
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // Validate input first
    if (!loginForm.email || !loginForm.password) {
      setLoginError("Por favor, preencha todos os campos");
      return;
    }

    try {
      console.log("🔐 Attempting login for:", loginForm.email);
      console.log("🔐 Email:", loginForm.email);
      console.log("🔐 Password length:", loginForm.password?.length || 0);

      const result = await authService.login(
        loginForm.email,
        loginForm.password,
      );

      console.log("🔐 Auth result:", result);

      if (result.success && result.user) {
        console.log("✅ Login successful for:", result.user.email);

        // Clear any previous auth state
        setLoginError("");

        // Set user state and authentication
        setCurrentUser(result.user);
        setIsAuthenticated(true);
        localStorage.setItem("currentUser", JSON.stringify(result.user));

        // Clear login form
        setLoginForm({ email: "", password: "" });

        console.log("✅ Login state updated", {
          user: result.user.email,
          role: result.user.role,
          isAuthenticated: true,
        });

        // Use setTimeout to ensure state is set before navigation
        setTimeout(() => {
          // Handle any pending hash navigation after login
          const hash = window.location.hash.substring(1);
          if (hash && hash !== "login") {
            console.log("🔄 Navigating to hash section:", hash);
            setActiveSection(hash);
          } else {
            // Default to dashboard when no hash is present
            console.log("��� Navigating to dashboard");
            navigateToSection("dashboard");
          }
        }, 100);
      } else {
        console.warn("❌ Login failed:", result.error);
        setLoginError(result.error || "Credenciais inválidas");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      setLoginError("Erro de sistema. Por favor, tente novamente.");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("�� Initiating logout process...");

      // Close sidebar immediately
      setSidebarOpen(false);

      // Clear current user state immediately for better UX
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("currentUser");

      // Clear form and navigate to dashboard
      setLoginForm({ email: "", password: "" });
      navigateToSection("dashboard");

      // Perform actual logout
      await authService.logout();

      console.log("��� Logout completed successfully");
    } catch (error) {
      console.error("❌ Error during logout:", error);

      // Force clear state even if logout service fails
      setSidebarOpen(false);
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("currentUser");
      setLoginForm({ email: "", password: "" });
      navigateToSection("dashboard");

      console.log("🔧 Forced logout state clear completed");
    }
  };

  // Register functions
  // SECURITY: Register functions removed - only super admin can create users

  // Advanced settings functions
  const handleAdvancedPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (advancedPassword === "19867") {
      setIsAdvancedUnlocked(true);
      setAdvancedPasswordError("");
    } else {
      setAdvancedPasswordError("Palavra-passe incorreta");
    }
  };

  const handleAdvancedSettingsBack = () => {
    setShowAdvancedSettings(false);
    setIsAdvancedUnlocked(false);
    setAdvancedPassword("");
    setAdvancedPasswordError("");
  };

  // Data cleanup functions
  const handleDataCleanup = async () => {
    if (
      window.confirm(
        "ATENÇÃO: Esta ação vai eliminar permanentemente todas as obras, manutenções e piscinas. Os utilizadores serão mantidos. Confirma?",
      )
    ) {
      try {
        await cleanAllData();
        alert("Dados eliminados com sucesso! Aplicação agora está limpa.");
        setShowDataCleanup(false);
      } catch (error) {
        console.error("Erro na limpeza:", error);
        alert("Erro ao eliminar dados. Tente novamente.");
      }
    }
  };

  // Fixed back button function
  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to dashboard if no history
      navigateToSection("dashboard");
    }
  };

  // PDF Generation Functions
  const generatePoolsPDF = () => {
    const content = `
LEIRISONDA - RELATÓRIO DE PISCINAS
Data: ${new Date().toLocaleDateString("pt-PT")}

RESUMO:
- Total de Piscinas: ${pools.length}

DETALHES:
${pools
  .map(
    (pool, index) => `
${index + 1}. ${pool.name}
   Localização: ${pool.location}
   Cliente: ${pool.client}
   Tipo: ${pool.type}
   Estado: ${pool.status}
   ${pool.nextMaintenance ? `Próxima Manutenção: ${new Date(pool.nextMaintenance).toLocaleDateString("pt-PT")}` : ""}
`,
  )
  .join("\n")}

© ${new Date().getFullYear()} Leirisonda - Sistema de Gest��o
    `;
    downloadPDF(
      content,
      `Piscinas_${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  const generateMaintenancePDF = () => {
    const content = `
LEIRISONDA - RELATÓRIO DE MANUTENÇ��ES
Data: ${new Date().toLocaleDateString("pt-PT")}

RESUMO:
- Total de Manutenções: ${maintenance.length}
- Futuras Manutenç��es: ${futureMaintenance.length}

MANUTENÇÕES REALIZADAS:
${maintenance
  .map(
    (maint, index) => `
${index + 1}. ${maint.poolName}
   Tipo: ${maint.type}
   Estado: ${maint.status === "completed" ? "Concluída" : maint.status === "pending" ? "Pendente" : "Em Progresso"}
   Data Agendada: ${new Date(maint.scheduledDate).toLocaleDateString("pt-PT")}
   Técnico: ${maint.technician}
   Descrição: ${maint.description}
   ${maint.notes ? `Observações: ${maint.notes}` : ""}
`,
  )
  .join("\n")}

�� ${new Date().getFullYear()} Leirisonda - Sistema de Gestão
    `;
    downloadPDF(
      content,
      `Manutencoes_${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  const generateWorksPDF = () => {
    const content = `
LEIRISONDA - RELATÓRIO DE OBRAS
Data: ${new Date().toLocaleDateString("pt-PT")}

RESUMO:
- Total de Obras: ${works.length}

OBRAS REGISTADAS:
${works
  .map(
    (work, index) => `
${index + 1}. ${work.title}
   Cliente: ${work.client}
   Localizaç��o: ${work.location}
   Tipo: ${work.type}
   Estado: ${work.status === "completed" ? "Concluída" : work.status === "pending" ? "Pendente" : "Em Progresso"}
   Data Início: ${new Date(work.startDate).toLocaleDateString("pt-PT")}
   ${work.endDate ? `Data Fim: ${new Date(work.endDate).toLocaleDateString("pt-PT")}` : ""}
   ${work.budget ? `Or���amento: ��${work.budget.toLocaleString("pt-PT")}` : ""}
   ${work.actualCost ? `Custo Real: €${work.actualCost.toLocaleString("pt-PT")}` : ""}
   Responsável: ${work.assignedTo}
   Descrição: ${work.description}
`,
  )
  .join("\n")}

© ${new Date().getFullYear()} Leirisonda - Sistema de Gestão
    `;
    downloadPDF(content, `Obras_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const generateClientsPDF = () => {
    const content = `
LEIRISONDA - RELATÓRIO DE CLIENTES
Data: ${new Date().toLocaleDateString("pt-PT")}

RESUMO:
- Total de Clientes: ${clients.length}

CLIENTES REGISTADOS:
${clients
  .map(
    (client, index) => `
${index + 1}. ${client.name}
   Email: ${client.email}
   Telefone: ${client.phone}
   Morada: ${client.address}
   Piscinas: ${client.pools.length} associadas
   Data Registo: ${new Date(client.createdAt).toLocaleDateString("pt-PT")}
`,
  )
  .join("\n")}

© ${new Date().getFullYear()} Leirisonda - Sistema de Gestão
    `;
    downloadPDF(
      content,
      `Clientes_${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  const generateCompletePDF = () => {
    const content = `
LEIRISONDA - RELATÓRIO COMPLETO DO SISTEMA
Data: ${new Date().toLocaleDateString("pt-PT")}

RESUMO EXECUTIVO:
- Piscinas Registadas: ${pools.length}
- Manutenções Realizadas: ${maintenance.length}
- Futuras Manutenções: ${futureMaintenance.length}
- Obras em Curso: ${works.length}
- Clientes Ativos: ${clients.length}
- Utilizadores do Sistema: ${users.length}

ESTATÍSTICAS:
- Piscinas Ativas: ${pools.filter((p) => p.status === "Ativa").length}
- Manutenções Concluídas: ${maintenance.filter((m) => m.status === "completed").length}
- Obras Pendentes: ${works.filter((w) => w.status === "pending").length}

PRÓXIMAS AÇÕES:
${futureMaintenance
  .slice(0, 5)
  .map(
    (maint) =>
      `- ${maint.poolName}: ${maint.type} em ${new Date(maint.scheduledDate).toLocaleDateString("pt-PT")}`,
  )
  .join("\n")}

DADOS DETALHADOS:

=== PISCINAS ===
${pools
  .map(
    (pool, index) => `
${index + 1}. ${pool.name} (${pool.client})
   Status: ${pool.status} | Local: ${pool.location}
`,
  )
  .join("")}

=== MANUTENÇÕES RECENTES ===
${maintenance
  .slice(-5)
  .map(
    (maint, index) => `
${index + 1}. ${maint.poolName} - ${maint.type}
   Data: ${new Date(maint.scheduledDate).toLocaleDateString("pt-PT")} | Técnico: ${maint.technician}
`,
  )
  .join("")}

���� ${new Date().getFullYear()} Leirisonda - Sistema de Gestão
    `;
    downloadPDF(
      content,
      `Relatorio_Completo_${new Date().toISOString().split("T")[0]}.pdf`,
    );
  };

  const generateCustomPDF = () => {
    alert(
      "Funcionalidade de relatório personalizado em desenvolvimento. Use os relatórios pré-definidos por agora.",
    );
  };

  // Push Notification functions
  const requestNotificationPermission = async () => {
    console.log("🔔 Requesting notification permission...");
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        console.log("🔔 Permission result:", permission);
        setPushPermission(permission);
        if (permission === "granted") {
          setNotificationsEnabled(true);
          showNotification(
            "Notificações Ativadas",
            "Agora vai receber notificações de obras atribuídas",
            "success",
          );
          console.log("✅ Notifications enabled successfully");
        } else {
          console.warn("❌ Notification permission denied or dismissed");
        }
        return permission;
      } catch (error) {
        console.error("❌ Error requesting notification permission:", error);
        return "error";
      }
    }
    console.warn("❌ Notifications not supported in this browser");
    return "denied";
  };

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
    }
  };

  const sendWorkAssignmentNotification = (
    workTitle: string,
    assignedTo: string,
  ) => {
    console.log("🔍 DEBUG: sendWorkAssignmentNotification called with:", {
      workTitle,
      assignedTo,
      currentUser: currentUser?.name,
      notificationsEnabled,
      notificationPermission: Notification.permission,
    });

    // Always add to assigned works list when a work is assigned
    const newAssignedWork = {
      id: Date.now(),
      title: workTitle,
      assignedTo: assignedTo,
      dateAssigned: new Date().toISOString(),
      status: "Nova",
    };
    setAssignedWorks((prev) => [newAssignedWork, ...prev]);

    // Debug: Check notification conditions
    console.log("🔍 DEBUG: Notification conditions:", {
      hasCurrentUser: !!currentUser,
      currentUserName: currentUser?.name,
      assignedTo: assignedTo,
      userMatches: currentUser?.name === assignedTo,
      notificationsEnabled,
      permissionGranted: Notification.permission === "granted",
    });

    // Check if current user is the one assigned (exact match or partial match for combined assignments)
    const isAssignedToCurrentUser =
      currentUser &&
      assignedTo &&
      (assignedTo === currentUser.name ||
        assignedTo.toLowerCase().includes(currentUser.name.toLowerCase()) ||
        currentUser.name.toLowerCase().includes(assignedTo.toLowerCase()));

    console.log("🔍 DEBUG: Assignment check:", {
      currentUser: currentUser?.name,
      assignedTo,
      exactMatch: currentUser?.name === assignedTo,
      partialMatch: assignedTo
        .toLowerCase()
        .includes(currentUser?.name.toLowerCase()),
      isAssignedToCurrentUser,
    });

    // Send notification if user is assigned to current user and notifications are enabled
    if (isAssignedToCurrentUser) {
      if (notificationsEnabled && Notification.permission === "granted") {
        console.log("✅ All conditions met, sending notification...");
        showNotification(
          "Nova Obra Atribuída",
          `A obra "${workTitle}" foi-lhe atribuída`,
          "work-assignment",
        );
      } else {
        console.warn("❌ Notification blocked, using alert fallback:", {
          notificationsEnabled,
          permission: Notification.permission,
        });

        // Show alert as fallback for better user experience
        setTimeout(() => {
          alert(
            `�� Nova Obra Atribuída!\n\n📋 ${workTitle}\n\n👤 Atribu��da a: ${assignedTo}\n\n💡 Ative as notificações nas configurações para receber alertas automáticos.`,
          );
        }, 1000);
      }
    } else {
      console.log("ℹ️ Notification not for current user:", {
        currentUser: currentUser?.name,
        assignedTo,
        isAssignedToCurrentUser,
      });
    }

    // Console log for debugging purposes (admin view)
    console.log(`🏗️ OBRA ATRIBUÍDA: "${workTitle}" → ${assignedTo}`);
    console.log(`📋 Total de obras atribuídas: ${assignedWorks.length + 1}`);
  };

  const testPushNotification = () => {
    if (Notification.permission === "granted") {
      showNotification(
        "Teste de Notificação",
        "As notificações estão a funcionar corretamente!",
        "test",
      );
    } else {
      alert(
        "As notificaç����es não est���o ativadas. Active-as primeiro nas configurações.",
      );
    }
  };

  // Photo management functions
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + uploadedPhotos.length > 20) {
      alert("Máximo de 20 fotografias permitidas");
      return;
    }

    files.forEach((file: File) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const newPhoto = {
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            data: e.target?.result,
            timestamp: new Date().toISOString(),
          };
          setUploadedPhotos((prev) => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (photoId: any) => {
    setUploadedPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  const clearAllPhotos = () => {
    setUploadedPhotos([]);
  };

  // Clear photos and work type when changing sections
  useEffect(() => {
    if (activeSection !== "nova-obra" && activeSection !== "nova-manutencao") {
      setUploadedPhotos([]);
    }
    if (activeSection !== "nova-obra") {
      setSelectedWorkType("");
      setWorkVehicles([]);
      setWorkTechnicians([]);
      setCurrentVehicle("");
      setCurrentTechnician("");
      setAssignedUsers([]);
      setCurrentAssignedUser("");
    }
  }, [activeSection]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const fakeEvent = { target: { files } };
    handlePhotoUpload(fakeEvent);
  };

  const downloadPDF = (content: string, filename: string) => {
    try {
      const pdf = new jsPDF();

      // Set font size and line height
      pdf.setFontSize(12);
      const lineHeight = 6;

      // Split content into lines and handle page breaks
      const lines = content.split("\n");
      let yPosition = 20;

      lines.forEach((line) => {
        // Check if we need a new page
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }

        // Handle long lines by splitting them
        const maxWidth = 180;
        const splitLines = pdf.splitTextToSize(line, maxWidth);

        splitLines.forEach((splitLine: string) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(splitLine, 10, yPosition);
          yPosition += lineHeight;
        });
      });

      // Save the PDF
      const pdfFilename = filename.replace(".txt", ".pdf");
      pdf.save(pdfFilename);

      // Show success message
      alert(`Relatório "${pdfFilename}" gerado com sucesso!`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar o relatório PDF. Tente novamente.");
    }
  };

  // User management functions
  const handleAddUser = () => {
    setEditingUser(null);
    setUserForm({
      name: "",
      email: "",
      password: "",
      role: "technician",
      permissions: {
        obras: { view: false, create: false, edit: false, delete: false },
        manutencoes: { view: false, create: false, edit: false, delete: false },
        piscinas: { view: false, create: false, edit: false, delete: false },
        utilizadores: {
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        relatorios: { view: false, create: false, edit: false, delete: false },
        clientes: { view: false, create: false, edit: false, delete: false },
      },
      active: true,
    });
    setShowUserForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      permissions: { ...user.permissions },
      active: user.active,
    });
    setShowUserForm(true);
  };

  // Confirmation function for deletions
  const confirmDelete = (message: string, onConfirm: () => void) => {
    if (window.confirm(message)) {
      onConfirm();
    }
  };

  // Permission check function
  const hasPermission = (module: string, action: string): boolean => {
    if (!currentUser || !currentUser.permissions) return false;
    return currentUser.permissions[module]?.[action] || false;
  };

  // Utility functions for clickable links
  const handlePhoneClick = (phone: string) => {
    if (enablePhoneDialer && phone) {
      // Clean phone number (remove spaces, dashes, etc)
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
      window.location.href = `tel:${cleanPhone}`;
    }
  };

  const handleAddressClick = (address: string) => {
    if (enableMapsRedirect && address) {
      // Open Google Maps with the address
      const encodedAddress = encodeURIComponent(address);
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
        "_blank",
      );
    }
  };

  // Settings persistence functions
  const togglePhoneDialer = (enabled: boolean) => {
    setEnablePhoneDialer(enabled);
    localStorage.setItem("enablePhoneDialer", enabled.toString());
  };

  const toggleMapsRedirect = (enabled: boolean) => {
    setEnableMapsRedirect(enabled);
    localStorage.setItem("enableMapsRedirect", enabled.toString());
  };

  const handleDeleteUser = (userId) => {
    // Check if it's the main user
    const user = users.find(
      (u) => u.id === userId || u.id === parseInt(userId),
    );
    if (user && user.email === "gongonsilva@gmail.com") {
      alert("Não pode eliminar o utilizador principal!");
      return;
    }

    confirmDelete(
      `Tem a certeza que deseja apagar o utilizador "${user?.name}"?`,
      () => {
        setUsers(users.filter((u) => u.id !== userId));
      },
    );
  };

  const handleSaveUser = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      if (editingUser) {
        // Update existing user
        setUsers(
          users.map((u) =>
            u.id === editingUser.id
              ? {
                  ...u,
                  ...userForm,
                }
              : u,
          ),
        );

        console.log(`Utilizador ${userForm.name} atualizado com sucesso`);
      } else {
        // Add new user
        const newUser = {
          id: Math.max(...users.map((u) => u.id)) + 1,
          ...userForm,
          createdAt: new Date().toISOString().split("T")[0],
        };
        setUsers([...users, newUser]);

        // Try to register with Firebase for automatic synchronization
        try {
          const result = await authService.register(
            userForm.email,
            userForm.password,
            userForm.name,
            userForm.role as "super_admin" | "manager" | "technician",
          );

          if (result.success) {
            console.log(
              `✅ Utilizador ${userForm.name} criado e sincronizado automaticamente com Firebase`,
            );

            // Show success message
            setTimeout(() => {
              alert(
                `Utilizador ${userForm.name} criado e sincronizado com sucesso!`,
              );
            }, 100);
          } else {
            console.log(
              `⚠️ Utilizador ${userForm.name} criado localmente. Sincronização Firebase: ${result.error}`,
            );
          }
        } catch (syncError) {
          console.log(
            `����� Utilizador ${userForm.name} criado localmente. Erro de sincronizaç��o:`,
            syncError,
          );
        }
      }

      setShowUserForm(false);
    } catch (error) {
      console.error("Erro ao salvar utilizador:", error);
      alert("Erro ao salvar utilizador. Tente novamente.");
    }
  };

  const handlePermissionChange = (module, permission, value) => {
    setUserForm({
      ...userForm,
      permissions: {
        ...userForm.permissions,
        [module]: {
          ...userForm.permissions[module],
          [permission]: value,
        },
      },
    });
  };

  const setRolePermissions = (role) => {
    let permissions = {
      obras: { view: false, create: false, edit: false, delete: false },
      manutencoes: { view: false, create: false, edit: false, delete: false },
      piscinas: { view: false, create: false, edit: false, delete: false },
      utilizadores: { view: false, create: false, edit: false, delete: false },
      relatorios: { view: false, create: false, edit: false, delete: false },
      clientes: { view: false, create: false, edit: false, delete: false },
    };

    switch (role) {
      case "super_admin":
        permissions = {
          obras: { view: true, create: true, edit: true, delete: true },
          manutencoes: { view: true, create: true, edit: true, delete: true },
          piscinas: { view: true, create: true, edit: true, delete: true },
          utilizadores: { view: true, create: true, edit: true, delete: true },
          relatorios: { view: true, create: true, edit: true, delete: true },
          clientes: { view: true, create: true, edit: true, delete: true },
        };
        break;
      case "manager":
        permissions = {
          obras: { view: true, create: true, edit: true, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: true, edit: true, delete: false },
          utilizadores: {
            view: true,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: true, edit: false, delete: false },
          clientes: { view: true, create: true, edit: true, delete: false },
        };
        break;
      case "technician":
        permissions = {
          obras: { view: true, create: false, edit: true, delete: false },
          manutencoes: { view: true, create: true, edit: true, delete: false },
          piscinas: { view: true, create: false, edit: true, delete: false },
          utilizadores: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: false, edit: false, delete: false },
          clientes: { view: true, create: false, edit: false, delete: false },
        };
        break;
      case "viewer":
        permissions = {
          obras: { view: true, create: false, edit: false, delete: false },
          manutencoes: {
            view: true,
            create: false,
            edit: false,
            delete: false,
          },
          piscinas: { view: true, create: false, edit: false, delete: false },
          utilizadores: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          relatorios: { view: true, create: false, edit: false, delete: false },
          clientes: { view: true, create: false, edit: false, delete: false },
        };
        break;
      default:
        permissions = userForm.permissions;
    }

    setUserForm({
      ...userForm,
      role,
      permissions,
    });
  };

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", path: "/dashboard" },
    { id: "obras", icon: Building2, label: "Obras", path: "/obras" },
    { id: "nova-obra", icon: Plus, label: "Nova Obra", path: "/obras/nova" },
    {
      id: "nova-manutencao",
      icon: Wrench,
      label: "Nova Manutenção",
      path: "/manutencao/nova",
    },
    {
      id: "futuras-manutencoes",
      icon: Waves,
      label: "Piscinas",
      path: "/piscinas",
    },
    {
      id: "utilizadores",
      icon: UserCheck,
      label: "Utilizadores",
      path: "/utilizadores",
    },
    {
      id: "relatorios",
      icon: BarChart3,
      label: "Relatórios",
      path: "/relatorios",
    },
    { id: "clientes", icon: Users, label: "Clientes", path: "/clientes" },
    {
      id: "configuracoes",
      icon: Settings,
      label: "Configurações",
      path: "/configuracoes",
    },
    {
      id: "admin",
      icon: Shield,
      label: "Administração",
      path: "/admin",
      requiresAuth: true,
    },
  ];

  const renderContent = () => {
    // Add loading state check with timeout
    if (!currentUser || !isAuthenticated) {
      console.log("🔄 renderContent: Waiting for auth state", {
        currentUser: !!currentUser,
        isAuthenticated,
        activeSection,
      });
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">A carregar aplicação...</p>
            <p className="mt-2 text-sm text-gray-500">
              Se esta mensagem persistir, recarregue a página
            </p>
          </div>
        </div>
      );
    }

    console.log("✅ renderContent: Auth state valid, rendering", {
      activeSection,
      userRole: currentUser?.role,
    });

    // Add error boundary
    try {
      switch (activeSection) {
        case "dashboard":
          const currentDate = new Date();
          const formatDate = (date: Date) => {
            const days = [
              "domingo",
              "segunda-feira",
              "terça-feira",
              "quarta-feira",
              "quinta-feira",
              "sexta-feira",
              "sábado",
            ];
            const months = [
              "janeiro",
              "fevereiro",
              "março",
              "abril",
              "maio",
              "junho",
              "julho",
              "agosto",
              "setembro",
              "outubro",
              "novembro",
              "dezembro",
            ];

            const dayName = days[date.getDay()];
            const day = date.getDate().toString().padStart(2, "0");
            const month = months[date.getMonth()];

            return `${dayName}, ${day} de ${month}`;
          };

          const formatTime = (date: Date) => {
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
          };

          return (
            <div className="min-h-screen bg-gray-50">
              {/* Header */}
              <div className="flex items-center p-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 mr-3"
                >
                  <Menu className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Main Content */}
              <div className="px-6">
                {/* User Greeting Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                          alt="Leirisonda Logo"
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <h1 className="text-2xl font-medium text-gray-900">
                        Olá, {currentUser?.name?.split(" ")[0] || "Utilizador"}
                      </h1>
                      <h2 className="text-2xl font-medium text-gray-900 -mt-1">
                        {currentUser?.name?.split(" ").slice(1).join(" ") || ""}
                      </h2>
                      <div className="flex items-center space-x-4 mt-2 text-gray-600">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-gray-400 rounded flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded"></div>
                          </div>
                          <span className="text-sm">
                            {formatDate(currentDate)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                          </div>
                          <span className="text-sm">
                            {formatTime(currentDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Online</span>
                  </div>
                </div>

                {/* Status Cards */}
                <div className="space-y-4">
                  {/* Pendentes */}
                  <button
                    onClick={() => navigateToSection("obras")}
                    className="w-full bg-white rounded-2xl shadow-sm border-l-4 border-red-500 hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-red-500 rounded-full relative">
                            <div className="absolute top-1 left-1 w-1 h-3 bg-red-500 rounded-full"></div>
                            <div className="absolute top-2 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                          </div>
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-medium text-gray-900">
                            Pendentes
                          </h3>
                          <p className="text-sm text-gray-500">
                            Necessitam atenção
                          </p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900">
                        {works.filter((w) => w.status === "pending").length}
                      </div>
                    </div>
                  </button>

                  {/* Em Progresso */}
                  <button
                    onClick={() => navigateToSection("obras")}
                    className="w-full bg-white rounded-2xl shadow-sm border-l-4 border-orange-500 hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                          <div className="relative w-6 h-6">
                            <div className="absolute inset-0 border-2 border-orange-500 rounded"></div>
                            <div className="absolute bottom-0 left-0 w-3 h-1 bg-orange-500 rounded-full"></div>
                            <div className="absolute top-1 right-1 w-1 h-2 bg-orange-500 rounded-full"></div>
                          </div>
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-medium text-gray-900">
                            Em Progresso
                          </h3>
                          <p className="text-sm text-gray-500">A decorrer</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900">
                        {works.filter((w) => w.status === "in_progress").length}
                      </div>
                    </div>
                  </button>

                  {/* Concluídas */}
                  <button
                    onClick={() => navigateToSection("obras")}
                    className="w-full bg-white rounded-2xl shadow-sm border-l-4 border-green-500 hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-green-500 rounded-full flex items-center justify-center">
                            <div className="w-3 h-2 border-l-2 border-b-2 border-green-500 transform rotate-[-45deg] translate-y-[-1px]"></div>
                          </div>
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-medium text-gray-900">
                            Concluídas
                          </h3>
                          <p className="text-sm text-gray-500">Finalizadas</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900">
                        {works.filter((w) => w.status === "completed").length}
                      </div>
                    </div>
                  </button>

                  {/* Folhas por Fazer */}
                  <button
                    onClick={() => navigateToSection("obras")}
                    className="w-full bg-white rounded-2xl shadow-sm border-l-4 border-red-500 hover:bg-gray-50 transition-colors"
                  >
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                          <div className="w-6 h-6 relative">
                            <div className="w-4 h-5 border-2 border-red-500 rounded-sm"></div>
                            <div className="absolute top-1 left-1 w-2 h-0.5 bg-red-500 rounded"></div>
                            <div className="absolute top-2 left-1 w-2 h-0.5 bg-red-500 rounded"></div>
                            <div className="absolute top-3 left-1 w-1 h-0.5 bg-red-500 rounded"></div>
                          </div>
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-medium text-gray-900">
                            Folhas por Fazer
                          </h3>
                          <p className="text-sm text-gray-500">Por preencher</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900">
                        {
                          works.filter(
                            (w) => !w.folhaGerada && w.status !== "completed",
                          ).length
                        }
                      </div>
                    </div>
                  </button>
                </div>

                {/* Bottom Section */}
                <div className="mt-8 mb-4">
                  <button
                    onClick={() => navigateToSection("obras")}
                    className="w-full bg-black text-white py-4 rounded-2xl font-medium"
                  >
                    Todas as Obras
                  </button>
                </div>

                {/* Lista de Obras Atribuídas */}
                {assignedWorks.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm">
                    <div className="flex items-center p-4 border-b border-gray-100">
                      <Building2 className="h-5 w-5 text-purple-600 mr-3" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        Minhas Obras Atribuídas
                      </h2>
                    </div>
                    <div className="p-4 space-y-3">
                      {assignedWorks.map((work) => (
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
                                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                                  <span>📍</span>
                                  <span>
                                    Atribuída em:{" "}
                                    {new Date(
                                      work.dateAssigned,
                                    ).toLocaleDateString("pt-PT")}
                                  </span>
                                </div>
                                <span
                                  className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                                    work.status === "Nova"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {work.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  const updatedWorks = assignedWorks.map((w) =>
                                    w.id === work.id
                                      ? { ...w, status: "Em Progresso" }
                                      : w,
                                  );
                                  setAssignedWorks(updatedWorks);
                                }}
                                className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                              >
                                Iniciar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {assignedWorks.some((work) => work.status === "Nova") && (
                      <div className="p-4 pt-0">
                        <div className="text-center">
                          <button
                            onClick={() => {
                              const updatedWorks = assignedWorks.map((w) => ({
                                ...w,
                                status: "Em Progresso",
                              }));
                              setAssignedWorks(updatedWorks);

                              showNotification(
                                "✅ Todas as suas obras foram iniciadas!",
                                "Sucesso",
                                true,
                              );
                            }}
                            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                          >
                            Iniciar Todas as Minhas Obras
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Statistics Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Estatísticas Gerais
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {pools.length}
                      </div>
                      <div className="text-sm text-blue-800">
                        Piscinas Totais
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {works.length}
                      </div>
                      <div className="text-sm text-green-800">Obras Totais</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {maintenance.length}
                      </div>
                      <div className="text-sm text-orange-800">
                        Manutenções Registadas
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {clients.length}
                      </div>
                      <div className="text-sm text-purple-800">
                        Clientes Ativos
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notification Settings - Only for authenticated users */}
                {currentUser && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Notificações Push
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Ativar para receber alertas de novas atribuições
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${
                            pushPermission === "granted"
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {pushPermission === "granted"
                            ? "Ativadas"
                            : pushPermission === "denied"
                              ? "Bloqueadas"
                              : "Desativadas"}
                        </div>
                        <div className="text-xs text-gray-400">
                          {pushPermission}
                        </div>
                      </div>
                    </div>

                    {pushPermission !== "granted" && (
                      <button
                        onClick={requestNotificationPermission}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-3"
                      >
                        <Bell className="h-4 w-4 inline mr-2" />
                        Ativar Notificações Push
                      </button>
                    )}

                    {pushPermission === "granted" && (
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            sendWorkAssignmentNotification(
                              "Teste de Notificação",
                              currentUser.name,
                            );
                          }}
                          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Bell className="h-4 w-4 inline mr-2" />
                          Testar Notificação
                        </button>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">
                            Receber notificações
                          </span>
                          <button
                            onClick={() =>
                              setNotificationsEnabled(!notificationsEnabled)
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              notificationsEnabled
                                ? "bg-blue-600"
                                : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notificationsEnabled
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">
                            ✅ Notificações ativadas e funcionais
                          </p>
                        </div>
                      </div>
                    )}

                    {pushPermission === "denied" && (
                      <div className="p-4 bg-red-50 rounded-lg">
                        <p className="text-red-800 text-sm font-medium mb-2">
                          ❌ Notificações Bloqueadas
                        </p>
                        <p className="text-red-700 text-xs">
                          As notificações foram bloqueadas. Para ativar:
                        </p>
                        <ol className="text-red-700 text-xs mt-2 space-y-1 ml-4">
                          <li>1. Clique no ícone do cadeado na barra de URL</li>
                          <li>2. Altere "Notificações" para "Permitir"</li>
                          <li>3. Recarregue a página</li>
                        </ol>
                      </div>
                    )}
                  </div>
                )}

                {/* App Installation Prompt */}
                <InstallPrompt />

                {/* Sync Status */}
                <SyncStatusDisplay />
              </div>
            </div>
          );

        default:
          return <div>Página não encontrada</div>;
      }
    } catch (error) {
      console.error("Error rendering content:", error);
      return <div>Erro interno. Verifique o console.</div>;
    }
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-20 w-20 bg-white rounded-xl shadow-lg flex items-center justify-center mb-6">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                alt="Leirisonda Logo"
                className="h-12 w-12 object-contain"
              />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Leirisonda
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sistema de gestão de piscinas e obras
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                />
              </div>
            </div>

            {loginError && (
              <div className="text-red-600 text-sm text-center">
                {loginError}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Entrar
              </button>
            </div>
          </form>

          {/* Floating Advanced Settings Button */}
          <button
            onClick={() => setShowAdvancedSettings(true)}
            className="fixed bottom-4 right-4 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-xl transition-all duration-200"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  // Handle Advanced Settings
  if (showAdvancedSettings) {
    if (isAdvancedUnlocked) {
      return (
        <AdvancedSettings
          onBack={handleAdvancedSettingsBack}
          onNavigateToSection={(section) => {
            if (
              section === "utilizadores" &&
              currentUser?.role !== "super_admin"
            ) {
              console.log(
                "❌ Access denied: User management requires authentication",
              );
              return;
            }
            navigateToSection(section);
            setShowAdvancedSettings(false);
            setIsAdvancedUnlocked(false);
          }}
          dataSync={dataSync}
          notifications={{
            pushPermission,
            notificationsEnabled,
            requestNotificationPermission,
            testPushNotification: () =>
              sendWorkAssignmentNotification(
                "Teste de Notificação",
                currentUser.name,
              ),
            sendWorkAssignmentNotification,
          }}
        />
      );
    } else {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Configurações Avançadas
            </h2>
            <p className="text-gray-600">
              Insira a palavra-passe para aceder às configurações avançadas
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (advancedPassword === "19867") {
                  setIsAdvancedUnlocked(true);
                  setSettingsPasswordError("");
                } else {
                  setSettingsPasswordError("Palavra-passe incorreta");
                }
              }}
              className="mt-4 space-y-4"
            >
              <input
                type="password"
                value={advancedPassword}
                onChange={(e) => setAdvancedPassword(e.target.value)}
                placeholder="Palavra-passe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {settingsPasswordError && (
                <p className="text-red-600 text-sm">{settingsPasswordError}</p>
              )}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdvancedSettings(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }

  return (
    <AutoSyncProvider
      enabled={false}
      syncInterval={15000}
      collections={["users", "pools", "maintenance", "works", "clients"]}
      showNotifications={false}
    >
      {renderContent()}
    </AutoSyncProvider>
  );
}

export default App;