import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
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
    <>
      <style>{`
        .login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1e293b 0%, #1e40af 50%, #1e293b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        
        .login-card {
          width: 100%;
          max-width: 512px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
        }
        
        .login-header {
          background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
          padding: 32px;
          text-align: center;
          position: relative;
          color: white;
        }
        
        .login-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.1);
        }
        
        .login-header-content {
          position: relative;
          z-index: 10;
        }
        
        .logo-container {
          width: 96px;
          height: 96px;
          background: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px auto;
          padding: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .logo-img {
          width: 64px;
          height: 64px;
          object-fit: contain;
        }
        
        .login-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
          margin: 0;
        }
        
        .login-subtitle {
          color: rgba(219, 234, 254, 0.9);
          opacity: 0.9;
          margin: 0;
        }
        
        .login-form-container {
          padding: 32px;
        }
        
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-label {
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
        }
        
        .form-input {
          height: 48px;
          font-size: 16px;
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .form-input:disabled {
          background-color: #f9fafb;
          cursor: not-allowed;
        }
        
        .password-container {
          position: relative;
        }
        
        .password-input {
          padding-right: 48px;
        }
        
        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .password-toggle:hover {
          color: #6b7280;
        }
        
        .error-alert {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        
        .error-icon {
          width: 16px;
          height: 16px;
          color: #dc2626;
          flex-shrink: 0;
          margin-top: 2px;
        }
        
        .error-text {
          color: #991b1b;
          font-size: 14px;
        }
        
        .submit-button {
          width: 100%;
          height: 48px;
          background-color: #2563eb;
          color: white;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.2s;
          font-size: 16px;
        }
        
        .submit-button:hover:not(:disabled) {
          background-color: #1d4ed8;
        }
        
        .submit-button:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
        
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .copyright {
          text-align: center;
          margin-top: 24px;
        }
        
        .copyright-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 500;
          margin: 0;
        }
        
        @media (max-width: 640px) {
          .login-container {
            padding: 8px;
          }
          
          .login-header {
            padding: 24px;
          }
          
          .login-form-container {
            padding: 24px;
          }
          
          .logo-container {
            width: 80px;
            height: 80px;
            margin-bottom: 16px;
          }
          
          .logo-img {
            width: 48px;
            height: 48px;
          }
          
          .login-title {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          {/* Header Section */}
          <div className="login-header">
            <div className="login-header-content">
              <div className="logo-container">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F9862202d056a426996e6178b9981c1c7?format=webp&width=800"
                  alt="Leirisonda Logo"
                  className="logo-img"
                />
              </div>
              <h1 className="login-title">Leirisonda</h1>
              <p className="login-subtitle">Sistema de Gestão de Obras</p>
            </div>
          </div>

          {/* Login Form */}
          <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="form-input"
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Palavra-passe
                </label>
                <div className="password-container">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="form-input password-input"
                    disabled={isSubmitting}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-alert">
                  <AlertCircle className="error-icon" />
                  <div className="error-text">{error}</div>
                </div>
              )}

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
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
        <div className="copyright">
          <p className="copyright-text">
            © 2024 Leirisonda - Sistema Profissional de Gestão
          </p>
        </div>
      </div>
    </>
  );
}
