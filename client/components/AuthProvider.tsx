import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@shared/types";
import { firebaseService } from "@/services/FirebaseService";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isInitialized: boolean;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Utilizadores globais predefinidos que devem estar em todos os dispositivos
  const globalUsers = {
    "gongonsilva@gmail.com": {
      id: "admin_goncalo",
      email: "gongonsilva@gmail.com",
      name: "Gonçalo Fonseca",
      role: "admin" as const,
      password: "19867gsf",
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
    "alexkamaryta@gmail.com": {
      id: "user_alexandre",
      email: "alexkamaryta@gmail.com",
      name: "Alexandre Fernandes",
      role: "user" as const,
      password: "69alexandre",
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
  };

  // Carrega utilizador do localStorage na inicialização
  useEffect(() => {
    let mounted = true;
    let initTimeout: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        if (!mounted) return;

        console.log("🚀 AUTH INIT - Garantindo utilizadores globais...");

        // Verificar se localStorage está disponível antes de usar
        if (typeof Storage === "undefined") {
          console.warn("⚠️ localStorage não disponível, usando fallback");
          if (mounted) {
            setIsInitialized(true);
          }
          return;
        }

        // Timeout de segurança para inicialização
        const safeTimeout = setTimeout(() => {
          if (mounted) {
            console.warn(
              "⚠️ Timeout na inicialização auth, forçando completed",
            );
            setIsInitialized(true);
          }
        }, 3000);

        try {
          ensureGlobalUsers();
        } catch (ensureError) {
          console.error(
            "❌ Erro ao garantir utilizadores globais:",
            ensureError,
          );
          // Continuar mesmo com erro
        }

        if (!mounted) {
          clearTimeout(safeTimeout);
          return;
        }

        // Tentar carregar utilizador armazenado com tratamento defensivo
        try {
          const stored = localStorage.getItem("leirisonda_user");
          if (stored && mounted) {
            const parsedUser = JSON.parse(stored);

            // Validar se o objeto tem as propriedades essenciais
            if (
              parsedUser &&
              parsedUser.email &&
              parsedUser.name &&
              parsedUser.permissions
            ) {
              console.log("👤 UTILIZADOR CARREGADO:", parsedUser.email);
              setUser(parsedUser);
            } else {
              console.warn("⚠️ Dados de utilizador inválidos, a limpar...");
              try {
                localStorage.removeItem("leirisonda_user");
              } catch (removeError) {
                console.error(
                  "❌ Erro ao remover dados inválidos:",
                  removeError,
                );
              }
            }
          }
        } catch (parseError) {
          console.error(
            "❌ Erro ao fazer parse de utilizador, a limpar dados:",
            parseError,
          );
          try {
            localStorage.removeItem("leirisonda_user");
          } catch (clearError) {
            console.error("❌ Erro ao limpar dados de utilizador:", clearError);
          }
        }

        clearTimeout(safeTimeout);
      } catch (error) {
        console.error("❌ Erro na inicialização auth:", error);
        // Não quebrar, continuar com user = null
        // Tentar limpar dados corrompidos de forma segura
        try {
          localStorage.removeItem("leirisonda_user");
          localStorage.removeItem("leirisonda_last_user");
        } catch (clearError) {
          console.error("❌ Erro ao limpar dados após falha:", clearError);
        }
      } finally {
        if (mounted) {
          setIsInitialized(true);
        }
      }
    };

    // Adicionar delay mínimo para garantir que DOM está pronto e timeout de segurança
    const timer = setTimeout(initializeAuth, 100);

    // Timeout de segurança máximo para garantir que sempre inicializa
    initTimeout = setTimeout(() => {
      if (mounted && !isInitialized) {
        console.warn(
          "⚠️ Timeout máximo de inicialização atingido, forçando completion",
        );
        setIsInitialized(true);
      }
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(timer);
      clearTimeout(initTimeout);
    };
  }, []);

  // Garante que utilizadores globais estão presentes em todos os dispositivos
  const ensureGlobalUsers = () => {
    try {
      console.log("🔄 Verificando utilizadores globais...");

      // Verificar se localStorage está disponível
      if (typeof Storage === "undefined") {
        console.warn("⚠️ localStorage não disponível");
        return;
      }

      // Busca utilizadores existentes com fallback seguro
      let existingUsers = [];
      try {
        const storedUsers = localStorage.getItem("users");
        existingUsers = storedUsers ? JSON.parse(storedUsers) : [];
        if (!Array.isArray(existingUsers)) {
          existingUsers = [];
        }
      } catch (parseError) {
        console.warn("⚠️ Erro ao parse de users, reinicializando:", parseError);
        existingUsers = [];
      }

      let modified = false;

      // Verifica cada utilizador global
      Object.values(globalUsers).forEach((globalUser) => {
        const existingUser = existingUsers.find(
          (u: User) => u.email === globalUser.email,
        );

        if (!existingUser) {
          console.log(`➕ Adicionando utilizador global: ${globalUser.name}`);
          const newUser: User = {
            ...globalUser,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          delete (newUser as any).password; // Remove password do objeto user
          existingUsers.push(newUser);
          modified = true;

          // Armazenar password com múltiplas chaves
          const passwordKeys = [
            `password_${globalUser.id}`,
            `password_${globalUser.email}`,
            `password_${globalUser.email.toLowerCase()}`,
            `password_${globalUser.email.trim().toLowerCase()}`,
          ];

          passwordKeys.forEach((key) => {
            localStorage.setItem(key, globalUser.password);
          });

          console.log(
            `✅ Utilizador global ${globalUser.name} criado com password: ${globalUser.password}`,
          );
        } else {
          console.log(`✓ Utilizador global ${globalUser.name} já existe`);

          // Garante que as passwords estão presentes
          const passwordKeys = [
            `password_${globalUser.id}`,
            `password_${globalUser.email}`,
            `password_${globalUser.email.toLowerCase()}`,
            `password_${globalUser.email.trim().toLowerCase()}`,
          ];

          let hasPassword = false;
          passwordKeys.forEach((key) => {
            if (localStorage.getItem(key)) {
              hasPassword = true;
            }
          });

          if (!hasPassword) {
            console.log(`🔑 Restaurando password para ${globalUser.name}`);
            passwordKeys.forEach((key) => {
              localStorage.setItem(key, globalUser.password);
            });
          }
        }
      });

      if (modified) {
        localStorage.setItem("users", JSON.stringify(existingUsers));
        console.log("✅ Utilizadores globais sincronizados");
      }
    } catch (error) {
      console.error("❌ Erro ao garantir utilizadores globais:", error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("🔐 TENTATIVA LOGIN:", { email, password });
    console.log("📊 Estado inicial do AuthProvider:");
    console.log("  • isLoading:", isLoading);
    console.log("  • isInitialized:", isInitialized);
    console.log("  • user:", user);

    setIsLoading(true);
    console.log("⏳ setIsLoading(true) executado");

    try {
      // Normalizar email
      const normalizedEmail = email.trim().toLowerCase();
      console.log("🔄 Email normalizado:", normalizedEmail);

      // Verificar utilizadores globais primeiro
      const globalUser = Object.values(globalUsers).find(
        (u) => u.email.toLowerCase() === normalizedEmail,
      );
      console.log("👤 Utilizador global encontrado:", !!globalUser);

      if (globalUser && globalUser.password === password) {
        console.log("🔑 Password válida para utilizador global");

        const loginUser: User = {
          id: globalUser.id,
          email: globalUser.email,
          name: globalUser.name,
          role: globalUser.role,
          permissions: globalUser.permissions,
          createdAt: new Date().toISOString(),
        };
        console.log("🏗️ Objeto loginUser criado:", loginUser);

        try {
          localStorage.setItem("leirisonda_user", JSON.stringify(loginUser));
          console.log("💾 User guardado no localStorage");
        } catch (storageError) {
          console.error("❌ Erro ao guardar no localStorage:", storageError);
          throw storageError;
        }

        try {
          localStorage.setItem("leirisonda_last_user", globalUser.email);
          console.log("📝 Last user guardado");
        } catch (lastUserError) {
          console.error("❌ Erro ao guardar last user:", lastUserError);
          // Não é crítico, continuar
        }

        console.log("🔄 Executando setUser...");
        setUser(loginUser);
        console.log("✅ setUser executado com sucesso");

        console.log(`✅ ${globalUser.name.toUpperCase()} LOGIN SUCESSO`);

        // Inicializar notificações automaticamente após login com debug detalhado
        setTimeout(async () => {
          try {
            console.log(`🔔 INICIANDO NOTIFICAÇÕES para ${globalUser.name}...`);

            const { NotificationService } = await import(
              "@/services/NotificationService"
            );

            // Verificar status antes de inicializar
            console.log("📊 Status antes da inicialização:");
            console.log(`  • Suportado: ${NotificationService.isSupported}`);
            console.log(
              `  • Inicializado: ${NotificationService.isInitialized}`,
            );
            console.log(`  • Permissão atual: ${Notification.permission}`);

            // Tentar inicializar
            const initSuccess = await NotificationService.initialize();
            console.log(
              `🔔 Inicialização: ${initSuccess ? "✅ SUCESSO" : "❌ FALHA"}`,
            );

            if (initSuccess) {
              console.log("📊 Status após inicialização:");
              console.log(
                `  • Inicializado: ${NotificationService.isInitialized}`,
              );
              console.log(`  • Permissão final: ${Notification.permission}`);

              // Executar diagnóstico completo para debug
              try {
                const diagnostics = await NotificationService.runDiagnostics();
                console.log("🔍 DIAGNÓSTICO COMPLETO:", diagnostics);

                if (diagnostics.recommendations.length > 0) {
                  console.log("⚠️ PROBLEMAS DETECTADOS:");
                  diagnostics.recommendations.forEach((rec) =>
                    console.log(`  • ${rec}`),
                  );
                }
              } catch (diagError) {
                console.warn("⚠️ Erro no diagnóstico:", diagError);
              }

              // Verificar obras pendentes após delay
              setTimeout(async () => {
                try {
                  console.log(
                    `🔍 Verificando obras pendentes para ${globalUser.name}...`,
                  );
                  const pendingWorks =
                    await NotificationService.checkPendingAssignedWorks(
                      globalUser.id,
                    );

                  console.log(
                    `📋 RESULTADO: ${pendingWorks.length} obras pendentes encontradas`,
                  );
                  if (pendingWorks.length > 0) {
                    console.log(
                      "🏗️ Obras pendentes:",
                      pendingWorks.map(
                        (w) => `${w.workSheetNumber} - ${w.clientName}`,
                      ),
                    );
                  }
                } catch (error) {
                  console.warn("⚠️ Erro ao verificar obras pendentes:", error);
                }
              }, 2000);
            } else {
              console.error(
                "❌ FALHA NA INICIALIZAÇÃO - Notificações não funcionarão",
              );
            }
          } catch (notificationError) {
            console.error(
              "❌ ERRO CRÍTICO nas notificações:",
              notificationError,
            );
          }
        }, 1000);

        console.log(
          "⏳ Executando setIsLoading(false) para utilizador global...",
        );
        setIsLoading(false);
        console.log("✅ setIsLoading(false) executado para utilizador global");

        console.log("📊 Estado final do AuthProvider (utilizador global):");
        console.log("  • isLoading:", false);
        console.log("  • isInitialized:", isInitialized);
        console.log("  • user definido:", !!loginUser);

        console.log("🎯 Retornando true da função login (utilizador global)");
        return true;
      }

      // Verificar utilizadores criados dinamicamente
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const dynamicUser = users.find(
        (u: User) => u.email.toLowerCase() === normalizedEmail,
      );

      if (dynamicUser) {
        // Verificar password com múltiplas chaves
        const passwordKeys = [
          `password_${dynamicUser.id}`,
          `password_${dynamicUser.email}`,
          `password_${dynamicUser.email.toLowerCase()}`,
          `password_${dynamicUser.email.trim().toLowerCase()}`,
        ];

        for (const key of passwordKeys) {
          const storedPassword = localStorage.getItem(key);
          if (storedPassword === password) {
            localStorage.setItem(
              "leirisonda_user",
              JSON.stringify(dynamicUser),
            );
            localStorage.setItem("leirisonda_last_user", dynamicUser.email); // Guardar último utilizador
            setUser(dynamicUser);
            console.log(
              `✅ UTILIZADOR DINÂMICO ${dynamicUser.name.toUpperCase()} LOGIN SUCESSO`,
            );

            // Inicializar notificações automaticamente após login com debug detalhado
            setTimeout(async () => {
              try {
                console.log(
                  `🔔 INICIANDO NOTIFICAÇÕES para ${dynamicUser.name} (dinâmico)...`,
                );

                const { NotificationService } = await import(
                  "@/services/NotificationService"
                );

                // Verificar status antes de inicializar
                console.log(
                  "📊 Status antes da inicialização (usuário dinâmico):",
                );
                console.log(
                  `  • Suportado: ${NotificationService.isSupported}`,
                );
                console.log(
                  `  • Inicializado: ${NotificationService.isInitialized}`,
                );
                console.log(`  • Permissão atual: ${Notification.permission}`);

                // Tentar inicializar
                const initSuccess = await NotificationService.initialize();
                console.log(
                  `🔔 Inicialização (dinâmico): ${initSuccess ? "✅ SUCESSO" : "❌ FALHA"}`,
                );

                if (initSuccess) {
                  console.log("📊 Status após inicialização (dinâmico):");
                  console.log(
                    `  • Inicializado: ${NotificationService.isInitialized}`,
                  );
                  console.log(
                    `  • Permissão final: ${Notification.permission}`,
                  );

                  // Verificar obras pendentes após delay
                  setTimeout(async () => {
                    try {
                      console.log(
                        `🔍 Verificando obras pendentes para ${dynamicUser.name} (dinâmico)...`,
                      );
                      const pendingWorks =
                        await NotificationService.checkPendingAssignedWorks(
                          dynamicUser.id,
                        );

                      console.log(
                        `📋 RESULTADO (dinâmico): ${pendingWorks.length} obras pendentes encontradas`,
                      );
                      if (pendingWorks.length > 0) {
                        console.log(
                          "🏗️ Obras pendentes:",
                          pendingWorks.map(
                            (w) => `${w.workSheetNumber} - ${w.clientName}`,
                          ),
                        );
                      }
                    } catch (error) {
                      console.warn(
                        "⚠️ Erro ao verificar obras pendentes (dinâmico):",
                        error,
                      );
                    }
                  }, 2000);
                } else {
                  console.error(
                    "❌ FALHA NA INICIALIZAÇÃO (dinâmico) - Notificações não funcionarão",
                  );
                }
              } catch (notificationError) {
                console.error(
                  "❌ ERRO CRÍTICO nas notificações (dinâmico):",
                  notificationError,
                );
              }
            }, 1000);

            setIsLoading(false);
            return true;
          }
        }
      }

      console.log("❌ CREDENCIAIS INVÁLIDAS");
      console.log("📊 Estado ao falhar credenciais:");
      console.log("  • Email testado:", normalizedEmail);
      console.log("  • Utilizadores globais:", Object.keys(globalUsers));
      console.log("  • Utilizadores dinâmicos:", users.length);

      setIsLoading(false);
      console.log(
        "🔄 setIsLoading(false) executado para credenciais inválidas",
      );
      return false;
    } catch (error) {
      console.error("❌ ERRO LOGIN:", error);
      console.error("❌ ERRO DETALHADO:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      console.log("📊 Estado ao erro crítico:");
      console.log("  • isLoading antes:", isLoading);
      console.log("  • isInitialized:", isInitialized);
      console.log("  • user atual:", user);

      setIsLoading(false);
      console.log("🔄 setIsLoading(false) executado para erro crítico");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("leirisonda_user");
    setUser(null);
    console.log("👋 LOGOUT");
  };

  const getAllUsers = (): User[] => {
    try {
      // Obter usuários globais predefinidos
      const globalUsersList = Object.values(globalUsers).map((globalUser) => ({
        id: globalUser.id,
        email: globalUser.email,
        name: globalUser.name,
        role: globalUser.role,
        permissions: globalUser.permissions,
        createdAt: new Date().toISOString(),
      }));

      // Obter usuários criados dinamicamente
      const dynamicUsers = JSON.parse(localStorage.getItem("users") || "[]");

      // Combinar e remover duplicatas
      const allUsers = [...globalUsersList];

      dynamicUsers.forEach((dynamicUser: User) => {
        const exists = allUsers.find(
          (user) => user.email === dynamicUser.email,
        );
        if (!exists) {
          allUsers.push(dynamicUser);
        }
      });

      return allUsers;
    } catch (error) {
      console.error("❌ Erro ao obter usuários:", error);
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, isInitialized, getAllUsers }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  try {
    const context = useContext(AuthContext);

    if (context === undefined) {
      console.error("❌ useAuth must be used within an AuthProvider");
      // Instead of returning fallback, throw error so ErrorBoundary can catch
      throw new Error(
        "useAuth must be used within an AuthProvider. Check that your component is wrapped with AuthProvider.",
      );
    }

    if (!context) {
      console.warn("⚠️ useAuth context is null - using fallback");
      // Return fallback context to prevent crashes
      return {
        user: null,
        login: async () => false,
        logout: () => {},
        isLoading: false,
        isInitialized: true, // Mark as initialized to prevent infinite loading
        getAllUsers: () => [],
      };
    }

    return context;
  } catch (error) {
    console.error("❌ Critical error in useAuth:", error);

    // If we're in SystemStatus, return a safe fallback instead of throwing
    if (window.location.pathname === "/system-status") {
      return {
        user: null,
        login: async () => false,
        logout: () => {},
        isLoading: false,
        isInitialized: true,
        getAllUsers: () => [],
      };
    }

    // For other pages, re-throw so ErrorBoundary can handle
    throw error;
  }
}
