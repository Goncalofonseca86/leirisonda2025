// Coordenador principal para modificações do menu
console.log("🎯 Coordenador de modificações do menu iniciado");

// Configuração para ocultar itens
const ITEMS_TO_HIDE = [
  "DIAGNÓSTICO",
  "ADMINISTRAÇÃO",
  "Diagnóstico",
  "Administração",
];

// Função principal para ocultar itens do menu
function hideMenuItems() {
  console.log("🔍 Procurando itens do menu para ocultar...");

  let itemsHidden = 0;

  // Procura todos os elementos de texto
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false,
  );

  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }

  // Verifica cada nó de texto
  textNodes.forEach((textNode) => {
    const text = textNode.textContent.trim();

    if (ITEMS_TO_HIDE.includes(text)) {
      console.log(`🗑️ Encontrado item para ocultar: "${text}"`);

      // Encontra o container apropriado para ocultar
      let elementToHide = textNode.parentElement;

      // Sobe na hierarquia para encontrar um container apropriado
      let attempts = 0;
      while (elementToHide && attempts < 10) {
        // Se é um botão, link ou item de menu, oculta este elemento
        if (
          elementToHide.tagName === "BUTTON" ||
          elementToHide.tagName === "A" ||
          elementToHide.role === "button" ||
          elementToHide.role === "menuitem" ||
          elementToHide.classList.contains("cursor-pointer") ||
          elementToHide.onclick ||
          elementToHide.href
        ) {
          break;
        }

        // Se tem poucos filhos e não é o body, pode ser um container de item de menu
        if (
          elementToHide.children.length <= 5 &&
          elementToHide.tagName !== "BODY"
        ) {
          // Verifica se o pai tem muitos filhos (indicando que este é um item)
          if (
            elementToHide.parentElement &&
            elementToHide.parentElement.children.length > 1
          ) {
            break;
          }
        }

        elementToHide = elementToHide.parentElement;
        attempts++;
      }

      if (elementToHide && elementToHide.tagName !== "BODY") {
        console.log(`🗑️ Ocultando elemento:`, elementToHide);

        // Aplica múltiplas técnicas para garantir que seja ocultado
        elementToHide.style.setProperty("display", "none", "important");
        elementToHide.style.setProperty("visibility", "hidden", "important");
        elementToHide.style.setProperty("opacity", "0", "important");
        elementToHide.style.setProperty("height", "0", "important");
        elementToHide.style.setProperty("max-height", "0", "important");
        elementToHide.style.setProperty("overflow", "hidden", "important");
        elementToHide.style.setProperty("padding", "0", "important");
        elementToHide.style.setProperty("margin", "0", "important");
        elementToHide.style.setProperty("border", "none", "important");

        // Adiciona classe para identificação
        elementToHide.classList.add("menu-item-hidden");

        // Remove após um delay para garantir
        setTimeout(() => {
          if (elementToHide.parentElement) {
            elementToHide.remove();
          }
        }, 100);

        itemsHidden++;
      }
    }
  });

  console.log(`✅ Total de itens ocultados: ${itemsHidden}`);
  return itemsHidden > 0;
}

// Função para adicionar CSS adicional
function addHidingCSS() {
  const style = document.createElement("style");
  style.id = "menu-hiding-css";
  style.innerHTML = `
    /* Oculta itens específicos do menu */
    [aria-label*="DIAGNÓSTICO"],
    [aria-label*="ADMINISTRAÇÃO"],
    [data-testid*="diagnostico"],
    [data-testid*="administracao"],
    [title*="DIAGNÓSTICO"],
    [title*="ADMINISTRAÇÃO"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      overflow: hidden !important;
    }

    .menu-item-hidden {
      display: none !important;
    }

    /* Procura por elementos que contenham texto específico */
    *:has-text("DIAGNÓSTICO"),
    *:has-text("ADMINISTRAÇÃO"),
    *:has-text("Diagnóstico"),
    *:has-text("Administração") {
      display: none !important;
    }
  `;

  // Remove estilo anterior se existir
  const existing = document.getElementById("menu-hiding-css");
  if (existing) existing.remove();

  document.head.appendChild(style);
  console.log("🎨 CSS de ocultação aplicado");
}

// Função para executar todas as modificações
function executeAllModifications() {
  console.log("🚀 Executando todas as modificações...");

  addHidingCSS();
  const success = hideMenuItems();

  if (success) {
    console.log("�� Modificações aplicadas com sucesso!");
    showSuccessMessage();
  }

  return success;
}

// Mostra mensagem de sucesso
function showSuccessMessage() {
  const existing = document.getElementById("menu-success-msg");
  if (existing) existing.remove();

  const msg = document.createElement("div");
  msg.id = "menu-success-msg";
  msg.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 10000;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
  `;
  msg.textContent = "✅ Itens do menu ocultados!";

  document.body.appendChild(msg);

  setTimeout(() => {
    if (msg.parentElement) {
      msg.remove();
    }
  }, 3000);
}

// Sistema de execução mais conservador
let executionAttempts = 0;
const maxAttempts = 10;
let isApplicationReady = false;

// Detecta se a aplicação está carregada
function checkApplicationReady() {
  // Aguarda pelo React e componentes principais
  if (
    document.querySelector("#root") &&
    document.querySelector("#root").children.length > 0
  ) {
    isApplicationReady = true;
    console.log("✅ Aplicação detectada como carregada");
    return true;
  }
  return false;
}

function smartExecution() {
  executionAttempts++;
  console.log(
    `🔄 Menu modification attempt ${executionAttempts}/${maxAttempts}`,
  );

  // Só executa se a aplicação estiver carregada
  if (!isApplicationReady && !checkApplicationReady()) {
    console.log("⏳ Aguardando aplicação carregar...");
    if (executionAttempts < maxAttempts) {
      setTimeout(smartExecution, 2000);
    }
    return;
  }

  if (executeAllModifications()) {
    console.log("🎉 Menu modifications applied successfully!");
    return;
  }

  if (executionAttempts < maxAttempts) {
    setTimeout(smartExecution, 3000);
  } else {
    console.log("⚠️ Menu modification attempts exhausted");
  }
}

// Observer mais conservador
const observer = new MutationObserver((mutations) => {
  // Evita execução durante operações críticas
  if (
    document.title.includes("Sincroniz") ||
    document.body.textContent.includes("SYNC")
  ) {
    return;
  }

  let shouldExecute = false;

  mutations.forEach((mutation) => {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const text = node.textContent || "";
          if (ITEMS_TO_HIDE.some((item) => text.includes(item))) {
            shouldExecute = true;
          }
        }
      });
    }
  });

  if (shouldExecute && isApplicationReady) {
    setTimeout(() => {
      executeAllModifications();
    }, 1000);
  }
});

// Inicia execução de forma mais conservadora
console.log("🎯 Starting conservative menu modification system...");

// Aguarda carregamento da aplicação
setTimeout(() => {
  checkApplicationReady();
  smartExecution();
}, 3000);

// Execução adicional após carregamento completo
setTimeout(() => {
  if (isApplicationReady) {
    smartExecution();
  }
}, 8000);

// Inicia observer apenas após algum tempo
setTimeout(() => {
  if (isApplicationReady) {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    console.log("🔍 DOM observer started");
  }
}, 5000);

// Para o observer após 1 minuto
setTimeout(() => {
  observer.disconnect();
  console.log("🛑 DOM observer disconnected");
}, 60000);
