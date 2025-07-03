// Script direto para adicionar ícone de definições no login
console.log("🎯 Script direto para ícone de login iniciado");

function createSettingsIcon() {
  // Remover ícone existente se houver
  const existing = document.getElementById("direct-settings-icon");
  if (existing) {
    existing.remove();
  }

  console.log("➕ Criando ícone de definições direto");

  // Criar container do ícone
  const iconContainer = document.createElement("div");
  iconContainer.id = "direct-settings-icon";
  iconContainer.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="m12 1 1.38 3.5a5 5 0 0 0 3.12 3.12L20 9l-3.5 1.38a5 5 0 0 0-3.12 3.12L12 17l-1.38-3.5a5 5 0 0 0-3.12-3.12L4 9l3.5-1.38a5 5 0 0 0 3.12-3.12L12 1Z"></path>
    </svg>
  `;

  // Aplicar estilos
  iconContainer.style.cssText = `
    position: fixed !important;
    top: 30px !important;
    right: 30px !important;
    width: 60px !important;
    height: 60px !important;
    background: linear-gradient(135deg, #007784 0%, #005f6a 100%) !important;
    border: 3px solid rgba(255, 255, 255, 0.2) !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    z-index: 999999 !important;
    color: white !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 8px 25px rgba(0, 119, 132, 0.4) !important;
    backdrop-filter: blur(10px) !important;
  `;

  // Efeitos hover
  iconContainer.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.15) rotate(90deg) !important";
    this.style.boxShadow = "0 12px 35px rgba(0, 119, 132, 0.6) !important";
    this.style.background =
      "linear-gradient(135deg, #009eb3 0%, #007784 100%) !important";
  });

  iconContainer.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1) rotate(0deg) !important";
    this.style.boxShadow = "0 8px 25px rgba(0, 119, 132, 0.4) !important";
    this.style.background =
      "linear-gradient(135deg, #007784 0%, #005f6a 100%) !important";
  });

  // Click handler direto para admin.html
  iconContainer.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    console.log(
      "🔧 Ícone de definições clicado - redirecionando para administração",
    );

    // Feedback visual imediato
    this.style.transform = "scale(0.9) !important";
    this.style.background =
      "linear-gradient(135deg, #00ff00 0%, #00cc00 100%) !important";

    // Redirecionar para admin após feedback
    setTimeout(() => {
      const adminUrl = `${window.location.origin}/admin`;
      console.log("🚀 Redirecionando para:", adminUrl);

      // Tentar abrir em nova aba primeiro
      try {
        const newWindow = window.open(
          adminUrl,
          "_blank",
          "noopener,noreferrer",
        );
        if (newWindow) {
          console.log("✅ Nova aba aberta com sucesso");
        } else {
          // Se popup foi bloqueado, navegar na mesma aba
          console.log("⚠️ Popup bloqueado, navegando na mesma aba");
          window.location.href = adminUrl;
        }
      } catch (error) {
        console.error("❌ Erro ao abrir:", error);
        // Fallback: navegação direta
        window.location.href = adminUrl;
      }
    }, 200);
  });

  // Tooltip
  iconContainer.title =
    "⚙️ Definições e Administração\nClique para aceder ao painel de controlo";

  // Adicionar ao DOM
  document.body.appendChild(iconContainer);

  console.log("✅ Ícone de definições criado com sucesso");
  return true;
}

// Função para verificar se estamos no login
function isOnLoginPage() {
  return (
    window.location.pathname.includes("/login") ||
    document.querySelector('input[type="email"]') ||
    document.querySelector('[data-loc*="Login.tsx"]') ||
    document.body.textContent.includes("Email de acesso") ||
    document.body.textContent.includes("Palavra-passe")
  );
}

// Executar quando estiver no login
function checkAndCreateIcon() {
  if (isOnLoginPage()) {
    console.log("📱 Página de login confirmada - criando ícone");
    createSettingsIcon();
  } else {
    console.log("❌ Não estamos no login");
    // Remover ícone se existir
    const existing = document.getElementById("direct-settings-icon");
    if (existing) {
      existing.remove();
      console.log("🗑️ Ícone removido - não estamos no login");
    }
  }
}

// Execução imediata após 1 segundo
setTimeout(() => {
  console.log("🚀 Executando verificação inicial...");
  checkAndCreateIcon();
}, 1000);

// Execução adicional após 3 segundos para garantir
setTimeout(() => {
  console.log("🔄 Verificação adicional...");
  checkAndCreateIcon();
}, 3000);

// Observer para mudanças na página
const pageObserver = new MutationObserver((mutations) => {
  let shouldCheck = false;

  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const text = node.textContent || "";
          if (
            text.includes("Login") ||
            text.includes("Email") ||
            text.includes("Palavra-passe")
          ) {
            shouldCheck = true;
          }
        }
      });
    }
  });

  if (shouldCheck) {
    setTimeout(checkAndCreateIcon, 500);
  }
});

// Iniciar observação
pageObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

// Verificar mudanças de URL
let lastUrl = window.location.href;
setInterval(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    console.log("🔄 URL mudou, verificando página...");
    setTimeout(checkAndCreateIcon, 500);
  }
}, 1000);

console.log("✅ Script direto de ícone de login configurado");
