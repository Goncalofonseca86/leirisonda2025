// Script ABSOLUTO - FORÇA modal e BLOQUEIA redirecionamentos
console.log("🚫 BLOQUEANDO redirecionamentos - APENAS modal interno");

// BLOQUEAR ABSOLUTAMENTE todos os redirecionamentos
const originalOpen = window.open;
const originalAssign = window.location.assign;
const originalReplace = window.location.replace;

window.open = function () {
  console.log("🚫 BLOQUEADO: window.open");
  return null;
};

Object.defineProperty(window.location, "href", {
  set: function (url) {
    console.log("🚫 BLOQUEADO: window.location.href =", url);
    // Não fazer nada - bloquear redirecionamento
  },
  get: function () {
    return window.location.toString();
  },
});

window.location.assign = function () {
  console.log("🚫 BLOQUEADO: window.location.assign");
};

window.location.replace = function () {
  console.log("🚫 BLOQUEADO: window.location.replace");
};

// Interceptar clicks em links
document.addEventListener(
  "click",
  function (e) {
    const target = e.target.closest("a");
    if (target && target.href && !target.href.includes("#")) {
      console.log("🚫 BLOQUEADO: Click em link", target.href);
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
  },
  true,
);

// CRIAR ícone simples na página de login
function createSimpleIcon() {
  // Verificar se é login usando múltiplas formas
  const isLogin =
    window.location.pathname.includes("/login") ||
    document.querySelector('input[type="email"]') ||
    document.querySelector('input[placeholder*="Email de acesso"]') ||
    document.querySelector('[data-loc*="Login.tsx"]') ||
    document.body.textContent.includes("Email de acesso") ||
    document.body.textContent.includes("Palavra-passe") ||
    document.body.textContent.includes("Leirisonda");

  console.log("🔍 Verificando login:", {
    pathname: window.location.pathname,
    hasEmailInput: !!document.querySelector('input[type="email"]'),
    hasEmailPlaceholder: !!document.querySelector(
      'input[placeholder*="Email de acesso"]',
    ),
    hasLoginData: !!document.querySelector('[data-loc*="Login.tsx"]'),
    hasLoginText: document.body.textContent.includes("Email de acesso"),
    isLogin: isLogin,
  });

  if (!isLogin) {
    console.log("❌ Não é página de login");
    return;
  }

  // Remover qualquer ícone existente
  document
    .querySelectorAll(
      '[id*="icon"], [id*="settings"], [id*="admin"], [id*="modal"]',
    )
    .forEach((el) => {
      if (el.style.position === "fixed") el.remove();
    });

  console.log("➕ Criando ícone SIMPLES");

  const btn = document.createElement("div");
  btn.id = "settings-icon-forced";
  btn.innerHTML = "⚙️";
  btn.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    width: 60px !important;
    height: 60px !important;
    background: #ff0000 !important;
    color: white !important;
    border: 3px solid #ffffff !important;
    border-radius: 50% !important;
    font-size: 28px !important;
    cursor: pointer !important;
    z-index: 9999999 !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    animation: pulse 2s infinite !important;
  `;

  // Adicionar animação CSS
  if (!document.getElementById("icon-animation")) {
    const style = document.createElement("style");
    style.id = "icon-animation";
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    console.log("✅ Abrindo modal SIMPLES");
    this.style.background = "#00cc00";
    setTimeout(() => (this.style.background = "#007784"), 300);

    showSimpleModal();
  });

  document.body.appendChild(btn);
}

// Modal ULTRA simples
function showSimpleModal() {
  // Remover modal existente
  const existing = document.getElementById("simple-modal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "simple-modal";
  modal.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: rgba(0,0,0,0.7) !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 9999999 !important;
  `;

  const box = document.createElement("div");
  box.style.cssText = `
    background: white !important;
    padding: 20px !important;
    border-radius: 10px !important;
    max-width: 350px !important;
    width: 85% !important;
    text-align: center !important;
  `;

  box.innerHTML = `
    <h2 style="margin: 0 0 15px 0; color: #007784;">⚙️ Definições</h2>

    <div style="margin-bottom: 15px; text-align: left;">
      <h4 style="margin: 0 0 8px 0; color: #333;">📱 Notificações</h4>
      <button onclick="requestNotif()" style="width: 100%; padding: 8px; background: #007784; color: white; border: none; border-radius: 4px; margin-bottom: 5px; cursor: pointer;">
        🔔 Ativar
      </button>
      <input type="text" id="msg" placeholder="Mensagem teste" value="Teste" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 5px; box-sizing: border-box;">
      <button onclick="sendNotif()" style="width: 100%; padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
        🧪 Testar
      </button>
      <div id="notif-result" style="margin-top: 5px; font-size: 12px; display: none;"></div>
    </div>

    <div style="background: #fff3cd; padding: 10px; border-radius: 6px; margin-bottom: 15px;">
      <h4 style="margin: 0 0 5px 0; color: #856404;">🗑️ Eliminar Dados</h4>
      <div style="display: flex; gap: 5px; margin-bottom: 8px; font-size: 11px;">
        <div style="flex: 1; background: white; padding: 4px; border-radius: 3px; text-align: center;">
          <div>🏗️</div>
          <div>Obras</div>
          <div id="obras" style="font-weight: bold; color: #007784;">0</div>
        </div>
        <div style="flex: 1; background: white; padding: 4px; border-radius: 3px; text-align: center;">
          <div>🔧</div>
          <div>Manutenções</div>
          <div id="manut" style="font-weight: bold; color: #007784;">0</div>
        </div>
        <div style="flex: 1; background: white; padding: 4px; border-radius: 3px; text-align: center;">
          <div>🏊</div>
          <div>Piscinas</div>
          <div id="pisc" style="font-weight: bold; color: #007784;">0</div>
        </div>
      </div>
      <button onclick="deleteAll()" style="width: 100%; padding: 8px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
        💣 ELIMINAR TUDO
      </button>
      <div id="delete-result" style="margin-top: 5px; font-size: 12px; display: none;"></div>
    </div>

    <button onclick="closeModal()" style="width: 100%; padding: 10px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
      Fechar
    </button>
  `;

  modal.appendChild(box);
  document.body.appendChild(modal);

  // Fechar clicando fora
  modal.addEventListener("click", function (e) {
    if (e.target === this) closeModal();
  });

  loadCounts();
  console.log("✅ Modal simples criado");
}

// Funções globais
window.requestNotif = async function () {
  try {
    if (!("Notification" in window)) {
      showResult("notif-result", "Não suportado", "red");
      return;
    }
    const perm = await Notification.requestPermission();
    showResult(
      "notif-result",
      perm === "granted" ? "✅ Ativado!" : "❌ Negado",
      perm === "granted" ? "green" : "red",
    );
  } catch (e) {
    showResult("notif-result", "❌ Erro", "red");
  }
};

window.sendNotif = function () {
  const msg = document.getElementById("msg").value || "Teste";
  if (Notification.permission === "granted") {
    new Notification("Leirisonda", { body: msg, icon: "/leirisonda-logo.svg" });
    showResult("notif-result", "✅ Enviado!", "green");
  } else {
    showResult("notif-result", "❌ Ative primeiro", "red");
  }
};

window.deleteAll = function () {
  if (
    !confirm(
      "⚠️ ELIMINAR TODOS OS DADOS?\nObras, Manutenções, Piscinas!\nNÃO pode ser desfeito!",
    )
  )
    return;
  if (!confirm("🔥 CONFIRMAÇÃO FINAL!\nClique OK para ELIMINAR TUDO!")) return;

  const keys = [
    "leirisonda_works",
    "leirisonda_maintenances",
    "leirisonda_pools",
    "works",
    "maintenances",
    "pools",
  ];
  let count = 0;
  keys.forEach((k) => {
    if (localStorage.getItem(k)) {
      localStorage.removeItem(k);
      count++;
    }
  });

  showResult("delete-result", `✅ ${count} eliminados!`, "green");
  loadCounts();

  if (Notification.permission === "granted") {
    new Notification("Leirisonda", {
      body: "Dados eliminados!",
      icon: "/leirisonda-logo.svg",
    });
  }
};

window.closeModal = function () {
  const modal = document.getElementById("simple-modal");
  if (modal) modal.remove();
};

function loadCounts() {
  try {
    const w = JSON.parse(
      localStorage.getItem("leirisonda_works") || "[]",
    ).length;
    const m = JSON.parse(
      localStorage.getItem("leirisonda_maintenances") || "[]",
    ).length;
    const p = JSON.parse(
      localStorage.getItem("leirisonda_pools") || "[]",
    ).length;

    document.getElementById("obras").textContent = w;
    document.getElementById("manut").textContent = m;
    document.getElementById("pisc").textContent = p;
  } catch (e) {
    document.getElementById("obras").textContent = "0";
    document.getElementById("manut").textContent = "0";
    document.getElementById("pisc").textContent = "0";
  }
}

function showResult(id, text, color) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = "block";
    el.style.color = color;
    el.textContent = text;
    setTimeout(() => (el.style.display = "none"), 2000);
  }
}

// Executar IMEDIATAMENTE e múltiplas vezes
console.log("🚀 Iniciando criação de ícone...");
createSimpleIcon();

setTimeout(createSimpleIcon, 500);
setTimeout(createSimpleIcon, 1000);
setTimeout(createSimpleIcon, 2000);
setTimeout(createSimpleIcon, 3000);
setTimeout(createSimpleIcon, 5000);

// Monitorar constantemente
setInterval(() => {
  const hasIcon =
    document.querySelector('button[style*="position: fixed"]') ||
    document.getElementById("settings-icon") ||
    document.querySelector('[id*="icon"]');

  if (!hasIcon) {
    console.log("🔄 Ícone não encontrado, recriando...");
    createSimpleIcon();
  }
}, 1000);

// Observer para detectar mudanças no DOM
const observer = new MutationObserver(() => {
  setTimeout(createSimpleIcon, 200);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

console.log("✅ FORÇA modal carregado - redirecionamentos BLOQUEADOS");
