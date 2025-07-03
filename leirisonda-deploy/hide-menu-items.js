// Script para esconder Diagnóstico e Administração do menu lateral
console.log("🙈 Carregando script para esconder itens do menu");

// Função para esconder itens específicos do menu
function hideMenuItems() {
  console.log("🔍 Procurando APENAS Diagnóstico e Administração...");

  let hiddenCount = 0;

  // Procurar especificamente por elementos de menu
  const menuSelectors = [
    "nav a",
    "nav button",
    "nav li",
    ".menu a",
    ".menu button",
    ".menu li",
    ".sidebar a",
    ".sidebar button",
    ".sidebar li",
    '[role="navigation"] a',
    '[role="navigation"] button',
    '[role="navigation"] li',
    ".nav-item",
    ".menu-item",
    ".sidebar-item",
  ];

  menuSelectors.forEach((selector) => {
    try {
      const elements = document.querySelectorAll(selector);

      elements.forEach((element) => {
        const text = element.textContent?.trim().toLowerCase() || "";
        const innerText = element.innerText?.trim().toLowerCase() || "";

        // Verificação MUITO específica - apenas se o texto for exatamente estes termos
        const isDiagnostico =
          text === "diagnóstico" ||
          text === "diagnostic" ||
          innerText === "diagnóstico" ||
          innerText === "diagnostic";
        const isAdministracao =
          text === "administração" ||
          text === "administration" ||
          text === "admin" ||
          innerText === "administração" ||
          innerText === "administration" ||
          innerText === "admin";

        if (isDiagnostico || isAdministracao) {
          // Verificar que não contém outras palavras importantes
          const hasOtherImportantWords =
            text.includes("obra") ||
            text.includes("work") ||
            text.includes("manutenção") ||
            text.includes("maintenance") ||
            text.includes("nova") ||
            text.includes("new") ||
            text.includes("criar") ||
            text.includes("create");

          if (!hasOtherImportantWords) {
            console.log(`🎯 Escondendo especificamente: "${text}"`);

            // Encontrar o container do item de menu
            let targetElement = element;

            // Se é um link ou botão, pode esconder diretamente
            if (element.tagName === "A" || element.tagName === "BUTTON") {
              targetElement = element;
            }
            // Se está dentro de um LI, esconder o LI
            else if (element.closest("li")) {
              targetElement = element.closest("li");
            }
            // Se tem classe de item de menu, esconder esse container
            else if (
              element.classList.contains("menu-item") ||
              element.classList.contains("nav-item")
            ) {
              targetElement = element;
            }

            // Aplicar ocultação
            targetElement.style.setProperty("display", "none", "important");
            targetElement.classList.add("hidden-menu-item");

            hiddenCount++;
          } else {
            console.log(
              `⚠️ Elemento contém outras palavras importantes, não escondendo: "${text}"`,
            );
          }
        }
      });
    } catch (e) {
      // Ignorar erros de seletor
    }
  });

  console.log(`✅ ${hiddenCount} itens específicos escondidos`);
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
    /* Esconder APENAS itens específicos marcados pelo JavaScript */
    .hidden-menu-item {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      max-height: 0 !important;
      overflow: hidden !important;
    }

    /* Seletores muito específicos para diagnóstico e administração */
    a[href="/diagnostic"]:not([href*="work"]):not([href*="obra"]),
    a[href="/diagnostico"]:not([href*="work"]):not([href*="obra"]),
    a[href="/admin"]:not([href*="work"]):not([href*="obra"]):not([href*="maintenance"]),
    a[href="/administracao"]:not([href*="work"]):not([href*="obra"]):not([href*="maintenance"]) {
      display: none !important;
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

// Função para restaurar itens escondidos acidentalmente
window.restoreMenuItems = function () {
  console.log("🔄 Restaurando itens do menu...");

  // Remover classe de itens escondidos
  const hiddenItems = document.querySelectorAll(".hidden-menu-item");
  hiddenItems.forEach((item) => {
    item.classList.remove("hidden-menu-item");
    item.style.removeProperty("display");
    item.style.removeProperty("visibility");
    item.style.removeProperty("opacity");
    item.style.removeProperty("height");
    item.style.removeProperty("max-height");
    item.style.removeProperty("overflow");
    console.log("✅ Item restaurado:", item.textContent?.trim());
  });

  // Remover CSS
  const style = document.getElementById("hide-menu-items-css");
  if (style) {
    style.remove();
  }

  console.log(`🔄 ${hiddenItems.length} itens restaurados`);
  alert(`✅ ${hiddenItems.length} itens do menu foram restaurados!`);
};

console.log("✅ Sistema de ocultação do menu carregado");
