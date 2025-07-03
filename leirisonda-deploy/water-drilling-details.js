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

// Auto-inicializar quando a página carrega
function initWaterDrilling() {
  // Verificar se estamos numa página de obra
  const isWorkPage =
    window.location.pathname.includes("/work") ||
    window.location.pathname.includes("/obra") ||
    document.querySelector('[data-testid*="work"]') ||
    document.body.textContent.includes("Obra") ||
    document.body.textContent.includes("Work");

  if (isWorkPage) {
    console.log("💧 Página de obra detectada");

    // Esperar um pouco para a página carregar
    setTimeout(() => {
      createWaterDrillingSection();
    }, 2000);

    // Verificar periodicamente se precisa recriar
    setInterval(() => {
      if (!document.getElementById("water-drilling-section") && isWorkPage) {
        createWaterDrillingSection();
      }
    }, 5000);
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
