// Script APENAS para modal interno - SEM redirecionamentos
console.log("🎯 Modal interno APENAS - sem redirecionamentos");

// Prevenir QUALQUER redirecionamento
window.addEventListener("beforeunload", function (e) {
  // Cancelar se estiver vindo do nosso modal
  if (window.modalActive) {
    e.preventDefault();
    e.returnValue = "";
    return false;
  }
});

// Criar ícone APENAS se estivermos no login
function createModalIcon() {
  // Verificar se é página de login
  const isLoginPage =
    window.location.pathname.includes("/login") ||
    document.querySelector('input[type="email"]') ||
    document.body.textContent.includes("Email de acesso");

  if (!isLoginPage) return;

  // Remover ícones existentes
  document
    .querySelectorAll('[id*="settings"], [id*="admin"]')
    .forEach((el) => el.remove());

  console.log("➕ Criando ícone modal interno");

  // Criar ícone simples
  const icon = document.createElement("div");
  icon.id = "modal-icon-only";
  icon.innerHTML = "⚙️";

  // Estilos simples
  icon.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    width: 50px !important;
    height: 50px !important;
    background: #007784 !important;
    color: white !important;
    border-radius: 50% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    z-index: 99999 !important;
    font-size: 20px !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
    transition: transform 0.2s !important;
  `;

  // Hover
  icon.addEventListener("mouseenter", () => {
    icon.style.transform = "scale(1.1)";
  });

  icon.addEventListener("mouseleave", () => {
    icon.style.transform = "scale(1)";
  });

  // Click - APENAS modal interno
  icon.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    console.log("🔧 Abrindo modal INTERNO");
    window.modalActive = true;

    // Feedback visual
    this.style.background = "#00ff00";
    setTimeout(() => {
      this.style.background = "#007784";
    }, 200);

    // Criar modal IMEDIATAMENTE
    openInternalModal();
  });

  document.body.appendChild(icon);
  console.log("✅ Ícone criado");
}

// Função para abrir modal interno
function openInternalModal() {
  // Remover modal existente
  const existing = document.getElementById("internal-modal");
  if (existing) existing.remove();

  console.log("📱 Abrindo modal interno");

  // Criar modal
  const modal = document.createElement("div");
  modal.id = "internal-modal";
  modal.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: rgba(0,0,0,0.8) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 999999 !important;
  `;

  // Conteúdo
  const content = document.createElement("div");
  content.style.cssText = `
    background: white !important;
    border-radius: 15px !important;
    padding: 20px !important;
    max-width: 400px !important;
    width: 90% !important;
    max-height: 70vh !important;
    overflow-y: auto !important;
    position: relative !important;
  `;

  content.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <div style="font-size: 40px; margin-bottom: 10px;">⚙️</div>
      <h2 style="margin: 0; color: #333; font-family: system-ui;">Definições</h2>
    </div>

    <div style="margin-bottom: 15px;">
      <h3 style="color: #007784; margin: 0 0 10px 0; font-size: 16px;">📱 Notificações</h3>
      <button onclick="activateNotifications()" style="width: 100%; padding: 10px; background: #007784; color: white; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 8px;">
        🔔 Ativar Notificações
      </button>
      <input type="text" id="msg-test" placeholder="Mensagem teste" value="Teste Leirisonda" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 8px; box-sizing: border-box;">
      <button onclick="testNotification()" style="width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer;">
        🧪 Testar Notificação
      </button>
      <div id="notif-msg" style="margin-top: 8px; padding: 6px; border-radius: 4px; display: none; font-size: 13px;"></div>
    </div>

    <div style="background: #fff3cd; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
      <h3 style="color: #856404; margin: 0 0 8px 0; font-size: 16px;">🗑️ Eliminar Dados</h3>
      <p style="color: #856404; margin: 0 0 10px 0; font-size: 12px;">⚠️ Remove TODOS os dados!</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; margin-bottom: 10px;">
        <div style="text-align: center; padding: 6px; background: white; border-radius: 4px; font-size: 11px;">
          <div>🏗️</div>
          <div>Obras</div>
          <div id="w-count" style="color: #007784; font-weight: bold;">0</div>
        </div>
        <div style="text-align: center; padding: 6px; background: white; border-radius: 4px; font-size: 11px;">
          <div>🔧</div>
          <div>Manutenções</div>
          <div id="m-count" style="color: #007784; font-weight: bold;">0</div>
        </div>
        <div style="text-align: center; padding: 6px; background: white; border-radius: 4px; font-size: 11px;">
          <div>🏊</div>
          <div>Piscinas</div>
          <div id="p-count" style="color: #007784; font-weight: bold;">0</div>
        </div>
      </div>
      
      <button onclick="deleteEverything()" style="width: 100%; padding: 10px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
        💣 ELIMINAR TUDO
      </button>
      <div id="del-msg" style="margin-top: 8px; padding: 6px; border-radius: 4px; display: none; font-size: 13px;"></div>
    </div>

    <button onclick="closeInternalModal()" style="width: 100%; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer;">
      Fechar
    </button>
  `;

  // Fechar clicando fora
  modal.addEventListener("click", function (e) {
    if (e.target === this) {
      closeInternalModal();
    }
  });

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Carregar dados
  loadCounts();

  console.log("✅ Modal interno aberto");
}

// Funções globais
window.activateNotifications = async function () {
  try {
    if (!("Notification" in window)) {
      showMessage("notif-msg", "Dispositivo não suporta notificações", "error");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      showMessage("notif-msg", "✅ Notificações ativadas!", "success");
    } else {
      showMessage("notif-msg", "❌ Permissão negada", "error");
    }
  } catch (error) {
    showMessage("notif-msg", "❌ Erro: " + error.message, "error");
  }
};

window.testNotification = function () {
  const msg = document.getElementById("msg-test").value || "Teste";

  if (Notification.permission === "granted") {
    new Notification("Leirisonda", {
      body: msg,
      icon: "/leirisonda-logo.svg",
    });
    showMessage("notif-msg", "✅ Notificação enviada!", "success");
  } else {
    showMessage("notif-msg", "❌ Ative notificações primeiro", "error");
  }
};

window.deleteEverything = function () {
  if (
    confirm(
      "⚠️ ELIMINAR TODOS OS DADOS?\n\nObras, Manutenções e Piscinas!\n\nNÃO PODE ser desfeito!",
    )
  ) {
    if (confirm("🔥 ÚLTIMA CONFIRMAÇÃO!\n\nClique OK para ELIMINAR TUDO!")) {
      const keys = [
        "leirisonda_works",
        "leirisonda_maintenances",
        "leirisonda_pools",
        "works",
        "maintenances",
        "pools",
        "users",
        "leirisonda_users",
      ];

      let deleted = 0;
      keys.forEach((key) => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          deleted++;
        }
      });

      // Limpar IndexedDB
      if ("indexedDB" in window) {
        try {
          indexedDB.deleteDatabase("leirisonda");
          indexedDB.deleteDatabase("LeirisondaDB");
        } catch (e) {}
      }

      showMessage("del-msg", `✅ ${deleted} tipos eliminados!`, "success");
      loadCounts();

      if (Notification.permission === "granted") {
        new Notification("Leirisonda", {
          body: "Todos os dados eliminados!",
          icon: "/leirisonda-logo.svg",
        });
      }
    }
  }
};

window.closeInternalModal = function () {
  const modal = document.getElementById("internal-modal");
  if (modal) {
    modal.remove();
    window.modalActive = false;
  }
};

function loadCounts() {
  try {
    const works = JSON.parse(localStorage.getItem("leirisonda_works") || "[]");
    const maint = JSON.parse(
      localStorage.getItem("leirisonda_maintenances") || "[]",
    );
    const pools = JSON.parse(localStorage.getItem("leirisonda_pools") || "[]");

    document.getElementById("w-count").textContent = works.length;
    document.getElementById("m-count").textContent = maint.length;
    document.getElementById("p-count").textContent = pools.length;
  } catch (e) {
    document.getElementById("w-count").textContent = "0";
    document.getElementById("m-count").textContent = "0";
    document.getElementById("p-count").textContent = "0";
  }
}

function showMessage(id, text, type) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = "block";
    el.style.background = type === "success" ? "#d4edda" : "#f8d7da";
    el.style.color = type === "success" ? "#155724" : "#721c24";
    el.textContent = text;

    setTimeout(() => {
      el.style.display = "none";
    }, 2000);
  }
}

// Executar após carregamento
setTimeout(createModalIcon, 1000);
setTimeout(createModalIcon, 3000);

// Monitorar mudanças de URL
let lastUrl = window.location.href;
setInterval(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    setTimeout(createModalIcon, 300);
  }
}, 800);

console.log("✅ Script modal-only carregado");
