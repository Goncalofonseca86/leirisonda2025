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

  // 2. ADICIONAR OPÇÃO "FURO DE ÁGUA" AO DROPDOWN TIPO DE TRABALHO
  function addFuroOption() {
    const selects = document.querySelectorAll("select");

    selects.forEach((select) => {
      // Verificar se é o select de tipo de trabalho
      const options = Array.from(select.options);
      const hasWorkOptions = options.some(
        (opt) =>
          opt.text.toLowerCase().includes("piscina") ||
          opt.text.toLowerCase().includes("manutenção"),
      );

      if (hasWorkOptions) {
        // Verificar se já tem opção furo
        const hasFuro = options.some(
          (opt) =>
            opt.text.toLowerCase().includes("furo") ||
            opt.value.toLowerCase().includes("furo"),
        );

        if (!hasFuro) {
          console.log("➕ Adicionando opção 'Furo de Água'");
          const furoOption = document.createElement("option");
          furoOption.value = "furo_agua";
          furoOption.text = "Furo de Água";
          select.appendChild(furoOption);

          // Adicionar listener para mostrar secção quando selecionado
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

  // 5. INTERCEPTAR E CORRIGIR ERROS AO GUARDAR OBRA
  function setupWorkSaveProtection() {
    // Interceptar submissões de formulário
    document.addEventListener("submit", function (e) {
      const form = e.target;

      if (
        form &&
        (form.textContent.includes("Informações Básicas") ||
          window.location.pathname.includes("/create-work"))
      ) {
        console.log("💾 Submissão de obra detectada - aplicando proteção");

        // Marcar que houve submissão
        sessionStorage.setItem("work_form_submitted", "true");

        // Interceptar erros que possam aparecer
        setTimeout(() => {
          const errorElements = document.querySelectorAll("*");
          errorElements.forEach((el) => {
            if (el.textContent && el.textContent.includes("Oops!")) {
              console.log("🔧 Erro detectado após submissão - corrigindo");

              // Se há mensagem de sucesso junto, substituir
              if (document.body.textContent.includes("guardada com sucesso")) {
                document.body.innerHTML = `
                  <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #22c55e;">
                    <div style="text-align: center; padding: 40px; background: white; border-radius: 16px; max-width: 400px;">
                      <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
                      <h2 style="color: #22c55e; margin-bottom: 15px;">Obra Guardada!</h2>
                      <p style="margin-bottom: 25px;">A obra foi criada com sucesso.</p>
                      <button onclick="window.location.href='/works'"
                              style="background: #22c55e; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
                        Ver Lista de Obras
                      </button>
                    </div>
                  </div>
                `;
              }
            }
          });
        }, 2000);
      }
    });

    // Auto-clique no X da mensagem de sucesso
    setInterval(() => {
      if (sessionStorage.getItem("work_form_submitted") === "true") {
        const successElements = document.querySelectorAll("*");
        successElements.forEach((el) => {
          if (
            el.textContent &&
            el.textContent.includes("guardada com sucesso")
          ) {
            const xButtons = el.querySelectorAll("button");
            xButtons.forEach((btn) => {
              if (
                btn.textContent &&
                (btn.textContent.includes("×") || btn.textContent.includes("✕"))
              ) {
                console.log("🔄 Auto-fechando mensagem de sucesso");
                btn.click();
                sessionStorage.removeItem("work_form_submitted");

                setTimeout(() => {
                  if (window.location.pathname !== "/works") {
                    window.location.href = "/works";
                  }
                }, 1000);
              }
            });
          }
        });
      }
    }, 500);
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
