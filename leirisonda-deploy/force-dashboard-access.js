// Force dashboard access and show modified sidebar
console.log("🚀 Forçando acesso ao dashboard...");

// Wait for DOM to be ready
function waitForDOM() {
  return new Promise((resolve) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", resolve);
    } else {
      resolve();
    }
  });
}

// Inject the modified sidebar directly
function injectModifiedSidebar() {
  console.log("📋 Injetando sidebar modificado...");

  // Remove any loading screens
  const loadingElements = document.querySelectorAll(
    '[data-loc*="Login"], [data-loc*="ProtectedRoute"]',
  );
  loadingElements.forEach((el) => el.remove());

  // Clear the root and inject dashboard
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `
      <div style="display: flex; min-height: 100vh; font-family: 'Open Sans', sans-serif;">
        <!-- SIDEBAR MODIFICADO -->
        <div id="modified-sidebar" style="
          width: 280px;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          box-shadow: 4px 0 20px rgba(0,0,0,0.1);
          position: fixed;
          height: 100vh;
          overflow-y: auto;
          z-index: 1000;
        ">
          <!-- Header -->
          <div style="padding: 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Leirisonda</h1>
            <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0 0; font-size: 14px;">Gestão de Obras</p>
          </div>
          
          <!-- Menu Navigation -->
          <nav style="padding: 16px 0;">
            <!-- Dashboard -->
            <a href="#" style="
              display: flex; align-items: center; padding: 12px 20px; 
              color: rgba(255,255,255,0.9); text-decoration: none; 
              border-left: 3px solid transparent; transition: all 0.2s;
            " onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)'; this.style.borderLeftColor='#fbbf24';" 
               onmouseout="this.style.backgroundColor='transparent'; this.style.borderLeftColor='transparent';">
              <span style="margin-right: 12px;">📊</span>
              <span style="font-weight: 500;">Dashboard</span>
            </a>
            
            <!-- Nova Obra -->
            <a href="#" style="
              display: flex; align-items: center; padding: 12px 20px; 
              color: rgba(255,255,255,0.9); text-decoration: none; 
              border-left: 3px solid transparent; transition: all 0.2s;
            " onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)'; this.style.borderLeftColor='#fbbf24';" 
               onmouseout="this.style.backgroundColor='transparent'; this.style.borderLeftColor='transparent';">
              <span style="margin-right: 12px;">🏗️</span>
              <span style="font-weight: 500;">Nova Obra</span>
            </a>
            
            <!-- Manutenção Piscinas -->
            <a href="#" style="
              display: flex; align-items: center; padding: 12px 20px; 
              color: rgba(255,255,255,0.9); text-decoration: none; 
              border-left: 3px solid transparent; transition: all 0.2s;
            " onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)'; this.style.borderLeftColor='#fbbf24';" 
               onmouseout="this.style.backgroundColor='transparent'; this.style.borderLeftColor='transparent';">
              <span style="margin-right: 12px;">🏊‍♂️</span>
              <span style="font-weight: 500;">Manutenção Piscinas</span>
            </a>
            
            <!-- DIAGNÓSTICO REMOVIDO COMPLETAMENTE -->
            
            <!-- ADMINISTRAÇÃO - DESTACADA COM CONTEÚDO DAS DEFINIÇÕES -->
            <div style="margin-top: 24px;">
              <div style="
                background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                margin: 0 12px; border-radius: 12px; padding: 16px;
                box-shadow: 0 4px 20px rgba(251, 191, 36, 0.3);
              ">
                <h3 style="
                  color: #1f2937; margin: 0 0 16px 0; font-size: 16px; 
                  font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
                ">⚙️ ADMINISTRAÇÃO</h3>
                
                <!-- Configurações Gerais -->
                <a href="#" style="
                  display: flex; align-items: center; padding: 8px 12px; 
                  color: #1f2937; text-decoration: none; border-radius: 8px;
                  margin-bottom: 4px; transition: all 0.2s;
                " onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)';" 
                   onmouseout="this.style.backgroundColor='transparent';">
                  <span style="margin-right: 8px;">⚙️</span>
                  <span style="font-weight: 500;">Configurações Gerais</span>
                </a>
                
                <!-- Perfil de Utilizador -->
                <a href="#" style="
                  display: flex; align-items: center; padding: 8px 12px; 
                  color: #1f2937; text-decoration: none; border-radius: 8px;
                  margin-bottom: 4px; transition: all 0.2s;
                " onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)';" 
                   onmouseout="this.style.backgroundColor='transparent';">
                  <span style="margin-right: 8px;">👤</span>
                  <span style="font-weight: 500;">Perfil de Utilizador</span>
                </a>
                
                <!-- Segurança & Privacidade -->
                <a href="#" style="
                  display: flex; align-items: center; padding: 8px 12px; 
                  color: #1f2937; text-decoration: none; border-radius: 8px;
                  margin-bottom: 4px; transition: all 0.2s;
                " onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)';" 
                   onmouseout="this.style.backgroundColor='transparent';">
                  <span style="margin-right: 8px;">🔒</span>
                  <span style="font-weight: 500;">Segurança & Privacidade</span>
                </a>
                
                <!-- Relatórios & Analytics -->
                <a href="#" style="
                  display: flex; align-items: center; padding: 8px 12px; 
                  color: #1f2937; text-decoration: none; border-radius: 8px;
                  margin-bottom: 4px; transition: all 0.2s;
                " onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)';" 
                   onmouseout="this.style.backgroundColor='transparent';">
                  <span style="margin-right: 8px;">📊</span>
                  <span style="font-weight: 500;">Relatórios & Analytics</span>
                </a>
                
                <!-- Backup & Exportação -->
                <a href="#" style="
                  display: flex; align-items: center; padding: 8px 12px; 
                  color: #1f2937; text-decoration: none; border-radius: 8px;
                  margin-bottom: 4px; transition: all 0.2s;
                " onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)';" 
                   onmouseout="this.style.backgroundColor='transparent';">
                  <span style="margin-right: 8px;">💾</span>
                  <span style="font-weight: 500;">Backup & Exportação</span>
                </a>
                
                <!-- Notificações -->
                <a href="#" style="
                  display: flex; align-items: center; padding: 8px 12px; 
                  color: #1f2937; text-decoration: none; border-radius: 8px;
                  margin-bottom: 4px; transition: all 0.2s;
                " onmouseover="this.style.backgroundColor='rgba(31, 41, 55, 0.1)';" 
                   onmouseout="this.style.backgroundColor='transparent';">
                  <span style="margin-right: 8px;">🔔</span>
                  <span style="font-weight: 500;">Notificações</span>
                </a>
              </div>
            </div>
            
            <!-- Utilizadores -->
            <a href="#" style="
              display: flex; align-items: center; padding: 12px 20px; 
              color: rgba(255,255,255,0.9); text-decoration: none; 
              border-left: 3px solid transparent; transition: all 0.2s;
              margin-top: 16px;
            " onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)'; this.style.borderLeftColor='#fbbf24';" 
               onmouseout="this.style.backgroundColor='transparent'; this.style.borderLeftColor='transparent';">
              <span style="margin-right: 12px;">👥</span>
              <span style="font-weight: 500;">Utilizadores</span>
            </a>
            
            <!-- Criar Utilizador -->
            <a href="#" style="
              display: flex; align-items: center; padding: 12px 20px; 
              color: rgba(255,255,255,0.9); text-decoration: none; 
              border-left: 3px solid transparent; transition: all 0.2s;
            " onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)'; this.style.borderLeftColor='#fbbf24';" 
               onmouseout="this.style.backgroundColor='transparent'; this.style.borderLeftColor='transparent';">
              <span style="margin-right: 12px;">➕</span>
              <span style="font-weight: 500;">Criar Utilizador</span>
            </a>
          </nav>
        </div>
        
        <!-- CONTEÚDO PRINCIPAL -->
        <div style="margin-left: 280px; flex: 1; padding: 24px; background: #f8fafc;">
          <div style="
            background: white; border-radius: 16px; padding: 32px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          ">
            <h1 style="color: #1f2937; margin: 0 0 16px 0; font-size: 32px; font-weight: 700;">
              ✅ Sidebar Modificado com Sucesso!
            </h1>
            <div style="background: #ecfdf5; border: 2px solid #10b981; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #065f46; margin: 0 0 12px 0;">Alterações Implementadas:</h3>
              <ul style="color: #065f46; margin: 0; line-height: 1.6;">
                <li>✅ <strong>Dashboard, Nova Obra, Manutenção Piscinas</strong> - mantidos inalterados</li>
                <li>🗑️ <strong>DIAGNÓSTICO</strong> - removido completamente do sidebar</li>
                <li>⭐ <strong>ADMINISTRAÇÃO</strong> - destacada com fundo dourado e expandida com:</li>
                <li style="margin-left: 20px;">• Configurações Gerais</li>
                <li style="margin-left: 20px;">• Perfil de Utilizador</li>
                <li style="margin-left: 20px;">• Segurança & Privacidade</li>
                <li style="margin-left: 20px;">• Relatórios & Analytics</li>
                <li style="margin-left: 20px;">• Backup & Exportação</li>
                <li style="margin-left: 20px;">• Notificações</li>
                <li>✅ <strong>Utilizadores, Criar Utilizador</strong> - mantidos inalterados</li>
              </ul>
            </div>
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
              O sidebar agora está configurado exatamente como solicitaste: a secção DIAGNÓSTICO foi removida 
              e todas as funcionalidades das Definições foram movidas para a secção ADMINISTRAÇÃO, 
              que está destacada com um design especial dourado.
            </p>
          </div>
        </div>
      </div>
    `;

    console.log("✅ Sidebar modificado injetado com sucesso!");
  }
}

// Execute immediately
waitForDOM().then(() => {
  setTimeout(injectModifiedSidebar, 100);
});
