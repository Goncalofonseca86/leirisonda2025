import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./global.css";

// Componentes simples para teste
import { SimpleAuthProvider } from "./components/AuthProviderSimple";

// Página de teste simples
function SimpleLogin() {
  const [email, setEmail] = React.useState("gongonsilva@gmail.com");
  const [password, setPassword] = React.useState("19867gsf");
  const [message, setMessage] = React.useState("");

  const handleLogin = async () => {
    console.log("🔐 Tentando login simples...");

    try {
      // Simular login direto
      const testUser = {
        id: "admin_goncalo",
        email: "gongonsilva@gmail.com",
        name: "Gonçalo Fonseca",
        role: "admin",
        permissions: {},
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("leirisonda_user", JSON.stringify(testUser));
      setMessage("✅ Login realizado com sucesso!");

      // Redirecionar para dashboard
      setTimeout(() => {
        window.location.href = "/dashboard-simple";
      }, 1000);
    } catch (error) {
      console.error("❌ Erro no login:", error);
      setMessage("❌ Erro no login: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">🧪 Login Simples</h1>

        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Email"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Password"
          />

          <button
            onClick={handleLogin}
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login Direto (Teste)
          </button>

          {message && (
            <div
              className={`p-2 rounded ${message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SimpleDashboard() {
  const [userInfo, setUserInfo] = React.useState<any>(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("leirisonda_user");
      if (stored) {
        const user = JSON.parse(stored);
        setUserInfo(user);
        console.log("✅ Usuário carregado no dashboard:", user);
      } else {
        console.log("❌ Nenhum usuário no localStorage");
      }
    } catch (error) {
      console.error("❌ Erro ao carregar usuário:", error);
    }
  }, []);

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">❌ Não autenticado</h1>
          <a href="/login-simple" className="text-blue-600 hover:underline">
            Ir para Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-6">
            ✅ Dashboard Simples Funcionando!
          </h1>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              🎉 Sucesso! O login funcionou!
            </h2>
            <p className="text-green-700">
              Conseguimos fazer login e chegar ao dashboard sem erros de
              contexto.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">👤 Informações do Usuário:</h3>
            <pre className="text-sm bg-blue-100 p-2 rounded overflow-auto">
              {JSON.stringify(userInfo, null, 2)}
            </pre>
          </div>

          <div className="mt-6">
            <button
              onClick={() => {
                localStorage.removeItem("leirisonda_user");
                window.location.href = "/login-simple";
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleApp() {
  console.log("🚀 SimpleApp iniciando...");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login-simple" element={<SimpleLogin />} />
        <Route path="/dashboard-simple" element={<SimpleDashboard />} />
        <Route path="*" element={<SimpleLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

// Inicialização simples
const rootElement = document.getElementById("root");
if (rootElement) {
  console.log("🏗️ Inicializando app simples...");
  const root = ReactDOM.createRoot(rootElement);
  root.render(<SimpleApp />);
  console.log("✅ App simples inicializado!");
}
