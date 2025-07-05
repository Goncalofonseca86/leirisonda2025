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

// SECURITY: RegisterForm removed - only super admin can create users
import { AdminLogin } from "./admin/AdminLogin";
import { AdminPage } from "./admin/AdminPage";
import { useDataSync } from "./hooks/useDataSync";
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

  // Debug logging for authentication state changes
  useEffect(() => {
    console.log("�� Auth State Debug:", {
      isAuthenticated,
      currentUser: currentUser
        ? `${currentUser.name} (${currentUser.email})`
        : null,
      timestamp: new Date().toISOString(),
    });
  }, [isAuthenticated, currentUser]);

  // Monitoramento de integridade de dados
  useEffect(() => {
    // Cleanup ao desmontar componente
    return () => {
      // Cleanup functions if needed
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
