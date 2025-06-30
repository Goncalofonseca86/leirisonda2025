import React from "react";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Download,
  RotateCcw,
  Home,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Link } from "react-router-dom";

export function SystemStatus() {
  const [authContext, setAuthContext] = React.useState<any>(null);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const [checks, setChecks] = React.useState({
    localStorage: false,
    firebase: false,
    routing: false,
    auth: false,
    authProvider: false,
    userData: false,
    contextAccess: false,
  });

  const [loading, setLoading] = React.useState(true);
  const [diagnosticInfo, setDiagnosticInfo] = React.useState<any>({});

  // Tentar acessar o auth context de forma segura
  React.useEffect(() => {
    const initializeAuthCheck = () => {
      try {
        console.log("🔍 SystemStatus tentando acessar AuthContext...");
        const context = useAuth();
        console.log("✅ AuthContext acessado com sucesso:", !!context);
        setAuthContext(context);
        setAuthError(null);
      } catch (error) {
        console.error("❌ Erro ao acessar auth no SystemStatus:", error);
        setAuthError(error.message || "Erro desconhecido");
        setAuthContext(null);

        // Se o erro é sobre contexto, pode indicar problema estrutural
        if (error.message?.includes("must be used within")) {
          console.error(
            "💥 ERRO ESTRUTURAL: AuthProvider não está envolvendo SystemStatus corretamente",
          );
        }
      }
    };

    // Aguardar um tick para garantir que o contexto está pronto
    setTimeout(initializeAuthCheck, 100);
  }, []);

  React.useEffect(() => {
    runSystemChecks();
  }, []);

  const runSystemChecks = async () => {
    setLoading(true);
    const newChecks = { ...checks };
    const diagInfo: any = {};

    console.log("🔍 Executando verificações do sistema...");

    // Check localStorage
    try {
      localStorage.setItem("test_diagnostic", "test");
      const retrieved = localStorage.getItem("test_diagnostic");
      localStorage.removeItem("test_diagnostic");
      newChecks.localStorage = retrieved === "test";
      diagInfo.localStorageSize = Object.keys(localStorage).length;
      diagInfo.localStorageKeys = Object.keys(localStorage);
    } catch (error) {
      newChecks.localStorage = false;
      diagInfo.localStorageError = error.message;
    }

    // Check Firebase
    try {
      const { auth, db } = await import("@/lib/firebase");
      newChecks.firebase = !!(auth && db);
      diagInfo.firebaseLoaded = true;
    } catch (error) {
      newChecks.firebase = false;
      diagInfo.firebaseError = error.message;
    }

    // Check routing
    newChecks.routing = !!window.location;
    diagInfo.currentPath = window.location.pathname;
    diagInfo.currentURL = window.location.href;
    diagInfo.hasHistory = !!window.history;

    // Check auth context
    newChecks.contextAccess = !!authContext && !authError;
    newChecks.auth = !!authContext?.user;
    newChecks.authProvider = !!authContext;

    if (authContext) {
      newChecks.userData = !!(
        authContext.user?.email && authContext.user?.name
      );
      diagInfo.userEmail = authContext.user?.email;
      diagInfo.userName = authContext.user?.name;
      diagInfo.userRole = authContext.user?.role;
      diagInfo.isLoading = authContext.isLoading;
      diagInfo.isInitialized = authContext.isInitialized;
    } else {
      diagInfo.authContextError = authError;
    }

    // Check session markers
    diagInfo.justLoggedIn = sessionStorage.getItem("just_logged_in");
    diagInfo.justCreatedWork = sessionStorage.getItem("just_created_work");
    diagInfo.deletingWork = sessionStorage.getItem("deleting_work");

    // Check stored user data
    try {
      const storedUser = localStorage.getItem("leirisonda_user");
      diagInfo.hasStoredUser = !!storedUser;
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        diagInfo.storedUserEmail = parsed.email;
        diagInfo.storedUserName = parsed.name;
        diagInfo.storedUserRole = parsed.role;
        diagInfo.storedUserPermissions = Object.keys(
          parsed.permissions || {},
        ).length;
      }
    } catch (error) {
      diagInfo.storedUserError = error.message;
    }

    // Check browser compatibility
    diagInfo.hasServiceWorker = "serviceWorker" in navigator;
    diagInfo.hasNotifications = "Notification" in window;
    diagInfo.hasIndexedDB = "indexedDB" in window;
    diagInfo.hasLocalStorage = "localStorage" in window;

    // Environment info
    diagInfo.userAgent = navigator.userAgent;
    diagInfo.timestamp = new Date().toISOString();
    diagInfo.reactVersion = React.version;
    diagInfo.isDevelopment = process.env.NODE_ENV === "development";
    diagInfo.onlineStatus = navigator.onLine;

    setChecks(newChecks);
    setDiagnosticInfo(diagInfo);
    setLoading(false);
  };

  const getIcon = (status: boolean) => {
    if (loading)
      return <RefreshCw className="w-5 h-5 animate-spin text-gray-400" />;
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatus = (status: boolean) => {
    if (loading) return "Verificando...";
    return status ? "✅ OK" : "❌ Erro";
  };

  const exportDiagnostic = () => {
    const report = {
      timestamp: new Date().toISOString(),
      checks,
      diagnosticInfo,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leirisonda-diagnostic-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (confirm("ATENÇÃO: Isto irá limpar TODOS os dados. Continuar?")) {
      try {
        localStorage.clear();
        sessionStorage.clear();

        // Clear caches if available
        if ("caches" in window) {
          caches.keys().then((names) => {
            names.forEach((name) => {
              caches.delete(name);
            });
          });
        }

        alert("Dados limpos! A página será recarregada.");
        window.location.reload();
      } catch (error) {
        alert("Erro ao limpar dados: " + error.message);
      }
    }
  };

  const forceReload = () => {
    window.location.reload();
  };

  const goToLogin = () => {
    window.location.href = "/login";
  };

  const allSystemsOk = Object.values(checks).every(Boolean) && !loading;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center">
              <AlertCircle className="w-6 h-6 mr-2" />
              Diagnóstico do Sistema
            </h1>

            <div className="flex gap-2">
              <button
                onClick={exportDiagnostic}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download size={16} />
                Exportar
              </button>
              <button
                onClick={runSystemChecks}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <RefreshCw size={16} />
                Atualizar
              </button>
            </div>
          </div>

          {/* Status Overview */}
          <div
            className={`p-4 rounded-lg mb-6 ${allSystemsOk ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
          >
            <div className="flex items-center">
              {allSystemsOk ? (
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
              )}
              <span className="text-lg font-semibold">
                {allSystemsOk
                  ? "Sistema Funcionando Corretamente"
                  : "Problemas Detectados"}
              </span>
            </div>
          </div>

          {/* System Checks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Verificações do Sistema</h3>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Armazenamento Local</span>
                <div className="flex items-center gap-2">
                  {getIcon(checks.localStorage)}
                  <span className="text-sm">
                    {getStatus(checks.localStorage)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Firebase</span>
                <div className="flex items-center gap-2">
                  {getIcon(checks.firebase)}
                  <span className="text-sm">{getStatus(checks.firebase)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Navegação</span>
                <div className="flex items-center gap-2">
                  {getIcon(checks.routing)}
                  <span className="text-sm">{getStatus(checks.routing)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Contexto de Autenticação</span>
                <div className="flex items-center gap-2">
                  {getIcon(checks.contextAccess)}
                  <span className="text-sm">
                    {getStatus(checks.contextAccess)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Estado do Utilizador</h3>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>AuthProvider Disponível</span>
                <div className="flex items-center gap-2">
                  {getIcon(checks.authProvider)}
                  <span className="text-sm">
                    {getStatus(checks.authProvider)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Utilizador Autenticado</span>
                <div className="flex items-center gap-2">
                  {getIcon(checks.auth)}
                  <span className="text-sm">{getStatus(checks.auth)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span>Dados Utilizador Válidos</span>
                <div className="flex items-center gap-2">
                  {getIcon(checks.userData)}
                  <span className="text-sm">{getStatus(checks.userData)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Info */}
          {!loading && (
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">
                Informações de Diagnóstico
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Estado Actual:</strong>
                    <ul className="mt-1 space-y-1">
                      <li>Caminho: {diagnosticInfo.currentPath}</li>
                      <li>
                        Online: {diagnosticInfo.onlineStatus ? "Sim" : "Não"}
                      </li>
                      <li>
                        Utilizador:{" "}
                        {diagnosticInfo.userEmail || "Não autenticado"}
                      </li>
                      <li>Papel: {diagnosticInfo.userRole || "N/A"}</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Marcações de Sessão:</strong>
                    <ul className="mt-1 space-y-1">
                      <li>
                        Acabou de fazer login:{" "}
                        {diagnosticInfo.justLoggedIn || "Não"}
                      </li>
                      <li>
                        Criou obra: {diagnosticInfo.justCreatedWork || "Não"}
                      </li>
                      <li>
                        A eliminar obra: {diagnosticInfo.deletingWork || "Não"}
                      </li>
                    </ul>
                  </div>
                </div>

                {diagnosticInfo.authContextError && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded">
                    <strong className="text-red-800">Erro do Contexto:</strong>
                    <p className="text-red-700 text-sm mt-1">
                      {diagnosticInfo.authContextError}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={forceReload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RotateCcw size={16} />
              Recarregar Página
            </button>

            <button
              onClick={goToLogin}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Home size={16} />
              Ir para Login
            </button>

            <button
              onClick={clearAllData}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <AlertCircle size={16} />
              Limpar Todos os Dados
            </button>
          </div>

          {/* Back to Login Link */}
          <div className="mt-6 pt-4 border-t">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft size={16} />
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
