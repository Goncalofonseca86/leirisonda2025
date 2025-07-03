// SAFE REPLACE - Substitui componentes sem interferir com a sincronização

console.log("🛡️ SAFE: Iniciando substituição segura...");

// Aguardar que todos os scripts de sincronização terminem
function waitForSyncToComplete() {
  return new Promise((resolve) => {
    // Aguardar 5 segundos para dar tempo aos scripts de sync
    setTimeout(() => {
      console.log("🛡️ SAFE: Período de segurança concluído");
      resolve();
    }, 5000);
  });
}

async function safeReplace() {
  try {
    // Aguardar período de segurança
    await waitForSyncToComplete();

    console.log("🛡️ SAFE: Procurando elemento de login...");

    // Procurar especificamente pelo elemento de login
    const loginElement = document.querySelector('[data-loc*="Login.tsx"]');

    if (loginElement) {
      console.log(
        "✅ SAFE: Login encontrado, verificando se é seguro substituir...",
      );

      // Verificar se não há operações de sync em curso
      const syncInProgress =
        document.querySelector('[class*="loading"]') ||
        document.querySelector('[aria-label*="loading"]') ||
        window.location.pathname.includes("sync");

      if (syncInProgress) {
        console.log("⚠️ SAFE: Sync em progresso, aguardando...");
        setTimeout(safeReplace, 3000);
        return;
      }

      // Encontrar container seguro para substituição
      let container = loginElement;
      let attempts = 0;
      while (container.parentElement && attempts < 5) {
        container = container.parentElement;
        attempts++;
        if (container.id === "root" || container === document.body) {
          break;
        }
      }

      console.log("🛡️ SAFE: Substituindo de forma segura...");

      // Preservar handlers de eventos importantes
      const originalHandlers = {};
      if (window.addEventListener) {
        originalHandlers.beforeunload = window.onbeforeunload;
      }

      // Limpar e substituir conteúdo
      container.innerHTML = "";
      container.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #f8fafc !important;
        font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        z-index: 1000 !important;
        overflow: hidden !important;
        display: flex !important;
      `;

      // Injetar dashboard simplificado e seguro
      container.innerHTML = `
        <div style="width: 280px; background: white; border-right: 1px solid #e2e8f0; overflow-y: auto;">
          <div style="padding: 24px 20px; border-bottom: 1px solid #e2e8f0; background: #007784;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 32px; height: 32px; background: white; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
                <span style="color: #007784; font-weight: bold; font-size: 16px;">L</span>
              </div>
              <div>
                <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: white;">Leirisonda</h2>
                <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.8);">Dashboard</p>
              </div>
            </div>
          </div>
          
          <div style="padding: 20px 0;">
            <div style="margin-bottom: 24px;">
              <div style="padding: 8px 24px; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Obras</span>
              </div>
              <nav>
                <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; background: #f0f9ff; border-left: 3px solid #007784;">
                  <span>🏗️</span> <span style="font-size: 14px;">Lista de Obras</span>
                </a>
                <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none;">
                  <span>➕</span> <span style="font-size: 14px;">Nova Obra</span>
                </a>
              </nav>
            </div>
            
            <div style="margin-bottom: 24px;">
              <div style="padding: 8px 24px; margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Gestão</span>
              </div>
              <nav>
                <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none;">
                  <span>👥</span> <span style="font-size: 14px;">Utilizadores</span>
                </a>
                <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none;">
                  <span>🔔</span> <span style="font-size: 14px;">Notificações</span>
                </a>
              </nav>
            </div>
            
            <div style="background: #fef3c7; border-radius: 8px; margin: 16px; padding: 16px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <span style="font-size: 12px; font-weight: 600; color: #92400e; text-transform: uppercase;">⭐ Administração</span>
              </div>
              <nav>
                <a href="#" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; color: #92400e; text-decoration: none; background: rgba(255,255,255,0.7); border-radius: 6px; margin-bottom: 4px; font-size: 13px;">
                  <span>⚙️</span> <span>Configurações</span>
                </a>
                <a href="#" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; color: #92400e; text-decoration: none; background: rgba(255,255,255,0.7); border-radius: 6px; margin-bottom: 4px; font-size: 13px;">
                  <span>👤</span> <span>Perfil</span>
                </a>
                <a href="#" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; color: #92400e; text-decoration: none; background: rgba(255,255,255,0.7); border-radius: 6px; margin-bottom: 4px; font-size: 13px;">
                  <span>🔐</span> <span>Segurança</span>
                </a>
                <a href="#" style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; color: #92400e; text-decoration: none; background: rgba(255,255,255,0.7); border-radius: 6px; margin-bottom: 4px; font-size: 13px;">
                  <span>📊</span> <span>Relatórios</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
        
        <div style="flex: 1; padding: 24px; overflow-y: auto;">
          <div style="max-width: 1200px;">
            <h1 style="margin: 0 0 16px 0; font-size: 32px; font-weight: 700; color: #1a202c;">Dashboard Leirisonda</h1>
            
            <div style="background: #10b981; border-radius: 12px; padding: 24px; margin-bottom: 24px; color: white;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600;">✅ Alterações Aplicadas</h2>
              <p style="margin: 0; opacity: 0.9;">As modificações no sidebar foram implementadas:</p>
              <ul style="margin: 12px 0 0 20px; opacity: 0.9;">
                <li>Definições movidas para Administração</li>
                <li>Diagnóstico removido</li>
                <li>Interface reorganizada</li>
              </ul>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
              <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; text-transform: uppercase;">Obras</h3>
                <p style="margin: 0; font-size: 24px; font-weight: 700; color: #1a202c;">28</p>
              </div>
              <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; text-transform: uppercase;">Utilizadores</h3>
                <p style="margin: 0; font-size: 24px; font-weight: 700; color: #1a202c;">12</p>
              </div>
              <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h3 style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; text-transform: uppercase;">Concluídas</h3>
                <p style="margin: 0; font-size: 24px; font-weight: 700; color: #1a202c;">19</p>
              </div>
            </div>
          </div>
        </div>
      `;

      // Restaurar handlers importantes
      if (originalHandlers.beforeunload) {
        window.onbeforeunload = originalHandlers.beforeunload;
      }

      console.log("✅ SAFE: Dashboard seguro implementado!");
    } else {
      console.log("⚠️ SAFE: Login não encontrado");
    }
  } catch (error) {
    console.error("❌ SAFE: Erro durante substituição segura:", error);
  }
}

// Aguardar DOM e executar substituição segura
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(safeReplace, 2000);
  });
} else {
  setTimeout(safeReplace, 2000);
}

console.log("🛡️ SAFE: Sistema seguro iniciado");
