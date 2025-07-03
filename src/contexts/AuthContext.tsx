import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultUsers: User[] = [
  {
    id: "user_alexandre",
    email: "alexandre@leirisonda.pt",
    name: "Alexandre",
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
  },
  {
    id: "user_yuri",
    email: "yrzamr01@gmail.com",
    name: "Yuri Ferreira",
    role: "user",
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
  },
];

const userPasswords: Record<string, string> = {
  "alexandre@leirisonda.pt": "admin123",
  "yrzamr01@gmail.com": "070107",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("leirisonda_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const correctPassword = userPasswords[email];
    if (!correctPassword || correctPassword !== password) {
      return false;
    }

    const foundUser = defaultUsers.find((u) => u.email === email);
    if (!foundUser) {
      return false;
    }

    setUser(foundUser);
    localStorage.setItem("leirisonda_user", JSON.stringify(foundUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("leirisonda_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
