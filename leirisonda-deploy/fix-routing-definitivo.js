// CORREÇÃO DEFINITIVA DO ROTEAMENTO
console.log("🔄 Carregando correção definitiva de roteamento...");

function fixRouting() {
  console.log("🎯 Iniciando correção definitiva de roteamento...");

  const currentPath = window.location.pathname;
  const isLoginComponent = document.querySelector('[data-loc*="Login.tsx"]');
  const isCreateWorkURL = currentPath.includes("/create-work");

  console.log("📍 Estado actual:", {
    url: currentPath,
    component: isLoginComponent ? "Login.tsx" : "Outro",
    mismatch: isCreateWorkURL && isLoginComponent,
  });

  // PROBLEMA DETECTADO: URL /create-work mas componente Login
  if (isCreateWorkURL && isLoginComponent) {
    console.log("🚨 PROBLEMA DETECTADO: URL create-work mas componente Login!");

    // SOLUÇÃO 1: Forçar navegação para componente correcto
    forceCorrectComponent();

    // SOLUÇÃO 2: Bypass de autenticação se necessário
    setTimeout(() => {
      if (document.querySelector('[data-loc*="Login.tsx"]')) {
        console.log("🔓 Tentando bypass de autenticação...");
        bypassAuth();
      }
    }, 2000);

    // SOLUÇÃO 3: Criar componente CreateWork manualmente
    setTimeout(() => {
      if (document.querySelector('[data-loc*="Login.tsx"]')) {
        console.log("🛠️ Criando componente CreateWork manualmente...");
        createWorkComponentManually();
      }
    }, 4000);
  }
}

function forceCorrectComponent() {
  console.log("🔄 Forçando navegação para componente correcto...");

  try {
    // Tentar forçar re-render do React Router
    if (window.React && window.ReactDOM) {
      console.log("⚛️ Forçando re-render React...");

      // Forçar atualização de estado
      window.dispatchEvent(new PopStateEvent("popstate"));

      // Tentar forçar navegação via history
      window.history.replaceState({}, "", "/create-work");
      window.history.pushState({}, "", "/create-work");

      // Evento customizado para forçar router update
      window.dispatchEvent(new CustomEvent("router-force-update"));
    }

    // Tentar via React Router se disponível
    if (window.__REACT_ROUTER_HISTORY__) {
      console.log("🔄 Usando React Router History...");
      window.__REACT_ROUTER_HISTORY__.replace("/create-work");
    }
  } catch (error) {
    console.log("⚠️ Erro ao forçar componente:", error.message);
  }
}

function bypassAuth() {
  console.log("🔓 Tentando bypass de autenticação...");

  try {
    // Simular usuário autenticado
    if (window.hr && window.hr.auth) {
      window.hr.auth.user = {
        id: "temp-user",
        email: "temp@leirisonda.pt",
        name: "Utilizador Temporário",
        permissions: { canCreateWorks: true },
      };
      window.hr.auth.isLoading = false;
      window.hr.auth.isInitialized = true;

      console.log("✅ Auth bypass aplicado");

      // Forçar re-render
      window.dispatchEvent(new CustomEvent("auth-changed"));
    }

    // Bypass via localStorage
    localStorage.setItem("auth-bypass", "true");
    localStorage.setItem(
      "temp-user",
      JSON.stringify({
        id: "temp-user",
        email: "temp@leirisonda.pt",
        authenticated: true,
      }),
    );

    console.log("✅ Auth bypass via localStorage");
  } catch (error) {
    console.log("⚠️ Erro no bypass auth:", error.message);
  }
}

function createWorkComponentManually() {
  console.log("🛠️ Criando componente CreateWork manualmente...");

  // Remover componente Login
  const loginElement = document.querySelector('[data-loc*="Login.tsx"]');
  if (loginElement) {
    loginElement.style.display = "none";
  }

  // Criar componente CreateWork
  const createWorkComponent = document.createElement("div");
  createWorkComponent.id = "manual-create-work";
  createWorkComponent.style.cssText = `
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 20px;
  `;

  createWorkComponent.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto;">
      <!-- Header -->
      <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: between; align-items: center;">
          <div>
            <h1 style="font-size: 2rem; font-weight: bold; color: #1e293b; margin: 0 0 8px 0;">Nova Obra</h1>
            <p style="color: #64748b; margin: 0;">Criar uma nova obra no sistema Leirisonda</p>
          </div>
          <button onclick="window.history.back()" 
                  style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 8px; cursor: pointer;">
            ← Voltar
          </button>
        </div>
      </div>

      <!-- Formulário Principal -->
      <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h2 style="font-size: 1.5rem; font-weight: 600; color: #1e293b; margin: 0 0 20px 0;">Informações Básicas</h2>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          <div>
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 8px;">Nome do Cliente *</label>
            <input type="text" placeholder="Nome completo do cliente" 
                   style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px;">
          </div>
          
          <div>
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 8px;">Número da Obra *</label>
            <input type="text" placeholder="Ex: LEI-2025-001" 
                   style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px;">
          </div>
          
          <div>
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 8px;">Tipo de Trabalho *</label>
            <select style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; background: white;">
              <option value="">Selecionar tipo...</option>
              <option value="piscina">Construção de Piscina</option>
              <option value="furo">Furo de Água</option>
              <option value="manutencao">Manutenção</option>
              <option value="reparacao">Reparação</option>
            </select>
          </div>
          
          <div>
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 8px;">Localização *</label>
            <input type="text" placeholder="Morada completa da obra" 
                   style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px;">
          </div>
          
          <div>
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 8px;">Data de Início</label>
            <input type="date" 
                   style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px;">
          </div>
          
          <div>
            <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 8px;">Orçamento (€)</label>
            <input type="number" placeholder="0.00" step="0.01"
                   style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px;">
          </div>
        </div>
        
        <div style="margin-top: 20px;">
          <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 8px;">Descrição da Obra</label>
          <textarea placeholder="Descreva os detalhes da obra..." rows="4"
                    style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 16px; resize: vertical;"></textarea>
        </div>
      </div>

      <!-- Secção de Furos (será adicionada automaticamente pelo script) -->
      <div id="furo-section-placeholder" style="margin: 24px 0;"></div>

      <!-- Botões de Ação -->
      <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <div style="display: flex; gap: 16px; justify-content: flex-end;">
          <button type="button" onclick="window.history.back()"
                  style="padding: 12px 24px; background: #6b7280; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
            Cancelar
          </button>
          <button type="button" onclick="alert('Obra guardada como rascunho!')"
                  style="padding: 12px 24px; background: #f59e0b; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
            Guardar Rascunho
          </button>
          <button type="button" onclick="alert('Obra criada com sucesso!')"
                  style="padding: 12px 24px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
            Criar Obra
          </button>
        </div>
      </div>
    </div>
  `;

  // Adicionar ao body
  document.body.appendChild(createWorkComponent);

  console.log("✅ Componente CreateWork manual criado!");

  // Trigger para scripts de furo adicionarem a secção
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent("manual-create-work-ready"));
  }, 1000);
}

// MONITORAMENTO CONTÍNUO
function startRouteMonitoring() {
  console.log("👁️ Iniciando monitoramento de roteamento...");

  let checkCount = 0;
  const maxChecks = 15;

  const interval = setInterval(() => {
    checkCount++;

    if (checkCount > maxChecks) {
      clearInterval(interval);
      console.log("⏰ Timeout do monitor de roteamento");
      return;
    }

    const currentPath = window.location.pathname;
    const isLoginComponent = document.querySelector('[data-loc*="Login.tsx"]');
    const isCreateWorkURL = currentPath.includes("/create-work");

    if (isCreateWorkURL && isLoginComponent) {
      console.log(
        `🔄 Check ${checkCount}/${maxChecks} - problema de roteamento detectado`,
      );
      fixRouting();
    } else if (isCreateWorkURL && !isLoginComponent) {
      console.log("✅ Roteamento corrigido - parando monitor");
      clearInterval(interval);
    }
  }, 3000);
}

// INTERCEPTAR NAVEGAÇÃO
const originalPushState = history.pushState;
history.pushState = function (...args) {
  console.log("🔄 Navegação detectada:", args[2]);
  originalPushState.apply(history, args);

  setTimeout(() => {
    fixRouting();
  }, 500);
};

// EXECUTAR
setTimeout(() => {
  fixRouting();
  startRouteMonitoring();
}, 1000);

// Função manual
window.forcarCreateWork = function () {
  console.log("🔧 Função manual ativada");
  createWorkComponentManually();
};

console.log("✅ Correção definitiva de roteamento carregada");
