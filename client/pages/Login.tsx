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

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, rgb(30, 41, 59) 0%, rgb(30, 64, 175) 50%, rgb(30, 41, 59) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    fontFamily:
      "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    margin: "0",
    boxSizing: "border-box",
  };

  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "512px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "16px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  };

  const headerStyle: React.CSSProperties = {
    background:
      "linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(6, 182, 212) 100%)",
    padding: "32px",
    textAlign: "center",
    position: "relative",
    color: "white",
  };

  const logoContainerStyle: React.CSSProperties = {
    width: "96px",
    height: "96px",
    background: "white",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px auto",
    padding: "12px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  };

  const logoStyle: React.CSSProperties = {
    width: "64px",
    height: "64px",
    objectFit: "contain",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 8px 0",
    fontFamily: "'Open Sans', sans-serif",
    color: "white",
  };

  const subtitleStyle: React.CSSProperties = {
    color: "rgba(219, 234, 254, 0.9)",
    margin: "0",
    fontSize: "16px",
  };

  const formContainerStyle: React.CSSProperties = {
    padding: "32px",
  };

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  };

  const fieldStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: "rgb(55, 65, 81)",
    marginBottom: "8px",
    fontFamily: "'Open Sans', sans-serif",
  };

  const inputStyle: React.CSSProperties = {
    height: "48px",
    fontSize: "16px",
    padding: "12px 16px",
    border: "1px solid rgb(209, 213, 219)",
    borderRadius: "8px",
    background: "white",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "'Open Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const passwordContainerStyle: React.CSSProperties = {
    position: "relative",
  };

  const passwordInputStyle: React.CSSProperties = {
    ...inputStyle,
    paddingRight: "48px",
  };

  const toggleButtonStyle: React.CSSProperties = {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "rgb(156, 163, 175)",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    borderRadius: "4px",
  };

  const errorStyle: React.CSSProperties = {
    backgroundColor: "rgb(254, 242, 242)",
    border: "1px solid rgb(254, 202, 202)",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
  };

  const errorTextStyle: React.CSSProperties = {
    color: "rgb(153, 27, 27)",
    fontSize: "14px",
    fontFamily: "'Open Sans', sans-serif",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    height: "48px",
    backgroundColor: isSubmitting ? "rgb(147, 197, 253)" : "rgb(37, 99, 235)",
    color: "white",
    fontWeight: "500",
    border: "none",
    borderRadius: "8px",
    cursor: isSubmitting ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontSize: "16px",
    fontFamily: "'Open Sans', sans-serif",
    transition: "all 0.2s",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const copyrightStyle: React.CSSProperties = {
    textAlign: "center",
    marginTop: "24px",
  };

  const copyrightTextStyle: React.CSSProperties = {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "14px",
    fontWeight: "500",
    margin: "0",
    fontFamily: "'Open Sans', sans-serif",
  };

  const spinnerStyle: React.CSSProperties = {
    width: "16px",
    height: "16px",
    border: "2px solid transparent",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  return (
    <div style={containerStyle}>
      <div style={{ width: "100%", maxWidth: "512px" }}>
        <div style={cardStyle}>
          {/* Cabeçalho */}
          <div style={headerStyle}>
            <div
              style={{
                position: "absolute",
                inset: "0",
                background: "rgba(0, 0, 0, 0.1)",
              }}
            ></div>
            <div style={{ position: "relative", zIndex: 10 }}>
              <div style={logoContainerStyle}>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F9862202d056a426996e6178b9981c1c7?format=webp&width=800"
                  alt="Leirisonda Logo"
                  style={logoStyle}
                />
              </div>
              <h1 style={titleStyle}>Leirisonda</h1>
              <p style={subtitleStyle}>Sistema de Gestão de Obras</p>
            </div>
          </div>

          {/* Formulário */}
          <div style={formContainerStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
              {/* Email */}
              <div style={fieldStyle}>
                <label htmlFor="email" style={labelStyle}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  disabled={isSubmitting}
                  autoComplete="email"
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgb(37, 99, 235)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(37, 99, 235, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgb(209, 213, 219)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Password */}
              <div style={fieldStyle}>
                <label htmlFor="password" style={labelStyle}>
                  Palavra-passe
                </label>
                <div style={passwordContainerStyle}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    autoComplete="current-password"
                    style={passwordInputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgb(37, 99, 235)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(37, 99, 235, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgb(209, 213, 219)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={toggleButtonStyle}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "rgb(107, 114, 128)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgb(156, 163, 175)")
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Erro */}
              {error && (
                <div style={errorStyle}>
                  <AlertCircle
                    style={{
                      width: "16px",
                      height: "16px",
                      color: "rgb(220, 38, 38)",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />
                  <div style={errorTextStyle}>{error}</div>
                </div>
              )}

              {/* Botão */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={buttonStyle}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = "rgb(29, 78, 216)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(0, 0, 0, 0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.backgroundColor = "rgb(37, 99, 235)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0, 0, 0, 0.1)";
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <div style={spinnerStyle} />
                    <span>A entrar...</span>
                  </>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div style={copyrightStyle}>
          <p style={copyrightTextStyle}>
            © 2024 Leirisonda - Sistema Profissional de Gestão
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
