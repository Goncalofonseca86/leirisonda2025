// Função SIMPLES e FOCADA - só elimina obras, piscinas e manutenções
window.deleteWorkDataOnly = function () {
  try {
    console.log("🗑️ ELIMINAÇÃO FOCADA - SÓ TRABALHOS");

    if (
      !confirm(
        "🗑️ ELIMINAR DADOS DE TRABALHO?\n\n✅ Obras\n✅ Piscinas  \n✅ Manutenções\n\n❌ NÃO toca em mais nada!\n\nContinuar?",
      )
    ) {
      return;
    }

    let deletedLocal = 0;

    // PARTE 1: localStorage - só chaves específicas
    console.log("🔍 Procurando dados de trabalho no localStorage...");
    const localKeys = Object.keys(localStorage);
    const workKeys = [
      "works",
      "pools",
      "maintenances",
      "leirisonda_works",
      "leirisonda_pools",
      "leirisonda_maintenances",
    ];

    workKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        const data = localStorage.getItem(key);
        localStorage.removeItem(key);
        console.log(`✅ ${key} eliminado (${data.length} chars)`);
        deletedLocal++;
      }
    });

    // Verificar outras chaves que possam conter dados
    localKeys.forEach((key) => {
      if (
        key.toLowerCase().includes("work") ||
        key.toLowerCase().includes("pool") ||
        key.toLowerCase().includes("maintenance") ||
        key.toLowerCase().includes("obra") ||
        key.toLowerCase().includes("piscina") ||
        key.toLowerCase().includes("manutenc")
      ) {
        if (!workKeys.includes(key)) {
          const data = localStorage.getItem(key);
          localStorage.removeItem(key);
          console.log(`✅ ${key} eliminado (extra)`);
          deletedLocal++;
        }
      }
    });

    // PARTE 2: Firebase - só coleções específicas
    console.log("🔥 Procurando dados de trabalho no Firebase...");
    if (window.hr && window.hr.firestore) {
      const collections = ["works", "pools", "maintenances"];

      collections.forEach((collection) => {
        try {
          window.hr.firestore
            .collection(collection)
            .get()
            .then((snapshot) => {
              console.log(
                `🔥 Encontrados ${snapshot.size} documentos em ${collection}`,
              );
              snapshot.forEach((doc) => {
                doc.ref
                  .delete()
                  .then(() => {
                    console.log(
                      `✅ Documento ${doc.id} eliminado de ${collection}`,
                    );
                  })
                  .catch((e) => {
                    console.log(`❌ Erro ao eliminar ${doc.id}: ${e.message}`);
                  });
              });
            })
            .catch((e) => {
              console.log(`❌ Erro na coleção ${collection}: ${e.message}`);
            });
        } catch (e) {
          console.log(`❌ Erro Firebase ${collection}: ${e.message}`);
        }
      });
    } else {
      console.log("⚠️ Firebase não disponível");
    }

    // RESULTADO
    setTimeout(() => {
      const message = `🎉 ELIMINAÇÃO CONCLUÍDA!\n\n📱 Local: ${deletedLocal} tipos eliminados\n🔥 Firebase: comandos enviados\n\n✅ Obras, piscinas e manutenções eliminadas\n✅ Tudo o resto mantido intacto`;

      console.log(message);
      alert(message);

      // Recarregar para refletir mudanças
      if (confirm("🔄 Recarregar aplicação para refletir mudanças?")) {
        window.location.reload();
      }
    }, 2000);
  } catch (error) {
    console.error("❌ Erro na eliminação focada:", error);
    alert(`❌ ERRO: ${error.message}`);
  }
};

// Função para limpar credenciais auto-preenchidas
window.clearSavedCredentials = function () {
  try {
    console.log("🔐 Limpando credenciais guardadas");

    // Limpar auto-complete e dados salvos de formulários
    const forms = document.querySelectorAll("form");
    const inputs = document.querySelectorAll(
      'input[type="email"], input[type="password"], input[type="text"]',
    );

    // Limpar valores dos inputs
    inputs.forEach((input) => {
      input.value = "";
      input.setAttribute("autocomplete", "off");
      input.setAttribute("data-form-type", "other");
    });

    // Limpar dados guardados específicos
    const credentialKeys = [
      "email",
      "password",
      "username",
      "user",
      "login",
      "savedCredentials",
      "userCredentials",
      "loginData",
      "leirisonda_user",
      "leirisonda_login",
      "leirisonda_credentials",
    ];

    credentialKeys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    // Forçar reload da página para limpar cache de formulários
    setTimeout(() => {
      window.location.reload();
    }, 100);

    console.log("✅ Credenciais limpas");
  } catch (error) {
    console.error("❌ Erro ao limpar credenciais:", error);
  }
};

// Auto-executar limpeza se URL tiver parâmetro específico
if (
  window.location.search.includes("clear=credentials") ||
  window.location.hash.includes("clear")
) {
  console.log(
    "🔐 URL indica limpeza de credenciais - executando automaticamente",
  );
  setTimeout(clearSavedCredentials, 1000);
}

// Prevenir auto-preenchimento automático
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    // Adicionar atributos para prevenir auto-complete
    const inputs = document.querySelectorAll(
      'input[type="email"], input[type="password"]',
    );
    inputs.forEach((input) => {
      input.setAttribute("autocomplete", "new-password");
      input.setAttribute("data-lpignore", "true");
      input.setAttribute("data-form-type", "other");
    });
  }, 500);
});
