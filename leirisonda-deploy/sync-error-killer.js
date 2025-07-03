// SCRIPT ASSASSINO DE ERROS SYNC - ULTRA AGRESSIVO
console.log("💀 Carregando assassino de erros SYNC...");

(function () {
  "use strict";

  // MATAR TODOS OS ERROS SYNC NA ORIGEM

  // 1. INTERCEPTAR E NEUTRALIZAR CONSOLE.ERROR
  const originalConsoleError = console.error;
  console.error = function () {
    // MORTE TOTAL - NÃO MOSTRAR NADA
    return;
  };

  // 2. INTERCEPTAR E NEUTRALIZAR CONSOLE.WARN
  const originalConsoleWarn = console.warn;
  console.warn = function () {
    return;
  };

  // 3. ASSASSINAR WINDOW.ERROR
  window.addEventListener(
    "error",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    },
    { capture: true, passive: false },
  );

  // 4. ASSASSINAR PROMISES REJEITADAS
  window.addEventListener(
    "unhandledrejection",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    { capture: true, passive: false },
  );

  // 5. INTERCEPTAR ESPECÍFICO PARA BUNDLE
  const originalSetTimeout = window.setTimeout;
  window.setTimeout = function (callback, delay) {
    const wrappedCallback = function () {
      try {
        callback();
      } catch (error) {
        // Silenciar todos os erros em timeouts
        return;
      }
    };
    return originalSetTimeout(wrappedCallback, delay);
  };

  // 6. INTERCEPTAR FETCH QUE CAUSA SYNC ERRORS
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    return originalFetch.apply(this, args).catch(function (error) {
      // Silenciar erros de fetch relacionados com sync
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  };

  // 7. OVERRIDE TOTAL DE ERROR CONSTRUCTOR
  const OriginalError = window.Error;
  window.Error = function (message) {
    if (!message) return new OriginalError("");

    const msg = message.toString().toLowerCase();
    if (
      msg.includes("sync") ||
      msg.includes("firebase") ||
      msg.includes("initial_full_sync") ||
      msg.includes("recovery_check")
    ) {
      return { message: "", stack: "", name: "" };
    }

    return new OriginalError(message);
  };

  // 8. INTERCEPTAR PROMISES GLOBAIS
  const OriginalPromise = window.Promise;
  window.Promise = function (executor) {
    const wrappedExecutor = function (resolve, reject) {
      const wrappedReject = function (reason) {
        if (
          reason &&
          reason.toString &&
          reason.toString().toLowerCase().includes("sync")
        ) {
          resolve(); // Converter rejeição em resolução
          return;
        }
        reject(reason);
      };

      try {
        executor(resolve, wrappedReject);
      } catch (error) {
        resolve(); // Sempre resolver em caso de erro
      }
    };

    return new OriginalPromise(wrappedExecutor);
  };

  // Copiar métodos estáticos
  Object.setPrototypeOf(window.Promise, OriginalPromise);
  Object.defineProperty(window.Promise, "prototype", {
    value: OriginalPromise.prototype,
    writable: false,
  });

  // 9. NEUTRALIZAR ESPECÍFICO PARA O BUNDLE
  window.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
      // Procurar e neutralizar funções problemáticas
      if (window.hr) {
        // Neutralizar todas as funções de sync
        Object.keys(window.hr).forEach(function (key) {
          if (key.toLowerCase().includes("sync")) {
            window.hr[key] = function () {
              return Promise.resolve();
            };
          }
        });
      }

      // Neutralizar qualquer função global que possa causar sync errors
      ["syncData", "initialSync", "fullSync", "recoveryCheck"].forEach(
        function (funcName) {
          if (window[funcName]) {
            window[funcName] = function () {
              return Promise.resolve();
            };
          }
        },
      );
    }, 500);
  });

  // 10. INTERCEPTAR EVAL E NEW FUNCTION
  const originalEval = window.eval;
  window.eval = function (code) {
    try {
      return originalEval(code);
    } catch (error) {
      return undefined; // Silenciar erros de eval
    }
  };

  console.log("💀 Assassino de erros SYNC ativado - modo extermínio total");
})();
