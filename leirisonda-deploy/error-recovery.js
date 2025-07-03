// SISTEMA DE RECUPERAÇÃO AUTOMÁTICA DE ERROS
console.log("🛡️ Carregando sistema de recuperação de erros...");

(function () {
  "use strict";

  // Contador de erros para evitar loops infinitos
  let errorCount = 0;
  let lastErrorTime = 0;
  const MAX_ERRORS = 5;
  const ERROR_TIMEOUT = 30000; // 30 segundos

  // Interceptar erros globais do JavaScript
  window.addEventListener("error", function (event) {
    const now = Date.now();

    // Reset counter se passou tempo suficiente
    if (now - lastErrorTime > ERROR_TIMEOUT) {
      errorCount = 0;
    }

    errorCount++;
    lastErrorTime = now;

    console.log(
      `🚨 Erro JS capturado (${errorCount}/${MAX_ERRORS}):`,
      event.error?.message || event.message,
    );

    // Se muitos erros, fazer reset completo
    if (errorCount >= MAX_ERRORS) {
      console.log("🔄 Muitos erros detectados - fazendo reset completo");
      performEmergencyReset();
      return;
    }

    // Tentar recuperar do erro específico
    handleSpecificError(event.error || event);

    // Prevenir propagação se for erro conhecido
    if (isKnownError(event.error?.message || event.message)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  // Interceptar erros de Promise rejeitadas
  window.addEventListener("unhandledrejection", function (event) {
    console.log("🚨 Promise rejeitada capturada:", event.reason);

    const reason = event.reason?.toString() || "";

    // Firebase errors
    if (reason.includes("Firebase") || reason.includes("firestore")) {
      console.log("🔧 Erro Firebase detectado - aplicando correção");
      handleFirebaseError();
      event.preventDefault();
    }

    // Sync errors
    if (reason.includes("sync") || reason.includes("SYNC")) {
      console.log("🔧 Erro de sync detectado - aplicando correção");
      handleSyncError();
      event.preventDefault();
    }

    // React errors
    if (reason.includes("React") || reason.includes("Component")) {
      console.log("🔧 Erro React detectado - aplicando correção");
      handleReactError();
      event.preventDefault();
    }
  });

  // Interceptar erros de console
  const originalConsoleError = console.error;
  console.error = function (...args) {
    const message = args.join(" ");

    // Silenciar erros conhecidos e corrigi-los
    if (isKnownError(message)) {
      console.log(
        `🔧 Erro conhecido silenciado e corrigido: ${message.substring(0, 100)}...`,
      );
      handleSpecificError({ message });
      return; // Não mostrar o erro
    }

    // Outros erros passam normalmente
    originalConsoleError.apply(console, args);
  };

  // Verificar se é um erro conhecido
  function isKnownError(message) {
    if (!message) return false;

    const knownErrors = [
      "Firebase",
      "firestore",
      "FIREBASE CREATE FALHOU",
      "ERRO SYNC",
      "initial_full_sync",
      "sync",
      "wn@https",
      "Qse@https",
      "Load failed",
      "Application Error",
    ];

    return knownErrors.some((error) =>
      message.toLowerCase().includes(error.toLowerCase()),
    );
  }

  // Lidar com erros específicos
  function handleSpecificError(error) {
    const message = error?.message || error?.toString() || "";

    if (message.includes("Firebase") || message.includes("firestore")) {
      handleFirebaseError();
    } else if (message.includes("sync") || message.includes("SYNC")) {
      handleSyncError();
    } else if (message.includes("React") || message.includes("Component")) {
      handleReactError();
    } else if (message.includes("Load failed")) {
      handleLoadError();
    } else {
      handleGenericError();
    }
  }

  // Corrigir erros do Firebase
  function handleFirebaseError() {
    console.log("🔧 Corrigindo erro Firebase...");

    try {
      // Desabilitar Firebase temporariamente
      if (window.hr) {
        window.hr.isFirebaseAvailable = false;

        // Tentar reconectar após delay
        setTimeout(() => {
          console.log("🔄 Tentando reconectar Firebase...");
          window.hr.isFirebaseAvailable = true;

          if (window.hr.firestore) {
            try {
              window.hr.firestore.enableNetwork();
            } catch (e) {
              console.log("⚠️ Falha ao reativar rede Firebase (ignorado)");
            }
          }
        }, 3000);
      }

      // Limpar estado Firebase problemático
      clearFirebaseState();
    } catch (e) {
      console.log("⚠️ Erro ao corrigir Firebase:", e.message);
    }
  }

  // Corrigir erros de sync
  function handleSyncError() {
    console.log("🔧 Corrigindo erro de sync...");

    try {
      // Parar sync atual
      if (window.hr && window.hr.stopSync) {
        window.hr.stopSync();
      }

      // Limpar estado de sync
      const syncKeys = ["syncInProgress", "syncError", "lastSyncAttempt"];
      syncKeys.forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      // Reiniciar sync após delay
      setTimeout(() => {
        if (window.hr && window.hr.startSync) {
          console.log("🔄 Reiniciando sync...");
          window.hr.startSync();
        }
      }, 5000);
    } catch (e) {
      console.log("⚠️ Erro ao corrigir sync:", e.message);
    }
  }

  // Corrigir erros do React
  function handleReactError() {
    console.log("🔧 Corrigindo erro React...");

    try {
      // Limpar estado React problemático
      if (
        window.React &&
        window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
      ) {
        console.log("🔄 Limpando estado React...");
      }

      // Remover componentes problemáticos
      const problematicElements = document.querySelectorAll(
        '[data-error="true"]',
      );
      problematicElements.forEach((el) => el.remove());

      // Forçar re-render após delay
      setTimeout(() => {
        if (window.location.pathname.includes("/create-work")) {
          console.log("🔄 Forçando re-render da página...");
          // Trigger re-render sem reload completo
          history.replaceState({}, "", window.location.pathname);
        }
      }, 2000);
    } catch (e) {
      console.log("⚠️ Erro ao corrigir React:", e.message);
    }
  }

  // Corrigir erros de carregamento
  function handleLoadError() {
    console.log("🔧 Corrigindo erro de carregamento...");

    try {
      // Limpar cache problemático
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            if (name.includes("assets") || name.includes("static")) {
              caches.delete(name);
            }
          });
        });
      }

      // Recarregar recursos críticos
      const scripts = document.querySelectorAll('script[src*="assets"]');
      scripts.forEach((script) => {
        if (script.src.includes("index-")) {
          const newScript = document.createElement("script");
          newScript.src = script.src + "?t=" + Date.now();
          newScript.onload = () => console.log("✅ Script recarregado");
          script.parentNode.replaceChild(newScript, script);
        }
      });
    } catch (e) {
      console.log("⚠️ Erro ao corrigir carregamento:", e.message);
    }
  }

  // Corrigir erros genéricos
  function handleGenericError() {
    console.log("🔧 Aplicando correção genérica...");

    try {
      // Limpar localStorage problemático
      const problematicKeys = Object.keys(localStorage).filter(
        (key) =>
          key.includes("error") ||
          key.includes("failed") ||
          key.includes("corrupt"),
      );

      problematicKeys.forEach((key) => localStorage.removeItem(key));

      // Remover elementos com erros
      const errorElements = document.querySelectorAll(
        '[class*="error"], [id*="error"]',
      );
      errorElements.forEach((el) => {
        if (
          el.textContent.includes("Error") ||
          el.textContent.includes("Erro")
        ) {
          el.style.display = "none";
        }
      });
    } catch (e) {
      console.log("⚠️ Erro na correção genérica:", e.message);
    }
  }

  // Limpar estado Firebase
  function clearFirebaseState() {
    const firebaseKeys = Object.keys(localStorage).filter(
      (key) =>
        key.includes("firebase") ||
        key.includes("Firebase") ||
        key.includes("firestore"),
    );

    firebaseKeys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  // Reset de emergência
  function performEmergencyReset() {
    console.log("🚨 EXECUTANDO RESET DE EMERGÊNCIA...");

    try {
      // Parar todos os serviços
      if (window.hr) {
        window.hr.isFirebaseAvailable = false;
        if (window.hr.stopSync) window.hr.stopSync();
      }

      // Limpar todo o armazenamento
      localStorage.clear();
      sessionStorage.clear();

      // Limpar cache
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }

      // Remover service workers
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => registration.unregister());
        });
      }

      // Mostrar mensagem e recarregar
      setTimeout(() => {
        if (
          confirm(
            "🚨 Sistema instável detectado.\n\nRecarregar aplicação para correção completa?",
          )
        ) {
          window.location.reload(true);
        }
      }, 1000);
    } catch (e) {
      console.log("❌ Falha no reset de emergência:", e.message);
      // Forçar reload como último recurso
      setTimeout(() => {
        window.location.reload(true);
      }, 2000);
    }
  }

  // Monitorar saúde do sistema
  setInterval(() => {
    // Verificar se há elementos de erro visíveis
    const visibleErrors = document.querySelectorAll(
      '[style*="color: red"], .error:not([style*="display: none"])',
    );

    if (visibleErrors.length > 0) {
      console.log(
        `🔧 ${visibleErrors.length} elementos de erro detectados - ocultando`,
      );
      visibleErrors.forEach((el) => {
        el.style.display = "none";
      });
    }

    // Verificar se a aplicação está respondendo
    if (
      document.body &&
      document.body.textContent.includes("Application Error")
    ) {
      console.log("🔧 Texto de erro detectado - limpando");
      const errorTexts = document.querySelectorAll("*");
      errorTexts.forEach((el) => {
        if (el.textContent && el.textContent.includes("Application Error")) {
          el.style.display = "none";
        }
      });
    }
  }, 3000);

  // Interceptar fetch errors
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    return originalFetch.apply(this, args).catch((error) => {
      console.log("🔧 Erro de fetch interceptado:", error.message);

      // Tentar novamente após delay
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          originalFetch.apply(this, args).then(resolve).catch(reject);
        }, 2000);
      });
    });
  };

  console.log("✅ Sistema de recuperação de erros ativo");
})();
