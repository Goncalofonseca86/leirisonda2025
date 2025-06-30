import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@shared/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isInitialized: boolean;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProviderFixed({ children }: { children: React.ReactNode }) {
  console.log("🏗️ AuthProviderFixed iniciando...");

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Credenciais hardcoded que funcionam
  const validCredentials = {
    "gongonsilva@gmail.com": {
      password: "19867gsf",
      user: {
        id: "admin_goncalo",
        email: "gongonsilva@gmail.com",
        name: "Gonçalo Fonseca",
        role: "admin" as const,
        permissions: {
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
        },
        createdAt: new Date().toISOString(),
      },
    },
    "alexkamaryta@gmail.com": {
      password: "69alexandre",
      user: {
        id: "user_alexandre",
        email: "alexkamaryta@gmail.com",
        name: "Alexandre Fernandes",
        role: "user" as const,
        permissions: {
          canViewWorks: true,
          canCreateWorks: false,
          canEditWorks: true,
          canDeleteWorks: false,
          canViewMaintenance: true,
          canCreateMaintenance: false,
          canEditMaintenance: true,
          canDeleteMaintenance: false,
          canViewUsers: false,
          canCreateUsers: false,
          canEditUsers: false,
          canDeleteUsers: false,
          canViewReports: true,
          canExportData: false,
          canViewDashboard: true,
          canViewStats: true,
        },
        createdAt: new Date().toISOString(),
      },
    },
  };

  // Inicialização simples
  useEffect(() => {
    console.log("🚀 AuthProviderFixed inicialização...");

    try {
      // Verificar se há usuário armazenado
      const stored = localStorage.getItem("leirisonda_user");
      if (stored) {
        const parsedUser = JSON.parse(stored);
        console.log("👤 Usuário encontrado no localStorage:", parsedUser.email);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar usuário:", error);
      localStorage.removeItem("leirisonda_user");
    }

    setIsInitialized(true);
    console.log("✅ AuthProviderFixed inicializado");
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("🔐 Login tentativa:", { email });
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      console.log("📧 Email normalizado:", normalizedEmail);

      const credentials = validCredentials[normalizedEmail];
      console.log("🔑 Credenciais encontradas:", !!credentials);

      if (credentials) {
        console.log("🔍 Debug credenciais:", {
          emailMatch: credentials.user.email === normalizedEmail,
          passwordProvided: password,
          passwordExpected: credentials.password,
          passwordMatch: credentials.password === password,
        });
      }

      if (credentials && credentials.password === password) {
        console.log("✅ Credenciais válidas");

        // Limpar dados antigos antes de definir novos
        localStorage.removeItem("leirisonda_user");

        const loginUser = credentials.user;
        setUser(loginUser);
        localStorage.setItem("leirisonda_user", JSON.stringify(loginUser));

        console.log("✅ Login bem-sucedido para:", loginUser.name);
        setIsLoading(false);
        return true;
      }

      console.log("❌ Credenciais inválidas");
      console.log("🔍 Credenciais disponíveis:", Object.keys(validCredentials));
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("❌ Erro no login:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    console.log("👋 Logout");
    setUser(null);
    localStorage.removeItem("leirisonda_user");
  };

  const getAllUsers = (): User[] => {
    return Object.values(validCredentials).map((cred) => cred.user);
  };

  const contextValue = {
    user,
    login,
    logout,
    isLoading,
    isInitialized,
    getAllUsers,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthFixed(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    console.error("❌ useAuthFixed must be used within AuthProviderFixed");
    throw new Error("useAuthFixed must be used within an AuthProviderFixed");
  }

  return context;
}
