// Script simples que roda a cada segundo para modificar o menu
console.log("🔄 Script simples iniciado - roda constantemente");

function simpleModify() {
  try {
    // Procura todos os elementos da página
    const elements = document.querySelectorAll("*");

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const text = element.textContent || "";

      // Se encontrar DIAGNÓSTICO exatamente, esconde
      if (text.trim() === "DIAGNÓSTICO") {
        element.style.display = "none";
        console.log("🗑️ DIAGNÓSTICO escondido");
      }

      // Se encontrar ADMINISTRAÇÃO exatamente, destaca
      if (text.trim() === "ADMINISTRAÇÃO") {
        element.style.background =
          "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)";
        element.style.borderRadius = "12px";
        element.style.padding = "16px";
        element.style.margin = "8px";
        element.style.color = "#1f2937";
        element.style.fontWeight = "bold";
        console.log("⭐ ADMINISTRAÇÃO destacada");
      }
    }
  } catch (e) {
    // Ignora erros
  }
}

// Roda a cada 1 segundo
setInterval(simpleModify, 1000);

// Roda também imediatamente
simpleModify();
