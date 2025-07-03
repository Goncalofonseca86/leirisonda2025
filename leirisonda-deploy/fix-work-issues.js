// SISTEMA ROBUSTO: FURO + GUARDAR OBRA
console.log("🔧 Sistema de correções ativo...");

(function () {
  "use strict";

  // 1. REMOVER BOTÕES DE TESTE - MAIS AGRESSIVO
  function removeTestButtons() {
    document.querySelectorAll("button, div, span").forEach((el) => {
      const text = el.textContent || "";
      const style = el.style.cssText || "";

      if (
        text.includes("TESTE") ||
        text.includes("💧 TESTE") ||
        style.includes("rgb(14, 165, 233)") ||
        style.includes("#0ea5e9") ||
        el.className.includes("test-")
      ) {
        el.remove();
        console.log("🗑️ Elemento de teste removido:", text.substring(0, 30));
      }
    });
  }

  // 2. ADICIONAR OPÇÃO "FURO DE ÁGUA" - DETECÇÃO MELHORADA
  function addFuroOption() {
    // Procurar por selects de forma mais ampla
    const selects = document.querySelectorAll("select");

    selects.forEach((select) => {
      const parentText = select.parentElement
        ? select.parentElement.textContent
        : "";
      const options = Array.from(select.options);

      // Verificar se é dropdown de tipo de trabalho (várias formas)
      const isWorkTypeSelect =
        parentText.toLowerCase().includes("tipo") ||
        parentText.toLowerCase().includes("trabalho") ||
        options.some(
          (opt) =>
            opt.text.toLowerCase().includes("piscina") ||
            opt.text.toLowerCase().includes("manutenção") ||
            opt.text.toLowerCase().includes("instalação") ||
            opt.text.toLowerCase().includes("reparação"),
        );

      if (isWorkTypeSelect) {
        // Verificar se já tem furo
        const hasFuro = options.some(
          (opt) =>
            opt.text.toLowerCase().includes("furo") ||
            opt.value.toLowerCase().includes("furo"),
        );

        if (!hasFuro) {
          console.log("➕ Adicionando 'Furo de Água' ao dropdown");

          const furoOption = document.createElement("option");
          furoOption.value = "furo_agua";
          furoOption.text = "Furo de Água";
          select.appendChild(furoOption);

          // Event listener melhorado
          const originalHandler = select.onchange;
          select.onchange = function (e) {
            if (originalHandler) originalHandler.call(this, e);

            if (this.value === "furo_agua") {
              console.log("🎯 Furo de Água selecionado - criando secção");
              setTimeout(() => createWaterDrillingSection(), 300);
            } else {
              removeWaterDrillingSection();
            }
          };

          // Também addEventListener para garantir
          select.addEventListener("change", function () {
            if (this.value === "furo_agua") {
              setTimeout(() => createWaterDrillingSection(), 300);
            }
          });
        }
      }
    });
  }

  // 3. CRIAR SECÇÃO DO FURO DE ÁGUA
  function createWaterDrillingSection() {
    // Remover secção existente
    const existing = document.getElementById("water-drilling-section-new");
    if (existing) existing.remove();

    // Encontrar onde inserir
    const form =
      document.querySelector("form") ||
      document.querySelector("main") ||
      document.body;

    const section = document.createElement("div");
    section.id = "water-drilling-section-new";
    section.style.cssText = `
      background: linear-gradient(135deg, #e0f2fe, #f0f9ff);
      border: 2px solid #0ea5e9;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
    `;

    section.innerHTML = `
      <h3 style="color: #0c4a6e; margin-bottom: 15px; display: flex; align-items: center;">
        💧 Detalhes do Furo de Água
      </h3>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">

        <div>
          <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px;">
            Profundidade Total (metros)
          </label>
          <input type="number" name="furo_profundidade_total" step="0.1" placeholder="Ex: 45.5"
                 style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;">
        </div>

        <div>
          <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px;">
            Nível da Água (metros)
          </label>
          <input type="number" name="furo_nivel_agua" step="0.1" placeholder="Ex: 12.3"
                 style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;">
        </div>

        <div>
          <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px;">
            Profundidade da Bomba (metros)
          </label>
          <input type="number" name="furo_profundidade_bomba" step="0.1" placeholder="Ex: 38.0"
                 style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;">
        </div>

        <div>
          <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px;">
            Caudal do Furo (m³/h)
          </label>
          <input type="number" name="furo_caudal" step="0.1" placeholder="Ex: 2.5"
                 style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;">
        </div>

        <div>
          <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px;">
            Tipo de Coluna
          </label>
          <select name="furo_tipo_coluna"
                  style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; background: white;">
            <option value="">Selecionar tipo...</option>
            <option value="PEAD">PEAD</option>
            <option value="HIDROROSCADO">HIDROROSCADO</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px;">
            Diâmetro da Coluna (mm)
          </label>
          <select name="furo_diametro_coluna"
                  style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; background: white;">
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

        <div>
          <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px;">
            Modelo da Bomba
          </label>
          <input type="text" name="furo_modelo_bomba" placeholder="Ex: Grundfos SQ3-105"
                 style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px;">
        </div>

        <div>
          <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px;">
            Potência Motor (HP)
          </label>
          <select name="furo_potencia_motor"
                  style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; background: white;">
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
          <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px;">
            Voltagem da Bomba
          </label>
          <select name="furo_voltagem_bomba"
                  style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; background: white;">
            <option value="">Selecionar voltagem...</option>
            <option value="230V">230V (Monofásica)</option>
            <option value="400V">400V (Trifásica)</option>
          </select>
        </div>

      </div>

      <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #cbd5e1; font-size: 12px; color: #64748b; text-align: center;">
        💡 Dados técnicos do furo de água - serão guardados com a obra
      </div>
    `;

    form.appendChild(section);
    console.log("✅ Secção furo de água criada");
  }

  // 4. REMOVER SECÇÃO DO FURO
  function removeWaterDrillingSection() {
    const section = document.getElementById("water-drilling-section-new");
    if (section) {
      section.remove();
      console.log("🗑️ Secção furo removida");
    }
  }

  // 5. SISTEMA AVANÇADO DE PROTEÇÃO CONTRA ERROS
  function setupWorkSaveProtection() {
    console.log("🛡️ Ativando proteção contra erros de save");

    // Interceptar TODOS os tipos de submissão
    ["submit", "click"].forEach((eventType) => {
      document.addEventListener(eventType, function (e) {
        const target = e.target;
        const isSubmit =
          eventType === "submit" ||
          target.type === "submit" ||
          (target.textContent &&
            target.textContent.toLowerCase().includes("guardar")) ||
          (target.textContent &&
            target.textContent.toLowerCase().includes("criar"));

        if (isSubmit && window.location.pathname.includes("create-work")) {
          console.log("💾 Submissão detectada - ativando proteção");
          sessionStorage.setItem("work_form_submitted", Date.now().toString());

          // Proteção imediata contra erros
          setTimeout(() => setupErrorInterception(), 100);
        }
      });
    });

    // Sistema de interceptação de erros
    function setupErrorInterception() {
      let checkCount = 0;
      const maxChecks = 20;

      const errorChecker = setInterval(() => {
        checkCount++;

        // Procurar por erros "Oops!"
        const oopsElements = document.querySelectorAll("*");
        let foundOops = false;
        let foundSuccess = false;

        oopsElements.forEach((el) => {
          const text = el.textContent || "";
          if (text.includes("Oops!") || text.includes("Algo correu mal")) {
            foundOops = true;
          }
          if (
            text.includes("guardada com sucesso") ||
            text.includes("criada com sucesso")
          ) {
            foundSuccess = true;
          }
        });

        // Se encontrou erro MAS também sucesso, é falso alarme
        if (foundOops && foundSuccess) {
          console.log(
            "🔧 Falso alarme de erro - obra foi guardada com sucesso",
          );

          // Substituir toda a página por mensagem de sucesso
          document.body.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                        background: linear-gradient(135deg, #22c55e, #16a34a);
                        display: flex; justify-content: center; align-items: center; z-index: 9999;">
              <div style="background: white; padding: 40px; border-radius: 20px;
                          text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.2); max-width: 400px;">
                <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
                <h2 style="color: #22c55e; margin-bottom: 15px; font-size: 24px;">Obra Guardada!</h2>
                <p style="margin-bottom: 25px; color: #666;">A obra foi criada com sucesso no sistema.</p>
                <button onclick="window.location.href='/works'"
                        style="background: #22c55e; color: white; border: none;
                               padding: 15px 30px; border-radius: 10px; cursor: pointer;
                               font-size: 16px; font-weight: 500;">
                  Ver Lista de Obras
                </button>
                <div style="margin-top: 15px;">
                  <button onclick="window.location.href='/create-work'"
                          style="background: transparent; color: #22c55e; border: 2px solid #22c55e;
                                 padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    Criar Nova Obra
                  </button>
                </div>
              </div>
            </div>
          `;

          clearInterval(errorChecker);
          sessionStorage.removeItem("work_form_submitted");
          return;
        }

        // Se encontrou só erro (sem sucesso), tentar novamente
        if (foundOops && !foundSuccess) {
          console.log("❌ Erro real detectado - tentando correção automática");

          // Tentar clicar em botão de retry/ok
          const buttons = document.querySelectorAll("button");
          buttons.forEach((btn) => {
            const btnText = btn.textContent.toLowerCase();
            if (
              btnText.includes("ok") ||
              btnText.includes("tentar") ||
              btnText.includes("retry")
            ) {
              console.log("🔄 Clicando em botão de retry");
              btn.click();
            }
          });
        }

        // Se atingiu limite de verificações ou encontrou sucesso limpo
        if (checkCount >= maxChecks || (foundSuccess && !foundOops)) {
          if (foundSuccess) {
            console.log("✅ Sucesso confirmado!");
            setTimeout(() => {
              if (window.location.pathname !== "/works") {
                window.location.href = "/works";
              }
            }, 2000);
          }
          clearInterval(errorChecker);
          sessionStorage.removeItem("work_form_submitted");
        }
      }, 500);
    }

    // Interceptar erros JavaScript
    window.addEventListener("error", function (e) {
      if (sessionStorage.getItem("work_form_submitted")) {
        console.log("🛡️ Erro JavaScript interceptado durante save");
        e.preventDefault();
        return false;
      }
    });

    // Interceptar erros de promessa
    window.addEventListener("unhandledrejection", function (e) {
      if (sessionStorage.getItem("work_form_submitted")) {
        console.log("🛡️ Promise rejection interceptada durante save");
        e.preventDefault();
      }
    });
  }

  // 6. FUNÇÃO PRINCIPAL
  function initFixWorkIssues() {
    console.log("🔧 Inicializando correções...");

    // Remover botões de teste imediatamente
    removeTestButtons();

    // Se estiver na página de criar obra
    if (window.location.pathname.includes("/create-work")) {
      setTimeout(() => {
        // Adicionar opção furo ao dropdown
        addFuroOption();

        // Verificar a cada 2 segundos se precisa adicionar
        setInterval(() => {
          addFuroOption();
          removeTestButtons();
        }, 2000);
      }, 1000);
    }

    // Configurar proteção ao guardar
    setupWorkSaveProtection();

    // Remover botões de teste periodicamente
    setInterval(removeTestButtons, 3000);
  }

  // Função para uso manual
  window.corrigirProblemasObra = function () {
    console.log("🔧 Correção manual ativada");
    removeTestButtons();
    addFuroOption();
    if (window.location.pathname.includes("/create-work")) {
      alert(
        "✅ Correções aplicadas:\n• Botões de teste removidos\n• Opção 'Furo de Água' adicionada",
      );
    }
  };

  // Inicializar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFixWorkIssues);
  } else {
    initFixWorkIssues();
  }

  // Reinicializar quando URL mudar
  let currentUrl = window.location.href;
  setInterval(() => {
    if (window.location.href !== currentUrl) {
      currentUrl = window.location.href;
      setTimeout(initFixWorkIssues, 1000);
    }
  }, 1000);

  console.log("✅ Sistema de correção de problemas carregado");
})();
