// Script garantido para modal de definições DENTRO da app
console.log("🎯 Script de modal interno iniciado");

// Função para criar ícone de definições
function createInAppSettingsIcon() {
  // Remover ícone existente
  const existing = document.getElementById("in-app-settings-icon");
  if (existing) {
    existing.remove();
  }

  console.log("➕ Criando ícone de definições interno");

  // Criar ícone
  const icon = document.createElement("div");
  icon.id = "in-app-settings-icon";
  icon.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="m12 1 1.38 3.5a5 5 0 0 0 3.12 3.12L20 9l-3.5 1.38a5 5 0 0 0-3.12 3.12L12 17l-1.38-3.5a5 5 0 0 0-3.12-3.12L4 9l3.5-1.38a5 5 0 0 0 3.12-3.12L12 1Z"></path>
    </svg>
  `;

  // Estilos do ícone
  icon.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    width: 50px !important;
    height: 50px !important;
    background: linear-gradient(135deg, #007784 0%, #005f6a 100%) !important;
    border: 2px solid rgba(255, 255, 255, 0.3) !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    z-index: 99999 !important;
    color: white !important;
    transition: all 0.3s ease !important;
    box-shadow: 0 4px 15px rgba(0, 119, 132, 0.4) !important;
  `;

  // Hover effect
  icon.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.1) rotate(90deg)";
    this.style.boxShadow = "0 6px 20px rgba(0, 119, 132, 0.6)";
  });

  icon.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1) rotate(0deg)";
    this.style.boxShadow = "0 4px 15px rgba(0, 119, 132, 0.4)";
  });

  // Click handler - GARANTIR que não redireciona
  icon.addEventListener("click", function (e) {
    // PARAR TUDO para evitar redirecionamentos
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    console.log("🔧 Click no ícone - criando modal DENTRO da app");

    // Feedback visual
    this.style.background = "linear-gradient(135deg, #00ff00 0%, #00cc00 100%)";
    setTimeout(() => {
      this.style.background =
        "linear-gradient(135deg, #007784 0%, #005f6a 100%)";
    }, 300);

    // Criar modal IMEDIATAMENTE
    createInAppModal();
  });

  // Adicionar ao DOM
  document.body.appendChild(icon);
  console.log("✅ Ícone interno criado");
}

// Função para criar modal DENTRO da aplicação
function createInAppModal() {
  // Remover modal existente
  const existing = document.getElementById("in-app-modal");
  if (existing) {
    existing.remove();
  }

  console.log("📱 Criando modal DENTRO da aplicação");

  // Criar overlay
  const overlay = document.createElement("div");
  overlay.id = "in-app-modal";
  overlay.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: rgba(0, 0, 0, 0.8) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 999999 !important;
    backdrop-filter: blur(5px) !important;
  `;

  // Prevenir propagação de clicks
  overlay.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // Fechar modal se clicar no overlay
    if (e.target === this) {
      this.remove();
    }
  });

  // Criar conteúdo do modal
  const content = document.createElement("div");
  content.style.cssText = `
    background: white !important;
    border-radius: 15px !important;
    padding: 25px !important;
    max-width: 450px !important;
    width: 90% !important;
    max-height: 80vh !important;
    overflow-y: auto !important;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3) !important;
    position: relative !important;
  `;

  content.innerHTML = `
    <div style="text-align: center; margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
      <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #007784 0%, #005f6a 100%); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;">
        ⚙️
      </div>
      <h2 style="color: #333; margin: 0; font-size: 20px; font-family: system-ui;">Definições</h2>
    </div>

    <!-- Notificações -->
    <div style="margin-bottom: 20px;">
      <h3 style="color: #007784; margin: 0 0 12px 0; font-size: 16px; font-family: system-ui;">📱 Notificações Push</h3>
      <button onclick="enableNotifications()" style="width: 100%; padding: 10px; background: #007784; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; margin-bottom: 8px; font-family: system-ui;">
        🔔 Ativar Notificações
      </button>
      <input type="text" id="test-msg" placeholder="Mensagem de teste" value="Teste - Leirisonda" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 8px; box-sizing: border-box; font-family: system-ui;">
      <button onclick="sendTestNotification()" style="width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; font-family: system-ui;">
        🧪 Enviar Teste
      </button>
      <div id="notif-status" style="margin-top: 8px; padding: 8px; border-radius: 4px; display: none; font-size: 13px; font-family: system-ui;"></div>
    </div>

    <!-- Limpeza de Dados -->
    <div style="background: #fff3cd; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
      <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 16px; font-family: system-ui;">🗑️ Limpeza de Dados</h3>
      <p style="color: #856404; margin: 0 0 12px 0; font-size: 13px; font-family: system-ui;">⚠️ Elimina TODOS os dados permanentemente!</p>
      
      <div style="display: flex; gap: 8px; margin-bottom: 12px;">
        <div style="flex: 1; text-align: center; padding: 8px; background: white; border-radius: 6px; font-size: 12px;">
          <div style="font-size: 16px;">🏗️</div>
          <div style="font-weight: 600;">Obras</div>
          <div id="works-cnt" style="color: #007784;">0</div>
        </div>
        <div style="flex: 1; text-align: center; padding: 8px; background: white; border-radius: 6px; font-size: 12px;">
          <div style="font-size: 16px;">🔧</div>
          <div style="font-weight: 600;">Manutenções</div>
          <div id="maint-cnt" style="color: #007784;">0</div>
        </div>
        <div style="flex: 1; text-align: center; padding: 8px; background: white; border-radius: 6px; font-size: 12px;">
          <div style="font-size: 16px;">🏊</div>
          <div style="font-weight: 600;">Piscinas</div>
          <div id="pools-cnt" style="color: #007784;">0</div>
        </div>
      </div>
      
      <button onclick="deleteAllData()" style="width: 100%; padding: 10px; background: #dc3545; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: 600; font-family: system-ui;">
        💣 ELIMINAR TUDO
      </button>
      <div id="delete-status" style="margin-top: 8px; padding: 8px; border-radius: 4px; display: none; font-size: 13px; font-family: system-ui;"></div>
    </div>

    <!-- Botão Fechar -->
    <button onclick="closeModal()" style="width: 100%; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-family: system-ui;">
      Fechar
    </button>
  `;

  overlay.appendChild(content);
  document.body.appendChild(overlay);

  // Carregar dados
  loadData();

  console.log("✅ Modal criado DENTRO da aplicação");
}

// Funções globais para o modal
window.enableNotifications = async function () {
  if (!("Notification" in window)) {
    showStatus("notif-status", "Dispositivo não suporta notificações", "error");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      showStatus("notif-status", "✅ Notificações ativadas!", "success");
    } else {
      showStatus("notif-status", "❌ Permissão negada", "error");
    }
  } catch (error) {
    showStatus("notif-status", "❌ Erro: " + error.message, "error");
  }
};

window.sendTestNotification = function () {
  const message = document.getElementById("test-msg").value || "Teste";

  if (Notification.permission === "granted") {
    new Notification("Leirisonda", {
      body: message,
      icon: "/leirisonda-logo.svg",
    });
    showStatus("notif-status", "✅ Notificação enviada!", "success");
  } else {
    showStatus("notif-status", "❌ Ative as notificações primeiro", "error");
  }
};

window.deleteAllData = function () {
  if (
    confirm(
      "⚠️ ELIMINAR TODOS OS DADOS?\n\nObras, Manutenções e Piscinas serão perdidos!\n\nEsta ação NÃO PODE ser desfeita!",
    )
  ) {
    if (
      confirm("🔥 CONFIRMAÇÃO FINAL\n\nClique OK para ELIMINAR TUDO agora!")
    ) {
      const keys = [
        "leirisonda_works",
        "leirisonda_maintenances",
        "leirisonda_pools",
        "works",
        "maintenances",
        "pools",
        "users",
      ];
      let deleted = 0;

      keys.forEach((key) => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          deleted++;
        }
      });

      showStatus(
        "delete-status",
        `✅ ${deleted} tipos de dados eliminados!`,
        "success",
      );
      loadData();

      if (Notification.permission === "granted") {
        new Notification("Leirisonda", {
          body: "Dados eliminados!",
          icon: "/leirisonda-logo.svg",
        });
      }
    }
  }
};

window.closeModal = function () {
  const modal = document.getElementById("in-app-modal");
  if (modal) {
    modal.remove();
  }
};

function loadData() {
  try {
    const works = JSON.parse(localStorage.getItem("leirisonda_works") || "[]");
    const maint = JSON.parse(
      localStorage.getItem("leirisonda_maintenances") || "[]",
    );
    const pools = JSON.parse(localStorage.getItem("leirisonda_pools") || "[]");

    document.getElementById("works-cnt").textContent = works.length;
    document.getElementById("maint-cnt").textContent = maint.length;
    document.getElementById("pools-cnt").textContent = pools.length;
  } catch (error) {
    document.getElementById("works-cnt").textContent = "0";
    document.getElementById("maint-cnt").textContent = "0";
    document.getElementById("pools-cnt").textContent = "0";
  }
}

function showStatus(id, message, type) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = "block";
    el.style.background = type === "success" ? "#d4edda" : "#f8d7da";
    el.style.color = type === "success" ? "#155724" : "#721c24";
    el.textContent = message;

    setTimeout(() => {
      el.style.display = "none";
    }, 3000);
  }
}

// Detectar se estamos no login e criar ícone
function checkLoginAndCreateIcon() {
  const isLogin =
    window.location.pathname.includes("/login") ||
    document.querySelector('input[type="email"]') ||
    document.querySelector('[data-loc*="Login.tsx"]') ||
    document.body.textContent.includes("Email de acesso");

  if (isLogin) {
    console.log("📱 Login detectado - criando ícone interno");
    createInAppSettingsIcon();
  } else {
    // Remover ícone se não for login
    const existing = document.getElementById("in-app-settings-icon");
    if (existing) {
      existing.remove();
    }
  }
}

// Executar após carregamento
setTimeout(checkLoginAndCreateIcon, 1000);
setTimeout(checkLoginAndCreateIcon, 3000);

// Monitorar mudanças de página
let currentUrl = window.location.href;
setInterval(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    setTimeout(checkLoginAndCreateIcon, 500);
  }
}, 1000);

console.log("✅ Script de modal interno configurado");
