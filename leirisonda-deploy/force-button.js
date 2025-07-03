// SCRIPT ULTRA SIMPLES - BOTÃO DEFINIÇÕES
console.log("🚀 INICIANDO BOTÃO DEFINIÇÕES");

// Função para criar botão
function createButton() {
  if (document.getElementById("SETTINGS-BTN")) {
    return;
  }

  console.log("➕ Criando botão");

  const btn = document.createElement("div");
  btn.id = "SETTINGS-BTN";
  btn.innerHTML = "⚙️";
  btn.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    width: 60px !important;
    height: 60px !important;
    background: #007784 !important;
    color: white !important;
    border: 3px solid white !important;
    border-radius: 50% !important;
    font-size: 30px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    z-index: 999999 !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
  `;

  // CLICK SIMPLES
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    console.log("✅ BOTÃO CLICADO!");

    // Feedback visual
    this.style.background = "#00ff00";

    setTimeout(() => {
      this.style.background = "#007784";
      openModal();
    }, 200);
  });

  document.body.appendChild(btn);
  console.log("✅ Botão criado");
}

// Modal ultra simples
function openModal() {
  console.log("🔄 Abrindo modal");

  // Remove modal existente
  const existing = document.getElementById("SETTINGS-MODAL");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "SETTINGS-MODAL";
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
    z-index: 9999999 !important;
  `;

  const content = document.createElement("div");
  content.style.cssText = `
    background: white !important;
    padding: 25px !important;
    border-radius: 15px !important;
    max-width: 400px !important;
    width: 90% !important;
    text-align: center !important;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
  `;

  content.innerHTML = `
    <h2 style="color: #007784; margin-bottom: 20px;">⚙️ Definições</h2>
    
    <div style="margin-bottom: 20px; text-align: left;">
      <h3 style="color: #333; margin-bottom: 10px;">📱 Notificações</h3>
      <button id="enable-notifs" style="width: 100%; padding: 10px; background: #007784; color: white; border: none; border-radius: 6px; margin-bottom: 8px; cursor: pointer;">
        🔔 Ativar Notificações
      </button>
      <input type="text" id="test-msg" placeholder="Mensagem teste" value="Teste Leirisonda" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 8px; box-sizing: border-box;">
      <button id="test-notif" style="width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer;">
        🧪 Testar Notificação
      </button>
      <div id="notif-status" style="margin-top: 8px; font-size: 13px; display: none;"></div>
    </div>

    <div style="background: #fff3cd; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
      <h3 style="color: #856404; margin-bottom: 8px;">🗑️ Eliminar Dados</h3>
      <p style="color: #856404; margin-bottom: 12px; font-size: 13px;">⚠️ Remove TODOS os dados!</p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px;">
        <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; font-size: 12px;">
          <div style="font-size: 18px;">🏗️</div>
          <div style="font-weight: bold;">Obras</div>
          <div id="works-count" style="color: #007784; font-weight: bold;">0</div>
        </div>
        <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; font-size: 12px;">
          <div style="font-size: 18px;">🔧</div>
          <div style="font-weight: bold;">Manutenções</div>
          <div id="maint-count" style="color: #007784; font-weight: bold;">0</div>
        </div>
        <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; font-size: 12px;">
          <div style="font-size: 18px;">🏊</div>
          <div style="font-weight: bold;">Piscinas</div>
          <div id="pools-count" style="color: #007784; font-weight: bold;">0</div>
        </div>
      </div>
      
      <button id="delete-all" style="width: 100%; padding: 12px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
        💣 ELIMINAR TUDO
      </button>
      <div id="delete-status" style="margin-top: 8px; font-size: 13px; display: none;"></div>
    </div>

    <button id="close-modal" style="width: 100%; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer;">
      Fechar
    </button>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Adicionar event listeners
  setupModalEvents();
  loadDataCounts();

  // Fechar clicando fora
  modal.addEventListener("click", function (e) {
    if (e.target === this) {
      closeModal();
    }
  });

  console.log("✅ Modal aberto");
}

// Configurar eventos do modal
function setupModalEvents() {
  // Botão fechar
  document.getElementById("close-modal").addEventListener("click", closeModal);

  // Ativar notificações
  document
    .getElementById("enable-notifs")
    .addEventListener("click", async function () {
      try {
        if (!("Notification" in window)) {
          showStatus(
            "notif-status",
            "Dispositivo não suporta notificações",
            "red",
          );
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          showStatus("notif-status", "✅ Notificações ativadas!", "green");
        } else {
          showStatus("notif-status", "❌ Permissão negada", "red");
        }
      } catch (error) {
        showStatus("notif-status", "❌ Erro ao ativar", "red");
      }
    });

  // Testar notificação
  document.getElementById("test-notif").addEventListener("click", function () {
    const msg = document.getElementById("test-msg").value || "Teste";

    if (Notification.permission === "granted") {
      new Notification("Leirisonda", {
        body: msg,
        icon: "/leirisonda-logo.svg",
      });
      showStatus("notif-status", "✅ Notificação enviada!", "green");
    } else {
      showStatus("notif-status", "❌ Ative notificações primeiro", "red");
    }
  });

  // Eliminar dados
  document.getElementById("delete-all").addEventListener("click", function () {
    if (
      !confirm(
        "⚠️ ELIMINAR TODOS OS DADOS?\n\nObras, Manutenções e Piscinas!\n\nNÃO pode ser desfeito!",
      )
    ) {
      return;
    }

    if (!confirm("🔥 CONFIRMAÇÃO FINAL!\n\nClique OK para ELIMINAR TUDO!")) {
      return;
    }

    const keys = [
      "leirisonda_works",
      "leirisonda_maintenances",
      "leirisonda_pools",
      "works",
      "maintenances",
      "pools",
      "users",
    ];

    let count = 0;
    keys.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        count++;
      }
    });

    showStatus("delete-status", `✅ ${count} tipos eliminados!`, "green");
    loadDataCounts();

    if (Notification.permission === "granted") {
      new Notification("Leirisonda", {
        body: "Dados eliminados!",
        icon: "/leirisonda-logo.svg",
      });
    }
  });
}

// Fechar modal
function closeModal() {
  const modal = document.getElementById("SETTINGS-MODAL");
  if (modal) {
    modal.remove();
  }
  console.log("✅ Modal fechado");
}

// Carregar contadores de dados
function loadDataCounts() {
  try {
    const works = JSON.parse(
      localStorage.getItem("leirisonda_works") || "[]",
    ).length;
    const maint = JSON.parse(
      localStorage.getItem("leirisonda_maintenances") || "[]",
    ).length;
    const pools = JSON.parse(
      localStorage.getItem("leirisonda_pools") || "[]",
    ).length;

    document.getElementById("works-count").textContent = works;
    document.getElementById("maint-count").textContent = maint;
    document.getElementById("pools-count").textContent = pools;
  } catch (e) {
    document.getElementById("works-count").textContent = "0";
    document.getElementById("maint-count").textContent = "0";
    document.getElementById("pools-count").textContent = "0";
  }
}

// Mostrar status temporário
function showStatus(id, text, color) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = "block";
    el.style.color = color;
    el.textContent = text;
    setTimeout(() => (el.style.display = "none"), 3000);
  }
}

// EXECUTAR
createButton();

// Verificar constantemente
setInterval(() => {
  if (!document.getElementById("SETTINGS-BTN")) {
    console.log("🔄 Recriando botão");
    createButton();
  }
}, 1000);

console.log("✅ Script carregado");
