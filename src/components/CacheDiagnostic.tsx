import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, RefreshCw, Trash2 } from "lucide-react";
import { forceReloadAndClear, clearAllCaches } from "../utils/cacheCleanup";

interface CacheInfo {
  name: string;
  size?: number;
  keys?: number;
}

export const CacheDiagnostic: React.FC = () => {
  const [caches, setCaches] = useState<CacheInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [debugMode, setDebugMode] = useState(
    localStorage.getItem("leirisonda-debug") === "true",
  );

  const scanCaches = async () => {
    setLoading(true);
    try {
      if ("caches" in window) {
        const cacheNames = await window.caches.keys();
        const cacheInfo: CacheInfo[] = [];

        for (const cacheName of cacheNames) {
          const cache = await window.caches.open(cacheName);
          const keys = await cache.keys();
          cacheInfo.push({
            name: cacheName,
            keys: keys.length,
          });
        }
        setCaches(cacheInfo);
      }
    } catch (error) {
      console.error("Error scanning caches:", error);
    }
    setLoading(false);
  };

  const toggleDebugMode = () => {
    const newDebugMode = !debugMode;
    setDebugMode(newDebugMode);

    if (newDebugMode) {
      localStorage.setItem("leirisonda-debug", "true");
    } else {
      localStorage.removeItem("leirisonda-debug");
    }
  };

  const handleClearCaches = async () => {
    if (
      confirm(
        "Tem certeza que deseja limpar todos os caches? A página irá recarregar.",
      )
    ) {
      await forceReloadAndClear();
    }
  };

  useEffect(() => {
    scanCaches();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Diagnóstico de Cache
        </h3>
      </div>

      {/* Debug Mode Toggle */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Modo Debug</h4>
            <p className="text-xs text-gray-600">
              Ativa botão de limpeza de cache na tela principal
            </p>
          </div>
          <button
            onClick={toggleDebugMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              debugMode ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                debugMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Cache Information */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">Caches Ativos</h4>
          <button
            onClick={scanCaches}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
        </div>

        {caches.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            Nenhum cache ativo
          </div>
        ) : (
          <div className="space-y-2">
            {caches.map((cache, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {cache.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {cache.keys} entradas
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  {cache.name.includes("leirisonda") && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      App
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Local Storage Info */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-gray-900">Local Storage</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="font-medium text-gray-900">Entradas Totais</div>
            <div className="text-gray-600">
              {Object.keys(localStorage).length}
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="font-medium text-gray-900">Entradas da App</div>
            <div className="text-gray-600">
              {
                Object.keys(localStorage).filter(
                  (key) =>
                    key.startsWith("leirisonda-") ||
                    key.startsWith("firebase-"),
                ).length
              }
            </div>
          </div>
        </div>
      </div>

      {/* Service Worker Info */}
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium text-gray-900">Service Worker</h4>
        <div className="p-3 bg-gray-50 rounded-md text-sm">
          {navigator.serviceWorker.controller ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              Ativo: {navigator.serviceWorker.controller.scriptURL}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-600">
              <AlertCircle className="h-4 w-4" />
              Nenhum service worker ativo
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleClearCaches}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
        >
          <Trash2 className="h-4 w-4" />
          Limpar Tudo e Recarregar
        </button>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h5 className="text-sm font-medium text-blue-900 mb-2">
          💡 Dicas para Página Branca
        </h5>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Se a página fica branca, use "Limpar Tudo e Recarregar"</li>
          <li>• Ative o modo debug para ter acesso rápido à limpeza</li>
          <li>
            • Teste sempre em modo anônimo para verificar se o problema é cache
          </li>
          <li>• Caches antigos podem causar conflitos após updates</li>
        </ul>
      </div>
    </div>
  );
};
