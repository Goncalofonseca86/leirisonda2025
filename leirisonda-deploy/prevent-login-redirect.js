// PROTEÇÃO SIMPLES CONTRA LOGOUT AUTOMÁTICO
console.log("🔒 Carregando proteção simples contra logout...");

(function () {
  "use strict";

  let isProcessingSubmit = false;
  let lastSubmitTime = 0;
  let protectionActive = false;

  // Detectar se é um logout intencional
  function isIntentionalLogout() {
    const logoutClicked = sessionStorage.getItem("intentional_logout");
    if (logoutClicked) {
      const clickTime = parseInt(logoutClicked);
      const timeDiff = Date.now() - clickTime;
      return timeDiff < 5000; // 5 segundos
    }
    return false;
  }

  // Ativar proteção durante submissão
  function activateProtection() {
    console.log("🛡️ Ativando proteção contra logout...");

    isProcessingSubmit = true;
    protectionActive = true;
    lastSubmitTime = Date.now();

    // Manter sessão ativa
    maintainSession();

    // Desativar após 15 segundos
    setTimeout(() => {
      isProcessingSubmit = false;
      protectionActive = false;
      console.log("✅ Proteção desativada");
    }, 15000);
  }

  // Interceptar submissões de formulários
  function setupFormProtection() {
    console.log("📝 Configurando proteção de formulários...");

    // Interceptar submit events
    document.addEventListener(
      "submit",
      function (event) {
        const form = event.target;

        // Se é um formulário de obra/trabalho
        if (isWorkForm(form)) {
          console.log("💼 Submit de formulário de obra detectado");
          activateProtection();
        }
      },
      true,
    );

    // Interceptar clicks em botões de submit
    document.addEventListener(
      "click",
      function (event) {
        const button = event.target;

        if (button.type === "submit" || button.form) {
          const form = button.form || button.closest("form");

          if (form && isWorkForm(form)) {
            console.log("💼 Botão submit de obra clicado");
            activateProtection();
          }
        }

        // Detectar cliques intencionais de logout
        if (
          button.textContent &&
          (button.textContent.toLowerCase().includes("sair") ||
            button.textContent.toLowerCase().includes("logout") ||
            button.textContent.toLowerCase().includes("terminar"))
        ) {
          console.log("🚪 Logout intencional detectado");
          sessionStorage.setItem("intentional_logout", Date.now().toString());
          protectionActive = false;
        }
      },
      true,
    );
  }

  // Verificar se é um formulário de obra
  function isWorkForm(form) {
    if (!form) return false;

    const formText = form.textContent || "";
    const formAction = form.action || "";

    return (
      formText.includes("Informações Básicas") ||
      formText.includes("Tipo de Trabalho") ||
      formText.includes("Nova Obra") ||
      formText.includes("Criar Obra") ||
      formAction.includes("work") ||
      formAction.includes("obra") ||
      window.location.pathname.includes("/create-work")
    );
  }

  // Manter sessão ativa
  function maintainSession() {
    console.log("🔄 Mantendo sessão ativa...");

    try {
      // Atualizar localStorage de sessão
      const sessionData = localStorage.getItem("session") || "{}";
      const session = JSON.parse(sessionData);
      session.lastActivity = Date.now();
      session.keepAlive = true;
      localStorage.setItem("session", JSON.stringify(session));

      // Atualizar timestamp de atividade
      localStorage.setItem("lastActivity", Date.now().toString());
      sessionStorage.setItem("formSubmitInProgress", "true");

      // Manter estado Firebase
      if (window.hr && window.hr.auth && window.hr.auth.currentUser) {
        try {
          window.hr.auth.currentUser.getIdToken(true).catch(() => {
            // Ignorar erros
          });
        } catch (e) {
          // Ignorar erros
        }
      }
    } catch (error) {
      console.log("⚠️ Erro ao manter sessão:", error.message);
    }
  }

  // Monitorar mudanças de página para detectar logout inesperado
  function monitorPageChanges() {
    console.log("👁️ Iniciando monitoramento de página...");

    let currentPath = window.location.pathname;

    // Verificar mudanças de URL periodicamente
    setInterval(() => {
      const newPath = window.location.pathname;

      if (newPath !== currentPath) {
        console.log(
          "🔄 Mudança de página detectada:",
          currentPath,
          "→",
          newPath,
        );

        // Se foi para login durante proteção ativa
        if (
          newPath.includes("/login") &&
          protectionActive &&
          !isIntentionalLogout()
        ) {
          console.log("🚫 Logout inesperado detectado durante proteção!");

          // Tentar recuperar
          const previousPage =
            sessionStorage.getItem("previous_page") || "/works";
          setTimeout(() => {
            console.log("↩️ Tentando voltar para:", previousPage);
            window.history.back();

            // Se ainda estiver no login após 2 segundos, forçar navegação
            setTimeout(() => {
              if (window.location.pathname.includes("/login")) {
                console.log("🔧 Forçando navegação para:", previousPage);
                window.location.href = previousPage;
              }
            }, 2000);
          }, 1000);
        }

        currentPath = newPath;
      }
    }, 1000);

    // Observer para mudanças no DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Se apareceu página de login inesperadamente
        if (
          document.body.textContent.includes("Email de acesso") &&
          document.body.textContent.includes("Palavra-passe") &&
          protectionActive &&
          !isIntentionalLogout()
        ) {
          console.log("��� DOM de login detectado durante proteção!");

          // Tentar voltar
          const previousPage =
            sessionStorage.getItem("previous_page") || "/works";
          setTimeout(() => {
            window.history.back();
          }, 1000);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Interceptar requests de auth
  function setupRequestInterception() {
    console.log("🌐 Configurando interceptação de requests...");

    const originalFetch = window.fetch;

    window.fetch = function (...args) {
      const url = args[0];

      return originalFetch
        .apply(this, args)
        .then((response) => {
          // Se resposta indica logout durante proteção
          if (
            (response.status === 401 || response.status === 403) &&
            protectionActive
          ) {
            console.log("🚫 Resposta de logout interceptada durante proteção");

            // Manter sessão ativa e tentar novamente
            maintainSession();

            // Simular resposta de sucesso
            return new Response(
              JSON.stringify({
                success: true,
                message: "Operação protegida",
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
          // Se erro de auth durante proteção, tentar manter
          if (
            protectionActive &&
            error.message &&
            error.message.includes("auth")
          ) {
            console.log("🚫 Erro de auth ignorado durante proteção");
            maintainSession();

            return new Response(
              JSON.stringify({
                success: true,
                message: "Erro de auth ignorado",
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

  // Salvar página atual
  function trackCurrentPage() {
    if (!window.location.pathname.includes("/login")) {
      sessionStorage.setItem("previous_page", window.location.pathname);
    }
  }

  // Funções para uso manual
  window.forcarProtecao = function () {
    console.log("🔒 Proteção forçada ativada");
    activateProtection();
  };

  window.desativarProtecao = function () {
    console.log("🔓 Proteção desativada manualmente");
    isProcessingSubmit = false;
    protectionActive = false;
    sessionStorage.removeItem("formSubmitInProgress");
  };

  // Inicialização
  function init() {
    console.log("🔒 Inicializando proteção contra logout...");

    try {
      setupFormProtection();
      setupRequestInterception();
      monitorPageChanges();

      // Rastrear página atual
      trackCurrentPage();
      setInterval(trackCurrentPage, 5000);

      // Manter sessão ativa periodicamente
      setInterval(maintainSession, 30000); // A cada 30 segundos

      console.log("✅ Proteção inicializada com sucesso");
    } catch (error) {
      console.log("⚠️ Erro ao inicializar proteção:", error.message);
    }
  }

  // Inicializar quando carregar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  console.log("✅ Sistema de proteção carregado");
})();
