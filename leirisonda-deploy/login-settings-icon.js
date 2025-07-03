// Script para adicionar ícone de definições na página de login
console.log("🔧 Script de ícone de definições no login iniciado");

// Função para verificar se estamos na página de login
function isLoginPage() {
  return (
    window.location.pathname.includes("/login") ||
    document.querySelector('input[type="email"]') ||
    document.querySelector('input[type="password"]') ||
    document.body.textContent.includes("Iniciar Sessão") ||
    document.body.textContent.includes("Login") ||
    document.body.textContent.includes("Email") ||
    document.body.textContent.includes("Palavra-passe")
  );
}

// Função para adicionar o ícone de definições
function addSettingsIcon() {
  // Verificar se já existe o ícone ou se existe um ícone SVG com settings
  let existingIcon = document.getElementById("login-settings-icon");

  // Procurar por ícones SVG existentes que possam ser de settings
  if (!existingIcon) {
    const svgIcons = document.querySelectorAll("svg");
    svgIcons.forEach((svg) => {
      const paths = svg.querySelectorAll("path");
      paths.forEach((path) => {
        const d = path.getAttribute("d");
        // Verificar se é o ícone de configurações pela signature do path
        if (d && d.includes("M12.22 2h-.44a2 2 0")) {
          existingIcon = svg.closest("div");
          if (existingIcon) {
            existingIcon.id = "login-settings-icon";
            console.log(
              "🔍 Encontrei ícone SVG existente, aplicando funcionalidade",
            );
          }
        }
      });
    });
  }

  if (existingIcon) {
    // Aplicar estilos e click handler ao ícone existente
    applyIconFunctionality(existingIcon);
    return true;
  }

  console.log("➕ Criando novo ícone de definições no login");

  // Criar o ícone de definições
  const settingsIcon = document.createElement("div");
  settingsIcon.id = "login-settings-icon";
  settingsIcon.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `;

  // Estilo do ícone
  settingsIcon.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
    background: rgba(0, 119, 132, 0.1);
    border: 2px solid rgba(0, 119, 132, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 9999;
    color: #007784;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  `;

  // Efeitos hover
  settingsIcon.addEventListener("mouseenter", function () {
    this.style.background = "rgba(0, 119, 132, 0.2)";
    this.style.transform = "scale(1.1)";
    this.style.boxShadow = "0 6px 20px rgba(0, 119, 132, 0.3)";
  });

  settingsIcon.addEventListener("mouseleave", function () {
    this.style.background = "rgba(0, 119, 132, 0.1)";
    this.style.transform = "scale(1)";
    this.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
  });

  // Click handler para abrir administração
  settingsIcon.addEventListener("click", function () {
    console.log("🔧 Click em definições no login - abrindo administração");

    // Feedback visual
    this.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.style.transform = "scale(1)";
    }, 150);

    // Abrir página de administração
    const adminUrls = [
      `${window.location.origin}/admin.html`,
      `${window.location.origin}/test-admin.html`,
    ];

    let opened = false;
    for (const url of adminUrls) {
      try {
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) {
          console.log("✅ Administração aberta:", url);
          opened = true;
          break;
        }
      } catch (error) {
        console.error("Erro ao abrir:", url, error);
      }
    }

    if (!opened) {
      console.log("⚠️ Tentando navegação direta...");
      window.location.href = adminUrls[0];
    }
  });

  // Tooltip
  settingsIcon.title = "Definições e Administração";

  // Adicionar ao body
  document.body.appendChild(settingsIcon);

  console.log("✅ Ícone de definições adicionado ao login");

  return true;
}

// Função para aplicar funcionalidade a um ícone existente
function applyIconFunctionality(iconElement) {
  console.log("🔧 Aplicando funcionalidade ao ícone existente");

  // Garantir que tem os estilos corretos
  iconElement.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    width: 48px !important;
    height: 48px !important;
    background: rgba(0, 119, 132, 0.1) !important;
    border: 2px solid rgba(0, 119, 132, 0.3) !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    z-index: 9999 !important;
    color: #007784 !important;
    transition: all 0.3s ease !important;
    backdrop-filter: blur(10px) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  `;

  // Remover listeners anteriores
  iconElement.onclick = null;
  iconElement.onmouseenter = null;
  iconElement.onmouseleave = null;

  // Efeitos hover
  iconElement.addEventListener("mouseenter", function () {
    this.style.background = "rgba(0, 119, 132, 0.3) !important";
    this.style.transform = "scale(1.1) !important";
    this.style.boxShadow = "0 6px 20px rgba(0, 119, 132, 0.4) !important";
  });

  iconElement.addEventListener("mouseleave", function () {
    this.style.background = "rgba(0, 119, 132, 0.1) !important";
    this.style.transform = "scale(1) !important";
    this.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1) !important";
  });

  // Click handler para abrir administração
  iconElement.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("🔧 Click em definições no login - abrindo administração");

    // Feedback visual
    this.style.transform = "scale(0.9) !important";
    this.style.background = "rgba(0, 255, 0, 0.3) !important";

    setTimeout(() => {
      this.style.transform = "scale(1) !important";
      this.style.background = "rgba(0, 119, 132, 0.1) !important";
    }, 200);

    // Abrir página de administração
    const adminUrls = [
      `${window.location.origin}/admin.html`,
      `${window.location.origin}/test-admin.html`,
    ];

    let opened = false;
    for (const url of adminUrls) {
      try {
        console.log("🔗 Tentando abrir:", url);
        const newWindow = window.open(url, "_blank", "noopener,noreferrer");
        if (newWindow) {
          console.log("✅ Administração aberta:", url);
          opened = true;

          // Mostrar feedback de sucesso
          this.style.background = "rgba(0, 255, 0, 0.3) !important";
          setTimeout(() => {
            this.style.background = "rgba(0, 119, 132, 0.1) !important";
          }, 1000);

          break;
        }
      } catch (error) {
        console.error("Erro ao abrir:", url, error);
      }
    }

    if (!opened) {
      console.log("⚠️ Popup bloqueado, tentando navegação direta...");
      try {
        window.location.href = adminUrls[0];
      } catch (error) {
        alert(
          "Erro ao abrir administração. Tente desabilitar o bloqueador de popups.",
        );
      }
    }
  });

  // Tooltip
  iconElement.title = "Clique para aceder às Definições e Administração";

  console.log("✅ Funcionalidade aplicada ao ícone existente");
}

// Função para verificar e adicionar o ícone quando necessário
function checkAndAddIcon() {
  if (isLoginPage()) {
    console.log("📱 Página de login detectada");
    const success = addSettingsIcon();

    // Se não conseguiu criar/encontrar ícone, tentar abordagem mais agressiva
    if (!success) {
      setTimeout(() => {
        console.log("🔄 Segunda tentativa de adicionar ícone...");
        forceAddIcon();
      }, 2000);
    }
  }
}

// Função para forçar adição do ícone
function forceAddIcon() {
  // Procurar por qualquer SVG na página
  const allSVGs = document.querySelectorAll("svg");
  console.log(`🔍 Encontrados ${allSVGs.length} SVGs na página`);

  allSVGs.forEach((svg, index) => {
    console.log(`SVG ${index}:`, svg.outerHTML.substring(0, 100) + "...");

    // Verificar se é um ícone de settings
    const paths = svg.querySelectorAll("path");
    paths.forEach((path) => {
      const d = path.getAttribute("d");
      if (
        d &&
        (d.includes("M12.22 2h-.44a2 2 0") || d.includes("12.22 2h-.44a2 2 0"))
      ) {
        console.log("🎯 Encontrado ícone de configurações!");
        const container = svg.closest("div") || svg.parentElement;
        if (container) {
          container.id = "login-settings-icon-forced";
          applyIconFunctionality(container);
        }
      }
    });
  });
}

// Execução imediata
setTimeout(checkAndAddIcon, 1000);

// Execução adicional para garantir
setTimeout(checkAndAddIcon, 3000);

// Observer para detectar mudanças na página
const loginObserver = new MutationObserver((mutations) => {
  let shouldCheck = false;

  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const text = node.textContent || "";
          if (
            text.includes("Login") ||
            text.includes("Email") ||
            text.includes("Palavra-passe") ||
            text.includes("Iniciar")
          ) {
            shouldCheck = true;
          }
        }
      });
    }
  });

  if (shouldCheck) {
    setTimeout(checkAndAddIcon, 500);
  }
});

// Iniciar observação
loginObserver.observe(document.body, {
  childList: true,
  subtree: true,
});

// Observer para mudanças de rota
let currentPath = window.location.pathname;
setInterval(() => {
  if (window.location.pathname !== currentPath) {
    currentPath = window.location.pathname;
    console.log("🔄 Rota mudou para:", currentPath);

    // Remover ícone se não estivermos no login
    if (!isLoginPage()) {
      const existingIcon = document.getElementById("login-settings-icon");
      if (existingIcon) {
        existingIcon.remove();
        console.log("🗑️ Ícone removido - não estamos no login");
      }
    } else {
      // Adicionar ícone se estivermos no login
      setTimeout(checkAndAddIcon, 500);
    }
  }
}, 1000);

// Parar observer após 5 minutos
setTimeout(() => {
  loginObserver.disconnect();
  console.log("🛑 Observer do login desconectado");
}, 300000);

console.log("✅ Script de ícone de definições no login configurado");
