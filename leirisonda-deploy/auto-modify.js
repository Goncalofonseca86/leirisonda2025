// AUTO MODIFY - Script automático para iPhone que detecta o dashboard

console.log("📱 AUTO: Script automático para iPhone iniciado...");

let checkCount = 0;
const maxChecks = 200; // Verificar por 10 minutos

function waitForDashboard() {
  checkCount++;

  console.log(
    `📱 AUTO: Verificação ${checkCount}/${maxChecks} - procurando dashboard...`,
  );

  // Verificar se já não estamos no login
  const isLogin = document.querySelector('[data-loc*="Login.tsx"]');

  if (!isLogin) {
    console.log("🎯 AUTO: Saiu do login! Procurando sidebar...");

    // Procurar por elementos do sidebar/dashboard
    const sidebarElements = [
      "DIAGNÓSTICO",
      "ADMINISTRAÇÃO",
      "Dashboard",
      "Nova Obra",
      "Utilizadores",
    ];

    let foundSidebar = false;

    for (const searchText of sidebarElements) {
      const elements = document.querySelectorAll("*");
      for (const element of elements) {
        if (element.textContent?.trim() === searchText) {
          foundSidebar = true;
          break;
        }
      }
      if (foundSidebar) break;
    }

    if (foundSidebar) {
      console.log("🎯 AUTO: Sidebar encontrado! Aplicando modificações...");
      modifySidebar();
      return; // Parar verificações
    }
  }

  // Continuar verificando se ainda não chegou ao máximo
  if (checkCount < maxChecks) {
    setTimeout(waitForDashboard, 3000); // Verificar a cada 3 segundos
  } else {
    console.log("⏰ AUTO: Tempo limite atingido");
  }
}

function modifySidebar() {
  console.log("🔧 AUTO: Modificando sidebar...");

  let modificacoes = 0;
  const elements = document.querySelectorAll("*");

  for (const element of elements) {
    const texto = element.textContent?.trim();

    // Remover DIAGNÓSTICO
    if (texto === "DIAGNÓSTICO") {
      console.log("🗑️ AUTO: Removendo DIAGNÓSTICO");

      // Esconder o elemento
      element.style.display = "none !important";
      element.style.visibility = "hidden !important";
      element.style.height = "0px !important";
      element.style.overflow = "hidden !important";
      element.style.position = "absolute !important";
      element.style.left = "-9999px !important";

      // Esconder também o container pai
      let parent = element.parentElement;
      for (let i = 0; i < 5; i++) {
        if (!parent) break;

        const parentText = parent.textContent?.trim();
        if (
          parentText &&
          parentText.length < 100 &&
          parentText.includes("DIAGNÓSTICO")
        ) {
          parent.style.display = "none !important";
          parent.style.visibility = "hidden !important";
          parent.style.height = "0px !important";
          parent.style.overflow = "hidden !important";
          parent.style.position = "absolute !important";
          parent.style.left = "-9999px !important";
          break;
        }
        parent = parent.parentElement;
      }

      modificacoes++;
    }

    // Destacar ADMINISTRAÇÃO
    if (texto === "ADMINISTRAÇÃO") {
      console.log("⭐ AUTO: Destacando ADMINISTRAÇÃO");

      // Encontrar container adequado
      let container = element;
      for (let i = 0; i < 5; i++) {
        container = container.parentElement;
        if (!container) break;

        const containerText = container.textContent?.trim();
        if (
          containerText &&
          containerText.length < 200 &&
          containerText.includes("ADMINISTRAÇÃO")
        ) {
          // Aplicar estilos especiais
          container.style.background =
            "linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%) !important";
          container.style.border = "3px solid #f39c12 !important";
          container.style.borderRadius = "15px !important";
          container.style.padding = "20px !important";
          container.style.margin = "12px !important";
          container.style.boxShadow =
            "0 6px 12px rgba(243,156,18,0.4) !important";
          container.style.transform = "scale(1.05) !important";
          container.style.zIndex = "10 !important";

          // Modificar o texto
          element.innerHTML = "⭐ ADMINISTRAÇÃO (EXPANDIDA)";
          element.style.fontWeight = "800 !important";
          element.style.color = "#8b4513 !important";
          element.style.fontSize = "16px !important";
          element.style.textTransform = "uppercase !important";

          // Adicionar indicador de que contém as antigas definições
          const indicator = document.createElement("div");
          indicator.style.cssText = `
            font-size: 12px !important;
            color: #8b4513 !important;
            margin-top: 8px !important;
            padding: 8px !important;
            background: rgba(255,255,255,0.8) !important;
            border-radius: 8px !important;
            border: 1px solid rgba(243,156,18,0.3) !important;
          `;
          indicator.innerHTML = "📦 Inclui todas as antigas Definições";
          container.appendChild(indicator);

          modificacoes++;
          break;
        }
      }
    }
  }

  // Mostrar notificação de sucesso
  if (modificacoes > 0) {
    showSuccessNotification(modificacoes);

    // Continuar monitorizando para mudanças dinâmicas
    startContinuousMonitoring();
  }

  console.log(`📊 AUTO: ${modificacoes} modificações aplicadas`);
}

function showSuccessNotification(modificacoes) {
  // Criar notificação otimizada para mobile
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
    color: white !important;
    padding: 24px !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 24px rgba(40,167,69,0.4) !important;
    z-index: 999999 !important;
    font-family: 'Open Sans', sans-serif !important;
    text-align: center !important;
    max-width: 90vw !important;
    max-height: 90vh !important;
  `;

  notification.innerHTML = `
    <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
    <div style="font-size: 20px; font-weight: 700; margin-bottom: 12px;">Sucesso!</div>
    <div style="font-size: 16px; margin-bottom: 16px; opacity: 0.95;">
      ${modificacoes} modificações aplicadas ao menu:
    </div>
    <div style="font-size: 14px; opacity: 0.9; line-height: 1.6;">
      🗑️ DIAGNÓSTICO removido<br>
      ⭐ ADMINISTRAÇÃO destacada e expandida<br>
      📦 Definições integradas na Administração
    </div>
    <div style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
      (Esta notificação desaparecerá automaticamente)
    </div>
  `;

  document.body.appendChild(notification);

  // Auto remover após 6 segundos
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 6000);
}

function startContinuousMonitoring() {
  console.log("🔄 AUTO: Iniciando monitorização contínua...");

  // Monitor para elementos que possam ser adicionados dinamicamente
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const text = node.textContent?.toLowerCase() || "";
            if (
              text.includes("diagnóstico") ||
              text.includes("administração")
            ) {
              console.log(
                "🔄 AUTO: Novo elemento detectado, re-aplicando modificações...",
              );
              setTimeout(modifySidebar, 1000);
            }
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Parar observação após 30 minutos
  setTimeout(() => {
    observer.disconnect();
    console.log("🔄 AUTO: Monitorização contínua finalizada");
  }, 1800000);
}

// Iniciar verificações
console.log("📱 AUTO: Aguardando chegada ao dashboard...");
setTimeout(waitForDashboard, 2000);

// Também verificar mudanças de URL
let currentURL = window.location.href;
setInterval(() => {
  if (window.location.href !== currentURL) {
    currentURL = window.location.href;
    console.log("🔄 AUTO: URL mudou, verificando dashboard...");
    setTimeout(modifySidebar, 2000);
  }
}, 2000);

console.log("📱 AUTO: Sistema automático para iPhone configurado!");
