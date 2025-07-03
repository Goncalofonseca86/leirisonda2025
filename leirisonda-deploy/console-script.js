// SCRIPT PARA CONSOLA - Copia e cola isto na consola do browser (F12)

console.log("🎯 CONSOLA: Executando modificações do menu...");

// Função principal
function modificarMenu() {
  let modificacoes = 0;

  // 1. Encontrar e esconder DIAGNÓSTICO
  const elementos = document.querySelectorAll("*");

  for (let elemento of elementos) {
    const texto = elemento.textContent?.trim();

    // Esconder DIAGNÓSTICO
    if (texto === "DIAGNÓSTICO") {
      console.log("🗑️ Escondendo DIAGNÓSTICO");
      elemento.style.display = "none !important";
      elemento.style.visibility = "hidden !important";
      elemento.style.height = "0px !important";
      elemento.style.overflow = "hidden !important";

      // Esconder também o pai se necessário
      let pai = elemento.parentElement;
      if (pai && pai.textContent?.trim().length < 50) {
        pai.style.display = "none !important";
        pai.style.visibility = "hidden !important";
      }
      modificacoes++;
    }

    // Destacar ADMINISTRAÇÃO
    if (texto === "ADMINISTRAÇÃO") {
      console.log("⭐ Destacando ADMINISTRAÇÃO");

      // Encontrar container do item
      let container = elemento;
      for (let i = 0; i < 5; i++) {
        container = container.parentElement;
        if (!container) break;

        if (
          container.textContent?.includes("ADMINISTRAÇÃO") &&
          container.textContent?.length < 100
        ) {
          // Aplicar estilos especiais
          container.style.background =
            "linear-gradient(135deg, #fff3cd, #ffeaa7) !important";
          container.style.border = "3px solid #f39c12 !important";
          container.style.borderRadius = "12px !important";
          container.style.padding = "16px !important";
          container.style.margin = "8px !important";
          container.style.boxShadow =
            "0 4px 8px rgba(243,156,18,0.3) !important";

          // Modificar o texto
          elemento.innerHTML = "⭐ ADMINISTRAÇÃO (EXPANDIDA)";
          elemento.style.fontWeight = "bold !important";
          elemento.style.color = "#8b4513 !important";

          modificacoes++;
          break;
        }
      }
    }
  }

  // Mostrar resultado
  if (modificacoes > 0) {
    alert(
      `✅ Sucesso! ${modificacoes} modificações aplicadas:\n• DIAGNÓSTICO removido\n• ADMINISTRAÇÃO destacada`,
    );
  } else {
    alert("❌ Nenhuma modificação feita. Elementos não encontrados.");
  }

  console.log(`📊 Total de modificações: ${modificacoes}`);
}

// Executar a função
modificarMenu();

// Também disponibilizar para execução manual
window.modificarMenu = modificarMenu;

console.log(
  "✅ Script carregado! Podes executar 'modificarMenu()' novamente se necessário.",
);
