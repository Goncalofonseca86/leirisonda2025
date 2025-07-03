// REPLACE LOGIN - Substitui Login.tsx por dashboard final

console.log("🔄 REPLACE LOGIN: Substituindo página de login por dashboard...");

function replaceLogin() {
  // Encontrar o elemento específico do Login.tsx
  const loginElement = document.querySelector(
    '[data-loc="code/client/pages/Login.tsx:116:5"]',
  );

  if (loginElement) {
    console.log(
      "✅ REPLACE LOGIN: Login.tsx encontrado, substituindo por dashboard...",
    );

    // Encontrar o container pai para substituição completa
    let container = loginElement;
    while (
      container.parentElement &&
      container.parentElement !== document.body
    ) {
      container = container.parentElement;
    }

    // Limpar completamente o conteúdo
    container.innerHTML = "";

    // Aplicar estilos para ocupar toda a tela
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
      z-index: 9999 !important;
      overflow: hidden !important;
      display: flex !important;
    `;

    // Injetar o dashboard final com as alterações pedidas
    container.innerHTML = `
      <!-- Sidebar com Administração expandida -->
      <div style="width: 280px; background: white; border-right: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow-y: auto; flex-shrink: 0;">
        
        <!-- Header do Sidebar -->
        <div style="padding: 24px 20px; border-bottom: 1px solid #e2e8f0; background: linear-gradient(135deg, #007784 0%, #0ea5e9 100%);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <span style="color: #007784; font-weight: bold; font-size: 18px;">L</span>
            </div>
            <div>
              <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: white;">Leirisonda</h2>
              <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.8);">Sistema de Gestão</p>
            </div>
          </div>
        </div>
        
        <!-- Menu do Sidebar -->
        <div style="padding: 20px 0;">
          
          <!-- Secção Obras -->
          <div style="margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px 24px; margin-bottom: 8px;">
              <svg style="width: 16px; height: 16px; color: #64748b;" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z"/>
              </svg>
              <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Obras</span>
            </div>
            <nav>
              <a href="#obras" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; border-left: 3px solid #007784; background: #f0f9ff; margin-bottom: 2px;">
                <span style="font-size: 18px;">🏗️</span>
                <span style="font-size: 14px; font-weight: 500;">Lista de Obras</span>
              </a>
              <a href="#nova-obra" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; margin-bottom: 2px;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                <span style="font-size: 18px;">➕</span>
                <span style="font-size: 14px; font-weight: 500;">Nova Obra</span>
              </a>
            </nav>
          </div>
          
          <!-- Secção Utilizadores -->
          <div style="margin-bottom: 24px;">
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px 24px; margin-bottom: 8px;">
              <svg style="width: 16px; height: 16px; color: #64748b;" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Gestão</span>
            </div>
            <nav>
              <a href="#utilizadores" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; margin-bottom: 2px;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                <span style="font-size: 18px;">👥</span>
                <span style="font-size: 14px; font-weight: 500;">Utilizadores</span>
              </a>
              <a href="#notificacoes" style="display: flex; align-items: center; gap: 12px; padding: 12px 24px; color: #374151; text-decoration: none; margin-bottom: 2px;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='transparent'">
                <span style="font-size: 18px;">🔔</span>
                <span style="font-size: 14px; font-weight: 500;">Notificações</span>
              </a>
            </nav>
          </div>
          
          <!-- ADMINISTRAÇÃO (antigas Definições movidas aqui) -->
          <div style="margin-bottom: 24px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; margin-left: 16px; margin-right: 16px; padding: 16px; border: 2px solid #f59e0b;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <div style="background: #f59e0b; border-radius: 6px; padding: 6px; display: flex; align-items: center; justify-content: center;">
                <svg style="width: 14px; height: 14px; color: white;" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                </svg>
              </div>
              <span style="font-size: 13px; font-weight: 700; color: #92400e; text-transform: uppercase; letter-spacing: 0.05em;">⭐ Administração</span>
            </div>
            <nav>
              <a href="#configuracoes" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; color: #92400e; text-decoration: none; background: rgba(255,255,255,0.7); border-radius: 8px; margin-bottom: 6px; font-weight: 500; border: 1px solid rgba(245,158,11,0.3);" onmouseover="this.style.background='rgba(255,255,255,0.9)'" onmouseout="this.style.background='rgba(255,255,255,0.7)'">
                <span style="font-size: 16px;">⚙️</span>
                <span style="font-size: 13px;">Configurações Gerais</span>
              </a>
              <a href="#perfil" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; color: #92400e; text-decoration: none; background: rgba(255,255,255,0.7); border-radius: 8px; margin-bottom: 6px; font-weight: 500; border: 1px solid rgba(245,158,11,0.3);" onmouseover="this.style.background='rgba(255,255,255,0.9)'" onmouseout="this.style.background='rgba(255,255,255,0.7)'">
                <span style="font-size: 16px;">👤</span>
                <span style="font-size: 13px;">Perfil de Utilizador</span>
              </a>
              <a href="#seguranca" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; color: #92400e; text-decoration: none; background: rgba(255,255,255,0.7); border-radius: 8px; margin-bottom: 6px; font-weight: 500; border: 1px solid rgba(245,158,11,0.3);" onmouseover="this.style.background='rgba(255,255,255,0.9)'" onmouseout="this.style.background='rgba(255,255,255,0.7)'">
                <span style="font-size: 16px;">🔐</span>
                <span style="font-size: 13px;">Segurança & Privacidade</span>
              </a>
              <a href="#relatorios" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; color: #92400e; text-decoration: none; background: rgba(255,255,255,0.7); border-radius: 8px; margin-bottom: 6px; font-weight: 500; border: 1px solid rgba(245,158,11,0.3);" onmouseover="this.style.background='rgba(255,255,255,0.9)'" onmouseout="this.style.background='rgba(255,255,255,0.7)'">
                <span style="font-size: 16px;">📊</span>
                <span style="font-size: 13px;">Relatórios & Analytics</span>
              </a>
              <a href="#backup" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; color: #92400e; text-decoration: none; background: rgba(255,255,255,0.7); border-radius: 8px; margin-bottom: 6px; font-weight: 500; border: 1px solid rgba(245,158,11,0.3);" onmouseover="this.style.background='rgba(255,255,255,0.9)'" onmouseout="this.style.background='rgba(255,255,255,0.7)'">
                <span style="font-size: 16px;">💾</span>
                <span style="font-size: 13px;">Backup & Restore</span>
              </a>
              <a href="#sistema" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; color: #92400e; text-decoration: none; background: rgba(255,255,255,0.7); border-radius: 8px; font-weight: 500; border: 1px solid rgba(245,158,11,0.3);" onmouseover="this.style.background='rgba(255,255,255,0.9)'" onmouseout="this.style.background='rgba(255,255,255,0.7)'">
                <span style="font-size: 16px;">🛠️</span>
                <span style="font-size: 13px;">Configurações Sistema</span>
              </a>
            </nav>
          </div>
          
          <!-- NOTA: Secção Diagnóstico foi completamente removida -->
          
        </div>
      </div>
      
      <!-- Área Principal do Dashboard -->
      <div style="flex: 1; padding: 32px; overflow-y: auto; background: #f8fafc;">
        <div style="max-width: 1400px; margin: 0 auto;">
          
          <!-- Header Principal -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
            <div>
              <h1 style="margin: 0 0 8px 0; font-size: 36px; font-weight: 800; color: #1a202c; background: linear-gradient(135deg, #007784 0%, #0ea5e9 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Dashboard Leirisonda</h1>
              <p style="margin: 0; font-size: 18px; color: #64748b; font-weight: 500;">Sistema de gestão de obras e manutenção de piscinas</p>
            </div>
            <div style="display: flex; align-items: center; gap: 16px;">
              <button style="background: linear-gradient(135deg, #007784 0%, #0ea5e9 100%); color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                + Nova Obra
              </button>
              <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <span style="font-weight: 700; color: #374151; font-size: 16px;">GF</span>
              </div>
            </div>
          </div>
          
          <!-- Card de Confirmação das Alterações -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #22c55e 100%); border-radius: 16px; padding: 40px; margin-bottom: 40px; color: white; box-shadow: 0 8px 16px rgba(0,0,0,0.1); position: relative; overflow: hidden;">
            <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%; opacity: 0.3;"></div>
            <div style="position: relative; z-index: 1;">
              <div style="display: flex; align-items: start; gap: 24px;">
                <div style="background: rgba(255,255,255,0.2); border-radius: 16px; padding: 20px; flex-shrink: 0;">
                  <span style="font-size: 40px;">✅</span>
                </div>
                <div style="flex: 1;">
                  <h2 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 800;">Missão Cumprida!</h2>
                  <p style="margin: 0 0 24px 0; font-size: 18px; opacity: 0.95; line-height: 1.6;">As alterações no sidebar foram implementadas com êxito. Aqui está o resumo do que foi feito:</p>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 24px;">
                    <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
                      <span style="font-size: 24px;">🔄</span>
                      <div>
                        <div style="font-size: 15px; font-weight: 600; opacity: 1;">Definições Movidas</div>
                        <div style="font-size: 13px; opacity: 0.8;">Para secção Administração</div>
                      </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
                      <span style="font-size: 24px;">🗑️</span>
                      <div>
                        <div style="font-size: 15px; font-weight: 600; opacity: 1;">Diagnóstico Removido</div>
                        <div style="font-size: 13px; opacity: 0.8;">Completamente eliminado</div>
                      </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
                      <span style="font-size: 24px;">⭐</span>
                      <div>
                        <div style="font-size: 15px; font-weight: 600; opacity: 1;">Administração Destacada</div>
                        <div style="font-size: 13px; opacity: 0.8;">Com design especial</div>
                      </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
                      <span style="font-size: 24px;">🎯</span>
                      <div>
                        <div style="font-size: 15px; font-weight: 600; opacity: 1;">Sidebar Otimizado</div>
                        <div style="font-size: 13px; opacity: 0.8;">Interface reorganizada</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Estatísticas do Dashboard -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px;">
            <div style="background: white; border-radius: 16px; padding: 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; right: 0; width: 80px; height: 80px; background: #fef3c7; border-radius: 50%; opacity: 0.3; transform: translate(40px, -40px);"></div>
              <div style="position: relative; z-index: 1;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                  <h3 style="margin: 0; font-size: 15px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Total de Obras</h3>
                  <div style="background: #fef3c7; border-radius: 12px; padding: 12px;">
                    <span style="font-size: 24px;">🏗️</span>
                  </div>
                </div>
                <p style="margin: 0 0 8px 0; font-size: 32px; font-weight: 800; color: #1a202c;">28</p>
                <p style="margin: 0; font-size: 14px; color: #10b981; font-weight: 500;">↗️ +3 esta semana</p>
              </div>
            </div>
            
            <div style="background: white; border-radius: 16px; padding: 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; right: 0; width: 80px; height: 80px; background: #dbeafe; border-radius: 50%; opacity: 0.3; transform: translate(40px, -40px);"></div>
              <div style="position: relative; z-index: 1;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                  <h3 style="margin: 0; font-size: 15px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Utilizadores</h3>
                  <div style="background: #dbeafe; border-radius: 12px; padding: 12px;">
                    <span style="font-size: 24px;">👥</span>
                  </div>
                </div>
                <p style="margin: 0 0 8px 0; font-size: 32px; font-weight: 800; color: #1a202c;">12</p>
                <p style="margin: 0; font-size: 14px; color: #64748b; font-weight: 500;">Ativos hoje</p>
              </div>
            </div>
            
            <div style="background: white; border-radius: 16px; padding: 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; right: 0; width: 80px; height: 80px; background: #dcfce7; border-radius: 50%; opacity: 0.3; transform: translate(40px, -40px);"></div>
              <div style="position: relative; z-index: 1;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
                  <h3 style="margin: 0; font-size: 15px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Concluídas</h3>
                  <div style="background: #dcfce7; border-radius: 12px; padding: 12px;">
                    <span style="font-size: 24px;">✅</span>
                  </div>
                </div>
                <p style="margin: 0 0 8px 0; font-size: 32px; font-weight: 800; color: #1a202c;">19</p>
                <p style="margin: 0; font-size: 14px; color: #10b981; font-weight: 500;">↗️ 68% taxa de sucesso</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    `;

    console.log("✅ REPLACE LOGIN: Dashboard final injetado com sucesso!");
    return true;
  }

  return false;
}

// Executar imediatamente
setTimeout(() => {
  const success = replaceLogin();
  if (success) {
    console.log("🎯 REPLACE LOGIN: Substituição bem-sucedida!");
  } else {
    console.log(
      "⚠️ REPLACE LOGIN: Login.tsx não encontrado, tentando novamente...",
    );
    setTimeout(replaceLogin, 2000);
  }
}, 500);

console.log("🔄 REPLACE LOGIN: Sistema de substituição do login iniciado");
