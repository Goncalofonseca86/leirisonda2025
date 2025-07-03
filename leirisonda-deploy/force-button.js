// BOTÃO DEFINIÇÕES ULTRA ROBUSTO
console.log("🚀 INICIANDO BOTÃO ULTRA ROBUSTO");

// Criar botão
function createButton() {
  if (document.getElementById("SETTINGS-BTN")) {
    return;
  }

  try {
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
      user-select: none !important;
    `;

    // Click com proteção por senha
    btn.addEventListener("click", function (e) {
      try {
        e.preventDefault();
        e.stopPropagation();

        console.log("✅ BOTÃO CLICADO!");

        // Feedback visual
        this.style.background = "#00ff00";

        setTimeout(() => {
          this.style.background = "#007784";
          requestPassword();
        }, 200);
      } catch (error) {
        console.error("Erro no clique:", error);
      }
    });

  document.body.appendChild(btn);
  console.log("✅ Botão criado com sucesso");
}

// Solicitar palavra-passe
function requestPassword() {
  try {
    console.log("🔐 Solicitando palavra-passe");

    // Remove modal de senha existente
    const existing = document.getElementById("PASSWORD-MODAL");
    if (existing) {
      existing.remove();
    }

    const modal = document.createElement("div");
    modal.id = "PASSWORD-MODAL";
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
    `;

    const content = document.createElement("div");
    content.style.cssText = `
      background: white !important;
      padding: 30px !important;
      border-radius: 15px !important;
      max-width: 350px !important;
      width: 90% !important;
      text-align: center !important;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
    `;

    content.innerHTML = `
      <h2 style="color: #007784; margin-bottom: 20px;">🔐 Acesso Restrito</h2>
      <p style="color: #666; margin-bottom: 20px; font-size: 14px;">
        Introduza a palavra-passe para aceder às definições:
      </p>
      <input
        type="password"
        id="admin-password"
        placeholder="Palavra-passe de administração"
        style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; margin-bottom: 15px; box-sizing: border-box; font-size: 16px; text-align: center;"
        autocomplete="off"
      >
      <div id="password-error" style="color: #dc3545; font-size: 13px; margin-bottom: 15px; display: none;"></div>
      <div style="display: flex; gap: 10px;">
        <button
          onclick="cancelPassword()"
          style="flex: 1; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer;"
        >
          Cancelar
        </button>
        <button
          onclick="checkPassword()"
          style="flex: 1; padding: 12px; background: #007784; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;"
        >
          Entrar
        </button>
      </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Focar no input
    setTimeout(() => {
      const input = document.getElementById("admin-password");
      if (input) {
        input.focus();
      }
    }, 100);

    // Enter para submeter
    const input = document.getElementById("admin-password");
    if (input) {
      input.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
          checkPassword();
        }
      });
    }

    console.log("✅ Modal de senha aberto");
  } catch (error) {
    console.error("Erro ao solicitar senha:", error);
  }
}

// Modal ultra simples
function showModal() {
  try {
    console.log("🔄 Abrindo modal");

    // Remove modal existente
    const existing = document.getElementById("MODAL");
    if (existing) {
      existing.remove();
    }

    const modal = document.createElement("div");
    modal.id = "MODAL";
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
        <div id="browser-info" style="font-size: 12px; padding: 8px; background: #f8f9fa; border-radius: 4px; margin-bottom: 8px; color: #666;">
          🔍 A verificar suporte do browser...
        </div>
        <button onclick="activateNotifications()" style="width: 100%; padding: 10px; background: #007784; color: white; border: none; border-radius: 6px; margin-bottom: 8px; cursor: pointer;">
          🔔 Ativar Notificações
        </button>
        <input type="text" id="test-message" placeholder="Mensagem teste" value="Teste Leirisonda" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 8px; box-sizing: border-box;">
        <button onclick="testNotification()" style="width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer;">
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
            <div id="works-count" style="color: #007784; font-weight: bold;">-</div>
          </div>
          <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; font-size: 12px;">
            <div style="font-size: 18px;">🔧</div>
            <div style="font-weight: bold;">Manutenções</div>
            <div id="maint-count" style="color: #007784; font-weight: bold;">-</div>
          </div>
          <div style="text-align: center; padding: 8px; background: white; border-radius: 6px; font-size: 12px;">
            <div style="font-size: 18px;">🏊</div>
            <div style="font-weight: bold;">Piscinas</div>
            <div id="pools-count" style="color: #007784; font-weight: bold;">-</div>
          </div>
        </div>

        <button onclick="deleteAllData()" style="width: 100%; padding: 12px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          💣 ELIMINAR TUDO
        </button>
        <div id="delete-info" style="margin-top: 8px; font-size: 13px; display: none;"></div>
      </div>

      <button onclick="closeModal()" style="width: 100%; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer;">
        Fechar
      </button>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Fechar clicando fora
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal();
      }
    });

    // Carregar dados e verificar compatibilidade
    loadCounts();
    checkBrowserCompatibility();

    console.log("✅ Modal aberto");
  } catch (error) {
    console.error("Erro ao abrir modal:", error);
  }
}

// Verificar palavra-passe
window.checkPassword = function() {
  try {
    const input = document.getElementById("admin-password");
    const errorDiv = document.getElementById("password-error");

    if (!input) return;

    const password = input.value.trim();

    // Palavra-passe de administração (pode alterar aqui)
    const adminPassword = "19867"; // Mesmo que na página admin.html

    if (password === "") {
      showPasswordError("Introduza a palavra-passe");
      return;
    }

    if (password === adminPassword) {
      console.log("✅ Palavra-passe correta");
      cancelPassword();
      showModal();
    } else {
      console.log("❌ Palavra-passe incorreta");
      showPasswordError("❌ Palavra-passe incorreta");

      // Limpar campo e focar novamente
      input.value = "";
      input.focus();
    }
  } catch (error) {
    console.error("Erro ao verificar senha:", error);
  }
};

// Cancelar entrada de senha
window.cancelPassword = function() {
  try {
    const modal = document.getElementById("PASSWORD-MODAL");
    if (modal) {
      modal.remove();
    }
    console.log("✅ Modal de senha fechado");
  } catch (error) {
    console.error("Erro ao cancelar senha:", error);
  }
};

// Mostrar erro de senha
function showPasswordError(message) {
  try {
    const errorDiv = document.getElementById("password-error");
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = "block";

      setTimeout(() => {
        errorDiv.style.display = "none";
      }, 3000);
    }
  } catch (error) {
    console.error("Erro ao mostrar erro de senha:", error);
  }
}

// Funções globais simples
window.activateNotifications = function () {
  try {
    console.log("🔔 Ativando notificações...");
    console.log("User Agent:", navigator.userAgent);
    console.log("Notification in window:", "Notification" in window);
    console.log("Service Worker:", "serviceWorker" in navigator);

    // Verificar múltiplas formas de suporte
    const hasNotificationAPI = "Notification" in window;
    const hasServiceWorker = "serviceWorker" in navigator;
    const isPWA =
      window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches;

    console.log("PWA mode:", isPWA);

    if (!hasNotificationAPI && !hasServiceWorker) {
      console.log("❌ Notificações não suportadas");
      showInfo("notif-info", "❌ Browser não suporta notificações", "red");
      return;
    }

    if (!hasNotificationAPI && hasServiceWorker) {
      console.log("⚠️ Usando Service Worker para notificações");
      showInfo("notif-info", "ℹ️ Notificações via Service Worker", "orange");
      return;
    }

    console.log("Permissão atual:", Notification.permission);

    if (Notification.permission === "granted") {
      showInfo("notif-info", "✅ Já estão ativadas!", "green");
      return;
    }

    if (Notification.permission === "denied") {
      showInfo(
        "notif-info",
        "❌ Permissão bloqueada. Ative nas definições do browser.",
        "red",
      );
      return;
    }

    // Solicitar permissão
    if (Notification.requestPermission) {
      Notification.requestPermission()
        .then((permission) => {
          console.log("Nova permissão:", permission);
          if (permission === "granted") {
            showInfo("notif-info", "✅ Notificações ativadas!", "green");
          } else {
            showInfo("notif-info", "❌ Permissão negada", "red");
          }
        })
        .catch((error) => {
          console.error("Erro ao solicitar permissão:", error);
          showInfo("notif-info", "❌ Erro ao solicitar permissão", "red");
        });
    } else {
      showInfo("notif-info", "❌ API não suportada", "red");
    }
  } catch (error) {
    console.error("Erro ao ativar notificações:", error);
    showInfo("notif-info", `❌ Erro: ${error.message}`, "red");
  }
};

window.testNotification = function () {
  try {
    console.log("🧪 Testando notificação...");
    console.log("Browser:", navigator.userAgent);

    // Verificar múltiplas formas de suporte
    if (!("Notification" in window)) {
      if ("serviceWorker" in navigator) {
        showInfo(
          "notif-info",
          "ℹ️ Use Service Worker para notificações",
          "orange",
        );
        // Tentar via service worker
        tryServiceWorkerNotification();
        return;
      } else {
        showInfo("notif-info", "❌ Browser não suporta notificações", "red");
        return;
      }
    }

    // Verificar permissão
    console.log("Permissão atual:", Notification.permission);

    if (Notification.permission !== "granted") {
      showInfo("notif-info", "❌ Ative notificações primeiro", "red");
      return;
    }

    const msgEl = document.getElementById("test-message");
    const msg = msgEl ? msgEl.value || "Teste" : "Teste";

    console.log("Criando notificação com mensagem:", msg);

    // Criar notificação com configuração mínima
    const notification = new Notification("Leirisonda", {
      body: msg,
      icon: "/leirisonda-logo.svg",
      tag: "test-notification",
      requireInteraction: false,
    });

    // Listener para sucesso
    notification.onshow = function () {
      console.log("✅ Notificação mostrada");
      showInfo("notif-info", "✅ Notificação enviada!", "green");
    };

    // Listener para erro
    notification.onerror = function (error) {
      console.error("Erro na notificação:", error);
      showInfo("notif-info", "❌ Erro ao enviar", "red");
    };

    // Fechar automaticamente após 3 segundos
    setTimeout(() => {
      if (notification) {
        notification.close();
      }
    }, 3000);
  } catch (error) {
    console.error("Erro no teste de notificação:", error);
    showInfo("notif-info", `❌ Erro: ${error.message}`, "red");
  }
};

// Tentar notificação via Service Worker
function tryServiceWorkerNotification() {
  try {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      const msgEl = document.getElementById("test-message");
      const msg = msgEl ? msgEl.value || "Teste via SW" : "Teste via SW";

      navigator.serviceWorker.controller.postMessage({
        type: "SHOW_NOTIFICATION",
        title: "Leirisonda",
        body: msg,
        icon: "/leirisonda-logo.svg",
      });

      showInfo("notif-info", "📡 Tentativa via Service Worker", "blue");
    } else {
      showInfo("notif-info", "❌ Service Worker não disponível", "red");
    }
  } catch (error) {
    console.error("Erro Service Worker notification:", error);
    showInfo("notif-info", "❌ Erro no Service Worker", "red");
  }
}

window.deleteAllData = function () {
  try {
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

    let deleted = 0;
    keys.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        deleted++;
      }
    });

    showInfo("delete-info", `✅ ${deleted} tipos eliminados!`, "green");
    loadCounts();

    // Tentar notificação se suportada
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Leirisonda", {
          body: "Dados eliminados!",
          icon: "/leirisonda-logo.svg",
          tag: "delete-notification"
        });
      }
    } catch (notifError) {
      console.log("Notificação não enviada:", notifError.message);
    }
  } catch (error) {
    console.error("Erro ao eliminar:", error);
    showInfo("delete-info", "❌ Erro ao eliminar", "red");
  }
};

window.closeModal = function () {
  try {
    const modal = document.getElementById("MODAL");
    if (modal) {
      modal.remove();
    }
    console.log("✅ Modal fechado");
  } catch (error) {
    console.error("Erro ao fechar modal:", error);
  }
};

// Carregar contadores
function loadCounts() {
  try {
    let works = 0;
    let maint = 0;
    let pools = 0;

    try {
      works = JSON.parse(
        localStorage.getItem("leirisonda_works") || "[]",
      ).length;
    } catch (e) {
      works = 0;
    }

    try {
      maint = JSON.parse(
        localStorage.getItem("leirisonda_maintenances") || "[]",
      ).length;
    } catch (e) {
      maint = 0;
    }

    try {
      pools = JSON.parse(
        localStorage.getItem("leirisonda_pools") || "[]",
      ).length;
    } catch (e) {
      pools = 0;
    }

    const worksEl = document.getElementById("works-count");
    const maintEl = document.getElementById("maint-count");
    const poolsEl = document.getElementById("pools-count");

    if (worksEl) worksEl.textContent = works;
    if (maintEl) maintEl.textContent = maint;
    if (poolsEl) poolsEl.textContent = pools;
  } catch (error) {
    console.error("Erro ao carregar contadores:", error);
  }
}

// Verificar compatibilidade do browser
function checkBrowserCompatibility() {
  try {
    const infoEl = document.getElementById("browser-info");
    if (!infoEl) return;

    const hasNotifications = "Notification" in window;
    const hasServiceWorker = "serviceWorker" in navigator;
    const isPWA =
      window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    let info = "";
    let color = "#666";

    if (hasNotifications) {
      info = "✅ Notificações suportadas";
      color = "#28a745";
    } else if (hasServiceWorker) {
      info = "⚠️ Notificações via Service Worker";
      color = "#ffc107";
    } else if (isIOS) {
      info = "📱 iOS: Adicione à tela inicial primeiro";
      color = "#007AFF";
    } else if (isAndroid) {
      info = "🤖 Android: Verifique permissões do browser";
      color = "#FF9800";
    } else {
      info = "❌ Browser não suporta notificações";
      color = "#dc3545";
    }

    if (isPWA) {
      info = "📲 PWA: " + info;
    }

    infoEl.textContent = info;
    infoEl.style.color = color;
    infoEl.style.display = "block";
  } catch (error) {
    console.error("Erro ao verificar compatibilidade:", error);
  }
}

// Mostrar info temporária
function showInfo(id, text, color) {
  try {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = "block";
      el.style.color = color;
      el.textContent = text;
      setTimeout(() => {
        if (el && el.style) {
          el.style.display = "none";
        }
      }, 3000);
    }
  } catch (error) {
    console.error("Erro ao mostrar info:", error);
  }
}

// EXECUTAR
try {
  createButton();

  // Verificar constantemente
  setInterval(() => {
    if (!document.getElementById("SETTINGS-BTN")) {
      console.log("🔄 Recriando botão");
      createButton();
    }
  }, 1000);

  console.log("✅ Script ultra robusto carregado");
} catch (error) {
  console.error("Erro crítico:", error);
}