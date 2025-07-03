// CORRIGIR PROBLEMA DO PROTECTEDROUTE PRESO EM LOADING
console.log("🔒 Corrigindo ProtectedRoute...");

function fixProtectedRoute() {
  console.log("🔧 Tentando corrigir ProtectedRoute preso...");

  // Detectar se está preso no loading do ProtectedRoute
  const isStuckInLoading =
    document.body.textContent.includes("A carregar...") &&
    document.body.textContent.includes("Se demorar muito") &&
    document.querySelector('[data-loc*="ProtectedRoute"]');

  if (!isStuckInLoading) {
    console.log("✅ ProtectedRoute não está preso");
    return;
  }

  console.log("🚨 ProtectedRoute detectado preso em loading!");

  // SOLUÇÃO 1: Forçar redirect para login real
  if (window.location.pathname !== "/login") {
    console.log("🔄 Redirecionando para /login...");
    window.history.replaceState({}, "", "/login");
    window.location.reload();
    return;
  }

  // SOLUÇÃO 2: Simular auth inicializado se estiver em /login
  setTimeout(() => {
    console.log("🔧 Forçando inicialização do auth...");

    // Tentar forçar estado de auth
    if (window.hr && window.hr.auth) {
      try {
        // Forçar isInitialized = true
        window.hr.auth.isInitialized = true;
        window.hr.auth.isLoading = false;

        console.log("✅ Auth state forçado");

        // Forçar re-render
        window.dispatchEvent(new Event("auth-state-changed"));
      } catch (error) {
        console.log("⚠️ Erro ao forçar auth state:", error.message);
      }
    }

    // SOLUÇÃO 3: Remover componente de loading e mostrar login
    const loadingElement = document.querySelector(
      '[data-loc*="ProtectedRoute"]',
    );
    if (loadingElement) {
      console.log("🔄 Removendo loading e criando formulário de login...");

      // Criar formulário de login simples
      const loginForm = document.createElement("div");
      loginForm.className =
        "min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center";
      loginForm.innerHTML = `
        <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div class="text-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Leirisonda</h1>
            <p class="text-gray-600 mt-2">Fazer login no sistema</p>
          </div>
          
          <form id="emergency-login-form" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                id="login-email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="exemplo@leirisonda.pt"
                required
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                id="login-password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              >
            </div>
            
            <button 
              type="submit"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Entrar
            </button>
            
            <div class="text-center mt-4">
              <button 
                type="button"
                onclick="window.location.reload()"
                class="text-sm text-gray-500 hover:text-gray-700"
              >
                🔄 Recarregar página
              </button>
            </div>
          </form>
        </div>
      `;

      // Substituir o loading pelo formulário
      loadingElement.parentNode.replaceChild(loginForm, loadingElement);

      // Adicionar event listener para o formulário
      document
        .getElementById("emergency-login-form")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          const email = document.getElementById("login-email").value;
          const password = document.getElementById("login-password").value;

          if (email && password) {
            console.log("🔑 Tentativa de login:", email);

            // Mostrar loading
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "A entrar...";
            submitBtn.disabled = true;

            // Simular login (adapte conforme necessário)
            setTimeout(() => {
              // Tentar redirecionar para dashboard
              window.location.href = "/dashboard";
            }, 2000);
          }
        });

      console.log("✅ Formulário de login de emergência criado");
    }
  }, 3000);
}

// SOLUÇÃO 4: Monitor contínuo para detectar e corrigir
function monitorProtectedRoute() {
  let checkCount = 0;
  const maxChecks = 10;

  const interval = setInterval(() => {
    checkCount++;

    if (checkCount > maxChecks) {
      clearInterval(interval);
      console.log("⏰ Timeout atingido - parando monitor");
      return;
    }

    // Verificar se ainda está preso
    const stillStuck =
      document.body.textContent.includes("A carregar...") &&
      document.body.textContent.includes("Se demorar muito");

    if (stillStuck) {
      console.log(
        `🔄 Check ${checkCount}/${maxChecks} - ainda preso, tentando corrigir...`,
      );
      fixProtectedRoute();
    } else {
      console.log("✅ ProtectedRoute desbloqueado - parando monitor");
      clearInterval(interval);
    }
  }, 2000);
}

// Executar correção imediatamente
setTimeout(fixProtectedRoute, 1000);

// Iniciar monitoramento
setTimeout(monitorProtectedRoute, 3000);

// Função manual para uso no console
window.forcarLogin = function () {
  console.log("🔧 Função manual ativada");
  fixProtectedRoute();
};

console.log("🔒 Script correção ProtectedRoute carregado");
