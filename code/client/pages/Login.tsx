import React, { useState, useEffect } from "react";
import { LeirisondaLogo } from "../components/LeirisondaLogo";

interface LoginProps {}

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginState {
  isLoading: boolean;
  error: string | null;
  rememberMe: boolean;
}

const Login: React.FC<LoginProps> = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [state, setState] = useState<LoginState>({
    isLoading: false,
    error: null,
    rememberMe: false,
  });

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem("authToken");
    if (token) {
      // Redirect to dashboard if already logged in
      window.location.href = "/dashboard";
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setState((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setState((prev) => ({
        ...prev,
        error: "Por favor, preencha todos os campos.",
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

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock authentication logic
      if (
        formData.email === "admin@leirisonda.pt" &&
        formData.password === "admin123"
      ) {
        const token = "mock-jwt-token-" + Date.now();
        localStorage.setItem("authToken", token);

        if (state.rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        window.location.href = "/dashboard";
      } else {
        setState((prev) => ({
          ...prev,
          error: "Credenciais inválidas. Tente novamente.",
          isLoading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Erro de conexão. Tente novamente.",
        isLoading: false,
      }));
    }
  };

  const handleForgotPassword = () => {
    // Implement forgot password functionality
    alert("Funcionalidade de recuperação de senha em desenvolvimento.");
  };

  return (
    <div className="login-hero">
      <div className="login-card">
        <div className="p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <LeirisondaLogo className="h-12 w-auto mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Leirisonda
            </h1>
            <p className="text-gray-600">Sistema de Gestão de Obras</p>
            <p className="text-xs text-gray-500 mt-2">Versão 2.0.2</p>
          </div>

          {/* Error Message */}
          {state.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-800">{state.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
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

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Palavra-passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                className="input-leirisonda"
                placeholder="••••••••"
                required
                disabled={state.isLoading}
              />
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={state.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={state.isLoading}
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Lembrar-me
                </label>
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-800"
                disabled={state.isLoading}
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={state.isLoading}
              className="btn-leirisonda w-full"
            >
              {state.isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  A carregar...
                </div>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Footer Section */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              © 2025 Leirisonda. Todos os direitos reservados.
            </p>
            <div className="mt-2 space-x-4">
              <a
                href="/privacy"
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Privacidade
              </a>
              <a
                href="/terms"
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Termos
              </a>
              <a
                href="/support"
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Suporte
              </a>
            </div>
          </div>

          {/* Development Info */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-xs text-gray-600 text-center">
                Modo de Desenvolvimento
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                Email: admin@leirisonda.pt | Senha: admin123
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Background Animation */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Login;
