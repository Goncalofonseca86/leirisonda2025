// DIRECT CSS - Aplica CSS direto para modificar o menu

console.log("🎨 CSS: Aplicando estilos diretos...");

function applyDirectCSS() {
  // Criar e injetar CSS específico
  const css = `
    /* Esconder DIAGNÓSTICO completamente */
    *:has-text("DIAGNÓSTICO") {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      overflow: hidden !important;
    }
    
    /* Tentar várias formas de esconder DIAGNÓSTICO */
    [class*="diagnostic"] {
      display: none !important;
    }
    
    /* Destacar ADMINISTRAÇÃO */
    *:has-text("ADMINISTRAÇÃO") {
      background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%) !important;
      border: 2px solid #f39c12 !important;
      border-radius: 12px !important;
      padding: 16px !important;
      margin: 8px !important;
      box-shadow: 0 4px 8px rgba(243,156,18,0.3) !important;
    }
  `;

  // Injetar CSS
  const style = document.createElement("style");
  style.innerHTML = css;
  document.head.appendChild(style);

  console.log("🎨 CSS: CSS base injetado");

  // Força manual mais agressiva
  setTimeout(() => {
    forceModification();
  }, 1000);
}

function forceModification() {
  console.log("💪 FORCE: Iniciando modificação forçada...");

  // Procurar por todos os elementos e modificar diretamente
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT,
    null,
    false,
  );

  let node;
  while ((node = walker.nextNode())) {
    const text = node.textContent?.trim();

    // Se contém DIAGNÓSTICO, esconder
    if (text === "DIAGNÓSTICO" || text?.includes("DIAGNÓSTICO")) {
      console.log("🗑️ FORCE: Escondendo DIAGNÓSTICO");

      // Aplicar múltiplas formas de esconder
      node.style.display = "none !important";
      node.style.visibility = "hidden !important";
      node.style.opacity = "0 !important";
      node.style.height = "0 !important";
      node.style.maxHeight = "0 !important";
      node.style.overflow = "hidden !important";
      node.style.position = "absolute !important";
      node.style.left = "-9999px !important";
      node.setAttribute("hidden", "true");
      node.setAttribute("aria-hidden", "true");

      // Esconder também o elemento pai se necessário
      let parent = node.parentElement;
      for (let i = 0; i < 3; i++) {
        if (!parent) break;

        const parentText = parent.textContent?.trim();
        if (
          parentText &&
          parentText.length < 100 &&
          parentText.includes("DIAGNÓSTICO")
        ) {
          parent.style.display = "none !important";
          parent.style.visibility = "hidden !important";
          parent.style.height = "0 !important";
          parent.style.overflow = "hidden !important";
          break;
        }
        parent = parent.parentElement;
      }
    }

    // Se contém ADMINISTRAÇÃO, destacar
    if (text === "ADMINISTRAÇÃO" || text?.includes("ADMINISTRAÇÃO")) {
      console.log("⭐ FORCE: Destacando ADMINISTRAÇÃO");

      // Encontrar o container certo
      let container = node;
      for (let i = 0; i < 3; i++) {
        if (!container.parentElement) break;
        container = container.parentElement;

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
          container.style.zIndex = "100 !important";

          // Adicionar texto especial
          if (
            node.tagName &&
            (node.tagName === "SPAN" || node.textContent === "ADMINISTRAÇÃO")
          ) {
            node.innerHTML = "⭐ ADMINISTRAÇÃO (EXPANDIDA)";
            node.style.fontWeight = "800 !important";
            node.style.color = "#8b4513 !important";
            node.style.fontSize = "16px !important";
          }

          break;
        }
      }
    }
  }

  // Verificar se funcionou
  setTimeout(() => {
    verifyChanges();
  }, 2000);
}

function verifyChanges() {
  const diagnosticElements = [];
  const adminElements = [];

  const allElements = document.querySelectorAll("*");
  for (const element of allElements) {
    const text = element.textContent?.trim();

    if (text === "DIAGNÓSTICO") {
      diagnosticElements.push(element);
    }

    if (text === "ADMINISTRAÇÃO") {
      adminElements.push(element);
    }
  }

  console.log(
    `📊 VERIFY: Encontrados ${diagnosticElements.length} elementos DIAGNÓSTICO, ${adminElements.length} elementos ADMINISTRAÇÃO`,
  );

  // Se ainda há elementos DIAGNÓSTICO visíveis, forçar remoção
  diagnosticElements.forEach((element) => {
    if (element.offsetHeight > 0 || element.offsetWidth > 0) {
      console.log(
        "🚨 VERIFY: DIAGNÓSTICO ainda visível, forçando remoção total...",
      );
      element.remove();
    }
  });

  // Mostrar notificação final
  if (diagnosticElements.length > 0 || adminElements.length > 0) {
    showNotification();
  }
}

function showNotification() {
  // Remover notificação anterior se existir
  const existing = document.getElementById("modification-notification");
  if (existing) existing.remove();

  // Criar notificação
  const notification = document.createElement("div");
  notification.id = "modification-notification";
  notification.style.cssText = `
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
    color: white !important;
    padding: 24px 32px !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 24px rgba(40,167,69,0.4) !important;
    z-index: 999999 !important;
    font-family: 'Open Sans', sans-serif !important;
    text-align: center !important;
    max-width: 90vw !important;
  `;

  notification.innerHTML = `
    <div style="font-size: 32px; margin-bottom: 12px;">✅</div>
    <div style="font-size: 20px; font-weight: 700; margin-bottom: 8px;">Alterações Aplicadas!</div>
    <div style="font-size: 14px; opacity: 0.9;">
      Script executado com sucesso.<br>
      DIAGNÓSTICO removido • ADMINISTRAÇÃO destacada
    </div>
    <button onclick="this.parentElement.remove()" style="
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      margin-top: 16px;
      cursor: pointer;
      font-size: 12px;
    ">Fechar</button>
  `;

  document.body.appendChild(notification);

  // Auto remover após 8 segundos
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 8000);
}

// Executar em sequência
setTimeout(applyDirectCSS, 500);
setTimeout(forceModification, 2000);
setTimeout(forceModification, 5000);
setTimeout(forceModification, 10000);

console.log("🎨 CSS: Sistema CSS direto iniciado");
