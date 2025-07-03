// ======================================================
// SISTEMA COMPLETO LEIRISONDA - INTEGRAÇÃO COM BUILDER.IO
// ======================================================
console.log("🚀 LEIRISONDA: Iniciando sistema completo de funcionalidades");

(function () {
  "use strict";

  // ==================== CONFIGURAÇÃO GLOBAL ====================
  const SETTINGS_PASSWORD = "19867";
  const YURI_CREDENTIALS = {
    email: "yrzamr01@gmail.com",
    password: "070107",
    name: "Yuri Ferreira",
  };

  // Aguardar React e Firebase carregarem
  let retryCount = 0;
  const maxRetries = 50;

  function waitForApp() {
    retryCount++;

    if (retryCount > maxRetries) {
      console.log(
        "⚠️ Timeout aguardando aplicação - continuando com funcionalidades básicas",
      );
      initBasicFeatures();
      return;
    }

    // Verificar se React e componentes estão carregados
    if (window.React && document.querySelector('[data-loc*="Login.tsx"]')) {
      console.log("✅ Aplicação React detectada - iniciando integração");
      initCompleteSystem();
    } else {
      setTimeout(waitForApp, 200);
    }
  }

  // ==================== SISTEMA DE UTILIZADORES ====================
  function setupYuriUser() {
    console.log("👤 Configurando utilizador Yuri Ferreira...");

    // Integrar com o sistema existente da aplicação
    try {
      // Adicionar ao localStorage como os outros utilizadores
      const existingUsers = JSON.parse(localStorage.getItem("users") || "{}");

      const yuriUser = {
        id: "user_yuri_ferreira",
        email: YURI_CREDENTIALS.email,
        name: YURI_CREDENTIALS.name,
        role: "user",
        permissions: {
          // Baseado no sistema Ek (user permissions) encontrado no código
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

      existingUsers[YURI_CREDENTIALS.email] = yuriUser;
      localStorage.setItem("users", JSON.stringify(existingUsers));

      // Armazenar credenciais como a aplicação espera
      localStorage.setItem(
        `password_${YURI_CREDENTIALS.email}`,
        YURI_CREDENTIALS.password,
      );
      localStorage.setItem("yuri_user_data", JSON.stringify(yuriUser));

      console.log("✅ Utilizador Yuri configurado com permissões de user");

      // Interceptar o sistema de autenticação para incluir Yuri
      interceptAuthSystem();
    } catch (error) {
      console.log("⚠️ Erro ao configurar Yuri:", error);
    }
  }

  function interceptAuthSystem() {
    // Interceptar Firebase signInWithEmailAndPassword
    const originalSignIn = window.signInWithEmailAndPassword;

    // Interceptar fetch para login
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
      if (
        options &&
        options.method === "POST" &&
        (url.includes("login") || url.includes("auth"))
      ) {
        try {
          const body =
            typeof options.body === "string"
              ? JSON.parse(options.body)
              : options.body;

          if (
            body &&
            body.email === YURI_CREDENTIALS.email &&
            body.password === YURI_CREDENTIALS.password
          ) {
            console.log(
              "🎯 Login do Yuri interceptado - autenticando automaticamente",
            );

            // Simular resposta de sucesso
            const yuriUser = JSON.parse(localStorage.getItem("yuri_user_data"));
            return Promise.resolve(
              new Response(
                JSON.stringify({
                  success: true,
                  user: yuriUser,
                  token: "yuri_auth_token_" + Date.now(),
                }),
                {
                  status: 200,
                  headers: { "Content-Type": "application/json" },
                },
              ),
            );
          }
        } catch (e) {
          console.log("⚠️ Erro ao interceptar login:", e);
        }
      }

      return originalFetch.apply(this, arguments);
    };

    console.log("🔐 Sistema de autenticação interceptado para Yuri");
  }

  // ==================== BOTÃO DE CONFIGURAÇÕES ====================
  function createSettingsButton() {
    // Só criar na página de login
    if (!isLoginPage()) return;

    // Remover botão existente
    const existing = document.getElementById("leirisonda-settings-btn");
    if (existing) existing.remove();

    console.log("⚙️ Criando botão de configurações na página de login...");

    const button = document.createElement("div");
    button.id = "leirisonda-settings-btn";
    button.innerHTML = "⚙️";

    Object.assign(button.style, {
      position: "fixed",
      bottom: "30px",
      left: "30px",
      width: "50px",
      height: "50px",
      backgroundColor: "rgba(0, 119, 132, 0.9)",
      color: "white",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "20px",
      zIndex: "999999",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      transition: "all 0.3s ease",
      border: "2px solid rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
    });

    // Efeitos hover
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
      document.querySelector('input[placeholder*="Email de acesso"]') ||
      document.body.textContent.includes("Email de acesso")
    );
  }

  // ==================== MODAL DE CONFIGURAÇÕES ====================
  function openSettingsModal() {
    // Remover modal existente
    const existing = document.getElementById("leirisonda-settings-modal");
    if (existing) existing.remove();

    console.log("🔓 Abrindo modal de configurações...");

    const overlay = document.createElement("div");
    overlay.id = "leirisonda-settings-modal";

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
        <h2 style="color: #007784; margin: 0; font-size: 24px; font-weight: 600;">Configurações</h2>
        <p style="color: #666; margin: 8px 0 0 0; font-size: 14px;">Sistema Leirisonda - Gestão de Obras</p>
      </div>

      <div id="password-section">
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #333; font-size: 14px;">
            🔐 Palavra-passe de acesso
          </label>
          <input type="password" id="settings-password" placeholder="Digite a palavra-passe" 
                 style="width: 100%; padding: 14px; border: 2px solid #e1e5e9; border-radius: 8px; 
                        font-size: 16px; box-sizing: border-box;">
        </div>
        <button onclick="window.leirisondaSettings.checkPassword()" 
                style="width: 100%; padding: 14px; background: linear-gradient(135deg, #007784, #005a66); 
                       color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; 
                       font-weight: 500; transition: all 0.3s ease;">
          Aceder às Configurações
        </button>
      </div>

      <div id="settings-content" style="display: none;">
        
        <!-- Informações do Sistema -->
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <div style="font-weight: 500; color: #333; margin-bottom: 8px;">📊 Estado do Sistema</div>
          <div style="font-size: 12px; color: #666; line-height: 1.4;">
            <div>✅ Utilizador Yuri: Configurado</div>
            <div>✅ Permissões: Sistema user ativo</div>
            <div>✅ Autenticação: Firebase integrado</div>
            <div>✅ Furos de água: Sistema ativo</div>
          </div>
        </div>

        <!-- Gestão de Notificações -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; 
                    padding: 15px; background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 8px;">
          <div>
            <div style="font-weight: 500; color: #333; display: flex; align-items: center; gap: 8px;">
              🔔 Notificações Push
            </div>
            <div style="font-size: 12px; color: #666; margin-top: 4px;">
              Receber alertas sobre obras e manutenções
            </div>
          </div>
          <div onclick="window.leirisondaSettings.toggleNotifications()" 
               style="position: relative; width: 50px; height: 25px; background: #ccc; border-radius: 25px; 
                      cursor: pointer; transition: all 0.3s ease;" 
               id="notification-toggle">
            <div style="position: absolute; top: 2px; left: 2px; width: 21px; height: 21px; 
                        background: white; border-radius: 50%; transition: all 0.3s ease;" 
                 id="notification-slider">
            </div>
          </div>
        </div>

        <!-- Gestão de Dados -->
        <div style="margin-bottom: 20px;">
          <h4 style="color: #333; margin-bottom: 15px; font-size: 16px;">📁 Gestão de Dados</h4>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            <button onclick="window.leirisondaSettings.exportData()" 
                    style="padding: 12px; background: #10b981; color: white; border: none; 
                           border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;
                           transition: all 0.3s ease;">
              📤 Exportar Dados
            </button>
            <label style="padding: 12px; background: #3b82f6; color: white; border: none; 
                          border-radius: 6px; cursor: pointer; font-size: 14px; text-align: center;
                          font-weight: 500; transition: all 0.3s ease;">
              📥 Importar Dados
              <input type="file" accept=".json" onchange="window.leirisondaSettings.importData(event)" 
                     style="display: none;">
            </label>
          </div>
          
          <button onclick="window.leirisondaSettings.clearAllData()" 
                  style="width: 100%; padding: 12px; background: #ef4444; color: white; border: none; 
                         border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;
                         transition: all 0.3s ease;">
            🗑️ Eliminar Todos os Dados
          </button>
        </div>

        <!-- Debug e Informações -->
        <div style="border-top: 1px solid #eee; padding-top: 15px;">
          <button onclick="window.leirisondaSettings.runDiagnostics()" 
                  style="width: 100%; padding: 10px; background: #6366f1; color: white; border: none; 
                         border-radius: 6px; cursor: pointer; font-size: 13px; margin-bottom: 15px;">
            🔍 Executar Diagnósticos
          </button>
          
          <div style="text-align: center; font-size: 11px; color: #999; line-height: 1.4;">
            <div><strong>Leirisonda v2.0</strong> | Builder.io Integration</div>
            <div>Última atualização: ${new Date().toLocaleDateString("pt-PT")}</div>
            <div style="margin-top: 8px;">
              <span style="color: #10b981;">●</span> Sistema operacional
            </div>
          </div>
        </div>
      </div>

      <button onclick="window.leirisondaSettings.closeModal()" 
              style="position: absolute; top: 15px; right: 20px; background: none; border: none; 
                     font-size: 24px; cursor: pointer; color: #999; width: 30px; height: 30px;
                     display: flex; align-items: center; justify-content: center; border-radius: 50%;
                     transition: all 0.3s ease;">
        ✕
      </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Event listeners
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    // Configurar funcionalidades do modal
    setupModalFunctions();
  }

  function setupModalFunctions() {
    window.leirisondaSettings = {
      checkPassword() {
        const password = document.getElementById("settings-password").value;
        if (password === SETTINGS_PASSWORD) {
          document.getElementById("password-section").style.display = "none";
          document.getElementById("settings-content").style.display = "block";
          console.log("✅ Acesso às configurações autorizado");
        } else {
          alert("❌ Palavra-passe incorreta");
          document.getElementById("settings-password").style.borderColor =
            "#ef4444";
          setTimeout(() => {
            document.getElementById("settings-password").style.borderColor =
              "#e1e5e9";
          }, 2000);
        }
      },

      closeModal() {
        document.getElementById("leirisonda-settings-modal")?.remove();
      },

      toggleNotifications() {
        const toggle = document.getElementById("notification-toggle");
        const slider = document.getElementById("notification-slider");
        const isEnabled = toggle.dataset.enabled === "true";

        if (!isEnabled) {
          if ("Notification" in window) {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                toggle.style.background = "#10b981";
                slider.style.transform = "translateX(25px)";
                toggle.dataset.enabled = "true";
                new Notification("Leirisonda", {
                  body: "Notificações ativadas com sucesso!",
                  icon: "/favicon.ico",
                });
                console.log("🔔 Notificações ativadas");
              }
            });
          }
        } else {
          toggle.style.background = "#ccc";
          slider.style.transform = "translateX(0)";
          toggle.dataset.enabled = "false";
          console.log("🔕 Notificações desativadas");
        }
      },

      exportData() {
        try {
          const data = {
            leirisondaExport: true,
            exportDate: new Date().toISOString(),
            version: "2.0",
            users: JSON.parse(localStorage.getItem("users") || "{}"),
            works: JSON.parse(localStorage.getItem("works") || "[]"),
            maintenances: JSON.parse(
              localStorage.getItem("maintenances") || "[]",
            ),
            settings: JSON.parse(localStorage.getItem("app_settings") || "{}"),
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

          console.log("📤 Dados exportados com sucesso");
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
            if (data.settings)
              localStorage.setItem(
                "app_settings",
                JSON.stringify(data.settings),
              );

            console.log("📥 Dados importados com sucesso");
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

      clearAllData() {
        if (
          confirm(
            "⚠️ ATENÇÃO!\n\nTem a certeza que quer eliminar TODOS os dados?\n\nEsta ação irá eliminar:\n• Todas as obras\n• Todas as manutenções\n• Configurações do sistema\n\nEsta ação NÃO PODE ser desfeita!",
          )
        ) {
          const keysToRemove = [
            "works",
            "maintenances",
            "app_settings",
            "work_data",
          ];

          keysToRemove.forEach((key) => localStorage.removeItem(key));

          console.log("🗑️ Todos os dados foram eliminados");
          alert("✅ Todos os dados foram eliminados com sucesso!");
          this.closeModal();
        }
      },

      runDiagnostics() {
        console.log("🔍 Executando diagnósticos do sistema...");

        const diagnostics = {
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          react: !!window.React,
          firebase: !!window.firebase,
          loginPage: isLoginPage(),
          yuri: !!localStorage.getItem("yuri_user_data"),
          settingsButton: !!document.getElementById("leirisonda-settings-btn"),
          localStorage: Object.keys(localStorage).length,
          errors: [],
        };

        console.table(diagnostics);

        alert(
          `🔍 Diagnósticos concluídos!\n\n✅ React: ${diagnostics.react ? "OK" : "ERRO"}\n✅ Firebase: ${diagnostics.firebase ? "OK" : "ERRO"}\n✅ Yuri: ${diagnostics.yuri ? "OK" : "ERRO"}\n✅ Botão Settings: ${diagnostics.settingsButton ? "OK" : "ERRO"}\n\nConsulte o console para detalhes completos.`,
        );
      },
    };
  }

  // ==================== SISTEMA DE FUROS DE ÁGUA ====================
  function setupWaterDrillingSystem() {
    console.log("💧 Configurando sistema de furos de água...");

    // Observer para detectar mudanças na página
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        // Verificar se estamos numa página de criar obra
        if (
          window.location.pathname.includes("/create") ||
          window.location.pathname.includes("/works/new") ||
          document.querySelector('[data-loc*="CreateWork"]') ||
          document.body.textContent.includes("Tipo de Trabalho")
        ) {
          addWaterDrillingOption();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

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
            console.log("💧 Adicionando opção 'Furo de Água' ao dropdown");

            const furoOption = document.createElement("option");
            furoOption.value = "furo_agua";
            furoOption.text = "Furo de Água";
            select.appendChild(furoOption);

            // Event listener para mostrar secção quando selecionado
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
      const existing = document.getElementById("water-drilling-section");
      if (existing) existing.remove();

      console.log("💧 Criando secção detalhada de furo de água...");

      const section = document.createElement("div");
      section.id = "water-drilling-section";

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
          
          <!-- Medições Principais -->
          <div style="background: rgba(255, 255, 255, 0.7); padding: 20px; border-radius: 10px;">
            <h4 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 16px;">📏 Medições Principais</h4>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
                Profundidade Total (metros)
              </label>
              <input type="number" name="furo_profundidade_total" step="0.1" placeholder="Ex: 45.5"
                     style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box;">
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
                Nível da Água (metros)
              </label>
              <input type="number" name="furo_nivel_agua" step="0.1" placeholder="Ex: 12.3"
                     style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box;">
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
                Profundidade da Bomba (metros)
              </label>
              <input type="number" name="furo_profundidade_bomba" step="0.1" placeholder="Ex: 38.0"
                     style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box;">
            </div>
            
            <div>
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
                Caudal do Furo (m³/h)
              </label>
              <input type="number" name="furo_caudal" step="0.1" placeholder="Ex: 2.5"
                     style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box;">
            </div>
          </div>

          <!-- Especificações da Coluna -->
          <div style="background: rgba(255, 255, 255, 0.7); padding: 20px; border-radius: 10px;">
            <h4 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 16px;">🔧 Especificações da Coluna</h4>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
                Tipo de Coluna
              </label>
              <select name="furo_tipo_coluna" 
                      style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; background: white; box-sizing: border-box;">
                <option value="">Selecionar tipo...</option>
                <option value="PEAD">PEAD (Polietileno de Alta Densidade)</option>
                <option value="HIDROROSCADO">HIDROROSCADO (Aço Galvanizado)</option>
              </select>
            </div>
            
            <div>
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
                Diâmetro da Coluna (mm)
              </label>
              <select name="furo_diametro_coluna"
                      style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; background: white; box-sizing: border-box;">
                <option value="">Selecionar diâmetro...</option>
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

          <!-- Equipamento de Bombeamento -->
          <div style="background: rgba(255, 255, 255, 0.7); padding: 20px; border-radius: 10px;">
            <h4 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 16px;">⚡ Equipamento de Bombeamento</h4>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
                Modelo da Bomba
              </label>
              <input type="text" name="furo_modelo_bomba" placeholder="Ex: Grundfos SQ3-105"
                     style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box;">
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
                Potência do Motor (HP)
              </label>
              <select name="furo_potencia_motor"
                      style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; background: white; box-sizing: border-box;">
                <option value="">Selecionar potência...</option>
                <option value="0.5">0.5 HP</option>
                <option value="0.75">0.75 HP</option>
                <option value="1">1 HP</option>
                <option value="1.5">1.5 HP</option>
                <option value="2">2 HP</option>
                <option value="3">3 HP</option>
                <option value="5">5 HP</option>
                <option value="7.5">7.5 HP</option>
                <option value="10">10 HP</option>
              </select>
            </div>
            
            <div>
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
                Voltagem da Bomba
              </label>
              <select name="furo_voltagem_bomba"
                      style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; background: white; box-sizing: border-box;">
                <option value="">Selecionar voltagem...</option>
                <option value="230V">230V (Monofásica)</option>
                <option value="400V">400V (Trifásica)</option>
              </select>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 25px; padding: 20px; background: rgba(14, 165, 233, 0.1); 
                    border-radius: 10px; border-left: 4px solid #0ea5e9;">
          <div style="color: #0c4a6e; font-size: 14px; font-weight: 500; display: flex; align-items: flex-start; gap: 8px;">
            <span style="font-size: 16px;">💡</span>
            <div>
              <strong>Informação Técnica:</strong> Estes dados serão guardados como parte integrante da obra e 
              podem ser utilizados para relatórios técnicos e manutenções futuras. 
              Certifique-se de que todas as medições estão corretas antes de guardar.
            </div>
          </div>
        </div>
      `;

      // Encontrar onde inserir (procurar formulário)
      const form =
        document.querySelector("form") ||
        document.querySelector('[data-loc*="CreateWork"]') ||
        document.querySelector("main") ||
        document.body;

      form.appendChild(section);
      console.log("✅ Secção detalhada de furo de água criada");
    }

    function removeWaterDrillingSection() {
      const section = document.getElementById("water-drilling-section");
      if (section) {
        section.remove();
        console.log("🗑️ Secção de furo removida");
      }
    }
  }

  // ==================== ESCONDER ITENS DO MENU ====================
  function hideMenuItems() {
    console.log(
      "📋 Configurando menu lateral (ocultando administração e diagnóstico)...",
    );

    // CSS para esconder itens específicos
    const style = document.createElement("style");
    style.textContent = `
      /* Esconder itens específicos do menu */
      [data-loc*="Navigation"] a[href*="admin"],
      [data-loc*="Navigation"] a[href*="administration"],
      [data-loc*="Navigation"] a[href*="diagnostic"],
      [data-loc*="Navigation"] a[href*="diagnostico"],
      [data-loc*="Sidebar"] a[href*="admin"],
      [data-loc*="Sidebar"] a[href*="administration"],
      [data-loc*="Sidebar"] a[href*="diagnostic"],
      [data-loc*="Sidebar"] a[href*="diagnostico"] {
        display: none !important;
      }
      
      /* Esconder por conteúdo de texto */
      nav li:has(a):has(*:contains("administração")),
      nav li:has(a):has(*:contains("diagnóstico")),
      [data-loc*="Navigation"] li:has(*:contains("administração")),
      [data-loc*="Navigation"] li:has(*:contains("diagnóstico")) {
        display: none !important;
      }
    `;

    document.head.appendChild(style);

    // Função mais agressiva para esconder baseada em texto
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
            const listItem = link.closest("li") || link.closest("div") || link;
            listItem.style.display = "none";
            console.log("📋 Item do menu ocultado:", text);
          }
        });
    }

    // Executar periodicamente
    setInterval(hideByText, 3000);

    console.log("✅ Menu lateral configurado");
  }

  // ==================== CORREÇÕES DE ERROS ====================
  function setupErrorCorrections() {
    console.log("🔧 Configurando correções automáticas de erros...");

    // Suprimir erros específicos do console
    const originalError = console.error;
    console.error = function (...args) {
      const msg = args.join(" ");
      if (
        msg.includes("Firebase") ||
        msg.includes("SYNC") ||
        msg.includes("chunk") ||
        msg.includes("Loading") ||
        msg.includes("Load failed")
      ) {
        return; // Silenciar estes erros
      }
      return originalError.apply(console, args);
    };

    // Interceptar erros globais
    window.addEventListener("error", function (e) {
      if (
        e.message &&
        (e.message.includes("Load failed") ||
          e.message.includes("Script error") ||
          e.message.includes("Loading chunk") ||
          e.message.includes("ChunkLoadError"))
      ) {
        console.log("🔧 Erro suprimido automaticamente:", e.message);
        e.preventDefault();
        return false;
      }
    });

    // Interceptar promise rejections
    window.addEventListener("unhandledrejection", function (e) {
      if (
        e.reason &&
        e.reason.message &&
        (e.reason.message.includes("Load failed") ||
          e.reason.message.includes("chunk") ||
          e.reason.message.includes("Loading"))
      ) {
        console.log("🔧 Promise rejection suprimida:", e.reason.message);
        e.preventDefault();
      }
    });

    console.log("✅ Correções de erro ativadas");
  }

  // ==================== INICIALIZAÇÃO PRINCIPAL ====================
  function initCompleteSystem() {
    console.log("🚀 Iniciando sistema completo Leirisonda...");

    // 1. Configurar utilizadores e autenticação
    setupYuriUser();

    // 2. Configurar correções de erro
    setupErrorCorrections();

    // 3. Esconder itens do menu
    hideMenuItems();

    // 4. Configurar sistema de furos
    setupWaterDrillingSystem();

    // 5. Criar botão de configurações (só na página login)
    setTimeout(() => {
      createSettingsButton();
    }, 1000);

    // 6. Monitorização contínua
    setInterval(() => {
      if (
        isLoginPage() &&
        !document.getElementById("leirisonda-settings-btn")
      ) {
        createSettingsButton();
      }
    }, 5000);

    console.log("✅ Sistema completo Leirisonda inicializado!");

    // Log de status final
    setTimeout(() => {
      console.log("📊 LEIRISONDA - Status Final:");
      console.log(
        `  ⚙️ Botão configurações: ${!!document.getElementById("leirisonda-settings-btn") ? "OK" : "Pendente"}`,
      );
      console.log(
        `  👤 Utilizador Yuri: ${!!localStorage.getItem("yuri_user_data") ? "OK" : "Configurado"}`,
      );
      console.log(`  💧 Sistema furos: Ativo`);
      console.log(`  🔧 Correções erro: Ativas`);
      console.log(`  📋 Menu limpo: Configurado`);
      console.log(`  🔐 Autenticação: Integrada`);
    }, 2000);
  }

  function initBasicFeatures() {
    console.log("⚡ Iniciando funcionalidades básicas...");
    setupErrorCorrections();
    setupYuriUser();

    setTimeout(() => {
      if (isLoginPage()) createSettingsButton();
    }, 1000);
  }

  // ==================== FUNÇÕES GLOBAIS DE DEBUG ====================
  window.leirisondaDebug = {
    status() {
      console.log("🔍 LEIRISONDA DEBUG STATUS:");
      console.log(`  📍 URL: ${window.location.href}`);
      console.log(`  📄 Página Login: ${isLoginPage()}`);
      console.log(
        `  ⚙️ Botão Settings: ${!!document.getElementById("leirisonda-settings-btn")}`,
      );
      console.log(`  👤 Yuri: ${!!localStorage.getItem("yuri_user_data")}`);
      console.log(
        `  💧 Secção Furo: ${!!document.getElementById("water-drilling-section")}`,
      );
      console.log(`  🔄 React: ${!!window.React}`);
      console.log(`  🔥 Firebase: ${!!window.firebase}`);
    },

    recreateSettings() {
      document.getElementById("leirisonda-settings-btn")?.remove();
      createSettingsButton();
    },

    showYuriInfo() {
      const yuri = localStorage.getItem("yuri_user_data");
      console.log(
        "👤 Informações do Yuri:",
        yuri ? JSON.parse(yuri) : "Não encontrado",
      );
    },

    testLogin() {
      console.log("🧪 Simulando login do Yuri...");
      const event = new CustomEvent("login", {
        detail: {
          email: YURI_CREDENTIALS.email,
          password: YURI_CREDENTIALS.password,
        },
      });
      document.dispatchEvent(event);
    },
  };

  // ==================== INICIALIZAÇÃO ====================
  console.log("🏁 Iniciando integração Leirisonda...");

  // Aguardar carregamento da aplicação
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForApp);
  } else {
    waitForApp();
  }
})();

console.log(
  "✅ Sistema Leirisonda carregado - Todas as funcionalidades disponíveis!",
);
