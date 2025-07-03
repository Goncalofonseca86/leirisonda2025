import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Calendar,
  Wrench,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { Maintenance } from "../types";

export default function MaintenanceList() {
  const { maintenances, works, deleteMaintenance } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredMaintenances = maintenances.filter((maintenance) => {
    const work = works.find((w) => w.id === maintenance.workId);
    const matchesSearch =
      maintenance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      work?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false ||
      work?.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false;

    const matchesStatus =
      statusFilter === "all" || maintenance.status === statusFilter;
    const matchesType = typeFilter === "all" || maintenance.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluida":
        return "text-green-600 bg-green-50 border-green-200";
      case "em_progresso":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "agendada":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "preventiva":
        return "text-blue-600 bg-blue-50";
      case "corretiva":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "concluida":
        return "Concluída";
      case "em_progresso":
        return "Em Progresso";
      case "agendada":
        return "Agendada";
      default:
        return status;
    }
  };

  const formatType = (type: string) => {
    switch (type) {
      case "preventiva":
        return "Preventiva";
      case "corretiva":
        return "Corretiva";
      default:
        return type;
    }
  };

  const handleDelete = (maintenance: Maintenance) => {
    if (
      window.confirm(
        `Tem a certeza que quer eliminar a manutenção "${maintenance.title}"?`,
      )
    ) {
      deleteMaintenance(maintenance.id);
    }
  };

  const getWorkTitle = (workId: string) => {
    const work = works.find((w) => w.id === workId);
    return work?.title || "Obra não encontrada";
  };

  const getWorkClient = (workId: string) => {
    const work = works.find((w) => w.id === workId);
    return work?.clientName || "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manutenções</h1>
          <p className="text-gray-600">
            Gerir todas as manutenções agendadas e realizadas
          </p>
        </div>

        {user?.permissions.canCreateMaintenance && (
          <Link to="/maintenance/new" className="btn btn-primary">
            <Plus size={18} />
            Nova Manutenção
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Pesquisar manutenções..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">Todos os estados</option>
              <option value="agendada">Agendada</option>
              <option value="em_progresso">Em Progresso</option>
              <option value="concluida">Concluída</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">Todos os tipos</option>
              <option value="preventiva">Preventiva</option>
              <option value="corretiva">Corretiva</option>
            </select>
          </div>
        </div>
      </div>

      {/* Maintenances List */}
      {filteredMaintenances.length > 0 ? (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manutenção
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Obra
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Agendada
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMaintenances.map((maintenance) => (
                  <tr key={maintenance.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {maintenance.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {maintenance.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getWorkTitle(maintenance.workId)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getWorkClient(maintenance.workId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(maintenance.type)}`}
                      >
                        {formatType(maintenance.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getStatusColor(maintenance.status)}`}
                      >
                        {formatStatus(maintenance.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(maintenance.scheduledDate).toLocaleDateString(
                          "pt-PT",
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/maintenance/${maintenance.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalhes"
                        >
                          <Eye size={16} />
                        </Link>

                        {user?.permissions.canEditMaintenance && (
                          <Link
                            to={`/maintenance/${maintenance.id}/edit`}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </Link>
                        )}

                        {user?.permissions.canDeleteMaintenance && (
                          <button
                            onClick={() => handleDelete(maintenance)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma manutenção encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              {maintenances.length === 0
                ? "Ainda não foram agendadas manutenções no sistema."
                : "Tente ajustar os filtros de pesquisa."}
            </p>
            {user?.permissions.canCreateMaintenance &&
              maintenances.length === 0 && (
                <Link to="/maintenance/new" className="btn btn-primary">
                  <Plus size={18} />
                  Agendar Primeira Manutenção
                </Link>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
