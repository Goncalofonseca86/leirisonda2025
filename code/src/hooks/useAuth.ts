import { useState, useEffect, useCallback } from "react";
import type { User, LoginCredentials, AuthContextType } from "@/types";

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for existing auth token on mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const userData = localStorage.getItem("userData");

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock authentication logic
      if (
        credentials.email === "admin@leirisonda.pt" &&
        credentials.password === "admin123"
      ) {
        const mockUser: User = {
          id: "1",
          email: credentials.email,
          name: "Administrador",
          role: "admin",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const token = `leirisonda_token_${Date.now()}`;

        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(mockUser));

        setUser(mockUser);
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("rememberMe");
    setUser(null);
    window.location.href = "/login";
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
};

export default useAuth;
