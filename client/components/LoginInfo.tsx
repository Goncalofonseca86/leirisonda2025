import React, { useState, useEffect } from "react";
import { AlertCircle, Users, Eye, EyeOff } from "lucide-react";

interface UserDebugInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  hasPassword: boolean;
  passwordStorageDetails: {
    byId: boolean;
    byEmail: boolean;
    byNormalizedEmail: boolean;
    actualPassword: string;
    allKeys: Array<{
      key: string;
      value: string | null;
      exists: boolean;
    }>;
  };
}

export function LoginInfo() {
  const [showDebug, setShowDebug] = useState(false);
  const [users, setUsers] = useState<UserDebugInfo[]>([]);

  const fixUserPasswords = () => {
    try {
      console.log("🔧 Manual password fix initiated...");
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);

        parsedUsers.forEach((user: any) => {
          const passwordKeys = [
            `password_${user.id}`,
            `password_${user.email}`,
            `password_${user.email?.trim().toLowerCase()}`,
          ];

          // Find any existing password
          let existingPassword = null;
          for (const key of passwordKeys) {
            const pwd = localStorage.getItem(key);
            if (pwd) {
              existingPassword = pwd;
              break;
            }
          }

          if (existingPassword) {
            // Ensure password is stored with all variations
            passwordKeys.forEach((key) => {
              localStorage.setItem(key, existingPassword);
              console.log(`🔧 Set password for key: ${key}`);
            });
          } else {
            // For users without password, create a default one
            const defaultPassword =
              user.name.toLowerCase().replace(/\s+/g, "") + "123";
            passwordKeys.forEach((key) => {
              localStorage.setItem(key, defaultPassword);
              console.log(
                `🔧 Created default password "${defaultPassword}" for key: ${key}`,
              );
            });
            console.log(
              `⚠️ Created default password for ${user.name}: ${defaultPassword}`,
            );
          }
        });

        console.log("✅ Manual password fix completed");
        // Reload debug info
        window.location.reload();
      }
    } catch (error) {
      console.error("❌ Error in manual fix:", error);
    }
  };

  const fixSpecificUser = (userEmail: string) => {
    try {
      console.log(`🔧 Fixing specific user: ${userEmail}`);
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        const user = parsedUsers.find((u: any) => u.email === userEmail);

        if (user) {
          // Create a simple password based on name
          const newPassword =
            user.name.toLowerCase().replace(/\s+/g, "") + "123";

          const passwordKeys = [
            `password_${user.id}`,
            `password_${user.email}`,
            `password_${user.email?.trim().toLowerCase()}`,
          ];

          passwordKeys.forEach((key) => {
            localStorage.setItem(key, newPassword);
            console.log(`🔧 Fixed password for key: ${key} = ${newPassword}`);
          });

          alert(
            `✅ Password atualizada para ${user.name}!\nEmail: ${user.email}\nPassword: ${newPassword}\n\nPode agora fazer login.`,
          );

          // Reload debug info
          setTimeout(() => {
            setUsers([]); // Clear current state
            setShowDebug(false);
            setShowDebug(true);
          }, 100);
        } else {
          alert(`❌ Utilizador ${userEmail} não encontrado.`);
        }
      }
    } catch (error) {
      console.error("❌ Error fixing specific user:", error);
      alert(`❌ Erro ao corrigir utilizador: ${error}`);
    }
  };

  useEffect(() => {
    if (showDebug) {
      try {
        const storedUsers = localStorage.getItem("users");
        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          const debugInfo = parsedUsers.map((user: any) => {
            // Check all possible password keys
            const passwordKeys = [
              `password_${user.id}`,
              `password_${user.email}`,
              `password_${user.email?.trim().toLowerCase()}`,
            ];

            const passwordDetails = passwordKeys.map((key) => ({
              key,
              value: localStorage.getItem(key),
              exists: !!localStorage.getItem(key),
            }));

            const firstPassword = passwordDetails.find((p) => p.exists)?.value;

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              hasPassword: !!firstPassword,
              passwordStorageDetails: {
                byId: !!localStorage.getItem(`password_${user.id}`),
                byEmail: !!localStorage.getItem(`password_${user.email}`),
                byNormalizedEmail: !!localStorage.getItem(
                  `password_${user.email?.trim().toLowerCase()}`,
                ),
                actualPassword: firstPassword || "none",
                allKeys: passwordDetails,
              },
            };
          });
          setUsers(debugInfo);
        }
      } catch (error) {
        console.error("Error loading debug info:", error);
        setUsers([]);
      }
    }
  }, [showDebug]);

  if (!showDebug) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setShowDebug(true)}
          style={{
            background: "rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            borderRadius: "20px",
            padding: "8px 12px",
            fontSize: "12px",
            color: "#666",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Eye size={14} />
          Debug Info
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "white",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        maxWidth: "350px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: 1000,
        fontSize: "14px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertCircle size={16} color="#666" />
          <strong>Debug: Sistema de Login</strong>
        </div>
        <button
          onClick={() => setShowDebug(false)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
          }}
        >
          <EyeOff size={16} color="#666" />
        </button>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Users size={14} color="#007bff" />
            <span style={{ fontWeight: "500" }}>
              Utilizadores Registados: {users.length}
            </span>
          </div>
          <button
            onClick={fixUserPasswords}
            style={{
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: "10px",
              cursor: "pointer",
            }}
          >
            🔧 Corrigir
          </button>
        </div>

        {users.length === 0 ? (
          <p style={{ color: "#666", margin: 0, fontSize: "12px" }}>
            Nenhum utilizador encontrado. Use "Criar Utilizador" no menu.
          </p>
        ) : (
          <div style={{ marginTop: "8px" }}>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  background: "#f8f9fa",
                  padding: "8px",
                  borderRadius: "4px",
                  marginBottom: "6px",
                  fontSize: "12px",
                }}
              >
                <div style={{ fontWeight: "500", marginBottom: "2px" }}>
                  {user.name}
                </div>
                <div style={{ color: "#666", marginBottom: "2px" }}>
                  {user.email}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      background: user.role === "admin" ? "#fff3cd" : "#d4edda",
                      color: user.role === "admin" ? "#856404" : "#155724",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      fontSize: "10px",
                    }}
                  >
                    {user.role === "admin" ? "Admin" : "User"}
                  </span>
                  <div style={{ fontSize: "10px" }}>
                    <span
                      style={{
                        color: user.hasPassword ? "#28a745" : "#dc3545",
                      }}
                    >
                      {user.hasPassword ? "✓ Password OK" : "❌ No Password"}
                    </span>
                    {user.hasPassword && (
                      <div
                        style={{
                          fontSize: "9px",
                          color: "#666",
                          marginTop: "2px",
                        }}
                      >
                        Pass: {user.passwordStorageDetails.actualPassword}
                        <br />
                        Keys: ID:{user.passwordStorageDetails.byId ? "✓" : "❌"}
                        Email:{user.passwordStorageDetails.byEmail ? "✓" : "❌"}
                        Norm:
                        {user.passwordStorageDetails.byNormalizedEmail
                          ? "✓"
                          : "❌"}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <button
                    onClick={() => fixSpecificUser(user.email)}
                    style={{
                      background: user.hasPassword ? "#17a2b8" : "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      padding: "3px 8px",
                      fontSize: "9px",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    {user.hasPassword ? "🔧 Recriar Pass" : "🔑 Criar Pass"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          borderTop: "1px solid #eee",
          paddingTop: "8px",
          fontSize: "11px",
          color: "#666",
        }}
      >
        <div>📍 Credenciais pré-definidas:</div>
        <div>• gongonsilva@gmail.com / 19867gsf</div>
        <div>• tecnico@leirisonda.pt / tecnico123</div>
        <div>• supervisor@leirisonda.pt / supervisor123</div>
      </div>
    </div>
  );
}
