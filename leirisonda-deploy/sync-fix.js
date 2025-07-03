// Script para diagnosticar e corrigir erros de sincronização
console.log("🔧 Carregando diagnóstico de sincronização");

// Função para diagnosticar problemas de sync
function diagnoseSyncIssues() {
  console.log("🔍 Diagnosticando problemas de sincronização...");

  const diagnostics = {
    timestamp: new Date().toISOString(),
    browser: navigator.userAgent,
    online: navigator.onLine,
    localStorage: typeof Storage !== "undefined",
    serviceWorker: "serviceWorker" in navigator,
    firebaseStatus: null,
    networkStatus: null,
    errors: [],
  };

  // Verificar Firebase
  try {
    if (window.hr) {
      diagnostics.firebaseStatus = {
        available: window.hr.isFirebaseAvailable,
        hasFirestore: !!window.hr.firestore,
      };
    } else {
      diagnostics.errors.push("window.hr não encontrado");
    }
  } catch (e) {
    diagnostics.errors.push(`Erro Firebase: ${e.message}`);
  }

  // Verificar conectividade
  try {
    fetch("/manifest.json", { method: "HEAD", cache: "no-cache" })
      .then((response) => {
        diagnostics.networkStatus = response.ok ? "OK" : "ERROR";
      })
      .catch((e) => {
        diagnostics.networkStatus = "OFFLINE";
        diagnostics.errors.push(`Rede: ${e.message}`);
      });
  } catch (e) {
    diagnostics.errors.push(`Teste de rede: ${e.message}`);
  }

  console.log("📊 Diagnóstico completo:", diagnostics);
  return diagnostics;
}

// Função para corrigir problemas de sync
function fixSyncIssues() {
  console.log("🔧 Corrigindo ERRO SYNC (initial_full_sync)...");

  try {
    // Passo 1: Interromper sincronização atual
    console.log("1️⃣ Interrompendo sincronização problemática...");

    if (window.hr) {
      // Desabilitar Firebase temporariamente
      window.hr.isFirebaseAvailable = false;

      // Parar listeners ativos
      if (window.hr.firestore) {
        try {
          window.hr.firestore.disableNetwork();
          console.log("🛑 Firebase network desabilitado");
        } catch (e) {
          console.log("⚠️ Erro ao desabilitar network:", e.message);
        }
      }
    }

    // Passo 2: Limpar estado de sincronização corrompido
    console.log("2️⃣ Limpando estado de sincronização...");

    const syncKeys = [
      "lastSync",
      "syncInProgress",
      "syncError",
      "syncState",
      "firebase_sync_state",
      "initial_sync_complete",
      "sync_timestamp",
    ];

    syncKeys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    // Limpar dados corrompidos
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      try {
        const value = localStorage.getItem(key);
        if (
          value &&
          (value.includes("undefined") ||
            value.includes("null") ||
            value.includes("NaN") ||
            value === "undefined")
        ) {
          localStorage.removeItem(key);
          console.log(`🗑️ Removido dado corrompido: ${key}`);
        }
      } catch (e) {
        localStorage.removeItem(key);
        console.log(`🗑️ Removido chave problemática: ${key}`);
      }
    });

    // Passo 3: Reset completo do Firebase
    console.log("3️⃣ Reset completo do Firebase...");

    setTimeout(() => {
      if (window.hr) {
        try {
          // Reabilitar Firebase
          window.hr.isFirebaseAvailable = true;

          if (window.hr.firestore) {
            // Reabilitar network
            window.hr.firestore
              .enableNetwork()
              .then(() => {
                console.log("✅ Firebase network reabilitado");

                // Aguardar e tentar sincronização limpa
                setTimeout(() => {
                  forceCleanSync();
                }, 2000);
              })
              .catch((e) => {
                console.log("⚠️ Erro ao reabilitar:", e.message);
                // Fallback: recarregar página
                setTimeout(() => {
                  console.log("🔄 Fallback: recarregando página...");
                  window.location.reload();
                }, 3000);
              });
          }
        } catch (e) {
          console.log("❌ Erro no reset Firebase:", e.message);
        }
      }
    }, 1000);

    // Passo 4: Limpar Service Worker
    console.log("4️⃣ Limpando Service Worker...");

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().then(() => {
            console.log("🗑️ Service Worker removido");

            // Re-registrar após limpeza
            navigator.serviceWorker.register("/sw.js").then(() => {
              console.log("✅ Service Worker re-registrado");
            });
          });
        });
      });
    }

    console.log("✅ Correção de sync inicial_full_sync concluída");
    return true;
  } catch (error) {
    console.error("❌ Erro ao corrigir sync:", error);
    return false;
  }
}

// Função para forçar sincronização limpa
function forceCleanSync() {
  console.log("🔄 Forçando sincronização limpa...");

  try {
    if (window.hr) {
      // Tentar múltiplos métodos de sincronização
      const syncMethods = [
        "syncData",
        "syncLocalDataToFirebase",
        "fullSync",
        "initialSync",
        "forceSync",
      ];

      syncMethods.forEach((method) => {
        if (typeof window.hr[method] === "function") {
          console.log(`🔄 Tentando ${method}...`);
          try {
            window.hr[method]()
              .then(() => {
                console.log(`✅ ${method} concluído`);
              })
              .catch((e) => {
                console.log(`⚠️ ${method} falhou:`, e.message);
              });
          } catch (e) {
            console.log(`❌ Erro ao executar ${method}:`, e.message);
          }
        }
      });

      // Verificar se resolveu após 10 segundos
      setTimeout(() => {
        console.log("🔍 Verificando se sync foi corrigido...");

        // Se ainda houver erro, oferecer reload
        const hasErrors = localStorage.getItem("last_sync_error");
        if (hasErrors) {
          console.log("⚠️ Ainda há erros de sync - oferecendo reload");

          if (
            confirm(
              "🔄 Problema de sincronização detectado.\n\nRecarregar página para resolver?",
            )
          ) {
            window.location.reload();
          }
        } else {
          console.log("✅ Sincronização parece estar funcionando");
        }
      }, 10000);
    }
  } catch (error) {
    console.error("❌ Erro na sincronização limpa:", error);
  }
}

// Função para monitorar erros de sync
function monitorSyncErrors() {
  // Interceptar erros de sync
  const originalConsoleError = console.error;
  console.error = function (...args) {
    const errorText = args.join(" ");

    // Detectar especificamente o erro initial_full_sync
    if (
      errorText.includes("initial_full_sync") ||
      errorText.includes("ERRO SYNC")
    ) {
      console.log("🚨 ERRO SYNC (initial_full_sync) detectado!");

      // Registrar erro para rastreamento
      localStorage.setItem("last_sync_error", Date.now().toString());
      localStorage.setItem("sync_error_type", "initial_full_sync");

      // Auto-correção imediata
      setTimeout(() => {
        console.log("🔧 Auto-correção para initial_full_sync...");
        fixInitialFullSyncError();
      }, 500);
    } else if (
      errorText.includes("SYNC") ||
      errorText.includes("Firebase") ||
      errorText.includes("sync")
    ) {
      console.log("🚨 Outro erro de sincronização:", errorText);

      setTimeout(() => {
        fixSyncIssues();
      }, 1000);
    }

    originalConsoleError.apply(console, args);
  };

  // Monitorar eventos de rede
  window.addEventListener("online", () => {
    console.log("🌐 Conectividade restaurada");
    setTimeout(() => {
      // Verificar se há erros de sync pendentes
      const lastError = localStorage.getItem("sync_error_type");
      if (lastError === "initial_full_sync") {
        console.log("🔧 Corrigindo erro pendente após reconexão");
        fixInitialFullSyncError();
      }
    }, 2000);
  });

  window.addEventListener("offline", () => {
    console.log("📴 Dispositivo offline");
  });
}

// Função específica para corrigir erro initial_full_sync
function fixInitialFullSyncError() {
  console.log("🎯 Correção específica para initial_full_sync");

  try {
    // Parar qualquer sync em andamento
    if (window.hr) {
      // Resetar flags de sync
      if (window.hr.isSyncing) {
        window.hr.isSyncing = false;
      }

      // Limpar estado de sync
      const syncStateKeys = [
        "syncInProgress",
        "initialSyncStarted",
        "fullSyncInProgress",
      ];

      syncStateKeys.forEach((key) => {
        if (window.hr[key] !== undefined) {
          window.hr[key] = false;
        }
      });
    }

    // Limpar localStorage relacionado com sync
    const syncStorageKeys = [
      "sync_in_progress",
      "initial_sync_started",
      "full_sync_timestamp",
    ];

    syncStorageKeys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    // Aguardar e tentar novo sync
    setTimeout(() => {
      console.log("🔄 Tentando novo initial_full_sync...");

      if (window.hr && typeof window.hr.syncData === "function") {
        window.hr
          .syncData()
          .then(() => {
            console.log("✅ initial_full_sync corrigido!");
            localStorage.removeItem("sync_error_type");
          })
          .catch((e) => {
            console.log("❌ Ainda há erro no sync:", e.message);

            // Última tentativa: reload
            setTimeout(() => {
              if (
                confirm(
                  "🔄 Erro de sincronização persistente.\n\nRecarregar página?",
                )
              ) {
                window.location.reload();
              }
            }, 3000);
          });
      }
    }, 2000);
  } catch (error) {
    console.error("❌ Erro na correção initial_full_sync:", error);
  }
}

// Função para correção manual via botão de definições
window.fixSyncManually = function () {
  console.log("🔧 Correção manual de sincronização iniciada");

  if (
    !confirm(
      "🔧 CORRIGIR PROBLEMAS DE SINCRONIZAÇÃO?\n\nVou tentar:\n✅ Limpar cache corrompido\n✅ Resetar Firebase\n✅ Atualizar Service Worker\n✅ Forçar nova sincronização\n\nContinuar?",
    )
  ) {
    return;
  }

  // Mostrar diagnóstico primeiro
  const diagnostics = diagnoseSyncIssues();

  const diagText = `📊 DIAGNÓSTICO:\n\nOnline: ${diagnostics.online}\nFirebase: ${diagnostics.firebaseStatus?.available ? "OK" : "ERRO"}\nErros: ${diagnostics.errors.length}\n\n${diagnostics.errors.join("\n")}`;

  alert(diagText);

  // Executar correções
  const success = fixSyncIssues();

  setTimeout(() => {
    if (success) {
      alert(
        "✅ Tentativas de correção executadas!\n\n🔄 A aplicação vai ser recarregada para aplicar as correções.",
      );

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      alert(
        "❌ Erro durante as correções.\n\nTenta recarregar a página manualmente.",
      );
    }
  }, 3000);
};

// Inicialização automática
try {
  // Aguardar carregamento da aplicação
  setTimeout(() => {
    console.log("🔍 Verificando necessidade de correção de sync...");

    // Verificar se há erros persistentes
    const lastError = localStorage.getItem("last_sync_error");
    const now = Date.now();

    if (lastError) {
      const errorTime = parseInt(lastError);
      const timeDiff = now - errorTime;

      // Se erro foi há menos de 5 minutos, tentar correção
      if (timeDiff < 300000) {
        console.log(
          "🚨 Erro de sync recente detectado - aplicando correção automática",
        );
        fixSyncIssues();
      }
    }

    // Ativar monitoramento
    monitorSyncErrors();
  }, 3000);

  // Registrar timestamp de possíveis erros
  window.addEventListener("error", (e) => {
    if (e.message && e.message.includes("sync")) {
      localStorage.setItem("last_sync_error", Date.now().toString());
    }
  });
} catch (error) {
  console.error("❌ Erro na inicialização do sync-fix:", error);
}

console.log("✅ Sistema de correção de sync carregado");
