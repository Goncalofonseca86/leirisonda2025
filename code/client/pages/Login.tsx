import React, { useState, useEffect } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { LeirisondaLogo } from "../../src/components/LeirisondaLogo";
import { useAuth } from "../../src/hooks/useAuth";
import type { LoginCredentials } from "../../src/types";

interface LoginFormData extends LoginCredentials {
  rememberMe: boolean;
}

interface LoginState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  showPassword: boolean;
  formTouched: boolean;
}

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [state, setState] = useState<LoginState>({
    isLoading: false,
    error: null,
    success: null,
    showPassword: false,
    formTouched: false,
  });

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Check for remembered credentials
    const rememberMe = localStorage.getItem("rememberMe");
    const savedEmail = localStorage.getItem("savedEmail");

    if (rememberMe === "true" && savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        rememberMe: true,
      }));
    }
  }, []);

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setState((prev) => ({
        ...prev,
        error: "Por favor, insira o seu email.",
      }));
      return false;
    }

    if (!formData.password.trim()) {
      setState((prev) => ({
        ...prev,
        error: "Por favor, insira a sua palavra-passe.",
      }));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setState((prev) => ({
        ...prev,
        error: "Por favor, insira um email válido.",
      }));
      return false;
    }

    if (formData.password.length < 6) {
      setState((prev) => ({
        ...prev,
        error: "A palavra-passe deve ter pelo menos 6 caracteres.",
      }));
      return false;
    }

    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setState((prev) => ({
      ...prev,
      error: null,
      formTouched: true,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      success: null,
    }));

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });

      // Save email if remember me is checked
      if (formData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("savedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("savedEmail");
      }

      setState((prev) => ({
        ...prev,
        success: "Login realizado com sucesso! A redirecionar...",
        isLoading: false,
      }));

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        isLoading: false,
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleForgotPassword = () => {
    alert(
      "Funcionalidade de recuperação de palavra-passe em desenvolvimento.\n\nPara acesso de demonstração:\nEmail: admin@leirisonda.pt\nPalavra-passe: admin123",
    );
  };

  return (
    <div className="login-hero">
      {/* Background decorations */}
      <div className="background-decoration"></div>

      <div className="login-card">
        <div className="p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <LeirisondaLogo className="mx-auto" width={160} height={50} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-gray-600 text-base">
              Sistema de Gestão de Obras
            </p>
            <p className="text-xs text-gray-500 mt-2">Versão 2.0.2</p>
          </div>

          {/* Status Messages */}
          {state.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                <p className="text-sm text-red-800 font-medium">
                  {state.error}
                </p>
              </div>
            </div>
          )}

          {state.success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <p className="text-sm text-green-800 font-medium">
                  {state.success}
                </p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email de acesso
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-leirisonda"
                placeholder="seu@email.com"
                required
                disabled={state.isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Palavra-passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={state.showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-leirisonda pr-12"
                  placeholder="••••••••"
                  required
                  disabled={state.isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle"
                  disabled={state.isLoading}
                  aria-label={
                    state.showPassword
                      ? "Ocultar palavra-passe"
                      : "Mostrar palavra-passe"
                  }
                >
                  {state.showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-baby-blue-400 focus:ring-baby-blue-400 border-gray-300 rounded transition-colors"
                  disabled={state.isLoading}
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700 font-medium"
                >
                  Lembrar-me
                </label>
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-baby-blue-400 hover:text-baby-blue-500 font-medium transition-colors"
                disabled={state.isLoading}
              >
                Esqueceu a palavra-passe?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={state.isLoading}
              className="btn-leirisonda w-full"
            >
              {state.isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />A entrar...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Development Credentials */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">
                🔧 Credenciais de Desenvolvimento
              </h4>
              <div className="text-xs text-blue-700 space-y-1">
                <p>
                  <strong>Email:</strong> admin@leirisonda.pt
                </p>
                <p>
                  <strong>Palavra-passe:</strong> admin123
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center border-t pt-6">
            <p className="text-xs text-gray-500 mb-3">
              © 2025 Leirisonda. Todos os direitos reservados.
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="/privacy"
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Privacidade
              </a>
              <a
                href="/terms"
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Termos de Uso
              </a>
              <a
                href="/support"
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Suporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
