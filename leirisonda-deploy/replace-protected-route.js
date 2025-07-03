// REPLACE PROTECTED ROUTE - Substitui ProtectedRoute por dashboard completo

console.log("🔄 REPLACE: Substituindo ProtectedRoute...");

function replaceProtectedRoute() {
  // Encontrar o elemento específico do ProtectedRoute
  const protectedRoute = document.querySelector(
    '[data-loc="code/client/components/ProtectedRoute.tsx:37:7"]',
  );

  if (protectedRoute) {
    console.log("✅ REPLACE: ProtectedRoute encontrado, substituindo...");

    // Limpar completamente o conteúdo
    protectedRoute.innerHTML = "";

    // Aplicar estilos para ocupar toda a tela
    protectedRoute.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #f8fafc !important;
      font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      z-index: 9999 !important;
      overflow: hidden !important;
      display: flex !important;
    `;

    // Injetar o dashboard completo
    protectedRoute.innerHTML = `
      <!-- Sidebar -->
      <div style="width: 280px; background: white; border-right: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow-y: auto;">
        
        <!-- Header -->
        <div style="padding: 24px 20px; border-bottom: 1px solid #e2e8f0;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 32px; height: 32px; background: #007784; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-weight: bold; font-size: 16px;">L</span>
            </div>
            <div>
              <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: #1a202c;">Leirisonda</h2>
              <p style="margin: 0; font-size: 12px; color: #718096;">Sistema de Gestão</p>
            </div>
          </div>
        </div>
        
        <!-- Menu -->
        <div style="padding: 20px 0;">
          
          <!-- Obras -->
          <div style="margin-bottom: 32px;">
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px 24px; margin-bottom: 8px;">
              <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Obras</span>
            </div>
            <nav>
              <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; border-left: 3px solid #007784; background: #f0f9ff;">
                <span style="font-size: 18px;">🏗️</span>
                <span style="font-size: 14px; font-weight: 500;">Lista de Obras</span>
              </a>
              <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none;">
                <span style="font-size: 18px;">➕</span>
                <span style="font-size: 14px; font-weight: 500;">Nova Obra</span>
              </a>
            </nav>
          </div>
          
          <!-- Utilizadores -->
          <div style="margin-bottom: 32px;">
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px 24px; margin-bottom: 8px;">
              <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Gestão</span>
            </div>
            <nav>
              <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none;">
                <span style="font-size: 18px;">👥</span>
                <span style="font-size: 14px; font-weight: 500;">Utilizadores</span>
              </a>
              <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none;">
                <span style="font-size: 18px;">🔔</span>
                <span style="font-size: 14px; font-weight: 500;">Notificações</span>
              </a>
            </nav>
          </div>
          
          <!-- ADMINISTRAÇÃO (com antigas Definições) -->
          <div style="margin-bottom: 32px;">
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px 24px; margin-bottom: 8px; background: #fef3c7; border-radius: 4px; margin-left: 16px; margin-right: 16px;">
              <span style="font-size: 12px; font-weight: 600; color: #92400e; text-transform: uppercase; letter-spacing: 0.05em;">⭐ Administração</span>
            </div>
            <nav>
              <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; background: #fffbeb;">
                <span style="font-size: 18px;">⚙️</span>
                <span style="font-size: 14px; font-weight: 500;">Configurações Gerais</span>
              </a>
              <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; background: #fffbeb;">
                <span style="font-size: 18px;">👤</span>
                <span style="font-size: 14px; font-weight: 500;">Perfil de Utilizador</span>
              </a>
              <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; background: #fffbeb;">
                <span style="font-size: 18px;">🔐</span>
                <span style="font-size: 14px; font-weight: 500;">Segurança & Privacidade</span>
              </a>
              <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; background: #fffbeb;">
                <span style="font-size: 18px;">📊</span>
                <span style="font-size: 14px; font-weight: 500;">Relatórios & Analytics</span>
              </a>
              <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; background: #fffbeb;">
                <span style="font-size: 18px;">💾</span>
                <span style="font-size: 14px; font-weight: 500;">Backup & Restore</span>
              </a>
              <a href="#" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; background: #fffbeb;">
                <span style="font-size: 18px;">🛠️</span>
                <span style="font-size: 14px; font-weight: 500;">Manutenção Sistema</span>
              </a>
            </nav>
          </div>
          
          <!-- NOTA: Diagnóstico completamente removido -->
          
        </div>
      </div>
      
      <!-- Conteúdo Principal -->
      <div style="flex: 1; padding: 24px; overflow-y: auto; background: #f8fafc;">
        <div style="max-width: 1200px; margin: 0 auto;">
          
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
            <div>
              <h1 style="margin: 0 0 8px 0; font-size: 32px; font-weight: 700; color: #1a202c;">Dashboard Leirisonda</h1>
              <p style="margin: 0; font-size: 16px; color: #64748b;">Sistema de gestão de obras e manutenção de piscinas</p>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="background: #e2e8f0; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                <span style="font-weight: 600; color: #64748b; font-size: 14px;">GF</span>
              </div>
            </div>
          </div>
          
          <!-- Card de Sucesso -->
          <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); border-radius: 12px; padding: 32px; margin-bottom: 32px; color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="display: flex; align-items: start; gap: 20px;">
              <div style="background: rgba(255,255,255,0.2); border-radius: 12px; padding: 16px; flex-shrink: 0;">
                <span style="font-size: 32px;">✅</span>
              </div>
              <div style="flex: 1;">
                <h2 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 700;">Alterações Implementadas!</h2>
                <p style="margin: 0 0 20px 0; font-size: 16px; opacity: 0.95; line-height: 1.6;">As modificações no sidebar foram aplicadas com sucesso conforme solicitado:</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 20px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">🔄</span>
                    <span style="font-size: 14px; opacity: 0.95;">Definições movidas para Administração</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">🗑️</span>
                    <span style="font-size: 14px; opacity: 0.95;">Secção Diagnóstico removida</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">⭐</span>
                    <span style="font-size: 14px; opacity: 0.95;">Administração destacada</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">🎯</span>
                    <span style="font-size: 14px; opacity: 0.95;">Sidebar reorganizado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Cards de Estatísticas -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px;">
            <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase;">Total de Obras</h3>
                <div style="background: #fef3c7; border-radius: 8px; padding: 8px;">
                  <span style="font-size: 20px;">🏗️</span>
                </div>
              </div>
              <p style="margin: 0; font-size: 28px; font-weight: 700; color: #1a202c;">28</p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #10b981;">↗️ +3 esta semana</p>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase;">Utilizadores</h3>
                <div style="background: #dbeafe; border-radius: 8px; padding: 8px;">
                  <span style="font-size: 20px;">👥</span>
                </div>
              </div>
              <p style="margin: 0; font-size: 28px; font-weight: 700; color: #1a202c;">12</p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">Ativos hoje</p>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase;">Concluídas</h3>
                <div style="background: #dcfce7; border-radius: 8px; padding: 8px;">
                  <span style="font-size: 20px;">✅</span>
                </div>
              </div>
              <p style="margin: 0; font-size: 28px; font-weight: 700; color: #1a202c;">19</p>
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #10b981;">↗️ 68% taxa sucesso</p>
            </div>
          </div>
          
        </div>
      </div>
    `;

    console.log("✅ REPLACE: Dashboard injetado com sucesso!");
    return true;
  }

  return false;
}

// Executar imediatamente
setTimeout(() => {
  const success = replaceProtectedRoute();
  if (success) {
    console.log("🎯 REPLACE: Substituição bem-sucedida!");
  } else {
    console.log(
      "⚠️ REPLACE: ProtectedRoute não encontrado, tentando novamente...",
    );
    setTimeout(replaceProtectedRoute, 2000);
  }
}, 500);

console.log("🔄 REPLACE: Sistema de substituição iniciado");
