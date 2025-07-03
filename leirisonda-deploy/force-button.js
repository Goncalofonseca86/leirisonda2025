// Script SUPER SIMPLES - Força botão SEMPRE (SEM CONFLITOS)
console.log("🚀 FORÇANDO BOTÃO SEMPRE - VERSÃO ISOLADA");

// BLOQUEAR TODAS AS POSSÍVEIS REDIREÇÕES
const originalWindowOpen = window.open;
const originalLocationAssign = window.location.assign;
const originalLocationReplace = window.location.replace;

// Função simples para criar botão
function createButton() {
  // Se já existe, não criar novamente
  if (document.getElementById("SETTINGS-BTN")) {
    return;
  }

  console.log("➕ Criando botão isolado");

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
    transition: all 0.2s ease !important;
  `;

  // CLICK HANDLER COM PROTEÇÃO MÁXIMA
  btn.onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    console.log("✅ Botão clicado - MODAL APENAS");

    // Feedback visual
    this.style.background = "#00ff00";
    this.style.transform = "scale(1.1)";

    // TEMPORARIAMENTE BLOQUEAR REDIREÇÕES
    window.open = function () {
      console.log("🚫 window.open BLOQUEADO durante modal");
      return null;
    };
    window.location.assign = function () {
      console.log("🚫 location.assign BLOQUEADO durante modal");
    };
    window.location.replace = function () {
      console.log("🚫 location.replace BLOQUEADO durante modal");
    };

    setTimeout(() => {
      this.style.background = "#007784";
      this.style.transform = "scale(1)";
      showModal();
    }, 200);
  };

  // EVITAR PROPAGAÇÃO DE OUTROS EVENTOS
  btn.addEventListener(
    "click",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    },
    true,
  );

  btn.addEventListener(
    "mousedown",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    },
    true,
  );

  document.body.appendChild(btn);
  console.log("✅ Botão isolado criado");
}

// Modal simples COM PROTEÇÃO
function showModal() {
  console.log("🔄 Abrindo modal protegido");

  // Remover modal existente
  const existing = document.getElementById("MODAL");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "MODAL";
  modal.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: rgba(0,0,0,0.85) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 9999999 !important;
    backdrop-filter: blur(5px) !important;
  `;

  const content = document.createElement("div");
  content.style.cssText = `
    background: white !important;
    padding: 25px !important;
    border-radius: 15px !important;
    max-width: 400px !important;
    width: 90% !important;
    text-align: center !important;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
    animation: modalSlideIn 0.3s ease !important;
  `;

  // ADICIONAR KEYFRAMES PARA ANIMAÇÃO
  if (!document.getElementById("modal-animation-css")) {
    const animationCSS = document.createElement("style");
    animationCSS.id = "modal-animation-css";
    animationCSS.innerHTML = `
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: translateY(-50px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;
    document.head.appendChild(animationCSS);
  }

  content.innerHTML = `
    <h2 style="color: #007784; margin-bottom: 20px;">⚙️ Definições</h2>

    <div style="margin-bottom: 20px; text-align: left;">
      <h3 style="color: #333; margin-bottom: 10px;">📱 Notificações</h3>
      <button onclick="enableNotifs()" style="width: 100%; padding: 10px; background: #007784; color: white; border: none; border-radius: 6px; margin-bottom: 8px; cursor: pointer;">
        🔔 Ativar Notificações
      </button>
      <input type="text" id="test-msg" placeholder="Mensagem teste" value="Teste Leirisonda" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 8px; box-sizing: border-box;">
      <button onclick="testNotif()" style="width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer;">
        🧪 Testar Notificação
      </button>
      <div id="notif-info" style="margin-top: 8px; font-size: 13px; display: none;"></div>
    </div>

    <div style="background: #fff3cd; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
      <h3 style="color: #856404; margin-bottom: 8px;">🗑️ Eliminar Dados</h3>
      <p style="color: #856404; margin-bottom: 12px; font-size: 13px;">⚠️ Remove TODOS os dados!</p>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px;">
        <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; font-size: 12px;">
          <div style="font-size: 18px;">🏗️</div>
          <div style="font-weight: bold;">Obras</div>
          <div id="w-cnt" style="color: #007784; font-weight: bold;">0</div>
        </div>
        <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; font-size: 12px;">
          <div style="font-size: 18px;">🔧</div>
          <div style="font-weight: bold;">Manutenções</div>
          <div id="m-cnt" style="color: #007784; font-weight: bold;">0</div>
        </div>
        <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; font-size: 12px;">
          <div style="font-size: 18px;">🏊</div>
          <div style="font-weight: bold;">Piscinas</div>
          <div id="p-cnt" style="color: #007784; font-weight: bold;">0</div>
        </div>
      </div>

      <button onclick="deleteData()" style="width: 100%; padding: 12px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
        💣 ELIMINAR TUDO
      </button>
      <div id="del-info" style="margin-top: 8px; font-size: 13px; display: none;"></div>
    </div>

    <button onclick="closeModal()" style="width: 100%; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer;">
      Fechar
    </button>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);

  // Fechar clicando fora E RESTAURAR FUNÇÕES
  modal.onclick = function (e) {
    if (e.target === this) {
      console.log("🔄 Fechando modal (clique fora)");

      // RESTAURAR FUNÇÕES ORIGINAIS
      window.open = originalWindowOpen;
      window.location.assign = originalLocationAssign;
      window.location.replace = originalLocationReplace;

      this.style.animation = "modalSlideOut 0.2s ease";
      setTimeout(() => this.remove(), 200);
    }
  };

  loadData();
  console.log("✅ Modal aberto");
}

// Funções globais
window.enableNotifs = async function () {
  try {
    if (!("Notification" in window)) {
      showInfo("notif-info", "Dispositivo não suporta notificações", "red");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      showInfo("notif-info", "✅ Notificações ativadas!", "green");
    } else {
      showInfo("notif-info", "❌ Permissão negada", "red");
    }
  } catch (error) {
    showInfo("notif-info", "❌ Erro ao ativar", "red");
  }
};

window.testNotif = function () {
  const msg = document.getElementById("test-msg").value || "Teste";

  if (Notification.permission === "granted") {
    new Notification("Leirisonda", {
      body: msg,
      icon: "/leirisonda-logo.svg",
    });
    showInfo("notif-info", "✅ Notificação enviada!", "green");
  } else {
    showInfo("notif-info", "❌ Ative notificações primeiro", "red");
  }
};

window.deleteData = function () {
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

  showInfo("del-info", `✅ ${count} tipos eliminados!`, "green");
  loadData();

  if (Notification.permission === "granted") {
    new Notification("Leirisonda", {
      body: "Dados eliminados!",
      icon: "/leirisonda-logo.svg",
    });
  }
};

window.closeModal = function () {
  console.log("🔄 Fechando modal e restaurando funções");

  const modal = document.getElementById("MODAL");
  if (modal) {
    modal.style.animation = "modalSlideOut 0.2s ease";
    setTimeout(() => modal.remove(), 200);
  }

  // RESTAURAR FUNÇÕES ORIGINAIS
  window.open = originalWindowOpen;
  window.location.assign = originalLocationAssign;
  window.location.replace = originalLocationReplace;

  console.log("✅ Modal fechado e funções restauradas");
};

function loadData() {
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

    document.getElementById("w-cnt").textContent = works;
    document.getElementById("m-cnt").textContent = maint;
    document.getElementById("p-cnt").textContent = pools;
  } catch (e) {
    document.getElementById("w-cnt").textContent = "0";
    document.getElementById("m-cnt").textContent = "0";
    document.getElementById("p-cnt").textContent = "0";
  }
}

function showInfo(id, text, color) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = "block";
    el.style.color = color;
    el.textContent = text;
    setTimeout(() => (el.style.display = "none"), 2000);
  }
}

// BLOQUEAR CONFLITOS PERMANENTEMENTE
document.addEventListener(
  "click",
  function (e) {
    // Se clique é no nosso botão, bloquear propagação
    const settingsBtn = document.getElementById("SETTINGS-BTN");
    if (
      settingsBtn &&
      (e.target === settingsBtn || settingsBtn.contains(e.target))
    ) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  },
  true,
);

// EXECUTAR IMEDIATAMENTE
createButton();

// VERIFICAR E RECRIAR CONSTANTEMENTE
setInterval(() => {
  if (!document.getElementById("SETTINGS-BTN")) {
    console.log("🔄 Botão sumiu - recriando versão isolada");
    createButton();
  }
}, 500);

console.log("✅ Script isolado carregado - SEM CONFLITOS");
