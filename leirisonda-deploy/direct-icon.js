// Script DIRETO - Cria ícone IMEDIATAMENTE
console.log("🚀 CRIANDO ÍCONE DIRETO - SEM CONDIÇÕES");

// BLOQUEAR ABSOLUTAMENTE TODOS OS REDIRECIONAMENTOS
console.log("🚫 BLOQUEANDO todos os redirecionamentos");

// Salvar originais
const originalOpen = window.open;
const originalAssign = window.location.assign;
const originalReplace = window.location.replace;

// Bloquear window.open
window.open = function (...args) {
  console.log("🚫 BLOQUEADO: window.open", args);
  return null;
};

// Bloquear window.location.href
let originalHref = window.location.href;
Object.defineProperty(window.location, "href", {
  set: function (url) {
    console.log("🚫 BLOQUEADO: window.location.href =", url);
    // Não fazer nada
  },
  get: function () {
    return originalHref;
  },
});

// Bloquear assign e replace
window.location.assign = function (...args) {
  console.log("🚫 BLOQUEADO: window.location.assign", args);
};

window.location.replace = function (...args) {
  console.log("🚫 BLOQUEADO: window.location.replace", args);
};

// Interceptar TODOS os clicks
document.addEventListener(
  "click",
  function (e) {
    // Se for um link, bloquear
    const link = e.target.closest("a");
    if (link && link.href) {
      console.log("🚫 BLOQUEADO: Click em link", link.href);
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  },
  true,
);

// Interceptar mudanças de URL
let currentUrl = window.location.href;
setInterval(() => {
  if (window.location.href !== currentUrl) {
    console.log("🚫 DETECTADO: Mudança de URL");
    // Tentar voltar
    history.back();
  }
}, 100);

// Criar ícone AGORA MESMO
function forceCreateIcon() {
  console.log("➕ FORÇANDO criação de ícone");

  // Remover qualquer ícone existente
  document
    .querySelectorAll(
      '[id*="icon"], [id*="settings"], [style*="position: fixed"]',
    )
    .forEach((el) => {
      if (el.style.position === "fixed") el.remove();
    });

  // Criar ícone VERMELHO e GRANDE
  const icon = document.createElement("div");
  icon.id = "FORCE-ICON";
  icon.innerHTML = "⚙️ DEFINIÇÕES";
  icon.style.cssText = `
    position: fixed !important;
    top: 10px !important;
    right: 10px !important;
    width: 150px !important;
    height: 50px !important;
    background: #ff0000 !important;
    color: white !important;
    border: 5px solid #ffffff !important;
    border-radius: 25px !important;
    font-size: 16px !important;
    font-weight: bold !important;
    cursor: pointer !important;
    z-index: 99999999 !important;
    box-shadow: 0 5px 20px rgba(0,0,0,0.8) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
    animation: blink 1s infinite !important;
  `;

  // Animação
  const style = document.createElement("style");
  style.textContent = `
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0.3; }
    }
  `;
  document.head.appendChild(style);

  // Click handler ULTRA ROBUSTO
  const clickHandler = function (e) {
    // PARAR TUDO
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // Bloquear qualquer navegação
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
      console.log("🚫 BLOQUEADO: history.pushState");
    };

    history.replaceState = function () {
      console.log("🚫 BLOQUEADO: history.replaceState");
    };

    console.log("✅ ÍCONE CLICADO - Abrindo modal INTERNO");

    this.style.background = "#00ff00";
    this.innerHTML = "✅ CLICADO!";

    setTimeout(() => {
      this.style.background = "#ff0000";
      this.innerHTML = "⚙️ DEFINIÇÕES";
    }, 1000);

    // Abrir modal IMEDIATAMENTE
    setTimeout(() => {
      openSettingsModal();
    }, 10);

    return false;
  };

  // Adicionar multiple event listeners
  icon.addEventListener("click", clickHandler, true);
  icon.addEventListener("mousedown", clickHandler, true);
  icon.addEventListener("mouseup", clickHandler, true);
  icon.onclick = clickHandler;

  // Adicionar ao body FORÇADAMENTE
  document.body.appendChild(icon);
  console.log("✅ ÍCONE CRIADO E ADICIONADO");

  // Verificar se foi realmente adicionado
  setTimeout(() => {
    const check = document.getElementById("FORCE-ICON");
    if (check) {
      console.log("✅ ÍCONE CONFIRMADO NO DOM");
    } else {
      console.log("❌ ÍCONE NÃO ENCONTRADO - TENTANDO NOVAMENTE");
      document.body.appendChild(icon);
    }
  }, 100);
}

// Modal simples
function openSettingsModal() {
  console.log("📱 ABRINDO MODAL INTERNO - SEM REDIRECIONAMENTO");

  // GARANTIR que não há redirecionamento
  window.modalOpen = true;

  // Remover modal existente
  const existing = document.getElementById("FORCE-MODAL");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "FORCE-MODAL";
  modal.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: rgba(0,0,0,0.9) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 999999999 !important;
  `;

  const content = document.createElement("div");
  content.style.cssText = `
    background: white !important;
    padding: 20px !important;
    border-radius: 15px !important;
    max-width: 400px !important;
    width: 90% !important;
    text-align: center !important;
  `;

  content.innerHTML = `
    <h2 style="color: #007784; margin-bottom: 20px;">⚙️ Definições da Aplicação</h2>

    <div style="margin-bottom: 20px; text-align: left;">
      <h3 style="color: #333; margin-bottom: 10px;">📱 Notificações Push</h3>
      <button onclick="enableNotifications()" style="width: 100%; padding: 10px; background: #007784; color: white; border: none; border-radius: 5px; margin-bottom: 8px; cursor: pointer;">
        🔔 Ativar Notificações
      </button>
      <input type="text" id="test-message" placeholder="Mensagem de teste" value="Teste de notificação - Leirisonda" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 8px; box-sizing: border-box;">
      <button onclick="testNotification()" style="width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
        🧪 Enviar Teste
      </button>
      <div id="notif-status" style="margin-top: 8px; font-size: 14px; display: none;"></div>
    </div>

    <div style="background: #fff3cd; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
      <h3 style="color: #856404; margin-bottom: 10px;">🗑️ Limpeza de Dados</h3>
      <p style="color: #856404; margin-bottom: 10px; font-size: 14px;">⚠️ ATENÇÃO: Elimina TODOS os dados!</p>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px;">
        <div style="text-align: center; padding: 8px; background: white; border-radius: 5px;">
          <div style="font-size: 20px;">🏗️</div>
          <div style="font-size: 12px; font-weight: bold;">Obras</div>
          <div id="works-count" style="color: #007784; font-weight: bold;">0</div>
        </div>
        <div style="text-align: center; padding: 8px; background: white; border-radius: 5px;">
          <div style="font-size: 20px;">🔧</div>
          <div style="font-size: 12px; font-weight: bold;">Manutenções</div>
          <div id="maint-count" style="color: #007784; font-weight: bold;">0</div>
        </div>
        <div style="text-align: center; padding: 8px; background: white; border-radius: 5px;">
          <div style="font-size: 20px;">🏊</div>
          <div style="font-size: 12px; font-weight: bold;">Piscinas</div>
          <div id="pools-count" style="color: #007784; font-weight: bold;">0</div>
        </div>
      </div>

      <button onclick="deleteAllData()" style="width: 100%; padding: 12px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
        💣 ELIMINAR TODOS OS DADOS
      </button>
      <div id="delete-status" style="margin-top: 8px; font-size: 14px; display: none;"></div>
    </div>

    <button onclick="closeModal()" style="width: 100%; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">
      Fechar
    </button>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Fechar clicando fora
  modal.addEventListener("click", function (e) {
    if (e.target === this) closeModal();
  });

  loadDataCounts();
  console.log("✅ MODAL ABERTO");
}

// Funções do modal
window.enableNotifications = async function () {
  try {
    if (!("Notification" in window)) {
      showStatus(
        "notif-status",
        "Este dispositivo não suporta notificações",
        "error",
      );
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      showStatus(
        "notif-status",
        "✅ Notificações ativadas com sucesso!",
        "success",
      );
    } else {
      showStatus(
        "notif-status",
        "❌ Permissão de notificações negada",
        "error",
      );
    }
  } catch (error) {
    showStatus("notif-status", "❌ Erro ao ativar notificações", "error");
  }
};

window.testNotification = function () {
  const message = document.getElementById("test-message").value || "Teste";

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
    !confirm(
      "⚠️ ELIMINAR TODOS OS DADOS?\n\nObras, Manutenções e Piscinas serão perdidos PERMANENTEMENTE!\n\nEsta ação NÃO PODE ser desfeita!\n\nTem a certeza?",
    )
  ) {
    return;
  }

  if (
    !confirm(
      "🔥 CONFIRMAÇÃO FINAL!\n\nÚltima oportunidade para cancelar.\n\nClique OK para ELIMINAR TODOS OS DADOS AGORA!",
    )
  ) {
    return;
  }

  const keysToDelete = [
    "leirisonda_works",
    "leirisonda_maintenances",
    "leirisonda_pools",
    "works",
    "maintenances",
    "pools",
    "users",
    "leirisonda_users",
    "leirisonda_settings",
    "leirisonda_backups",
  ];

  let deletedCount = 0;
  keysToDelete.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      deletedCount++;
    }
  });

  // Limpar IndexedDB
  if ("indexedDB" in window) {
    try {
      indexedDB.deleteDatabase("leirisonda");
      indexedDB.deleteDatabase("LeirisondaDB");
    } catch (error) {
      console.error("Erro ao limpar IndexedDB:", error);
    }
  }

  showStatus(
    "delete-status",
    `✅ ${deletedCount} tipos de dados eliminados com sucesso!`,
    "success",
  );
  loadDataCounts();

  if (Notification.permission === "granted") {
    new Notification("Leirisonda", {
      body: "Todos os dados foram eliminados com sucesso!",
      icon: "/leirisonda-logo.svg",
    });
  }
};

window.closeModal = function () {
  console.log("❌ FECHANDO MODAL");
  const modal = document.getElementById("FORCE-MODAL");
  if (modal) modal.remove();
  window.modalOpen = false;
};

function loadDataCounts() {
  try {
    const works = JSON.parse(localStorage.getItem("leirisonda_works") || "[]");
    const maintenances = JSON.parse(
      localStorage.getItem("leirisonda_maintenances") || "[]",
    );
    const pools = JSON.parse(localStorage.getItem("leirisonda_pools") || "[]");

    document.getElementById("works-count").textContent = works.length;
    document.getElementById("maint-count").textContent = maintenances.length;
    document.getElementById("pools-count").textContent = pools.length;
  } catch (error) {
    document.getElementById("works-count").textContent = "0";
    document.getElementById("maint-count").textContent = "0";
    document.getElementById("pools-count").textContent = "0";
  }
}

function showStatus(elementId, message, type) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = "block";
    element.style.padding = "8px";
    element.style.borderRadius = "4px";
    element.style.background = type === "success" ? "#d4edda" : "#f8d7da";
    element.style.color = type === "success" ? "#155724" : "#721c24";
    element.textContent = message;

    setTimeout(() => {
      element.style.display = "none";
    }, 3000);
  }
}

// EXECUTAR IMEDIATAMENTE
console.log("🚀 EXECUTANDO CRIAÇÃO DE ÍCONE AGORA");
forceCreateIcon();

// Verificar e recriar se necessário
setInterval(() => {
  if (!document.getElementById("FORCE-ICON")) {
    console.log("🔄 ÍCONE PERDIDO - RECRIANDO");
    forceCreateIcon();
  }
}, 2000);

console.log("✅ SCRIPT DIRETO CARREGADO");
