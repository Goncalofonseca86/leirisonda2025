// BOTÃO DEFINIÇÕES COM PROTEÇÃO POR SENHA
console.log("🚀 INICIANDO BOTÃO COM PROTEÇÃO");

// Verificar se está na página de login
function isLoginPage() {
  // Verificar URL
  const isLoginURL =
    window.location.pathname === "/login" ||
    window.location.pathname === "/" ||
    window.location.hash.includes("login");

  // Verificar elementos específicos do login
  const hasLoginText =
    document.body.textContent.includes("A carregar...") ||
    document.body.textContent.includes("redirecionado automaticamente") ||
    document.querySelector('[data-loc*="ProtectedRoute"]');

  return isLoginURL || hasLoginText;
}

// Criar botão discreto
function createButton() {
  if (document.getElementById("SETTINGS-BTN")) {
    return;
  }

  // Só criar se estiver na página de login
  if (!isLoginPage()) {
    return;
  }

  try {
    console.log("➕ Criando botão discreto na página de login");

    const btn = document.createElement("div");
    btn.id = "SETTINGS-BTN";
    btn.innerHTML = "⚙️";
    btn.style.cssText = `
      position: fixed !important;
      bottom: 20px !important;
      left: 20px !important;
      width: 35px !important;
      height: 35px !important;
      background: rgba(0, 119, 132, 0.7) !important;
      color: rgba(255, 255, 255, 0.8) !important;
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
      border-radius: 50% !important;
      font-size: 16px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      z-index: 999999 !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
      user-select: none !important;
      opacity: 0.6 !important;
      transition: all 0.3s ease !important;
    `;

    // Hover effects
    btn.addEventListener("mouseenter", function () {
      this.style.opacity = "1";
      this.style.transform = "scale(1.1)";
      this.style.background = "rgba(0, 119, 132, 0.9)";
    });

    btn.addEventListener("mouseleave", function () {
      this.style.opacity = "0.6";
      this.style.transform = "scale(1)";
      this.style.background = "rgba(0, 119, 132, 0.7)";
    });

    // Click com proteção por senha
    btn.addEventListener("click", function (e) {
      try {
        e.preventDefault();
        e.stopPropagation();

        console.log("✅ BOTÃO DISCRETO CLICADO - SOLICITANDO SENHA");

        // Feedback visual
        this.style.background = "rgba(255, 193, 7, 0.9)";
        this.style.transform = "scale(1.2)";

        setTimeout(() => {
          this.style.background = "rgba(0, 119, 132, 0.7)";
          this.style.transform = "scale(1)";
          requestPassword();
        }, 200);
      } catch (error) {
        console.error("Erro no clique:", error);
      }
    });

    document.body.appendChild(btn);
    console.log("✅ Botão discreto criado na página de login");
  } catch (error) {
    console.error("Erro ao criar botão:", error);
  }
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
      background: rgba(0,0,0,0.9) !important;
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
      box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
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

    // Focar no input e Enter para submeter
    setTimeout(() => {
      const input = document.getElementById("admin-password");
      if (input) {
        input.focus();
        input.addEventListener("keypress", function (e) {
          if (e.key === "Enter") {
            checkPassword();
          }
        });
      }
    }, 100);

    console.log("✅ Modal de senha aberto");
  } catch (error) {
    console.error("Erro ao solicitar senha:", error);
  }
}

// Verificar palavra-passe
window.checkPassword = function () {
  try {
    const input = document.getElementById("admin-password");

    if (!input) return;

    const password = input.value.trim();

    // Palavra-passe de administração
    const adminPassword = "19867";

    if (password === "") {
      showPasswordError("Introduza a palavra-passe");
      return;
    }

    if (password === adminPassword) {
      console.log("✅ Palavra-passe correta - abrindo definições");
      cancelPassword();
      showModal();
    } else {
      console.log("❌ Palavra-passe incorreta");
      showPasswordError("❌ Palavra-passe incorreta");

      // Limpar e focar
      input.value = "";
      input.focus();
    }
  } catch (error) {
    console.error("Erro ao verificar senha:", error);
  }
};

// Cancelar entrada de senha
window.cancelPassword = function () {
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

// Modal de definições (só abre após senha correta)
function showModal() {
  try {
    console.log("🔄 Abrindo modal de definições");

    const existing = document.getElementById("SETTINGS-MODAL");
    if (existing) {
      existing.remove();
    }

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
      <h2 style="color: #007784; margin-bottom: 20px;">⚙️ Definições Administrativas</h2>

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

    console.log("✅ Modal de definições aberto");
  } catch (error) {
    console.error("Erro ao abrir modal:", error);
  }
}

// Funções de notificações
window.activateNotifications = function () {
  try {
    console.log("🔔 Ativando notificações...");

    if (!("Notification" in window)) {
      if ("serviceWorker" in navigator) {
        showInfo(
          "notif-info",
          "ℹ️ Use Service Worker para notificações",
          "orange",
        );
        return;
      } else {
        showInfo("notif-info", "❌ Browser não suporta notificações", "red");
        return;
      }
    }

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

    Notification.requestPermission()
      .then((permission) => {
        if (permission === "granted") {
          showInfo("notif-info", "✅ Notificações ativadas!", "green");
        } else {
          showInfo("notif-info", "❌ Permissão negada", "red");
        }
      })
      .catch((error) => {
        showInfo("notif-info", "❌ Erro ao solicitar permissão", "red");
      });
  } catch (error) {
    console.error("Erro ao ativar notificações:", error);
    showInfo("notif-info", `❌ Erro: ${error.message}`, "red");
  }
};

window.testNotification = function () {
  try {
    console.log("🧪 Testando notificação...");

    if (!("Notification" in window)) {
      showInfo("notif-info", "❌ Browser não suporta notificações", "red");
      return;
    }

    if (Notification.permission !== "granted") {
      showInfo("notif-info", "❌ Ative notificações primeiro", "red");
      return;
    }

    const msgEl = document.getElementById("test-message");
    const msg = msgEl ? msgEl.value || "Teste" : "Teste";

    const notification = new Notification("Leirisonda", {
      body: msg,
      icon: "/leirisonda-logo.svg",
      tag: "test-notification",
    });

    notification.onshow = function () {
      showInfo("notif-info", "✅ Notificação enviada!", "green");
    };

    notification.onerror = function (error) {
      showInfo("notif-info", "❌ Erro ao enviar", "red");
    };

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

window.deleteAllData = function () {
  try {
    console.log("🗑️ Iniciando análise completa do localStorage...");

    // PRIMEIRO: Mostrar TODOS os dados existentes
    const allKeys = Object.keys(localStorage);
    console.log("📋 TODAS as chaves no localStorage:", allKeys);

    let debugInfo = "🔍 DADOS ENCONTRADOS:\n\n";
    allKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      const preview =
        value.length > 100 ? value.substring(0, 100) + "..." : value;
      debugInfo += `${key}: ${preview}\n`;
      console.log(`📦 ${key}:`, value);
    });

    // Mostrar numa caixa de diálogo
    alert(debugInfo);

    if (
      !confirm(
        "⚠️ ELIMINAR TODOS OS DADOS?\n\nViu a lista acima. Quer continuar?\n\nNÃO pode ser desfeito!",
      )
    ) {
      return;
    }

    if (
      !confirm(
        "🔥 CONFIRMAÇÃO FINAL!\n\nEsta ação elimina TUDO do localStorage!\n\nClique OK para ELIMINAR TUDO!",
      )
    ) {
      return;
    }

    // ELIMINAÇÃO AGRESSIVA: Todas as chaves que possam ser da aplicação
    let deleted = 0;
    let foundKeys = [];
    const keysToDelete = [];

    allKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      const shouldDelete =
        // Palavras-chave relacionadas com a aplicação
        key.toLowerCase().includes("work") ||
        key.toLowerCase().includes("maintenance") ||
        key.toLowerCase().includes("pool") ||
        key.toLowerCase().includes("leirisonda") ||
        key.toLowerCase().includes("obra") ||
        key.toLowerCase().includes("piscina") ||
        key.toLowerCase().includes("user") ||
        key.toLowerCase().includes("auth") ||
        key.toLowerCase().includes("login") ||
        key.toLowerCase().includes("session") ||
        // Valores que parecem arrays de dados
        (value && value.startsWith("[") && value.includes("{")) ||
        // Valores que parecem objetos de configuração
        (value &&
          value.startsWith("{") &&
          (value.includes("name") ||
            value.includes("email") ||
            value.includes("id") ||
            value.includes("data")));

      if (shouldDelete) {
        keysToDelete.push(key);
      }
    });

    console.log("🎯 Chaves identificadas para eliminação:", keysToDelete);

    // Confirmar chaves específicas
    if (keysToDelete.length > 0) {
      const keysList = keysToDelete.join("\n");
      if (
        !confirm(
          `🔍 Encontradas ${keysToDelete.length} chaves para eliminar:\n\n${keysList}\n\nContinuar?`,
        )
      ) {
        return;
      }
    }

    // Eliminar cada chave identificada
    keysToDelete.forEach((key) => {
      console.log(`🗑️ Eliminando: ${key}`);
      localStorage.removeItem(key);
      deleted++;
      foundKeys.push(key);
    });

    // Se não encontrou nada específico, oferecer para limpar TUDO
    if (deleted === 0) {
      if (
        confirm(
          "❓ Não foram encontrados dados específicos.\n\nLimpar COMPLETAMENTE o localStorage?\n\n⚠️ Isto remove TUDO, incluindo outras aplicações!",
        )
      ) {
        localStorage.clear();
        deleted = allKeys.length;
        foundKeys = [...allKeys];
        console.log("🧹 localStorage completamente limpo!");
      }
    }

    console.log(`✅ Total eliminado: ${deleted} chaves`);
    console.log("🗑️ Chaves eliminadas:", foundKeys);

    if (deleted > 0) {
      showInfo("delete-info", `✅ ${deleted} chaves eliminadas!`, "green");

      // Mostrar resultado detalhado
      setTimeout(() => {
        alert(
          `✅ ELIMINAÇÃO CONCLUÍDA!\n\n📊 ${deleted} chaves eliminadas:\n${foundKeys.join("\n")}`,
        );
      }, 1000);
    } else {
      showInfo("delete-info", "ℹ️ Nenhum dado foi eliminado", "orange");
    }

    // Recarregar contadores
    loadCounts();

    // Tentar notificação se suportada
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Leirisonda", {
          body: `${deleted} chaves eliminadas do localStorage!`,
          icon: "/leirisonda-logo.svg",
          tag: "delete-notification",
        });
      }
    } catch (notifError) {
      console.log("Notificação não enviada:", notifError.message);
    }

    // Forçar refresh da página
    if (deleted > 0) {
      setTimeout(() => {
        if (confirm("🔄 Dados eliminados! Atualizar página agora?")) {
          window.location.reload();
        }
      }, 2000);
    }
  } catch (error) {
    console.error("Erro ao eliminar:", error);
    showInfo("delete-info", `❌ Erro: ${error.message}`, "red");
  }
};

window.closeModal = function () {
  try {
    const modal = document.getElementById("SETTINGS-MODAL");
    if (modal) {
      modal.remove();
    }
    console.log("✅ Modal de definições fechado");
  } catch (error) {
    console.error("Erro ao fechar modal:", error);
  }
};

// Carregar contadores
function loadCounts() {
  try {
    console.log("📊 Carregando contadores de dados...");

    let works = 0;
    let maint = 0;
    let pools = 0;

    // Lista de todas as possíveis chaves para cada tipo
    const workKeys = [
      "leirisonda_works",
      "works",
      "leirisonda-works",
      "app-works",
      "data-works",
    ];
    const maintKeys = [
      "leirisonda_maintenances",
      "maintenances",
      "leirisonda-maintenances",
      "app-maintenances",
      "data-maintenances",
    ];
    const poolKeys = [
      "leirisonda_pools",
      "pools",
      "leirisonda-pools",
      "app-pools",
      "data-pools",
    ];

    // Verificar obras
    workKeys.forEach((key) => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`📦 Obras encontradas em ${key}:`, data);
          const count = JSON.parse(data).length;
          works = Math.max(works, count);
        }
      } catch (e) {
        // Ignorar erros de parsing
      }
    });

    // Verificar manutenções
    maintKeys.forEach((key) => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`🔧 Manutenções encontradas em ${key}:`, data);
          const count = JSON.parse(data).length;
          maint = Math.max(maint, count);
        }
      } catch (e) {
        // Ignorar erros de parsing
      }
    });

    // Verificar piscinas
    poolKeys.forEach((key) => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`🏊 Piscinas encontradas em ${key}:`, data);
          const count = JSON.parse(data).length;
          pools = Math.max(pools, count);
        }
      } catch (e) {
        // Ignorar erros de parsing
      }
    });

    // Verificar todas as chaves do localStorage para dados não identificados
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (
        key.toLowerCase().includes("work") ||
        key.toLowerCase().includes("obra")
      ) {
        try {
          const data = localStorage.getItem(key);
          if (data && data.startsWith("[")) {
            const count = JSON.parse(data).length;
            if (count > works) {
              console.log(`🔍 Mais obras encontradas em ${key}: ${count}`);
              works = count;
            }
          }
        } catch (e) {}
      }

      if (
        key.toLowerCase().includes("maintenance") ||
        key.toLowerCase().includes("manutencao")
      ) {
        try {
          const data = localStorage.getItem(key);
          if (data && data.startsWith("[")) {
            const count = JSON.parse(data).length;
            if (count > maint) {
              console.log(
                `🔍 Mais manutenções encontradas em ${key}: ${count}`,
              );
              maint = count;
            }
          }
        } catch (e) {}
      }

      if (
        key.toLowerCase().includes("pool") ||
        key.toLowerCase().includes("piscina")
      ) {
        try {
          const data = localStorage.getItem(key);
          if (data && data.startsWith("[")) {
            const count = JSON.parse(data).length;
            if (count > pools) {
              console.log(`🔍 Mais piscinas encontradas em ${key}: ${count}`);
              pools = count;
            }
          }
        } catch (e) {}
      }
    });

    console.log(
      `📊 Contadores finais - Obras: ${works}, Manutenções: ${maint}, Piscinas: ${pools}`,
    );

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

  // Verificar constantemente (só na página de login)
  setInterval(() => {
    const buttonExists = document.getElementById("SETTINGS-BTN");
    const shouldShow = isLoginPage();

    if (shouldShow && !buttonExists) {
      console.log("🔄 Recriando botão discreto na página de login");
      createButton();
    } else if (!shouldShow && buttonExists) {
      console.log("🗑️ Removendo botão (não é página de login)");
      buttonExists.remove();
    }
  }, 1000);

  console.log("✅ Script com proteção por senha carregado");
} catch (error) {
  console.error("Erro crítico:", error);
}
