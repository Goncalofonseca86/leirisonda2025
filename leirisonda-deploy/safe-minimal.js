// SAFE MINIMAL - Script seguro sem erros de querySelector

console.log("🔧 SAFE: Script seguro iniciado...");

// Remover qualquer overlay existente
function removeOverlay() {
  const overlay = document.getElementById("leirisonda-overlay");
  if (overlay) {
    overlay.remove();
    console.log("🗑️ SAFE: Overlay removido");
  }
}

// Procurar e modificar elementos do menu
function modifyMenuElements() {
  console.log("🔍 SAFE: Procurando elementos do menu...");

  let modificacoes = 0;

  // Procurar por todos os elementos
  const allElements = document.querySelectorAll("*");

  for (const element of allElements) {
    try {
      const text = element.textContent ? element.textContent.trim() : "";

      // Remover DIAGNÓSTICO
      if (text === "DIAGNÓSTICO") {
        console.log("🗑️ SAFE: Removendo DIAGNÓSTICO");

        element.style.setProperty("display", "none", "important");
        element.style.setProperty("visibility", "hidden", "important");
        element.style.setProperty("height", "0px", "important");
        element.style.setProperty("overflow", "hidden", "important");

        // Verificar container pai
        const parent = element.parentElement;
        if (
          parent &&
          parent.textContent &&
          parent.textContent.trim().length < 100
        ) {
          if (parent.textContent.includes("DIAGNÓSTICO")) {
            parent.style.setProperty("display", "none", "important");
            parent.style.setProperty("visibility", "hidden", "important");
          }
        }

        modificacoes++;
      }

      // Destacar ADMINISTRAÇÃO
      if (text === "ADMINISTRAÇÃO") {
        console.log("⭐ SAFE: Destacando ADMINISTRAÇÃO");

        // Encontrar container apropriado
        let container = element.parentElement;
        let found = false;

        for (let i = 0; i < 5 && container && !found; i++) {
          const containerText = container.textContent
            ? container.textContent.trim()
            : "";

          if (
            containerText.length < 150 &&
            containerText.includes("ADMINISTRAÇÃO")
          ) {
            // Aplicar estilos de destaque
            container.style.setProperty(
              "background",
              "linear-gradient(135deg, #fff3cd, #ffeaa7)",
              "important",
            );
            container.style.setProperty(
              "border",
              "2px solid #f39c12",
              "important",
            );
            container.style.setProperty("border-radius", "8px", "important");
            container.style.setProperty("padding", "12px", "important");
            container.style.setProperty("margin", "4px", "important");
            container.style.setProperty(
              "box-shadow",
              "0 2px 4px rgba(243,156,18,0.3)",
              "important",
            );

            // Modificar texto
            element.innerHTML = "⭐ ADMINISTRAÇÃO (EXPANDIDA)";
            element.style.setProperty("font-weight", "bold", "important");
            element.style.setProperty("color", "#8b4513", "important");

            modificacoes++;
            found = true;
          }

          container = container.parentElement;
        }
      }
    } catch (error) {
      // Ignorar erros em elementos específicos
      continue;
    }
  }

  return modificacoes;
}

// Mostrar notificação de sucesso
function showSuccessNotification(count) {
  if (count === 0) return;

  try {
    const notification = document.createElement("div");

    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.background = "#28a745";
    notification.style.color = "white";
    notification.style.padding = "12px 16px";
    notification.style.borderRadius = "8px";
    notification.style.fontSize = "14px";
    notification.style.fontWeight = "600";
    notification.style.zIndex = "10000";
    notification.style.maxWidth = "300px";
    notification.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";

    notification.innerHTML = `✅ ${count} alterações aplicadas:<br>• Menu modificado conforme solicitado`;

    document.body.appendChild(notification);

    // Remover após 5 segundos
    setTimeout(() => {
      try {
        if (notification.parentElement) {
          notification.remove();
        }
      } catch (e) {
        // Ignorar erro se elemento já foi removido
      }
    }, 5000);
  } catch (error) {
    console.log("Erro ao criar notificação:", error);
  }
}

// Função principal
function executeSafeModifications() {
  console.log("🚀 SAFE: Executando modificações...");

  try {
    // Remover overlay primeiro
    removeOverlay();

    // Aguardar um pouco e então modificar
    setTimeout(() => {
      const count = modifyMenuElements();

      if (count > 0) {
        console.log(`✅ SAFE: ${count} modificações aplicadas com sucesso`);
        showSuccessNotification(count);
      } else {
        console.log("⚠️ SAFE: Nenhum elemento encontrado ainda");

        // Tentar novamente em 5 segundos se não encontrou nada
        setTimeout(() => {
          const retryCount = modifyMenuElements();
          if (retryCount > 0) {
            showSuccessNotification(retryCount);
          }
        }, 5000);
      }
    }, 2000);
  } catch (error) {
    console.error("❌ SAFE: Erro durante execução:", error);
  }
}

// Inicializar
try {
  // Executar imediatamente
  executeSafeModifications();

  // Executar novamente após 10 segundos
  setTimeout(executeSafeModifications, 10000);

  // Executar uma última vez após 20 segundos
  setTimeout(executeSafeModifications, 20000);
} catch (error) {
  console.error("❌ SAFE: Erro na inicialização:", error);
}

console.log("🔧 SAFE: Sistema seguro configurado");
