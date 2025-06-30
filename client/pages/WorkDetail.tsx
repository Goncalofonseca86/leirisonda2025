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
  Car,
  Camera,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { Work } from "@shared/types";
import { Button } from "@/components/ui/button";
import { WorkReport } from "@/components/WorkReport";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useFirebaseSync } from "@/hooks/use-firebase-sync";
import { useAuthFixed as useAuth } from "@/components/AuthProviderFixed";

export function WorkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { works, deleteWork } = useFirebaseSync();
  const { user } = useAuth();
  const [work, setWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWork();
  }, [id, works]);

  const loadWork = () => {
    try {
      console.log("🔍 Carregando obra ID:", id);
      setError(null);

      if (!id) {
        setError("ID da obra não fornecido");
        setWork(null);
        setLoading(false);
        return;
      }

      // Use dados do Firebase sync em primeiro lugar
      console.log("📋 Obras disponíveis:", works.length);
      const foundWork = works.find((w) => w.id === id);

      if (foundWork) {
        console.log(
          "✅ Obra encontrada no Firebase sync:",
          foundWork.clientName,
        );
        setWork(foundWork);
      } else {
        console.log(
          "🔍 Obra não encontrada no sync, verificando localStorage...",
        );
        // Fallback para localStorage se não encontrar no Firebase
        const storedWorks = localStorage.getItem("leirisonda_works");
        if (storedWorks) {
          try {
            const localWorks: Work[] = JSON.parse(storedWorks);
            console.log("📋 Obras no localStorage:", localWorks.length);
            const localWork = localWorks.find((w) => w.id === id);
            if (localWork) {
              console.log(
                "✅ Obra encontrada no localStorage:",
                localWork.clientName,
              );
              setWork(localWork);
            } else {
              console.log("❌ Obra não encontrada em lugar nenhum");
              setError(`Obra com ID ${id} não foi encontrada`);
              setWork(null);
            }
          } catch (parseError) {
            console.error("❌ Erro ao fazer parse das obras:", parseError);
            setError("Erro ao carregar dados das obras");
            setWork(null);
          }
        } else {
          console.log("❌ Nenhuma obra encontrada no localStorage");
          setError("Nenhuma obra disponível");
          setWork(null);
        }
      }
    } catch (error) {
      console.error("❌ Erro geral ao carregar obra:", error);
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

    // Verificar permissões
    if (!user?.permissions.canDeleteWorks) {
      alert("Erro: Não tem permissão para eliminar obras");
      return;
    }

    console.log(`🗑️ ELIMINAÇÃO ULTRA ROBUSTA INICIADA: ${work.clientName}`);

    // Marcar operação para ErrorBoundary não forçar logout
    sessionStorage.setItem("deleting_work", "true");

    let eliminationSuccess = false;

    try {
      // ESTRATÉGIA SUPER ROBUSTA: Não usar Promise.race que pode causar problemas
      console.log("🔄 Chamando deleteWork sem timeout agressivo...");

      // Executar delete com tratamento robusto
      await deleteWork(work.id);

      eliminationSuccess = true;
      console.log("✅ DeleteWork retornou com sucesso");
    } catch (deleteError) {
      console.warn(
        "⚠️ Erro no deleteWork, verificando eliminação local...",
        deleteError,
      );

      // Verificar se obra foi eliminada localmente mesmo com erro
      const currentWorks = JSON.parse(localStorage.getItem("works") || "[]");
      const stillExists = currentWorks.find((w: any) => w.id === work.id);

      if (!stillExists) {
        console.log("✅ Obra foi eliminada localmente apesar do erro");
        eliminationSuccess = true;
      } else {
        console.log(
          "🔧 Obra ainda existe, tentando eliminação de emergência...",
        );

        // Eliminação de emergência
        try {
          const filteredWorks = currentWorks.filter(
            (w: any) => w.id !== work.id,
          );
          localStorage.setItem("works", JSON.stringify(filteredWorks));
          localStorage.setItem(
            "leirisonda_works",
            JSON.stringify(filteredWorks),
          );

          // Verificar novamente
          const recheckWorks = JSON.parse(
            localStorage.getItem("works") || "[]",
          );
          const recheckExists = recheckWorks.find((w: any) => w.id === work.id);

          if (!recheckExists) {
            console.log("✅ Eliminação de emergência bem sucedida");
            eliminationSuccess = true;
          }
        } catch (emergencyError) {
          console.error("❌ Eliminação de emergência falhou:", emergencyError);
        }
      }
    }

    // Processar resultado final
    setTimeout(() => {
      // Limpar flag de operação
      sessionStorage.removeItem("deleting_work");

      if (eliminationSuccess) {
        alert(`Obra "${work.clientName}" eliminada com sucesso!`);
        console.log("🎉 ELIMINAÇÃO COMPLETA COM SUCESSO");
      } else {
        alert("Erro ao eliminar obra. Por favor, verifique a lista de obras.");
        console.warn("⚠️ Eliminação não conseguiu ser confirmada");
      }

      // Navegação robusta SEMPRE (mesmo com erro, para utilizador verificar)
      try {
        navigate("/works", { replace: true });
      } catch (navError) {
        console.warn("⚠️ Erro na navegação, usando window.location:", navError);
        window.location.href = "/works";
      }
    }, 500);
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
        return type;
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
              console.log("🔄 Tentando recarregar obra...");
              setError(null);
              setLoading(true);
              setTimeout(loadWork, 100);
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
          <Button variant="outline" asChild>
            <Link to="/works">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Lista
            </Link>
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
          A obra que procura pode ter sido removida ou não existe.
        </p>
        <Button asChild>
          <Link to="/works">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Lista
          </Link>
        </Button>
      </div>
    );
  }

  // Safety checks for required fields to prevent crashes
  const safeWork = {
    ...work,
    clientName: work.clientName || "Cliente não especificado",
    workSheetNumber: (work as any).workSheetNumber || work.id,
    type: work.type || "geral",
    status: work.status || "pendente",
    address: (work as any).address || "Endereço não especificado",
    phone: (work as any).phone || "Telefone não especificado",
    description: work.description || "Sem descrição",
  };

  const statusInfo = getStatusInfo(safeWork.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/works">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {safeWork.clientName}
              </h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color}`}
              >
                <StatusIcon className="w-4 h-4 mr-1" />
                {statusInfo.label}
              </span>
            </div>
            <p className="text-gray-600">
              {safeWork.workSheetNumber} • {getWorkTypeLabel(safeWork.type)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <WorkReport work={work} />

          <Link to={`/edit-work/${work.id}`}>
            <Button className="btn-primary">
              <Edit className="mr-2 h-4 w-4" />
              Editar Obra
            </Button>
          </Link>

          {user?.permissions.canDeleteWorks && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Eliminação</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem a certeza que deseja apagar esta obra? Esta ação não
                    pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Apagar Obra
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Work Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações do Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Cliente</p>
                    <p className="font-medium text-gray-900">
                      {work.clientName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Contacto</p>
                    <p className="font-medium text-gray-900">{work.contact}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Morada</p>
                    <p className="font-medium text-gray-900">{work.address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Folha de Obra</p>
                    <p className="font-medium text-gray-900">
                      {work.workSheetNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Work Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Detalhes da Obra
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Hora de Entrada</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(work.entryTime), "dd/MM/yyyy HH:mm", {
                        locale: pt,
                      })}
                    </p>
                  </div>
                </div>
                {work.exitTime && (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Hora de Saída</p>
                      <p className="font-medium text-gray-900">
                        {format(new Date(work.exitTime), "dd/MM/yyyy HH:mm", {
                          locale: pt,
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Car className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Viaturas Utilizadas</p>
                    <p className="font-medium text-gray-900">
                      {work.vehicles.length > 0
                        ? work.vehicles.join(", ")
                        : "Não especificadas"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Técnicos</p>
                    <p className="font-medium text-gray-900">
                      {work.technicians.length > 0
                        ? work.technicians.join(", ")
                        : "Não atribuídos"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {work.observations && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Observa��ões</h4>
                <p className="text-gray-700">{work.observations}</p>
              </div>
            )}

            {work.workPerformed && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">
                  Trabalho Realizado
                </h4>
                <p className="text-gray-700">{work.workPerformed}</p>
              </div>
            )}
          </div>

          {/* Furo de Água Details - Show only when type is furo_agua */}
          {work.type === "furo_agua" && work.furoAgua && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detalhes do Furo de Água
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Profundidade</p>
                    <p className="font-medium text-gray-900">
                      {work.furoAgua.profundidade} metros
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nível da Água</p>
                    <p className="font-medium text-gray-900">
                      {work.furoAgua.nivelAgua} metros
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Profundidade da Bomba
                    </p>
                    <p className="font-medium text-gray-900">
                      {work.furoAgua.profundidadeBomba} metros
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Caudal do Furo</p>
                    <p className="font-medium text-gray-900">
                      {work.furoAgua.caudalFuro} m³
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tipo de Coluna</p>
                    <p className="font-medium text-gray-900">
                      {work.furoAgua.tipoColuna}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Diâmetro da Coluna</p>
                    <p className="font-medium text-gray-900">
                      {work.furoAgua.diametroColuna} mm
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Modelo da Bomba</p>
                    <p className="font-medium text-gray-900">
                      {work.furoAgua.bombaModelo || "Não especificado"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Potência do Motor</p>
                    <p className="font-medium text-gray-900">
                      {work.furoAgua.potenciaMotor} HP
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Voltagem da Bomba</p>
                    <p className="font-medium text-gray-900">
                      {work.furoAgua.voltagem}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Photos */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Fotografias ({work.photos.length})
              </h3>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/edit-work/${work.id}`}>
                  <Camera className="w-4 h-4 mr-2" />
                  Adicionar Fotos
                </Link>
              </Button>
            </div>

            {work.photos.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-3">
                  Ainda não foram adicionadas fotografias
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/edit-work/${work.id}`}>
                    Adicionar Primeira Foto
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {work.photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={photo.url}
                      alt={`Fotografia ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to={`/edit-work/${work.id}`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Obra
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link to={`/edit-work/${work.id}`}>
                  <Camera className="w-4 h-4 mr-2" />
                  Gerir Fotografias
                </Link>
              </Button>
            </div>
          </div>

          {/* Work Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cronologia
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Obra criada</p>
                  <p className="text-gray-600">
                    {format(new Date(work.createdAt), "dd/MM/yyyy HH:mm", {
                      locale: pt,
                    })}
                  </p>
                </div>
              </div>
              {work.updatedAt !== work.createdAt && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      Última atualização
                    </p>
                    <p className="text-gray-600">
                      {format(new Date(work.updatedAt), "dd/MM/yyyy HH:mm", {
                        locale: pt,
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
