// Usa CSS para modificar o menu lateral (mais eficaz para React)
console.log("🎨 Aplicando modificações CSS ao menu lateral...");

function applyMenuCSS() {
  // Remove qualquer estilo anterior
  const existingStyle = document.getElementById("leirisonda-menu-modifier");
  if (existingStyle) {
    existingStyle.remove();
  }

  // Cria um estilo CSS personalizado
  const style = document.createElement("style");
  style.id = "leirisonda-menu-modifier";
  style.innerHTML = `
    /* ESCONDER DIAGNÓSTICO */
    *:not(script):not(style) {
      display: block;
    }

    /* Procura por elementos que contenham apenas DIAGNÓSTICO */
    [role="button"]:has-text("DIAGNÓSTICO"),
    div:has-text("DIAGNÓSTICO"),
    a:has-text("DIAGNÓSTICO"),
    li:has-text("DIAGNÓSTICO") {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      overflow: hidden !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    /* ESCONDER ADMINISTRAÇÃO */
    [role="button"]:has-text("ADMINISTRAÇÃO"),
    div:has-text("ADMINISTRAÇÃO"),
    a:has-text("ADMINISTRAÇÃO"),
    li:has-text("ADMINISTRAÇÃO") {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      height: 0 !important;
      overflow: hidden !important;
      padding: 0 !important;
      margin: 0 !important;
    }
  `;

  document.head.appendChild(style);
  console.log("🎨 CSS aplicado ao menu");

  // Adiciona CSS mais específico usando seletores baseados em conteúdo
  setTimeout(() => {
    addAdvancedCSS();
  }, 500);
}

function addAdvancedCSS() {
  console.log("🔧 Aplicando CSS avançado...");

  // Procura elementos específicos e aplica CSS diretamente
  const allElements = document.querySelectorAll("*");

  allElements.forEach((element) => {
    const text = element.textContent || "";

    // Remove DIAGNÓSTICO
    if (
      text.trim() === "DIAGNÓSTICO" ||
      (text.includes("DIAGNÓSTICO") && text.length < 30)
    ) {
      let targetElement = element;

      // Encontra o elemento clicável/container
      while (
        targetElement.parentElement &&
        !targetElement.onclick &&
        !targetElement.getAttribute("href") &&
        !targetElement.getAttribute("role") &&
        targetElement.parentElement.children.length <= 2
      ) {
        targetElement = targetElement.parentElement;
      }

      // Aplica CSS para esconder
      targetElement.style.setProperty("display", "none", "important");
      targetElement.style.setProperty("visibility", "hidden", "important");
      targetElement.style.setProperty("opacity", "0", "important");
      targetElement.style.setProperty("height", "0px", "important");
      targetElement.style.setProperty("overflow", "hidden", "important");
      targetElement.style.setProperty("padding", "0", "important");
      targetElement.style.setProperty("margin", "0", "important");

      console.log("🗑️ DIAGNÓSTICO escondido:", targetElement);
    }

    // Remove ADMINISTRAÇÃO
    if (
      text.trim() === "ADMINISTRAÇÃO" ||
      (text.includes("ADMINISTRAÇÃO") && text.length < 30)
    ) {
      let targetElement = element;

      // Encontra o elemento clicável/container
      while (
        targetElement.parentElement &&
        !targetElement.onclick &&
        !targetElement.getAttribute("href") &&
        !targetElement.getAttribute("role") &&
        targetElement.parentElement.children.length <= 2
      ) {
        targetElement = targetElement.parentElement;
      }

      // Aplica CSS para esconder
      targetElement.style.setProperty("display", "none", "important");
      targetElement.style.setProperty("visibility", "hidden", "important");
      targetElement.style.setProperty("opacity", "0", "important");
      targetElement.style.setProperty("height", "0px", "important");
      targetElement.style.setProperty("overflow", "hidden", "important");
      targetElement.style.setProperty("padding", "0", "important");
      targetElement.style.setProperty("margin", "0", "important");

      console.log("🗑️ ADMINISTRAÇÃO removida:", targetElement);
    }
  });

  // Mostra notificação de sucesso
  showSuccessNotification();
}

function showSuccessNotification() {
  // Remove notificação anterior se existir
  const existing = document.getElementById("menu-success-notification");
  if (existing) existing.remove();

  const notification = document.createElement("div");
  notification.id = "menu-success-notification";
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 9999;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease-out;
  `;

  // Adiciona animação CSS
  const animationStyle = document.createElement("style");
  animationStyle.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(animationStyle);

  notification.textContent = "✅ Menu lateral modificado!";
  document.body.appendChild(notification);

  // Remove após 4 segundos
  setTimeout(() => {
    notification.style.animation = "slideIn 0.3s ease-out reverse";
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 300);
  }, 4000);
}

// Execução principal
function startCSSModification() {
  console.log("🚀 Iniciando modificação CSS do menu...");

  // Aplica imediatamente
  applyMenuCSS();

  // Tenta novamente após delays
  setTimeout(applyMenuCSS, 1000);
  setTimeout(applyMenuCSS, 3000);
  setTimeout(applyMenuCSS, 5000);

  // Observer para mudanças no DOM
  const observer = new MutationObserver((mutations) => {
    let shouldReapply = false;

    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const text = node.textContent || "";
            if (
              text.includes("DIAGNÓSTICO") ||
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
        addAdvancedCSS();
      }, 200);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Para o observer após 2 minutos
  setTimeout(() => {
    observer.disconnect();
  }, 120000);
}

// Inicia quando DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startCSSModification);
} else {
  startCSSModification();
}
