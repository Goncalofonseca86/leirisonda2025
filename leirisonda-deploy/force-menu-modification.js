// Script robusto para modificar o menu lateral da Leirisonda
console.log("🔧 Script robusto iniciado para modificar menu...");

function forceMenuModification() {
  console.log("🔍 Procurando DIAGNÓSTICO e ADMINISTRAÇÃO...");

  // Procura por QUALQUER elemento que contenha DIAGNÓSTICO
  const allElements = Array.from(document.querySelectorAll("*"));
  let modified = false;

  allElements.forEach((element) => {
    const text = element.textContent || "";

    // REMOVER DIAGNÓSTICO
    if (
      text.trim() === "DIAGNÓSTICO" ||
      (text.includes("DIAGNÓSTICO") && text.length < 50)
    ) {
      console.log("🗑️ ENCONTREI DIAGNÓSTICO:", element);

      // Tenta remover o elemento e seus pais
      let targetElement = element;

      // Se é apenas texto, pega o pai
      if (element.nodeType === Node.TEXT_NODE || element.tagName === "SPAN") {
        targetElement = element.parentElement;
      }

      // Sobe mais na hierarquia se necessário
      while (
        targetElement &&
        targetElement.parentElement &&
        targetElement.parentElement.children.length <= 2
      ) {
        targetElement = targetElement.parentElement;
      }

      if (targetElement) {
        console.log("🗑️ Removendo DIAGNÓSTICO:", targetElement);
        targetElement.style.display = "none";
        targetElement.style.visibility = "hidden";
        targetElement.style.opacity = "0";
        targetElement.style.height = "0px";
        targetElement.style.overflow = "hidden";
        targetElement.style.padding = "0";
        targetElement.style.margin = "0";

        // Remove completamente após um delay
        setTimeout(() => {
          if (targetElement.parentElement) {
            targetElement.remove();
          }
        }, 100);

        modified = true;
      }
    }

    // DESTACAR ADMINISTRAÇÃO
    if (
      text.trim() === "ADMINISTRAÇÃO" ||
      (text.includes("ADMINISTRAÇÃO") && text.length < 50)
    ) {
      console.log("⭐ ENCONTREI ADMINISTRAÇÃO:", element);

      let targetElement = element;

      // Se é apenas texto, pega o pai
      if (element.nodeType === Node.TEXT_NODE || element.tagName === "SPAN") {
        targetElement = element.parentElement;
      }

      // Sobe na hierarquia para encontrar o container clicável
      while (
        targetElement &&
        targetElement.parentElement &&
        !targetElement.onclick &&
        !targetElement.getAttribute("href") &&
        targetElement.parentElement.children.length <= 3
      ) {
        targetElement = targetElement.parentElement;
      }

      if (targetElement) {
        console.log("⭐ Destacando ADMINISTRAÇÃO:", targetElement);

        // Aplica estilo dourado imediatamente
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

        // Força a cor do texto interno
        const textElements = targetElement.querySelectorAll("*");
        textElements.forEach((textEl) => {
          textEl.style.setProperty("color", "#1f2937", "important");
        });

        // Adiciona as funcionalidades das Definições
        if (!targetElement.textContent.includes("Configurações")) {
          const settingsDiv = document.createElement("div");
          settingsDiv.style.marginTop = "12px";
          settingsDiv.style.fontSize = "14px";
          settingsDiv.style.paddingLeft = "16px";

          settingsDiv.innerHTML = `
            <div style="padding: 8px 0; color: #1f2937; cursor: pointer; border-radius: 6px; font-weight: normal;" 
                 onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)'" 
                 onmouseout="this.style.backgroundColor='transparent'">
              ⚙️ Configurações Gerais
            </div>
            <div style="padding: 8px 0; color: #1f2937; cursor: pointer; border-radius: 6px; font-weight: normal;" 
                 onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)'" 
                 onmouseout="this.style.backgroundColor='transparent'">
              👤 Perfil de Utilizador  
            </div>
            <div style="padding: 8px 0; color: #1f2937; cursor: pointer; border-radius: 6px; font-weight: normal;" 
                 onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)'" 
                 onmouseout="this.style.backgroundColor='transparent'">
              🔒 Segurança & Privacidade
            </div>
            <div style="padding: 8px 0; color: #1f2937; cursor: pointer; border-radius: 6px; font-weight: normal;" 
                 onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)'" 
                 onmouseout="this.style.backgroundColor='transparent'">
              📊 Relatórios & Analytics
            </div>
            <div style="padding: 8px 0; color: #1f2937; cursor: pointer; border-radius: 6px; font-weight: normal;" 
                 onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)'" 
                 onmouseout="this.style.backgroundColor='transparent'">
              💾 Backup & Exportação
            </div>
            <div style="padding: 8px 0; color: #1f2937; cursor: pointer; border-radius: 6px; font-weight: normal;" 
                 onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)'" 
                 onmouseout="this.style.backgroundColor='transparent'">
              🔔 Notificações
            </div>
          `;

          targetElement.appendChild(settingsDiv);
        }

        modified = true;
      }
    }
  });

  if (modified) {
    console.log("✅ Menu modificado com sucesso!");

    // Adiciona notificação visual
    const notification = document.createElement("div");
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.background = "#10b981";
    notification.style.color = "white";
    notification.style.padding = "12px 20px";
    notification.style.borderRadius = "8px";
    notification.style.zIndex = "9999";
    notification.style.fontSize = "14px";
    notification.style.fontWeight = "bold";
    notification.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    notification.textContent = "✅ Menu modificado com sucesso!";

    document.body.appendChild(notification);

    // Remove a notificação após 3 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 3000);

    return true;
  }

  return false;
}

// Execução mais agressiva
let attemptCount = 0;
const maxAttempts = 30;

function aggressiveModification() {
  attemptCount++;
  console.log(`🔄 Tentativa ${attemptCount}/${maxAttempts}`);

  if (forceMenuModification()) {
    console.log("🎉 Modificação bem-sucedida!");
    return;
  }

  if (attemptCount < maxAttempts) {
    setTimeout(aggressiveModification, 1000);
  } else {
    console.log("⚠️ Esgotadas as tentativas. Menu pode não estar carregado.");
  }
}

// Inicia imediatamente
aggressiveModification();

// Observer para mudanças no DOM
const observer = new MutationObserver((mutations) => {
  let shouldCheck = false;

  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const text = node.textContent || "";
          if (text.includes("DIAGNÓSTICO") || text.includes("ADMINISTRAÇÃO")) {
            shouldCheck = true;
          }
        }
      });
    }
  });

  if (shouldCheck) {
    setTimeout(() => {
      forceMenuModification();
    }, 500);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Para o observer após 60 segundos
setTimeout(() => {
  observer.disconnect();
}, 60000);
