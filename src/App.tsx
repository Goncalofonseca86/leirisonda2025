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
];

function App() {
  // SECURITY: Always start as not authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  // Mock data states
  const [works, setWorks] = useState([
    {
      id: 1,
      title: "Instalação de Piscina - Vila Nova",
      status: "pending",
      client: "João Silva",
      location: "Vila Nova de Gaia",
      priority: "high",
      assignedTo: "Maria Silva",
      createdAt: "2024-01-15",
      folhaGerada: false,
    },
    {
      id: 2,
      title: "Reparação de Bomba - Porto",
      status: "in_progress",
      client: "Ana Costa",
      location: "Porto",
      priority: "medium",
      assignedTo: "João Santos",
      createdAt: "2024-01-16",
      folhaGerada: true,
    },
    {
      id: 3,
      title: "Manutenção Anual - Matosinhos",
      status: "completed",
      client: "Pedro Oliveira",
      location: "Matosinhos",
      priority: "low",
      assignedTo: "Maria Silva",
      createdAt: "2024-01-10",
      folhaGerada: true,
    },
  ]);

  const [pools, setPools] = useState([
    {
      id: 1,
      name: "Piscina Residencial Silva",
      client: "João Silva",
      location: "Vila Nova de Gaia",
      type: "Residencial",
      status: "Ativa",
      nextMaintenance: "2024-02-15",
    },
    {
      id: 2,
      name: "Piscina Hotel Mar",
      client: "Hotel do Mar",
      location: "Porto",
      type: "Comercial",
      status: "Ativa",
      nextMaintenance: "2024-02-20",
    },
  ]);

  const [maintenance, setMaintenance] = useState([
    {
      id: 1,
      poolId: 1,
      poolName: "Piscina Residencial Silva",
      type: "Limpeza",
      date: "2024-01-15",
      technician: "João Santos",
      notes: "Limpeza geral realizada",
      status: "completed",
    },
  ]);

  const [clients, setClients] = useState([
    {
      id: 1,
      name: "João Silva",
      email: "joao.silva@email.com",
      phone: "912345678",
      address: "Vila Nova de Gaia",
    },
    {
      id: 2,
      name: "Hotel do Mar",
      email: "info@hotelmar.pt",
      phone: "223456789",
      address: "Porto",
    },
  ]);

  // Initialize authentication state - ONLY ONCE
  useEffect(() => {
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

  // Navigation function
  const navigateToSection = (section: string) => {
    setActiveSection(section);
    // Update URL hash for PWA support
    if (section !== "futuras-manutencoes") {
      window.history.replaceState(null, "", `#${section}`);
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  // Permission check function
  const hasPermission = (resource: string, action: string) => {
    return currentUser?.permissions?.[resource]?.[action] || false;
  };

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
      setLoginError("Erro de sistema. Por favor, tente novamente.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    navigateToSection("dashboard");
  };

  // Render content based on active section
  const renderContent = () => {
    if (!currentUser || !isAuthenticated) {
      return <div>Carregando...</div>;
    }

    switch (activeSection) {
      case "dashboard":
        return (
          <div className="min-h-screen bg-gray-50">
            {/* Dashboard Content - Mobile First Design */}
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
                    <p className="text-gray-600 text-sm">
                      Bem-vindo ao sistema Leirisonda
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Cards */}
              <div className="space-y-3">
                {/* Pendentes */}
                <button
                  onClick={() => navigateToSection("obras")}
                  className="w-full bg-white rounded-lg border-l-4 border-red-500 p-4 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Pendentes
                      </h3>
                      <p className="text-sm text-gray-500">
                        Obras necessitam atenção
                      </p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      {works.filter((w) => w.status === "pending").length}
                    </div>
                  </div>
                </button>

                {/* Em Progresso */}
                <button
                  onClick={() => navigateToSection("obras")}
                  className="w-full bg-white rounded-lg border-l-4 border-orange-500 p-4 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Em Progresso
                      </h3>
                      <p className="text-sm text-gray-500">
                        Obras em andamento
                      </p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      {works.filter((w) => w.status === "in_progress").length}
                    </div>
                  </div>
                </button>

                {/* Concluídas */}
                <button
                  onClick={() => navigateToSection("obras")}
                  className="w-full bg-white rounded-lg border-l-4 border-green-500 p-4 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Concluídas
                      </h3>
                      <p className="text-sm text-gray-500">Obras finalizadas</p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      {works.filter((w) => w.status === "completed").length}
                    </div>
                  </div>
                </button>

                {/* Falta de Folhas de Obra */}
                <button
                  onClick={() => navigateToSection("obras")}
                  className="w-full bg-white rounded-lg border-l-4 border-blue-500 p-4 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Falta de Folhas de Obra
                      </h3>
                      <p className="text-sm text-gray-500">
                        Folhas não geradas
                      </p>
                    </div>
                    <div className="text-4xl font-bold text-gray-900">
                      {
                        works.filter(
                          (w) => !w.folhaGerada && w.status !== "completed",
                        ).length
                      }
                    </div>
                  </div>
                </button>
              </div>

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
                    <div className="text-sm text-blue-800">Piscinas Totais</div>
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
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Obras</h1>
                      <p className="text-gray-600 text-sm">
                        Gestão de obras e projetos
                      </p>
                    </div>
                  </div>
                  {hasPermission("obras", "create") && (
                    <button
                      onClick={() => navigateToSection("nova-obra")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Nova Obra</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Works List */}
              <div className="space-y-4">
                {works.map((work) => (
                  <div
                    key={work.id}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {work.title}
                        </h3>
                        <p className="text-gray-600">Cliente: {work.client}</p>
                        <p className="text-gray-600">📍 {work.location}</p>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                            work.status === "pending"
                              ? "bg-red-100 text-red-800"
                              : work.status === "in_progress"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {work.status === "pending"
                            ? "Pendente"
                            : work.status === "in_progress"
                              ? "Em Progresso"
                              : "Concluída"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {hasPermission("obras", "edit") && (
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        {hasPermission("obras", "delete") && (
                          <button className="p-2 text-gray-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Waves className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">
                        Piscinas
                      </h1>
                      <p className="text-gray-600 text-sm">
                        Gestão de piscinas e clientes
                      </p>
                    </div>
                  </div>
                  {hasPermission("piscinas", "create") && (
                    <button
                      onClick={() => navigateToSection("nova-piscina")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Nova Piscina</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Pool List */}
              <div className="space-y-4">
                {pools.map((pool) => (
                  <div
                    key={pool.id}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {pool.name}
                        </h3>
                        <p className="text-gray-600">📍 {pool.location}</p>
                        <p className="text-gray-600">Cliente: {pool.client}</p>
                        <p className="text-gray-600">Tipo: {pool.type}</p>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                            pool.status === "Ativa"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {pool.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {hasPermission("piscinas", "edit") && (
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        {hasPermission("piscinas", "delete") && (
                          <button className="p-2 text-gray-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">
                        Manutenções
                      </h1>
                      <p className="text-gray-600 text-sm">
                        Histórico de manutenções
                      </p>
                    </div>
                  </div>
                  {hasPermission("manutencoes", "create") && (
                    <button
                      onClick={() => navigateToSection("nova-manutencao")}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Nova Manutenção</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Maintenance List */}
              <div className="space-y-4">
                {maintenance.map((maint) => (
                  <div
                    key={maint.id}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {maint.type} - {maint.poolName}
                        </h3>
                        <p className="text-gray-600">Data: {maint.date}</p>
                        <p className="text-gray-600">
                          Técnico: {maint.technician}
                        </p>
                        <p className="text-gray-600">Notas: {maint.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="min-h-screen bg-gray-50 p-4">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Página em construção
              </h2>
              <p className="text-gray-600">
                Esta seção será implementada em breve.
              </p>
              <button
                onClick={() => navigateToSection("dashboard")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  // Render login page
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
                <input
                  id="email"
                  name="email"
                  type="email"
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
                <input
                  id="password"
                  name="password"
                  type="password"
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
            onClick={() => alert("Configurações avançadas em desenvolvimento")}
            className="fixed bottom-4 right-4 w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 hover:shadow-xl transition-all duration-200"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  // Main app with sidebar
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F459ad019cfee4b38a90f9f0b3ad0daeb?format=webp&width=800"
                  alt="Leirisonda Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Gestão de Serviços</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <button
              onClick={() => {
                navigateToSection("dashboard");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === "dashboard"
                  ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </button>

            {hasPermission("obras", "view") && (
              <button
                onClick={() => {
                  navigateToSection("obras");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "obras"
                    ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Building2 className="h-5 w-5" />
                <span>Obras</span>
              </button>
            )}

            {hasPermission("manutencoes", "view") && (
              <button
                onClick={() => {
                  navigateToSection("manutencoes");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "manutencoes"
                    ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Wrench className="h-5 w-5" />
                <span>Manutenções</span>
              </button>
            )}

            {hasPermission("piscinas", "view") && (
              <button
                onClick={() => {
                  navigateToSection("piscinas");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === "piscinas"
                    ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Waves className="h-5 w-5" />
                <span>Piscinas</span>
              </button>
            )}
          </nav>

          {/* User Section */}
          <div className="px-4 py-6 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-sm text-gray-500">{currentUser.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Terminar Sessão</span>
            </button>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">© 2025 Leirisonda</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-20 left-4 z-60">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white p-2 rounded-md shadow-md"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-80">{renderContent()}</div>
    </div>
  );
}

export default App;
