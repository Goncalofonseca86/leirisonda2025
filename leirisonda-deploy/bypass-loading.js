// BYPASS LOADING - Contorna o ProtectedRoute e vai direto ao dashboard

console.log("🚀 BYPASS: Contornando página de carregamento...");

function bypassProtectedRoute() {
  // Verificar se estamos na página de loading
  const loadingText = document.querySelector('p[data-loc*="ProtectedRoute"]');

  if (loadingText && loadingText.textContent?.includes("A carregar")) {
    console.log("🚀 BYPASS: Detectada página de carregamento, contornando...");

    // Forçar navegação direta para dashboard
    setTimeout(() => {
      console.log("🚀 BYPASS: Navegando para /dashboard");
      window.location.href = "/dashboard";
    }, 2000);

    // Backup: tentar /obras se dashboard não funcionar
    setTimeout(() => {
      if (
        window.location.pathname === "/dashboard" &&
        document.querySelector('p[data-loc*="ProtectedRoute"]')
      ) {
        console.log("🚀 BYPASS: Tentando /obras");
        window.location.href = "/obras";
      }
    }, 5000);

    // Backup: tentar root se obras não funcionar
    setTimeout(() => {
      if (document.querySelector('p[data-loc*="ProtectedRoute"]')) {
        console.log("🚀 BYPASS: Tentando /");
        window.location.href = "/";
      }
    }, 8000);
  }
}

// Executar imediatamente
bypassProtectedRoute();

// Executar após 1 segundo
setTimeout(bypassProtectedRoute, 1000);

// Executar após 3 segundos
setTimeout(bypassProtectedRoute, 3000);

// Monitor para detectar se ficamos presos novamente
const monitor = setInterval(() => {
  const loading = document.querySelector('p[data-loc*="ProtectedRoute"]');
  if (loading && loading.textContent?.includes("A carregar")) {
    console.log("🚀 BYPASS: Ainda preso no loading, tentando escapar...");

    // Tentar múltiplas rotas
    const routes = ["/obras", "/dashboard", "/", "/home"];
    const randomRoute = routes[Math.floor(Math.random() * routes.length)];

    console.log(`🚀 BYPASS: Tentando ${randomRoute}`);
    window.location.href = randomRoute;
  }
}, 10000);

// Parar monitor após 2 minutos
setTimeout(() => {
  clearInterval(monitor);
  console.log("🚀 BYPASS: Monitor finalizado");
}, 120000);

console.log("🚀 BYPASS: Sistema de bypass iniciado");
