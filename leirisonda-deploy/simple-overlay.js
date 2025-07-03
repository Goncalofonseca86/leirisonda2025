// SIMPLE OVERLAY - Adiciona overlay simples ao body

console.log("📌 OVERLAY: Iniciando overlay simples...");

function createSimpleOverlay() {
  console.log("📌 OVERLAY: Criando overlay...");

  // Remover overlay anterior se existir
  const existing = document.getElementById("leirisonda-overlay");
  if (existing) {
    existing.remove();
  }

  // Criar overlay
  const overlay = document.createElement("div");
  overlay.id = "leirisonda-overlay";
  overlay.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: #f8fafc !important;
    z-index: 999999 !important;
    overflow-y: auto !important;
    font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
    padding: 0 !important;
    margin: 0 !important;
  `;

  // Conteúdo do overlay
  overlay.innerHTML = `
    <div style="min-height: 100vh; background: #f8fafc; padding: 20px;">
      
      <!-- Header -->
      <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <img src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2Fb4eb4a9e6feb44b09201dbb824b8737c?format=webp&width=40" 
               style="width: 32px; height: 32px;" alt="Leirisonda" />
          <div>
            <h1 style="margin: 0; font-size: 18px; font-weight: 700; color: #333;">Leirisonda</h1>
            <p style="margin: 0; font-size: 12px; color: #666;">Dashboard - Alterações Aplicadas</p>
          </div>
        </div>
        
        <!-- Teste de Funcionamento -->
        <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 12px; text-align: center;">
          <div style="font-size: 20px; margin-bottom: 8px;">✅</div>
          <div style="font-size: 14px; font-weight: 600; color: #155724;">SCRIPT FUNCIONANDO!</div>
          <div style="font-size: 12px; color: #155724;">Este overlay prova que consegui injetar conteúdo</div>
        </div>
      </div>
      
      <!-- Card Principal -->
      <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border-radius: 16px; padding: 24px; margin-bottom: 20px; color: white; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 16px;">🎯</div>
        <h2 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 700;">Alterações do Menu Lateral</h2>
        <p style="margin: 0 0 16px 0; font-size: 14px; opacity: 0.95;">
          Aqui está como ficaria o teu menu após as modificações:
        </p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0;">
          <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 12px;">
            <div style="font-size: 24px; margin-bottom: 4px;">🗑️</div>
            <div style="font-size: 12px; font-weight: 600;">DIAGNÓSTICO</div>
            <div style="font-size: 10px; opacity: 0.8;">Removido</div>
          </div>
          <div style="background: rgba(255,255,255,0.2); border-radius: 8px; padding: 12px;">
            <div style="font-size: 24px; margin-bottom: 4px;">⭐</div>
            <div style="font-size: 12px; font-weight: 600;">ADMINISTRAÇÃO</div>
            <div style="font-size: 10px; opacity: 0.8;">Destacada</div>
          </div>
        </div>
      </div>
      
      <!-- Menu Simulação -->
      <div style="background: white; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background: #007784; color: white; padding: 16px; text-align: center;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 600;">📱 Menu Lateral Modificado</h3>
        </div>
        
        <div style="padding: 0;">
          <!-- Voltar -->
          <div style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0; background: #f8f9fa;">
            <div style="display: flex; align-items: center; gap: 8px; color: #666;">
              <span>←</span> <span>Voltar</span>
            </div>
          </div>
          
          <!-- Dashboard -->
          <div style="background: #fce8e6; border-left: 4px solid #d73527; padding: 12px 16px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>🏠</span> <span style="color: #d73527; font-weight: 600;">Dashboard</span>
            </div>
          </div>
          
          <!-- Nova Obra -->
          <div style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>+</span> <span>Nova Obra</span>
            </div>
          </div>
          
          <!-- Manutenção -->
          <div style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>🔧</span> <span>Manutenção Piscinas</span>
            </div>
          </div>
          
          <!-- DIAGNÓSTICO REMOVIDO -->
          <div style="margin: 12px 16px; padding: 16px; background: #f8d7da; border: 2px dashed #dc3545; border-radius: 8px; text-align: center;">
            <div style="font-size: 24px; margin-bottom: 8px;">🗑️</div>
            <div style="font-size: 14px; font-weight: 600; color: #721c24;">DIAGNÓSTICO REMOVIDO</div>
            <div style="font-size: 12px; color: #721c24;">Secção eliminada conforme solicitado</div>
          </div>
          
          <!-- ADMINISTRAÇÃO DESTACADA -->
          <div style="margin: 12px 16px; background: linear-gradient(135deg, #fff3cd, #ffeaa7); border: 3px solid #f39c12; border-radius: 12px; padding: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
              <div style="background: #f39c12; color: white; border-radius: 6px; padding: 6px; font-size: 12px;">⚙️</div>
              <span style="font-size: 14px; font-weight: 700; color: #8b4513;">⭐ ADMINISTRAÇÃO</span>
            </div>
            
            <div style="background: rgba(255,255,255,0.8); border-radius: 8px; padding: 12px;">
              <div style="font-size: 12px; color: #8b4513; font-weight: 600; margin-bottom: 8px;">📦 Definições Integradas:</div>
              <div style="font-size: 11px; color: #8b4513; line-height: 1.4;">
                ⚙️ Configurações Gerais<br>
                👤 Perfil de Utilizador<br>
                🔐 Segurança & Privacidade<br>
                📊 Relatórios & Analytics
              </div>
            </div>
          </div>
          
          <!-- Utilizadores -->
          <div style="padding: 12px 16px; border-bottom: 1px solid #f0f0f0;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>👥</span> <span>Utilizadores</span>
            </div>
          </div>
          
          <!-- Criar Utilizador -->
          <div style="padding: 12px 16px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>+</span> <span>Criar Utilizador</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Resumo -->
      <div style="background: white; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #333;">📋 Resumo das Alterações</h3>
        <div style="font-size: 14px; color: #666; line-height: 1.5;">
          ✅ DIAGNÓSTICO: Removido completamente<br>
          ⭐ ADMINISTRAÇÃO: Destacada e expandida<br>
          📦 DEFINIÇÕES: Integradas na Administração<br>
          🎯 RESULTADO: Conforme solicitado
        </div>
        
        <button onclick="document.getElementById('leirisonda-overlay').remove()" 
                style="background: #dc3545; color: white; border: none; padding: 12px 20px; border-radius: 8px; margin-top: 16px; cursor: pointer; font-size: 14px;">
          ❌ Fechar Demonstração
        </button>
      </div>
      
    </div>
  `;

  // Adicionar ao body
  document.body.appendChild(overlay);

  console.log("✅ OVERLAY: Overlay criado e adicionado ao body!");

  // Auto-remover após 30 segundos se o utilizador não interagir
  setTimeout(() => {
    if (document.getElementById("leirisonda-overlay")) {
      console.log("⏰ OVERLAY: Auto-removendo após 30 segundos");
      overlay.remove();
    }
  }, 30000);

  return true;
}

// Executar imediatamente
setTimeout(() => {
  console.log("🚀 OVERLAY: Iniciando criação...");
  const success = createSimpleOverlay();

  if (success) {
    console.log("🎯 OVERLAY: Sucesso! Overlay mostrado.");
  }
}, 500);

console.log("📌 OVERLAY: Sistema de overlay simples iniciado");
