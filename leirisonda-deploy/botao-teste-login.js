// CRIAR BOTÃO DE TESTE NA PÁGINA DE LOGIN
console.log("🔘 Criando botão de teste na página de login...");

function criarBotaoTeste() {
  console.log("🔧 Tentando adicionar botão de teste...");

  // Verificar se já existe
  if (document.getElementById("botao-teste-nova-obra")) {
    console.log("✅ Botão já existe");
    return;
  }

  // Procurar pelo formulário de login
  const loginForm =
    document.querySelector('form[data-loc*="Login.tsx"]') ||
    document.querySelector('[data-loc*="Login.tsx"]') ||
    document.querySelector("form");

  if (!loginForm) {
    console.log("❌ Formulário de login não encontrado");
    return;
  }

  console.log("📦 Adicionando botão de teste ao login...");

  // Criar o botão de teste
  const botaoTeste = document.createElement("div");
  botaoTeste.id = "botao-teste-nova-obra";
  botaoTeste.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    border: none;
    border-radius: 12px;
    padding: 16px 24px;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  `;

  botaoTeste.innerHTML = `
    <div style="text-align: center;">
      <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 4px;">
        🚀 TESTE
      </div>
      <div style="color: #bfdbfe; font-size: 14px; margin-bottom: 12px;">
        Ir para Nova Obra
      </div>
      <div style="color: #dbeafe; font-size: 12px; opacity: 0.8;">
        Clique para testar
      </div>
    </div>
  `;

  // Efeitos hover
  botaoTeste.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.05)";
    this.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.6)";
  });

  botaoTeste.addEventListener("mouseleave", function () {
    this.style.transform = "scale(1)";
    this.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
  });

  // Função de clique
  botaoTeste.addEventListener("click", function () {
    console.log("🚀 Botão de teste clicado!");

    // Animação de clique
    this.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.style.transform = "scale(1)";
    }, 150);

    // Mostrar loading
    this.innerHTML = `
      <div style="text-align: center;">
        <div style="color: white; font-size: 18px; font-weight: 600; margin-bottom: 4px;">
          ⏳ A NAVEGAR...
        </div>
        <div style="color: #bfdbfe; font-size: 14px;">
          Aguarde...
        </div>
      </div>
    `;

    setTimeout(() => {
      // Opção 1: Tentar navegação direta
      console.log("🔄 Tentando navegação para /create-work...");
      window.history.pushState({}, "", "/create-work");

      // Forçar atualização da página
      setTimeout(() => {
        window.location.href = "/create-work";
      }, 500);
    }, 1000);
  });

  // Adicionar ao body
  document.body.appendChild(botaoTeste);

  console.log("✅ Botão de teste adicionado!");
  return true;
}

// Criar também botão de bypass completo
function criarBotaoBypass() {
  console.log("🔧 Criando botão de bypass...");

  // Verificar se já existe
  if (document.getElementById("botao-bypass-completo")) {
    return;
  }

  const botaoBypass = document.createElement("div");
  botaoBypass.id = "botao-bypass-completo";
  botaoBypass.style.cssText = `
    position: fixed;
    top: 120px;
    right: 20px;
    z-index: 10000;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border: none;
    border-radius: 12px;
    padding: 12px 20px;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  `;

  botaoBypass.innerHTML = `
    <div style="text-align: center;">
      <div style="color: white; font-size: 16px; font-weight: 600; margin-bottom: 2px;">
        🔓 BYPASS
      </div>
      <div style="color: #a7f3d0; font-size: 12px;">
        Login automático
      </div>
    </div>
  `;

  botaoBypass.addEventListener("click", function () {
    console.log("🔓 Bypass ativado!");

    // Simular dados de login
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');

    if (emailInput && passwordInput) {
      emailInput.value = "admin@leirisonda.pt";
      passwordInput.value = "leirisonda2025";

      // Disparar eventos
      emailInput.dispatchEvent(new Event("input", { bubbles: true }));
      passwordInput.dispatchEvent(new Event("input", { bubbles: true }));

      console.log("✅ Campos preenchidos");

      // Tentar submeter o formulário
      setTimeout(() => {
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.click();
          console.log("🚀 Formulário submetido");
        }
      }, 500);
    }

    // Alternativamente, forçar navegação direta
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);
  });

  document.body.appendChild(botaoBypass);
}

// Tentar adicionar imediatamente
setTimeout(function () {
  criarBotaoTeste();
  criarBotaoBypass();
}, 1000);

// Tentar adicionar várias vezes
let tentativas = 0;
const intervalId = setInterval(function () {
  tentativas++;

  if (tentativas > 6) {
    clearInterval(intervalId);
    return;
  }

  // Verificar se estamos na página de login
  const isLoginPage =
    document.querySelector('[data-loc*="Login.tsx"]') ||
    document.body.textContent.includes("Sistema de Gestão de Obras");

  if (isLoginPage && !document.getElementById("botao-teste-nova-obra")) {
    console.log(`🔄 Tentativa ${tentativas} de adicionar botão...`);
    criarBotaoTeste();
    criarBotaoBypass();
  } else if (document.getElementById("botao-teste-nova-obra")) {
    console.log("✅ Botão já existe - parando tentativas");
    clearInterval(intervalId);
  }
}, 2000);

console.log("🔘 Script botão de teste carregado");
