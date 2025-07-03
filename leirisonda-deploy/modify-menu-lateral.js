// Modifica o menu lateral esquerdo do dashboard
console.log("🔧 Procurando menu lateral do dashboard...");

function findAndModifyMenu() {
  // Procura por elementos que podem ser o menu lateral
  const possibleMenus = document.querySelectorAll("div, nav, aside");

  for (const element of possibleMenus) {
    const text = element.textContent || "";
    const style = window.getComputedStyle(element);

    // Verifica se é um menu lateral baseado no conteúdo e posição
    const hasMenuContent =
      text.includes("Dashboard") ||
      text.includes("Nova Obra") ||
      text.includes("DIAGNÓSTICO") ||
      text.includes("Definições") ||
      text.includes("ADMINISTRAÇÃO") ||
      text.includes("Utilizadores");

    const isLeftPositioned =
      style.position === "fixed" &&
      (style.left === "0px" || parseInt(style.left) < 100);

    const hasMenuWidth =
      parseInt(style.width) > 200 && parseInt(style.width) < 400;

    if (hasMenuContent && (isLeftPositioned || hasMenuWidth)) {
      console.log("📋 Menu lateral encontrado!", element);
      modifyMenuContent(element);
      return true;
    }
  }

  // Se não encontrou pelo estilo, procura por texto específico
  const diagnosticoElements = document.querySelectorAll("*");
  for (const element of diagnosticoElements) {
    if (element.textContent && element.textContent.includes("DIAGNÓSTICO")) {
      console.log("📋 Menu encontrado via texto DIAGNÓSTICO!", element);
      let menuContainer = element;
      // Sobe na hierarquia para encontrar o container do menu
      while (
        menuContainer.parentElement &&
        menuContainer.parentElement.children.length < 10
      ) {
        menuContainer = menuContainer.parentElement;
      }
      modifyMenuContent(menuContainer);
      return true;
    }
  }

  return false;
}

function modifyMenuContent(menuElement) {
  console.log("⚙️ Modificando conteúdo do menu lateral...");

  // 1. REMOVER secção DIAGNÓSTICO
  const allElements = menuElement.querySelectorAll("*");
  allElements.forEach((element) => {
    const text = element.textContent || "";
    if (text.trim() === "DIAGNÓSTICO" || text.includes("DIAGNÓSTICO")) {
      // Remove o elemento e seus pais relevantes
      let toRemove = element;
      while (
        toRemove.parentElement &&
        toRemove.parentElement !== menuElement &&
        toRemove.parentElement.children.length <= 2
      ) {
        toRemove = toRemove.parentElement;
      }
      console.log("🗑️ Removendo DIAGNÓSTICO:", toRemove);
      toRemove.style.display = "none";
    }
  });

  // 2. ENCONTRAR e MODIFICAR ADMINISTRAÇÃO
  allElements.forEach((element) => {
    const text = element.textContent || "";
    if (text.trim() === "ADMINISTRAÇÃO" || text.includes("ADMINISTRAÇÃO")) {
      // Encontra o container da ADMINISTRAÇÃO
      let adminContainer = element;
      while (
        adminContainer.parentElement &&
        adminContainer.parentElement !== menuElement &&
        adminContainer.parentElement.children.length <= 3
      ) {
        adminContainer = adminContainer.parentElement;
      }

      console.log("⭐ Destacando secção ADMINISTRAÇÃO:", adminContainer);

      // Aplica estilo dourado
      adminContainer.style.background =
        "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)";
      adminContainer.style.borderRadius = "12px";
      adminContainer.style.padding = "16px";
      adminContainer.style.margin = "8px";
      adminContainer.style.boxShadow = "0 4px 20px rgba(251, 191, 36, 0.3)";
      adminContainer.style.color = "#1f2937";
      adminContainer.style.fontWeight = "bold";

      // Adiciona conteúdo das definições se não existir
      if (!adminContainer.textContent.includes("Configurações")) {
        const settingsContent = document.createElement("div");
        settingsContent.innerHTML = `
          <div style="margin-top: 12px; font-size: 14px;">
            <div style="padding: 8px 0; cursor: pointer;">• Configurações Gerais</div>
            <div style="padding: 8px 0; cursor: pointer;">• Perfil de Utilizador</div>
            <div style="padding: 8px 0; cursor: pointer;">• Segurança & Privacidade</div>
            <div style="padding: 8px 0; cursor: pointer;">• Relatórios & Analytics</div>
            <div style="padding: 8px 0; cursor: pointer;">• Backup & Exportação</div>
            <div style="padding: 8px 0; cursor: pointer;">• Notificações</div>
          </div>
        `;
        adminContainer.appendChild(settingsContent);
      }
    }
  });

  // 3. REMOVER secção Definições original se existir
  allElements.forEach((element) => {
    const text = element.textContent || "";
    if (
      text.trim() === "Definições" ||
      (text.includes("Definições") && !text.includes("ADMINISTRAÇÃO"))
    ) {
      let toRemove = element;
      while (
        toRemove.parentElement &&
        toRemove.parentElement !== menuElement &&
        toRemove.parentElement.children.length <= 2
      ) {
        toRemove = toRemove.parentElement;
      }
      console.log("🗑️ Removendo Definições original:", toRemove);
      toRemove.style.display = "none";
    }
  });

  console.log("✅ Menu lateral modificado com sucesso!");
}

// Executa de forma mais agressiva
function startMenuModification() {
  console.log("🚀 Iniciando modificação do menu lateral...");

  // Tenta imediatamente
  if (findAndModifyMenu()) return;

  // Tenta após delay
  setTimeout(() => {
    if (findAndModifyMenu()) return;
  }, 500);

  // Tenta após mais delay
  setTimeout(() => {
    if (findAndModifyMenu()) return;
  }, 1500);

  // Observer para mudanças no DOM
  const observer = new MutationObserver(() => {
    if (findAndModifyMenu()) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Para de tentar após 10 segundos
  setTimeout(() => {
    observer.disconnect();
  }, 10000);
}

// Aguarda o DOM estar pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startMenuModification);
} else {
  startMenuModification();
}
