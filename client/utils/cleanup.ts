// Utility to clean up duplicate data in localStorage
export function cleanupDuplicateData() {
  console.log("🧹 Limpando dados duplicados...");

  // Remove old/duplicate keys
  const keysToRemove = [
    "works", // Old key
    "pool_maintenances", // Old key
    "users", // If duplicated
    "messages", // If duplicated
  ];

  keysToRemove.forEach((key) => {
    if (localStorage.getItem(key)) {
      console.log(`🗑️ Removendo chave duplicada: ${key}`);
      localStorage.removeItem(key);
    }
  });

  // Keep only the main keys
  const validKeys = [
    "leirisonda_user",
    "leirisonda_works",
    "leirisonda_pool_maintenances",
    "leirisonda_users",
  ];

  console.log("✅ Dados limpos. Chaves válidas mantidas:", validKeys);
}

// Auto cleanup on import
if (typeof window !== "undefined") {
  cleanupDuplicateData();
}
