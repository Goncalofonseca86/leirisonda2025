import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export function Login() {
  const { user, login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await login(email, password);
      if (!success) {
        setError("Email ou palavra-passe incorretos.");
      }
    } catch (err) {
      setError("Erro ao iniciar sessão. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-hero">
      <div className="login-card">
        {/* Cabeçalho */}
        <div
          className="dashboard-hero"
          style={{
            backgroundImage:
              "linear-gradient(135deg, hsl(var(--leirisonda-header-blue)), hsl(var(--leirisonda-secondary)))",
            marginBottom: 0,
            borderRadius: "8px 8px 0 0",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "96px",
                height: "96px",
                backgroundColor: "white",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px auto",
                padding: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F9862202d056a426996e6178b9981c1c7?format=webp&width=800"
                alt="Leirisonda Logo"
                style={{
                  width: "64px",
                  height: "64px",
                  objectFit: "contain",
                }}
              />
            </div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "700",
                margin: "0 0 8px 0",
                color: "white",
              }}
            >
              Leirisonda
            </h1>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", margin: "0" }}>
              Sistema de Gestão de Obras
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div style={{ padding: "32px" }}>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "hsl(var(--leirisonda-text))",
                  marginBottom: "8px",
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled={isSubmitting}
                className="input-leirisonda"
                style={{ width: "100%" }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "hsl(var(--leirisonda-text))",
                  marginBottom: "8px",
                }}
              >
                Palavra-passe
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="input-leirisonda"
                  style={{ width: "100%", paddingRight: "48px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "hsl(var(--leirisonda-text-muted))",
                    padding: "4px",
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <div
                className="badge-pending"
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-leirisonda"
              style={{ width: "100%" }}
            >
              {isSubmitting ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid transparent",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <span>A entrar...</span>
                </div>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "14px",
            margin: "0",
          }}
        >
          © 2024 Leirisonda - Sistema Profissional de Gestão
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
