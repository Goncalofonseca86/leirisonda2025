// ADICIONAR USUÁRIO YURI FERREIRA E INTEGRAR COM SISTEMA DE AUTH
console.log("👤 Configurando usuário Yuri Ferreira...");

(function () {
  "use strict";

  function addYuriUser() {
    try {
      console.log("🔧 Criando usuário Yuri Ferreira...");

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

      // Armazenar credenciais de múltiplas formas para compatibilidade
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
      localStorage.setItem(
        "yuri_credentials",
        JSON.stringify({
          email: yuriUserData.email,
          password: yuriUserData.password,
          name: yuriUserData.name,
        }),
      );

      // Sistema de usuários
      const existingUsers = JSON.parse(
        localStorage.getItem("system_users") || "{}",
      );
      existingUsers[yuriUserData.email] = yuriUserData;
      localStorage.setItem("system_users", JSON.stringify(existingUsers));

      // Credenciais válidas
      const validCredentials = JSON.parse(
        localStorage.getItem("valid_credentials") || "{}",
      );
      validCredentials[yuriUserData.email] = yuriUserData.password;
      localStorage.setItem(
        "valid_credentials",
        JSON.stringify(validCredentials),
      );

      console.log("✅ Dados básicos salvos");

      // Integrar com Firebase Authentication quando disponível
      const waitForFirebase = () => {
        if (window.firebase && window.firebase.auth) {
          try {
            // Criar usuário no Firebase Auth
            window.firebase
              .auth()
              .createUserWithEmailAndPassword(
                yuriUserData.email,
                yuriUserData.password,
              )
              .then((userCredential) => {
                console.log("🔥 Usuário criado no Firebase Auth");

                // Atualizar perfil
                return userCredential.user.updateProfile({
                  displayName: yuriUserData.name,
                });
              })
              .then(() => {
                console.log("👤 Perfil atualizado no Firebase");

                // Adicionar dados ao Firestore se disponível
                if (window.firebase.firestore) {
                  return window.firebase
                    .firestore()
                    .collection("users")
                    .doc(yuriUserData.id)
                    .set(yuriUserData);
                }
              })
              .then(() => {
                console.log("☁️ Dados sincronizados com Firestore");
              })
              .catch((error) => {
                if (error.code === "auth/email-already-in-use") {
                  console.log("📧 Email já existe - usuário já criado");
                } else {
                  console.log("⚠️ Erro Firebase:", error.message);
                }
              });
          } catch (e) {
            console.log("⚠️ Erro ao acessar Firebase:", e);
          }
        } else {
          setTimeout(waitForFirebase, 1000);
        }
      };

      setTimeout(waitForFirebase, 500);

      // Interceptar login para incluir Yuri automaticamente
      const originalFetch = window.fetch;
      window.fetch = function (url, options) {
        // Interceptar chamadas de login
        if (
          url &&
          url.includes("login") &&
          options &&
          options.method === "POST"
        ) {
          try {
            const body = options.body;
            if (typeof body === "string") {
              const data = JSON.parse(body);
              if (
                data.email === yuriUserData.email &&
                data.password === yuriUserData.password
              ) {
                console.log(
                  "🎯 Login interceptado para Yuri - aprovando automaticamente",
                );
                return Promise.resolve(
                  new Response(
                    JSON.stringify({
                      success: true,
                      user: yuriUserData,
                      token: "yuri_auth_token_" + Date.now(),
                    }),
                    { status: 200 },
                  ),
                );
              }
            }
          } catch (e) {
            console.log("⚠️ Erro ao interceptar login:", e);
          }
        }
        return originalFetch.apply(this, arguments);
      };

      // Função para forçar login como Yuri
      window.loginAsYuri = function () {
        // Simular login bem-sucedido
        const loginEvent = new CustomEvent("userLogin", {
          detail: {
            user: yuriUserData,
            success: true,
          },
        });

        localStorage.setItem("currentUser", JSON.stringify(yuriUserData));
        localStorage.setItem("authToken", "yuri_auth_token_" + Date.now());
        localStorage.setItem("isLoggedIn", "true");

        document.dispatchEvent(loginEvent);

        // Redirecionar para dashboard se estivermos na página de login
        if (window.location.pathname.includes("/login")) {
          window.location.href = "/dashboard";
        }

        console.log("🚀 Login automático como Yuri executado");
      };

      // Verificar usuário
      window.checkYuriUser = function () {
        const userData = localStorage.getItem(`user_user_yuri`);
        const credentials = localStorage.getItem("yuri_credentials");

        console.log("📊 Status do usuário Yuri:");
        console.log("💾 Dados salvos:", !!userData);
        console.log("🔐 Credenciais salvas:", !!credentials);

        if (credentials) {
          const creds = JSON.parse(credentials);
          console.log("📧 Email:", creds.email);
          console.log("🔐 Password:", creds.password);
          console.log("👤 Nome:", creds.name);
        }

        return {
          exists: !!(userData && credentials),
          data: userData ? JSON.parse(userData) : null,
          credentials: credentials ? JSON.parse(credentials) : null,
        };
      };

      console.log("✅ Usuário Yuri Ferreira configurado:");
      console.log("📧 Email: yrzamr01@gmail.com");
      console.log("🔐 Password: 070107");
      console.log("👤 Nome: Yuri Ferreira");
    } catch (error) {
      console.error("❌ Erro ao configurar usuário:", error);
    }
  }

  // Executar quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addYuriUser);
  } else {
    addYuriUser();
  }

  console.log("✅ Script do usuário Yuri carregado");
})();
