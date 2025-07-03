import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { Work } from "../types";

export default function WorksList() {
  const { works, deleteWork } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredWorks = works.filter((work) => {
    const matchesSearch =
      work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      work.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      work.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || work.status === statusFilter;
    const matchesType = typeFilter === "all" || work.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluida":
        return "text-green-600 bg-green-50 border-green-200";
      case "em_progresso":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "pendente":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "piscina":
        return "text-blue-600 bg-blue-50";
      case "manutencao":
        return "text-purple-600 bg-purple-50";
      case "furo_agua":
        return "text-cyan-600 bg-cyan-50";
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
      case "pendente":
        return "Pendente";
      default:
        return status;
    }
  };

  const formatType = (type: string) => {
    switch (type) {
      case "piscina":
        return "Piscina";
      case "manutencao":
        return "Manutenção";
      case "furo_agua":
        return "Furo de Água";
      default:
        return type;
    }
  };

  const handleDelete = (work: Work) => {
    if (
      window.confirm(`Tem a certeza que quer eliminar a obra "${work.title}"?`)
    ) {
      deleteWork(work.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Obras</h1>
          <p className="text-gray-600">
            Gerir todas as obras registadas no sistema
          </p>
        </div>

        {user?.permissions.canCreateWorks && (
          <Link to="/works/new" className="btn btn-primary">
            <Plus size={18} />
            Nova Obra
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
                placeholder="Pesquisar obras..."
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
              <option value="pendente">Pendente</option>
              <option value="em_progresso">Em Progresso</option>
              <option value="concluida">Concluída</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">Todos os tipos</option>
              <option value="piscina">Piscina</option>
              <option value="manutencao">Manutenção</option>
              <option value="furo_agua">Furo de Água</option>
            </select>
          </div>
        </div>
      </div>

      {/* Works List */}
      {filteredWorks.length > 0 ? (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Obra
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWorks.map((work) => (
                  <tr key={work.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {work.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {work.address}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {work.clientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {work.clientEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(work.type)}`}
                      >
                        {formatType(work.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded border ${getStatusColor(work.status)}`}
                      >
                        {formatStatus(work.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(work.createdAt).toLocaleDateString("pt-PT")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/works/${work.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalhes"
                        >
                          <Eye size={16} />
                        </Link>

                        {user?.permissions.canEditWorks && (
                          <Link
                            to={`/works/${work.id}/edit`}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </Link>
                        )}

                        {user?.permissions.canDeleteWorks && (
                          <button
                            onClick={() => handleDelete(work)}
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
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma obra encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              {works.length === 0
                ? "Ainda não foram registadas obras no sistema."
                : "Tente ajustar os filtros de pesquisa."}
            </p>
            {user?.permissions.canCreateWorks && works.length === 0 && (
              <Link to="/works/new" className="btn btn-primary">
                <Plus size={18} />
                Criar Primeira Obra
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
