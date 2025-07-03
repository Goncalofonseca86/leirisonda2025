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

  // Click handler para abrir modal dentro da app
  iconContainer.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    console.log("🔧 Ícone de definições clicado - abrindo modal dentro da app");

    // Feedback visual imediato
    this.style.transform = "scale(0.9) !important";
    this.style.background =
      "linear-gradient(135deg, #00ff00 0%, #00cc00 100%) !important";

    // Criar e mostrar modal após feedback
    setTimeout(() => {
      this.style.transform = "scale(1) !important";
      this.style.background =
        "linear-gradient(135deg, #007784 0%, #005f6a 100%) !important";

      createSettingsModal();
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

// Função para criar modal de definições dentro da app
function createSettingsModal() {
  // Remover modal existente se houver
  const existingModal = document.getElementById("settings-modal");
  if (existingModal) {
    existingModal.remove();
  }

  console.log("📱 Criando modal de definições dentro da app");

  // Criar overlay do modal
  const modalOverlay = document.createElement("div");
  modalOverlay.id = "settings-modal";
  modalOverlay.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: rgba(0, 0, 0, 0.8) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 999999 !important;
    backdrop-filter: blur(5px) !important;
    animation: fadeIn 0.3s ease !important;
  `;

  // Criar conteúdo do modal
  const modalContent = document.createElement("div");
  modalContent.style.cssText = `
    background: white !important;
    border-radius: 20px !important;
    padding: 30px !important;
    max-width: 500px !important;
    width: 90% !important;
    max-height: 80vh !important;
    overflow-y: auto !important;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
    position: relative !important;
    animation: slideIn 0.3s ease !important;
  `;

  modalContent.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #007784 0%, #005f6a 100%); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
        ⚙️
      </div>
      <h2 style="color: #333; margin: 0; font-size: 24px; font-weight: 600;">Definições e Administração</h2>
    </div>

    <!-- Seção Notificações -->
    <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
      <h3 style="color: #007784; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
        📱 Notificações Push
      </h3>
      <button id="enable-notifications" style="width: 100%; padding: 12px; background: #007784; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; margin-bottom: 10px;">
        🔔 Ativar Notificações neste Dispositivo
      </button>
      <input type="text" id="test-message" placeholder="Digite mensagem de teste" value="Teste de notificação - Leirisonda" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 10px; box-sizing: border-box;">
      <button id="send-test" style="width: 100%; padding: 12px; background: #28a745; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer;">
        🧪 Enviar Notificação de Teste
      </button>
      <div id="notification-status" style="margin-top: 10px; padding: 10px; border-radius: 6px; display: none;"></div>
    </div>

    <!-- Seção Limpeza de Dados -->
    <div style="background: #fff3cd; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #ffeaa7;">
      <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px; display: flex; align-items: center;">
        🗑️ Limpeza de Dados
      </h3>
      <p style="color: #856404; margin: 0 0 15px 0; font-size: 14px; font-weight: 600;">
        ⚠️ ATENÇÃO: Esta ação eliminará TODOS os dados permanentemente!
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px; margin-bottom: 15px;">
        <div style="text-align: center; padding: 10px; background: white; border-radius: 8px;">
          <div style="font-size: 20px; margin-bottom: 5px;">🏗️</div>
          <div style="font-size: 12px; font-weight: 600;">Obras</div>
          <div id="works-count" style="color: #007784; font-size: 12px;">0</div>
        </div>
        <div style="text-align: center; padding: 10px; background: white; border-radius: 8px;">
          <div style="font-size: 20px; margin-bottom: 5px;">🔧</div>
          <div style="font-size: 12px; font-weight: 600;">Manutenções</div>
          <div id="maintenance-count" style="color: #007784; font-size: 12px;">0</div>
        </div>
        <div style="text-align: center; padding: 10px; background: white; border-radius: 8px;">
          <div style="font-size: 20px; margin-bottom: 5px;">🏊</div>
          <div style="font-size: 12px; font-weight: 600;">Piscinas</div>
          <div id="pools-count" style="color: #007784; font-size: 12px;">0</div>
        </div>
      </div>

      <button id="delete-all-data" style="width: 100%; padding: 12px; background: #dc3545; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; font-weight: 600;">
        💣 ELIMINAR TODOS OS DADOS
      </button>
      <div id="delete-status" style="margin-top: 10px; padding: 10px; border-radius: 6px; display: none;"></div>
    </div>

    <!-- Botões de Ação -->
    <div style="display: flex; gap: 10px; margin-top: 20px;">
      <button id="close-modal" style="flex: 1; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer;">
        Fechar
      </button>
      <button id="open-full-admin" style="flex: 1; padding: 12px; background: #007784; color: white; border: none; border-radius: 8px; cursor: pointer;">
        Abrir Administração Completa
      </button>
    </div>
  `;

  // Adicionar CSS para animações
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  // Adicionar event listeners
  setupModalEventListeners();

  // Carregar dados
  loadModalData();

  console.log("✅ Modal de definições criado dentro da app");
}

// Configurar event listeners do modal
function setupModalEventListeners() {
  // Fechar modal
  document.getElementById("close-modal").addEventListener("click", function () {
    const modal = document.getElementById("settings-modal");
    if (modal) {
      modal.style.animation = "fadeIn 0.3s ease reverse";
      setTimeout(() => modal.remove(), 300);
    }
  });

  // Fechar modal clicando fora
  document
    .getElementById("settings-modal")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        this.style.animation = "fadeIn 0.3s ease reverse";
        setTimeout(() => this.remove(), 300);
      }
    });

  // Ativar notificações
  document
    .getElementById("enable-notifications")
    .addEventListener("click", async function () {
      if (!("Notification" in window)) {
        showModalStatus(
          "notification-status",
          "Este dispositivo não suporta notificações",
          "error",
        );
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          showModalStatus(
            "notification-status",
            "✅ Notificações ativadas neste dispositivo!",
            "success",
          );
        } else {
          showModalStatus(
            "notification-status",
            "❌ Permissão de notificações negada",
            "error",
          );
        }
      } catch (error) {
        showModalStatus(
          "notification-status",
          "❌ Erro ao ativar notificações: " + error.message,
          "error",
        );
      }
    });

  // Enviar notificação de teste
  document.getElementById("send-test").addEventListener("click", function () {
    const message =
      document.getElementById("test-message").value || "Teste de notificação";

    if (Notification.permission === "granted") {
      new Notification("Leirisonda Admin", {
        body: message,
        icon: "/leirisonda-logo.svg",
      });
      showModalStatus(
        "notification-status",
        "✅ Notificação enviada!",
        "success",
      );
    } else {
      showModalStatus(
        "notification-status",
        "❌ Ative as notificações primeiro",
        "error",
      );
    }
  });

  // Eliminar todos os dados
  document
    .getElementById("delete-all-data")
    .addEventListener("click", function () {
      if (
        confirm(
          "⚠️ TEM A CERTEZA?\n\nEsta ação eliminará TODOS os dados permanentemente!\n\nObras, Manutenções e Piscinas serão perdidos para sempre.\n\nEsta ação NÃO PODE ser desfeita!",
        )
      ) {
        if (
          confirm(
            "🔥 CONFIRMAÇÃO FINAL\n\nÚltima oportunidade para cancelar.\n\nClique OK para ELIMINAR TODOS OS DADOS agora!",
          )
        ) {
          deleteAllModalData();
        }
      }
    });

  // Abrir administração completa
  document
    .getElementById("open-full-admin")
    .addEventListener("click", function () {
      window.open("/admin", "_blank");
    });
}

// Carregar dados no modal
function loadModalData() {
  try {
    const works = JSON.parse(localStorage.getItem("leirisonda_works") || "[]");
    const maintenances = JSON.parse(
      localStorage.getItem("leirisonda_maintenances") || "[]",
    );
    const pools = JSON.parse(localStorage.getItem("leirisonda_pools") || "[]");

    document.getElementById("works-count").textContent =
      works.length + " registos";
    document.getElementById("maintenance-count").textContent =
      maintenances.length + " registos";
    document.getElementById("pools-count").textContent =
      pools.length + " registos";
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    document.getElementById("works-count").textContent = "Erro";
    document.getElementById("maintenance-count").textContent = "Erro";
    document.getElementById("pools-count").textContent = "Erro";
  }
}

// Eliminar todos os dados
function deleteAllModalData() {
  const keysToDelete = [
    "leirisonda_works",
    "leirisonda_maintenances",
    "leirisonda_pools",
    "leirisonda_users",
    "leirisonda_settings",
    "leirisonda_backups",
    "works",
    "maintenances",
    "pools",
    "users",
  ];

  let deletedCount = 0;

  keysToDelete.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      deletedCount++;
    }
  });

  // Limpar IndexedDB se existir
  if ("indexedDB" in window) {
    try {
      indexedDB.deleteDatabase("leirisonda");
      indexedDB.deleteDatabase("LeirisondaDB");
    } catch (error) {
      console.error("Erro ao limpar IndexedDB:", error);
    }
  }

  showModalStatus(
    "delete-status",
    `✅ ${deletedCount} tipos de dados eliminados com sucesso!`,
    "success",
  );

  // Atualizar contadores
  loadModalData();

  // Notificação se disponível
  if (Notification.permission === "granted") {
    new Notification("Leirisonda Admin", {
      body: "Todos os dados foram eliminados com sucesso!",
      icon: "/leirisonda-logo.svg",
    });
  }
}

// Mostrar status no modal
function showModalStatus(elementId, message, type) {
  const statusEl = document.getElementById(elementId);
  if (statusEl) {
    statusEl.style.display = "block";
    statusEl.style.background = type === "success" ? "#d4edda" : "#f8d7da";
    statusEl.style.color = type === "success" ? "#155724" : "#721c24";
    statusEl.style.border =
      "1px solid " + (type === "success" ? "#c3e6cb" : "#f5c6cb");
    statusEl.textContent = message;

    setTimeout(() => {
      statusEl.style.display = "none";
    }, 3000);
  }
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
