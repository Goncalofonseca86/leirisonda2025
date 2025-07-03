// Script de teste direto para ícone de login
console.log("🧪 Script de teste para ícone de login iniciado");

// Esperar 3 segundos e procurar todos os SVGs
setTimeout(() => {
  console.log("🔍 Procurando todos os SVGs na página...");

  const allSVGs = document.querySelectorAll("svg");
  console.log(`📊 Total de SVGs encontrados: ${allSVGs.length}`);

  allSVGs.forEach((svg, index) => {
    console.log(`\n--- SVG ${index + 1} ---`);
    console.log("HTML:", svg.outerHTML.substring(0, 200) + "...");
    console.log("Parent:", svg.parentElement?.tagName);
    console.log(
      "Classes:",
      svg.className?.baseVal || svg.classList?.toString(),
    );

    // Verificar se tem título relacionado com settings
    const title =
      svg.getAttribute("title") ||
      svg.closest("[title]")?.getAttribute("title");
    if (title) {
      console.log("Título:", title);

      if (title.includes("Definições") || title.includes("Administração")) {
        console.log("🎯 ENCONTRADO! Este é o ícone de definições!");

        // Aplicar click handler
        const clickableElement = svg.closest("div") || svg.parentElement || svg;

        clickableElement.style.cursor = "pointer";
        clickableElement.style.border = "3px solid red";
        clickableElement.style.borderRadius = "50%";

        clickableElement.onclick = function (e) {
          e.preventDefault();
          e.stopPropagation();

          alert("Ícone de definições clicado! A abrir administração...");

          // Abrir admin
          const adminUrl = `${window.location.origin}/admin.html`;
          console.log("🔗 Abrindo:", adminUrl);

          try {
            const newWindow = window.open(adminUrl, "_blank");
            if (!newWindow) {
              window.location.href = adminUrl;
            }
          } catch (error) {
            console.error("Erro:", error);
            window.location.href = adminUrl;
          }
        };

        console.log("✅ Click handler aplicado!");
      }
    }

    // Verificar paths do SVG
    const paths = svg.querySelectorAll("path");
    paths.forEach((path, pathIndex) => {
      const d = path.getAttribute("d");
      if (d && d.includes("12.22")) {
        console.log(
          `🔧 Path ${pathIndex} parece ser de configurações:`,
          d.substring(0, 50) + "...",
        );
      }
    });
  });

  // Se não encontrar nada, criar ícone próprio
  if (allSVGs.length === 0) {
    console.log("❌ Nenhum SVG encontrado, criando ícone próprio...");
    createTestIcon();
  }
}, 3000);

function createTestIcon() {
  const testIcon = document.createElement("div");
  testIcon.id = "test-settings-icon";
  testIcon.innerHTML = "⚙️";
  testIcon.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: red;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    z-index: 99999;
    border: 3px solid yellow;
  `;

  testIcon.onclick = function () {
    alert("Ícone de teste clicado! A abrir admin...");
    window.open("/admin.html", "_blank");
  };

  document.body.appendChild(testIcon);
  console.log("✅ Ícone de teste criado!");
}

console.log("🧪 Script de teste configurado - aguardando 3 segundos...");
