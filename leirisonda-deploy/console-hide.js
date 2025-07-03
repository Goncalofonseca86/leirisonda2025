// CONSOLE HIDE - Para executar manualmente na consola se necessário

console.log("🔧 CONSOLE: Executando remoção manual...");

// Função para executar na consola
function hideSidebarSections() {
  let count = 0;

  // Encontrar todos os spans com o texto exato
  const allElements = document.querySelectorAll("*");

  for (const element of allElements) {
    const text = element.textContent?.trim();

    if (text === "Diagnóstico" || text === "Administração") {
      console.log(`Escondendo: "${text}"`);

      // Esconder o elemento
      element.style.display = "none !important";
      element.style.visibility = "hidden !important";

      // Esconder o pai também se contém apenas este texto
      let parent = element.parentElement;
      while (parent && parent !== document.body) {
        const parentText = parent.textContent?.trim();
        if (
          parentText &&
          parentText.length < 100 &&
          (parentText.includes("Diagnóstico") ||
            parentText.includes("Administração"))
        ) {
          parent.style.display = "none !important";
          parent.style.visibility = "hidden !important";
          count++;
          break;
        }
        parent = parent.parentElement;
      }
    }
  }

  console.log(`✅ ${count} elementos escondidos`);

  // Verificar se ainda há elementos visíveis
  setTimeout(() => {
    const stillVisible = [];
    const spans = document.querySelectorAll("span");
    for (const span of spans) {
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
      console.log(`⚠️ Ainda ${stillVisible.length} elementos visíveis`);
      for (const el of stillVisible) {
        el.style.display = "none !important";
        if (el.parentElement) {
          el.parentElement.style.display = "none !important";
        }
      }
    } else {
      console.log("✅ Todos os elementos foram escondidos com sucesso");
    }
  }, 1000);
}

// Executar automaticamente
hideSidebarSections();

// Disponibilizar função global para uso manual
window.hideSidebarSections = hideSidebarSections;

console.log("🔧 Para executar manualmente: hideSidebarSections()");
