import React, { useEffect, useState } from "react";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
import { LeirisondaLogo } from "../../src/components/LeirisondaLogo";
import { useAuth } from "../../src/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "manager" | "user";
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallback,
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Small delay to prevent flash
      const timer = setTimeout(() => setShowContent(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Loading state
  if (isLoading || !showContent) {
    return (
      <div className="login-hero">
        <div className="login-card">
          <div className="p-8 text-center">
            <div className="mb-6">
              <LeirisondaLogo className="mx-auto" width={140} height={45} />
            </div>
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-baby-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              A carregar...
            </h2>
            <p className="text-gray-600">A verificar as suas credenciais</p>
            <p className="text-sm text-gray-500 mt-2">
              Se demorar muito, será redirecionado automaticamente...
            </p>
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-baby-blue-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="login-hero">
        <div className="login-card">
          <div className="p-8 text-center">
            <div className="mb-6">
              <LeirisondaLogo className="mx-auto" width={140} height={45} />
            </div>
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acesso Restrito
            </h2>
            <p className="text-gray-600 mb-6">
              É necessário fazer login para aceder a esta página.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => (window.location.href = "/login")}
                className="btn-leirisonda w-full"
              >
                Fazer Login
              </button>
              <button
                onClick={() => window.history.back()}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check role permissions
  if (requiredRole && user) {
    const roleHierarchy = {
      user: 1,
      manager: 2,
      admin: 3,
    };

    const userLevel = roleHierarchy[user.role];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      return (
        <div className="login-hero">
          <div className="login-card">
            <div className="p-8 text-center">
              <div className="mb-6">
                <LeirisondaLogo className="mx-auto" width={140} height={45} />
              </div>
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-amber-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Permissões Insuficientes
              </h2>
              <p className="text-gray-600 mb-2">
                Não tem permissões para aceder a esta página.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                É necessário ter o perfil de <strong>{requiredRole}</strong> ou
                superior.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="btn-leirisonda w-full"
                >
                  Ir para o Dashboard
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default ProtectedRoute;
