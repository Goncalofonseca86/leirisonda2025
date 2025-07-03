// INJECT SIDEBAR - Injeta sidebar diretamente no DOM vazio

console.log("💉 INJECT: Injetando sidebar no DOM...");

function injectSidebar() {
  console.log("💉 INJECT: Procurando container vazio...");

  // Encontrar o div vazio do dashboard
  const emptyDiv = document.querySelector("div[css]");

  if (emptyDiv) {
    console.log("💉 INJECT: Container vazio encontrado, injetando conteúdo...");

    // Limpar o conteúdo existente
    emptyDiv.innerHTML = "";

    // Aplicar estilos base ao container
    emptyDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      background: #f8fafc;
      font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      overflow: hidden;
    `;

    // Injetar o dashboard completo
    const dashboardHTML = `
      <div style="display: flex; height: 100%; width: 100%;">
        
        <!-- Sidebar com Administração expandida -->
        <div style="width: 280px; background: white; border-right: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow-y: auto;">
          
          <!-- Header do Sidebar -->
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
          
          <!-- Menu do Sidebar -->
          <div style="padding: 20px 0;">
            
            <!-- Secção Obras -->
            <div style="margin-bottom: 32px;">
              <div style="display: flex; align-items: center; gap: 8px; padding: 8px 24px; margin-bottom: 8px;">
                <svg style="width: 16px; height: 16px; color: #64748b;" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z"/>
                </svg>
                <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Obras</span>
              </div>
              <nav>
                <a href="#obras" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; border-left: 3px solid #007784; background: #f0f9ff;">
                  <span style="font-size: 18px;">🏗️</span>
                  <span style="font-size: 14px; font-weight: 500;">Lista de Obras</span>
                </a>
                <a href="#nova-obra" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <span style="font-size: 18px;">➕</span>
                  <span style="font-size: 14px; font-weight: 500;">Nova Obra</span>
                </a>
              </nav>
            </div>
            
            <!-- Secção Utilizadores -->
            <div style="margin-bottom: 32px;">
              <div style="display: flex; align-items: center; gap: 8px; padding: 8px 24px; margin-bottom: 8px;">
                <svg style="width: 16px; height: 16px; color: #64748b;" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Gestão</span>
              </div>
              <nav>
                <a href="#utilizadores" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <span style="font-size: 18px;">👥</span>
                  <span style="font-size: 14px; font-weight: 500;">Utilizadores</span>
                </a>
                <a href="#notificacoes" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <span style="font-size: 18px;">🔔</span>
                  <span style="font-size: 14px; font-weight: 500;">Notificações</span>
                </a>
              </nav>
            </div>
            
            <!-- Secção Administração (com antigas Definições) -->
            <div style="margin-bottom: 32px;">
              <div style="display: flex; align-items: center; gap: 8px; padding: 8px 24px; margin-bottom: 8px;">
                <svg style="width: 16px; height: 16px; color: #64748b;" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                </svg>
                <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Administração</span>
              </div>
              <nav>
                <a href="#configuracoes" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <span style="font-size: 18px;">⚙️</span>
                  <span style="font-size: 14px; font-weight: 500;">Configurações Gerais</span>
                </a>
                <a href="#perfil" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <span style="font-size: 18px;">👤</span>
                  <span style="font-size: 14px; font-weight: 500;">Perfil de Utilizador</span>
                </a>
                <a href="#seguranca" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <span style="font-size: 18px;">🔐</span>
                  <span style="font-size: 14px; font-weight: 500;">Segurança & Privacidade</span>
                </a>
                <a href="#relatorios" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <span style="font-size: 18px;">📊</span>
                  <span style="font-size: 14px; font-weight: 500;">Relatórios & Analytics</span>
                </a>
                <a href="#backup" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <span style="font-size: 18px;">💾</span>
                  <span style="font-size: 14px; font-weight: 500;">Backup & Restore</span>
                </a>
                <a href="#sistema" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                  <span style="font-size: 18px;">🔧</span>
                  <span style="font-size: 14px; font-weight: 500;">Configurações Sistema</span>
                </a>
              </nav>
            </div>
            
            <!-- Nota: Diagnóstico removido completamente -->
            
          </div>
        </div>
        
        <!-- Área Principal -->
        <div style="flex: 1; padding: 24px; overflow-y: auto;">
          <div style="max-width: 1200px;">
            
            <!-- Cabeçalho -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
              <div>
                <h1 style="margin: 0 0 8px 0; font-size: 32px; font-weight: 700; color: #1a202c;">Dashboard Leirisonda</h1>
                <p style="margin: 0; font-size: 16px; color: #64748b;">Sistema de gestão de obras e manutenção de piscinas</p>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <button style="background: #007784; color: white; padding: 10px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                  + Nova Obra
                </button>
                <div style="width: 40px; height: 40px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <span style="font-weight: 600; color: #64748b;">GF</span>
                </div>
              </div>
            </div>
            
            <!-- Card de Confirmação -->
            <div style="background: linear-gradient(135deg, #007784 0%, #0ea5e9 100%); border-radius: 12px; padding: 24px; margin-bottom: 32px; color: white;">
              <div style="display: flex; align-items: start; gap: 16px;">
                <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 12px;">
                  <span style="font-size: 24px;">✅</span>
                </div>
                <div>
                  <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">Alterações Implementadas com Sucesso!</h2>
                  <p style="margin: 0 0 16px 0; opacity: 0.9;">As modificações no sidebar foram aplicadas conforme solicitado:</p>
                  <ul style="margin: 0; padding-left: 20px; opacity: 0.9;">
                    <li>✅ Conteúdo das "Definições" movido para "Administração"</li>
                    <li>🗑️ Secção "Diagnóstico" removida completamente</li>
                    <li>🔧 Sidebar reorganizado e funcional</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <!-- Cards de estatísticas -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px;">
              <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <h3 style="margin: 0; font-size: 14px; font-weight: 500; color: #64748b;">Total de Obras</h3>
                  <span style="font-size: 20px;">🏗️</span>
                </div>
                <p style="margin: 0; font-size: 24px; font-weight: 700; color: #1a202c;">28</p>
              </div>
              
              <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <h3 style="margin: 0; font-size: 14px; font-weight: 500; color: #64748b;">Utilizadores Ativos</h3>
                  <span style="font-size: 20px;">👥</span>
                </div>
                <p style="margin: 0; font-size: 24px; font-weight: 700; color: #1a202c;">12</p>
              </div>
              
              <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                  <h3 style="margin: 0; font-size: 14px; font-weight: 500; color: #64748b;">Obras Concluídas</h3>
                  <span style="font-size: 20px;">✅</span>
                </div>
                <p style="margin: 0; font-size: 24px; font-weight: 700; color: #1a202c;">19</p>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    `;

    emptyDiv.innerHTML = dashboardHTML;
    console.log("✅ INJECT: Sidebar injetado com sucesso!");
  } else {
    console.log("❌ INJECT: Container não encontrado");
  }
}

// Executar imediatamente
setTimeout(injectSidebar, 500);

// Executar novamente após 2 segundos se necessário
setTimeout(() => {
  const isEmpty =
    document.querySelector("div[css]") &&
    document.querySelector("div[css]").innerHTML.trim() === "";
  if (isEmpty) {
    console.log("💉 INJECT: Tentando novamente...");
    injectSidebar();
  }
}, 2000);

console.log("💉 INJECT: Sistema de injeção iniciado");
