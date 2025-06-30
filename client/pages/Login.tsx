import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, rgb(97, 165, 214) 0%, rgb(0, 119, 132) 100%)",
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
            alt="Leirisonda Logo"
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
                transition: "border-color 0.3s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#007784";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e6ed";
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
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                style={{
                  width: "100%",
                  padding: "16px",
                  paddingRight: "50px",
                  border: "2px solid #e0e6ed",
                  borderRadius: "12px",
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#007784";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0e6ed";
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#666",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
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
              transition: "background-color 0.3s ease",
              marginBottom: "20px",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = "#005f6b";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.target.style.backgroundColor = "#007784";
              }
            }}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>

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
