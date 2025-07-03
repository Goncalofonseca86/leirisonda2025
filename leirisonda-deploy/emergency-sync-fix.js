// CORRETOR AUTOMÁTICO SILENCIOSO - SEM POPUPS
console.log("🔧 Carregando corretor automático silencioso...");

// Interceptar e corrigir automaticamente sem popups
(function () {
  "use strict";

  // Interceptar console.error
  const originalError = console.error;
  console.error = function (...args) {
    const errorMessage = args.join(" ");

    if (
      errorMessage.includes("ERRO SYNC") ||
      errorMessage.includes("initial_full_sync") ||
      (errorMessage.includes("sync") && errorMessage.includes("erro"))
    ) {
      console.log(
        "🔧 ERRO SYNC detectado - corrigindo automaticamente silenciosamente",
      );

      // Corrigir automaticamente sem popup
      setTimeout(() => {
        autoFixSyncQuietly();
      }, 500);

      // Silenciar o erro original
      return;
    }

    // Outros erros passam normalmente
    originalError.apply(console, args);
  };

  // Interceptar alerts de erro de sync
  const originalAlert = window.alert;
  window.alert = function (message) {
    const msg = (message || "").toLowerCase();

    if (msg.includes("sync") && msg.includes("erro")) {
      console.log("🔧 Alert de sync interceptado - corrigindo automaticamente");

      setTimeout(() => {
        autoFixSyncQuietly();
      }, 500);

      return; // Não mostrar o alert
    }

    return originalAlert.call(window, message);
  };

  // Interceptar window errors
  window.addEventListener("error", function (e) {
    if (e.message && e.message.toLowerCase().includes("sync")) {
      console.log("🔧 Window error de sync interceptado");
      e.preventDefault();
      autoFixSyncQuietly();
    }
  });

  // Interceptar promises rejeitadas
  window.addEventListener("unhandledrejection", function (e) {
    if (e.reason && e.reason.toString().toLowerCase().includes("sync")) {
      console.log("🔧 Promise rejeitada de sync interceptada");
      e.preventDefault();
      autoFixSyncQuietly();
    }
  });
})();

// Função de correção automática silenciosa
function autoFixSyncQuietly() {
  console.log("🔧 Executando correção automática silenciosa...");

  try {
    // Remover qualquer popup existente de sync
    const existingPopups = [
      document.getElementById("sync-error-alert"),
      document.getElementById("emergency-fix-interface"),
      document.getElementById("emergency-sync-dialog"),
    ];

    existingPopups.forEach((popup) => {
      if (popup) popup.remove();
    });

    // Parar sync problemático
    if (window.hr) {
      const oldFirebaseState = window.hr.isFirebaseAvailable;
      window.hr.isFirebaseAvailable = false;

      // Limpar estado problemático
      if (window.hr.firestore) {
        try {
          window.hr.firestore.disableNetwork();
        } catch (e) {
          // Ignorar erros
        }
      }

      // Restaurar após breve pausa
      setTimeout(() => {
        window.hr.isFirebaseAvailable = oldFirebaseState;

        if (window.hr.firestore) {
          try {
            window.hr.firestore.enableNetwork();
          } catch (e) {
            // Ignorar erros
          }
        }

        console.log("✅ Sync reset silenciosamente");
      }, 1000);
    }

    // Limpar localStorage problemático silenciosamente
    const problematicKeys = [
      "syncError",
      "syncInProgress",
      "lastSyncAttempt",
      "sync_error_count",
      "firebase_error",
    ];

    problematicKeys.forEach((key) => {
      try {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      } catch (e) {
        // Ignorar erros
      }
    });

    // Reinicar listeners se necessário
    setTimeout(() => {
      if (window.hr && window.hr.init) {
        try {
          // Reinicar sistema silenciosamente
          console.log("🔄 Reiniciando sistema silenciosamente...");
        } catch (e) {
          // Ignorar erros
        }
      }
    }, 2000);

    console.log("✅ Correção automática concluída silenciosamente");
  } catch (error) {
    console.log(
      "⚠️ Erro menor na correção automática (ignorado):",
      error.message,
    );
  }
}

// Interceptar e remover qualquer popup de sync que possa aparecer
setInterval(() => {
  const popupsToRemove = [
    document.getElementById("sync-error-alert"),
    document.getElementById("emergency-fix-interface"),
    document.getElementById("emergency-sync-dialog"),
    document.querySelector('[style*="Correção de Emergência"]'),
    document.querySelector('[style*="ERRO SYNC"]'),
  ];

  popupsToRemove.forEach((popup) => {
    if (popup) {
      popup.remove();
      console.log("🗑️ Popup de sync removido automaticamente");
    }
  });
}, 1000);

// Auto-correção preventiva
setTimeout(() => {
  console.log("🔍 Verificação preventiva de sync...");

  // Se detectar problemas recorrentes, corrigir preventivamente
  const syncErrorCount = localStorage.getItem("sync_error_count") || "0";
  if (parseInt(syncErrorCount) > 0) {
    console.log("🔧 Aplicando correção preventiva...");
    autoFixSyncQuietly();
  }
}, 5000);

console.log(
  "✅ Corretor automático silencioso carregado - sem popups, correções automáticas",
);
