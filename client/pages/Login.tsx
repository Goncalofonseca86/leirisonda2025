import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Verificar credenciais hardcoded
      if (email === "gongonsilva@gmail.com" && password === "19867gsf") {
        // Criar usuário no localStorage
        const user = {
          id: "admin_goncalo_working",
          email: "gongonsilva@gmail.com",
          name: "Gonçalo Fonseca Silva",
          role: "admin",
          permissions: {
            canViewWorks: true,
            canCreateWorks: true,
            canEditWorks: true,
            canDeleteWorks: true,
            canViewUsers: true,
            canCreateUsers: true,
            canEditUsers: true,
            canDeleteUsers: true,
            canViewReports: true,
            canExportData: true,
            canViewDashboard: true,
            canViewStats: true,
            canManageSystem: true,
            canManageNotifications: true,
            canViewMaintenance: true,
            canCreateMaintenance: true,
          },
        };

        localStorage.setItem("leirisonda_user", JSON.stringify(user));
        console.log("✅ Login bem-sucedido para Gonçalo");
        navigate("/dashboard");
      } else if (
        email === "alexkamaryta@gmail.com" &&
        password === "69alexandre"
      ) {
        // Login do Alexandre
        const user = {
          id: "user_alexandre",
          email: "alexkamaryta@gmail.com",
          name: "Alexandre Fernandes",
          role: "user",
          permissions: {
            canViewWorks: true,
            canCreateWorks: false,
            canEditWorks: true,
            canDeleteWorks: false,
            canViewUsers: false,
            canCreateUsers: false,
            canEditUsers: false,
            canDeleteUsers: false,
            canViewReports: true,
            canExportData: false,
            canViewDashboard: true,
            canViewStats: true,
          },
        };

        localStorage.setItem("leirisonda_user", JSON.stringify(user));
        console.log("✅ Login bem-sucedido para Alexandre");
        navigate("/dashboard");
      } else {
        setError("Credenciais inválidas. Tente novamente.");
      }
    } catch (err) {
      console.error("❌ Erro durante login:", err);
      setError("Erro ao iniciar sessão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #61a5d6 0%, #007784 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Open Sans, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
          width: "100%",
          maxWidth: "420px",
          textAlign: "center",
        }}
      >
        {/* Logo e Título */}
        <div style={{ marginBottom: "40px" }}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2Fb4eb4a9e6feb44b09201dbb824b8737c?format=webp&width=800"
            alt="Logo"
            style={{
              height: "80px",
              marginBottom: "20px",
              display: "block",
              margin: "0 auto 20px auto",
            }}
          />
          <p
            style={{
              fontSize: "16px",
              color: "#666",
              margin: "0",
            }}
          >
            Sistema de Gestão de Obras
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "24px", textAlign: "left" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "8px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              style={{
                width: "100%",
                padding: "16px",
                border: "2px solid #e0e6ed",
                borderRadius: "12px",
                fontSize: "16px",
                outline: "none",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "24px", textAlign: "left" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#333",
                marginBottom: "8px",
              }}
            >
              Palavra-passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              style={{
                width: "100%",
                padding: "16px",
                border: "2px solid #e0e6ed",
                borderRadius: "12px",
                fontSize: "16px",
                outline: "none",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "24px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "18px",
              backgroundColor: isSubmitting ? "#94a3b8" : "#007784",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: "600",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              marginBottom: "20px",
            }}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Credenciais para teste */}
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#666",
          }}
        >
          <strong>Credenciais de teste:</strong>
          <br />
          Admin: gongonsilva@gmail.com / 19867gsf
          <br />
          User: alexkamaryta@gmail.com / 69alexandre
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "30px",
            paddingTop: "20px",
            borderTop: "1px solid #e0e6ed",
            fontSize: "12px",
            color: "#999",
          }}
        >
          © 2025 Leirisonda - Sistema Avançado de Gestão
        </div>
      </div>
    </div>
  );
}
