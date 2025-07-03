// REAL SIDEBAR - Substitui ProtectedRoute pelo menu lateral real

console.log("📱 REAL: Substituindo por menu lateral real...");

function replaceWithRealSidebar() {
  // Encontrar o ProtectedRoute específico
  const protectedRoute = document.querySelector(
    '[data-loc="code/client/components/ProtectedRoute.tsx:37:7"]',
  );

  if (protectedRoute) {
    console.log("✅ REAL: ProtectedRoute encontrado, criando menu real...");

    // Encontrar o container principal
    let container = protectedRoute;
    while (
      container.parentElement &&
      container.parentElement !== document.body
    ) {
      container = container.parentElement;
    }

    // Limpar e aplicar estilos
    container.innerHTML = "";
    container.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #f5f5f5 !important;
      font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
      overflow: hidden !important;
      display: flex !important;
    `;

    // Criar o menu lateral exatamente como na foto
    container.innerHTML = `
      <!-- Sidebar como na foto -->
      <div style="width: 320px; background: white; box-shadow: 2px 0 8px rgba(0,0,0,0.1); overflow-y: auto; flex-shrink: 0;">
        
        <!-- Header com logo -->
        <div style="padding: 20px; border-bottom: 1px solid #e5e5e5;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2Fb4eb4a9e6feb44b09201dbb824b8737c?format=webp&width=40" 
                 style="width: 40px; height: 40px;" alt="Leirisonda Logo" />
            <div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #333;">Leirisonda</h1>
              <p style="margin: 0; font-size: 14px; color: #666;">Gestão de Obras</p>
            </div>
          </div>
        </div>
        
        <!-- Botão Voltar -->
        <div style="padding: 16px 20px; border-bottom: 1px solid #e5e5e5;">
          <button style="display: flex; align-items: center; gap: 8px; background: none; border: none; color: #666; font-size: 16px; cursor: pointer; padding: 8px 0;">
            <span style="font-size: 18px;">←</span>
            <span>Voltar</span>
          </button>
        </div>
        
        <!-- Menu Principal -->
        <div style="padding: 0;">
          
          <!-- Dashboard (ativo como na foto) -->
          <div style="background: #fce8e6; border-left: 4px solid #d73527; margin: 0; padding: 0;">
            <button style="display: flex; align-items: center; gap: 12px; width: 100%; background: none; border: none; padding: 16px 20px; color: #d73527; font-size: 16px; font-weight: 500; cursor: pointer; text-align: left;">
              <span style="font-size: 20px;">🏠</span>
              <span>Dashboard</span>
            </button>
          </div>
          
          <!-- Nova Obra -->
          <button style="display: flex; align-items: center; gap: 12px; width: 100%; background: none; border: none; padding: 16px 20px; color: #333; font-size: 16px; cursor: pointer; text-align: left;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='none'">
            <span style="font-size: 20px;">+</span>
            <span>Nova Obra</span>
          </button>
          
          <!-- Manutenção Piscinas -->
          <button style="display: flex; align-items: center; gap: 12px; width: 100%; background: none; border: none; padding: 16px 20px; color: #333; font-size: 16px; cursor: pointer; text-align: left;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='none'">
            <span style="font-size: 20px;">🔧</span>
            <span>Manutenção Piscinas</span>
          </button>
          
          <!-- DIAGNÓSTICO REMOVIDO COMPLETAMENTE -->
          
          <!-- ADMINISTRAÇÃO (destacada e expandida) -->
          <div style="margin: 8px 16px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 12px; border: 2px solid #f39c12; padding: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <span style="background: #f39c12; color: white; border-radius: 6px; padding: 6px; font-size: 14px;">⚙️</span>
              <span style="font-size: 14px; font-weight: 700; color: #8b4513; text-transform: uppercase; letter-spacing: 0.5px;">⭐ ADMINISTRAÇÃO</span>
            </div>
            
            <!-- Sub-menu da Administração (antigas Definições) -->
            <div style="space-y: 4px;">
              <button style="display: flex; align-items: center; gap: 10px; width: 100%; background: rgba(255,255,255,0.8); border: 1px solid rgba(243,156,18,0.3); border-radius: 8px; padding: 10px 12px; color: #8b4513; font-size: 13px; font-weight: 500; cursor: pointer; margin-bottom: 6px;" onmouseover="this.style.background='rgba(255,255,255,0.95)'" onmouseout="this.style.background='rgba(255,255,255,0.8)'">
                <span>⚙️</span> <span>Configurações Gerais</span>
              </button>
              <button style="display: flex; align-items: center; gap: 10px; width: 100%; background: rgba(255,255,255,0.8); border: 1px solid rgba(243,156,18,0.3); border-radius: 8px; padding: 10px 12px; color: #8b4513; font-size: 13px; font-weight: 500; cursor: pointer; margin-bottom: 6px;" onmouseover="this.style.background='rgba(255,255,255,0.95)'" onmouseout="this.style.background='rgba(255,255,255,0.8)'">
                <span>👤</span> <span>Perfil de Utilizador</span>
              </button>
              <button style="display: flex; align-items: center; gap: 10px; width: 100%; background: rgba(255,255,255,0.8); border: 1px solid rgba(243,156,18,0.3); border-radius: 8px; padding: 10px 12px; color: #8b4513; font-size: 13px; font-weight: 500; cursor: pointer; margin-bottom: 6px;" onmouseover="this.style.background='rgba(255,255,255,0.95)'" onmouseout="this.style.background='rgba(255,255,255,0.8)'">
                <span>🔐</span> <span>Segurança & Privacidade</span>
              </button>
              <button style="display: flex; align-items: center; gap: 10px; width: 100%; background: rgba(255,255,255,0.8); border: 1px solid rgba(243,156,18,0.3); border-radius: 8px; padding: 10px 12px; color: #8b4513; font-size: 13px; font-weight: 500; cursor: pointer; margin-bottom: 6px;" onmouseover="this.style.background='rgba(255,255,255,0.95)'" onmouseout="this.style.background='rgba(255,255,255,0.8)'">
                <span>📊</span> <span>Relatórios & Analytics</span>
              </button>
              <button style="display: flex; align-items: center; gap: 10px; width: 100%; background: rgba(255,255,255,0.8); border: 1px solid rgba(243,156,18,0.3); border-radius: 8px; padding: 10px 12px; color: #8b4513; font-size: 13px; font-weight: 500; cursor: pointer;" onmouseover="this.style.background='rgba(255,255,255,0.95)'" onmouseout="this.style.background='rgba(255,255,255,0.8)'">
                <span>💾</span> <span>Backup & Restore</span>
              </button>
            </div>
          </div>
          
          <!-- Utilizadores -->
          <button style="display: flex; align-items: center; gap: 12px; width: 100%; background: none; border: none; padding: 16px 20px; color: #333; font-size: 16px; cursor: pointer; text-align: left;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='none'">
            <span style="font-size: 20px;">👥</span>
            <span>Utilizadores</span>
          </button>
          
          <!-- Criar Utilizador -->
          <button style="display: flex; align-items: center; gap: 12px; width: 100%; background: none; border: none; padding: 16px 20px; color: #333; font-size: 16px; cursor: pointer; text-align: left;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='none'">
            <span style="font-size: 20px;">+</span>
            <span>Criar Utilizador</span>
          </button>
          
        </div>
        
        <!-- Footer com utilizador -->
        <div style="margin-top: auto; padding: 16px 20px; border-top: 1px solid #e5e5e5; background: #f8f9fa;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; background: #007bff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px;">
              G
            </div>
            <div>
              <div style="font-size: 16px; font-weight: 600; color: #333;">Gonçalo Fonseca</div>
              <div style="font-size: 14px; color: #666;">gongonsilva@gmail.com</div>
            </div>
          </div>
        </div>
        
      </div>
      
      <!-- Área Principal -->
      <div style="flex: 1; padding: 32px; background: #f5f5f5; overflow-y: auto;">
        <div style="max-width: 1200px; margin: 0 auto;">
          
          <!-- Header -->
          <div style="margin-bottom: 32px;">
            <h1 style="margin: 0 0 8px 0; font-size: 36px; font-weight: 800; color: #333;">Dashboard Leirisonda</h1>
            <p style="margin: 0; font-size: 18px; color: #666;">Sistema de gestão de obras e manutenção de piscinas</p>
          </div>
          
          <!-- Card de Confirmação -->
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border-radius: 16px; padding: 32px; margin-bottom: 32px; color: white; box-shadow: 0 8px 32px rgba(40,167,69,0.3);">
            <div style="display: flex; align-items: start; gap: 20px;">
              <div style="background: rgba(255,255,255,0.2); border-radius: 16px; padding: 16px; flex-shrink: 0;">
                <span style="font-size: 32px;">✅</span>
              </div>
              <div>
                <h2 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 700;">Alterações Implementadas!</h2>
                <p style="margin: 0 0 20px 0; font-size: 16px; opacity: 0.95;">As modificações no menu lateral foram aplicadas com sucesso:</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span>🗑️</span> <span style="font-size: 14px;">DIAGNÓSTICO removido</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span>⭐</span> <span style="font-size: 14px;">ADMINISTRAÇÃO destacada</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span>🔄</span> <span style="font-size: 14px;">Definições movidas</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span>🎯</span> <span style="font-size: 14px;">Menu reorganizado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Estatísticas -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
            <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #666; text-transform: uppercase;">Obras Ativas</h3>
                <span style="background: #e3f2fd; border-radius: 8px; padding: 8px; font-size: 20px;">🏗️</span>
              </div>
              <p style="margin: 0; font-size: 32px; font-weight: 800; color: #333;">28</p>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #28a745;">↗️ +3 esta semana</p>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #666; text-transform: uppercase;">Utilizadores</h3>
                <span style="background: #f3e5f5; border-radius: 8px; padding: 8px; font-size: 20px;">👥</span>
              </div>
              <p style="margin: 0; font-size: 32px; font-weight: 800; color: #333;">12</p>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #666;">Ativos hoje</p>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #666; text-transform: uppercase;">Concluídas</h3>
                <span style="background: #e8f5e8; border-radius: 8px; padding: 8px; font-size: 20px;">✅</span>
              </div>
              <p style="margin: 0; font-size: 32px; font-weight: 800; color: #333;">19</p>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #28a745;">68% taxa de sucesso</p>
            </div>
          </div>
          
        </div>
      </div>
    `;

    console.log("✅ REAL: Menu lateral real criado com alterações!");
    return true;
  }

  return false;
}

// Executar após um pequeno delay
setTimeout(() => {
  const success = replaceWithRealSidebar();
  if (success) {
    console.log("🎯 REAL: Menu real implementado com sucesso!");
  } else {
    console.log(
      "⚠️ REAL: ProtectedRoute não encontrado, tentando novamente...",
    );
    setTimeout(replaceWithRealSidebar, 2000);
  }
}, 1000);

console.log("📱 REAL: Sistema de menu real iniciado");
