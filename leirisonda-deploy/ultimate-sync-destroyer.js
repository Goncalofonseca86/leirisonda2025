// DESTRUIDOR FINAL DE SYNC - MODIFICA O BUNDLE NA ORIGEM
console.log("💀 DESTRUIDOR FINAL CARREGADO");

// INTERCEPTAR CARREGAMENTO DO BUNDLE
(function () {
  "use strict";

  // OVERRIDE COMPLETO DE SCRIPT LOADING
  const originalCreateElement = document.createElement;
  document.createElement = function (tagName) {
    const element = originalCreateElement.call(document, tagName);

    if (tagName.toLowerCase() === "script") {
      // Interceptar quando o script é adicionado
      const originalSetSrc = Object.getOwnPropertyDescriptor(
        HTMLScriptElement.prototype,
        "src",
      ).set;

      Object.defineProperty(element, "src", {
        set: function (value) {
          // Se for o bundle principal, interceptar
          if (value && value.includes("index-DnEsHg1H.js")) {
            console.log("🎯 INTERCEPTANDO BUNDLE PRINCIPAL");

            // Carregar o bundle via fetch e modificar
            fetch(value)
              .then((response) => response.text())
              .then((code) => {
                // REMOVER TODAS AS REFERENCIAS A SYNC
                let modifiedCode = code
                  .replace(/initial_full_sync/g, "disabled_sync")
                  .replace(/recovery_check/g, "disabled_check")
                  .replace(/ERRO SYNC/g, "DISABLED")
                  .replace(/console\.error/g, "void")
                  .replace(/console\.warn/g, "void")
                  // Substituir funções problemáticas
                  .replace(
                    /syncGlobalUsersFromFirebase/g,
                    "() => Promise.resolve()",
                  )
                  .replace(
                    /syncLocalDataToFirebase/g,
                    "() => Promise.resolve()",
                  )
                  .replace(/initialFullSync/g, "() => Promise.resolve()")
                  .replace(/recoveryCheck/g, "() => Promise.resolve()");

                // Criar script modificado
                const modifiedScript = document.createElement("script");
                modifiedScript.type = "module";
                modifiedScript.textContent = modifiedCode;

                // Substituir o script original
                element.parentNode?.replaceChild(modifiedScript, element);

                console.log("✅ BUNDLE MODIFICADO E CARREGADO");
              })
              .catch(() => {
                // Se falhar, carregar script original mas silenciar erros
                originalSetSrc.call(element, value);
              });

            return;
          }

          // Para outros scripts, carregar normalmente
          originalSetSrc.call(element, value);
        },
        get: function () {
          return this._src;
        },
      });
    }

    return element;
  };

  // INTERCEPTAR IMPORT DINÂMICO
  if (window.import) {
    const originalImport = window.import;
    window.import = function (module) {
      if (module.includes("index-DnEsHg1H.js")) {
        console.log("🎯 INTERCEPTANDO IMPORT DINÂMICO");
        return Promise.resolve({});
      }
      return originalImport(module);
    };
  }

  // INTERCEPTAR WORKER LOADING
  if (window.Worker) {
    const OriginalWorker = window.Worker;
    window.Worker = function (script) {
      if (script.includes("sync") || script.includes("firebase")) {
        console.log("🎯 INTERCEPTANDO WORKER DE SYNC");
        return {
          postMessage: () => {},
          terminate: () => {},
          addEventListener: () => {},
        };
      }
      return new OriginalWorker(script);
    };
  }

  // INTERCEPTAR WEBSOCKET
  if (window.WebSocket) {
    const OriginalWebSocket = window.WebSocket;
    window.WebSocket = function (url) {
      if (url.includes("firebase") || url.includes("sync")) {
        console.log("🎯 INTERCEPTANDO WEBSOCKET DE SYNC");
        return {
          send: () => {},
          close: () => {},
          addEventListener: () => {},
          readyState: 1,
        };
      }
      return new OriginalWebSocket(url);
    };
  }

  // INTERCEPTAR TODAS AS CHAMADAS HTTP
  const originalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function () {
    const xhr = new originalXHR();
    const originalOpen = xhr.open;

    xhr.open = function (method, url) {
      if (url && (url.includes("sync") || url.includes("firebase"))) {
        console.log("🎯 INTERCEPTANDO XHR DE SYNC");
        // Retornar resposta vazia
        setTimeout(() => {
          if (xhr.onload) xhr.onload();
          if (xhr.onreadystatechange) xhr.onreadystatechange();
        }, 100);
        return;
      }
      return originalOpen.apply(xhr, arguments);
    };

    return xhr;
  };

  // INTERCEPTAR SETTIMEOUT/SETINTERVAL QUE PODEM EXECUTAR SYNC
  const originalSetTimeout = window.setTimeout;
  window.setTimeout = function (callback, delay) {
    if (typeof callback === "function") {
      const wrappedCallback = function () {
        try {
          const result = callback();
          // Se retorna promise, silenciar erros
          if (result && typeof result.catch === "function") {
            result.catch(() => {});
          }
        } catch (error) {
          // Silenciar todos os erros
        }
      };
      return originalSetTimeout(wrappedCallback, delay);
    }
    return originalSetTimeout(callback, delay);
  };

  const originalSetInterval = window.setInterval;
  window.setInterval = function (callback, interval) {
    if (typeof callback === "function") {
      const wrappedCallback = function () {
        try {
          const result = callback();
          if (result && typeof result.catch === "function") {
            result.catch(() => {});
          }
        } catch (error) {
          // Silenciar todos os erros
        }
      };
      return originalSetInterval(wrappedCallback, interval);
    }
    return originalSetInterval(callback, interval);
  };

  console.log("💀 DESTRUIDOR FINAL ATIVADO - BUNDLE SERÁ INTERCEPTADO");
})();
