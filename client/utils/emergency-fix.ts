// Emergency fix for duplicate data and black screen errors
export function emergencyDataCleanup() {
  console.log("🚨 EMERGENCY CLEANUP INITIATED");

  // 1. Clear ALL localStorage data
  const allKeys = Object.keys(localStorage);
  allKeys.forEach((key) => {
    if (
      key.includes("work") ||
      key.includes("maintenance") ||
      key.includes("pool") ||
      key.includes("user")
    ) {
      console.log(`🗑️ Clearing: ${key}`);
      localStorage.removeItem(key);
    }
  });

  // 2. Clear sessionStorage
  sessionStorage.clear();

  // 3. Create fresh minimal user data
  const freshUser = {
    id: "emergency_user_goncalo",
    email: "gongonsilva@gmail.com",
    name: "Gonçalo Fonseca Silva",
    role: "admin",
    createdAt: new Date().toISOString(),
    permissions: {
      canViewWorks: true,
      canCreateWorks: true,
      canEditWorks: true,
      canDeleteWorks: true,
      canViewUsers: true,
      canCreateUsers: true,
      canEditUsers: true,
      canDeleteUsers: true,
      canViewReports: true,
      canExportData: true,
      canViewDashboard: true,
      canViewStats: true,
      canManageSystem: true,
      canManageNotifications: true,
      canViewMaintenance: true,
      canCreateMaintenance: true,
    },
  };

  // 4. Create fresh empty data arrays
  const freshWorks: any[] = [];
  const freshMaintenances: any[] = [];

  // 5. Store only clean data
  localStorage.setItem("leirisonda_user", JSON.stringify(freshUser));
  localStorage.setItem("leirisonda_works", JSON.stringify(freshWorks));
  localStorage.setItem(
    "leirisonda_pool_maintenances",
    JSON.stringify(freshMaintenances),
  );

  console.log("✅ Emergency cleanup completed");

  return {
    user: freshUser,
    works: freshWorks,
    maintenances: freshMaintenances,
  };
}

// Function to prevent black screen errors
export function safeNavigate(path: string) {
  try {
    // Clear any error states
    sessionStorage.removeItem("react_error");
    sessionStorage.removeItem("component_error");

    // Use window.location for guaranteed navigation
    window.location.href = path;
  } catch (error) {
    console.error("Navigation error:", error);
    window.location.href = "/dashboard";
  }
}

// Safe work detail loader
export function safeLoadWork(workId: string, allWorks: any[]) {
  try {
    if (!workId || !allWorks || allWorks.length === 0) {
      return null;
    }

    const work = allWorks.find((w) => w && w.id === workId);

    if (!work) {
      return null;
    }

    // Return safe work object with all required properties
    return {
      id: work.id || workId,
      clientName: work.clientName || "Cliente não especificado",
      status: work.status || "pendente",
      type: work.type || "geral",
      description: work.description || "Sem descrição",
      createdAt: work.createdAt || new Date().toISOString(),
      workSheetNumber: work.workSheetNumber || work.id,
      address: work.address || "Endereço não especificado",
      phone: work.phone || "Telefone não especificado",
      // Include all original properties
      ...work,
    };
  } catch (error) {
    console.error("Error loading work safely:", error);
    return null;
  }
}
