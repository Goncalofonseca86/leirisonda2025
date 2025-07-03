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

  // 2. ENCONTRAR secção ADMINISTRAÇÃO e DEFINIÇÕES
  let adminSection = null;
  let settingsSection = null;

  const allElements = sidebar.querySelectorAll("*");
  allElements.forEach((element) => {
    const text = element.textContent || "";
    if (text.includes("ADMINISTRAÇÃO")) {
      adminSection = element;
    }
    if (text.includes("Definições")) {
      settingsSection = element;
    }
  });

  if (adminSection && settingsSection) {
    console.log("⭐ Movendo Definições para ADMINISTRAÇÃO...");

    // 3. DESTACAR secção ADMINISTRAÇÃO com fundo dourado
    let adminContainer = adminSection;
    while (
      adminContainer.parentElement &&
      adminContainer.parentElement !== sidebar
    ) {
      adminContainer = adminContainer.parentElement;
    }

    // Aplicar estilo dourado ao container da ADMINISTRAÇÃO
    adminContainer.style.background =
      "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)";
    adminContainer.style.borderRadius = "12px";
    adminContainer.style.padding = "16px";
    adminContainer.style.margin = "8px";
    adminContainer.style.boxShadow = "0 4px 20px rgba(251, 191, 36, 0.3)";

    // 4. MOVER conteúdo das Definições para dentro da ADMINISTRAÇÃO
    let settingsContainer = settingsSection;
    while (
      settingsContainer.parentElement &&
      settingsContainer.parentElement !== sidebar
    ) {
      settingsContainer = settingsContainer.parentElement;
    }

    // Clone o conteúdo das definições e adiciona à administração
    const settingsContent = settingsContainer.cloneNode(true);
    adminContainer.appendChild(settingsContent);

    // Remove a secção original das definições
    settingsContainer.remove();

    console.log("✅ Modificações do sidebar aplicadas com sucesso!");
  } else {
    console.log("⚠️ Secções ADMINISTRAÇÃO ou Definições não encontradas");
  }

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
