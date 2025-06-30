import React from "react";
import { Link } from "react-router-dom";

export function SimpleTest() {
  const [testResults, setTestResults] = React.useState<any>({});

  const runTests = () => {
    const results: any = {
      timestamp: new Date().toISOString(),
      location: window.location.href,
      reactContext: {
        hasReact: !!React,
        hasUseState: !!React.useState,
        hasUseEffect: !!React.useEffect,
        hasUseContext: !!React.useContext,
      },
      authTests: {},
    };

    // Teste 1: Verificar se AuthProvider está disponível
    try {
      const { useAuth } = require("@/components/AuthProvider");
      results.authTests.authProviderImport = "OK";

      // Teste 2: Tentar usar useAuth
      try {
        // Não podemos usar hooks aqui, então vamos verificar só se existe
        results.authTests.useAuthAvailable =
          typeof useAuth === "function" ? "OK" : "ERROR";
      } catch (err) {
        results.authTests.useAuthError = err.message;
      }
    } catch (err) {
      results.authTests.authProviderImportError = err.message;
    }

    // Teste 3: Verificar localStorage
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      results.localStorageTest = "OK";
    } catch (err) {
      results.localStorageError = err.message;
    }

    setTestResults(results);
    console.log("🧪 Resultados dos testes:", results);
  };

  React.useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">
            🧪 Teste Simples do Sistema
          </h1>

          <button
            onClick={runTests}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Executar Testes
          </button>

          {testResults.timestamp && (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Resultados:</h3>
              <pre className="text-xs overflow-auto max-h-96">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 space-y-2">
            <Link
              to="/login"
              className="block px-4 py-2 bg-green-600 text-white rounded text-center hover:bg-green-700"
            >
              Ir para Login
            </Link>

            <Link
              to="/system-status"
              className="block px-4 py-2 bg-yellow-600 text-white rounded text-center hover:bg-yellow-700"
            >
              Ir para System Status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
