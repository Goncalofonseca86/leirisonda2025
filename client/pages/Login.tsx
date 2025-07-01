import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Waves, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function Login() {
  const { user, login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in (only when user exists)
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

  // Force no loading state - show login immediately
  // if (isLoading) removed to prevent infinite loading

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #1e293b 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="w-full max-w-lg">
        {/* Modern Card Container */}
        <div
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "16px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Header Section */}
          <div
            className="p-8 text-white text-center relative"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
              padding: "32px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "0",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              }}
            ></div>
            <div style={{ position: "relative", zIndex: 10 }}>
              <div
                className="mx-auto bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg"
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
                className="text-2xl font-bold mb-2"
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                Leirisonda
              </h1>
              <p
                className="text-blue-100"
                style={{ color: "rgba(219, 234, 254, 0.9)", opacity: 0.9 }}
              >
                Sistema de Gestão de Obras
              </p>
            </div>
          </div>

          {/* Login Form */}
          <div className="p-8" style={{ padding: "32px" }}>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="mt-1 h-12"
                  disabled={isSubmitting}
                  style={{
                    height: "48px",
                    fontSize: "16px",
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    marginTop: "4px",
                  }}
                />
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Palavra-passe
                </Label>
                <div style={{ position: "relative" }}>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1 pr-12 h-12"
                    disabled={isSubmitting}
                    style={{
                      height: "48px",
                      fontSize: "16px",
                      width: "100%",
                      padding: "12px 48px 12px 16px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      marginTop: "4px",
                    }}
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
                      color: "#9ca3af",
                      padding: "4px",
                    }}
                  >
                    {showPassword ? (
                      <EyeOff style={{ width: "20px", height: "20px" }} />
                    ) : (
                      <Eye style={{ width: "20px", height: "20px" }} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <Alert
                  className="border-red-200 bg-red-50"
                  style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    padding: "12px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <AlertCircle
                    style={{
                      width: "16px",
                      height: "16px",
                      color: "#dc2626",
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  />
                  <AlertDescription
                    style={{ color: "#991b1b", fontSize: "14px" }}
                  >
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  height: "48px",
                  backgroundColor: isSubmitting ? "#93c5fd" : "#2563eb",
                  color: "white",
                  fontWeight: "500",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    (e.target as HTMLElement).style.backgroundColor = "#1d4ed8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    (e.target as HTMLElement).style.backgroundColor = "#2563eb";
                  }
                }}
              >
                {isSubmitting ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
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
                    ></div>
                    <span>A entrar...</span>
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            © 2024 Leirisonda - Sistema Profissional de Gestão
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
