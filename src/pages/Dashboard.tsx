import React from "react";
import {
  BarChart3,
  Users,
  Wrench,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { works, maintenances } = useData();
  const { user } = useAuth();

  const stats = {
    totalWorks: works.length,
    completedWorks: works.filter((w) => w.status === "concluida").length,
    pendingWorks: works.filter((w) => w.status === "pendente").length,
    inProgressWorks: works.filter((w) => w.status === "em_progresso").length,
    totalMaintenances: maintenances.length,
    scheduledMaintenances: maintenances.filter((m) => m.status === "agendada")
      .length,
    completedMaintenances: maintenances.filter((m) => m.status === "concluida")
      .length,
  };

  const recentWorks = works
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const upcomingMaintenances = maintenances
    .filter((m) => m.status === "agendada")
    .sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime(),
    )
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluida":
        return "text-green-600 bg-green-50 border-green-200";
      case "em_progresso":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "pendente":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "agendada":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "concluida":
        return "Concluída";
      case "em_progresso":
        return "Em Progresso";
      case "pendente":
        return "Pendente";
      case "agendada":
        return "Agendada";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Bem-vindo, {user?.name}! Aqui está um resumo da sua atividade.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Obras</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalWorks}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Obras Concluídas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedWorks}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Progresso</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.inProgressWorks}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Manutenções</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalMaintenances}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wrench size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Works */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Obras Recentes
            </h3>
          </div>
          <div className="card-body">
            {recentWorks.length > 0 ? (
              <div className="space-y-4">
                {recentWorks.map((work) => (
                  <div
                    key={work.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{work.title}</p>
                      <p className="text-sm text-gray-600">{work.clientName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(work.createdAt).toLocaleDateString("pt-PT")}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded border ${getStatusColor(work.status)}`}
                    >
                      {formatStatus(work.status)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Nenhuma obra registada</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Maintenances */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Próximas Manutenções
            </h3>
          </div>
          <div className="card-body">
            {upcomingMaintenances.length > 0 ? (
              <div className="space-y-4">
                {upcomingMaintenances.map((maintenance) => (
                  <div
                    key={maintenance.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {maintenance.title}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {maintenance.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(maintenance.scheduledDate).toLocaleDateString(
                          "pt-PT",
                        )}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded border ${getStatusColor(maintenance.status)}`}
                    >
                      {formatStatus(maintenance.status)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Wrench size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Nenhuma manutenção agendada</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">
            Estatísticas Rápidas
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.pendingWorks}
              </div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.inProgressWorks}
              </div>
              <div className="text-sm text-gray-600">Em Progresso</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.completedWorks}
              </div>
              <div className="text-sm text-gray-600">Concluídas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.scheduledMaintenances}
              </div>
              <div className="text-sm text-gray-600">Manutenções</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
