// DIRECT SIDEBAR HIDE - Remove diretamente Administração e Diagnóstico

console.log("🎯 DIRETO: Removendo seções específicas do sidebar...");

(function () {
  "use strict";

  function hideElements() {
    let removed = 0;

    // Estratégia 1: Esconder spans exatos (mas MANTER Definições/Configurações)
    const spans = document.querySelectorAll("span");
    for (const span of spans) {
      const text = span.textContent?.trim();
      if (text === "Diagnóstico" || text === "Administração") {
        console.log(`���� DIRETO: Encontrado span "${text}"`);

        // Esconder o span
        span.style.display = "none !important";
        span.style.visibility = "hidden !important";

        // Esconder containers pais até 8 níveis, mas só se não contêm "Definições"
        let parent = span.parentElement;
        for (let i = 0; i < 8; i++) {
          if (!parent) break;

          const parentText = parent.textContent?.trim();
          // Se o pai só contém este texto E NÃO contém Definições/Configurações
          if (
            parentText &&
            parentText.length < 200 &&
            (parentText.includes("Diagnóstico") ||
              parentText.includes("Administração")) &&
            !parentText.includes("Definições") &&
            !parentText.includes("Configurações") &&
            !parentText.includes("Settings")
          ) {
            console.log(`🎯 DIRETO: Escondendo container nível ${i + 1}`);
            parent.style.display = "none !important";
            parent.style.visibility = "hidden !important";
            parent.style.height = "0 !important";
            parent.style.overflow = "hidden !important";
            removed++;
            break;
          }
          parent = parent.parentElement;
        }
      }
    }

    // Estratégia 2: Esconder qualquer elemento com texto exato (mas manter Definições)
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT,
      null,
      false,
    );

    const elementsToHide = [];
    let node = walker.nextNode();

    while (node) {
      const text = node.textContent?.trim();
      const directText = node.innerText?.trim();

      // Só esconder se for exatamente Diagnóstico ou Administração E não contém Definições
      if (
        (text === "Diagnóstico" ||
          text === "Administração" ||
          directText === "Diagnóstico" ||
          directText === "Administração") &&
        !text?.includes("Definições") &&
        !text?.includes("Configurações") &&
        !text?.includes("Settings")
      ) {
        elementsToHide.push(node);
      }
      node = walker.nextNode();
    }

    for (const element of elementsToHide) {
      console.log(
        `🎯 DIRETO: Escondendo elemento "${element.textContent?.substring(0, 30)}"`,
      );
      element.style.display = "none !important";
      element.style.visibility = "hidden !important";
      element.style.height = "0 !important";
      element.style.overflow = "hidden !important";
      removed++;
    }

    // Estratégia 3: CSS dinâmico específico
    const css = `
      span:contains("Diagnóstico"),
      span:contains("Administração"),
      div:contains("Diagnóstico"):not(:has(*:contains("Diagnóstico"))),
      div:contains("Administração"):not(:has(*:contains("Administração"))) {
        display: none !important;
        visibility: hidden !important;
        height: 0 !important;
        overflow: hidden !important;
      }
    `;

    // Injetar CSS se ainda não existe
    if (!document.getElementById("direct-hide-css")) {
      const style = document.createElement("style");
      style.id = "direct-hide-css";
      style.innerHTML = css;
      document.head.appendChild(style);
    }

    // Estratégia 4: Força bruta em elementos específicos (mas manter Definições)
    const problemElements = document.querySelectorAll("*");
    for (const el of problemElements) {
      const text = el.textContent?.trim();
      if (
        text &&
        text.length < 50 &&
        (text === "Diagnóstico" || text === "Administração") &&
        !text.includes("Definições") &&
        !text.includes("Configurações") &&
        !text.includes("Settings")
      ) {
        el.style.display = "none !important";
        el.style.visibility = "hidden !important";
        el.style.position = "absolute !important";
        el.style.left = "-9999px !important";
        el.setAttribute("hidden", "true");
        removed++;
      }
    }

    return removed;
  }

  function executeHiding() {
    try {
      const count = hideElements();
      if (count > 0) {
        console.log(`✅ DIRETO: ${count} elementos removidos`);
      } else {
        console.log("⚠️ DIRETO: Nenhum elemento encontrado");
      }

      // Verificar se ainda existem elementos visíveis
      const stillVisible = [];
      const allSpans = document.querySelectorAll("span");
      for (const span of allSpans) {
        const text = span.textContent?.trim();
        if (
          (text === "Diagnóstico" || text === "Administração") &&
          span.offsetHeight > 0 &&
          span.offsetWidth > 0
        ) {
          stillVisible.push(span);
        }
      }

      if (stillVisible.length > 0) {
        console.log(
          `⚠️ DIRETO: ${stillVisible.length} elementos ainda visíveis, forçando remoção...`,
        );
        for (const el of stillVisible) {
          el.style.display = "none !important";
          el.parentElement &&
            (el.parentElement.style.display = "none !important");
        }
      }
    } catch (error) {
      console.error("❌ DIRETO: Erro:", error);
    }
  }

  // Executar múltiplas vezes
  function startHiding() {
    // Imediato
    executeHiding();

    // Após 1 segundo
    setTimeout(executeHiding, 1000);

    // Após 3 segundos
    setTimeout(executeHiding, 3000);

    // Após 5 segundos
    setTimeout(executeHiding, 5000);

    // Monitor contínuo
    const monitor = setInterval(executeHiding, 3000);

    // Parar após 60 segundos
    setTimeout(() => {
      clearInterval(monitor);
      console.log("🎯 DIRETO: Monitor finalizado");
    }, 60000);
  }

  // Inicializar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startHiding);
  } else {
    setTimeout(startHiding, 100);
  }

  console.log("🎯 DIRETO: Sistema iniciado");
})();
