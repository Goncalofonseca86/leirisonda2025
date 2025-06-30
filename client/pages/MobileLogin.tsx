import React from "react";

export function MobileLogin() {
  React.useEffect(() => {
    // Auto-login para mobile
    console.log("📱 Auto-login para mobile iniciando...");

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

    // Limpar dados antigos
    localStorage.clear();
    sessionStorage.clear();

    // Salvar user
    localStorage.setItem("leirisonda_user", JSON.stringify(user));

    // Aguardar e redirecionar
    setTimeout(() => {
      window.location.href = "/dashboard-simple";
    }, 2000);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #16a34a, #0891b2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "40px 30px",
          maxWidth: "350px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        <div
          style={{
            fontSize: "60px",
            marginBottom: "20px",
          }}
        >
          📱
        </div>

        <h1
          style={{
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "10px",
            color: "#1f2937",
          }}
        >
          Login Automático iPhone
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "30px",
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        >
          A fazer login automaticamente como Gonçalo...
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #e5e7eb",
              borderTop: "4px solid #16a34a",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>

        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              marginBottom: "10px",
            }}
          >
            ✅
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#166534",
              fontWeight: "600",
            }}
          >
            Sistema otimizado para iPhone
            <br />
            Redirecionamento em 2 segundos
          </p>
        </div>

        <p
          style={{
            fontSize: "12px",
            color: "#9ca3af",
            margin: 0,
          }}
        >
          Se não redirecionar, há um problema mais profundo
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
