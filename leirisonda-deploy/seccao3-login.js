// ADICIONAR SECÇÃO 3 NA PÁGINA DE LOGIN
console.log("📋 Criando Secção 3 na página de login...");

function criarSeccao3() {
  console.log("🔧 Tentando adicionar Secção 3...");

  // Verificar se já existe
  if (document.getElementById("seccao-3-login")) {
    console.log("✅ Secção 3 já existe");
    return;
  }

  // Procurar pelo formulário de login
  const loginForm =
    document.querySelector('form[data-loc*="Login"]') ||
    document.querySelector('[data-loc*="Login.tsx"]') ||
    document.querySelector("form");

  if (!loginForm) {
    console.log("❌ Formulário de login não encontrado");
    return;
  }

  console.log("📦 Adicionando Secção 3 ao login...");

  // Criar a Secção 3
  const seccao3 = document.createElement("div");
  seccao3.id = "seccao-3-login";
  seccao3.style.cssText = `
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    border: 2px solid #6b7280;
    border-radius: 12px;
    padding: 24px;
    margin: 24px 0;
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 350px;
    max-height: 70vh;
    overflow-y: auto;
    z-index: 9999;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  `;

  seccao3.innerHTML = `
    <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
      <h3 style="color: #374151; margin: 0; font-size: 20px; font-weight: 700;">
        📋 Secção 3
      </h3>
      <button onclick="this.closest('#seccao-3-login').remove();" 
              style="background: #dc2626; color: white; border: none; border-radius: 50%; width: 28px; height: 28px; cursor: pointer; font-size: 14px;">
        ✕
      </button>
    </div>

    <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
      Configurações adicionais e opções avançadas do sistema
    </p>

    <div style="display: grid; gap: 16px;">
      
      <!-- Configurações Gerais -->
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #d1d5db;">
        <h4 style="color: #1f2937; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
          ⚙️ Configurações Gerais
        </h4>
        
        <div style="margin-bottom: 12px;">
          <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 4px; font-size: 13px;">
            Idioma do Sistema
          </label>
          <select style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; background: white;">
            <option value="pt">Português</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 4px; font-size: 13px;">
            Tema Visual
          </label>
          <select style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; background: white;">
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
            <option value="auto">Automático</option>
          </select>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" id="notifications" style="margin: 0;">
          <label for="notifications" style="font-size: 13px; color: #374151; margin: 0;">
            Activar notificações
          </label>
        </div>
      </div>

      <!-- Preferências de Utilizador -->
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #d1d5db;">
        <h4 style="color: #1f2937; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
          👤 Preferências de Utilizador
        </h4>
        
        <div style="margin-bottom: 12px;">
          <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 4px; font-size: 13px;">
            Nome de Exibição
          </label>
          <input
            type="text"
            placeholder="Como quer ser chamado"
            style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;"
          >
        </div>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 4px; font-size: 13px;">
            Foto de Perfil
          </label>
          <input
            type="file"
            accept="image/*"
            style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px;"
          >
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" id="remember" style="margin: 0;">
          <label for="remember" style="font-size: 13px; color: #374151; margin: 0;">
            Lembrar dados de login
          </label>
        </div>
      </div>

      <!-- Configurações Avançadas -->
      <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #d1d5db;">
        <h4 style="color: #1f2937; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
          🔧 Configurações Avançadas
        </h4>
        
        <div style="margin-bottom: 12px;">
          <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 4px; font-size: 13px;">
            Servidor de Backup
          </label>
          <input
            type="text"
            placeholder="URL do servidor alternativo"
            style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;"
          >
        </div>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 4px; font-size: 13px;">
            Timeout de Sessão (minutos)
          </label>
          <input
            type="number"
            placeholder="30"
            min="5"
            max="480"
            style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;"
          >
        </div>

        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <input type="checkbox" id="debug" style="margin: 0;">
          <label for="debug" style="font-size: 13px; color: #374151; margin: 0;">
            Modo de debug activado
          </label>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" id="offline" style="margin: 0;">
          <label for="offline" style="font-size: 13px; color: #374151; margin: 0;">
            Permitir modo offline
          </label>
        </div>
      </div>

    </div>

    <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #d1d5db; display: flex; gap: 12px; justify-content: center;">
      <button
        type="button"
        onclick="alert('Configurações guardadas!');"
        style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: 500;"
      >
        ✅ Guardar Configurações
      </button>
      <button
        type="button"
        onclick="if(confirm('Repor todas as configurações?')) alert('Configurações repostas!');"
        style="padding: 10px 20px; background: #f59e0b; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: 500;"
      >
        🔄 Repor
      </button>
      <button
        type="button"
        onclick="this.closest('#seccao-3-login').remove();"
        style="padding: 10px 20px; background: #ef4444; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; font-weight: 500;"
      >
        ❌ Fechar
      </button>
    </div>
  `;

  // Adicionar ao body
  document.body.appendChild(seccao3);

  console.log("✅ Secção 3 adicionada à página de login!");
  return true;
}

// Tentar adicionar imediatamente
setTimeout(function () {
  criarSeccao3();
}, 1000);

// Tentar adicionar várias vezes até conseguir
let tentativas = 0;
const intervalId = setInterval(function () {
  tentativas++;

  if (tentativas > 8) {
    clearInterval(intervalId);
    return;
  }

  // Verificar se estamos na página de login
  const isLoginPage =
    document.querySelector('[data-loc*="Login.tsx"]') ||
    document.body.textContent.includes("Sistema de Gestão de Obras");

  if (isLoginPage && !document.getElementById("seccao-3-login")) {
    console.log(`🔄 Tentativa ${tentativas} de adicionar Secção 3...`);
    criarSeccao3();
  } else if (document.getElementById("seccao-3-login")) {
    console.log("✅ Secção 3 já existe - parando tentativas");
    clearInterval(intervalId);
  }
}, 2000);

console.log("📋 Script Secção 3 carregado");
