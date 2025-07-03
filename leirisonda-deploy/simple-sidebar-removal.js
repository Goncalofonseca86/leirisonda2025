// SIMPLE SIDEBAR REMOVAL - Remove apenas Administração e Diagnóstico do sidebar

console.log("🗑️ SIMPLE: Iniciando remoção simples de seções...");

(function () {
  "use strict";

  // Função simples para esconder elementos problemáticos
  function hideProblematicElements() {
    let hiddenCount = 0;

    // Procurar por todos os elementos de texto
    const allElements = document.querySelectorAll("*");

    for (const element of allElements) {
      const text = element.textContent?.trim();

      // Se o elemento contém exatamente o texto problemático
      if (text === "Diagnóstico" || text === "Administração") {
        // Verificar se é um span com as classes específicas do sidebar
        if (
          element.tagName === "SPAN" &&
          element.classList.contains("text-xs") &&
          element.classList.contains("font-semibold")
        ) {
          console.log(`🗑️ SIMPLE: Escondendo "${text}"`);

          // Esconder o elemento e seu container pai
          element.style.display = "none !important";

          // Procurar pelo container pai (máximo 5 níveis)
          let parent = element.parentElement;
          for (let i = 0; i < 5; i++) {
            if (!parent) break;

            // Se o pai tem poucos filhos e contém o texto problemático
            if (parent.children.length <= 3) {
              const parentText = parent.textContent?.trim();
              if (
                parentText === text ||
                (parentText.includes(text) && parentText.length < 100)
              ) {
                parent.style.display = "none !important";
                hiddenCount++;
                break;
              }
            }
            parent = parent.parentElement;
          }
        }
      }

      // Esconder botões ou links com texto problemático
      else if (
        (element.tagName === "BUTTON" || element.tagName === "A") &&
        (text.includes("Diagnóstico") || text.includes("Administração"))
      ) {
        console.log(`🗑️ SIMPLE: Escondendo ${element.tagName} "${text}"`);
        element.style.display = "none !important";
        hiddenCount++;
      }
    }

    return hiddenCount;
  }

  // Executar remoção simples
  function executeSimpleRemoval() {
    try {
      const hidden = hideProblematicElements();
      if (hidden > 0) {
        console.log(`✅ SIMPLE: ${hidden} elementos escondidos`);
      }
    } catch (error) {
      console.error("❌ SIMPLE: Erro:", error);
    }
  }

  // Agendar execução
  function scheduleSimpleRemoval() {
    // Executar imediatamente
    executeSimpleRemoval();

    // Executar após 2 segundos
    setTimeout(executeSimpleRemoval, 2000);

    // Executar após 5 segundos
    setTimeout(executeSimpleRemoval, 5000);

    // Monitor simples por 30 segundos
    const monitor = setInterval(executeSimpleRemoval, 5000);

    setTimeout(() => {
      clearInterval(monitor);
      console.log("🗑️ SIMPLE: Monitor finalizado");
    }, 30000);
  }

  // Inicializar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleSimpleRemoval);
  } else {
    setTimeout(scheduleSimpleRemoval, 500);
  }

  console.log("🗑️ SIMPLE: Sistema simples iniciado");
})();
