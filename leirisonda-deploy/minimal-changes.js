// MINIMAL CHANGES - Remove overlay e faz apenas modificações mínimas no menu

console.log("🔧 MINIMAL: Removendo overlay e aguardando menu real...");

// Primeiro, remover qualquer overlay que possa existir
function removeOverlay() {
  const overlay = document.getElementById("leirisonda-overlay");
  if (overlay) {
    overlay.remove();
    console.log("🗑️ MINIMAL: Overlay removido");
  }
}

// Aguardar pelo menu lateral real aparecer
function waitForRealSidebar() {
  console.log("⏳ MINIMAL: Aguardando menu lateral real...");

  let attempts = 0;
  const maxAttempts = 100; // 5 minutos

  const checkForSidebar = setInterval(() => {
    attempts++;

    // Verificar se já não estamos na página de carregamento
    const protectedRouteElements = document.querySelectorAll(
      'p[data-loc*="ProtectedRoute.tsx"]',
    );
    const loadingText = Array.from(protectedRouteElements).find((el) =>
      el.textContent?.includes("A carregar"),
    );

    if (!loadingText) {
      console.log("✅ MINIMAL: Saiu da página de carregamento!");

      // Procurar pelos elementos do menu lateral
      const diagnostico = Array.from(document.querySelectorAll("*")).find(
        (el) => el.textContent?.trim() === "DIAGNÓSTICO",
      );

      const administracao = Array.from(document.querySelectorAll("*")).find(
        (el) => el.textContent?.trim() === "ADMINISTRAÇÃO",
      );

      if (diagnostico || administracao) {
        console.log(
          "🎯 MINIMAL: Menu lateral encontrado! Aplicando modificações mínimas...",
        );
        clearInterval(checkForSidebar);
        applyMinimalChanges();
        return;
      }
    }

    if (attempts >= maxAttempts) {
      console.log("⏰ MINIMAL: Tempo limite atingido");
      clearInterval(checkForSidebar);
    }

    console.log(
      `🔍 MINIMAL: Tentativa ${attempts}/${maxAttempts} - ainda na página de carregamento`,
    );
  }, 3000);
}

function applyMinimalChanges() {
  console.log("🎨 MINIMAL: Aplicando apenas as modificações solicitadas...");

  let modificacoes = 0;

  // 1. Remover DIAGNÓSTICO
  const allElements = document.querySelectorAll("*");

  for (const element of allElements) {
    const text = element.textContent?.trim();

    // Remover DIAGNÓSTICO
    if (text === "DIAGNÓSTICO") {
      console.log("🗑️ MINIMAL: Removendo DIAGNÓSTICO");

      // Esconder o elemento de forma discreta
      element.style.display = "none !important";
      element.style.visibility = "hidden !important";
      element.style.height = "0px !important";
      element.style.overflow = "hidden !important";

      // Esconder também o container pai se apropriado
      let parent = element.parentElement;
      for (let i = 0; i < 3; i++) {
        if (!parent) break;

        const parentText = parent.textContent?.trim();
        if (
          parentText &&
          parentText.length < 50 &&
          parentText.includes("DIAGNÓSTICO")
        ) {
          parent.style.display = "none !important";
          parent.style.visibility = "hidden !important";
          break;
        }
        parent = parent.parentElement;
      }

      modificacoes++;
    }

    // Destacar ADMINISTRAÇÃO (sem alterar layout)
    if (text === "ADMINISTRAÇÃO") {
      console.log("⭐ MINIMAL: Destacando ADMINISTRAÇÃO");

      // Encontrar o container mais apropriado
      let container = element.parentElement;
      while (container && container !== document.body) {
        const containerText = container.textContent?.trim();

        if (
          containerText &&
          containerText.length < 100 &&
          containerText.includes("ADMINISTRAÇÃO")
        ) {
          // Aplicar destaque subtil sem alterar o layout
          container.style.background =
            "linear-gradient(135deg, #fff3cd, #ffeaa7) !important";
          container.style.border = "2px solid #f39c12 !important";
          container.style.borderRadius = "8px !important";
          container.style.padding = "12px !important";
          container.style.margin = "4px !important";
          container.style.boxShadow =
            "0 2px 4px rgba(243,156,18,0.3) !important";

          // Modificar apenas o texto, mantendo a estrutura
          element.innerHTML = "⭐ ADMINISTRAÇÃO (EXPANDIDA)";
          element.style.fontWeight = "bold !important";
          element.style.color = "#8b4513 !important";

          modificacoes++;
          break;
        }

        container = container.parentElement;
      }
    }
  }

  // Mostrar notificação discreta de sucesso
  if (modificacoes > 0) {
    showDiscreteNotification(modificacoes);
  }

  console.log(`📊 MINIMAL: ${modificacoes} modificações aplicadas`);
}

function showDiscreteNotification(modificacoes) {
  // Notificação pequena e discreta
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    background: #28a745 !important;
    color: white !important;
    padding: 12px 16px !important;
    border-radius: 8px !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
    z-index: 10000 !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    max-width: 300px !important;
  `;

  notification.innerHTML = `
    ✅ ${modificacoes} alterações aplicadas:<br>
    • Diagnóstico removido<br>
    • Administração destacada
  `;

  document.body.appendChild(notification);

  // Remover após 5 segundos
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Inicializar
removeOverlay();
setTimeout(waitForRealSidebar, 1000);

console.log("🔧 MINIMAL: Sistema de modificações mínimas iniciado");
