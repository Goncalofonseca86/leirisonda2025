import React, { createContext, useContext, useState } from "react";
import { User } from "@shared/types";

interface SimpleAuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isInitialized: boolean;
  getAllUsers: () => User[];
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(
  undefined,
);

export function SimpleAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("🔥 SimpleAuthProvider iniciando...");

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized] = useState(true); // Sempre inicializado para teste

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("🔐 SimpleAuth login tentativa:", { email, password });
    setIsLoading(true);

    try {
      // Credenciais hardcoded para teste
      if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
        const testUser: User = {
          id: "admin_goncalo",
          email: "gongonsilva@gmail.com",
          name: "Gonçalo Fonseca",
          role: "admin",
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
        };

        console.log("✅ Login válido, definindo user:", testUser);
        setUser(testUser);
        localStorage.setItem("leirisonda_user", JSON.stringify(testUser));
        setIsLoading(false);
        return true;
      }

      console.log("❌ Credenciais inválidas");
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("❌ Erro no login simples:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    console.log("👋 SimpleAuth logout");
    setUser(null);
    localStorage.removeItem("leirisonda_user");
  };

  const getAllUsers = () => {
    return [];
  };

  const contextValue = {
    user,
    login,
    logout,
    isLoading,
    isInitialized,
    getAllUsers,
  };

  console.log("📦 SimpleAuthProvider renderizando com contexto:", contextValue);

  return (
    <SimpleAuthContext.Provider value={contextValue}>
      {children}
    </SimpleAuthContext.Provider>
  );
}

export function useSimpleAuth(): SimpleAuthContextType {
  console.log("🔍 useSimpleAuth chamado");
  const context = useContext(SimpleAuthContext);

  if (context === undefined) {
    console.error(
      "❌ useSimpleAuth deve ser usado dentro de SimpleAuthProvider",
    );
    throw new Error("useSimpleAuth must be used within a SimpleAuthProvider");
  }

  console.log("✅ useSimpleAuth retornando contexto:", context);
  return context;
}
