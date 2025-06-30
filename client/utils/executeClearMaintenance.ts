import { clearAllMaintenanceData } from "./clearMaintenanceData";

/**
 * Executa a limpeza imediatamente
 */
export function executeClearMaintenanceNow() {
  console.log(
    "🚀 EXECUTANDO LIMPEZA IMEDIATA DE TODAS AS PISCINAS E MANUTENÇÕES",
  );

  const result = clearAllMaintenanceData();

  if (result.success) {
    console.log(`✅ SUCESSO: ${result.message}`);
    console.log("📊 Detalhes da limpeza:", result.details);

    // Força reload da página para garantir que dados são atualizados
    setTimeout(() => {
      console.log("🔄 Recarregando página para atualizar dados...");
      window.location.reload();
    }, 1000);

    return true;
  } else {
    console.error(`❌ ERRO: ${result.message}`);
    console.error("🔍 Detalhes do erro:", result.details);
    return false;
  }
}

// Expor globalmente para debug/teste
(window as any).clearAllPools = executeClearMaintenanceNow;

// Utilitário de limpeza manual - não executa automaticamente
if (typeof window !== "undefined") {
  console.log(
    "🔧 Utilitário de limpeza carregado. Digite 'clearAllPools()' no console para executar.",
  );

  // Sistema de limpeza desabilitado para não interferir com a aplicação
  // Para usar: clearAllPools() no console do navegador
}
