// MOVE SETTINGS TO ADMIN - Move Definições para secção Administração

console.log("🔄 MOVE: Movendo Definições para Administração...");

(function () {
  "use strict";

  function moveSettingsToAdmin() {
    let moved = 0;

    // Procurar pela secção de Definições/Settings
    const allElements = document.querySelectorAll("*");
    let settingsSection = null;
    let adminSection = null;

    // Encontrar as secções
    for (const element of allElements) {
      const text = element.textContent?.trim();

      // Procurar por cabeçalhos de secção
      if (
        element.tagName === "SPAN" &&
        element.classList.contains("text-xs") &&
        element.classList.contains("font-semibold")
      ) {
        if (
          text === "Definições" ||
          text === "Settings" ||
          text === "Configurações"
        ) {
          settingsSection = element;
          console.log("🔍 MOVE: Encontrada secção Definições");
        }

        if (text === "Administração") {
          adminSection = element;
          console.log("🔍 MOVE: Encontrada secção Administração");
        }
      }
    }

    if (settingsSection && adminSection) {
      // Encontrar os containers das secções
      let settingsContainer = settingsSection.parentElement;
      let adminContainer = adminSection.parentElement;

      // Subir na hierarquia para encontrar o container completo
      for (let i = 0; i < 10; i++) {
        if (!settingsContainer || !adminContainer) break;

        // Procurar pelo container que contém navegação/links
        const settingsNav = settingsContainer.querySelector("nav, ul");
        const adminNav = adminContainer.querySelector("nav, ul");

        if (settingsNav && adminNav) {
          console.log(
            "🔄 MOVE: Movendo itens de Definições para Administração",
          );

          // Mover todos os itens de navegação das Definições para Administração
          const settingsItems = settingsNav.children;
          const itemsArray = Array.from(settingsItems);

          for (const item of itemsArray) {
            adminNav.appendChild(item);
            moved++;
            console.log(
              `📦 MOVE: Item movido - ${item.textContent?.substring(0, 30)}`,
            );
          }

          // Esconder a secção de Definições vazia
          let sectionToHide = settingsSection;
          for (let j = 0; j < 5; j++) {
            sectionToHide = sectionToHide.parentElement;
            if (!sectionToHide) break;

            if (sectionToHide.children.length <= 2) {
              sectionToHide.style.display = "none !important";
              console.log("🗑️ MOVE: Secção Definições escondida");
              break;
            }
          }
          break;
        }

        settingsContainer = settingsContainer.parentElement;
        adminContainer = adminContainer.parentElement;
      }
    }

    // Alternativa: mover botões/links individuais de definições
    const settingsButtons = document.querySelectorAll("button, a");
    const adminNavs = document.querySelectorAll("nav, ul");

    for (const btn of settingsButtons) {
      const btnText = btn.textContent?.toLowerCase() || "";

      // Se é um botão de configurações/definições
      if (
        btnText.includes("definições") ||
        btnText.includes("settings") ||
        btnText.includes("configurações") ||
        btnText.includes("profile") ||
        btnText.includes("perfil") ||
        btnText.includes("conta")
      ) {
        // Procurar um nav de administração para mover
        for (const nav of adminNavs) {
          const navParent = nav.closest("div");
          const navText = navParent?.textContent?.toLowerCase() || "";

          if (navText.includes("administração")) {
            console.log(
              `🔄 MOVE: Movendo botão "${btn.textContent}" para Administração`,
            );
            nav.appendChild(btn.cloneNode(true));
            btn.style.display = "none !important";
            moved++;
            break;
          }
        }
      }
    }

    return moved;
  }

  function execute() {
    try {
      const count = moveSettingsToAdmin();
      if (count > 0) {
        console.log(`✅ MOVE: ${count} itens movidos para Administração`);
      } else {
        console.log("⚠️ MOVE: Nenhum item encontrado para mover");
      }
    } catch (error) {
      console.error("❌ MOVE: Erro:", error);
    }
  }

  // Executar múltiplas vezes para garantir que funciona
  function start() {
    execute(); // Imediato
    setTimeout(execute, 2000); // 2s
    setTimeout(execute, 5000); // 5s
    setTimeout(execute, 8000); // 8s

    // Monitor por 30 segundos
    const monitor = setInterval(execute, 10000);
    setTimeout(() => {
      clearInterval(monitor);
      console.log("🔄 MOVE: Monitor finalizado");
    }, 30000);
  }

  // Inicializar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    setTimeout(start, 1000);
  }

  console.log("🔄 MOVE: Sistema de movimentação iniciado");
})();
