// ADICIONAR SECÇÃO FUROS DIRECTAMENTE NA PÁGINA DE LOGIN
console.log("💧 Forçando secção furos na página de login...");

function adicionarFuroNaLogin() {
  console.log("🔧 Tentando adicionar secção furo na página de login...");

  // Verificar se já existe
  if (document.getElementById("secção-furo-login")) {
    console.log("✅ Secção já existe na login");
    return;
  }

  // Procurar pelo formulário de login
  const loginForm =
    document.querySelector("form") ||
    document.querySelector('[data-loc*="Login"]') ||
    document.querySelector("div");

  if (!loginForm) {
    console.log("❌ Formulário de login não encontrado");
    return;
  }

  console.log("📦 Adicionando secção furo ao login...");

  // Criar a secção do furo
  const seccaoFuro = document.createElement("div");
  seccaoFuro.id = "secção-furo-login";
  seccaoFuro.style.cssText = `
    background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
    border: 2px solid #0ea5e9;
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
    position: fixed;
    top: 50px;
    right: 20px;
    width: 400px;
    max-height: 80vh;
    overflow-y: auto;
    z-index: 9999;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  `;

  seccaoFuro.innerHTML = `
    <div style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
      <h3 style="color: #0c4a6e; margin: 0; font-size: 18px; font-weight: 600;">
        💧 Detalhes do Furo de Água
      </h3>
      <button onclick="this.closest('#secção-furo-login').remove();" 
              style="background: #dc2626; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">
        ✕
      </button>
    </div>

    <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px;">
      Preencha os dados técnicos do furo de água
    </p>

    <div style="display: grid; gap: 12px;">
      
      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 12px;">
          Profundidade Total (metros)
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
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 12px;">
          Nível da Água (metros)
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
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 12px;">
          Profundidade da Bomba (metros)
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
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 12px;">
          Caudal do Furo (m³/h)
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
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 12px;">
          Tipo de Coluna
        </label>
        <select
          name="furo_tipo_coluna"
          style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; background: white;"
        >
          <option value="">Selecionar tipo...</option>
          <option value="PEAD">PEAD</option>
          <option value="HIDROROSCADO">HIDROROSCADO</option>
        </select>
      </div>

      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 12px;">
          Diâmetro da Coluna (mm)
        </label>
        <select
          name="furo_diametro_coluna"
          style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; background: white;"
        >
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
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 12px;">
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
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 12px;">
          Potência Motor (HP)
        </label>
        <select
          name="furo_potencia_motor"
          style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; background: white;"
        >
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
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 12px;">
          Voltagem da Bomba
        </label>
        <select
          name="furo_voltagem_bomba"
          style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 14px; background: white;"
        >
          <option value="">Selecionar voltagem...</option>
          <option value="230V">230V (Monofásica)</option>
          <option value="400V">400V (Trifásica)</option>
        </select>
      </div>

    </div>

    <div style="margin-top: 15px; padding-top: 12px; border-top: 1px solid #cbd5e1; text-align: center;">
      <button
        type="button"
        onclick="alert('Dados do furo registados!');"
        style="padding: 8px 16px; background: #22c55e; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; margin-right: 10px;"
      >
        ✅ Guardar Furo
      </button>
      <button
        type="button"
        onclick="this.closest('#secção-furo-login').remove();"
        style="padding: 8px 16px; background: #dc2626; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;"
      >
        🗑️ Fechar
      </button>
    </div>
  `;

  // Adicionar ao body
  document.body.appendChild(seccaoFuro);

  console.log("✅ Secção furo adicionada à página de login!");
  return true;
}

// Tentar adicionar imediatamente
setTimeout(function () {
  adicionarFuroNaLogin();
}, 1000);

// Tentar adicionar várias vezes
let tentativas = 0;
const intervalId = setInterval(function () {
  tentativas++;

  if (tentativas > 10) {
    clearInterval(intervalId);
    return;
  }

  if (!document.getElementById("secção-furo-login")) {
    console.log(`🔄 Tentativa ${tentativas} de adicionar secção furo...`);
    adicionarFuroNaLogin();
  } else {
    console.log("✅ Secção já existe - parando tentativas");
    clearInterval(intervalId);
  }
}, 2000);

console.log("🔧 Script furo na login carregado");
