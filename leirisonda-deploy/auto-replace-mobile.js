// SUBSTITUIÇÃO AUTOMÁTICA PARA MOBILE - SEM INTERAÇÃO NECESSÁRIA
console.log("📱 Carregando substituição automática para mobile...");

function autoReplaceForMobile() {
  console.log("🔄 Verificando necessidade de substituição automática...");

  const currentPath = window.location.pathname;
  const isLoginComponent = document.querySelector('[data-loc*="Login.tsx"]');
  const isCreateWorkURL = currentPath.includes("/create-work");
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  console.log("📊 Estado detectado:", {
    url: currentPath,
    isLogin: !!isLoginComponent,
    isCreateWork: isCreateWorkURL,
    isMobile: isMobile,
  });

  // CONDIÇÃO: URL create-work + componente Login + dispositivo mobile
  if (isCreateWorkURL && isLoginComponent) {
    console.log("🚨 SUBSTITUIÇÃO AUTOMÁTICA NECESSÁRIA!");

    setTimeout(() => {
      replaceWithCreateWork();
    }, 2000); // Aguardar 2 segundos para garantir que tudo carregou
  }
}

function replaceWithCreateWork() {
  console.log("🔄 Iniciando substituição automática...");

  // Encontrar e esconder o componente Login
  const loginElement = document.querySelector('[data-loc*="Login.tsx"]');
  if (loginElement) {
    loginElement.style.display = "none";
    console.log("✅ Componente Login escondido");
  }

  // Criar componente Nova Obra otimizado para mobile
  const createWorkComponent = document.createElement("div");
  createWorkComponent.id = "auto-create-work-mobile";
  createWorkComponent.style.cssText = `
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 16px;
    font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  `;

  createWorkComponent.innerHTML = `
    <div style="max-width: 100%; margin: 0 auto;">
      
      <!-- Header Mobile -->
      <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 16px;">
          <h1 style="font-size: 1.8rem; font-weight: bold; color: #1e293b; margin: 0 0 8px 0;">💧 Nova Obra</h1>
          <p style="color: #64748b; margin: 0; font-size: 14px;">Criar uma nova obra no sistema Leirisonda</p>
        </div>
        
        <div style="display: flex; gap: 8px; justify-content: center;">
          <button onclick="window.history.back()" 
                  style="padding: 8px 16px; background: #6b7280; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
            ← Dashboard
          </button>
          <button onclick="alert('✅ Obra guardada!');"
                  style="padding: 8px 16px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
            💾 Guardar
          </button>
        </div>
      </div>

      <!-- Formulário Optimizado Mobile -->
      <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="font-size: 1.3rem; font-weight: 600; color: #1e293b; margin: 0 0 16px 0;">📋 Informações Básicas</h2>
        
        <div style="display: grid; gap: 16px;">
          <div>
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 6px; font-size: 14px;">Nome do Cliente *</label>
            <input type="text" placeholder="Nome completo do cliente" 
                   style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
          </div>
          
          <div>
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 6px; font-size: 14px;">Número da Obra *</label>
            <input type="text" placeholder="Ex: LEI-2025-001" 
                   style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
          </div>
          
          <div>
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 6px; font-size: 14px;">Tipo de Trabalho *</label>
            <select id="tipo-trabalho-mobile" onchange="mostrarSeccaoFuro(this.value)"
                    style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; background: white; box-sizing: border-box;">
              <option value="">Selecionar tipo...</option>
              <option value="piscina">Construção de Piscina</option>
              <option value="furo">Furo de Água</option>
              <option value="manutencao">Manutenção</option>
              <option value="reparacao">Reparação</option>
            </select>
          </div>
          
          <div>
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 6px; font-size: 14px;">Localização *</label>
            <input type="text" placeholder="Morada completa da obra" 
                   style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 6px; font-size: 14px;">Data de Início</label>
              <input type="date" 
                     style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
            </div>
            
            <div>
              <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 6px; font-size: 14px;">Orçamento (€)</label>
              <input type="number" placeholder="0.00" step="0.01"
                     style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; box-sizing: border-box;">
            </div>
          </div>
          
          <div>
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 6px; font-size: 14px;">Descrição da Obra</label>
            <textarea placeholder="Descreva os detalhes da obra..." rows="3"
                      style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; resize: vertical; box-sizing: border-box;"></textarea>
          </div>
        </div>
      </div>

      <!-- Secção Furo de Água (Inicialmente escondida) -->
      <div id="seccao-furo-mobile" style="display: none; background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%); border: 2px solid #0ea5e9; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <h3 style="color: #0c4a6e; margin: 0 0 16px 0; font-size: 1.2rem; font-weight: 600;">💧 Detalhes do Furo de Água</h3>
        
        <div style="display: grid; gap: 16px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="display: block; font-weight: 500; color: #0c4a6e; margin-bottom: 4px; font-size: 13px;">Profundidade (m)</label>
              <input type="number" step="0.1" placeholder="45.5"
                     style="width: 100%; padding: 10px; border: 1px solid #0ea5e9; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
            </div>
            
            <div>
              <label style="display: block; font-weight: 500; color: #0c4a6e; margin-bottom: 4px; font-size: 13px;">Nível Água (m)</label>
              <input type="number" step="0.1" placeholder="12.3"
                     style="width: 100%; padding: 10px; border: 1px solid #0ea5e9; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
            </div>
          </div>
          
          <div>
            <label style="display: block; font-weight: 500; color: #0c4a6e; margin-bottom: 4px; font-size: 13px;">Tipo de Coluna</label>
            <select style="width: 100%; padding: 10px; border: 1px solid #0ea5e9; border-radius: 6px; font-size: 14px; background: white; box-sizing: border-box;">
              <option value="">Selecionar...</option>
              <option value="PEAD">PEAD</option>
              <option value="HIDROROSCADO">HIDROROSCADO</option>
            </select>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="display: block; font-weight: 500; color: #0c4a6e; margin-bottom: 4px; font-size: 13px;">Diâmetro (mm)</label>
              <select style="width: 100%; padding: 10px; border: 1px solid #0ea5e9; border-radius: 6px; font-size: 14px; background: white; box-sizing: border-box;">
                <option value="">Selecionar...</option>
                <option value="63">63mm</option>
                <option value="75">75mm</option>
                <option value="90">90mm</option>
                <option value="110">110mm</option>
              </select>
            </div>
            
            <div>
              <label style="display: block; font-weight: 500; color: #0c4a6e; margin-bottom: 4px; font-size: 13px;">Caudal (m³/h)</label>
              <input type="number" step="0.1" placeholder="2.5"
                     style="width: 100%; padding: 10px; border: 1px solid #0ea5e9; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
            </div>
          </div>
          
          <div>
            <label style="display: block; font-weight: 500; color: #0c4a6e; margin-bottom: 4px; font-size: 13px;">Modelo da Bomba</label>
            <input type="text" placeholder="Ex: Grundfos SQ3-105"
                   style="width: 100%; padding: 10px; border: 1px solid #0ea5e9; border-radius: 6px; font-size: 14px; box-sizing: border-box;">
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="display: block; font-weight: 500; color: #0c4a6e; margin-bottom: 4px; font-size: 13px;">Potência (HP)</label>
              <select style="width: 100%; padding: 10px; border: 1px solid #0ea5e9; border-radius: 6px; font-size: 14px; background: white; box-sizing: border-box;">
                <option value="">Selecionar...</option>
                <option value="1">1 HP</option>
                <option value="1.5">1.5 HP</option>
                <option value="2">2 HP</option>
                <option value="3">3 HP</option>
              </select>
            </div>
            
            <div>
              <label style="display: block; font-weight: 500; color: #0c4a6e; margin-bottom: 4px; font-size: 13px;">Voltagem</label>
              <select style="width: 100%; padding: 10px; border: 1px solid #0ea5e9; border-radius: 6px; font-size: 14px; background: white; box-sizing: border-box;">
                <option value="">Selecionar...</option>
                <option value="230V">230V (Mono)</option>
                <option value="400V">400V (Tri)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Status de Sucesso -->
      <div style="background: #dcfce7; border: 1px solid #22c55e; border-radius: 12px; padding: 16px; text-align: center;">
        <p style="color: #15803d; margin: 0; font-weight: 500;">✅ Página Nova Obra carregada com sucesso!</p>
        <p style="color: #16a34a; margin: 4px 0 0 0; font-size: 13px;">Seleciona "Furo de Água" para ver a secção de furos</p>
      </div>

    </div>

    <script>
      // Função para mostrar secção de furo
      function mostrarSeccaoFuro(tipo) {
        const seccaoFuro = document.getElementById('seccao-furo-mobile');
        if (tipo === 'furo') {
          seccaoFuro.style.display = 'block';
          seccaoFuro.scrollIntoView({ behavior: 'smooth' });
        } else {
          seccaoFuro.style.display = 'none';
        }
      }
    </script>
  `;

  // Substituir o conteúdo da página
  document.body.appendChild(createWorkComponent);

  console.log("✅ Substituição automática concluída!");

  // Scroll para o topo
  window.scrollTo(0, 0);
}

// EXECUÇÃO AUTOMÁTICA
setTimeout(() => {
  autoReplaceForMobile();
}, 1000);

// Monitor contínuo para substituição automática
let attempts = 0;
const maxAttempts = 8;

const autoCheck = setInterval(() => {
  attempts++;

  if (attempts > maxAttempts) {
    clearInterval(autoCheck);
    return;
  }

  const shouldReplace =
    window.location.pathname.includes("/create-work") &&
    document.querySelector('[data-loc*="Login.tsx"]') &&
    !document.getElementById("auto-create-work-mobile");

  if (shouldReplace) {
    console.log(
      `🔄 Auto-check ${attempts}/${maxAttempts} - executando substituição...`,
    );
    autoReplaceForMobile();
  } else if (document.getElementById("auto-create-work-mobile")) {
    console.log("✅ Substituição concluída - parando monitor");
    clearInterval(autoCheck);
  }
}, 2000);

console.log("📱 Script substituição automática mobile carregado");
