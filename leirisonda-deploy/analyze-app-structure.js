// ================================================
// ANÁLISE DA ESTRUTURA DA APLICAÇÃO LEIRISONDA
// ================================================
console.log("🔍 ANÁLISE: Iniciando estudo da estrutura da aplicação");

(function () {
  "use strict";

  // ==================== ANÁLISE DE ROTAS ====================
  function analyzeRoutes() {
    console.log("\n📍 === ANÁLISE DE ROTAS ===");

    // Interceptar React Router para mapear rotas
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    const routeMap = new Map();

    function logRoute(path, action) {
      const timestamp = new Date().toLocaleTimeString();
      console.log(`🔄 [${timestamp}] ${action}: ${path}`);

      setTimeout(() => {
        const content = analyzePageContent();
        routeMap.set(path, {
          timestamp,
          action,
          content,
          components: findReactComponents(),
          forms: analyzeForms(),
          dataElements: findDataLocElements(),
        });

        console.log(`📊 Página analisada: ${path}`, routeMap.get(path));
      }, 1000);
    }

    // Interceptar navegação
    history.pushState = function (...args) {
      originalPushState.apply(this, args);
      logRoute(window.location.pathname, "PUSH");
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      logRoute(window.location.pathname, "REPLACE");
    };

    // Analisar rota atual
    logRoute(window.location.pathname, "CURRENT");

    // Disponibilizar mapa para inspeção
    window.leirisondaRouteMap = routeMap;

    return routeMap;
  }

  // ==================== ANÁLISE DE CONTEÚDO DA PÁGINA ====================
  function analyzePageContent() {
    const content = {
      title: document.title,
      url: window.location.pathname,
      textContent: document.body.textContent.substring(0, 500),
      headings: Array.from(
        document.querySelectorAll("h1, h2, h3, h4, h5, h6"),
      ).map((h) => ({
        tag: h.tagName,
        text: h.textContent.trim(),
      })),
      buttons: Array.from(document.querySelectorAll("button")).map((btn) => ({
        text: btn.textContent.trim(),
        type: btn.type,
        className: btn.className,
        onClick: btn.onclick ? "has onClick" : "no onClick",
      })),
      links: Array.from(document.querySelectorAll("a")).map((link) => ({
        text: link.textContent.trim(),
        href: link.href,
        className: link.className,
      })),
    };

    return content;
  }

  // ==================== ANÁLISE DE COMPONENTES REACT ====================
  function findReactComponents() {
    const components = [];

    // Procurar por elementos com data-loc (indicam componentes React)
    const dataLocElements = document.querySelectorAll("[data-loc]");
    dataLocElements.forEach((element) => {
      components.push({
        component: element.getAttribute("data-loc"),
        tagName: element.tagName,
        className: element.className,
        textContent: element.textContent.substring(0, 100),
        position: element.getBoundingClientRect(),
      });
    });

    // Procurar por elementos React Fiber
    function findReactFiber(element) {
      for (let key in element) {
        if (
          key.startsWith("__reactFiber") ||
          key.startsWith("__reactInternalInstance")
        ) {
          return element[key];
        }
      }
      return null;
    }

    // Analisar elementos principais
    const mainElements = document.querySelectorAll(
      'div[class*=""], main, section, article',
    );
    mainElements.forEach((element) => {
      const fiber = findReactFiber(element);
      if (fiber && fiber.elementType && fiber.elementType.name) {
        components.push({
          component: fiber.elementType.name,
          type: "React Fiber",
          element: element.tagName,
          className: element.className,
        });
      }
    });

    return components;
  }

  // ==================== ANÁLISE DE FORMULÁRIOS ====================
  function analyzeForms() {
    const forms = [];

    document.querySelectorAll("form").forEach((form, index) => {
      const formData = {
        index,
        action: form.action,
        method: form.method,
        className: form.className,
        inputs: [],
        selects: [],
        textareas: [],
        buttons: [],
      };

      // Analisar inputs
      form.querySelectorAll("input").forEach((input) => {
        formData.inputs.push({
          name: input.name,
          type: input.type,
          placeholder: input.placeholder,
          required: input.required,
          value: input.value,
          className: input.className,
        });
      });

      // Analisar selects
      form.querySelectorAll("select").forEach((select) => {
        const options = Array.from(select.options).map((opt) => ({
          value: opt.value,
          text: opt.text,
          selected: opt.selected,
        }));

        formData.selects.push({
          name: select.name,
          className: select.className,
          required: select.required,
          options: options,
        });
      });

      // Analisar textareas
      form.querySelectorAll("textarea").forEach((textarea) => {
        formData.textareas.push({
          name: textarea.name,
          placeholder: textarea.placeholder,
          required: textarea.required,
          value: textarea.value,
          className: textarea.className,
        });
      });

      // Analisar botões
      form.querySelectorAll("button").forEach((button) => {
        formData.buttons.push({
          type: button.type,
          text: button.textContent.trim(),
          className: button.className,
        });
      });

      forms.push(formData);
    });

    return forms;
  }

  // ==================== ANÁLISE DE ELEMENTOS DATA-LOC ====================
  function findDataLocElements() {
    const dataElements = [];

    document.querySelectorAll("[data-loc]").forEach((element) => {
      dataElements.push({
        dataLoc: element.getAttribute("data-loc"),
        tagName: element.tagName,
        className: element.className,
        id: element.id,
        textContent: element.textContent.substring(0, 200),
        children: element.children.length,
        parent: element.parentElement ? element.parentElement.tagName : null,
      });
    });

    return dataElements;
  }

  // ==================== ANÁLISE DE ESTADO REACT ====================
  function analyzeReactState() {
    console.log("\n🔍 === ANÁLISE DE ESTADO REACT ===");

    // Procurar por React DevTools
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log("✅ React DevTools detectado");

      try {
        const reactFiberRoots = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers;
        console.log("🌳 React Fiber Roots:", reactFiberRoots);
      } catch (e) {
        console.log("⚠️ Erro ao acessar React DevTools:", e.message);
      }
    }

    // Procurar por React root
    const reactRoot = document.querySelector("#root");
    if (reactRoot) {
      console.log("🎯 React Root encontrado:", reactRoot);

      // Tentar encontrar instância React
      for (let key in reactRoot) {
        if (
          key.startsWith("__reactContainer") ||
          key.startsWith("_reactRootContainer")
        ) {
          console.log("📦 React Container:", key, reactRoot[key]);
        }
      }
    }
  }

  // ==================== MONITORIZAÇÃO DE EVENTOS ====================
  function setupEventMonitoring() {
    console.log("\n👂 === MONITORIZAÇÃO DE EVENTOS ===");

    // Interceptar clicks em formulários
    document.addEventListener("click", function (event) {
      const target = event.target;

      if (target.type === "submit" || target.tagName === "BUTTON") {
        console.log("🖱️ Click em botão:", {
          text: target.textContent.trim(),
          type: target.type,
          form: target.closest("form") ? "dentro de form" : "fora de form",
          className: target.className,
        });
      }
    });

    // Interceptar submits de formulário
    document.addEventListener("submit", function (event) {
      const form = event.target;
      console.log("📤 Submit de formulário:", {
        action: form.action,
        method: form.method,
        inputs: form.querySelectorAll("input").length,
        selects: form.querySelectorAll("select").length,
      });
    });

    // Interceptar mudanças em inputs
    document.addEventListener("change", function (event) {
      const target = event.target;

      if (target.tagName === "SELECT" || target.tagName === "INPUT") {
        console.log("🔄 Mudança em campo:", {
          name: target.name,
          type: target.type,
          value: target.value,
          tagName: target.tagName,
        });
      }
    });
  }

  // ==================== PROCURAR PADRÕES DE OBRAS ====================
  function findWorkPatterns() {
    console.log("\n🏗️ === PROCURAR PADRÕES DE OBRAS ===");

    const workKeywords = [
      "obra",
      "work",
      "projeto",
      "project",
      "serviço",
      "service",
      "tipo",
      "type",
      "categoria",
      "category",
      "cliente",
      "client",
      "descrição",
      "description",
      "guardar",
      "save",
      "criar",
      "create",
    ];

    const pageText = document.body.textContent.toLowerCase();
    const foundKeywords = workKeywords.filter((keyword) =>
      pageText.includes(keyword),
    );

    console.log("🔍 Keywords encontradas:", foundKeywords);

    // Procurar por padrões específicos de formulário de obra
    const workPatterns = {
      hasTypeField: !!document.querySelector(
        'select[name*="type"], select[name*="tipo"]',
      ),
      hasDescriptionField: !!document.querySelector(
        'textarea[name*="description"], textarea[name*="descricao"]',
      ),
      hasClientField: !!document.querySelector(
        'input[name*="client"], input[name*="cliente"]',
      ),
      hasSaveButton: !!document.querySelector(
        'button[type="submit"], button:contains("Guardar"), button:contains("Save")',
      ),
      hasForm: !!document.querySelector("form"),
    };

    console.log("📋 Padrões de obra encontrados:", workPatterns);

    return { foundKeywords, workPatterns };
  }

  // ==================== FUNÇÃO PRINCIPAL DE ANÁLISE ====================
  function runFullAnalysis() {
    console.log("🚀 Iniciando análise completa da aplicação...\n");

    const analysis = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      routes: analyzeRoutes(),
      content: analyzePageContent(),
      components: findReactComponents(),
      forms: analyzeForms(),
      dataElements: findDataLocElements(),
      workPatterns: findWorkPatterns(),
    };

    // Análises adicionais
    analyzeReactState();
    setupEventMonitoring();

    // Disponibilizar análise globalmente
    window.leirisondaAnalysis = analysis;

    console.log("\n📊 === RESUMO DA ANÁLISE ===");
    console.log("Forms encontrados:", analysis.forms.length);
    console.log("Componentes React:", analysis.components.length);
    console.log("Elementos data-loc:", analysis.dataElements.length);
    console.log(
      "\n💡 Para acessar análise completa: window.leirisondaAnalysis",
    );
    console.log("💡 Para ver mapa de rotas: window.leirisondaRouteMap");

    return analysis;
  }

  // ==================== COMANDOS DE DEBUG ====================
  window.leirisondaAnalyzer = {
    analyze: runFullAnalysis,
    routes: analyzeRoutes,
    content: analyzePageContent,
    components: findReactComponents,
    forms: analyzeForms,
    dataElements: findDataLocElements,
    workPatterns: findWorkPatterns,
    reactState: analyzeReactState,

    // Comandos úteis
    navigateAndAnalyze(path) {
      console.log(`🧭 Navegando para ${path} e analisando...`);
      history.pushState({}, "", path);
      setTimeout(() => {
        runFullAnalysis();
      }, 1000);
    },

    findCreateWorkPage() {
      console.log("🔍 Procurando página de criação de obra...");
      const possiblePaths = [
        "/create-work",
        "/create",
        "/work/new",
        "/obra/nova",
        "/nova-obra",
        "/works/create",
        "/new-work",
      ];

      possiblePaths.forEach((path) => {
        console.log(`Testando: ${path}`);
        fetch(path)
          .then((response) => {
            if (response.ok) {
              console.log(`✅ Encontrado: ${path}`);
            }
          })
          .catch(() => {
            console.log(`❌ Não encontrado: ${path}`);
          });
      });
    },
  };

  // Executar análise inicial após carregamento
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runFullAnalysis);
  } else {
    setTimeout(runFullAnalysis, 1000);
  }

  console.log("✅ Analisador da aplicação carregado");
  console.log("💡 Use window.leirisondaAnalyzer.analyze() para nova análise");
  console.log(
    "💡 Use window.leirisondaAnalyzer.findCreateWorkPage() para encontrar página de obras",
  );
})();
