import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export function Login() {
  const [email, setEmail] = useState("gongonsilva@gmail.com");
  const [password, setPassword] = useState("19867gsf");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      console.log("🔐 Tentando login com:", email);
      const success = await login(email, password);

      if (success) {
        console.log("✅ Login bem-sucedido, redirecionando...");
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

  const handleDirectDashboard = () => {
    console.log("🚀 Forçando acesso direto ao dashboard...");
    localStorage.setItem(
      "leirisonda_user",
      JSON.stringify({
        id: "admin_goncalo_direct",
        email: "gongonsilva@gmail.com",
        name: "Gonçalo Fonseca Silva",
        role: "admin",
      }),
    );
    navigate("/dashboard");
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
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2Fb4eb4a9e6feb44b09201dbb824b8737c?format=webp&width=800"
            alt="Leirisonda Logo"
            style={{ height: "60px", marginBottom: "15px" }}
          />
          <h1
            style={{
              margin: "0 0 10px 0",
              color: "#007784",
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            Leirisonda
          </h1>
          <p
            style={{
              margin: 0,
              color: "#666",
              fontSize: "14px",
            }}
          >
            Sistema de Gestão de Obras e Manutenções
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                color: "#333",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email de acesso"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                color: "#333",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Palavra-passe
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Palavra-passe"
                style={{
                  width: "100%",
                  padding: "12px",
                  paddingRight: "45px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fee",
                color: "#c33",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "20px",
                fontSize: "14px",
                textAlign: "center",
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
              padding: "14px",
              backgroundColor: "#007784",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
              marginBottom: "15px",
            }}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>

          <button
            type="button"
            onClick={handleDirectDashboard}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            🚀 FORÇAR DASHBOARD (TESTE)
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#999",
            marginTop: "30px",
          }}
        >
          © 2025 Leirisonda - Sistema Avançado de Gestão de Obras
        </div>
      </div>
    </div>
  );
}
