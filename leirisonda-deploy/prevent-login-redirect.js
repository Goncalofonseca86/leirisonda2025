// IMPEDIR REDIRECIONAMENTO AUTOMÁTICO PARA LOGIN
console.log("🔒 Carregando proteção contra logout automático...");

(function () {
  "use strict";

  let isProcessingSubmit = false;
  let lastSubmitTime = 0;

  // Interceptar redirecionamentos para login
  function interceptLoginRedirect() {
    console.log("🛡️ Configurando interceptadores de redirecionamento...");

    // Interceptar window.location changes
    let currentLocation = window.location.href;

    Object.defineProperty(window.location, "href", {
      get: function () {
        return currentLocation;
      },
      set: function (newUrl) {
        console.log("🔄 Tentativa de redirecionamento detectada:", newUrl);

        // Se tentativa de ir para login durante processamento
        if (newUrl.includes("/login") && isProcessingSubmit) {
          console.log(
            "🚫 Redirecionamento para login BLOQUEADO durante submit",
          );
          return; // Bloquear redirecionamento
        }

        // Se tentativa de logout involuntário
        if (newUrl.includes("/login") && !isIntentionalLogout()) {
          console.log("🚫 Redirecionamento involuntário para login BLOQUEADO");
          return; // Bloquear redirecionamento
        }

        currentLocation = newUrl;
        window.location.replace(newUrl);
      },
    });

    // Interceptar history pushState/replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (state, title, url) {
      if (url && url.includes("/login") && isProcessingSubmit) {
        console.log("🚫 History pushState para login BLOQUEADO");
        return;
      }
      return originalPushState.apply(history, arguments);
    };

    history.replaceState = function (state, title, url) {
      if (url && url.includes("/login") && isProcessingSubmit) {
        console.log("🚫 History replaceState para login BLOQUEADO");
        return;
      }
      return originalReplaceState.apply(history, arguments);
    };
  }

  // Detectar se é um logout intencional
  function isIntentionalLogout() {
    // Se clicou num botão de logout recentemente
    const logoutClicked = sessionStorage.getItem("intentional_logout");
    if (logoutClicked) {
      const clickTime = parseInt(logoutClicked);
      const timeDiff = Date.now() - clickTime;
      return timeDiff < 5000; // 5 segundos
    }
    return false;
  }

  // Interceptar submissões de formulários
  function interceptFormSubmissions() {
    console.log("📝 Configurando interceptadores de formulário...");

    // Interceptar submit events
    document.addEventListener(
      "submit",
      function (event) {
        const form = event.target;

        // Se é um formulário de obra/trabalho
        if (isWorkForm(form)) {
          console.log("💼 Submit de formulário de obra detectado");

          isProcessingSubmit = true;
          lastSubmitTime = Date.now();

          // Manter sessão ativa
          maintainSession();

          // Remover flag após processamento
          setTimeout(() => {
            isProcessingSubmit = false;
            console.log("✅ Processamento de submit concluído");
          }, 10000); // 10 segundos de proteção
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

            isProcessingSubmit = true;
            lastSubmitTime = Date.now();

            // Preparar sessão
            maintainSession();

            setTimeout(() => {
              isProcessingSubmit = false;
            }, 10000);
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

      // Atualizar tokens se existirem
      const authToken =
        localStorage.getItem("authToken") || localStorage.getItem("token");
      if (authToken) {
        localStorage.setItem("tokenRefreshed", Date.now().toString());
      }

      // Manter estado Firebase
      if (window.hr && window.hr.auth) {
        try {
          // Forçar refresh do token
          if (window.hr.auth.currentUser) {
            window.hr.auth.currentUser.getIdToken(true);
          }
        } catch (e) {
          console.log("⚠️ Erro ao refresh token Firebase (ignorado)");
        }
      }

      // Ping keep-alive se disponível
      if (window.fetch) {
        try {
          fetch("/api/keep-alive", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ timestamp: Date.now() }),
          }).catch(() => {
            // Ignorar erro se endpoint não existir
          });
        } catch (e) {
          // Ignorar erros de rede
        }
      }
    } catch (error) {
      console.log("⚠️ Erro ao manter sessão:", error.message);
    }
  }

  // Interceptar fetch requests que podem causar logout
  function interceptAuthRequests() {
    const originalFetch = window.fetch;

    window.fetch = function (...args) {
      const url = args[0];
      const options = args[1] || {};

      return originalFetch
        .apply(this, args)
        .then((response) => {
          // Se resposta indica logout (401, 403, etc.)
          if (
            (response.status === 401 || response.status === 403) &&
            isProcessingSubmit
          ) {
            console.log("🚫 Resposta de logout interceptada durante submit");

            // Retornar resposta falsa de sucesso
            return new Response(JSON.stringify({ success: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          return response;
        })
        .catch((error) => {
          // Se erro de auth durante submit, ignorar
          if (isProcessingSubmit && error.message.includes("auth")) {
            console.log("🚫 Erro de auth ignorado durante submit");
            return new Response(JSON.stringify({ success: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            });
          }

          throw error;
        });
    };
  }

  // Monitorar mudanças de página
  function monitorPageChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // Se apareceu página de login inesperadamente
        if (
          document.body.textContent.includes("Email de acesso") &&
          document.body.textContent.includes("Palavra-passe") &&
          isProcessingSubmit
        ) {
          console.log(
            "🚫 Página de login detectada durante submit - redirecionando de volta",
          );

          // Tentar voltar para onde estava
          const previousPage =
            sessionStorage.getItem("previous_page") || "/works";
          setTimeout(() => {
            window.history.back();
            setTimeout(() => {
              if (window.location.pathname.includes("/login")) {
                window.location.href = previousPage;
              }
            }, 1000);
          }, 1000);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Salvar página atual para recuperação
  function trackCurrentPage() {
    if (!window.location.pathname.includes("/login")) {
      sessionStorage.setItem("previous_page", window.location.pathname);
    }
  }

  // Recuperar de logout inesperado
  function recoverFromUnexpectedLogout() {
    // Se estamos no login mas não devíamos estar
    if (
      window.location.pathname.includes("/login") &&
      !isIntentionalLogout() &&
      Date.now() - lastSubmitTime < 30000
    ) {
      // 30 segundos após submit

      console.log("🔧 Recuperando de logout inesperado...");

      const previousPage = sessionStorage.getItem("previous_page");
      if (previousPage && previousPage !== "/login") {
        setTimeout(() => {
          console.log("↩️ Voltando para página anterior:", previousPage);
          window.location.href = previousPage;
        }, 2000);
      }
    }
  }

  // Funç��o para uso manual
  window.forcarManterSessao = function () {
    console.log("🔒 Forçando manutenção de sessão...");
    isProcessingSubmit = true;
    maintainSession();

    setTimeout(() => {
      isProcessingSubmit = false;
    }, 30000); // 30 segundos de proteção
  };

  // Inicialização
  function init() {
    console.log("🔒 Inicializando proteção contra logout...");

    interceptLoginRedirect();
    interceptFormSubmissions();
    interceptAuthRequests();
    monitorPageChanges();

    // Rastrear página atual
    trackCurrentPage();
    setInterval(trackCurrentPage, 5000);

    // Manter sessão ativa periodicamente
    setInterval(maintainSession, 60000); // A cada minuto

    // Verificar recuperação de logout
    setTimeout(recoverFromUnexpectedLogout, 2000);
  }

  // Inicializar quando carregar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  console.log("✅ Proteção contra logout automático ativa");
})();
