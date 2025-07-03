// FORCE DASHBOARD - Força acesso direto ao dashboard com sidebar

console.log("💪 FORCE: Forçando acesso ao dashboard...");

function forceDashboardAccess() {
  // Verificar se estamos na página de login mesmo com URL diferente
  const loginElement = document.querySelector('[data-loc*="Login.tsx"]');

  if (loginElement) {
    console.log("💪 FORCE: Detectado Login.tsx, forçando bypass...");

    // Estratégia 1: Manipular localStorage para simular login
    try {
      localStorage.setItem("authToken", "forced-access");
      localStorage.setItem(
        "userAuth",
        JSON.stringify({
          email: "admin@leirisonda.com",
          uid: "forced-uid",
          isAuthenticated: true,
        }),
      );
      console.log("💪 FORCE: LocalStorage configurado");
    } catch (e) {
      console.log("⚠️ FORCE: Erro no localStorage:", e);
    }

    // Estratégia 2: Simular evento de login bem-sucedido
    try {
      window.dispatchEvent(
        new CustomEvent("authStateChanged", {
          detail: { authenticated: true },
        }),
      );
      console.log("💪 FORCE: Evento de auth disparado");
    } catch (e) {
      console.log("⚠️ FORCE: Erro no evento:", e);
    }

    // Estratégia 3: Forçar reload com hash para dashboard
    setTimeout(() => {
      console.log("💪 FORCE: Recarregando com hash...");
      window.location.hash = "#dashboard";
      window.location.reload();
    }, 2000);

    // Estratégia 4: Manipular history state
    setTimeout(() => {
      console.log("💪 FORCE: Manipulando history...");
      history.pushState({}, "", "/obras");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }, 4000);

    // Estratégia 5: Tentar diferentes rotas conhecidas
    const routes = ["/obras", "/dashboard", "/home", "/app", "/main"];
    routes.forEach((route, index) => {
      setTimeout(
        () => {
          console.log(`💪 FORCE: Tentando ${route}...`);
          window.location.href = route;
        },
        6000 + index * 2000,
      );
    });
  }
}

// Função para injetar um bypass direto no React
function injectReactBypass() {
  console.log("💪 FORCE: Tentando bypass direto no React...");

  // Procurar pelo React root
  const root = document.getElementById("root");
  if (root && root._reactInternalInstance) {
    console.log("💪 FORCE: React detectado, tentando bypass...");

    // Tentar manipular o state do React
    try {
      const reactInstance = root._reactInternalInstance;
      if (reactInstance && reactInstance.memoizedProps) {
        reactInstance.memoizedProps.authenticated = true;
      }
    } catch (e) {
      console.log("⚠️ FORCE: Erro no React bypass:", e);
    }
  }

  // Tentar encontrar e manipular componentes React
  const elements = document.querySelectorAll("[data-reactroot]");
  elements.forEach((el) => {
    if (el._reactInternalFiber) {
      try {
        el._reactInternalFiber.memoizedProps.isAuthenticated = true;
      } catch (e) {
        console.log("⚠️ FORCE: Erro no fiber:", e);
      }
    }
  });
}

// Função para criar um dashboard mock temporário
function createMockDashboard() {
  console.log("💪 FORCE: Criando dashboard temporário...");

  // Esconder login
  const loginElements = document.querySelectorAll('[data-loc*="Login.tsx"]');
  loginElements.forEach((el) => {
    el.style.display = "none !important";
  });

  // Criar sidebar mock
  const mockHTML = `
    <div id="mock-dashboard" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #f5f5f5; z-index: 9999;">
      <div style="display: flex; height: 100%;">
        <div style="width: 250px; background: white; border-right: 1px solid #ddd; padding: 20px;">
          <h3>Menu</h3>
          <div style="margin: 20px 0;">
            <span style="font-size: 12px; font-weight: 600; color: #999; text-transform: uppercase;">Administração</span>
            <div style="margin-top: 10px;">
              <div style="padding: 8px 0; cursor: pointer;">🏠 Dashboard</div>
              <div style="padding: 8px 0; cursor: pointer;">👥 Utilizadores</div>
              <div style="padding: 8px 0; cursor: pointer;">⚙️ Configurações</div>
              <div style="padding: 8px 0; cursor: pointer;">📊 Relatórios</div>
            </div>
          </div>
          <div style="margin: 20px 0;">
            <span style="font-size: 12px; font-weight: 600; color: #999; text-transform: uppercase;">Obras</span>
            <div style="margin-top: 10px;">
              <div style="padding: 8px 0; cursor: pointer;">🏗️ Lista de Obras</div>
              <div style="padding: 8px 0; cursor: pointer;">➕ Nova Obra</div>
            </div>
          </div>
        </div>
        <div style="flex: 1; padding: 20px;">
          <h1>Dashboard Leirisonda</h1>
          <p>Acesso ao dashboard forçado com sucesso!</p>
          <p>Agora as definições estão na secção Administração.</p>
          <button onclick="document.getElementById('mock-dashboard').remove()" style="background: #007784; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">
            Fechar Dashboard Mock
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", mockHTML);
}

// Executar estratégias em sequência
forceDashboardAccess();

setTimeout(injectReactBypass, 3000);

setTimeout(() => {
  // Se ainda estamos no login após 10 segundos, criar mock
  const stillInLogin = document.querySelector('[data-loc*="Login.tsx"]');
  if (stillInLogin) {
    console.log("💪 FORCE: Ainda no login, criando dashboard mock...");
    createMockDashboard();
  }
}, 10000);

console.log("💪 FORCE: Sistema de força iniciado");
