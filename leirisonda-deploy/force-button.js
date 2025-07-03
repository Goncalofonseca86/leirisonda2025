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

        <button onclick="inspectData()" style="width: 100%; padding: 8px; background: #17a2b8; color: white; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 8px; font-size: 14px;">
          🔍 ANALISAR DADOS
        </button>
        <button onclick="deleteLocalData()" style="width: 100%; padding: 10px; background: #fd7e14; color: white; border: none; border-radius: 6px; cursor: pointer; margin-bottom: 8px; font-weight: bold;">
          🗑️ ELIMINAR LOCAIS
        </button>
        <button onclick="debugAndDelete()" style="width: 100%; padding: 12px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          🔍 DEBUG + ELIMINAR FORÇADO
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

// Função para analisar e encontrar EXATAMENTE onde estão os dados
window.inspectData = function () {
  try {
    console.log("🔍 ANÁLISE ULTRA DETALHADA");

    // ANÁLISE 1: localStorage completo
    const allKeys = Object.keys(localStorage);
    console.log("📦 TODAS as chaves localStorage:", allKeys);

    let foundWorks = [];
    let foundMaintenances = [];
    let foundPools = [];
    let otherData = [];

    allKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      console.log(`🔑 Analisando: ${key}`);
      console.log(`📄 Valor completo:`, value);

      try {
        if (value.startsWith("[") || value.startsWith("{")) {
          const parsed = JSON.parse(value);

          if (Array.isArray(parsed) && parsed.length > 0) {
            const sample = parsed[0];
            const itemKeys = Object.keys(sample || {});

            console.log(`📋 Chaves do primeiro item:`, itemKeys);
            console.log(`📋 Amostra completa:`, sample);

            // Análise mais rigorosa
            const hasWorkKeywords = itemKeys.some(
              (k) =>
                k.toLowerCase().includes("work") ||
                k.toLowerCase().includes("obra") ||
                k.toLowerCase().includes("project") ||
                k.toLowerCase().includes("job"),
            );

            const hasMaintenanceKeywords = itemKeys.some(
              (k) =>
                k.toLowerCase().includes("maintenance") ||
                k.toLowerCase().includes("manutenc") ||
                k.toLowerCase().includes("service") ||
                k.toLowerCase().includes("repair"),
            );

            const hasPoolKeywords = itemKeys.some(
              (k) =>
                k.toLowerCase().includes("pool") ||
                k.toLowerCase().includes("piscina") ||
                k.toLowerCase().includes("swimming"),
            );

            if (hasWorkKeywords) {
              foundWorks.push({
                key,
                count: parsed.length,
                sample,
                data: parsed,
              });
            } else if (hasMaintenanceKeywords) {
              foundMaintenances.push({
                key,
                count: parsed.length,
                sample,
                data: parsed,
              });
            } else if (hasPoolKeywords) {
              foundPools.push({
                key,
                count: parsed.length,
                sample,
                data: parsed,
              });
            } else if (parsed.length > 0) {
              otherData.push({
                key,
                count: parsed.length,
                sample,
                data: parsed,
              });
            }
          }
        }
      } catch (e) {
        console.log(`❌ Erro ao analisar ${key}:`, e);
      }
    });

    // ANÁLISE 2: Verificar contexto global da aplicação
    console.log("🌐 Verificando contexto global...");
    console.log("window.hr:", typeof window.hr);
    console.log("window.firebase:", typeof window.firebase);
    console.log("window.React:", typeof window.React);

    // Preparar relatório detalhado
    let report = "🎯 DADOS ENCONTRADOS:\n\n";

    if (foundWorks.length > 0) {
      report += "🏗️ OBRAS:\n";
      foundWorks.forEach((item) => {
        report += `   📦 ${item.key}: ${item.count} itens\n`;
        report += `   📋 Estrutura: ${Object.keys(item.sample).join(", ")}\n\n`;
      });
    } else {
      report += "🏗️ OBRAS: Nenhuma encontrada\n\n";
    }

    if (foundMaintenances.length > 0) {
      report += "🔧 MANUTENÇÕES:\n";
      foundMaintenances.forEach((item) => {
        report += `   📦 ${item.key}: ${item.count} itens\n`;
        report += `   📋 Estrutura: ${Object.keys(item.sample).join(", ")}\n\n`;
      });
    } else {
      report += "🔧 MANUTENÇÕES: Nenhuma encontrada\n\n";
    }

    if (foundPools.length > 0) {
      report += "🏊 PISCINAS:\n";
      foundPools.forEach((item) => {
        report += `   📦 ${item.key}: ${item.count} itens\n`;
        report += `   📋 Estrutura: ${Object.keys(item.sample).join(", ")}\n\n`;
      });
    } else {
      report += "🏊 PISCINAS: Nenhuma encontrada\n\n";
    }

    if (otherData.length > 0) {
      report += "❓ OUTROS DADOS:\n";
      otherData.forEach((item) => {
        report += `   📦 ${item.key}: ${item.count} itens\n`;
        report += `   📋 Estrutura: ${Object.keys(item.sample).join(", ")}\n\n`;
      });
    }

    // Armazenar dados encontrados globalmente para eliminação direcionada
    window.detectedData = {
      works: foundWorks,
      maintenances: foundMaintenances,
      pools: foundPools,
      other: otherData,
    };

    console.log("🎯 DADOS DETECTADOS E ARMAZENADOS:", window.detectedData);

    // Mostrar relatório interativo
    const element = document.createElement("div");
    element.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      background: white; padding: 20px; border-radius: 10px;
      max-width: 90%; max-height: 80%; overflow: auto;
      z-index: 10000000; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      font-family: monospace; font-size: 11px; line-height: 1.3;
      border: 2px solid #007784;
    `;
    element.innerHTML = `
      <h3 style="color: #007784; text-align: center;">🔍 Análise Ultra Detalhada</h3>
      <pre style="white-space: pre-wrap; margin: 10px 0; max-height: 300px; overflow: auto;">${report}</pre>
      <div style="text-align: center; margin: 15px 0;">
        <button onclick="deleteDetectedData()"
                style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px; font-weight: bold;">
          💣 ELIMINAR DADOS DETECTADOS
        </button>
        <button onclick="this.parentElement.parentElement.remove()"
                style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Fechar
        </button>
      </div>
      <div style="font-size: 10px; color: #666; text-align: center;">
        Os dados foram analisados e podem ser eliminados de forma direcionada.
      </div>
    `;
    document.body.appendChild(element);

    const totalFound =
      foundWorks.length +
      foundMaintenances.length +
      foundPools.length +
      otherData.length;
    showInfo(
      "delete-info",
      `🎯 ${totalFound} tipos de dados detectados!`,
      "green",
    );
  } catch (error) {
    console.error("Erro na análise:", error);
    showInfo("delete-info", "❌ Erro na análise", "red");
  }
};

// Função para eliminar dados detectados especificamente
window.deleteDetectedData = function () {
  try {
    if (!window.detectedData) {
      alert("❌ Nenhum dado foi detectado. Execute a análise primeiro!");
      return;
    }

    const data = window.detectedData;
    const totalItems =
      data.works.reduce((sum, item) => sum + item.count, 0) +
      data.maintenances.reduce((sum, item) => sum + item.count, 0) +
      data.pools.reduce((sum, item) => sum + item.count, 0) +
      data.other.reduce((sum, item) => sum + item.count, 0);

    if (totalItems === 0) {
      alert("ℹ️ Nenhum dado foi detectado para eliminar.");
      return;
    }

    const summary = [
      `🏗️ ${data.works.reduce((sum, item) => sum + item.count, 0)} obras`,
      `🔧 ${data.maintenances.reduce((sum, item) => sum + item.count, 0)} manutenções`,
      `🏊 ${data.pools.reduce((sum, item) => sum + item.count, 0)} piscinas`,
      `❓ ${data.other.reduce((sum, item) => sum + item.count, 0)} outros itens`,
    ].join("\n");

    if (
      !confirm(
        `🎯 ELIMINAR DADOS DETECTADOS?\n\nTotal: ${totalItems} itens\n\n${summary}\n\n❌ Esta ação NÃO pode ser desfeita!`,
      )
    ) {
      return;
    }

    if (
      !confirm(
        "🔥 CONFIRMAÇÃO FINAL!\n\nVou eliminar ESPECIFICAMENTE os dados detectados!\n\nTens certeza?",
      )
    ) {
      return;
    }

    console.log("🗑️ Eliminando dados detectados...");
    let eliminated = 0;
    const eliminatedKeys = [];

    // Eliminar chaves específicas detectadas
    [...data.works, ...data.maintenances, ...data.pools, ...data.other].forEach(
      (item) => {
        console.log(`🗑️ Eliminando: ${item.key} (${item.count} itens)`);
        localStorage.removeItem(item.key);
        eliminated++;
        eliminatedKeys.push(item.key);
      },
    );

    console.log(
      `✅ ${eliminated} chaves específicas eliminadas:`,
      eliminatedKeys,
    );

    // Verificar se realmente foram eliminadas
    setTimeout(() => {
      const remaining = eliminatedKeys.filter(
        (key) => localStorage.getItem(key) !== null,
      );

      if (remaining.length === 0) {
        alert(
          `🎉 SUCESSO TOTAL!\n\n✅ ${eliminated} tipos de dados eliminados:\n${eliminatedKeys.join("\n")}\n\n🔄 A página vai ser atualizada...`,
        );

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        alert(
          `⚠️ ${remaining.length} chaves ainda existem:\n${remaining.join("\n")}\n\nTentando eliminar novamente...`,
        );

        // Segunda tentativa
        remaining.forEach((key) => {
          localStorage.removeItem(key);
        });

        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    }, 500);

    showInfo(
      "delete-info",
      `🎯 ${eliminated} tipos eliminados especificamente!`,
      "green",
    );
  } catch (error) {
    console.error("Erro na eliminação direcionada:", error);
    showInfo("delete-info", `❌ Erro: ${error.message}`, "red");
  }
};

// Eliminar apenas dados locais
window.deleteLocalData = function () {
  try {
    console.log("🗑️ ELIMINAÇÃO ULTRA AGRESSIVA INICIADA");

    if (
      !confirm(
        "💣 ELIMINAR TODAS AS OBRAS, MANUTENÇÕES E PISCINAS?\n\nEsta ação vai apagar TUDO!\n\nNÃO pode ser desfeito!",
      )
    ) {
      return;
    }

    if (
      !confirm(
        "🔥 ÚLTIMA CONFIRMAÇÃO!\n\nVou eliminar COMPLETAMENTE o localStorage!\n\nTens a certeza?",
      )
    ) {
      return;
    }

    // MÉTODO 1: Backup das chaves antes de eliminar
    const allKeys = Object.keys(localStorage);
    console.log("📦 Chaves antes da eliminação:", allKeys);

    let eliminated = 0;
    const eliminatedKeys = [];

    // MÉTODO 2: Eliminação TOTAL - Limpar TUDO
    try {
      console.log("🧹 LIMPANDO COMPLETAMENTE O localStorage...");

      // Guardar lista das chaves para log
      allKeys.forEach((key) => {
        eliminatedKeys.push(key);
        eliminated++;
      });

      // LIMPAR TUDO
      localStorage.clear();

      console.log("✅ localStorage.clear() executado");

      // Verificar se realmente limpou
      const remainingKeys = Object.keys(localStorage);
      console.log("🔍 Chaves restantes após clear():", remainingKeys);

      if (remainingKeys.length === 0) {
        console.log("🎉 SUCCESS! localStorage completamente limpo!");
      } else {
        console.log("⚠️ Ainda restam chaves, tentando eliminação manual...");

        // Se ainda restam, eliminar manualmente
        remainingKeys.forEach((key) => {
          try {
            localStorage.removeItem(key);
            console.log(`🗑️ Removido manualmente: ${key}`);
          } catch (e) {
            console.error(`❌ Erro ao remover ${key}:`, e);
          }
        });
      }
    } catch (error) {
      console.error("❌ Erro no localStorage.clear():", error);

      // Fallback: eliminar uma por uma
      allKeys.forEach((key) => {
        try {
          localStorage.removeItem(key);
          eliminatedKeys.push(key);
          eliminated++;
          console.log(`🗑️ Eliminado: ${key}`);
        } catch (e) {
          console.error(`❌ Erro ao eliminar ${key}:`, e);
        }
      });
    }

    // MÉTODO 3: Verificação final
    setTimeout(() => {
      const finalKeys = Object.keys(localStorage);
      console.log("🔍 VERIFICAÇÃO FINAL - Chaves restantes:", finalKeys);

      if (finalKeys.length === 0) {
        console.log("🎉 SUCESSO TOTAL! Todos os dados eliminados!");
        showInfo("delete-info", "🎉 TUDO ELIMINADO COM SUCESSO!", "green");

        alert(
          "🎉 ELIMINAÇÃO CONCLUÍDA!\n\n✅ TODOS os dados foram removidos!\n✅ localStorage completamente limpo!\n\n🔄 A página vai ser atualizada...",
        );

        // Forçar refresh imediato
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.log("⚠️ Ainda restam alguns dados:", finalKeys);
        showInfo(
          "delete-info",
          `⚠️ ${finalKeys.length} chaves ainda restam`,
          "orange",
        );

        if (
          confirm(
            `⚠️ Ainda restam ${finalKeys.length} chaves:\n${finalKeys.join("\n")}\n\nTentar eliminar novamente?`,
          )
        ) {
          // Tentar eliminar as restantes uma vez mais
          finalKeys.forEach((key) => {
            localStorage.removeItem(key);
          });

          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      }
    }, 500);

    console.log(`📊 RELATÓRIO: ${eliminated} chaves processadas`);
    console.log("🗑️ Chaves eliminadas:", eliminatedKeys);
  } catch (error) {
    console.error("💥 ERRO CRÍTICO na eliminação:", error);
    showInfo("delete-info", `❌ ERRO: ${error.message}`, "red");

    // Em caso de erro, tentar limpeza básica
    try {
      localStorage.clear();
      alert(
        "⚠️ Erro durante eliminação, mas localStorage.clear() foi executado!\n\nA página vai ser atualizada...",
      );
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (clearError) {
      alert(
        "❌ ERRO TOTAL! Não foi possível limpar o localStorage.\n\nTenta recarregar a página manualmente.",
      );
    }
  }
};

// Eliminar dados locais + Firebase
window.deleteAllDataIncludingFirebase = function () {
  try {
    console.log("🔥 ELIMINAÇÃO COMPLETA: LOCAL + FIREBASE");

    if (
      !confirm(
        "💥 ELIMINAR TUDO (LOCAL + FIREBASE)?\n\nEsta ação vai eliminar:\n✅ Todos os dados locais\n✅ Todas as obras no Firebase\n✅ Todas as manutenções no Firebase\n✅ Todas as piscinas no Firebase\n\n❌ NÃO PODE SER DESFEITO!",
      )
    ) {
      return;
    }

    if (
      !confirm(
        "🔥 CONFIRMAÇÃO FINAL!\n\nVou eliminar TUDO do localStorage E do Firebase!\n\nTens ABSOLUTA certeza?",
      )
    ) {
      return;
    }

    showInfo(
      "delete-info",
      "🔥 Eliminando dados locais e Firebase...",
      "orange",
    );

    // PASSO 1: Eliminar dados locais
    console.log("📱 PASSO 1: Eliminando dados locais...");
    const localKeys = Object.keys(localStorage);
    localStorage.clear();
    console.log(`✅ ${localKeys.length} chaves locais eliminadas`);

    // PASSO 2: Tentar eliminar dados do Firebase
    console.log("🔥 PASSO 2: Tentando eliminar dados do Firebase...");

    // Verificar se existe a instância Firebase global
    if (typeof window.hr !== "undefined" && window.hr) {
      console.log("📡 Encontrada instância Firebase (hr)");

      // Tentar eliminar através da API da aplicação
      deleteFirebaseDataThroughAPI();
    } else {
      console.log("🔍 Procurando outras formas de aceder ao Firebase...");

      // Tentar encontrar outras instâncias ou métodos
      deleteFirebaseDataDirect();
    }

    // PASSO 3: Resultado final
    setTimeout(() => {
      alert(
        "✅ ELIMINAÇÃO COMPLETA!\n\n📱 Dados locais: ELIMINADOS\n🔥 Firebase: TENTATIVA REALIZADA\n\n🔄 A página vai ser atualizada para refletir as mudanças...",
      );

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }, 2000);
  } catch (error) {
    console.error("💥 ERRO na eliminação completa:", error);
    showInfo("delete-info", `❌ ERRO: ${error.message}`, "red");
  }
};

// Fun��ão para eliminar dados do Firebase através da API da aplicação
function deleteFirebaseDataThroughAPI() {
  try {
    console.log("🎯 Tentando eliminar através da API da aplicação...");

    // Verificar se a instância Firebase está disponível
    if (window.hr && typeof window.hr.isFirebaseAvailable !== "undefined") {
      if (!window.hr.isFirebaseAvailable) {
        console.log("❌ Firebase não está disponível");
        showInfo(
          "delete-info",
          "⚠️ Firebase offline - apenas dados locais eliminados",
          "orange",
        );
        return;
      }

      console.log("✅ Firebase disponível, tentando eliminação...");

      // Tentar eliminar através de métodos da aplicação
      if (typeof window.hr.deleteAllWorks === "function") {
        window.hr
          .deleteAllWorks()
          .then(() => {
            console.log("✅ Obras do Firebase eliminadas");
          })
          .catch((e) => {
            console.error("❌ Erro ao eliminar obras:", e);
          });
      }

      if (typeof window.hr.deleteAllMaintenances === "function") {
        window.hr
          .deleteAllMaintenances()
          .then(() => {
            console.log("✅ Manutenções do Firebase eliminadas");
          })
          .catch((e) => {
            console.error("❌ Erro ao eliminar manutenções:", e);
          });
      }

      if (typeof window.hr.deleteAllPools === "function") {
        window.hr
          .deleteAllPools()
          .then(() => {
            console.log("✅ Piscinas do Firebase eliminadas");
          })
          .catch((e) => {
            console.error("❌ Erro ao eliminar piscinas:", e);
          });
      }

      showInfo(
        "delete-info",
        "🔥 Comandos de eliminação Firebase enviados",
        "blue",
      );
    }
  } catch (error) {
    console.error("❌ Erro na eliminação via API:", error);
  }
}

// Função para tentar eliminação direta do Firebase
function deleteFirebaseDataDirect() {
  try {
    console.log("🔍 Tentando eliminação direta do Firebase...");

    // Tentar executar script direto no console para eliminar coleções
    const firebaseScript = `
      // Script para eliminação de coleções Firebase
      if (typeof firebase !== 'undefined' && firebase.firestore) {
        const db = firebase.firestore();

        // Eliminar coleção 'works'
        db.collection('works').get().then(snapshot => {
          snapshot.forEach(doc => doc.ref.delete());
          console.log('Works collection deleted');
        });

        // Eliminar coleção 'maintenances'
        db.collection('maintenances').get().then(snapshot => {
          snapshot.forEach(doc => doc.ref.delete());
          console.log('Maintenances collection deleted');
        });

        // Eliminar coleção 'pools'
        db.collection('pools').get().then(snapshot => {
          snapshot.forEach(doc => doc.ref.delete());
          console.log('Pools collection deleted');
        });
      }
    `;

    console.log("📋 Script Firebase gerado:", firebaseScript);

    // Tentar executar o script
    try {
      eval(firebaseScript);
      showInfo("delete-info", "📜 Script Firebase executado", "blue");
    } catch (evalError) {
      console.log(
        "⚠️ Não foi possível executar script direto:",
        evalError.message,
      );

      // Mostrar instruções manuais
      console.log(`
🔧 INSTRUÇÕES MANUAIS PARA ELIMINAR FIREBASE:

1. Abre as ferramentas de desenvolvimento (F12)
2. Vai ao separador Console
3. Cola e executa este código:

${firebaseScript}

4. Recarrega a página
      `);

      showInfo(
        "delete-info",
        "📋 Vê instruções no console para Firebase",
        "blue",
      );
    }
  } catch (error) {
    console.error("❌ Erro na eliminação direta:", error);
  }
}

// Função ultra detalhada para debug e eliminação forçada
window.debugAndDelete = function () {
  try {
    console.log("🔍 INICIANDO DEBUG ULTRA DETALHADO");

    if (
      !confirm(
        "🔍 DEBUG + ELIMINAÇÃO FORÇADA\n\nVou mostrar TUDO o que está acontecendo e forçar eliminação.\n\nContinuar?",
      )
    ) {
      return;
    }

    // PASSO 1: Mostrar estado ANTES
    console.log("📊 PASSO 1: Estado ANTES da eliminação");
    const beforeKeys = Object.keys(localStorage);
    console.log("🔑 Chaves ANTES:", beforeKeys);

    beforeKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      console.log(`📦 ${key}:`, value);
    });

    // PASSO 2: Eliminar TUDO com logs detalhados
    console.log("🗑️ PASSO 2: Eliminação FORÇADA");

    let eliminationAttempts = [];

    // Método 1: removeItem individual
    console.log("🔄 Método 1: removeItem individual");
    beforeKeys.forEach((key) => {
      try {
        console.log(`🗑️ Eliminando: ${key}`);
        localStorage.removeItem(key);

        // Verificar imediatamente
        const stillExists = localStorage.getItem(key);
        if (stillExists === null) {
          console.log(`✅ ${key} eliminado com sucesso`);
          eliminationAttempts.push({
            key,
            method: "removeItem",
            success: true,
          });
        } else {
          console.log(`❌ ${key} ainda existe!`, stillExists);
          eliminationAttempts.push({
            key,
            method: "removeItem",
            success: false,
            remaining: stillExists,
          });
        }
      } catch (error) {
        console.error(`💥 Erro ao eliminar ${key}:`, error);
        eliminationAttempts.push({
          key,
          method: "removeItem",
          success: false,
          error: error.message,
        });
      }
    });

    // Método 2: clear() completo
    console.log("🔄 Método 2: localStorage.clear()");
    try {
      localStorage.clear();
      console.log("✅ localStorage.clear() executado");
      eliminationAttempts.push({ method: "clear", success: true });
    } catch (error) {
      console.error("💥 Erro no clear():", error);
      eliminationAttempts.push({
        method: "clear",
        success: false,
        error: error.message,
      });
    }

    // PASSO 3: Verificar estado DEPOIS
    console.log("📊 PASSO 3: Estado DEPOIS da eliminação");
    const afterKeys = Object.keys(localStorage);
    console.log("🔑 Chaves DEPOIS:", afterKeys);

    afterKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      console.log(`📦 RESTANTE ${key}:`, value);
    });

    // PASSO 4: Análise dos resultados
    console.log("📊 PASSO 4: Análise dos resultados");
    console.log("🔍 Tentativas de eliminação:", eliminationAttempts);

    const beforeCount = beforeKeys.length;
    const afterCount = afterKeys.length;
    const eliminated = beforeCount - afterCount;

    console.log(`📊 Estatísticas:`);
    console.log(`   Antes: ${beforeCount} chaves`);
    console.log(`   Depois: ${afterCount} chaves`);
    console.log(`   Eliminadas: ${eliminated} chaves`);

    // PASSO 5: Relatório visual
    let report = `🔍 RELATÓRIO DE DEBUG\n\n`;
    report += `📊 ANTES: ${beforeCount} chaves\n`;
    report += `📊 DEPOIS: ${afterCount} chaves\n`;
    report += `📊 ELIMINADAS: ${eliminated} chaves\n\n`;

    if (afterCount > 0) {
      report += `❌ CHAVES QUE RESISTIRAM:\n`;
      afterKeys.forEach((key) => {
        report += `   🔑 ${key}\n`;
      });
      report += `\n`;
    }

    report += `🔍 TENTATIVAS:\n`;
    eliminationAttempts.forEach((attempt) => {
      if (attempt.key) {
        report += `   ${attempt.success ? "✅" : "❌"} ${attempt.key} (${attempt.method})\n`;
      } else {
        report += `   ${attempt.success ? "✅" : "❌"} ${attempt.method}\n`;
      }
    });

    // Mostrar relatório
    const element = document.createElement("div");
    element.style.cssText = `
      position: fixed; top: 10px; left: 10px; right: 10px;
      background: white; padding: 20px; border-radius: 10px;
      max-height: 90%; overflow: auto;
      z-index: 10000000; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      font-family: monospace; font-size: 11px; line-height: 1.3;
      border: 3px solid #dc3545;
    `;
    element.innerHTML = `
      <h3 style="color: #dc3545; text-align: center;">🔍 Relatório de Debug</h3>
      <pre style="white-space: pre-wrap; margin: 10px 0;">${report}</pre>
      <div style="text-align: center; margin-top: 15px;">
        ${
          afterCount > 0
            ? `<button onclick="forceDeleteRemaining()"
                  style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px; font-weight: bold;">
            💀 FORÇAR ELIMINAÇÃO DAS RESTANTES
          </button>`
            : `<div style="color: green; font-weight: bold; margin-bottom: 10px;">🎉 TUDO ELIMINADO COM SUCESSO!</div>`
        }
        <button onclick="this.parentElement.parentElement.remove()"
                style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Fechar
        </button>
      </div>
    `;
    document.body.appendChild(element);

    // Armazenar chaves restantes para tentativa adicional
    window.remainingKeys = afterKeys;

    if (afterCount === 0) {
      showInfo("delete-info", "🎉 TUDO ELIMINADO!", "green");

      setTimeout(() => {
        if (confirm("🎉 Eliminação completa! Recarregar página?")) {
          window.location.reload();
        }
      }, 2000);
    } else {
      showInfo("delete-info", `⚠️ ${afterCount} chaves resistiram`, "orange");
    }
  } catch (error) {
    console.error("💥 ERRO CRÍTICO no debug:", error);
    showInfo("delete-info", `❌ ERRO: ${error.message}`, "red");
  }
};

// Função para forçar eliminação das chaves restantes
window.forceDeleteRemaining = function () {
  try {
    if (!window.remainingKeys || window.remainingKeys.length === 0) {
      alert("✅ Nenhuma chave restante para eliminar!");
      return;
    }

    console.log(
      "💀 FORÇANDO eliminação das chaves restantes:",
      window.remainingKeys,
    );

    // Tentar múltiplas abordagens agressivas
    const approaches = [
      () => {
        console.log("💀 Abordagem 1: delete localStorage[key]");
        window.remainingKeys.forEach((key) => {
          try {
            delete localStorage[key];
            console.log(`💀 delete localStorage['${key}']`);
          } catch (e) {
            console.error(`❌ Erro no delete ${key}:`, e);
          }
        });
      },
      () => {
        console.log("💀 Abordagem 2: setItem com null");
        window.remainingKeys.forEach((key) => {
          try {
            localStorage.setItem(key, null);
            console.log(`💀 setItem('${key}', null)`);
          } catch (e) {
            console.error(`❌ Erro no setItem null ${key}:`, e);
          }
        });
      },
      () => {
        console.log("💀 Abordagem 3: setItem com string vazia");
        window.remainingKeys.forEach((key) => {
          try {
            localStorage.setItem(key, "");
            console.log(`💀 setItem('${key}', '')`);
          } catch (e) {
            console.error(`❌ Erro no setItem vazio ${key}:`, e);
          }
        });
      },
      () => {
        console.log("💀 Abordagem 4: clear() múltiplo");
        for (let i = 0; i < 5; i++) {
          localStorage.clear();
          console.log(`💀 clear() tentativa ${i + 1}`);
        }
      },
    ];

    // Executar todas as abordagens
    approaches.forEach((approach, index) => {
      console.log(`💀 Executando abordagem ${index + 1}...`);
      approach();

      // Verificar após cada abordagem
      const remaining = Object.keys(localStorage);
      console.log(`💀 Após abordagem ${index + 1}, restam:`, remaining);
    });

    // Verificação final
    const finalRemaining = Object.keys(localStorage);
    console.log("💀 VERIFICAÇÃO FINAL:", finalRemaining);

    if (finalRemaining.length === 0) {
      alert("🎉 SUCESSO! Todas as chaves foram eliminadas!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      alert(
        `⚠️ Ainda restam ${finalRemaining.length} chaves:\n${finalRemaining.join("\n")}\n\nVerifica o console para mais detalhes.`,
      );
    }
  } catch (error) {
    console.error("💥 Erro na eliminação forçada:", error);
    alert(`❌ Erro: ${error.message}`);
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
