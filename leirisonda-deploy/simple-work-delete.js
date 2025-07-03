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
