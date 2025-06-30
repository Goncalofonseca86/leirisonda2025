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
      const found = maintenances.find((m) => m.id === maintenanceId);
      if (found) {
        setMaintenance(found);
      } else {
        const stored = localStorage.getItem("pool_maintenances");
        if (stored) {
          const localMaintenances: PoolMaintenance[] = JSON.parse(stored);
          const localFound = localMaintenances.find(
            (m) => m.id === maintenanceId,
          );
          if (localFound) {
            setMaintenance(localFound);
          } else {
            setError("Piscina não encontrada");
          }
        } else {
          setError("Piscina não encontrada");
        }
      }
    } catch (err) {
      setError("Erro ao carregar dados");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!maintenance) {
        throw new Error("Piscina não encontrada");
      }

      if (!formData.timeStart || !formData.timeEnd) {
        throw new Error("Hora de início e fim são obrigatórias");
      }

      const filteredTechnicians = formData.technicians.filter(
        (t) => t.trim() !== "",
      );
      const filteredVehicles = formData.vehicles.filter((v) => v.trim() !== "");

      if (filteredTechnicians.length === 0) {
        throw new Error("Pelo menos um técnico é obrigatório");
      }

      const newIntervention: MaintenanceIntervention = {
        id: crypto.randomUUID(),
        maintenanceId: maintenance.id,
        date: formData.date,
        timeStart: formData.timeStart,
        timeEnd: formData.timeEnd,
        technicians: filteredTechnicians,
        vehicles: filteredVehicles,
        waterValues: formData.waterValues,
        chemicalProducts: formData.chemicalProducts.filter(
          (p) => p.productName.trim() !== "",
        ),
        workPerformed: formData.workPerformed,
        problems: formData.problems.filter((p) => p.description.trim() !== ""),
        nextMaintenanceDate: formData.nextMaintenanceDate || undefined,
        photos: photos.map((photo) => ({
          id: photo.id,
          url: photo.url,
          filename: photo.filename,
          description: photo.description,
          uploadedAt: photo.uploadedAt,
        })),
        observations: formData.observations.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const currentInterventions = Array.isArray(maintenance.interventions)
        ? [...maintenance.interventions]
        : [];

      currentInterventions.push(newIntervention);

      const updatedMaintenance: PoolMaintenance = {
        ...maintenance,
        interventions: currentInterventions,
        lastMaintenanceDate: formData.date,
        updatedAt: new Date().toISOString(),
      };

      await updateMaintenance(maintenance.id, updatedMaintenance);
      console.log("✅ Intervenção guardada:", newIntervention.id);

      navigate(`/maintenance/${maintenance.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... rest of the component code remains the same
  // (all the handler functions and JSX)

  if (!maintenance) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">A carregar...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Your existing JSX here */}
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">Nova Intervenção</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form content */}
        <div className="flex gap-4 justify-end">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "A guardar..." : "Guardar Intervenção"}
          </Button>
        </div>
      </form>
    </div>
  );
}
