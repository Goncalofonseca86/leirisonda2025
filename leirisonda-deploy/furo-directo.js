// Script super directo para adicionar secção Furo de Água
console.log("🔧 Carregando script furo directo...");

function adicionarSeccaoFuro() {
  console.log("💧 Tentando adicionar secção furo...");

  // Verificar se já existe
  if (document.getElementById("secção-furo-agua")) {
    console.log("✅ Secção já existe");
    return;
  }

  // Procurar pelo texto "Tipo de Trabalho"
  const elementos = document.querySelectorAll("*");
  let elementoTipo = null;

  for (let elemento of elementos) {
    if (
      elemento.textContent &&
      elemento.textContent.trim() === "Tipo de Trabalho *"
    ) {
      elementoTipo = elemento;
      console.log("🎯 Encontrado elemento 'Tipo de Trabalho'");
      break;
    }
  }

  if (!elementoTipo) {
    console.log("❌ Elemento 'Tipo de Trabalho' não encontrado");
    return;
  }

  // Encontrar o container pai para inserir depois
  let container = elementoTipo.parentElement;
  while (container && !container.querySelector("select")) {
    container = container.parentElement;
  }

  if (!container) {
    console.log("❌ Container não encontrado");
    return;
  }

  console.log("📦 Container encontrado:", container.tagName);

  // Criar a secção do furo
  const seccaoFuro = document.createElement("div");
  seccaoFuro.id = "secção-furo-agua";
  seccaoFuro.style.cssText = `
    background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%);
    border: 2px solid #0ea5e9;
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0;
    display: block;
  `;

  seccaoFuro.innerHTML = `
    <div style="margin-bottom: 15px;">
      <h3 style="color: #0c4a6e; margin: 0; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
        💧 Detalhes do Furo de Água
      </h3>
      <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">
        Preencha os dados técnicos do furo de água
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">

      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 14px;">
          Profundidade Total (metros)
        </label>
        <input
          type="number"
          name="furo_profundidade_total"
          step="0.1"
          placeholder="Ex: 45.5"
          style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 16px;"
        >
      </div>

      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 14px;">
          Nível da Água (metros)
        </label>
        <input
          type="number"
          name="furo_nivel_agua"
          step="0.1"
          placeholder="Ex: 12.3"
          style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 16px;"
        >
      </div>

      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 14px;">
          Profundidade da Bomba (metros)
        </label>
        <input
          type="number"
          name="furo_profundidade_bomba"
          step="0.1"
          placeholder="Ex: 38.0"
          style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 16px;"
        >
      </div>

      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 14px;">
          Caudal do Furo (m³/h)
        </label>
        <input
          type="number"
          name="furo_caudal"
          step="0.1"
          placeholder="Ex: 2.5"
          style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 16px;"
        >
      </div>

      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 14px;">
          Tipo de Coluna
        </label>
        <select
          name="furo_tipo_coluna"
          style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 16px; background: white;"
        >
          <option value="">Selecionar tipo...</option>
          <option value="PEAD">PEAD</option>
          <option value="HIDROROSCADO">HIDROROSCADO</option>
        </select>
      </div>

      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 14px;">
          Diâmetro da Coluna (mm)
        </label>
        <select
          name="furo_diametro_coluna"
          style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 16px; background: white;"
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
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 14px;">
          Modelo da Bomba
        </label>
        <input
          type="text"
          name="furo_modelo_bomba"
          placeholder="Ex: Grundfos SQ3-105"
          style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 16px;"
        >
      </div>

      <div>
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 14px;">
          Potência Motor (HP)
        </label>
        <select
          name="furo_potencia_motor"
          style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 16px; background: white;"
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
        <label style="display: block; font-weight: 500; color: #475569; margin-bottom: 4px; font-size: 14px;">
          Voltagem da Bomba
        </label>
        <select
          name="furo_voltagem_bomba"
          style="width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 16px; background: white;"
        >
          <option value="">Selecionar voltagem...</option>
          <option value="230V">230V (Monofásica)</option>
          <option value="400V">400V (Trifásica)</option>
        </select>
      </div>
    </div>

    <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #cbd5e1; text-align: center;">
      <button
        type="button"
        onclick="this.closest('#secção-furo-agua').remove(); alert('Secção removida!');"
        style="padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer;"
      >
        🗑️ Remover Secção Furo
      </button>
    </div>
  `;

  // Inserir após o container do tipo de trabalho
  container.parentNode.insertBefore(seccaoFuro, container.nextSibling);

  console.log("✅ Secção furo adicionada com sucesso!");
  return true;
}

// Tentar adicionar várias vezes
function tentarAdicionar() {
  console.log("🔄 Tentativa de adicionar secção furo...");

  if (
    window.location.pathname.includes("/create-work") &&
    document.body.textContent.includes("Informações Básicas")
  ) {
    if (adicionarSeccaoFuro()) {
      console.log("✅ Secção adicionada - parando tentativas");
      return;
    }
  }

  // Tentar novamente em 2 segundos
  setTimeout(tentarAdicionar, 2000);
}

// Remover qualquer botão de teste que possa existir
function removerBotoesTeste() {
  const botoes = [
    document.getElementById("botao-teste-furo"),
    document.querySelector('[onclick*="forcarFuroAgua"]'),
    document.querySelector('button[style*="💧"]'),
  ];

  botoes.forEach((botao) => {
    if (botao) {
      botao.remove();
      console.log("🗑️ Botão de teste removido");
    }
  });
}

// Remover botões de teste periodicamente
setInterval(removerBotoesTeste, 2000);

// Começar as tentativas
setTimeout(tentarAdicionar, 1000);

console.log("🔧 Script furo directo carregado");
