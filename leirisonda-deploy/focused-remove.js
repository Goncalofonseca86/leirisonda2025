// FOCUSED REMOVE - Remove APENAS Administração e Diagnóstico (mantém Definições)

console.log("🎯 FOCUSED: Removendo apenas Administração e Diagnóstico...");

(function () {
  "use strict";

  function removeSpecificSections() {
    let removed = 0;

    // Procurar APENAS por elementos com texto exato "Diagnóstico" ou "Administração"
    const allElements = document.querySelectorAll("*");

    for (const element of allElements) {
      const exactText = element.textContent?.trim();

      // APENAS se for exatamente "Diagnóstico" ou "Administração"
      if (exactText === "Diagnóstico" || exactText === "Administração") {
        console.log(`🎯 FOCUSED: Removendo "${exactText}"`);

        // Esconder o elemento
        element.style.display = "none !important";
        element.style.visibility = "hidden !important";

        // Esconder o container pai se só contém este texto
        let parent = element.parentElement;
        while (parent && parent !== document.body) {
          const parentText = parent.textContent?.trim();

          // Se o pai tem apenas este texto problemático (e não outras coisas)
          if (
            parentText &&
            parentText.length < 50 &&
            (parentText === "Diagnóstico" || parentText === "Administração")
          ) {
            parent.style.display = "none !important";
            parent.style.visibility = "hidden !important";
            removed++;
            break;
          }
          parent = parent.parentElement;
        }
      }
    }

    // Procurar também por botões ou links específicos
    const buttons = document.querySelectorAll("button, a");
    for (const btn of buttons) {
      const btnText = btn.textContent?.trim();
      if (
        btnText === "Diagnóstico" ||
        btnText === "Administração" ||
        btnText === "Diagnóstico de Sincronização" ||
        btnText === "Diagnóstico de Emergência"
      ) {
        console.log(`🎯 FOCUSED: Removendo botão "${btnText}"`);
        btn.style.display = "none !important";
        btn.style.visibility = "hidden !important";
        removed++;
      }
    }

    return removed;
  }

  function execute() {
    try {
      const count = removeSpecificSections();
      if (count > 0) {
        console.log(`✅ FOCUSED: ${count} elementos removidos`);
      }
    } catch (error) {
      console.error("❌ FOCUSED: Erro:", error);
    }
  }

  // Executar várias vezes
  function start() {
    execute(); // Imediato
    setTimeout(execute, 1000); // 1s
    setTimeout(execute, 3000); // 3s
    setTimeout(execute, 5000); // 5s

    // Monitor por 30 segundos
    const monitor = setInterval(execute, 5000);
    setTimeout(() => {
      clearInterval(monitor);
      console.log("🎯 FOCUSED: Monitor finalizado");
    }, 30000);
  }

  // Inicializar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    setTimeout(start, 100);
  }

  console.log("🎯 FOCUSED: Sistema focado iniciado");
})();
