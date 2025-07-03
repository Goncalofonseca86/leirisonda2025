// Script específico para tornar administração clicável
console.log("🎯 Script de click em administração iniciado");

// Função para aplicar click handler de forma agressiva
function forceAdminClickable() {
  console.log("🔍 Procurando todos os elementos com 'Administração'...");

  // Procurar por todos os elementos
  const allElements = Array.from(document.querySelectorAll("*"));
  let foundElements = 0;

  allElements.forEach((element, index) => {
    try {
      const text = element.textContent || element.innerText || "";

      if (text.includes("Administração") || text.includes("ADMINISTRAÇÃO")) {
        foundElements++;
        console.log(`📍 Elemento ${foundElements} encontrado:`, element);

        // Aplicar estilo clicável de forma forçada
        element.style.setProperty("cursor", "pointer", "important");
        element.style.setProperty("user-select", "none", "important");
        element.style.setProperty("pointer-events", "auto", "important");
        element.style.setProperty("position", "relative", "important");
        element.style.setProperty("z-index", "9999", "important");

        // Remover quaisquer borders de debug anteriores
        element.style.removeProperty("border");
        element.style.removeProperty("background-color");

        // Função de clique robusta
        const robustClickHandler = function (e) {
          console.log("🚀 CLIQUE DETECTADO EM ADMINISTRAÇÃO!", e.target);
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          // Feedback visual discreto
          const originalBackground = element.style.backgroundColor;
          element.style.setProperty(
            "background-color",
            "rgba(0, 255, 0, 0.2)",
            "important",
          );

          // Tentar múltiplas abordagens para abrir admin
          const urls = [
            `${window.location.protocol}//${window.location.host}/admin.html`,
            `${window.location.protocol}//${window.location.host}/test-admin.html`,
            `${window.location.protocol}//${window.location.host}/#/admin`,
          ];

          let opened = false;

          for (const adminUrl of urls) {
            console.log("🔗 Tentando URL:", adminUrl);

            try {
              const newWindow = window.open(
                adminUrl,
                "_blank",
                "noopener,noreferrer",
              );
              if (newWindow) {
                console.log(
                  "✅ Nova janela aberta com sucesso para:",
                  adminUrl,
                );
                opened = true;
                break;
              }
            } catch (error) {
              console.error("❌ Erro ao abrir:", adminUrl, error);
            }
          }

          if (!opened) {
            console.log("⚠️ Tentando navegação direta...");
            window.location.href = urls[0];
          }

          // Restaurar cor original após delay
          setTimeout(() => {
            element.style.removeProperty("background-color");
          }, 300);

          return false;
        };

        // Remover todos os event listeners anteriores
        element.onclick = null;
        element.onmousedown = null;
        element.onmouseup = null;

        // Adicionar múltiplos event listeners
        element.addEventListener("click", robustClickHandler, true);
        element.addEventListener("mousedown", robustClickHandler, true);
        element.addEventListener("mouseup", robustClickHandler, true);
        element.addEventListener("touchstart", robustClickHandler, true);
        element.addEventListener("touchend", robustClickHandler, true);

        // Aplicar também aos pais (até 3 níveis)
        let parent = element.parentElement;
        let level = 0;
        while (parent && level < 3) {
          parent.style.setProperty("cursor", "pointer", "important");
          parent.addEventListener("click", robustClickHandler, true);
          parent = parent.parentElement;
          level++;
        }

        // Aplicar também aos filhos
        const children = element.querySelectorAll("*");
        children.forEach((child) => {
          child.style.setProperty("cursor", "pointer", "important");
          child.addEventListener("click", robustClickHandler, true);
        });

        console.log(`✅ Click handler aplicado ao elemento ${foundElements}`);
      }
    } catch (error) {
      console.error("Erro ao processar elemento:", error);
    }
  });

  console.log(`📊 Total de elementos processados: ${foundElements}`);
  return foundElements > 0;
}

// Execução imediata
setTimeout(() => {
  console.log("🚀 Executando aplicação de click handler...");
  forceAdminClickable();
}, 1000);

// Execução adicional após carregamento
setTimeout(() => {
  console.log("🔄 Re-executando aplicação de click handler...");
  forceAdminClickable();
}, 3000);

// Observer para detectar mudanças
const adminObserver = new MutationObserver((mutations) => {
  let shouldReapply = false;

  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const text = node.textContent || "";
          if (
            text.includes("Administração") ||
            text.includes("ADMINISTRAÇÃO")
          ) {
            shouldReapply = true;
          }
        }
      });
    }
  });

  if (shouldReapply) {
    setTimeout(() => {
      console.log("🔄 DOM mudou, reaplicando click handler...");
      forceAdminClickable();
    }, 500);
  }
});

// Iniciar observação
adminObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

// Parar observer após 2 minutos
setTimeout(() => {
  adminObserver.disconnect();
  console.log("🛑 Observer de administração desconectado");
}, 120000);

console.log("✅ Script de click em administração configurado");
