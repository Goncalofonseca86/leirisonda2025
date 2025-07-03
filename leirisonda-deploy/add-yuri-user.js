// ADICIONAR USUÁRIO YURI FERREIRA COM MESMAS CARACTERÍSTICAS DO ALEXANDRE
console.log("👤 Adicionando usuário Yuri Ferreira...");

(function () {
  "use strict";

  function addYuriUser() {
    try {
      console.log("🔧 Criando usuário Yuri Ferreira...");

      // Dados do novo usuário Yuri Ferreira (mesmas permissões que Alexandre)
      const yuriUserData = {
        id: "user_yuri",
        email: "yrzamr01@gmail.com",
        name: "Yuri Ferreira",
        role: "user",
        password: "070107",
        permissions: {
          canViewWorks: true,
          canCreateWorks: false,
          canEditWorks: true,
          canDeleteWorks: false,
          canViewMaintenance: true,
          canCreateMaintenance: false,
          canEditMaintenance: true,
          canDeleteMaintenance: false,
          canViewUsers: false,
          canCreateUsers: false,
          canEditUsers: false,
          canDeleteUsers: false,
          canViewReports: true,
          canExportData: false,
          canViewDashboard: true,
          canViewStats: true,
        },
      };

      // Adicionar ao localStorage como um usuário válido
      localStorage.setItem(
        `user_${yuriUserData.id}`,
        JSON.stringify(yuriUserData),
      );
      localStorage.setItem(
        `password_${yuriUserData.email}`,
        yuriUserData.password,
      );
      localStorage.setItem(
        `password_${yuriUserData.id}`,
        yuriUserData.password,
      );

      // Criar entrada no sistema de users
      const existingUsers = JSON.parse(
        localStorage.getItem("system_users") || "{}",
      );
      existingUsers[yuriUserData.email] = yuriUserData;
      localStorage.setItem("system_users", JSON.stringify(existingUsers));

      // Adicionar às credenciais válidas
      const validCredentials = JSON.parse(
        localStorage.getItem("valid_credentials") || "{}",
      );
      validCredentials[yuriUserData.email] = yuriUserData.password;
      localStorage.setItem(
        "valid_credentials",
        JSON.stringify(validCredentials),
      );

      console.log("✅ Usuário Yuri Ferreira criado com sucesso!");
      console.log("📧 Email:", yuriUserData.email);
      console.log("🔐 Password:", yuriUserData.password);
      console.log("👤 Nome:", yuriUserData.name);
      console.log("🎭 Role:", yuriUserData.role);

      // Verificar se há sistema de autenticação global e adicionar lá também
      if (window.hr && window.hr.auth) {
        try {
          // Tentar adicionar ao sistema de auth se disponível
          const authUsers = window.hr.auth.users || {};
          authUsers[yuriUserData.email] = yuriUserData;
          window.hr.auth.users = authUsers;
          console.log(
            "🔐 Usuário adicionado ao sistema de autenticação global",
          );
        } catch (e) {
          console.log("⚠️ Sistema de auth global não disponível");
        }
      }

      // Adicionar ao Firebase se disponível
      if (window.hr && window.hr.firestore) {
        try {
          window.hr.firestore
            .collection("users")
            .doc(yuriUserData.id)
            .set(yuriUserData)
            .then(() => {
              console.log("☁️ Usuário sincronizado com Firebase");
            })
            .catch(() => {
              console.log("⚠️ Firebase não disponível para sync");
            });
        } catch (e) {
          console.log("⚠️ Firebase não disponível");
        }
      }

      // Tentar injetar no código da aplicação se possível
      if (typeof window !== "undefined") {
        // Procurar pela função/objeto de usuários globais
        setTimeout(() => {
          try {
            // Se existe um objeto global de usuários, adicionar lá
            if (window.systemUsers) {
              window.systemUsers[yuriUserData.email] = yuriUserData;
              console.log("🌐 Usuário adicionado ao sistema global");
            }

            // Forçar recarregamento dos usuários se há uma função para isso
            if (
              window.reloadUsers &&
              typeof window.reloadUsers === "function"
            ) {
              window.reloadUsers();
              console.log("🔄 Sistema de usuários recarregado");
            }
          } catch (e) {
            console.log("⚠️ Não foi possível adicionar ao sistema global");
          }
        }, 1000);
      }

      // Criar função global para verificar o usuário
      window.checkYuriUser = function () {
        const userData = localStorage.getItem(`user_user_yuri`);
        const password = localStorage.getItem(`password_yrzamr01@gmail.com`);

        console.log("📊 Status do usuário Yuri:");
        console.log("💾 Dados salvos:", !!userData);
        console.log("🔐 Password salva:", !!password);

        if (userData) {
          const user = JSON.parse(userData);
          console.log("👤 Nome:", user.name);
          console.log("📧 Email:", user.email);
          console.log("🎭 Role:", user.role);
          console.log("✅ Permissões:", user.permissions);
        }

        return {
          exists: !!userData,
          data: userData ? JSON.parse(userData) : null,
          password: password,
        };
      };

      // Mostrar resumo final
      setTimeout(() => {
        alert(`✅ Usuário criado com sucesso!

👤 Nome: Yuri Ferreira
📧 Email: yrzamr01@gmail.com  
🔐 Password: 070107
🎭 Role: User (mesmas permissões que Alexandre)

O usuário pode agora fazer login no sistema.`);
      }, 500);
    } catch (error) {
      console.error("❌ Erro ao criar usuário:", error);
      alert("❌ Erro ao criar usuário: " + error.message);
    }
  }

  // Função para remover o usuário se necessário
  window.removeYuriUser = function () {
    if (
      confirm(
        "🗑️ Remover usuário Yuri Ferreira?\n\nEsta ação não pode ser desfeita.",
      )
    ) {
      localStorage.removeItem("user_user_yuri");
      localStorage.removeItem("password_yrzamr01@gmail.com");
      localStorage.removeItem("password_user_yuri");

      // Remover do sistema de users
      const existingUsers = JSON.parse(
        localStorage.getItem("system_users") || "{}",
      );
      delete existingUsers["yrzamr01@gmail.com"];
      localStorage.setItem("system_users", JSON.stringify(existingUsers));

      console.log("🗑️ Usuário Yuri Ferreira removido");
      alert("✅ Usuário removido com sucesso!");
    }
  };

  // Executar criação do usuário
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addYuriUser);
  } else {
    addYuriUser();
  }

  console.log("✅ Script de criação do usuário Yuri carregado");
})();
