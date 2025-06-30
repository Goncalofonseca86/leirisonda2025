import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Phone,
  User,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Clock,
  FileText,
} from "lucide-react";
import { Work } from "@shared/types";
import { Button } from "@/components/ui/button";
import { useFirebaseSync } from "@/hooks/use-firebase-sync";
import { useAuthFixed as useAuth } from "@/components/AuthProviderFixed";
import { safeLoadWork, safeNavigate } from "@/utils/emergency-fix";

export function WorkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [work, setWork] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Safe hooks with error handling
  let user: any = null;
  let works: any[] = [];
  let deleteWork: any = null;

  try {
    const authContext = useAuth();
    user = authContext?.user;
  } catch (authError) {
    console.warn("Auth error, using localStorage fallback");
    try {
      const storedUser = localStorage.getItem("leirisonda_user");
      if (storedUser) {
        user = JSON.parse(storedUser);
      }
    } catch (e) {
      console.error("Fallback auth failed:", e);
    }
  }

  try {
    const syncContext = useFirebaseSync();
    works = syncContext?.works || [];
    deleteWork = syncContext?.deleteWork;
  } catch (syncError) {
    console.warn("Sync error, using localStorage fallback");
    try {
      const storedWorks = localStorage.getItem("leirisonda_works");
      if (storedWorks) {
        works = JSON.parse(storedWorks);
      }
    } catch (e) {
      console.error("Fallback sync failed:", e);
      works = [];
    }
  }

  useEffect(() => {
    loadWork();
  }, [id, works]);

  const loadWork = () => {
    try {
      console.log("🔍 Loading work ID:", id);
      setError(null);
      setLoading(true);

      if (!id) {
        setError("ID da obra não fornecido");
        setWork(null);
        setLoading(false);
        return;
      }

      // Use safe loader
      const safeWork = safeLoadWork(id, works);

      if (safeWork) {
        console.log("✅ Work loaded successfully:", safeWork.clientName);
        setWork(safeWork);
      } else {
        console.log("❌ Work not found");
        setError(`Obra com ID ${id} não foi encontrada`);
        setWork(null);
      }
    } catch (error) {
      console.error("❌ Error loading work:", error);
      setError(
        `Erro ao carregar obra: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      );
      setWork(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!work) {
      alert("Erro: Obra não encontrada");
      return;
    }

    try {
      console.log(`🗑️ Deleting work: ${work.clientName}`);

      if (deleteWork) {
        await deleteWork(work.id);
      } else {
        // Fallback deletion
        const currentWorks = JSON.parse(
          localStorage.getItem("leirisonda_works") || "[]",
        );
        const filteredWorks = currentWorks.filter((w: any) => w.id !== work.id);
        localStorage.setItem("leirisonda_works", JSON.stringify(filteredWorks));
      }

      alert(`Obra "${work.clientName}" eliminada com sucesso!`);
      safeNavigate("/works");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Erro ao eliminar obra. Tente novamente.");
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pendente":
        return {
          label: "Pendente",
          color: "text-red-600",
          bg: "bg-red-100",
          icon: AlertTriangle,
        };
      case "em_progresso":
        return {
          label: "Em Progresso",
          color: "text-orange-600",
          bg: "bg-orange-100",
          icon: Clock,
        };
      case "concluida":
        return {
          label: "Concluída",
          color: "text-green-600",
          bg: "bg-green-100",
          icon: CheckCircle,
        };
      default:
        return {
          label: status,
          color: "text-gray-600",
          bg: "bg-gray-100",
          icon: AlertTriangle,
        };
    }
  };

  const getWorkTypeLabel = (type: string) => {
    switch (type) {
      case "piscina":
        return "Piscina";
      case "manutencao":
        return "Manutenção";
      case "avaria":
        return "Avaria";
      case "montagem":
        return "Montagem";
      case "furo_agua":
        return "Furo de Água";
      default:
        return type || "Geral";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Carregando obra...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Erro ao carregar obra
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="space-x-4">
          <Button
            onClick={() => {
              console.log("🔄 Retrying work load...");
              setError(null);
              setLoading(true);
              setTimeout(loadWork, 100);
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
          <Button variant="outline" onClick={() => safeNavigate("/works")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Lista
          </Button>
        </div>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Obra não encontrada
        </h3>
        <p className="text-gray-600 mb-4">
          A obra que procura não existe ou foi removida.
        </p>
        <Button onClick={() => safeNavigate("/works")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar à Lista
        </Button>
      </div>
    );
  }

  const statusInfo = getStatusInfo(work.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => safeNavigate("/works")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {work.clientName}
              </h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color}`}
              >
                <StatusIcon className="w-4 h-4 mr-1" />
                {statusInfo.label}
              </span>
            </div>
            <p className="text-gray-600">
              {work.workSheetNumber} • {getWorkTypeLabel(work.type)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button onClick={() => safeNavigate(`/edit-work/${work.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Obra
          </Button>

          {user?.permissions?.canDeleteWorks && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          )}
        </div>
      </div>

      {/* Work Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Client Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informações do Cliente
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Cliente</p>
                <p className="font-medium text-gray-900">{work.clientName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Morada</p>
                <p className="font-medium text-gray-900">{work.address}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Telefone</p>
                <p className="font-medium text-gray-900">{work.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Data de Criação</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(work.createdAt), "dd/MM/yyyy", {
                    locale: pt,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Descrição
          </h3>
          <p className="text-gray-700 leading-relaxed">{work.description}</p>
        </div>
      </div>
    </div>
  );
}
