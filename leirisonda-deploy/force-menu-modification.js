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

    // REMOVER ADMINISTRAÇÃO
    if (
      text.trim() === "ADMINISTRAÇÃO" ||
      (text.includes("ADMINISTRAÇÃO") && text.length < 50)
    ) {
      console.log("🗑️ ENCONTREI ADMINISTRAÇÃO:", element);

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
        console.log("🗑️ Removendo ADMINISTRAÇÃO:", targetElement);
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
