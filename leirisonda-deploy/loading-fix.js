// CORRIGIR PROBLEMA DE CARREGAMENTO LENTO
console.log("⚡ Carregando corretor de carregamento...");

(function () {
  "use strict";

  let loadingTimeout = null;
  let forceLoadAttempts = 0;
  const MAX_LOADING_TIME = 8000; // 8 segundos máximo
  const MAX_ATTEMPTS = 3;

  // Detectar se está preso em loading
  function detectStuckLoading() {
    const loadingText = document.body.textContent || "";
    const isLoading =
      loadingText.includes("A carregar") ||
      loadingText.includes("Loading") ||
      loadingText.includes("Se demorar muito");

    return isLoading;
  }

  // Forçar carregamento da página
  function forcePageLoad() {
    console.log("🚀 Forçando carregamento da página...");

    try {
      // Método 1: Tentar navegar para a página diretamente
      if (window.location.pathname === "/works") {
        console.log("📊 Tentando carregar lista de obras...");

        // Simular clique em navegação
        const navLinks = document.querySelectorAll(
          'a[href*="works"], a[href*="obras"]',
        );
        if (navLinks.length > 0) {
          navLinks[0].click();
          return;
        }
      }

      // Método 2: Recarregar componente React
      if (window.React) {
        console.log("⚛️ Tentando recarregar componente React...");

        // Forçar re-render
        const event = new CustomEvent("forceUpdate");
        document.dispatchEvent(event);
      }

      // Método 3: Limpar estado que pode estar causando o problema
      const problematicKeys = [
        "loading",
        "isLoading",
        "loadingState",
        "pendingRequest",
        "fetchInProgress",
      ];

      problematicKeys.forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      // Método 4: Tentar forçar navegação via history
      if (window.history && window.history.pushState) {
        console.log("🔄 Forçando navegação via history...");
        window.history.pushState({}, "", "/works");
        window.history.replaceState({}, "", "/works");
      }
    } catch (error) {
      console.log("⚠️ Erro ao forçar carregamento:", error.message);
    }
  }

  // Remover tela de loading e mostrar conteúdo
  function skipLoading() {
    console.log("⏭️ Saltando tela de loading...");

    try {
      // Esconder elementos de loading
      const loadingElements = document.querySelectorAll("*");
      loadingElements.forEach((el) => {
        const text = el.textContent || "";
        if (
          text.includes("A carregar") ||
          text.includes("Se demorar muito") ||
          text.includes("Loading")
        ) {
          // Se for o elemento principal de loading, substituir
          if (el.closest('[data-loc*="ProtectedRoute"]')) {
            el.style.display = "none";

            // Criar conteúdo de substituição
            const replacement = document.createElement("div");
            replacement.innerHTML = `
              <div style="padding: 20px; text-align: center;">
                <h2>📊 Obras</h2>
                <p>Carregando lista de obras...</p>
                <button onclick="window.location.reload()" 
                        style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 10px;">
                  🔄 Recarregar Página
                </button>
                <button onclick="window.history.back()" 
                        style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 10px;">
                  ← Voltar
                </button>
              </div>
            `;

            if (el.parentNode) {
              el.parentNode.appendChild(replacement);
            }
          }
        }
      });

      // Tentar encontrar e ativar conteúdo escondido
      const hiddenContent = document.querySelectorAll(
        '[style*="display: none"], [style*="visibility: hidden"]',
      );
      hiddenContent.forEach((el) => {
        if (el.textContent && !el.textContent.includes("A carregar")) {
          el.style.display = "block";
          el.style.visibility = "visible";
        }
      });
    } catch (error) {
      console.log("⚠️ Erro ao saltar loading:", error.message);
    }
  }

  // Método de emergência - recarregar página
  function emergencyReload() {
    console.log("🚨 Método de emergência - recarregando página...");

    if (
      confirm(
        "⏰ A página está a demorar muito a carregar.\n\nRecarregar agora?",
      )
    ) {
      window.location.reload(true);
    } else {
      // Oferecer voltar para página anterior
      if (confirm("⬅️ Voltar para a página anterior?")) {
        window.history.back();
      }
    }
  }

  // Monitorar loading e intervir se necessário
  function monitorLoading() {
    if (detectStuckLoading()) {
      forceLoadAttempts++;
      console.log(
        `⏱️ Loading detectado (tentativa ${forceLoadAttempts}/${MAX_ATTEMPTS})`,
      );

      if (forceLoadAttempts <= MAX_ATTEMPTS) {
        forcePageLoad();

        // Tentar saltar loading se falhar
        setTimeout(() => {
          if (detectStuckLoading()) {
            skipLoading();
          }
        }, 3000);
      } else {
        // Depois de várias tentativas, usar método de emergência
        emergencyReload();
      }
    } else {
      // Reset contador se carregou com sucesso
      forceLoadAttempts = 0;
    }
  }

  // Iniciar monitoramento
  function startMonitoring() {
    console.log("👁️ Iniciando monitoramento de loading...");

    // Verificar imediatamente
    setTimeout(monitorLoading, 2000);

    // Verificar periodicamente
    const interval = setInterval(() => {
      if (detectStuckLoading()) {
        monitorLoading();
      } else {
        // Se não está mais em loading, parar monitoramento
        clearInterval(interval);
        console.log("✅ Loading concluído - parando monitoramento");
      }
    }, 3000);

    // Timeout máximo de segurança
    setTimeout(() => {
      clearInterval(interval);
      if (detectStuckLoading()) {
        console.log("⏰ Timeout máximo atingido");
        emergencyReload();
      }
    }, MAX_LOADING_TIME);
  }

  // Função para uso manual
  window.forcarCarregamento = function () {
    console.log("🔧 Função manual ativada");
    forceLoadAttempts = 0;
    monitorLoading();
  };

  // Função para saltar loading
  window.saltarLoading = function () {
    console.log("⏭️ Função saltar loading ativada");
    skipLoading();
  };

  // Interceptar navegação lenta
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    console.log("🔄 Navegação detectada:", args[2]);

    // Resetar contador de tentativas
    forceLoadAttempts = 0;

    // Aplicar pushState original
    originalPushState.apply(history, args);

    // Iniciar monitoramento após navegação
    setTimeout(startMonitoring, 1000);
  };

  // Iniciar monitoramento quando carregar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startMonitoring);
  } else {
    startMonitoring();
  }

  console.log("✅ Corretor de carregamento ativo");
})();
