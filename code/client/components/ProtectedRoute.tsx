import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(
    null,
  );

  React.useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        // Simulate auth check
        const token = localStorage.getItem("authToken");
        setIsAuthenticated(!!token);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="login-hero">
        <div className="login-card">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">A carregar...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login or show login form
    return (
      <div className="login-hero">
        <div className="login-card">
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Acesso Requerido
            </h2>
            <p className="text-gray-600 mb-4">
              É necessário fazer login para aceder a esta página.
            </p>
            <a href="/login" className="btn-leirisonda">
              Fazer Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
