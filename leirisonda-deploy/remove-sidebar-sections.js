// REMOVE SIDEBAR SECTIONS - Remove seções Administração e Diagnóstico do sidebar

console.log("🗑️ SIDEBAR: Removendo seções desnecessárias do sidebar...");

(function () {
  "use strict";

  // Função para remover seções específicas
  function removeSidebarSections() {
    let removedSections = 0;

    // Procurar por spans específicos com as classes do sidebar compilado
    const targetSpans = document.querySelectorAll(
      "span.text-xs.font-semibold.text-gray-400.uppercase.tracking-wider",
    );

    for (const span of targetSpans) {
      const textContent = span.textContent?.trim();

      if (textContent === "Diagnóstico" || textContent === "Administração") {
        console.log(`🗑️ SIDEBAR: Encontrado span "${textContent}"`);

        // Encontrar o container pai mais adequado (div que contém toda a seção)
        let sectionContainer = span;

        // Subir na hierarquia DOM para encontrar o container completo da seção
        for (let i = 0; i < 15; i++) {
          sectionContainer = sectionContainer.parentElement;
          if (!sectionContainer) break;

          // Procurar por um container que seja uma seção completa do sidebar
          if (
            sectionContainer.tagName === "DIV" &&
            (sectionContainer.children.length >= 2 ||
              sectionContainer.querySelector("nav") ||
              sectionContainer.querySelector("ul") ||
              sectionContainer.classList.contains("space-y-2") ||
              sectionContainer.classList.contains("space-y-1"))
          ) {
            console.log(
              `🗑️ SIDEBAR: Removendo seção completa "${textContent}"`,
            );
            sectionContainer.style.display = "none !important";
            sectionContainer.style.visibility = "hidden";
            sectionContainer.style.height = "0";
            sectionContainer.style.overflow = "hidden";
            removedSections++;
            break;
          }
        }
      }
    }

    // Procurar por elementos que contenham "Diagnóstico" ou "Administração" em qualquer lugar
    const allElements = document.querySelectorAll("*");

    for (const element of allElements) {
      const textContent = element.textContent?.trim();

      if (textContent === "Diagnóstico" || textContent === "Administração") {
        // Encontrar o container pai que provavelmente contém toda a seção
        let sectionContainer = element;

        // Subir na hierarquia DOM para encontrar o container da seção
        for (let i = 0; i < 10; i++) {
          sectionContainer = sectionContainer.parentElement;
          if (!sectionContainer) break;

          // Se encontrarmos um container que parece ser uma seção completa
          if (
            sectionContainer.querySelector("button") ||
            sectionContainer.classList.contains("space-y-") ||
            sectionContainer.children.length > 2
          ) {
            console.log(`🗑️ SIDEBAR: Removendo seção "${textContent}"`);
            sectionContainer.style.display = "none !important";
            sectionContainer.style.visibility = "hidden";
            removedSections++;
            break;
          }
        }
      }
    }

    // Procurar especificamente por texto "Diagnóstico de Sincronização" e similares
    const diagnosticButtons = document.querySelectorAll("button, div, span");
    for (const button of diagnosticButtons) {
      const buttonText = button.textContent?.toLowerCase() || "";

      if (
        buttonText.includes("diagnóstico") ||
        buttonText.includes("diagnostic") ||
        buttonText.includes("sync") ||
        buttonText.includes("sincronização") ||
        buttonText.includes("administração") ||
        buttonText.includes("administration")
      ) {
        console.log(
          `🗑️ SIDEBAR: Removendo elemento "${button.textContent?.substring(0, 50)}..."`,
        );
        button.style.display = "none !important";
        button.style.visibility = "hidden";
        removedSections++;

        // Também esconder elementos pais se necessário
        let parent = button.parentElement;
        for (let i = 0; i < 5; i++) {
          if (!parent) break;
          const parentText = parent.textContent?.toLowerCase() || "";
          if (
            parentText.includes("diagnóstico") ||
            parentText.includes("administração")
          ) {
            parent.style.display = "none !important";
            parent.style.visibility = "hidden";
            break;
          }
          parent = parent.parentElement;
        }
      }
    }

    // Procurar por elementos com data-loc que referenciem essas páginas
    const dataLocElements = document.querySelectorAll(
      '[data-loc*="Diagnostic"], [data-loc*="Administration"]',
    );
    for (const element of dataLocElements) {
      console.log(
        `🗑️ SIDEBAR: Removendo elemento com data-loc "${element.getAttribute("data-loc")}"`,
      );
      element.style.display = "none !important";
      element.style.visibility = "hidden";
      removedSections++;
    }

    // Procurar por links específicos
    const links = document.querySelectorAll(
      'a[href*="diagnostic"], a[href*="administration"], a[href*="sync"]',
    );
    for (const link of links) {
      console.log(`🗑️ SIDEBAR: Removendo link "${link.href}"`);
      link.style.display = "none !important";
      link.style.visibility = "hidden";
      removedSections++;
    }

    return removedSections;
  }

  // Função para remover seções por seletor CSS mais específico
  function removeByCSS() {
    let removed = 0;

    // Procurar especificamente por elementos com as classes exatas do React compilado
    const reactElements = document.querySelectorAll(
      "div, span, button, nav, ul, li",
    );

    for (const element of reactElements) {
      const text = element.textContent?.toLowerCase() || "";
      const exactText = element.textContent?.trim() || "";

      // Remover elementos que contenham exatamente os textos problemáticos
      if (
        exactText === "Diagnóstico" ||
        exactText === "Administração" ||
        exactText === "Diagnóstico de Sincronização" ||
        text.includes("diagnóstico de emergência") ||
        text.includes("diagnóstico do sistema")
      ) {
        console.log(`🗑️ SIDEBAR: Removendo elemento exato "${exactText}"`);

        // Aplicar múltiplas estratégias de ocultação
        element.style.display = "none !important";
        element.style.visibility = "hidden !important";
        element.style.opacity = "0 !important";
        element.style.height = "0 !important";
        element.style.overflow = "hidden !important";
        element.style.maxHeight = "0 !important";
        element.setAttribute("hidden", "true");

        // Também esconder containers pais que possam ser seções completas
        let parent = element.parentElement;
        for (let i = 0; i < 8; i++) {
          if (!parent) break;

          const parentText = parent.textContent?.toLowerCase() || "";
          const parentExactText = parent.textContent?.trim() || "";

          // Se o pai contém apenas este elemento problemático, esconder o pai também
          if (
            parent.children.length <= 3 &&
            (parentText.includes("diagnóstico") ||
              parentText.includes("administração")) &&
            !parentText.includes("configurações") &&
            !parentText.includes("obras") &&
            !parentText.includes("utilizadores")
          ) {
            console.log(
              `🗑️ SIDEBAR: Removendo container pai "${parentExactText.substring(0, 50)}..."`,
            );
            parent.style.display = "none !important";
            parent.style.visibility = "hidden !important";
            parent.style.opacity = "0 !important";
            parent.style.height = "0 !important";
            parent.style.overflow = "hidden !important";
            parent.setAttribute("hidden", "true");
            removed++;
            break;
          }

          parent = parent.parentElement;
        }

        removed++;
      }

      // Procurar por elementos que contenham texto problemático mas não configurações
      else if (
        (text.includes("diagnóstico") || text.includes("administração")) &&
        !text.includes("configurações") &&
        !text.includes("obras") &&
        !text.includes("utilizadores") &&
        !text.includes("notificações")
      ) {
        // Se é um elemento pequeno (provavelmente só texto), esconder o pai
        if (
          element.children.length === 0 &&
          element.textContent?.trim().length < 80
        ) {
          let parent = element.parentElement;
          for (let i = 0; i < 6; i++) {
            if (!parent) break;

            const parentChildren = parent.children.length;
            const parentText = parent.textContent?.toLowerCase() || "";

            if (
              parent.tagName === "DIV" &&
              parentChildren >= 1 &&
              parentChildren <= 5 &&
              (parentText.includes("diagnóstico") ||
                parentText.includes("administração"))
            ) {
              console.log(
                `🗑️ SIDEBAR: Removendo container pai de "${element.textContent?.substring(0, 30)}..."`,
              );
              parent.style.display = "none !important";
              parent.style.visibility = "hidden !important";
              parent.style.opacity = "0 !important";
              parent.style.height = "0 !important";
              parent.style.overflow = "hidden !important";
              parent.setAttribute("hidden", "true");
              removed++;
              break;
            }
            parent = parent.parentElement;
          }
        } else {
          console.log(
            `🗑️ SIDEBAR: Removendo elemento "${element.textContent?.substring(0, 50)}..."`,
          );
          element.style.display = "none !important";
          element.style.visibility = "hidden !important";
          element.style.opacity = "0 !important";
          element.style.height = "0 !important";
          element.style.overflow = "hidden !important";
          element.setAttribute("hidden", "true");
          removed++;
        }
      }
    }

    return removed;
  }

  // Função mais agressiva - remover por posição no sidebar
  function removeByPosition() {
    // Procurar pelo sidebar com múltiplas estratégias
    const sidebarSelectors = [
      '[data-loc*="Sidebar"]',
      "nav",
      ".sidebar",
      '[class*="sidebar"]',
      "aside",
      '[role="navigation"]',
    ];

    for (const selector of sidebarSelectors) {
      const sidebarElements = document.querySelectorAll(selector);

      for (const sidebar of sidebarElements) {
        // Procurar por seções que contenham os termos problemáticos
        const sections = sidebar.querySelectorAll("div, section, ul, li, nav");

        for (const section of sections) {
          const sectionText = section.textContent?.toLowerCase() || "";
          const exactText = section.textContent?.trim() || "";

          if (
            exactText === "Diagnóstico" ||
            exactText === "Administração" ||
            (sectionText.includes("diagnóstico") &&
              !sectionText.includes("configurações")) ||
            (sectionText.includes("administração") &&
              !sectionText.includes("configurações"))
          ) {
            console.log(`🗑️ SIDEBAR: Removendo seção completa no sidebar`);
            section.style.display = "none !important";
            section.style.visibility = "hidden !important";
            section.style.opacity = "0 !important";
            section.style.height = "0 !important";
            section.style.overflow = "hidden !important";
            section.setAttribute("hidden", "true");
          }
        }
      }
    }
  }

  // Função especial para remover elementos React renderizados
  function removeReactElements() {
    // Procurar por elementos React com textContent específico
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: function (node) {
          const text = node.textContent?.trim() || "";
          if (
            text === "Diagnóstico" ||
            text === "Administração" ||
            text === "Diagnóstico de Sincronização" ||
            text.includes("Diagnóstico de Emergência") ||
            text.includes("Diagnóstico do Sistema")
          ) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        },
      },
    );

    const elementsToRemove = [];
    let node;
    while ((node = walker.nextNode())) {
      elementsToRemove.push(node);
    }

    for (const element of elementsToRemove) {
      console.log(
        `🗑️ SIDEBAR: Removendo elemento React "${element.textContent?.substring(0, 50)}..."`,
      );

      // Múltiplas estratégias de remoção
      element.style.display = "none !important";
      element.style.visibility = "hidden !important";
      element.style.opacity = "0 !important";
      element.style.height = "0 !important";
      element.style.maxHeight = "0 !important";
      element.style.overflow = "hidden !important";
      element.setAttribute("hidden", "true");
      element.setAttribute("aria-hidden", "true");

      // Tentar remover do DOM se possível
      try {
        element.remove();
      } catch (e) {
        // Se não conseguir remover, pelo menos esconder completamente
        element.innerHTML = "";
      }
    }
  }

  // Remover estilos inline que possam restaurar visibilidade
  function ensureHidden() {
    const problemTexts = [
      "diagnóstico",
      "administração",
      "diagnostic",
      "administration",
    ];

    const allElements = document.querySelectorAll("*");
    for (const element of allElements) {
      const text = element.textContent?.toLowerCase() || "";

      for (const problemText of problemTexts) {
        if (text.includes(problemText) && !text.includes("configurações")) {
          element.style.display = "none !important";
          element.style.visibility = "hidden !important";
          element.style.opacity = "0 !important";
          element.style.height = "0 !important";
          element.style.maxHeight = "0 !important";
          element.style.overflow = "hidden !important";
          element.setAttribute("hidden", "true");
          element.setAttribute("aria-hidden", "true");
          break;
        }
      }
    }
  }

  // Executar remoção
  function executeRemoval() {
    try {
      const removed1 = removeSidebarSections();
      const removed2 = removeByCSS();
      removeByPosition();
      ensureHidden();

      const totalRemoved = removed1 + removed2;

      if (totalRemoved > 0) {
        console.log(
          `✅ SIDEBAR: ${totalRemoved} elementos removidos com sucesso`,
        );
      } else {
        console.log(`⚠️ SIDEBAR: Nenhum elemento encontrado para remover`);
      }
    } catch (error) {
      console.error("❌ SIDEBAR: Erro ao remover seções:", error);
    }
  }

  // Executar múltiplas vezes para garantir remoção
  function scheduleRemoval() {
    // Executar imediatamente
    executeRemoval();

    // Executar após 2 segundos
    setTimeout(executeRemoval, 2000);

    // Executar após 5 segundos
    setTimeout(executeRemoval, 5000);

    // Monitor contínuo por 30 segundos
    const monitor = setInterval(() => {
      executeRemoval();
    }, 3000);

    setTimeout(() => {
      clearInterval(monitor);
      console.log("🗑️ SIDEBAR: Monitor de remoção finalizado");
    }, 30000);
  }

  // Aguardar DOM estar pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleRemoval);
  } else {
    // Aguardar um pouco para a aplicação carregar
    setTimeout(scheduleRemoval, 1000);
  }

  console.log("🗑️ SIDEBAR: Sistema de remoção iniciado");
})();
