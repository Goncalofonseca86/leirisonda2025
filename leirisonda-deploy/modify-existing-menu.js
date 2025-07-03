// MODIFY EXISTING MENU - Modifica o menu lateral que já está visível

console.log("🎯 MODIFY: Modificando menu lateral existente...");

function modifyExistingMenu() {
  console.log("🔍 MODIFY: Procurando elementos do menu...");

  // Procurar e remover DIAGNÓSTICO
  const allElements = document.querySelectorAll("*");
  let foundDiagnostic = false;
  let foundAdmin = false;

  for (const element of allElements) {
    const text = element.textContent?.trim();

    // Remover DIAGNÓSTICO
    if (text === "DIAGNÓSTICO" || text === "Diagnóstico") {
      console.log("🗑️ MODIFY: Encontrado DIAGNÓSTICO, removendo...");

      // Encontrar o container pai
      let container = element;
      for (let i = 0; i < 5; i++) {
        container = container.parentElement;
        if (!container) break;

        // Se o container parece ser um item de menu completo
        if (
          container.style.cursor === "pointer" ||
          container.tagName === "BUTTON" ||
          (container.children.length <= 3 &&
            container.textContent?.includes("DIAGNÓSTICO"))
        ) {
          container.style.display = "none !important";
          container.style.visibility = "hidden !important";
          container.style.height = "0 !important";
          container.style.overflow = "hidden !important";
          foundDiagnostic = true;
          console.log("✅ MODIFY: DIAGNÓSTICO removido!");
          break;
        }
      }
    }

    // Modificar ADMINISTRAÇÃO
    if (text === "ADMINISTRAÇÃO" || text === "Administração") {
      console.log("⭐ MODIFY: Encontrado ADMINISTRAÇÃO, modificando...");

      // Encontrar o container pai
      let container = element;
      for (let i = 0; i < 5; i++) {
        container = container.parentElement;
        if (!container) break;

        // Se parece ser um item de menu
        if (
          container.style.cursor === "pointer" ||
          container.tagName === "BUTTON" ||
          (container.children.length <= 3 &&
            container.textContent?.includes("ADMINISTRAÇÃO"))
        ) {
          // Aplicar estilo especial
          container.style.background =
            "linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%) !important";
          container.style.border = "2px solid #f39c12 !important";
          container.style.borderRadius = "12px !important";
          container.style.margin = "8px !important";
          container.style.padding = "16px !important";
          container.style.boxShadow =
            "0 4px 8px rgba(243,156,18,0.2) !important";

          // Modificar o texto para destacar
          if (
            element.tagName === "SPAN" ||
            element.textContent === "ADMINISTRAÇÃO"
          ) {
            element.innerHTML = "⭐ ADMINISTRAÇÃO (EXPANDIDA)";
            element.style.fontWeight = "700 !important";
            element.style.color = "#8b4513 !important";
          }

          // Adicionar sub-itens das antigas Definições
          const subMenu = document.createElement("div");
          subMenu.style.cssText = `
            margin-top: 12px !important;
            padding-top: 12px !important;
            border-top: 1px solid rgba(243,156,18,0.3) !important;
          `;

          subMenu.innerHTML = `
            <div style="font-size: 12px; color: #8b4513; font-weight: 600; margin-bottom: 8px; text-transform: uppercase;">
              Definições Integradas:
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px;">
              <div style="background: rgba(255,255,255,0.8); border-radius: 6px; padding: 8px; font-size: 13px; color: #8b4513;">
                ⚙️ Configurações Gerais
              </div>
              <div style="background: rgba(255,255,255,0.8); border-radius: 6px; padding: 8px; font-size: 13px; color: #8b4513;">
                👤 Perfil de Utilizador
              </div>
              <div style="background: rgba(255,255,255,0.8); border-radius: 6px; padding: 8px; font-size: 13px; color: #8b4513;">
                🔐 Segurança & Privacidade
              </div>
              <div style="background: rgba(255,255,255,0.8); border-radius: 6px; padding: 8px; font-size: 13px; color: #8b4513;">
                📊 Relatórios & Analytics
              </div>
            </div>
          `;

          container.appendChild(subMenu);
          foundAdmin = true;
          console.log("✅ MODIFY: ADMINISTRAÇÃO expandida com definições!");
          break;
        }
      }
    }
  }

  // Adicionar notificação de sucesso se encontrou os elementos
  if (foundDiagnostic || foundAdmin) {
    // Criar notificação de sucesso
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
      color: white !important;
      padding: 16px 20px !important;
      border-radius: 12px !important;
      box-shadow: 0 4px 12px rgba(40,167,69,0.3) !important;
      z-index: 10000 !important;
      font-family: 'Open Sans', sans-serif !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      max-width: 300px !important;
    `;

    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 20px;">✅</span>
        <div>
          <div style="font-weight: 700; margin-bottom: 4px;">Alterações Aplicadas!</div>
          <div style="font-size: 12px; opacity: 0.9;">
            ${foundDiagnostic ? "• DIAGNÓSTICO removido" : ""}<br>
            ${foundAdmin ? "• ADMINISTRAÇÃO expandida" : ""}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Remover notificação após 5 segundos
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  console.log(
    `📊 MODIFY: Diagnóstico ${foundDiagnostic ? "removido" : "não encontrado"}, Administração ${foundAdmin ? "modificada" : "não encontrada"}`,
  );
}

// Executar múltiplas vezes para garantir que funciona
function startModification() {
  // Executar imediatamente
  modifyExistingMenu();

  // Executar após 2 segundos
  setTimeout(modifyExistingMenu, 2000);

  // Executar após 5 segundos
  setTimeout(modifyExistingMenu, 5000);

  // Monitor contínuo para mudanças no DOM
  const observer = new MutationObserver(() => {
    modifyExistingMenu();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Parar observação após 2 minutos
  setTimeout(() => {
    observer.disconnect();
    console.log("🎯 MODIFY: Monitor finalizado");
  }, 120000);
}

// Inicializar quando DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startModification);
} else {
  setTimeout(startModification, 1000);
}

console.log("🎯 MODIFY: Sistema de modificação iniciado");
