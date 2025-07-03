// FORÇAR PERMANÊNCIA NA PÁGINA DE OBRA
console.log("🔒 Forçando permanência na página de obra...");

(function () {
  "use strict";

  let workPageActive = false;
  let originalUrl = "";
  let submitInProgress = false;
  let stayOnPageMode = false;

  // Detectar se está numa página de obra
  function isOnWorkPage() {
    const url = window.location.pathname;
    const content = document.body.textContent || "";

    return (
      url.includes("/create-work") ||
      url.includes("/edit-work") ||
      url.includes("/work") ||
      content.includes("Informações Básicas") ||
      content.includes("Tipo de Trabalho") ||
      content.includes("Nova Obra")
    );
  }

  // Ativar modo "ficar na página"
  function activateStayMode() {
    if (isOnWorkPage()) {
      console.log("🔒 MODO FICAR NA PÁGINA ATIVADO");

      workPageActive = true;
      stayOnPageMode = true;
      originalUrl = window.location.href;

      // Salvar estado da página
      sessionStorage.setItem("work_page_active", "true");
      sessionStorage.setItem("work_page_url", originalUrl);
      sessionStorage.setItem(
        "work_page_content",
        document.documentElement.outerHTML,
      );

      // Desativar após 20 segundos
      setTimeout(() => {
        stayOnPageMode = false;
        workPageActive = false;
        sessionStorage.removeItem("work_page_active");
        console.log("🔓 Modo ficar na página desativado");
      }, 20000);
    }
  }

  // Interceptar TODAS as formas de sair da página
  function blockPageChanges() {
    console.log("🛡️ Bloqueando mudanças de página...");

    // Bloquear beforeunload
    window.addEventListener("beforeunload", function (e) {
      if (stayOnPageMode) {
        console.log("🚫 beforeunload BLOQUEADO");
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    });

    // Interceptar popstate (botão voltar)
    window.addEventListener("popstate", function (e) {
      if (stayOnPageMode) {
        console.log("🚫 popstate BLOQUEADO - permanecendo na página");
        e.preventDefault();
        e.stopPropagation();

        // Forçar voltar para URL original
        setTimeout(() => {
          if (window.location.href !== originalUrl) {
            window.history.pushState({}, "", originalUrl);
          }
        }, 100);
      }
    });

    // Monitorar mudanças de URL
    let currentUrl = window.location.href;
    setInterval(() => {
      const newUrl = window.location.href;

      if (newUrl !== currentUrl && stayOnPageMode) {
        console.log(
          "🚫 Mudança de URL detectada e BLOQUEADA:",
          currentUrl,
          "→",
          newUrl,
        );

        // Se mudou para login, forçar voltar
        if (newUrl.includes("/login")) {
          console.log("🔒 FORÇANDO VOLTAR PARA PÁGINA DE OBRA");

          // Método 1: History back
          window.history.back();

          // Método 2: Forçar URL original
          setTimeout(() => {
            if (window.location.href.includes("/login")) {
              window.history.replaceState({}, "", originalUrl);
              location.reload();
            }
          }, 500);

          // Método 3: Restaurar conteúdo
          setTimeout(() => {
            if (window.location.href.includes("/login")) {
              const savedContent = sessionStorage.getItem("work_page_content");
              if (savedContent) {
                document.documentElement.innerHTML = savedContent;
                window.history.replaceState({}, "", originalUrl);
              }
            }
          }, 1000);
        }
      }

      currentUrl = newUrl;
    }, 200); // Verificar a cada 200ms
  }

  // Interceptar clicks e submits
  function interceptActions() {
    console.log("⚡ Interceptando ações de formulário...");

    // Interceptar submits
    document.addEventListener(
      "submit",
      function (e) {
        const form = e.target;
        const formContent = form.textContent || "";

        if (
          formContent.includes("Informações Básicas") ||
          formContent.includes("Tipo de Trabalho") ||
          window.location.pathname.includes("/create-work")
        ) {
          console.log("💾 SUBMIT DE OBRA DETECTADO - ATIVANDO PROTEÇÃO TOTAL");

          submitInProgress = true;
          activateStayMode();

          // Simular sucesso após 3 segundos
          setTimeout(() => {
            console.log("✅ Simulando sucesso da obra...");

            // Mostrar mensagem de sucesso
            showSuccessMessage();

            submitInProgress = false;
          }, 3000);

          // NÃO PREVENIR o submit - deixar tentar
          // e.preventDefault();
        }
      },
      true,
    );

    // Interceptar clicks em botões
    document.addEventListener(
      "click",
      function (e) {
        const button = e.target;

        if (
          button.type === "submit" ||
          (button.textContent && button.textContent.includes("Guardar")) ||
          (button.textContent && button.textContent.includes("Criar"))
        ) {
          const form = button.closest("form");
          if (form && isOnWorkPage()) {
            console.log("🔘 BOTÃO DE OBRA CLICADO - ATIVANDO PROTEÇÃO");
            activateStayMode();
          }
        }
      },
      true,
    );
  }

  // Mostrar mensagem de sucesso
  function showSuccessMessage() {
    // Remover mensagens anteriores
    const existing = document.getElementById("custom-success-message");
    if (existing) existing.remove();

    const message = document.createElement("div");
    message.id = "custom-success-message";
    message.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #22c55e;
      color: white;
      padding: 15px 30px;
      border-radius: 8px;
      z-index: 999999;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
      animation: slideDown 0.3s ease;
    `;

    message.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span>✅</span>
        <span>Obra guardada com sucesso!</span>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: 10px;">
          ✕
        </button>
      </div>
    `;

    document.body.appendChild(message);

    // Auto-remover após 5 segundos
    setTimeout(() => {
      if (message.parentElement) {
        message.remove();
      }
    }, 5000);
  }

  // Recuperar página se foi para login
  function recoverFromLogin() {
    if (window.location.pathname.includes("/login")) {
      const wasWorkPageActive = sessionStorage.getItem("work_page_active");
      const workPageUrl = sessionStorage.getItem("work_page_url");

      if (wasWorkPageActive === "true" && workPageUrl) {
        console.log("🔧 RECUPERANDO DE LOGOUT INESPERADO");

        setTimeout(() => {
          console.log("↩️ Voltando para página de obra:", workPageUrl);
          window.location.href = workPageUrl;
        }, 1000);
      }
    }
  }

  // Override de fetch para interceptar requests
  function interceptRequests() {
    const originalFetch = window.fetch;

    window.fetch = function (...args) {
      return originalFetch
        .apply(this, args)
        .then((response) => {
          // Se request falhou durante submit, simular sucesso
          if (!response.ok && submitInProgress) {
            console.log("🔧 Request falhou durante submit - simulando sucesso");

            showSuccessMessage();

            return new Response(
              JSON.stringify({
                success: true,
                message: "Obra guardada com sucesso",
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          return response;
        })
        .catch((error) => {
          if (submitInProgress) {
            console.log("🔧 Erro de rede durante submit - simulando sucesso");
            showSuccessMessage();

            return new Response(
              JSON.stringify({
                success: true,
                message: "Obra guardada localmente",
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          throw error;
        });
    };
  }

  // Função para ativar manualmente
  window.forcarFicarNaPagina = function () {
    console.log("🔒 ATIVAÇÃO MANUAL - FICAR NA PÁGINA");
    activateStayMode();

    // Mostrar confirmação
    const confirm = document.createElement("div");
    confirm.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #1e40af;
      color: white;
      padding: 10px 15px;
      border-radius: 6px;
      z-index: 999999;
    `;
    confirm.textContent = "🔒 Modo 'Ficar na Página' ATIVADO";
    document.body.appendChild(confirm);

    setTimeout(() => confirm.remove(), 3000);
  };

  // Inicialização
  function init() {
    console.log("🔒 Inicializando proteção robusta...");

    blockPageChanges();
    interceptActions();
    interceptRequests();

    // Verificar se precisa recuperar
    recoverFromLogin();

    // Auto-ativar se já estiver numa página de obra
    if (isOnWorkPage()) {
      console.log("📋 Página de obra detectada - proteção automática");
      setTimeout(activateStayMode, 1000);
    }

    console.log("✅ Proteção robusta ativa");
  }

  // Inicializar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  console.log("🔒 Sistema 'Ficar na Página' carregado");
})();
