// INTERCEPTOR DE EMERGÊNCIA para ERRO SYNC (initial_full_sync)
console.log("🚨 Carregando interceptor de emergência para sync");

// Interceptar erro imediatamente
(function () {
  "use strict";

  // Interceptar console.error globalmente
  const originalError = console.error;
  console.error = function (...args) {
    const errorMessage = args.join(" ");

    // Detectar erro específico
    if (
      errorMessage.includes("ERRO SYNC (initial_full_sync)") ||
      errorMessage.includes("initial_full_sync")
    ) {
      console.log("🚨 ERRO SYNC INTERCEPTADO - APLICANDO CORREÇÃO IMEDIATA");

      // Mostrar alerta imediato
      setTimeout(() => {
        showSyncErrorAlert();
      }, 100);

      // Aplicar correção automática
      setTimeout(() => {
        emergencyFixSync();
      }, 500);

      // Não mostrar o erro original (silenciar)
      return;
    }

    // Outros erros passam normalmente
    originalError.apply(console, args);
  };

  // Interceptar throws de erro
  window.addEventListener("error", function (e) {
    if (e.message && e.message.includes("sync")) {
      console.log("🚨 Erro de sync interceptado via window.error");
      e.preventDefault();
      emergencyFixSync();
    }
  });

  // Interceptar promises rejeitadas
  window.addEventListener("unhandledrejection", function (e) {
    if (e.reason && e.reason.toString().includes("sync")) {
      console.log("🚨 Promise rejeitada relacionada com sync");
      e.preventDefault();
      emergencyFixSync();
    }
  });
})();

// Função para mostrar alerta de erro de sync
function showSyncErrorAlert() {
  // Não mostrar se já existe um alerta
  if (document.getElementById("sync-error-alert")) {
    return;
  }

  const alert = document.createElement("div");
  alert.id = "sync-error-alert";
  alert.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #dc3545, #c82333);
    color: white;
    padding: 15px;
    text-align: center;
    z-index: 99999999;
    font-family: monospace;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideDown 0.3s ease;
  `;

  alert.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
      <span>🚨 ERRO DE SINCRONIZAÇÃO DETECTADO</span>
      <button onclick="emergencyFixSync()" 
              style="padding: 8px 16px; background: white; color: #dc3545; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
        🔧 CORRIGIR AGORA
      </button>
      <button onclick="this.parentElement.parentElement.remove()" 
              style="padding: 8px 16px; background: rgba(255,255,255,0.2); color: white; border: 1px solid white; border-radius: 4px; cursor: pointer;">
        ✕ Fechar
      </button>
    </div>
  `;

  // Adicionar CSS de animação
  if (!document.getElementById("sync-alert-css")) {
    const style = document.createElement("style");
    style.id = "sync-alert-css";
    style.textContent = `
      @keyframes slideDown {
        from { transform: translateY(-100%); }
        to { transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(alert);

  // Auto-remover após 30 segundos
  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove();
    }
  }, 30000);
}

// Função de correção de emergência
window.emergencyFixSync = function () {
  console.log("🚨 CORREÇÃO DE EMERGÊNCIA ATIVADA");

  // Remover alerta se existir
  const alert = document.getElementById("sync-error-alert");
  if (alert) alert.remove();

  // Mostrar interface de correção
  const fixInterface = document.createElement("div");
  fixInterface.id = "emergency-fix-interface";
  fixInterface.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 3px solid #dc3545;
    border-radius: 12px;
    padding: 25px;
    z-index: 99999999;
    max-width: 400px;
    width: 90%;
    text-align: center;
    font-family: system-ui, -apple-system, sans-serif;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  `;

  fixInterface.innerHTML = `
    <h3 style="color: #dc3545; margin-bottom: 20px;">🚨 Correção de Emergência</h3>
    <p style="margin-bottom: 20px; color: #666;">
      Erro de sincronização detectado. Escolha uma opção:
    </p>
    
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <button onclick="executeQuickFix()" 
              style="padding: 12px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
        ⚡ CORREÇÃO RÁPIDA
      </button>
      
      <button onclick="executeDeepFix()" 
              style="padding: 12px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
        🔧 CORREÇÃO PROFUNDA
      </button>
      
      <button onclick="forceReload()" 
              style="padding: 12px; background: #ffc107; color: #000; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
        🔄 RECARREGAR PÁGINA
      </button>
      
      <button onclick="this.parentElement.parentElement.remove()" 
              style="padding: 8px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer;">
        ✕ Fechar
      </button>
    </div>
  `;

  document.body.appendChild(fixInterface);
};

// Correção rápida
window.executeQuickFix = function () {
  console.log("⚡ Executando correção rápida...");

  try {
    // Parar sync imediatamente
    if (window.hr) {
      window.hr.isFirebaseAvailable = false;

      setTimeout(() => {
        window.hr.isFirebaseAvailable = true;
        console.log("✅ Firebase resetado");
      }, 1000);
    }

    // Limpar localStorage problemático
    const problematicKeys = ["syncError", "syncInProgress", "lastSyncAttempt"];
    problematicKeys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    // Fechar interface
    const fixInterface = document.getElementById("emergency-fix-interface");
    if (fixInterface) fixInterface.remove();

    // Feedback
    alert(
      "⚡ Correção rápida aplicada!\n\nTenta usar a aplicação normalmente.",
    );
  } catch (error) {
    console.error("❌ Erro na correção rápida:", error);
    alert("❌ Erro na correção rápida. Tenta a correção profunda.");
  }
};

// Correção profunda
window.executeDeepFix = function () {
  console.log("🔧 Executando correção profunda...");

  try {
    // Parar toda a atividade de sync
    if (window.hr) {
      window.hr.isFirebaseAvailable = false;

      if (window.hr.firestore) {
        window.hr.firestore.disableNetwork();
      }
    }

    // Limpar todo o estado de sync
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (
        key.toLowerCase().includes("sync") ||
        key.toLowerCase().includes("firebase") ||
        key.toLowerCase().includes("error")
      ) {
        localStorage.removeItem(key);
      }
    });

    // Limpar sessionStorage
    sessionStorage.clear();

    // Remover service workers
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }

    // Reabilitar após limpeza
    setTimeout(() => {
      if (window.hr) {
        window.hr.isFirebaseAvailable = true;

        if (window.hr.firestore) {
          window.hr.firestore.enableNetwork();
        }
      }

      console.log("✅ Correção profunda concluída");
    }, 2000);

    // Fechar interface
    const fixInterface = document.getElementById("emergency-fix-interface");
    if (fixInterface) fixInterface.remove();

    // Feedback
    alert(
      "🔧 Correção profunda aplicada!\n\nAguarda alguns segundos e tenta usar a aplicação.",
    );
  } catch (error) {
    console.error("❌ Erro na correção profunda:", error);
    alert("❌ Erro na correção profunda. Recomenda-se recarregar a página.");
  }
};

// Forçar reload
window.forceReload = function () {
  if (
    confirm(
      "🔄 Recarregar página?\n\nIsto vai resolver qualquer problema de sync.",
    )
  ) {
    window.location.reload(true);
  }
};

// Auto-executar verificação ao carregar
setTimeout(() => {
  // Verificar se há erros de sync recorrentes
  const syncErrors = localStorage.getItem("sync_error_count") || "0";
  const errorCount = parseInt(syncErrors);

  if (errorCount > 2) {
    console.log("🚨 Múltiplos erros de sync detectados - oferecendo correção");

    setTimeout(() => {
      if (
        confirm(
          "🚨 Problemas de sincronização recorrentes detectados.\n\nAplicar correção automática?",
        )
      ) {
        executeQuickFix();
      }
    }, 2000);
  }
}, 3000);

console.log("✅ Interceptor de emergência para sync carregado");
