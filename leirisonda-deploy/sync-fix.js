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
  console.log("🔧 Tentando corrigir problemas de sincronização...");

  try {
    // Passo 1: Limpar cache problemático
    console.log("1️⃣ Limpando cache problemático...");

    // Remover dados corrompidos
    const keysToCheck = Object.keys(localStorage);
    keysToCheck.forEach((key) => {
      try {
        const value = localStorage.getItem(key);
        if ((value && value.includes("undefined")) || value.includes("null")) {
          localStorage.removeItem(key);
          console.log(`🗑️ Removido dado corrompido: ${key}`);
        }
      } catch (e) {
        console.log(`❌ Erro ao verificar ${key}: ${e.message}`);
      }
    });

    // Passo 2: Resetar estado Firebase
    console.log("2️⃣ Resetando estado Firebase...");

    if (window.hr) {
      try {
        // Forçar reconexão
        if (window.hr.firestore) {
          window.hr.firestore
            .enableNetwork()
            .then(() => {
              console.log("✅ Firebase network reabilitado");
            })
            .catch((e) => {
              console.log("⚠️ Erro ao reabilitar network:", e.message);
            });
        }
      } catch (e) {
        console.log("⚠️ Erro no reset Firebase:", e.message);
      }
    }

    // Passo 3: Recriar service worker
    console.log("3️⃣ Resetando Service Worker...");

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.update().then(() => {
            console.log("✅ Service Worker atualizado");
          });
        });
      });
    }

    // Passo 4: Forçar nova sincronização
    console.log("4️⃣ Forçando nova sincronização...");

    setTimeout(() => {
      if (window.hr && typeof window.hr.syncData === "function") {
        window.hr
          .syncData()
          .then(() => {
            console.log("✅ Sincronização forçada concluída");
          })
          .catch((e) => {
            console.log("❌ Erro na sincronização forçada:", e.message);
          });
      }
    }, 2000);

    console.log("✅ Tentativas de correção concluídas");
    return true;
  } catch (error) {
    console.error("❌ Erro ao corrigir sync:", error);
    return false;
  }
}

// Função para monitorar erros de sync
function monitorSyncErrors() {
  // Interceptar erros de sync
  const originalConsoleError = console.error;
  console.error = function (...args) {
    const errorText = args.join(" ");

    if (
      errorText.includes("SYNC") ||
      errorText.includes("Firebase") ||
      errorText.includes("sync")
    ) {
      console.log("🚨 Erro de sincronização detectado:", errorText);

      // Auto-correção
      setTimeout(() => {
        console.log("🔧 Tentando auto-correção...");
        fixSyncIssues();
      }, 1000);
    }

    originalConsoleError.apply(console, args);
  };

  // Monitorar eventos de rede
  window.addEventListener("online", () => {
    console.log("🌐 Conectividade restaurada - tentando ressincronizar");
    setTimeout(fixSyncIssues, 1000);
  });

  window.addEventListener("offline", () => {
    console.log("📴 Dispositivo offline");
  });
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
