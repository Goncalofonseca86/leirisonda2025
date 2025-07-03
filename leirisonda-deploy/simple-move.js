// SIMPLE MOVE - Script simples para mover Definições para Administração

console.log("🔄 SIMPLE MOVE: Iniciando...");

function moveDefinitions() {
  console.log("🔍 Procurando sidebar...");

  // Aguardar 3 segundos para o sidebar carregar
  setTimeout(() => {
    console.log("🔍 Procurando secções...");

    // Encontrar todas as secções do sidebar
    const spans = document.querySelectorAll(
      "span.text-xs.font-semibold.text-gray-400.uppercase.tracking-wider",
    );

    let adminSpan = null;
    let settingsSpan = null;

    for (const span of spans) {
      const text = span.textContent?.trim();
      console.log(`🔍 Encontrado span: "${text}"`);

      if (text === "Administração") {
        adminSpan = span;
        console.log("✅ Encontrada Administração");
      }

      if (text === "Definições" || text === "Settings") {
        settingsSpan = span;
        console.log("✅ Encontradas Definições");
      }
    }

    if (adminSpan && settingsSpan) {
      console.log("🔄 Movendo conteúdo...");

      // Encontrar o nav da secção de Definições
      let settingsParent = settingsSpan.parentElement;
      let adminParent = adminSpan.parentElement;

      // Procurar pelo nav ou ul nas Definições
      for (let i = 0; i < 10; i++) {
        if (!settingsParent) break;

        const settingsNav = settingsParent.querySelector("nav, ul");
        if (settingsNav) {
          console.log("📦 Encontrado nav das Definições");

          // Procurar pelo nav da Administração
          for (let j = 0; j < 10; j++) {
            if (!adminParent) break;

            const adminNav = adminParent.querySelector("nav, ul");
            if (adminNav) {
              console.log("📦 Encontrado nav da Administração");

              // Mover todos os itens
              const items = Array.from(settingsNav.children);
              items.forEach((item) => {
                adminNav.appendChild(item);
                console.log(
                  `✅ Item movido: ${item.textContent?.substring(0, 30)}`,
                );
              });

              // Esconder secção de Definições
              let hideTarget = settingsSpan;
              for (let k = 0; k < 5; k++) {
                hideTarget = hideTarget.parentElement;
                if (!hideTarget) break;

                if (hideTarget.children.length <= 2) {
                  hideTarget.style.display = "none !important";
                  console.log("🗑️ Secção Definições escondida");
                  break;
                }
              }

              console.log("✅ Movimentação completa!");
              return;
            }
            adminParent = adminParent.parentElement;
          }
          break;
        }
        settingsParent = settingsParent.parentElement;
      }
    } else {
      console.log("⚠️ Secções não encontradas ainda");
      if (!adminSpan) console.log("❌ Administração não encontrada");
      if (!settingsSpan) console.log("❌ Definições não encontradas");
    }
  }, 3000);
}

// Executar quando o DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", moveDefinitions);
} else {
  moveDefinitions();
}

// Executar também após navegação
window.addEventListener("popstate", () => {
  setTimeout(moveDefinitions, 2000);
});

console.log("🔄 SIMPLE MOVE: Sistema iniciado");
