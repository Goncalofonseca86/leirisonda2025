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
    
    /* DESTACAR ADMINISTRAÇÃO */
    [role="button"]:has-text("ADMINISTRAÇÃO"),
    div:has-text("ADMINISTRAÇÃO"),
    a:has-text("ADMINISTRAÇÃO"),
    li:has-text("ADMINISTRAÇÃO") {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%) !important;
      border-radius: 12px !important;
      padding: 16px !important;
      margin: 8px 16px !important;
      box-shadow: 0 4px 20px rgba(251, 191, 36, 0.3) !important;
      color: #1f2937 !important;
      font-weight: bold !important;
      border: 2px solid #f59e0b !important;
    }
    
    /* Força cor do texto em ADMINISTRAÇÃO */
    [role="button"]:has-text("ADMINISTRAÇÃO") *,
    div:has-text("ADMINISTRAÇÃO") *,
    a:has-text("ADMINISTRAÇÃO") *,
    li:has-text("ADMINISTRAÇÃO") * {
      color: #1f2937 !important;
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

    // Destaca ADMINISTRAÇÃO
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

      // Aplica estilo dourado
      targetElement.style.setProperty(
        "background",
        "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        "important",
      );
      targetElement.style.setProperty("border-radius", "12px", "important");
      targetElement.style.setProperty("padding", "16px", "important");
      targetElement.style.setProperty("margin", "8px 16px", "important");
      targetElement.style.setProperty(
        "box-shadow",
        "0 4px 20px rgba(251, 191, 36, 0.3)",
        "important",
      );
      targetElement.style.setProperty("color", "#1f2937", "important");
      targetElement.style.setProperty("font-weight", "bold", "important");
      targetElement.style.setProperty(
        "border",
        "2px solid #f59e0b",
        "important",
      );

      // Força cor dos elementos filhos
      const children = targetElement.querySelectorAll("*");
      children.forEach((child) => {
        child.style.setProperty("color", "#1f2937", "important");
      });

      console.log("⭐ ADMINISTRAÇÃO destacada:", targetElement);

      // Adiciona funcionalidades das Definições se não existir
      if (
        !targetElement.textContent.includes("Configurações") &&
        !targetElement.querySelector(".definicoes-content")
      ) {
        const settingsDiv = document.createElement("div");
        settingsDiv.className = "definicoes-content";
        settingsDiv.style.marginTop = "12px";
        settingsDiv.style.fontSize = "14px";
        settingsDiv.style.paddingLeft = "16px";

        settingsDiv.innerHTML = `
          <div style="padding: 8px 0; color: #1f2937 !important; cursor: pointer; border-radius: 6px; font-weight: normal;" 
               onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)'" 
               onmouseout="this.style.backgroundColor='transparent'">
            ⚙️ Configurações Gerais
          </div>
          <div style="padding: 8px 0; color: #1f2937 !important; cursor: pointer; border-radius: 6px; font-weight: normal;" 
               onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)'" 
               onmouseout="this.style.backgroundColor='transparent'">
            👤 Perfil de Utilizador  
          </div>
          <div style="padding: 8px 0; color: #1f2937 !important; cursor: pointer; border-radius: 6px; font-weight: normal;" 
               onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)'" 
               onmouseout="this.style.backgroundColor='transparent'">
            🔒 Segurança & Privacidade
          </div>
          <div style="padding: 8px 0; color: #1f2937 !important; cursor: pointer; border-radius: 6px; font-weight: normal;" 
               onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)'" 
               onmouseout="this.style.backgroundColor='transparent'">
            📊 Relatórios & Analytics
          </div>
          <div style="padding: 8px 0; color: #1f2937 !important; cursor: pointer; border-radius: 6px; font-weight: normal;" 
               onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)'" 
               onmouseout="this.style.backgroundColor='transparent'">
            💾 Backup & Exportação
          </div>
          <div style="padding: 8px 0; color: #1f2937 !important; cursor: pointer; border-radius: 6px; font-weight: normal;" 
               onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)'" 
               onmouseout="this.style.backgroundColor='transparent'">
            🔔 Notificações
          </div>
        `;

        targetElement.appendChild(settingsDiv);
        console.log("➕ Funcionalidades das Definições adicionadas");
      }
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
