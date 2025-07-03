// Modifica apenas o sidebar quando este aparecer
console.log("🔧 Script para modificar sidebar carregado...");

function modifySidebar() {
  // Procura elementos do sidebar com diferentes seletores possíveis
  const sidebarSelectors = [
    '[role="navigation"]',
    "nav",
    ".sidebar",
    '[class*="sidebar"]',
    '[id*="sidebar"]',
    "aside",
    '[class*="menu"]',
    '[class*="nav"]',
  ];

  let sidebar = null;

  for (const selector of sidebarSelectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      const text = element.textContent || "";
      if (
        text.includes("DIAGNÓSTICO") ||
        text.includes("Definições") ||
        text.includes("Dashboard")
      ) {
        sidebar = element;
        break;
      }
    }
    if (sidebar) break;
  }

  if (!sidebar) {
    console.log("⏳ Sidebar ainda não encontrado, aguardando...");
    return false;
  }

  console.log("📋 Sidebar encontrado! Aplicando modificações...");

  // 1. REMOVER secção DIAGNÓSTICO completamente
  const diagnosticoElements = sidebar.querySelectorAll("*");
  diagnosticoElements.forEach((element) => {
    const text = element.textContent || "";
    if (
      text.includes("DIAGNÓSTICO") &&
      element.tagName !== "BODY" &&
      element.tagName !== "HTML"
    ) {
      // Remove o elemento pai que contém DIAGNÓSTICO
      let parentToRemove = element;
      while (
        parentToRemove.parentElement &&
        parentToRemove.parentElement !== sidebar
      ) {
        parentToRemove = parentToRemove.parentElement;
      }
      console.log("🗑️ Removendo secção DIAGNÓSTICO");
      parentToRemove.remove();
    }
  });

  // 2. REMOVER secção ADMINISTRAÇÃO completamente
  const administracaoElements = sidebar.querySelectorAll("*");
  administracaoElements.forEach((element) => {
    const text = element.textContent || "";
    if (
      text.includes("ADMINISTRAÇÃO") &&
      element.tagName !== "BODY" &&
      element.tagName !== "HTML"
    ) {
      // Remove o elemento pai que contém ADMINISTRAÇÃO
      let parentToRemove = element;
      while (
        parentToRemove.parentElement &&
        parentToRemove.parentElement !== sidebar
      ) {
        parentToRemove = parentToRemove.parentElement;
      }
      console.log("🗑️ Removendo secção ADMINISTRAÇÃO");
      parentToRemove.remove();
    }
  });

  console.log("✅ Modificações do sidebar aplicadas com sucesso!");

  return true;
}

// Observer para detectar mudanças no DOM
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      // Aguarda um pouco para o DOM estabilizar
      setTimeout(() => {
        if (modifySidebar()) {
          observer.disconnect(); // Para de observar após sucesso
        }
      }, 100);
    }
  });
});

// Inicia observação
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Tenta modificar imediatamente se já existir
setTimeout(() => {
  if (modifySidebar()) {
    observer.disconnect();
  }
}, 500);

// Tenta novamente após 2 segundos
setTimeout(() => {
  if (modifySidebar()) {
    observer.disconnect();
  }
}, 2000);
