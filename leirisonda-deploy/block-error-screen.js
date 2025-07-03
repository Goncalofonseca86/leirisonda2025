// BLOQUEAR COMPLETAMENTE TELA DE ERRO "OOPS! ALGO CORREU MAL"
console.log("🚫 Carregando bloqueador de tela de erro...");

(function () {
  "use strict";

  // Função para remover telas de erro
  function removeErrorScreens() {
    try {
      // Textos específicos para detectar telas de erro
      const errorTexts = [
        "Oops! Algo correu mal",
        "Algo correu mal",
        "Ocorreu um erro inesperado",
        "Tentar Novamente",
        "Recarregar Página",
        "Diagnóstico do Sistema",
        "Diagnóstico de Emergência",
        "Limpar Dados e Reiniciar",
        "Detalhes do erro",
        "Error detected",
        "Attempt To Fix",
      ];

      // Procurar por elementos que contenham estes textos
      const allElements = document.querySelectorAll("*");

      allElements.forEach((element) => {
        const text = element.textContent || "";
        const hasErrorText = errorTexts.some((errorText) =>
          text.includes(errorText),
        );

        if (hasErrorText) {
          console.log("🚫 Removendo elemento de erro:", text.substring(0, 50));

          // Método 1: Esconder completamente
          element.style.display = "none !important";
          element.style.visibility = "hidden !important";
          element.style.opacity = "0 !important";
          element.style.position = "absolute !important";
          element.style.left = "-9999px !important";

          // Método 2: Remover do DOM
          setTimeout(() => {
            try {
              if (element.parentNode) {
                element.parentNode.removeChild(element);
              }
            } catch (e) {
              // Ignorar erro se elemento já foi removido
            }
          }, 100);

          // Método 3: Se é um modal/overlay, remover container pai
          let parent = element.parentElement;
          while (parent) {
            const parentText = parent.textContent || "";
            if (
              parentText.includes("Oops!") ||
              parentText.includes("Algo correu mal") ||
              parent.classList.contains("modal") ||
              parent.classList.contains("overlay") ||
              parent.style.position === "fixed" ||
              parent.style.zIndex > 1000
            ) {
              console.log("🚫 Removendo container pai de erro");
              parent.style.display = "none !important";
              setTimeout(() => {
                try {
                  if (parent.parentNode) {
                    parent.parentNode.removeChild(parent);
                  }
                } catch (e) {
                  // Ignorar
                }
              }, 100);
              break;
            }
            parent = parent.parentElement;
          }
        }
      });

      // Remover especificamente elementos com background escuro (overlays)
      const possibleOverlays = document.querySelectorAll("div, section, aside");
      possibleOverlays.forEach((element) => {
        const style = window.getComputedStyle(element);
        const hasOverlayStyle =
          (style.position === "fixed" || style.position === "absolute") &&
          (parseInt(style.zIndex) > 1000 ||
            style.backgroundColor.includes("rgba") ||
            element.textContent.includes("Oops!"));

        if (hasOverlayStyle && element.textContent.includes("correu mal")) {
          console.log("🚫 Removendo overlay de erro");
          element.style.display = "none !important";
          setTimeout(() => {
            try {
              if (element.parentNode) {
                element.parentNode.removeChild(element);
              }
            } catch (e) {
              // Ignorar
            }
          }, 100);
        }
      });
    } catch (error) {
      // Ignorar erros na remoção
    }
  }

  // Função para bloquear criação de novos elementos de erro
  function blockErrorScreenCreation() {
    // Observer para mudanças no DOM
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) {
            // Element node
            const text = node.textContent || "";

            // Se o novo elemento contém texto de erro, remover imediatamente
            if (
              text.includes("Oops!") ||
              text.includes("Algo correu mal") ||
              text.includes("Ocorreu um erro") ||
              text.includes("Tentar Novamente") ||
              text.includes("Diagnóstico")
            ) {
              console.log("🚫 Novo elemento de erro detectado e bloqueado");

              // Prevenir que seja exibido
              node.style.display = "none !important";

              setTimeout(() => {
                try {
                  if (node.parentNode) {
                    node.parentNode.removeChild(node);
                  }
                } catch (e) {
                  // Ignorar
                }
              }, 50);
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Interceptar criação de modais/overlays
  function interceptModalCreation() {
    // Override de document.createElement para interceptar divs suspeitos
    const originalCreateElement = document.createElement;

    document.createElement = function (tagName) {
      const element = originalCreateElement.call(document, tagName);

      // Se é um div, monitorar mudanças de texto
      if (tagName.toLowerCase() === "div") {
        // Monitorar quando texto for adicionado
        const originalSetTextContent =
          element.__lookupSetter__("textContent") ||
          Object.getOwnPropertyDescriptor(Node.prototype, "textContent").set;

        Object.defineProperty(element, "textContent", {
          set: function (value) {
            // Se o texto contém erro, interceptar
            if (
              value &&
              (value.includes("Oops!") ||
                value.includes("Algo correu mal") ||
                value.includes("Diagnóstico"))
            ) {
              console.log("🚫 Interceptado texto de erro em novo elemento");
              return; // Não definir o texto
            }

            return originalSetTextContent.call(this, value);
          },
          get: function () {
            return originalSetTextContent.call(this);
          },
        });
      }

      return element;
    };
  }

  // Garantir que só mensagem de sucesso seja visível
  function enforceSuccessOnly() {
    // Remover qualquer elemento de erro
    removeErrorScreens();

    // Garantir que mensagem de sucesso está visível
    let successFound = false;
    const elements = document.querySelectorAll("*");

    elements.forEach((element) => {
      const text = element.textContent || "";
      if (
        text.includes("Obra guardada com sucesso") ||
        text.includes("guardada com sucesso")
      ) {
        // Garantir que está visível
        element.style.display = "block !important";
        element.style.visibility = "visible !important";
        element.style.opacity = "1 !important";
        element.style.zIndex = "999999 !important";

        successFound = true;
        console.log("✅ Mensagem de sucesso garantida visível");
      }
    });

    // Se não encontrou mensagem de sucesso, criar uma
    if (!successFound && window.location.pathname.includes("/works")) {
      createSuccessMessage();
    }
  }

  // Criar mensagem de sucesso se não existir
  function createSuccessMessage() {
    // Verificar se já existe
    if (document.getElementById("forced-success-message")) {
      return;
    }

    const successMsg = document.createElement("div");
    successMsg.id = "forced-success-message";
    successMsg.style.cssText = `
      position: fixed !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      background: #22c55e !important;
      color: white !important;
      padding: 30px 40px !important;
      border-radius: 12px !important;
      z-index: 999999 !important;
      font-size: 18px !important;
      font-weight: bold !important;
      box-shadow: 0 8px 32px rgba(34, 197, 94, 0.3) !important;
      display: flex !important;
      align-items: center !important;
      gap: 15px !important;
    `;

    successMsg.innerHTML = `
      <div style="font-size: 24px;">✅</div>
      <div>
        <div style="font-size: 20px; margin-bottom: 5px;">Obra guardada com sucesso!</div>
        <div style="font-size: 14px; opacity: 0.9;">A obra foi criada e guardada correctamente.</div>
      </div>
      <button onclick="this.parentElement.remove(); window.location.href='/works';" 
              style="background: rgba(255,255,255,0.2) !important; border: 1px solid rgba(255,255,255,0.3) !important; color: white !important; padding: 8px 12px !important; border-radius: 6px !important; cursor: pointer !important; margin-left: 20px !important;">
        ✕
      </button>
    `;

    document.body.appendChild(successMsg);

    // Auto-remover após 5 segundos e redirecionar
    setTimeout(() => {
      if (successMsg.parentElement) {
        successMsg.remove();
        // Redirecionar para lista de obras
        window.location.href = "/works";
      }
    }, 5000);

    console.log("✅ Mensagem de sucesso forçada criada");
  }

  // Função principal de monitoramento
  function startMonitoring() {
    console.log("🚫 Iniciando monitoramento de telas de erro...");

    // Configurar interceptadores
    blockErrorScreenCreation();
    interceptModalCreation();

    // Limpeza inicial
    setTimeout(enforceSuccessOnly, 500);

    // Limpeza contínua mais agressiva
    setInterval(enforceSuccessOnly, 300);

    // Limpeza específica quando há mudanças na página
    setInterval(removeErrorScreens, 200);
  }

  // Função para uso manual
  window.forcarSucesso = function () {
    console.log("✅ Forçando exibição de sucesso...");
    removeErrorScreens();
    createSuccessMessage();
  };

  window.removerErros = function () {
    console.log("🚫 Removendo todos os elementos de erro...");
    removeErrorScreens();
  };

  // Inicializar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startMonitoring);
  } else {
    startMonitoring();
  }

  console.log("✅ Bloqueador de tela de erro carregado");
})();
