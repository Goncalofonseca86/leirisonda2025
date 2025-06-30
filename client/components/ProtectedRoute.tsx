import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthFixed as useAuth } from "./AuthProviderFixed";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // SOLUÇÃO RADICAL: Ignorar AuthProvider completamente, usar apenas localStorage
  React.useEffect(() => {
    console.log("🔒 ProtectedRoute verificando localStorage...");

    try {
      const storedUser = localStorage.getItem("leirisonda_user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("✅ ProtectedRoute: User encontrado:", parsedUser.name);
        setUser(parsedUser);
      } else {
        console.log("❌ ProtectedRoute: Nenhum user no localStorage");
        setUser(null);
      }
    } catch (error) {
      console.error("❌ ProtectedRoute: Erro ao ler localStorage:", error);
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  // Ignorar AuthProvider completamente
  const isInitialized = true;

  // Show loading while auth is initializing or processing
  // Adicionar timeout de segurança para evitar loading infinito
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    let warningTimeout: NodeJS.Timeout;

    if (!isInitialized || isLoading) {
      // Primeiro aviso após 3 segundos
      warningTimeout = setTimeout(() => {
        console.warn("⚠️ Auth inicialização demorou 3 segundos...");
      }, 3000);

      // Timeout final após 8 segundos
      timeout = setTimeout(() => {
        if (!isInitialized || isLoading) {
          console.warn(
            "⚠️ Auth inicialização demorou muito, redirecionando...",
          );
          setRedirecting(true);

          // Tentar diferentes estratégias de recuperação
          try {
            // Primeiro tentar navigate React Router
            window.location.href = "/login";
          } catch (navError) {
            console.error("❌ Erro ao navegar:", navError);
            // Forçar reload como último recurso
            window.location.reload();
          }
        }
      }, 8000);
    }

    return () => {
      clearTimeout(timeout);
      clearTimeout(warningTimeout);
    };
  }, [isInitialized, isLoading]);

  if (redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-leirisonda-blue-light to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-red-600 font-medium">A redireccionar...</p>
        </div>
      </div>
    );
  }

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-leirisonda-blue-light to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-leirisonda-primary mx-auto mb-4"></div>
          <p className="text-leirisonda-text-muted">A carregar sistema...</p>
          <p className="text-xs text-gray-400 mt-2">
            {isLoading ? "A processar autenticação..." : "A inicializar..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("🔒 Utilizador não autenticado, redirecionando para login");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
