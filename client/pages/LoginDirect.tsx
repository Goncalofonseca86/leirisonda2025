import React from "react";

export function LoginDirect() {
  const forceLogin = () => {
    console.log("🚀 FORÇANDO LOGIN DIRETO...");

    // Limpar tudo primeiro
    localStorage.clear();
    sessionStorage.clear();

    // Criar usuário completo
    const user = {
      id: "admin_goncalo",
      email: "gongonsilva@gmail.com",
      name: "Gonçalo Fonseca",
      role: "admin",
      permissions: {
        canViewWorks: true,
        canCreateWorks: true,
        canEditWorks: true,
        canDeleteWorks: true,
        canViewMaintenance: true,
        canCreateMaintenance: true,
        canEditMaintenance: true,
        canDeleteMaintenance: true,
        canViewUsers: true,
        canCreateUsers: true,
        canEditUsers: true,
        canDeleteUsers: true,
        canViewReports: true,
        canExportData: true,
        canViewDashboard: true,
        canViewStats: true,
      },
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("leirisonda_user", JSON.stringify(user));
    console.log("✅ Usuário salvo:", user);

    // Forçar navegação
    console.log("🔄 Redirecionando...");
    window.location.href = "/dashboard-simple";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #2563eb, #0891b2)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#1f2937",
          }}
        >
          🔧 Login Direto
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "30px",
            fontSize: "16px",
          }}
        >
          Esta versão bypassa todos os problemas do AuthProvider
        </p>

        <div
          style={{
            background: "#f3f4f6",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "30px",
            textAlign: "left",
          }}
        >
          <p
            style={{
              margin: "0 0 10px 0",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            ✅ Vai fazer login como:
          </p>
          <p style={{ margin: "0", fontSize: "14px" }}>
            📧 Email: gongonsilva@gmail.com
            <br />
            👤 Nome: Gonçalo Fonseca
            <br />
            🔑 Papel: Admin
            <br />
            🎯 Destino: /dashboard-simple
          </p>
        </div>

        <button
          onClick={forceLogin}
          style={{
            width: "100%",
            height: "50px",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "18px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "15px",
          }}
        >
          🚀 ENTRAR AGORA
        </button>

        <p
          style={{
            fontSize: "12px",
            color: "#9ca3af",
            margin: 0,
          }}
        >
          Esta página ignora completamente o AuthProvider problemático
        </p>
      </div>
    </div>
  );
}
