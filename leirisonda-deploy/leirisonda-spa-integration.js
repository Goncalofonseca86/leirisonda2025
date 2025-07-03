// ================================================
// SISTEMA LEIRISONDA - INTEGRAÇÃO SPA APRIMORADA
// ================================================
console.log("🚀 LEIRISONDA: Integração SPA React iniciada");

(function () {
  "use strict";

  // Configurações
  const SETTINGS_PASSWORD = "19867";
  const YURI_CREDENTIALS = {
    email: "yrzamr01@gmail.com",
    password: "070107",
    name: "Yuri Ferreira",
  };

  // Estado da aplicação
  let currentRoute = "";
  let routeObserver = null;
  let contentObserver = null;
  let isInitialized = false;

  // ==================== INICIALIZAÇÃO PRINCIPAL ====================
  function initSPAIntegration() {
    if (isInitialized) return;
    isInitialized = true;

    console.log("🔧 Iniciando integração SPA React...");

    // 1. Aguardar React estar totalmente carregado
    waitForReactApp();

    // 2. Configurar monitorização de rotas
    setupSPARouteMonitoring();

    // 3. Configurar utilizador Yuri
    setupYuriUser();

    // 4. Configurar botão de configurações
    setupSettingsButton();

    // 5. Configurar sistema de furos
    setupWaterDrillingSystem();

    console.log("✅ Integração SPA ativa");
  }

  // ==================== AGUARDAR REACT APP ====================
  function waitForReactApp() {
    let attempts = 0;
    const maxAttempts = 100;

    function checkReactReady() {
      attempts++;

      // Verificar se React está carregado
      const reactReady =
        document.querySelector("[data-reactroot]") ||
        document.querySelector("#root > div") ||
        document.querySelector("[data-loc]") ||
        window.React ||
        (window.firebase && window.firebase.auth);

      if (reactReady) {
        console.log("✅ React App detectado");
        setTimeout(proceedWithIntegration, 1000);
      } else if (attempts < maxAttempts) {
        setTimeout(checkReactReady, 100);
      } else {
        console.log("⚠️ React não detectado - prosseguindo sem aguardar");
        proceedWithIntegration();
      }
    }

    checkReactReady();
  }

  function proceedWithIntegration() {
    // Continuar com a integração
    currentRoute = window.location.pathname;
    console.log("📍 Rota inicial:", currentRoute);

    // Verificar imediatamente se está numa página de obras
    setTimeout(checkCurrentPage, 1000);
  }

  // ==================== MONITORIZAÇÃO DE ROTAS SPA ====================
  function setupSPARouteMonitoring() {
    console.log("👁️ Configurando monitorização SPA...");

    // Método 1: Interceptar history API
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
      originalPushState.apply(history, arguments);
      handleRouteChange();
    };

    history.replaceState = function () {
      originalReplaceState.apply(history, arguments);
      handleRouteChange();
    };

    // Método 2: Event listener para popstate
    window.addEventListener("popstate", handleRouteChange);

    // Método 3: Observer de mudanças no DOM
    if (contentObserver) contentObserver.disconnect();

    contentObserver = new MutationObserver((mutations) => {
      let significantChange = false;

      mutations.forEach((mutation) => {
        // Verificar se houve mudanças significativas no conteúdo
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          const hasContent = Array.from(mutation.addedNodes).some(
            (node) =>
              node.nodeType === 1 &&
              (node.textContent?.length > 50 || node.querySelector?.("form")),
          );

          if (hasContent) {
            significantChange = true;
          }
        }
      });

      if (significantChange) {
        setTimeout(checkCurrentPage, 500);
      }
    });

    contentObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Método 4: Verificação periódica
    setInterval(() => {
      const newRoute = window.location.pathname;
      if (newRoute !== currentRoute) {
        currentRoute = newRoute;
        handleRouteChange();
      }
    }, 2000);
  }

  function handleRouteChange() {
    const newRoute = window.location.pathname;
    if (newRoute !== currentRoute) {
      currentRoute = newRoute;
      console.log("🔄 Rota mudou:", currentRoute);

      setTimeout(checkCurrentPage, 1000);
    }
  }

  function checkCurrentPage() {
    const pageContent = document.body.textContent || "";
    const currentPath = window.location.pathname;

    console.log("🔍 Verificando página atual...");
    console.log("URL:", currentPath);
    console.log("Conteúdo relevante:", pageContent.substring(0, 200));

    // Detectar página de criação de obra - melhorada
    const isWorkCreationPage =
      currentPath.includes("create") ||
      currentPath.includes("work") ||
      currentPath.includes("obra") ||
      currentPath.includes("nova") ||
      pageContent.includes("Tipo de Trabalho") ||
      pageContent.includes("Criar Obra") ||
      pageContent.includes("Nova Obra") ||
      pageContent.includes("Work Type") ||
      pageContent.includes("Tipo de Serviço") ||
      pageContent.includes("Descrição") ||
      document.querySelector('select[name*="type"]') ||
      document.querySelector('select[name*="trabalho"]') ||
      document.querySelector('select[name*="servico"]') ||
      document.querySelector('input[name*="name"]') ||
      document.querySelector('textarea[name*="description"]') ||
      (document.querySelector("form") && pageContent.includes("Guardar"));

    // Detectar qualquer página de login
    const isLoginPage =
      currentPath.includes("login") ||
      document.querySelector('[data-loc*="Login.tsx"]') ||
      (pageContent.includes("Email") &&
        pageContent.includes("Password") &&
        !pageContent.includes("Criar"));

    if (isWorkCreationPage && !isLoginPage) {
      console.log("📝 Página de criação de obra detectada!");
      setupWaterDrillingOnPage();
    }

    // Configurar botão de configurações baseado na página
    setupSettingsButton();
  }

  // ==================== SISTEMA DE FUROS DE ÁGUA ====================
  function setupWaterDrillingSystem() {
    console.log("💧 Configurando sistema de furos de água...");

    window.leirisondaFuros = {
      detectPage() {
        console.log("🔍 Forçando detecção de página...");
        checkCurrentPage();
        return {
          url: window.location.pathname,
          content: document.body.textContent.substring(0, 100),
          selects: document.querySelectorAll("select").length,
          forms: document.querySelectorAll("form").length,
        };
      },

      forceCreate() {
        console.log("🔧 Forçando criação da secção de furo...");
        createWaterDrillingSection();
      },

      addOption() {
        console.log("➕ Forçando adição da opção furo...");
        addWaterDrillingOption();
      },

      status() {
        const selects = document.querySelectorAll("select");
        const processedSelects = document.querySelectorAll(
          'select[data-leirisonda-processed="true"]',
        );
        const furoOptions = document.querySelectorAll(
          'option[value="furo_agua"]',
        );
        const section = document.getElementById(
          "leirisonda-water-drilling-section",
        );

        const status = {
          url: window.location.pathname,
          selectsTotal: selects.length,
          selectsProcessed: processedSelects.length,
          furoOptions: furoOptions.length,
          sectionExists: !!section,
          pageContent: document.body.textContent.substring(0, 150),
        };

        console.log("📊 Status do sistema de furos:", status);
        return status;
      },
    };
  }

  function setupWaterDrillingOnPage() {
    console.log("💧 Configurando furos na página atual...");

    setTimeout(() => {
      addWaterDrillingOption();
      setupWaterDrillingTriggers();
    }, 500);

    // Verificar novamente após um delay maior
    setTimeout(() => {
      addWaterDrillingOption();
      setupWaterDrillingTriggers();
    }, 2000);
  }

  function addWaterDrillingOption() {
    console.log("➕ Procurando dropdowns para adicionar opção furo...");

    const selects = document.querySelectorAll(
      "select:not([data-leirisonda-processed])",
    );
    console.log(`📋 Encontrados ${selects.length} selects não processados`);

    selects.forEach((select, index) => {
      const options = Array.from(select.options);
      const selectText = select.outerHTML.substring(0, 100);
      const parentElement =
        select.closest("div, label, fieldset") || select.parentElement;
      const parentText = parentElement?.textContent || "";

      console.log(`🔍 Select ${index + 1}:`, {
        options: options.map((o) => o.text),
        parentText: parentText.substring(0, 50),
        name: select.name,
        id: select.id,
      });

      // Detectar se é um dropdown de tipo de trabalho
      const isWorkTypeSelect =
        parentText.toLowerCase().includes("tipo") ||
        parentText.toLowerCase().includes("trabalho") ||
        parentText.toLowerCase().includes("type") ||
        select.name?.toLowerCase().includes("type") ||
        select.name?.toLowerCase().includes("trabalho") ||
        options.some(
          (opt) =>
            opt.text.toLowerCase().includes("piscina") ||
            opt.text.toLowerCase().includes("manutenção") ||
            opt.text.toLowerCase().includes("instalação") ||
            opt.text.toLowerCase().includes("reparação") ||
            opt.text.toLowerCase().includes("pool") ||
            opt.text.toLowerCase().includes("maintenance"),
        );

      if (isWorkTypeSelect) {
        // Verificar se já tem opção de furo
        const hasFuro = options.some(
          (opt) =>
            opt.text.toLowerCase().includes("furo") ||
            opt.value.toLowerCase().includes("furo"),
        );

        if (!hasFuro) {
          console.log("✅ Adicionando opção 'Furo de Água' ao dropdown");

          const furoOption = document.createElement("option");
          furoOption.value = "furo_agua";
          furoOption.text = "Furo de Água";
          furoOption.setAttribute("data-leirisonda-furo", "true");
          select.appendChild(furoOption);

          console.log("🎯 Opção furo adicionada com sucesso");
        } else {
          console.log("ℹ️ Opção furo já existe neste select");
        }

        // Marcar como processado
        select.setAttribute("data-leirisonda-processed", "true");
      }
    });
  }

  function setupWaterDrillingTriggers() {
    console.log("🎛️ Configurando triggers para furos...");

    const allSelects = document.querySelectorAll("select");

    allSelects.forEach((select) => {
      // Remover listener existente
      select.removeEventListener("change", handleWaterDrillingChange);
      // Adicionar novo listener
      select.addEventListener("change", handleWaterDrillingChange);
    });

    console.log(`✅ Triggers configurados para ${allSelects.length} selects`);
  }

  function handleWaterDrillingChange(event) {
    const select = event.target;
    const value = select.value;

    console.log("🔄 Select mudou:", { value, name: select.name });

    if (value === "furo_agua") {
      console.log("💧 Furo de Água selecionado!");
      setTimeout(() => createWaterDrillingSection(), 300);
    } else {
      // Remover secção se existir
      const section = document.getElementById(
        "leirisonda-water-drilling-section",
      );
      if (section) {
        console.log("🗑️ Removendo secção de furo");
        section.remove();
      }
    }
  }

  function createWaterDrillingSection() {
    // Remover secção existente
    const existing = document.getElementById(
      "leirisonda-water-drilling-section",
    );
    if (existing) {
      existing.remove();
    }

    console.log("💧 Criando secção completa de furo de água...");

    const section = document.createElement("div");
    section.id = "leirisonda-water-drilling-section";

    // Estilos otimizados
    Object.assign(section.style, {
      background: "linear-gradient(135deg, #e0f2fe, #f0f9ff)",
      border: "2px solid #0ea5e9",
      borderRadius: "15px",
      padding: "20px",
      margin: "20px 0",
      boxShadow: "0 4px 15px rgba(14, 165, 233, 0.2)",
      animation: "fadeIn 0.3s ease-in-out",
    });

    section.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 20px; justify-content: center;">
        <span style="font-size: 28px; margin-right: 12px;">💧</span>
        <h3 style="color: #0c4a6e; margin: 0; font-size: 20px; font-weight: 600;">
          Detalhes Técnicos do Furo de Água
        </h3>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px;">

        <!-- Medições -->
        <div style="background: rgba(255, 255, 255, 0.8); padding: 15px; border-radius: 10px;">
          <h4 style="color: #0c4a6e; margin: 0 0 12px 0; font-size: 16px;">📏 Medições</h4>

            <div style="margin-bottom: 12px;">
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
                Profundidade Total (metros)
              </label>
              <input type="number" name="leirisonda_furo_profundidade" step="0.1" placeholder="Ex: 45.5"
                     data-leirisonda-field="true"
                     style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box;">
            </div>

            <div style="margin-bottom: 12px;">
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
                Nível da Água (metros)
              </label>
              <input type="number" name="leirisonda_furo_nivel_agua" step="0.1" placeholder="Ex: 12.3"
                     data-leirisonda-field="true"
                     style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box;">
            </div>

            <div>
              <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
                Caudal (m³/h)
              </label>
              <input type="number" name="leirisonda_furo_caudal" step="0.1" placeholder="Ex: 2.5"
                     data-leirisonda-field="true"
                     style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box;">
            </div>
        </div>

        <!-- Coluna -->
        <div style="background: rgba(255, 255, 255, 0.8); padding: 15px; border-radius: 10px;">
          <h4 style="color: #0c4a6e; margin: 0 0 12px 0; font-size: 16px;">🔧 Coluna</h4>

          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
              Tipo de Coluna
            </label>
            <select name="furo_tipo_coluna" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box; background: white;">
              <option value="">Selecionar...</option>
              <option value="PEAD">PEAD</option>
              <option value="HIDROROSCADO">HIDROROSCADO</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
              Diâmetro (mm)
            </label>
            <select name="furo_diametro" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box; background: white;">
              <option value="">Selecionar...</option>
              <option value="50">50mm</option>
              <option value="63">63mm</option>
              <option value="75">75mm</option>
              <option value="90">90mm</option>
              <option value="110">110mm</option>
            </select>
          </div>
        </div>

        <!-- Bomba -->
        <div style="background: rgba(255, 255, 255, 0.8); padding: 15px; border-radius: 10px;">
          <h4 style="color: #0c4a6e; margin: 0 0 12px 0; font-size: 16px;">⚡ Bomba</h4>

          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
              Modelo da Bomba
            </label>
            <input type="text" name="furo_modelo_bomba" placeholder="Ex: Grundfos SQ3-105"
                   style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box;">
          </div>

          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
              Potência (HP)
            </label>
            <select name="furo_potencia" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box; background: white;">
              <option value="">Selecionar...</option>
              <option value="0.5">0.5 HP</option>
              <option value="1">1 HP</option>
              <option value="1.5">1.5 HP</option>
              <option value="2">2 HP</option>
              <option value="3">3 HP</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 6px; font-size: 14px;">
              Voltagem
            </label>
            <select name="furo_voltagem" style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; box-sizing: border-box; background: white;">
              <option value="">Selecionar...</option>
              <option value="230V">230V</option>
              <option value="400V">400V</option>
            </select>
          </div>
        </div>
      </div>

      <div style="margin-top: 20px; padding: 15px; background: rgba(14, 165, 233, 0.1); border-radius: 10px; border-left: 4px solid #0ea5e9;">
        <div style="color: #0c4a6e; font-size: 14px; display: flex; align-items: flex-start; gap: 8px;">
          <span style="font-size: 16px;">💡</span>
          <div>
            <strong>Informação:</strong> Estes dados técnicos específicos para furos de água serão guardados como parte da obra.
          </div>
        </div>
      </div>
    `;

    // Adicionar CSS se não existir
    if (!document.getElementById("leirisonda-furos-css")) {
      const style = document.createElement("style");
      style.id = "leirisonda-furos-css";
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          #leirisonda-water-drilling-section > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Encontrar onde inserir
    const insertTarget =
      document.querySelector("form") ||
      document.querySelector("main") ||
      document.querySelector('[data-loc*="work"]') ||
      document.querySelector(".container") ||
      document.body;

    insertTarget.appendChild(section);

    // Scroll suave
    setTimeout(() => {
      section.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    console.log("✅ Secção de furo criada com sucesso");
  }

  // ==================== UTILIZADOR YURI ====================
  function setupYuriUser() {
    console.log("👤 Configurando utilizador Yuri...");

    // Aguardar Firebase
    let attempts = 0;
    function checkFirebase() {
      if (window.firebase && window.firebase.auth) {
        console.log("🔐 Firebase detectado - configurando Yuri");
        interceptFirebaseAuth();
      } else if (attempts < 20) {
        attempts++;
        setTimeout(checkFirebase, 500);
      }
    }
    checkFirebase();

    // Adicionar ao localStorage como fallback
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const yuriExists = users.some((u) => u.email === YURI_CREDENTIALS.email);

    if (!yuriExists) {
      users.push({
        id: "user_yuri_ferreira",
        email: YURI_CREDENTIALS.email,
        name: YURI_CREDENTIALS.name,
        role: "user",
        permissions: {
          canViewWorks: true,
          canCreateWorks: true,
          canEditWorks: true,
          canDeleteWorks: false,
        },
      });
      localStorage.setItem("users", JSON.stringify(users));
      console.log("👤 Yuri adicionado ao localStorage");
    }
  }

  function interceptFirebaseAuth() {
    if (!window.firebase?.auth()?.signInWithEmailAndPassword) return;

    const originalSignIn = window.firebase
      .auth()
      .signInWithEmailAndPassword.bind(window.firebase.auth());

    window.firebase.auth().signInWithEmailAndPassword = function (
      email,
      password,
    ) {
      if (
        email?.toLowerCase() === YURI_CREDENTIALS.email &&
        password === YURI_CREDENTIALS.password
      ) {
        console.log("🎯 Login do Yuri interceptado");

        // Simular user autenticado
        const mockUser = {
          uid: "yuri_ferreira_uid",
          email: YURI_CREDENTIALS.email,
          displayName: YURI_CREDENTIALS.name,
          emailVerified: true,
        };

        // Simular estado autenticado
        setTimeout(() => {
          if (window.firebase.auth().onAuthStateChanged) {
            const listeners = window.firebase.auth()._listeners || [];
            listeners.forEach((callback) => {
              if (typeof callback === "function") {
                callback(mockUser);
              }
            });
          }
        }, 100);

        return Promise.resolve({ user: mockUser });
      }

      return originalSignIn.call(this, email, password);
    };

    console.log("🔐 Firebase Auth interceptado para Yuri");
  }

  // ==================== BOTÃO CONFIGURAÇÕES ====================
  function setupSettingsButton() {
    // Só mostrar na página de login
    const isLoginPage =
      window.location.pathname.includes("login") ||
      document.querySelector('[data-loc*="Login.tsx"]') ||
      (document.body.textContent.includes("Email") &&
        document.body.textContent.includes("Password"));

    if (!isLoginPage) {
      // Remover botão se não estiver no login
      const existing = document.getElementById("leirisonda-settings-btn");
      if (existing) {
        existing.remove();
        console.log("🗑️ Botão removido (não é página de login)");
      }
      return;
    }

    if (document.getElementById("leirisonda-settings-btn")) return;

    console.log("⚙️ Criando botão de configurações (só no login)...");

    const button = document.createElement("div");
    button.id = "leirisonda-settings-btn";
    button.innerHTML = "⚙️";

    Object.assign(button.style, {
      position: "fixed",
      bottom: "20px",
      left: "20px",
      width: "50px",
      height: "50px",
      backgroundColor: "rgba(0, 119, 132, 0.95)",
      color: "white",
      borderRadius: "25px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "22px",
      zIndex: "999999",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
      transition: "all 0.3s ease",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      WebkitTapHighlightColor: "transparent",
      touchAction: "manipulation",
      userSelect: "none",
    });

    button.addEventListener("click", openSettingsModal);
    button.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        setTimeout(openSettingsModal, 100);
      },
      { passive: false },
    );

    document.body.appendChild(button);
    console.log("✅ Botão de configurações criado (login only)");
  }

  function openSettingsModal() {
    const existing = document.getElementById("leirisonda-settings-modal");
    if (existing) existing.remove();

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
      padding: "20px",
      boxSizing: "border-box",
    });

    const modal = document.createElement("div");
    Object.assign(modal.style, {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "25px",
      maxWidth: "350px",
      width: "100%",
      maxHeight: "80vh",
      overflowY: "auto",
    });

    modal.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 32px; margin-bottom: 10px;">⚙️</div>
        <h2 style="color: #007784; margin: 0; font-size: 20px;">Configurações Leirisonda</h2>
      </div>

      <div id="password-section">
        <input type="password" id="settings-password" placeholder="Password de acesso"
               style="width: 100%; padding: 12px; border: 2px solid #e1e5e9; border-radius: 10px; font-size: 16px; box-sizing: border-box; margin-bottom: 15px;">
        <button id="leirisonda-password-btn" style="width: 100%; padding: 14px; background: #007784; color: white; border: none; border-radius: 10px; font-size: 16px; cursor: pointer;">
          Aceder
        </button>
      </div>

      <div id="settings-content" style="display: none;">
        <div style="background: #f0f9ff; padding: 12px; border-radius: 10px; margin-bottom: 15px;">
          <div style="font-weight: 500; color: #0c4a6e; margin-bottom: 6px;">📊 Sistema</div>
          <div style="font-size: 11px; color: #075985;" id="system-status">
            <div>✅ Yuri: ${YURI_CREDENTIALS.email}</div>
            <div>✅ Password: ${YURI_CREDENTIALS.password}</div>
            <div>✅ Furos: Sistema ativo</div>
            <div>✅ SPA: React integrado</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
          <button id="leirisonda-test-yuri-btn" style="padding: 10px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 12px;">
            🧪 Testar Yuri
          </button>
          <button id="leirisonda-test-furos-btn" style="padding: 10px; background: #0ea5e9; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 12px;">
            💧 Testar Furos
          </button>
        </div>

        <div style="text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 10px;">
          <div><strong>Leirisonda SPA v2.1</strong></div>
          <div>React Integration | ${new Date().toLocaleDateString("pt-PT")}</div>
        </div>
      </div>

      <button id="leirisonda-close-btn" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">
        ✕
      </button>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Event listeners seguros para os botões
    const passwordBtn = modal.querySelector("#leirisonda-password-btn");
    const closeBtn = modal.querySelector("#leirisonda-close-btn");
    const testYuriBtn = modal.querySelector("#leirisonda-test-yuri-btn");
    const testFurosBtn = modal.querySelector("#leirisonda-test-furos-btn");

    if (passwordBtn) {
      passwordBtn.addEventListener("click", function () {
        const password = document.getElementById("settings-password").value;
        if (password === SETTINGS_PASSWORD) {
          document.getElementById("password-section").style.display = "none";
          document.getElementById("settings-content").style.display = "block";
        } else {
          alert("❌ Password incorreta");
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        overlay.remove();
      });
    }

    if (testYuriBtn) {
      testYuriBtn.addEventListener("click", function () {
        const emailInput = document.querySelector('input[type="email"]');
        const passwordInput = document.querySelector('input[type="password"]');

        if (emailInput && passwordInput) {
          emailInput.value = YURI_CREDENTIALS.email;
          passwordInput.value = YURI_CREDENTIALS.password;

          ["input", "change"].forEach((eventType) => {
            emailInput.dispatchEvent(new Event(eventType, { bubbles: true }));
            passwordInput.dispatchEvent(
              new Event(eventType, { bubbles: true }),
            );
          });

          alert("✅ Credenciais do Yuri preenchidas");
          overlay.remove();
        } else {
          alert("❌ Campos de login não encontrados");
        }
      });
    }

    if (testFurosBtn) {
      testFurosBtn.addEventListener("click", function () {
        try {
          if (window.leirisondaFuros && window.leirisondaFuros.status) {
            const status = window.leirisondaFuros.status();
            alert(
              `💧 Status Furos:\n\nURL: ${status.url}\nSelects: ${status.selectsTotal}\nOpções Furo: ${status.furoOptions}\nSecção: ${status.sectionExists ? "Ativa" : "Inativa"}`,
            );
          } else {
            alert("⚠️ Sistema de furos não inicializado");
          }
        } catch (e) {
          alert("❌ Erro ao verificar status dos furos");
        }
      });
    }

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }

  // ==================== INICIALIZAÇÃO ====================

  // Aguardar DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSPAIntegration);
  } else {
    initSPAIntegration();
  }

  // Fallback com timeout
  setTimeout(initSPAIntegration, 1000);

  console.log("🎯 Sistema Leirisonda SPA carregado");
})();
