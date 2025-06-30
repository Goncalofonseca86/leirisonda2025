import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Waves,
  Save,
  ArrowLeft,
  Clock,
  Users,
  Truck,
  Thermometer,
  Droplets,
  Plus,
  Minus,
  AlertTriangle,
  Camera,
  Wifi,
  WifiOff,
  AlertCircle,
} from "lucide-react";
import { PoolMaintenance, MaintenanceIntervention } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PoolPhotoUpload } from "@/components/PoolPhotoUpload";
import { useFirebaseSync } from "@/hooks/use-firebase-sync";

export function CreateIntervention() {
  const { maintenanceId } = useParams<{ maintenanceId: string }>();
  const navigate = useNavigate();
  const { updateMaintenance, maintenances, isOnline, isSyncing } =
    useFirebaseSync();
  const [maintenance, setMaintenance] = useState<PoolMaintenance | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    timeStart: format(new Date(), "HH:mm"),
    timeEnd: "",
    technicians: [""],
    vehicles: [""],
    waterValues: {
      ph: 0,
      salt: 0,
      orp: 0,
      temperature: 0,
      chlorine: 0,
      bromine: 0,
      alkalinity: 0,
      hardness: 0,
      stabilizer: 0,
    },
    chemicalProducts: [{ productName: "", quantity: 0, unit: "kg" }],
    workPerformed: {
      filtros: false,
      preFiltro: false,
      filtroAreiaVidro: false,
      enchimentoAutomatico: false,
      linhaAgua: false,
      limpezaFundo: false,
      limpezaParedes: false,
      limpezaSkimmers: false,
      verificacaoEquipamentos: false,
      outros: "",
    },
    problems: [{ description: "", severity: "low" as const, resolved: false }],
    nextMaintenanceDate: "",
    observations: "",
  });

  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    loadMaintenance();
    // Auto-generate end time (1 hour later)
    if (formData.timeStart) {
      const [hours, minutes] = formData.timeStart.split(":");
      const endTime = new Date();
      endTime.setHours(parseInt(hours) + 1, parseInt(minutes));
      setFormData((prev) => ({
        ...prev,
        timeEnd: format(endTime, "HH:mm"),
      }));
    }
  }, [maintenanceId, maintenances]);

  const loadMaintenance = () => {
    try {
      if (!maintenanceId) {
        setError("ID de manutenção não encontrado");
        return;
      }

      // Load from maintenances data
      const found = maintenances.find((m) => m.id === maintenanceId);
      if (found) {
        setMaintenance(found);
        console.log("✅ Maintenance loaded:", found.poolLocation);
        return;
      }

      // Try localStorage fallback
      const localMaintenances = localStorage.getItem("pool_maintenances");
      if (localMaintenances) {
        const parsed = JSON.parse(localMaintenances);
        const localFound = parsed.find((m: any) => m.id === maintenanceId);
        if (localFound) {
          setMaintenance(localFound);
          console.log(
            "✅ Maintenance loaded from localStorage:",
            localFound.poolLocation,
          );
          return;
        }
      }

      setError("Manutenção não encontrada");
    } catch (error) {
      console.error("Error loading maintenance:", error);
      setError("Erro ao carregar dados da manutenção");
    }
  };

  // Enhanced save with triple verification and backup system
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!maintenance) {
      setError("Dados da manutenção não disponíveis");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Create new intervention
      const newIntervention: MaintenanceIntervention = {
        id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: formData.date,
        timeStart: formData.timeStart,
        timeEnd: formData.timeEnd,
        technicians: formData.technicians.filter((t) => t.trim()),
        vehicles: formData.vehicles.filter((v) => v.trim()),
        waterValues: formData.waterValues,
        chemicalProducts: formData.chemicalProducts.filter((p) =>
          p.productName.trim(),
        ),
        workPerformed: formData.workPerformed,
        problems: formData.problems.filter((p) => p.description.trim()),
        nextMaintenanceDate: formData.nextMaintenanceDate,
        observations: formData.observations,
        photos: photos,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("🔄 Creating intervention:", newIntervention.id);

      // Update maintenance with new intervention
      const updatedMaintenance: PoolMaintenance = {
        ...maintenance,
        interventions: [...(maintenance.interventions || []), newIntervention],
        updatedAt: new Date().toISOString(),
      };

      console.log(
        "📝 Updating maintenance with intervention count:",
        updatedMaintenance.interventions.length,
      );

      // Triple backup save system
      const saveSuccess = await updateMaintenance(updatedMaintenance);

      if (saveSuccess) {
        // Additional backup saves to multiple keys
        try {
          localStorage.setItem(
            `maintenance_backup_${maintenance.id}`,
            JSON.stringify(updatedMaintenance),
          );
          localStorage.setItem(
            `intervention_backup_${newIntervention.id}`,
            JSON.stringify(newIntervention),
          );
          localStorage.setItem(
            `last_intervention_${Date.now()}`,
            JSON.stringify({
              maintenanceId: maintenance.id,
              intervention: newIntervention,
              timestamp: new Date().toISOString(),
            }),
          );
          console.log("✅ Triple backup saves completed");
        } catch (backupError) {
          console.warn("⚠️ Backup save failed:", backupError);
        }

        // Verify save was successful
        const verification = localStorage.getItem("pool_maintenances");
        if (verification) {
          const parsed = JSON.parse(verification);
          const verified = parsed.find((m: any) => m.id === maintenance.id);
          if (
            verified &&
            verified.interventions?.length ===
              updatedMaintenance.interventions.length
          ) {
            console.log("✅ Save verified successfully");

            // Force reload to ensure fresh data
            setTimeout(() => {
              window.location.reload();
            }, 100);

            navigate(`/maintenance/${maintenance.id}`);
            return;
          }
        }

        console.warn(
          "⚠️ Save verification failed, but attempting navigation anyway",
        );
        navigate(`/maintenance/${maintenance.id}`);
      } else {
        throw new Error("Failed to save intervention");
      }
    } catch (error) {
      console.error("❌ Error saving intervention:", error);
      setError("Erro ao guardar intervenção. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTechnician = () => {
    setFormData((prev) => ({
      ...prev,
      technicians: [...prev.technicians, ""],
    }));
  };

  const removeTechnician = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technicians: prev.technicians.filter((_, i) => i !== index),
    }));
  };

  const addVehicle = () => {
    setFormData((prev) => ({
      ...prev,
      vehicles: [...prev.vehicles, ""],
    }));
  };

  const removeVehicle = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter((_, i) => i !== index),
    }));
  };

  const addChemicalProduct = () => {
    setFormData((prev) => ({
      ...prev,
      chemicalProducts: [
        ...prev.chemicalProducts,
        { productName: "", quantity: 0, unit: "kg" },
      ],
    }));
  };

  const removeChemicalProduct = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      chemicalProducts: prev.chemicalProducts.filter((_, i) => i !== index),
    }));
  };

  const addProblem = () => {
    setFormData((prev) => ({
      ...prev,
      problems: [
        ...prev.problems,
        { description: "", severity: "low" as const, resolved: false },
      ],
    }));
  };

  const removeProblem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      problems: prev.problems.filter((_, i) => i !== index),
    }));
  };

  if (!maintenance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Manutenção não encontrada
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "A carregar dados da manutenção..."}
            </p>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="inline-flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => navigate(`/maintenance/${maintenance.id}`)}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar
            </Button>
            <div className="flex items-center space-x-2">
              <Waves className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Nova Intervenção
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isOnline ? (
              <div className="flex items-center text-green-600 text-sm">
                <Wifi className="w-4 h-4 mr-1" />
                Online
              </div>
            ) : (
              <div className="flex items-center text-amber-600 text-sm">
                <WifiOff className="w-4 h-4 mr-1" />
                Offline
              </div>
            )}
            {isSyncing && (
              <div className="flex items-center text-blue-600 text-sm">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                A sincronizar...
              </div>
            )}
          </div>
        </div>

        {/* Pool Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {maintenance.poolLocation}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Cliente:</span>{" "}
              {maintenance.clientName}
            </div>
            <div>
              <span className="font-medium">Tipo:</span> {maintenance.poolType}
            </div>
            <div>
              <span className="font-medium">Estado:</span> {maintenance.status}
            </div>
          </div>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Informações Básicas
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="timeStart">Hora de Início</Label>
                <Input
                  id="timeStart"
                  type="time"
                  value={formData.timeStart}
                  onChange={(e) => {
                    const newTimeStart = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      timeStart: newTimeStart,
                    }));

                    // Auto-calculate end time (1 hour later)
                    if (newTimeStart) {
                      const [hours, minutes] = newTimeStart.split(":");
                      const endTime = new Date();
                      endTime.setHours(parseInt(hours) + 1, parseInt(minutes));
                      setFormData((prev) => ({
                        ...prev,
                        timeEnd: format(endTime, "HH:mm"),
                      }));
                    }
                  }}
                  required
                />
              </div>

              <div>
                <Label htmlFor="timeEnd">Hora de Fim</Label>
                <Input
                  id="timeEnd"
                  type="time"
                  value={formData.timeEnd}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      timeEnd: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Technicians */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Técnicos
            </h3>

            <div className="space-y-3">
              {formData.technicians.map((technician, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={technician}
                    onChange={(e) => {
                      const newTechnicians = [...formData.technicians];
                      newTechnicians[index] = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        technicians: newTechnicians,
                      }));
                    }}
                    placeholder="Nome do técnico"
                    className="flex-1"
                  />
                  {formData.technicians.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTechnician(index)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTechnician}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Técnico
              </Button>
            </div>
          </div>

          {/* Vehicles */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-blue-600" />
              Viaturas
            </h3>

            <div className="space-y-3">
              {formData.vehicles.map((vehicle, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={vehicle}
                    onChange={(e) => {
                      const newVehicles = [...formData.vehicles];
                      newVehicles[index] = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        vehicles: newVehicles,
                      }));
                    }}
                    placeholder="Matrícula da viatura"
                    className="flex-1"
                  />
                  {formData.vehicles.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeVehicle(index)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVehicle}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Viatura
              </Button>
            </div>
          </div>

          {/* Water Values */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Droplets className="w-5 h-5 mr-2 text-blue-600" />
              Valores da Água
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="ph">pH</Label>
                <Input
                  id="ph"
                  type="number"
                  step="0.1"
                  value={formData.waterValues.ph || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      waterValues: {
                        ...prev.waterValues,
                        ph: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="salt">Sal (g/L)</Label>
                <Input
                  id="salt"
                  type="number"
                  step="0.1"
                  value={formData.waterValues.salt || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      waterValues: {
                        ...prev.waterValues,
                        salt: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="orp">ORP (mV)</Label>
                <Input
                  id="orp"
                  type="number"
                  value={formData.waterValues.orp || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      waterValues: {
                        ...prev.waterValues,
                        orp: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="temperature">Temperatura (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={formData.waterValues.temperature || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      waterValues: {
                        ...prev.waterValues,
                        temperature: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="chlorine">Cloro Livre (ppm)</Label>
                <Input
                  id="chlorine"
                  type="number"
                  step="0.1"
                  value={formData.waterValues.chlorine || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      waterValues: {
                        ...prev.waterValues,
                        chlorine: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="bromine">Bromo (ppm)</Label>
                <Input
                  id="bromine"
                  type="number"
                  step="0.1"
                  value={formData.waterValues.bromine || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      waterValues: {
                        ...prev.waterValues,
                        bromine: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="alkalinity">Alcalinidade (ppm)</Label>
                <Input
                  id="alkalinity"
                  type="number"
                  value={formData.waterValues.alkalinity || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      waterValues: {
                        ...prev.waterValues,
                        alkalinity: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="hardness">Dureza (ppm)</Label>
                <Input
                  id="hardness"
                  type="number"
                  value={formData.waterValues.hardness || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      waterValues: {
                        ...prev.waterValues,
                        hardness: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Chemical Products */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Produtos Químicos Aplicados
            </h3>

            <div className="space-y-3">
              {formData.chemicalProducts.map((product, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={product.productName}
                    onChange={(e) => {
                      const newProducts = [...formData.chemicalProducts];
                      newProducts[index].productName = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        chemicalProducts: newProducts,
                      }));
                    }}
                    placeholder="Nome do produto"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    step="0.1"
                    value={product.quantity || ""}
                    onChange={(e) => {
                      const newProducts = [...formData.chemicalProducts];
                      newProducts[index].quantity =
                        parseFloat(e.target.value) || 0;
                      setFormData((prev) => ({
                        ...prev,
                        chemicalProducts: newProducts,
                      }));
                    }}
                    placeholder="Quantidade"
                    className="w-32"
                  />
                  <Select
                    value={product.unit}
                    onValueChange={(value) => {
                      const newProducts = [...formData.chemicalProducts];
                      newProducts[index].unit = value;
                      setFormData((prev) => ({
                        ...prev,
                        chemicalProducts: newProducts,
                      }));
                    }}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="mL">mL</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.chemicalProducts.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeChemicalProduct(index)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addChemicalProduct}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Produto
              </Button>
            </div>
          </div>

          {/* Work Performed */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Trabalho Realizado
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries({
                filtros: "Limpeza de Filtros",
                preFiltro: "Limpeza de Pré-filtro",
                filtroAreiaVidro: "Filtro de Areia/Vidro",
                enchimentoAutomatico: "Enchimento Automático",
                linhaAgua: "Limpeza da Linha de Água",
                limpezaFundo: "Limpeza do Fundo",
                limpezaParedes: "Limpeza das Paredes",
                limpezaSkimmers: "Limpeza dos Skimmers",
                verificacaoEquipamentos: "Verificação de Equipamentos",
              }).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={
                      formData.workPerformed[
                        key as keyof typeof formData.workPerformed
                      ] as boolean
                    }
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({
                        ...prev,
                        workPerformed: {
                          ...prev.workPerformed,
                          [key]: checked,
                        },
                      }));
                    }}
                  />
                  <Label htmlFor={key} className="text-sm">
                    {label}
                  </Label>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Label htmlFor="outros">Outros trabalhos realizados</Label>
              <Textarea
                id="outros"
                value={formData.workPerformed.outros}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    workPerformed: {
                      ...prev.workPerformed,
                      outros: e.target.value,
                    },
                  }))
                }
                placeholder="Descreva outros trabalhos realizados..."
              />
            </div>
          </div>

          {/* Problems */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
              Problemas Identificados
            </h3>

            <div className="space-y-4">
              {formData.problems.map((problem, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex gap-2">
                    <Textarea
                      value={problem.description}
                      onChange={(e) => {
                        const newProblems = [...formData.problems];
                        newProblems[index].description = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          problems: newProblems,
                        }));
                      }}
                      placeholder="Descrição do problema"
                      className="flex-1"
                    />
                    {formData.problems.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeProblem(index)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <div>
                      <Label>Gravidade</Label>
                      <Select
                        value={problem.severity}
                        onValueChange={(value: "low" | "medium" | "high") => {
                          const newProblems = [...formData.problems];
                          newProblems[index].severity = value;
                          setFormData((prev) => ({
                            ...prev,
                            problems: newProblems,
                          }));
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`resolved-${index}`}
                        checked={problem.resolved}
                        onCheckedChange={(checked) => {
                          const newProblems = [...formData.problems];
                          newProblems[index].resolved = !!checked;
                          setFormData((prev) => ({
                            ...prev,
                            problems: newProblems,
                          }));
                        }}
                      />
                      <Label htmlFor={`resolved-${index}`}>Resolvido</Label>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProblem}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Problema
              </Button>
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Camera className="w-5 h-5 mr-2 text-blue-600" />
              Fotografias
            </h3>

            <PoolPhotoUpload
              photos={photos}
              onPhotosChange={setPhotos}
              maxPhotos={10}
            />
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informações Adicionais
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nextMaintenanceDate">Próxima Manutenção</Label>
                <Input
                  id="nextMaintenanceDate"
                  type="date"
                  value={formData.nextMaintenanceDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      nextMaintenanceDate: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  value={formData.observations}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      observations: e.target.value,
                    }))
                  }
                  placeholder="Observações gerais sobre a intervenção..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/maintenance/${maintenance.id}`)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  A guardar...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Intervenção
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
