import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Check,
  AlertCircle,
  Users,
  FileText,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useNotifications } from "@/hooks/use-notifications";
import { notificationService } from "@/services/NotificationService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function NotificationTest() {
  const { user } = useAuth();
  const { status, initializeNotifications, requestPermission } =
    useNotifications();
  const [isTestingNotifications, setIsTestingNotifications] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [pendingWorksCount, setPendingWorksCount] = useState<number>(0);

  // Verificar se é administrador
  if (!user || user.email !== "gongonsilva@gmail.com") {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Acesso restrito. Esta página é apenas para administradores.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Link to="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const addTestResult = (message: string) => {
    setTestResults((prev) => [
      `${new Date().toLocaleTimeString()}: ${message}`,
      ...prev,
    ]);
  };

  const testNotificationSystem = async () => {
    setIsTestingNotifications(true);
    setTestResults([]);

    try {
      addTestResult("🚀 Iniciando teste do sistema de notificações...");

      // 1. Verificar suporte
      addTestResult(
        `📱 Suporte: ${status.isSupported ? "✅ Suportado" : "❌ Não suportado"}`,
      );
      addTestResult(`🔔 Permissão: ${status.permission || "Não solicitada"}`);
      addTestResult(
        `🔧 Inicializado: ${status.isInitialized ? "✅ Sim" : "❌ Não"}`,
      );

      // 2. Inicializar se necessário
      if (!status.isInitialized) {
        addTestResult("🔧 Inicializando notificações...");
        const initSuccess = await initializeNotifications();
        addTestResult(
          `🔧 Resultado inicialização: ${initSuccess ? "✅ Sucesso" : "❌ Falhou"}`,
        );
      }

      // 3. Solicitar permissão se necessário
      if (status.permission !== "granted") {
        addTestResult("🔑 Solicitando permissão...");
        const permSuccess = await requestPermission();
        addTestResult(
          `🔑 Resultado permissão: ${permSuccess ? "✅ Concedida" : "❌ Negada"}`,
        );
      }

      // 4. Verificar obras atribuídas pendentes
      addTestResult("🔍 Verificando obras atribuídas pendentes...");
      const pendingCount = await notificationService.checkPendingAssignedWorks(
        user.id,
      );
      setPendingWorksCount(pendingCount);
      addTestResult(`📋 Obras pendentes encontradas: ${pendingCount}`);

      // 5. Teste de notificação manual
      addTestResult("📨 Enviando notificação de teste...");
      await notificationService.showLocalNotification({
        title: "🧪 Teste de Notificação",
        body: `Sistema funcionando para ${user.name}! Hora: ${new Date().toLocaleTimeString()}`,
        data: { type: "test" },
        icon: "/leirisonda-icon.svg",
      });
      addTestResult("✅ Notificação de teste enviada");

      // 6. Verificar dados locais
      const works = JSON.parse(localStorage.getItem("works") || "[]");
      const assignedWorks = works.filter(
        (work: any) =>
          work.assignedUsers && work.assignedUsers.includes(user.id),
      );
      addTestResult(`📊 Total de obras: ${works.length}`);
      addTestResult(`👤 Obras atribuídas a você: ${assignedWorks.length}`);

      // 7. Verificar outros usuários
      const allUsers = [
        { id: "admin_goncalo", name: "Gonçalo Fonseca" },
        { id: "user_alexandre", name: "Alexandre Fernandes" },
      ];

      for (const testUser of allUsers) {
        const userAssigned = works.filter(
          (work: any) =>
            work.assignedUsers && work.assignedUsers.includes(testUser.id),
        );
        addTestResult(
          `👤 ${testUser.name}: ${userAssigned.length} obras atribuídas`,
        );
      }

      addTestResult("🎉 Teste completo!");
    } catch (error) {
      console.error("❌ Erro no teste:", error);
      addTestResult(`❌ Erro: ${error.message || "Erro desconhecido"}`);
    } finally {
      setIsTestingNotifications(false);
    }
  };

  const testCrossDeviceNotification = async () => {
    try {
      addTestResult("🔄 Teste de notificação entre dispositivos...");

      // Simular criação de obra para outros usuários
      const testWork = {
        id: `test_work_${Date.now()}`,
        workSheetNumber: `TEST-${Date.now()}`,
        clientName: "Cliente Teste",
        type: "test",
        status: "pendente",
      };

      // Notificar Alexandre (para testar em outro dispositivo)
      await notificationService.notifyWorkAssigned(testWork, [
        "user_alexandre",
      ]);
      addTestResult("📨 Notificação enviada para Alexandre Fernandes");
      addTestResult(
        "📱 Alexandre deve ver notificação quando acessar o sistema",
      );
    } catch (error) {
      addTestResult(`❌ Erro no teste entre dispositivos: ${error.message}`);
    }
  };

  const clearNotificationCache = () => {
    try {
      // Limpar cache de notificações vistas
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith("notification_seen_"),
      );
      keys.forEach((key) => localStorage.removeItem(key));
      addTestResult(`🧹 Cache limpo: ${keys.length} notificações removidas`);
    } catch (error) {
      addTestResult(`❌ Erro ao limpar cache: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              🔔 Teste de Notificações
            </h1>
            <p className="text-gray-600">
              Diagnóstico completo do sistema de notificações
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Status Atual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Status do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Suportado:</span>
                <span
                  className={
                    status.isSupported ? "text-green-600" : "text-red-600"
                  }
                >
                  {status.isSupported ? "✅ Sim" : "❌ Não"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Permissão:</span>
                <span
                  className={
                    status.permission === "granted"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {status.permission || "Não solicitada"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Inicializado:</span>
                <span
                  className={
                    status.isInitialized ? "text-green-600" : "text-red-600"
                  }
                >
                  {status.isInitialized ? "✅ Sim" : "❌ Não"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Token FCM:</span>
                <span
                  className={
                    status.hasToken ? "text-green-600" : "text-yellow-600"
                  }
                >
                  {status.hasToken ? "✅ Sim" : "❌ Não"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Obras Pendentes:</span>
                <span className="font-semibold text-blue-600">
                  {pendingWorksCount}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Ações de Teste */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Ações de Teste
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={testNotificationSystem}
                disabled={isTestingNotifications}
                className="w-full"
              >
                {isTestingNotifications ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Bell className="w-4 h-4 mr-2" />
                )}
                Teste Completo
              </Button>

              <Button
                onClick={testCrossDeviceNotification}
                variant="outline"
                className="w-full"
              >
                <Users className="w-4 h-4 mr-2" />
                Teste Entre Dispositivos
              </Button>

              <Button
                onClick={clearNotificationCache}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Limpar Cache
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resultados do Teste */}
        {testResults.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                Resultados do Teste
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <div className="space-y-1 font-mono text-sm">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-gray-700">
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instruções */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📋 Instruções de Teste</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm">
            <ol className="space-y-2">
              <li>
                <strong>Teste Completo:</strong> Verifica todo o sistema de
                notificações localmente
              </li>
              <li>
                <strong>Teste Entre Dispositivos:</strong> Simula notificação
                para Alexandre
              </li>
              <li>
                <strong>Verificação Manual:</strong>
                <ul className="mt-1 ml-4">
                  <li>Crie uma obra e atribua ao Alexandre</li>
                  <li>Alexandre deve receber notificação quando fizer login</li>
                  <li>Verifique o console para logs detalhados</li>
                </ul>
              </li>
              <li>
                <strong>Limpar Cache:</strong> Remove notificações já vistas
                para re-testar
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
