// Script para esconder Diagnóstico e Administração do menu lateral
console.log("🙈 Carregando script para esconder itens do menu");

// Função para esconder itens específicos do menu
function hideMenuItems() {
  console.log("🔍 Procurando itens do menu para esconder...");

  // Lista de termos a esconder (em várias variações)
  const itemsToHide = [
    "diagnóstico",
    "diagnostico",
    "diagnostic",
    "administração",
    "administracao",
    "administration",
    "admin",
  ];

  let hiddenCount = 0;

  // Procurar por elementos que contenham estes termos
  const allElements = document.querySelectorAll("*");

  allElements.forEach((element) => {
    // Verificar texto do elemento
    const textContent = element.textContent?.toLowerCase() || "";
    const innerText = element.innerText?.toLowerCase() || "";

    // Verificar se contém algum dos termos a esconder
    const shouldHide = itemsToHide.some(
      (term) => textContent.includes(term) || innerText.includes(term),
    );

    if (shouldHide) {
      // Verificar se é um item de menu (não uma página inteira)
      const isMenuItem =
        element.tagName === "A" ||
        element.tagName === "LI" ||
        element.tagName === "BUTTON" ||
        element.role === "menuitem" ||
        element.classList.contains("menu-item") ||
        element.classList.contains("nav-item") ||
        element.classList.contains("sidebar-item") ||
        element.closest("nav") ||
        element.closest('[role="navigation"]') ||
        element.closest(".menu") ||
        element.closest(".sidebar") ||
        element.closest(".nav");

      if (isMenuItem && element.offsetHeight > 0 && element.offsetWidth > 0) {
        // Encontrar o container apropriado para esconder
        let targetElement = element;

        // Subir na hierarquia para encontrar o container do item de menu
        let parent = element.parentElement;
        let attempts = 0;

        while (parent && attempts < 5) {
          const parentText = parent.textContent?.toLowerCase() || "";
          const containsOnlyTarget = itemsToHide.some(
            (term) =>
              parentText.trim() === term ||
              parentText.replace(/\s+/g, " ").trim() === term,
          );

          if (
            containsOnlyTarget ||
            parent.tagName === "LI" ||
            parent.classList.contains("menu-item") ||
            parent.classList.contains("nav-item")
          ) {
            targetElement = parent;
            break;
          }

          parent = parent.parentElement;
          attempts++;
        }

        // Esconder o elemento
        console.log(
          `🙈 Escondendo item do menu: "${textContent.trim()}"`,
          targetElement,
        );

        // Múltiplas técnicas para garantir que fica escondido
        targetElement.style.setProperty("display", "none", "important");
        targetElement.style.setProperty("visibility", "hidden", "important");
        targetElement.style.setProperty("opacity", "0", "important");
        targetElement.style.setProperty("height", "0", "important");
        targetElement.style.setProperty("max-height", "0", "important");
        targetElement.style.setProperty("overflow", "hidden", "important");
        targetElement.style.setProperty("margin", "0", "important");
        targetElement.style.setProperty("padding", "0", "important");

        // Adicionar classe para identificação
        targetElement.classList.add("hidden-menu-item");

        // Remover completamente após um delay
        setTimeout(() => {
          if (targetElement.parentElement) {
            targetElement.remove();
            console.log(`🗑️ Item removido: "${textContent.trim()}"`);
          }
        }, 500);

        hiddenCount++;
      }
    }
  });

  console.log(`✅ ${hiddenCount} itens do menu escondidos`);
  return hiddenCount;
}

// Função para aplicar CSS para esconder itens específicos
function applyCSSHiding() {
  console.log("🎨 Aplicando CSS para esconder itens");

  // Criar ou atualizar stylesheet
  let style = document.getElementById("hide-menu-items-css");
  if (!style) {
    style = document.createElement("style");
    style.id = "hide-menu-items-css";
    document.head.appendChild(style);
  }

  style.textContent = `
    /* Esconder itens específicos do menu */
    
    /* Por texto exato */
    *:has-text("Diagnóstico"),
    *:has-text("DIAGNÓSTICO"),
    *:has-text("Administração"),
    *:has-text("ADMINISTRAÇÃO") {
      display: none !important;
    }
    
    /* Por seletores específicos */
    [data-testid*="diagnostic"],
    [data-testid*="admin"],
    [aria-label*="diagnóstico"],
    [aria-label*="administração"],
    [title*="diagnóstico"],
    [title*="administração"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      overflow: hidden !important;
    }
    
    /* Esconder links e botões específicos */
    a[href*="diagnostic"],
    a[href*="admin"],
    button[data-target*="diagnostic"],
    button[data-target*="admin"] {
      display: none !important;
    }
    
    /* Esconder itens de navegação */
    nav *:contains("Diagnóstico"),
    nav *:contains("Administração"),
    .menu *:contains("Diagnóstico"),
    .menu *:contains("Administração"),
    .sidebar *:contains("Diagnóstico"),
    .sidebar *:contains("Administração") {
      display: none !important;
    }
    
    /* Classe para itens marcados para esconder */
    .hidden-menu-item {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      max-height: 0 !important;
      overflow: hidden !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
    }
  `;

  console.log("✅ CSS aplicado");
}

// Função principal para executar as modificações
function executeMenuHiding() {
  console.log("🚀 Executando ocultação do menu...");

  try {
    // Aplicar CSS primeiro
    applyCSSHiding();

    // Depois aplicar JavaScript
    const hiddenCount = hideMenuItems();

    if (hiddenCount > 0) {
      console.log("✅ Itens do menu escondidos com sucesso!");
      showHideConfirmation(hiddenCount);
    }

    return hiddenCount > 0;
  } catch (error) {
    console.error("❌ Erro ao esconder itens do menu:", error);
    return false;
  }
}

// Função para mostrar confirmação visual
function showHideConfirmation(count) {
  // Só mostrar se não estivermos na página de login
  if (window.location.pathname.includes("/login")) {
    return;
  }

  const confirmation = document.createElement("div");
  confirmation.style.cssText = `
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
    animation: slideInRight 0.3s ease;
  `;

  confirmation.innerHTML = `🙈 ${count} itens do menu escondidos`;

  document.body.appendChild(confirmation);

  setTimeout(() => {
    if (confirmation.parentElement) {
      confirmation.remove();
    }
  }, 3000);
}

// Observer para detectar mudanças no DOM
function setupMenuObserver() {
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;

    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const text = node.textContent?.toLowerCase() || "";
            if (
              text.includes("diagnóstico") ||
              text.includes("administração") ||
              text.includes("diagnostic") ||
              text.includes("admin")
            ) {
              shouldCheck = true;
            }
          }
        });
      }
    });

    if (shouldCheck) {
      console.log("🔄 Novo conteúdo detectado - verificando itens do menu");
      setTimeout(executeMenuHiding, 500);
    }
  });

  // Observar mudanças no body
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log("👁️ Observer de menu ativado");

  // Parar observer após 2 minutos
  setTimeout(() => {
    observer.disconnect();
    console.log("👁️ Observer de menu desativado");
  }, 120000);
}

// Sistema de execução inteligente
function smartMenuHiding() {
  // Não executar na página de login
  if (window.location.pathname.includes("/login")) {
    console.log("⏭️ Página de login detectada - aguardando redirecionamento");
    return;
  }

  console.log("🎯 Iniciando sistema inteligente de ocultação");

  // Aguardar carregamento da aplicação
  setTimeout(() => {
    executeMenuHiding();
  }, 2000);

  // Execução adicional após carregamento completo
  setTimeout(() => {
    executeMenuHiding();
  }, 5000);

  // Ativar observer
  setTimeout(() => {
    setupMenuObserver();
  }, 3000);
}

// Inicialização baseada no estado da página
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", smartMenuHiding);
} else {
  smartMenuHiding();
}

// Re-executar quando a URL mudar (para SPAs)
let currentURL = window.location.href;
setInterval(() => {
  if (currentURL !== window.location.href) {
    currentURL = window.location.href;
    console.log("🔄 URL mudou - re-executando ocultação do menu");
    setTimeout(smartMenuHiding, 1000);
  }
}, 2000);

// Função manual para esconder itens (disponível via console)
window.hideMenuItemsManually = function () {
  console.log("🎯 Execução manual da ocultação do menu");
  executeMenuHiding();
};

console.log("✅ Sistema de ocultação do menu carregado");
