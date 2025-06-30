// Clean AuthProvider with local-only authentication
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User, AuthContextType, UserPermissions } from "@shared/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultAdminPermissions: UserPermissions = {
  canViewWorks: true,
  canCreateWorks: true,
  canEditWorks: true,
  canDeleteWorks: true,
  canViewMaintenance: true,
  canCreateMaintenance: true,
  canEditMaintenance: true,
  canDeleteMaintenance: true,
  canViewUsers: true,
  canCreateUsers: true,
  canEditUsers: true,
  canDeleteUsers: true,
  canViewReports: true,
  canExportData: true,
  canViewDashboard: true,
  canViewStats: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load stored user on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("leirisonda_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.email && parsed.id) {
          setUser(parsed);
        } else {
          localStorage.removeItem("leirisonda_user");
        }
      }
    } catch (error) {
      localStorage.removeItem("leirisonda_user");
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);

      try {
        // Simple local authentication
        const validCredentials = [
          { email: "gongonsilva@gmail.com", password: "19867gsf" },
          { email: "tecnico@leirisonda.pt", password: "tecnico123" },
          { email: "supervisor@leirisonda.pt", password: "supervisor123" },
        ];

        const validUser = validCredentials.find(
          (cred) => cred.email === email && cred.password === password,
        );

        if (validUser) {
          const userData: User = {
            id: "admin",
            email: validUser.email,
            name:
              validUser.email === "gongonsilva@gmail.com"
                ? "Gonçalo Silva"
                : "Utilizador",
            role: "admin",
            permissions: defaultAdminPermissions,
            createdAt: new Date().toISOString(),
          };

          setUser(userData);
          localStorage.setItem("leirisonda_user", JSON.stringify(userData));
          console.log("✅ Local login successful");
          return true;
        }

        return false;
      } catch (error) {
        console.error("Login error:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    setUser(null);
    localStorage.removeItem("leirisonda_user");
    console.log("👋 User logged out");
  }, []);

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
