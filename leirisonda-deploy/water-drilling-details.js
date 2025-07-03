// Componente para Detalhes do Furo de Água nas Obras
console.log("💧 Carregando componente Furo de Água");

// Função para criar a grelha de detalhes do furo de água
function createWaterDrillingSection() {
  // Verificar se já existe
  if (document.getElementById("water-drilling-section")) {
    return;
  }

  // Procurar por container da obra
  const workContainer =
    document.querySelector(
      '[data-testid="work-details"], .work-container, .obra-container',
    ) ||
    document.querySelector("main") ||
    document.querySelector(".container");

  if (!workContainer) {
    console.log("💧 Container da obra não encontrado");
    return;
  }

  console.log("💧 Criando secção Furo de Água");

  // Criar secção principal
  const section = document.createElement("div");
  section.id = "water-drilling-section";
  section.style.cssText = `
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  `;

  section.innerHTML = `
    <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 20px;">
      <h3 style="color: #1f2937; margin: 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
        💧 Detalhes do Furo de Água
      </h3>
      <button id="toggle-water-drilling" style="padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
        ▼ Mostrar/Ocultar
      </button>
    </div>

    <div id="water-drilling-content" style="display: block;">
      <!-- Grelha de dados técnicos -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">

        <!-- Coluna 1: Medidas do Furo -->
        <div style="background: #f8fafc; padding: 15px; border-radius: 6px;">
          <h4 style="color: #1e40af; margin: 0 0 15px 0; font-size: 14px; font-weight: 600; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">
            📏 Medidas do Furo
          </h4>

          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 4px; font-size: 13px;">
              Profundidade Total (metros)
            </label>
            <input
              type="number"
              id="profundidade-total"
              step="0.1"
              placeholder="Ex: 45.5"
              style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;"
            >
          </div>

          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 4px; font-size: 13px;">
              Nível da Água (metros)
            </label>
            <input
              type="number"
              id="nivel-agua"
              step="0.1"
              placeholder="Ex: 12.3"
              style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;"
            >
          </div>

          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 4px; font-size: 13px;">
              Profundidade da Bomba (metros)
            </label>
            <input
              type="number"
              id="profundidade-bomba"
              step="0.1"
              placeholder="Ex: 38.0"
              style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;"
            >
          </div>

          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 4px; font-size: 13px;">
              Caudal do Furo (m³/h)
            </label>
            <input
              type="number"
              id="caudal-furo"
              step="0.1"
              placeholder="Ex: 2.5"
              style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;"
            >
          </div>
        </div>

        <!-- Coluna 2: Coluna e Tubagem -->
        <div style="background: #fefce8; padding: 15px; border-radius: 6px;">
          <h4 style="color: #a16207; margin: 0 0 15px 0; font-size: 14px; font-weight: 600; border-bottom: 2px solid #eab308; padding-bottom: 5px;">
            🔧 Coluna e Tubagem
          </h4>

          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 4px; font-size: 13px;">
              Tipo de Coluna
            </label>
            <select
              id="tipo-coluna"
              style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; background: white;"
            >
              <option value="">Selecionar tipo...</option>
              <option value="PEAD">PEAD</option>
              <option value="HIDROROSCADO">HIDROROSCADO</option>
            </select>
          </div>

          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 4px; font-size: 13px;">
              Diâmetro da Coluna (mm)
            </label>
            <select
              id="diametro-coluna"
              style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; background: white;"
            >
              <option value="">Selecionar diâmetro...</option>
              <option value="50">50mm</option>
              <option value="63">63mm</option>
              <option value="75">75mm</option>
              <option value="90">90mm</option>
              <option value="110">110mm</option>
              <option value="125">125mm</option>
              <option value="140">140mm</option>
              <option value="160">160mm</option>
              <option value="200">200mm</option>
            </select>
          </div>
        </div>

        <!-- Coluna 3: Bomba Instalada -->
        <div style="background: #f0fdf4; padding: 15px; border-radius: 6px;">
          <h4 style="color: #166534; margin: 0 0 15px 0; font-size: 14px; font-weight: 600; border-bottom: 2px solid #22c55e; padding-bottom: 5px;">
            ⚡ Bomba Instalada
          </h4>

          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 4px; font-size: 13px;">
              Modelo da Bomba
            </label>
            <input
              type="text"
              id="modelo-bomba"
              placeholder="Ex: Grundfos SQ3-105"
              style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px;"
            >
          </div>

          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 4px; font-size: 13px;">
              Potência do Motor (HP)
            </label>
            <select
              id="potencia-motor"
              style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; background: white;"
            >
              <option value="">Selecionar potência...</option>
              <option value="0.5">0.5 HP</option>
              <option value="0.75">0.75 HP</option>
              <option value="1">1 HP</option>
              <option value="1.5">1.5 HP</option>
              <option value="2">2 HP</option>
              <option value="3">3 HP</option>
              <option value="4">4 HP</option>
              <option value="5">5 HP</option>
              <option value="7.5">7.5 HP</option>
              <option value="10">10 HP</option>
            </select>
          </div>

          <div style="margin-bottom: 12px;">
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 4px; font-size: 13px;">
              Voltagem da Bomba
            </label>
            <select
              id="voltagem-bomba"
              style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; background: white;"
            >
              <option value="">Selecionar voltagem...</option>
              <option value="230V">230V (Monofásica)</option>
              <option value="400V">400V (Trifásica)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Botões de ação -->
      <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
        <button onclick="clearWaterDrillingData()" style="padding: 8px 16px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
          🗑️ Limpar
        </button>
        <button onclick="saveWaterDrillingData()" style="padding: 8px 16px; background: #059669; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500;">
          💾 Guardar Dados
        </button>
      </div>

      <!-- Resumo dos dados -->
      <div id="water-drilling-summary" style="margin-top: 15px; padding: 10px; background: #eff6ff; border-radius: 4px; border-left: 4px solid #3b82f6; display: none;">
        <h5 style="margin: 0 0 5px 0; color: #1e40af; font-size: 13px;">📋 Resumo dos Dados:</h5>
        <div id="summary-content" style="font-size: 12px; color: #374151;"></div>
      </div>
    </div>
  `;

  // Inserir no container
  workContainer.appendChild(section);

  // Configurar toggle
  document
    .getElementById("toggle-water-drilling")
    .addEventListener("click", function () {
      const content = document.getElementById("water-drilling-content");
      const isVisible = content.style.display !== "none";
      content.style.display = isVisible ? "none" : "block";
      this.textContent = isVisible ? "▶ Mostrar/Ocultar" : "▼ Mostrar/Ocultar";
    });

  // Carregar dados existentes se houver
  loadWaterDrillingData();

  console.log("✅ Secção Furo de Água criada");
}

// Funções globais para gestão dos dados
window.saveWaterDrillingData = function () {
  try {
    const data = {
      profundidadeTotal: document.getElementById("profundidade-total").value,
      nivelAgua: document.getElementById("nivel-agua").value,
      profundidadeBomba: document.getElementById("profundidade-bomba").value,
      caudalFuro: document.getElementById("caudal-furo").value,
      tipoColuna: document.getElementById("tipo-coluna").value,
      diametroColuna: document.getElementById("diametro-coluna").value,
      modeloBomba: document.getElementById("modelo-bomba").value,
      potenciaMotor: document.getElementById("potencia-motor").value,
      voltagemBomba: document.getElementById("voltagem-bomba").value,
      dataAtualizacao: new Date().toISOString(),
    };

    // Identificar a obra atual
    const workId = getWorkId();
    const storageKey = `water_drilling_${workId}`;

    // Guardar localmente
    localStorage.setItem(storageKey, JSON.stringify(data));

    // Guardar em lista geral também
    const allDrillingData = JSON.parse(
      localStorage.getItem("all_water_drilling_data") || "{}",
    );
    allDrillingData[workId] = data;
    localStorage.setItem(
      "all_water_drilling_data",
      JSON.stringify(allDrillingData),
    );

    // Mostrar resumo
    showWaterDrillingSummary(data);

    console.log("💾 Dados do furo de água guardados:", data);
    alert("✅ Dados do Furo de Água guardados com sucesso!");

    // Tentar sincronizar com Firebase se disponível
    if (window.hr && window.hr.firestore) {
      try {
        // Procurar pelo documento da obra no Firebase
        window.hr.firestore
          .collection("works")
          .doc(workId)
          .update({
            waterDrillingDetails: data,
          })
          .then(() => {
            console.log("🔥 Dados sincronizados com Firebase");
          })
          .catch((e) => {
            console.log("⚠️ Erro ao sincronizar com Firebase:", e.message);
          });
      } catch (e) {
        console.log("⚠️ Firebase não disponível para sincronização");
      }
    }
  } catch (error) {
    console.error("❌ Erro ao guardar dados:", error);
    alert("❌ Erro ao guardar dados: " + error.message);
  }
};

window.clearWaterDrillingData = function () {
  if (
    confirm(
      "🗑️ Limpar todos os dados do Furo de Água?\n\nEsta ação não pode ser desfeita!",
    )
  ) {
    // Limpar campos
    [
      "profundidade-total",
      "nivel-agua",
      "profundidade-bomba",
      "caudal-furo",
      "tipo-coluna",
      "diametro-coluna",
      "modelo-bomba",
      "potencia-motor",
      "voltagem-bomba",
    ].forEach((id) => {
      const field = document.getElementById(id);
      if (field) field.value = "";
    });

    // Limpar armazenamento
    const workId = getWorkId();
    localStorage.removeItem(`water_drilling_${workId}`);

    // Ocultar resumo
    document.getElementById("water-drilling-summary").style.display = "none";

    console.log("🗑️ Dados do furo de água limpos");
    alert("✅ Dados limpos!");
  }
};

function loadWaterDrillingData() {
  try {
    const workId = getWorkId();
    const data = localStorage.getItem(`water_drilling_${workId}`);

    if (data) {
      const parsedData = JSON.parse(data);

      // Preencher campos
      Object.keys(parsedData).forEach((key) => {
        const fieldMap = {
          profundidadeTotal: "profundidade-total",
          nivelAgua: "nivel-agua",
          profundidadeBomba: "profundidade-bomba",
          caudalFuro: "caudal-furo",
          tipoColuna: "tipo-coluna",
          diametroColuna: "diametro-coluna",
          modeloBomba: "modelo-bomba",
          potenciaMotor: "potencia-motor",
          voltagemBomba: "voltagem-bomba",
        };

        const fieldId = fieldMap[key];
        if (fieldId) {
          const field = document.getElementById(fieldId);
          if (field && parsedData[key]) {
            field.value = parsedData[key];
          }
        }
      });

      // Mostrar resumo
      showWaterDrillingSummary(parsedData);

      console.log("📄 Dados do furo de água carregados");
    }
  } catch (error) {
    console.error("❌ Erro ao carregar dados:", error);
  }
}

function showWaterDrillingSummary(data) {
  const summary = document.getElementById("water-drilling-summary");
  const content = document.getElementById("summary-content");

  if (summary && content) {
    const summaryText = [
      data.profundidadeTotal ? `Profundidade: ${data.profundidadeTotal}m` : "",
      data.nivelAgua ? `Nível água: ${data.nivelAgua}m` : "",
      data.profundidadeBomba ? `Bomba a: ${data.profundidadeBomba}m` : "",
      data.caudalFuro ? `Caudal: ${data.caudalFuro}m³/h` : "",
      data.tipoColuna ? `Coluna: ${data.tipoColuna}` : "",
      data.diametroColuna ? `Ø${data.diametroColuna}mm` : "",
      data.modeloBomba ? `Bomba: ${data.modeloBomba}` : "",
      data.potenciaMotor ? `${data.potenciaMotor}HP` : "",
      data.voltagemBomba ? `${data.voltagemBomba}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    content.textContent = summaryText || "Nenhum dado inserido ainda";
    summary.style.display = "block";
  }
}

function getWorkId() {
  // Tentar extrair ID da obra da URL ou outros elementos
  const url = window.location.pathname;
  const urlMatch = url.match(/\/works?\/([^\/]+)/);

  if (urlMatch) {
    return urlMatch[1];
  }

  // Fallback: usar o título da página ou timestamp
  const title = document.title || window.location.href;
  return (
    btoa(title)
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 10) || "default"
  );
}

// Monitorar campo tipo de trabalho
function monitorWorkTypeField() {
  console.log("👁️ Monitorizando campo tipo de trabalho...");

  // Procurar por campos de tipo de trabalho
  const possibleSelectors = [
    'select[name*="tipo"]',
    'select[name*="type"]',
    'select[name*="trabalho"]',
    'select[name*="work"]',
    'input[name*="tipo"]',
    'input[name*="type"]',
    'select:has(option[value*="furo"])',
    'select:has(option[value*="drilling"])',
    '[data-testid*="work-type"]',
    '[data-testid*="tipo"]',
  ];

  let workTypeField = null;

  for (const selector of possibleSelectors) {
    try {
      const field = document.querySelector(selector);
      if (field) {
        // Verificar se tem opções relacionadas com furo
        if (field.tagName === "SELECT") {
          const options = Array.from(field.options || []);
          const hasFuroOption = options.some(
            (opt) =>
              opt.value.toLowerCase().includes("furo") ||
              opt.text.toLowerCase().includes("furo") ||
              opt.value.toLowerCase().includes("drilling") ||
              opt.text.toLowerCase().includes("drilling"),
          );

          if (hasFuroOption) {
            workTypeField = field;
            console.log("✅ Campo tipo de trabalho encontrado:", selector);
            break;
          }
        }
      }
    } catch (e) {
      // Ignorar erros de seletor
    }
  }

  if (workTypeField) {
    setupWorkTypeListener(workTypeField);
  } else {
    // Tentar encontrar por texto próximo
    const labels = document.querySelectorAll("label, span, div");
    for (const label of labels) {
      const text = label.textContent.toLowerCase();
      if (
        (text.includes("tipo") && text.includes("trabalho")) ||
        (text.includes("type") && text.includes("work"))
      ) {
        // Procurar campo próximo
        const nearbyFields = [
          label.querySelector("select"),
          label.querySelector("input"),
          label.nextElementSibling?.querySelector("select"),
          label.nextElementSibling?.querySelector("input"),
          label.parentElement?.querySelector("select"),
          label.parentElement?.querySelector("input"),
        ].filter(Boolean);

        for (const field of nearbyFields) {
          if (
            field &&
            (field.tagName === "SELECT" || field.tagName === "INPUT")
          ) {
            workTypeField = field;
            console.log("✅ Campo encontrado por proximidade");
            setupWorkTypeListener(workTypeField);
            break;
          }
        }

        if (workTypeField) break;
      }
    }
  }

  // Fallback: criar listener genérico para mudanças em selects
  if (!workTypeField) {
    console.log(
      "⚠️ Campo específico não encontrado - usando listener genérico",
    );
    setupGenericListener();
  }
}

function setupWorkTypeListener(field) {
  console.log("🎯 Configurando listener para campo tipo de trabalho");

  const checkAndToggleFuroSection = () => {
    const value = field.value?.toLowerCase() || "";
    const text = field.selectedOptions?.[0]?.text?.toLowerCase() || "";

    const isFuroSelected =
      value.includes("furo") ||
      text.includes("furo") ||
      value.includes("drilling") ||
      text.includes("drilling");

    console.log(
      `💧 Furo selecionado: ${isFuroSelected} (valor: "${value}", texto: "${text}")`,
    );

    if (isFuroSelected) {
      createWaterDrillingInlineSection();
    } else {
      removeWaterDrillingSection();
    }
  };

  // Listener para mudanças
  field.addEventListener("change", checkAndToggleFuroSection);
  field.addEventListener("input", checkAndToggleFuroSection);

  // Verificar estado inicial
  setTimeout(checkAndToggleFuroSection, 500);
}

function setupGenericListener() {
  // Listener genérico para qualquer mudança em selects
  document.addEventListener("change", (e) => {
    if (e.target.tagName === "SELECT") {
      const value = e.target.value?.toLowerCase() || "";
      const text = e.target.selectedOptions?.[0]?.text?.toLowerCase() || "";

      if (
        value.includes("furo") ||
        text.includes("furo") ||
        value.includes("drilling") ||
        text.includes("drilling")
      ) {
        console.log("💧 Furo detectado em mudança genérica");
        createWaterDrillingInlineSection();
      }
    }
  });
}

function createWaterDrillingInlineSection() {
  // Verificar se já existe
  if (document.getElementById("inline-water-drilling")) {
    return;
  }

  console.log("💧 Criando secção inline do Furo de Água");

  // Procurar onde inserir (após o campo tipo de trabalho)
  let insertTarget = findInsertionPoint();

  if (!insertTarget) {
    console.log("❌ Ponto de inserção não encontrado");
    return;
  }

  // Criar secção compacta para o formulário
  const section = document.createElement("div");
  section.id = "inline-water-drilling";
  section.style.cssText = `
    background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
    border: 2px solid #0ea5e9;
    border-radius: 12px;
    padding: 20px;
    margin: 15px 0;
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
    animation: slideIn 0.3s ease-out;
  `;

  // Adicionar keyframes se não existirem
  if (!document.getElementById("water-drilling-animations")) {
    const style = document.createElement("style");
    style.id = "water-drilling-animations";
    style.textContent = `
      @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  section.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 15px;">
      <h4 style="color: #0c4a6e; margin: 0; font-size: 16px; font-weight: 600; display: flex; align-items: center;">
        💧 Detalhes do Furo de Água
      </h4>
      <span style="margin-left: auto; font-size: 12px; color: #64748b; font-style: italic;">
        Preencha os dados técnicos do furo
      </span>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">

      <!-- Medidas básicas -->
      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 13px;">
          Profundidade Total (m)
        </label>
        <input
          type="number"
          name="furo_profundidade_total"
          step="0.1"
          placeholder="Ex: 45.5"
          style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px;"
        >
      </div>

      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 13px;">
          Nível da Água (m)
        </label>
        <input
          type="number"
          name="furo_nivel_agua"
          step="0.1"
          placeholder="Ex: 12.3"
          style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px;"
        >
      </div>

      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 13px;">
          Profundidade Bomba (m)
        </label>
        <input
          type="number"
          name="furo_profundidade_bomba"
          step="0.1"
          placeholder="Ex: 38.0"
          style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px;"
        >
      </div>

      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 13px;">
          Caudal (m³/h)
        </label>
        <input
          type="number"
          name="furo_caudal"
          step="0.1"
          placeholder="Ex: 2.5"
          style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px;"
        >
      </div>

      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 13px;">
          Tipo de Coluna
        </label>
        <select
          name="furo_tipo_coluna"
          style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; background: white;"
        >
          <option value="">Selecionar...</option>
          <option value="PEAD">PEAD</option>
          <option value="HIDROROSCADO">HIDROROSCADO</option>
        </select>
      </div>

      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 13px;">
          Diâmetro Coluna (mm)
        </label>
        <select
          name="furo_diametro_coluna"
          style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; background: white;"
        >
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

      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 13px;">
          Modelo da Bomba
        </label>
        <input
          type="text"
          name="furo_modelo_bomba"
          placeholder="Ex: Grundfos SQ3-105"
          style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px;"
        >
      </div>

      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 13px;">
          Potência Motor (HP)
        </label>
        <select
          name="furo_potencia_motor"
          style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; background: white;"
        >
          <option value="">Selecionar...</option>
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
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 13px;">
          Voltagem da Bomba
        </label>
        <select
          name="furo_voltagem_bomba"
          style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; background: white;"
        >
          <option value="">Selecionar...</option>
          <option value="230V">230V (Monofásica)</option>
          <option value="400V">400V (Trifásica)</option>
        </select>
      </div>
    </div>

    <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #cbd5e1; font-size: 12px; color: #64748b; text-align: center;">
      💡 Estes dados serão guardados juntamente com a obra
    </div>
  `;

  insertTarget.appendChild(section);
  console.log("✅ Secção inline do furo criada");
}

function findInsertionPoint() {
  // Procurar por pontos de inserção lógicos
  const targets = [
    // Após campo tipo de trabalho
    document.querySelector('select[name*="tipo"] + *'),
    document.querySelector('select[name*="type"] + *'),

    // Dentro de containers de formulário
    document.querySelector("form .grid"),
    document.querySelector("form .form-grid"),
    document.querySelector('[class*="grid"]'),

    // Containers genéricos
    document.querySelector("form > div:last-child"),
    document.querySelector("main form"),
    document.querySelector(".container form"),

    // Fallback
    document.querySelector("main"),
    document.querySelector(".container"),
    document.body,
  ];

  for (const target of targets) {
    if (target) {
      console.log(
        "🎯 Ponto de inserção encontrado:",
        target.tagName,
        target.className,
      );
      return target;
    }
  }

  return null;
}

function removeWaterDrillingSection() {
  const section = document.getElementById("inline-water-drilling");
  if (section) {
    section.style.animation = "slideOut 0.3s ease-in";
    setTimeout(() => {
      section.remove();
      console.log("🗑️ Secção do furo removida");
    }, 300);
  }
}

// Auto-inicializar quando a página carrega
function initWaterDrilling() {
  // Verificar se estamos numa página de criação ou edição de obra
  const isCreateWorkPage =
    window.location.pathname.includes("/create-work") ||
    window.location.pathname.includes("/obra") ||
    window.location.pathname.includes("/new") ||
    document.querySelector("form") ||
    document.body.textContent.includes("Nova Obra") ||
    document.body.textContent.includes("Criar Obra");

  if (isCreateWorkPage) {
    console.log("💧 Página de criação de obra detectada");

    // Esperar um pouco para a página carregar
    setTimeout(() => {
      monitorWorkTypeField();
    }, 2000);

    // Verificar periodicamente
    setInterval(() => {
      if (
        !document.querySelector('select[name*="tipo"], select[name*="type"]')
      ) {
        monitorWorkTypeField();
      }
    }, 5000);
  }

  // Também verificar páginas de obra existente
  const isWorkDetailPage =
    window.location.pathname.includes("/work") &&
    !window.location.pathname.includes("/create");

  if (isWorkDetailPage) {
    console.log("💧 Página de detalhes de obra detectada");
    setTimeout(() => {
      createWaterDrillingSection();
    }, 2000);
  }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWaterDrilling);
} else {
  initWaterDrilling();
}

// Re-inicializar quando a URL mudar (SPAs)
let currentUrl = window.location.href;
setInterval(() => {
  if (currentUrl !== window.location.href) {
    currentUrl = window.location.href;
    setTimeout(initWaterDrilling, 1000);
  }
}, 1000);

console.log("✅ Sistema Furo de Água carregado");
