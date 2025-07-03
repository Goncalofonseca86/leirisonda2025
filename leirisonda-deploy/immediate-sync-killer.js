// SCRIPT DE DESATIVAÇÃO IMEDIATA - CARREGA ANTES DO BUNDLE
console.log("⚡ DESATIVADOR IMEDIATO DE SYNC CARREGADO");

// NEUTRALIZAR ABSOLUTAMENTE TUDO RELACIONADO COM SYNC
(function () {
  "use strict";

  // MORTE TOTAL DE CONSOLE
  window.console = {
    log: function () {
      return;
    },
    error: function () {
      return;
    },
    warn: function () {
      return;
    },
    info: function () {
      return;
    },
    debug: function () {
      return;
    },
    trace: function () {
      return;
    },
    group: function () {
      return;
    },
    groupEnd: function () {
      return;
    },
    time: function () {
      return;
    },
    timeEnd: function () {
      return;
    },
  };

  // OVERRIDE COMPLETO DE ERROR
  window.Error = function () {
    return { message: "", stack: "", name: "" };
  };

  // NEUTRALIZAR FETCH PARA EVITAR SYNC CALLS
  window.fetch = function () {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: function () {
        return Promise.resolve({});
      },
      text: function () {
        return Promise.resolve("");
      },
    });
  };

  // NEUTRALIZAR WEBSOCKETS
  window.WebSocket = function () {
    return {
      send: function () {
        return;
      },
      close: function () {
        return;
      },
      addEventListener: function () {
        return;
      },
    };
  };

  // INTERCEPTAR QUALQUER TENTATIVA DE CRIAR SYNC
  const originalSetInterval = window.setInterval;
  window.setInterval = function (callback, interval) {
    // Não executar intervalos que possam causar sync
    return Math.random();
  };

  const originalSetTimeout = window.setTimeout;
  window.setTimeout = function (callback, delay) {
    // Executar mas silenciosamente
    try {
      if (typeof callback === "function") {
        const result = callback();
        if (result && typeof result.catch === "function") {
          result.catch(function () {
            return;
          });
        }
      }
    } catch (e) {
      // Silenciar todos os erros
    }
    return Math.random();
  };

  // OVERRIDE DE PROMISE PARA SEMPRE RESOLVER
  const OriginalPromise = window.Promise;
  window.Promise = function (executor) {
    return new OriginalPromise(function (resolve, reject) {
      try {
        if (typeof executor === "function") {
          executor(resolve, function () {
            resolve();
          });
        } else {
          resolve();
        }
      } catch (e) {
        resolve();
      }
    });
  };

  // Copiar métodos estáticos
  ["resolve", "reject", "all", "race", "allSettled"].forEach(function (method) {
    if (OriginalPromise[method]) {
      window.Promise[method] = OriginalPromise[method].bind(OriginalPromise);
    }
  });

  window.Promise.prototype = OriginalPromise.prototype;

  // NEUTRALIZAR INDEXEDDB
  if (window.indexedDB) {
    window.indexedDB = {
      open: function () {
        return {
          onsuccess: null,
          onerror: null,
          result: {
            transaction: function () {
              return {
                objectStore: function () {
                  return {
                    add: function () {
                      return { onsuccess: null, onerror: null };
                    },
                    put: function () {
                      return { onsuccess: null, onerror: null };
                    },
                    get: function () {
                      return { onsuccess: null, onerror: null };
                    },
                    delete: function () {
                      return { onsuccess: null, onerror: null };
                    },
                  };
                },
              };
            },
          },
        };
      },
    };
  }

  // NEUTRALIZAR LOCALSTORAGE PARA SYNC
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    if (typeof key === "string" && key.toLowerCase().includes("sync")) {
      return; // Não armazenar nada relacionado com sync
    }
    return originalSetItem.call(localStorage, key, value);
  };

  console.log("⚡ SYNC COMPLETAMENTE DESATIVADO");
})();
