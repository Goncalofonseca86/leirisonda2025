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

  // Mock data
  const [works] = useState([
    { id: 1, title: "Obra 1", status: "pending" },
    { id: 2, title: "Obra 2", status: "in_progress" },
    { id: 3, title: "Obra 3", status: "completed" },
  ]);

  const [pools] = useState([
    { id: 1, name: "Piscina 1", client: "Cliente 1" },
    { id: 2, name: "Piscina 2", client: "Cliente 2" },
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
        setActiveSection("dashboard");
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
    setActiveSection("dashboard");
  };

  // Render content based on active section
  const renderContent = () => {
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
              <button onClick={() => setSidebarOpen(true)} className="p-2 mr-3">
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
                    <div className="text-3xl font-bold text-gray-900">0</div>
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
            </div>
          </div>
        );

      case "obras":
        return (
          <div className="min-h-screen bg-gray-50 p-4">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Obras</h2>
              <p className="text-gray-600">
                Lista de obras será implementada aqui.
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

      case "piscinas":
        return (
          <div className="min-h-screen bg-gray-50 p-4">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Piscinas</h2>
              <div className="space-y-4">
                {pools.map((pool) => (
                  <div key={pool.id} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{pool.name}</h3>
                    <p className="text-gray-600">Cliente: {pool.client}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigateToSection("dashboard")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Voltar ao Dashboard
              </button>
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
