// Modifica o menu lateral da Leirisonda mostrado na imagem
console.log("🔧 Procurando menu lateral da Leirisonda...");

function findLeirisondaMenu() {
  // Procura por elementos que contenham o texto específico do menu
  const allElements = document.querySelectorAll("*");

  for (const element of allElements) {
    const text = element.textContent || "";

    // Verifica se é o menu da Leirisonda baseado no conteúdo único
    if (
      text.includes("Gestão de Obras") &&
      text.includes("Dashboard") &&
      text.includes("DIAGNÓSTICO") &&
      text.includes("ADMINISTRAÇÃO")
    ) {
      console.log("📋 Menu lateral da Leirisonda encontrado!", element);
      modifyLeirisondaMenu(element);
      return true;
    }
  }

  // Procura também por containers que tenham esses itens de menu
  const diagnosticoElements = document.querySelectorAll("*");
  for (const element of diagnosticoElements) {
    if (element.textContent && element.textContent.trim() === "DIAGNÓSTICO") {
      // Encontra o container pai do menu
      let menuContainer = element;
      while (
        menuContainer.parentElement &&
        !menuContainer.textContent.includes("Gestão de Obras")
      ) {
        menuContainer = menuContainer.parentElement;
      }

      if (menuContainer.textContent.includes("Gestão de Obras")) {
        console.log("📋 Menu encontrado via DIAGNÓSTICO!", menuContainer);
        modifyLeirisondaMenu(menuContainer);
        return true;
      }
    }
  }

  return false;
}

function modifyLeirisondaMenu(menuElement) {
  console.log("⚙️ Modificando menu lateral da Leirisonda...");

  // Encontra todos os elementos do menu
  const menuItems = menuElement.querySelectorAll("*");
  let diagnosticoElement = null;
  let administracaoElement = null;

  // 1. ENCONTRAR e REMOVER DIAGNÓSTICO
  menuItems.forEach((item) => {
    const text = item.textContent || "";
    if (
      text.trim() === "DIAGNÓSTICO" ||
      (text.includes("DIAGNÓSTICO") && text.length < 20)
    ) {
      diagnosticoElement = item;

      // Encontra o container clicável do DIAGNÓSTICO
      let container = item;
      while (
        container.parentElement &&
        container.parentElement !== menuElement &&
        !container.onclick &&
        !container.getAttribute("href")
      ) {
        container = container.parentElement;
      }

      console.log("🗑️ Removendo DIAGNÓSTICO:", container);
      container.style.display = "none";
      container.remove();
    }
  });

  // 2. ENCONTRAR e REMOVER ADMINISTRAÇÃO
  menuItems.forEach((item) => {
    const text = item.textContent || "";
    if (
      text.trim() === "ADMINISTRAÇÃO" ||
      (text.includes("ADMINISTRAÇÃO") && text.length < 20)
    ) {
      administracaoElement = item;

      // Encontra o container clicável da ADMINISTRAÇÃO
      let container = item;
      while (
        container.parentElement &&
        container.parentElement !== menuElement &&
        !container.onclick &&
        !container.getAttribute("href") &&
        container.parentElement.children.length < 5
      ) {
        container = container.parentElement;
      }

      console.log("🗑️ Removendo ADMINISTRAÇÃO:", container);
      container.style.display = "none";
      container.remove();
    }
  });

  console.log("✅ Menu lateral da Leirisonda modificado com sucesso!");

  // Adiciona uma marca visual de que foi modificado
  const header = menuElement.querySelector("*");
  if (header && header.textContent.includes("Leirisonda")) {
    const modifiedIndicator = document.createElement("div");
    modifiedIndicator.style.position = "absolute";
    modifiedIndicator.style.top = "10px";
    modifiedIndicator.style.right = "10px";
    modifiedIndicator.style.background = "#10b981";
    modifiedIndicator.style.color = "white";
    modifiedIndicator.style.fontSize = "12px";
    modifiedIndicator.style.padding = "4px 8px";
    modifiedIndicator.style.borderRadius = "12px";
    modifiedIndicator.style.zIndex = "1000";
    modifiedIndicator.textContent = "✓ Modificado";

    const container = header.closest("div");
    if (container) {
      container.style.position = "relative";
      container.appendChild(modifiedIndicator);
    }
  }
}

// Função para tentar múltiplas vezes
function attemptMenuModification() {
  console.log("🚀 Tentando modificar menu da Leirisonda...");

  let attempts = 0;
  const maxAttempts = 20;

  const tryModify = () => {
    attempts++;
    console.log(`Tentativa ${attempts}/${maxAttempts}`);

    if (findLeirisondaMenu()) {
      console.log("✅ Menu modificado com sucesso!");
      return;
    }

    if (attempts < maxAttempts) {
      setTimeout(tryModify, 1000); // Tenta novamente após 1 segundo
    } else {
      console.log("⚠️ Menu não encontrado após", maxAttempts, "tentativas");
    }
  };

  // Primeira tentativa imediata
  tryModify();

  // Observer para mudanças no DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        setTimeout(() => {
          if (findLeirisondaMenu()) {
            observer.disconnect();
          }
        }, 500);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Para de observar após 30 segundos
  setTimeout(() => {
    observer.disconnect();
  }, 30000);
}

// Inicia quando o DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", attemptMenuModification);
} else {
  attemptMenuModification();
}
