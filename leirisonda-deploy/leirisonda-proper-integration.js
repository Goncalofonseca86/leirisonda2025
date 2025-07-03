// ========================================================
// INTEGRAÇÃO REAL COM O SISTEMA LEIRISONDA BUILDER.IO
// ========================================================
console.log("🚀 LEIRISONDA: Integração real iniciada");

(function () {
  "use strict";

  // Configurações
  const SETTINGS_PASSWORD = "19867";
  const YURI_CREDENTIALS = {
    email: "yrzamr01@gmail.com",
    password: "070107",
    name: "Yuri Ferreira",
  };

  // ==================== AGUARDAR SISTEMA CARREGAR ====================
  function waitForLeirisondaSystem() {
    let attempts = 0;
    const maxAttempts = 100;

    function check() {
      attempts++;

      // Verificar se o sistema Leirisonda está carregado
      const hasSystem =
        window.$S ||
        document.querySelector('[data-loc*="Login.tsx"]') ||
        localStorage.getItem("users");

      if (hasSystem) {
        console.log("✅ Sistema Leirisonda detectado - iniciando integração");
        setTimeout(initializeIntegration, 500);
      } else if (attempts < maxAttempts) {
        setTimeout(check, 100);
      } else {
        console.log(
          "⚠️ Sistema não detectado - criando funcionalidades básicas",
        );
        initializeBasicFeatures();
      }
    }

    check();
  }

  // ==================== INTEGRAÇÃO COMPLETA ====================
  function initializeIntegration() {
    console.log("🔧 Iniciando integração completa...");

    // 1. Integrar Yuri no sistema de utilizadores
    integrateYuriUser();

    // 2. Criar botão de configurações
    setTimeout(createSettingsButton, 1000);

    // 3. Configurar sistema de furos
    setupWaterDrillingSystem();

    // 4. Esconder itens do menu
    hideMenuItems();

    // 5. Configurar correções de erro
    setupErrorCorrections();

    // 6. Monitorização contínua
    setupContinuousMonitoring();

    console.log("✅ Integração completa ativada");
  }

  // ==================== INTEGRAÇÃO DO UTILIZADOR YURI ====================
  function integrateYuriUser() {
    console.log("👤 Integrando Yuri Ferreira no sistema real...");

    try {
      // Obter utilizadores existentes (array format como no código real)
      let users = [];
      try {
        const existingUsers = localStorage.getItem("users");
        users = existingUsers ? JSON.parse(existingUsers) : [];
        if (!Array.isArray(users)) users = [];
      } catch (e) {
        users = [];
      }

      // Verificar se Yuri já existe
      const yuriExists = users.some((u) => u.email === YURI_CREDENTIALS.email);

      if (!yuriExists) {
        // Criar utilizador Yuri com a mesma estrutura do sistema
        const yuriUser = {
          id: "user_yuri_ferreira",
          email: YURI_CREDENTIALS.email,
          name: YURI_CREDENTIALS.name,
          role: "user",
          permissions: {
            // Permissões baseadas no sistema existente (user role)
            canViewWorks: true,
            canCreateWorks: false,
            canEditWorks: true,
            canDeleteWorks: false,
            canViewMaintenance: true,
            canCreateMaintenance: false,
            canEditMaintenance: true,
            canDeleteMaintenance: false,
            canViewUsers: false,
            canCreateUsers: false,
            canEditUsers: false,
            canDeleteUsers: false,
            canViewReports: true,
            canExportData: false,
            canViewDashboard: true,
            canViewStats: true,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Adicionar ao array de utilizadores
        users.push(yuriUser);
        localStorage.setItem("users", JSON.stringify(users));

        // Configurar password como no sistema existente
        localStorage.setItem(
          `password_${yuriUser.id}`,
          YURI_CREDENTIALS.password,
        );
        localStorage.setItem(
          `password_${YURI_CREDENTIALS.email}`,
          YURI_CREDENTIALS.password,
        );

        console.log("✅ Yuri Ferreira adicionado ao sistema:", yuriUser);
      } else {
        console.log("ℹ️ Yuri Ferreira já existe no sistema");
      }

      // Interceptar sistema de autenticação
      interceptAuthentication();
    } catch (error) {
      console.error("❌ Erro ao integrar Yuri:", error);
    }
  }

  function interceptAuthentication() {
    // Interceptar o sistema de login da aplicação real

    // Interceptar fetch calls para autenticação
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
      // Verificar se é uma chamada de login
      if (
        options &&
        options.method === "POST" &&
        (url.includes("login") ||
          url.includes("auth") ||
          url.includes("signin"))
      ) {
        try {
          let body = options.body;
          if (typeof body === "string") {
            body = JSON.parse(body);
          }

          // Se é login do Yuri, processar localmente
          if (
            body &&
            body.email === YURI_CREDENTIALS.email &&
            body.password === YURI_CREDENTIALS.password
          ) {
            console.log(
              "🎯 Login do Yuri interceptado - autenticando localmente",
            );

            // Buscar dados do Yuri
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const yuriUser = users.find(
              (u) => u.email === YURI_CREDENTIALS.email,
            );

            if (yuriUser) {
              // Simular resposta de sucesso como o sistema espera
              return Promise.resolve(
                new Response(
                  JSON.stringify({
                    success: true,
                    user: yuriUser,
                    token: `yuri_token_${Date.now()}`,
                    uid: yuriUser.id,
                  }),
                  {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                  },
                ),
              );
            }
          }
        } catch (e) {
          console.log("⚠️ Erro ao interceptar login:", e);
        }
      }

      return originalFetch.apply(this, arguments);
    };

    // Também interceptar Firebase signInWithEmailAndPassword se disponível
    if (window.firebase && window.firebase.auth) {
      const originalSignIn = window.firebase.auth().signInWithEmailAndPassword;
      if (originalSignIn) {
        window.firebase.auth().signInWithEmailAndPassword = function (
          email,
          password,
        ) {
          if (
            email === YURI_CREDENTIALS.email &&
            password === YURI_CREDENTIALS.password
          ) {
            console.log("🔥 Firebase login do Yuri interceptado");

            // Simular user object do Firebase
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const yuriUser = users.find(
              (u) => u.email === YURI_CREDENTIALS.email,
            );

            return Promise.resolve({
              user: {
                uid: yuriUser.id,
                email: yuriUser.email,
                displayName: yuriUser.name,
                emailVerified: true,
                getIdToken: () =>
                  Promise.resolve(`yuri_firebase_token_${Date.now()}`),
              },
            });
          }

          return originalSignIn.call(this, email, password);
        };
      }
    }

    console.log("🔐 Sistema de autenticação interceptado para Yuri");
  }

  // ==================== BOTÃO DE CONFIGURAÇÕES ====================
  function createSettingsButton() {
    // Só criar na página de login
    if (!isLoginPage()) return;

    // Remover existente
    const existing = document.getElementById("leirisonda-settings-btn-real");
    if (existing) existing.remove();

    console.log("⚙️ Criando botão de configurações...");

    const button = document.createElement("div");
    button.id = "leirisonda-settings-btn-real";
    button.innerHTML = "⚙️";

    Object.assign(button.style, {
      position: "fixed",
      bottom: "25px",
      left: "25px",
      width: "45px",
      height: "45px",
      backgroundColor: "rgba(0, 119, 132, 0.9)",
      color: "white",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "18px",
      zIndex: "999999",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      transition: "all 0.3s ease",
      border: "2px solid rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
    });

    button.addEventListener("mouseenter", () => {
      button.style.transform = "scale(1.1)";
      button.style.backgroundColor = "rgba(0, 119, 132, 1)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "scale(1)";
      button.style.backgroundColor = "rgba(0, 119, 132, 0.9)";
    });

    button.addEventListener("click", openSettingsModal);

    document.body.appendChild(button);
    console.log("✅ Botão de configurações criado");
  }

  function isLoginPage() {
    return (
      document.querySelector('[data-loc*="Login.tsx"]') ||
      window.location.pathname.includes("/login") ||
      document.querySelector('input[type="email"]') ||
      document.body.textContent.includes("Email de acesso") ||
      document.body.textContent.includes("A carregar...")
    );
  }

  // ==================== MODAL DE CONFIGURAÇÕES ====================
  function openSettingsModal() {
    const existing = document.getElementById("leirisonda-settings-modal-real");
    if (existing) existing.remove();

    console.log("🔓 Abrindo modal de configurações...");

    const overlay = document.createElement("div");
    overlay.id = "leirisonda-settings-modal-real";

    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: "9999999",
      backdropFilter: "blur(8px)",
    });

    const modal = document.createElement("div");
    Object.assign(modal.style, {
      backgroundColor: "white",
      borderRadius: "15px",
      padding: "30px",
      maxWidth: "500px",
      width: "90%",
      maxHeight: "80vh",
      overflowY: "auto",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)",
      position: "relative",
    });

    modal.innerHTML = `
      <div style="text-align: center; margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
        <div style="font-size: 30px; margin-bottom: 10px;">⚙️</div>
        <h2 style="color: #007784; margin: 0; font-size: 24px; font-weight: 600;">Configurações Leirisonda</h2>
        <p style="color: #666; margin: 8px 0 0 0; font-size: 14px;">Sistema de Gestão de Obras</p>
      </div>

      <div id="password-section">
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #333; font-size: 14px;">
            🔐 Palavra-passe de acesso
          </label>
          <input type="password" id="settings-password-real" placeholder="Digite a palavra-passe" 
                 style="width: 100%; padding: 14px; border: 2px solid #e1e5e9; border-radius: 8px; 
                        font-size: 16px; box-sizing: border-box;">
        </div>
        <button onclick="window.leirisondaRealSettings.checkPassword()" 
                style="width: 100%; padding: 14px; background: linear-gradient(135deg, #007784, #005a66); 
                       color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; 
                       font-weight: 500; transition: all 0.3s ease;">
          Aceder às Configurações
        </button>
      </div>

      <div id="settings-content" style="display: none;">
        
        <!-- Status do Sistema -->
        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #0ea5e9;">
          <div style="font-weight: 500; color: #0c4a6e; margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
            <span>📊</span> Estado do Sistema
          </div>
          <div style="font-size: 12px; color: #075985; line-height: 1.5;" id="system-status">
            <div>✅ Yuri Ferreira: Integrado no sistema</div>
            <div>✅ Permissões: Role 'user' ativo</div>
            <div>✅ Autenticação: Firebase interceptado</div>
            <div>✅ Furos de água: Sistema configurado</div>
            <div>✅ Menu lateral: Items ocultos</div>
          </div>
        </div>

        <!-- Utilizadores -->
        <div style="margin-bottom: 20px;">
          <h4 style="color: #333; margin-bottom: 15px; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <span>👥</span> Utilizadores Configurados
          </h4>
          <div style="background: #f9fafb; padding: 12px; border-radius: 6px; font-size: 13px; line-height: 1.6;" id="users-list">
            <!-- Será preenchido dinamicamente -->
          </div>
        </div>

        <!-- Gestão de Dados -->
        <div style="margin-bottom: 20px;">
          <h4 style="color: #333; margin-bottom: 15px; font-size: 16px;">📁 Gestão de Dados</h4>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            <button onclick="window.leirisondaRealSettings.exportData()" 
                    style="padding: 12px; background: #10b981; color: white; border: none; 
                           border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
              📤 Exportar
            </button>
            <label style="padding: 12px; background: #3b82f6; color: white; border: none; 
                          border-radius: 6px; cursor: pointer; font-size: 14px; text-align: center; font-weight: 500;">
              📥 Importar
              <input type="file" accept=".json" onchange="window.leirisondaRealSettings.importData(event)" 
                     style="display: none;">
            </label>
          </div>
          
          <button onclick="window.leirisondaRealSettings.clearWorkData()" 
                  style="width: 100%; padding: 12px; background: #f59e0b; color: white; border: none; 
                         border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500; margin-bottom: 10px;">
            🧹 Limpar Obras e Manutenções
          </button>
          
          <button onclick="window.leirisondaRealSettings.clearAllData()" 
                  style="width: 100%; padding: 12px; background: #ef4444; color: white; border: none; 
                         border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
            🗑️ Eliminar Todos os Dados
          </button>
        </div>

        <!-- Debug -->
        <div style="border-top: 1px solid #eee; padding-top: 15px;">
          <button onclick="window.leirisondaRealSettings.runDiagnostics()" 
                  style="width: 100%; padding: 10px; background: #6366f1; color: white; border: none; 
                         border-radius: 6px; cursor: pointer; font-size: 13px; margin-bottom: 15px;">
            🔍 Executar Diagnósticos
          </button>
          
          <div style="text-align: center; font-size: 11px; color: #999; line-height: 1.4;">
            <div><strong>Leirisonda Integration v2.0</strong></div>
            <div>Builder.io • Firebase • React</div>
            <div>Última atualização: ${new Date().toLocaleDateString("pt-PT")}</div>
            <div style="margin-top: 8px;">
              <span style="color: #10b981;">●</span> Sistema operacional
            </div>
          </div>
        </div>
      </div>

      <button onclick="window.leirisondaRealSettings.closeModal()" 
              style="position: absolute; top: 15px; right: 20px; background: none; border: none; 
                     font-size: 24px; cursor: pointer; color: #999; width: 30px; height: 30px;">
        ✕
      </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Event listeners
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });

    setupModalFunctions();
    updateSystemStatus();
  }

  function setupModalFunctions() {
    window.leirisondaRealSettings = {
      checkPassword() {
        const password = document.getElementById(
          "settings-password-real",
        ).value;
        if (password === SETTINGS_PASSWORD) {
          document.getElementById("password-section").style.display = "none";
          document.getElementById("settings-content").style.display = "block";
          updateSystemStatus();
          console.log("✅ Acesso às configurações autorizado");
        } else {
          alert("❌ Palavra-passe incorreta");
          document.getElementById("settings-password-real").style.borderColor =
            "#ef4444";
        }
      },

      closeModal() {
        document.getElementById("leirisonda-settings-modal-real")?.remove();
      },

      exportData() {
        try {
          const data = {
            leirisondaExport: true,
            exportDate: new Date().toISOString(),
            version: "2.0",
            users: JSON.parse(localStorage.getItem("users") || "[]"),
            works: JSON.parse(localStorage.getItem("works") || "[]"),
            maintenances: JSON.parse(
              localStorage.getItem("maintenances") || "[]",
            ),
            poolMaintenances: JSON.parse(
              localStorage.getItem("pool_maintenances") || "[]",
            ),
            leirisondaWorks: JSON.parse(
              localStorage.getItem("leirisonda_works") || "[]",
            ),
          };

          const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `leirisonda_backup_${new Date().toISOString().split("T")[0]}.json`;
          a.click();
          URL.revokeObjectURL(url);

          console.log("📤 Dados exportados");
          alert("✅ Dados exportados com sucesso!");
        } catch (error) {
          console.error("❌ Erro ao exportar:", error);
          alert("❌ Erro ao exportar dados");
        }
      },

      importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);

            if (!data.leirisondaExport) {
              throw new Error("Ficheiro inválido");
            }

            if (data.users)
              localStorage.setItem("users", JSON.stringify(data.users));
            if (data.works)
              localStorage.setItem("works", JSON.stringify(data.works));
            if (data.maintenances)
              localStorage.setItem(
                "maintenances",
                JSON.stringify(data.maintenances),
              );
            if (data.poolMaintenances)
              localStorage.setItem(
                "pool_maintenances",
                JSON.stringify(data.poolMaintenances),
              );
            if (data.leirisondaWorks)
              localStorage.setItem(
                "leirisonda_works",
                JSON.stringify(data.leirisondaWorks),
              );

            console.log("📥 Dados importados");
            alert(
              "✅ Dados importados com sucesso!\n\nRecarregue a página para ver as alterações.",
            );
          } catch (error) {
            console.error("❌ Erro ao importar:", error);
            alert(
              "❌ Erro ao importar dados. Verifique se o ficheiro está correto.",
            );
          }
        };
        reader.readAsText(file);
      },

      clearWorkData() {
        if (
          confirm(
            "⚠️ Eliminar todas as obras e manutenções?\n\nEsta ação não pode ser desfeita.",
          )
        ) {
          [
            "works",
            "maintenances",
            "pool_maintenances",
            "leirisonda_works",
          ].forEach((key) => {
            localStorage.removeItem(key);
          });

          console.log("🧹 Dados de obras eliminados");
          alert("✅ Obras e manutenções eliminadas com sucesso!");
          this.closeModal();
        }
      },

      clearAllData() {
        if (
          confirm(
            "⚠️ ATENÇÃO! ELIMINAR TODOS OS DADOS?\n\nIsto irá eliminar:\n• Todos os utilizadores\n• Todas as obras\n• Todas as manutenções\n• Todas as configurações\n\nEsta ação NÃO PODE ser desfeita!\n\nTem a certeza ABSOLUTA?",
          )
        ) {
          const keysToRemove = [
            "users",
            "works",
            "maintenances",
            "pool_maintenances",
            "leirisonda_works",
            "leirisonda_user",
            "app_settings",
          ];

          keysToRemove.forEach((key) => localStorage.removeItem(key));

          console.log("🗑️ Todos os dados eliminados");
          alert(
            "✅ Todos os dados foram eliminados!\n\nA página será recarregada.",
          );
          window.location.reload();
        }
      },

      runDiagnostics() {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const yuriUser = users.find((u) => u.email === YURI_CREDENTIALS.email);

        const diagnostics = {
          timestamp: new Date().toISOString(),
          url: window.location.href,
          loginPage: isLoginPage(),
          settingsButton: !!document.getElementById(
            "leirisonda-settings-btn-real",
          ),
          yuriIntegrated: !!yuriUser,
          totalUsers: users.length,
          localStorageKeys: Object.keys(localStorage).length,
          react: !!window.React,
          firebase: !!window.firebase,
          builderSystem: !!window.$S,
        };

        console.log("🔍 Diagnósticos do Sistema Leirisonda:");
        console.table(diagnostics);

        alert(
          `🔍 Diagnósticos concluídos!\n\n` +
            `✅ Página Login: ${diagnostics.loginPage ? "SIM" : "NÃO"}\n` +
            `✅ Yuri Integrado: ${diagnostics.yuriIntegrated ? "SIM" : "NÃO"}\n` +
            `✅ Total Utilizadores: ${diagnostics.totalUsers}\n` +
            `✅ Botão Settings: ${diagnostics.settingsButton ? "SIM" : "NÃO"}\n` +
            `✅ React: ${diagnostics.react ? "SIM" : "NÃO"}\n` +
            `✅ Firebase: ${diagnostics.firebase ? "SIM" : "NÃO"}\n\n` +
            `Consulte o console para detalhes completos.`,
        );
      },
    };
  }

  function updateSystemStatus() {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const yuriUser = users.find((u) => u.email === YURI_CREDENTIALS.email);

    // Atualizar lista de utilizadores
    const usersList = document.getElementById("users-list");
    if (usersList) {
      usersList.innerHTML = users
        .map(
          (user) =>
            `<div style="margin-bottom: 8px;">
          <strong>${user.name}</strong> (${user.email})
          <br><span style="color: #666; font-size: 11px;">Role: ${user.role} | ID: ${user.id}</span>
        </div>`,
        )
        .join("");
    }

    // Atualizar status
    const statusEl = document.getElementById("system-status");
    if (statusEl) {
      statusEl.innerHTML = `
        <div>${yuriUser ? "✅" : "❌"} Yuri Ferreira: ${yuriUser ? "Integrado" : "Não encontrado"}</div>
        <div>✅ Total utilizadores: ${users.length}</div>
        <div>✅ Sistema: ${window.$S ? "Builder.io detectado" : "Standalone"}</div>
        <div>✅ React: ${window.React ? "Carregado" : "Não detectado"}</div>
        <div>✅ Firebase: ${window.firebase ? "Disponível" : "Não disponível"}</div>
      `;
    }
  }

  // ==================== SISTEMA DE FUROS DE ÁGUA ====================
  function setupWaterDrillingSystem() {
    console.log("💧 Configurando sistema de furos de água...");

    // Observer para detectar mudanças na página
    const observer = new MutationObserver(() => {
      // Verificar se estamos numa página de criar obra
      if (
        window.location.pathname.includes("/create") ||
        window.location.pathname.includes("/works/new") ||
        document.querySelector('[data-loc*="CreateWork"]') ||
        document.body.textContent.includes("Tipo de Trabalho")
      ) {
        setTimeout(addWaterDrillingOption, 1000);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function addWaterDrillingOption() {
      // Procurar dropdowns de tipo de trabalho
      const selects = document.querySelectorAll("select");

      selects.forEach((select) => {
        const options = Array.from(select.options);
        const hasWorkTypes = options.some(
          (opt) =>
            opt.text.toLowerCase().includes("piscina") ||
            opt.text.toLowerCase().includes("manutenção") ||
            opt.text.toLowerCase().includes("instalação"),
        );

        if (hasWorkTypes) {
          const hasFuro = options.some(
            (opt) =>
              opt.text.toLowerCase().includes("furo") ||
              opt.value.toLowerCase().includes("furo"),
          );

          if (!hasFuro) {
            console.log("💧 Adicionando opção 'Furo de Água'");

            const furoOption = document.createElement("option");
            furoOption.value = "furo_agua";
            furoOption.text = "Furo de Água";
            select.appendChild(furoOption);

            // Event listener para mostrar secção
            select.addEventListener("change", function () {
              if (this.value === "furo_agua") {
                setTimeout(() => createWaterDrillingSection(), 500);
              } else {
                removeWaterDrillingSection();
              }
            });
          }
        }
      });
    }

    function createWaterDrillingSection() {
      // Remover secção existente
      const existing = document.getElementById("water-drilling-section-real");
      if (existing) existing.remove();

      console.log("💧 Criando secção de furo de água...");

      const section = document.createElement("div");
      section.id = "water-drilling-section-real";

      Object.assign(section.style, {
        background: "linear-gradient(135deg, #e0f2fe, #f0f9ff)",
        border: "2px solid #0ea5e9",
        borderRadius: "12px",
        padding: "25px",
        margin: "20px 0",
        boxShadow: "0 4px 15px rgba(14, 165, 233, 0.2)",
      });

      section.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 25px;">
          <span style="font-size: 28px; margin-right: 12px;">💧</span>
          <h3 style="color: #0c4a6e; margin: 0; font-size: 22px; font-weight: 600;">
            Detalhes Técnicos do Furo de Água
          </h3>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          
          <!-- Medições -->
          <div style="background: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 10px;">
            <h4 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 16px;">📏 Medições</h4>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px;">
                Profundidade Total (metros)
              </label>
              <input type="number" name="furo_profundidade_total" step="0.1" placeholder="Ex: 45.5"
                     style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box;">
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px;">
                Nível da Água (metros)
              </label>
              <input type="number" name="furo_nivel_agua" step="0.1" placeholder="Ex: 12.3"
                     style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box;">
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px;">
                Profundidade da Bomba (metros)
              </label>
              <input type="number" name="furo_profundidade_bomba" step="0.1" placeholder="Ex: 38.0"
                     style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box;">
            </div>
            
            <div>
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px;">
                Caudal do Furo (m³/h)
              </label>
              <input type="number" name="furo_caudal" step="0.1" placeholder="Ex: 2.5"
                     style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box;">
            </div>
          </div>

          <!-- Coluna -->
          <div style="background: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 10px;">
            <h4 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 16px;">🔧 Coluna</h4>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px;">
                Tipo de Coluna
              </label>
              <select name="furo_tipo_coluna" 
                      style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; background: white; box-sizing: border-box;">
                <option value="">Selecionar...</option>
                <option value="PEAD">PEAD</option>
                <option value="HIDROROSCADO">HIDROROSCADO</option>
              </select>
            </div>
            
            <div>
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px;">
                Diâmetro (mm)
              </label>
              <select name="furo_diametro_coluna"
                      style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; background: white; box-sizing: border-box;">
                <option value="">Selecionar...</option>
                <option value="50">50mm</option>
                <option value="63">63mm</option>
                <option value="75">75mm</option>
                <option value="90">90mm</option>
                <option value="110">110mm</option>
                <option value="125">125mm</option>
                <option value="160">160mm</option>
                <option value="200">200mm</option>
              </select>
            </div>
          </div>

          <!-- Bomba -->
          <div style="background: rgba(255, 255, 255, 0.8); padding: 20px; border-radius: 10px;">
            <h4 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 16px;">⚡ Bomba</h4>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px;">
                Modelo
              </label>
              <input type="text" name="furo_modelo_bomba" placeholder="Ex: Grundfos SQ3-105"
                     style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box;">
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px;">
                Potência (HP)
              </label>
              <select name="furo_potencia_motor"
                      style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; background: white; box-sizing: border-box;">
                <option value="">Selecionar...</option>
                <option value="0.5">0.5 HP</option>
                <option value="1">1 HP</option>
                <option value="1.5">1.5 HP</option>
                <option value="2">2 HP</option>
                <option value="3">3 HP</option>
                <option value="5">5 HP</option>
              </select>
            </div>
            
            <div>
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px;">
                Voltagem
              </label>
              <select name="furo_voltagem_bomba"
                      style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; background: white; box-sizing: border-box;">
                <option value="">Selecionar...</option>
                <option value="230V">230V (Monofásica)</option>
                <option value="400V">400V (Trifásica)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: rgba(14, 165, 233, 0.1); 
                    border-radius: 8px; border-left: 4px solid #0ea5e9;">
          <div style="color: #0c4a6e; font-size: 14px; display: flex; align-items: center; gap: 8px;">
            <span>💡</span>
            <strong>Informação:</strong> Dados técnicos específicos para furos de água
          </div>
        </div>
      `;

      // Encontrar onde inserir
      const form =
        document.querySelector("form") ||
        document.querySelector('[data-loc*="CreateWork"]') ||
        document.querySelector("main") ||
        document.body;

      form.appendChild(section);
      console.log("✅ Secção de furo criada");
    }

    function removeWaterDrillingSection() {
      const section = document.getElementById("water-drilling-section-real");
      if (section) {
        section.remove();
        console.log("🗑️ Secção de furo removida");
      }
    }

    console.log("✅ Sistema de furos configurado");
  }

  // ==================== ESCONDER ITENS DO MENU ====================
  function hideMenuItems() {
    console.log("📋 Configurando menu lateral...");

    const style = document.createElement("style");
    style.id = "leirisonda-menu-hide-style";
    style.textContent = `
      /* Esconder itens específicos do menu */
      [data-loc*="Navigation"] a[href*="admin"],
      [data-loc*="Navigation"] a[href*="diagnostic"],
      [data-loc*="Sidebar"] a[href*="admin"],
      [data-loc*="Sidebar"] a[href*="diagnostic"],
      nav a[href*="admin"],
      nav a[href*="diagnostic"] {
        display: none !important;
      }
      
      /* Esconder por texto */
      nav li:has(a:contains("administração")),
      nav li:has(a:contains("diagnóstico")) {
        display: none !important;
      }
    `;

    document.head.appendChild(style);

    // Função para esconder por texto
    function hideByText() {
      document
        .querySelectorAll(
          'nav a, [data-loc*="Navigation"] a, [data-loc*="Sidebar"] a',
        )
        .forEach((link) => {
          const text = link.textContent.toLowerCase();
          if (
            (text.includes("administração") || text.includes("diagnóstico")) &&
            !text.includes("nova") &&
            !text.includes("obra") &&
            !text.includes("manutenção")
          ) {
            const item = link.closest("li") || link.closest("div") || link;
            item.style.display = "none";
          }
        });
    }

    setInterval(hideByText, 3000);
    console.log("✅ Menu configurado");
  }

  // ==================== CORREÇÕES DE ERRO ====================
  function setupErrorCorrections() {
    console.log("🔧 Configurando correções de erro...");

    // Suprimir erros específicos
    const originalError = console.error;
    console.error = function (...args) {
      const msg = args.join(" ");
      if (
        msg.includes("Firebase") ||
        msg.includes("SYNC") ||
        msg.includes("Loading chunk") ||
        msg.includes("Load failed")
      ) {
        return; // Silenciar
      }
      return originalError.apply(console, args);
    };

    // Interceptar erros globais
    window.addEventListener("error", function (e) {
      if (
        e.message &&
        (e.message.includes("Load failed") ||
          e.message.includes("Script error") ||
          e.message.includes("Loading chunk"))
      ) {
        console.log("🔧 Erro suprimido:", e.message);
        e.preventDefault();
        return false;
      }
    });

    window.addEventListener("unhandledrejection", function (e) {
      if (
        e.reason &&
        e.reason.message &&
        (e.reason.message.includes("Load failed") ||
          e.reason.message.includes("chunk"))
      ) {
        console.log("🔧 Promise rejection suprimida:", e.reason.message);
        e.preventDefault();
      }
    });

    console.log("✅ Correções de erro ativas");
  }

  // ==================== MONITORIZAÇÃO CONTÍNUA ====================
  function setupContinuousMonitoring() {
    console.log("👁️ Configurando monitorização contínua...");

    // Verificar estado a cada 5 segundos
    setInterval(() => {
      // Verificar botão de configurações
      if (
        isLoginPage() &&
        !document.getElementById("leirisonda-settings-btn-real")
      ) {
        createSettingsButton();
      }

      // Verificar se Yuri ainda está no sistema
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const yuriExists = users.some((u) => u.email === YURI_CREDENTIALS.email);
      if (!yuriExists) {
        console.log("⚠️ Yuri não encontrado - reintegrando...");
        integrateYuriUser();
      }
    }, 5000);

    console.log("✅ Monitorização ativa");
  }

  // ==================== FUNCIONALIDADES BÁSICAS ====================
  function initializeBasicFeatures() {
    console.log("⚡ Iniciando funcionalidades básicas...");

    setupErrorCorrections();
    setTimeout(() => {
      if (isLoginPage()) createSettingsButton();
    }, 1000);

    console.log("✅ Funcionalidades básicas ativas");
  }

  // ==================== DEBUG GLOBAL ====================
  window.leirisondaDebug = {
    status() {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const yuriUser = users.find((u) => u.email === YURI_CREDENTIALS.email);

      console.log("🔍 LEIRISONDA DEBUG:");
      console.log(`  📍 URL: ${window.location.href}`);
      console.log(`  📄 Login Page: ${isLoginPage()}`);
      console.log(
        `  ⚙️ Settings Button: ${!!document.getElementById("leirisonda-settings-btn-real")}`,
      );
      console.log(`  👤 Yuri Integrated: ${!!yuriUser}`);
      console.log(`  👥 Total Users: ${users.length}`);
      console.log(
        `  💧 Water Section: ${!!document.getElementById("water-drilling-section-real")}`,
      );
      console.log(`  🔄 React: ${!!window.React}`);
      console.log(`  🔥 Firebase: ${!!window.firebase}`);
      console.log(`  🏗️ Builder System: ${!!window.$S}`);
    },

    recreateSettings() {
      document.getElementById("leirisonda-settings-btn-real")?.remove();
      createSettingsButton();
    },

    testYuriLogin() {
      console.log("🧪 Simulando login do Yuri...");
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const yuriUser = users.find((u) => u.email === YURI_CREDENTIALS.email);

      if (yuriUser) {
        console.log("👤 Dados do Yuri:", yuriUser);
        console.log(
          "🔐 Password:",
          localStorage.getItem(`password_${YURI_CREDENTIALS.email}`),
        );
      } else {
        console.log("❌ Yuri não encontrado");
      }
    },

    forceIntegration() {
      console.log("🔄 Forçando integração completa...");
      initializeIntegration();
    },
  };

  // ==================== INICIALIZAÇÃO ====================
  console.log("🏁 Iniciando integração Leirisonda...");

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForLeirisondaSystem);
  } else {
    waitForLeirisondaSystem();
  }
})();

console.log("✅ Leirisonda Integration v2.0 - Sistema carregado!");
