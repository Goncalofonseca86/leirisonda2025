import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Droplets } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { WaterDrillingDetails } from "../types";

export default function NewWork() {
  const navigate = useNavigate();
  const { addWork } = useData();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    address: "",
    description: "",
    status: "pendente" as const,
  });

  const [waterDrillingDetails, setWaterDrillingDetails] =
    useState<WaterDrillingDetails>({});
  const [showWaterDrilling, setShowWaterDrilling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Show water drilling section when "furo_agua" is selected
    if (name === "type") {
      setShowWaterDrilling(value === "furo_agua");
    }
  };

  const handleWaterDrillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setWaterDrillingDetails((prev) => ({
      ...prev,
      [name]:
        name.includes("profundidade") ||
        name.includes("caudal") ||
        name.includes("potencia") ||
        name.includes("diametro")
          ? parseFloat(value) || undefined
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const workData = {
        ...formData,
        type: formData.type as "piscina" | "manutencao" | "furo_agua",
        createdBy: user?.id || "",
        waterDrillingDetails: showWaterDrilling
          ? waterDrillingDetails
          : undefined,
      };

      addWork(workData);

      // Show success message
      alert("✅ Obra criada com sucesso!");
      navigate("/works");
    } catch (error) {
      alert("❌ Erro ao criar obra. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/works")}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nova Obra</h1>
          <p className="text-gray-600">Registar uma nova obra no sistema</p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informações Básicas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    Título da Obra *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Ex: Construção de piscina"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="type" className="form-label">
                    Tipo de Trabalho *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Selecione o tipo...</option>
                    <option value="piscina">Piscina</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="furo_agua">Furo de Água</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status" className="form-label">
                    Estado
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_progresso">Em Progresso</option>
                    <option value="concluida">Concluída</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informações do Cliente
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="clientName" className="form-label">
                    Nome do Cliente *
                  </label>
                  <input
                    id="clientName"
                    name="clientName"
                    type="text"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="clientEmail" className="form-label">
                    Email
                  </label>
                  <input
                    id="clientEmail"
                    name="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="cliente@exemplo.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="clientPhone" className="form-label">
                    Telefone
                  </label>
                  <input
                    id="clientPhone"
                    name="clientPhone"
                    type="tel"
                    value={formData.clientPhone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+351 900 000 000"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address" className="form-label">
                    Morada *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Morada completa"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                rows={4}
                placeholder="Descrição detalhada da obra..."
              />
            </div>

            {/* Water Drilling Details */}
            {showWaterDrilling && (
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Droplets className="text-cyan-600" size={24} />
                  <h3 className="text-lg font-semibold text-cyan-900">
                    Detalhes do Furo de Água
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="form-group">
                    <label htmlFor="profundidadeTotal" className="form-label">
                      Profundidade Total (metros)
                    </label>
                    <input
                      id="profundidadeTotal"
                      name="profundidadeTotal"
                      type="number"
                      step="0.1"
                      value={waterDrillingDetails.profundidadeTotal || ""}
                      onChange={handleWaterDrillingChange}
                      className="form-input"
                      placeholder="Ex: 45.5"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="nivelAgua" className="form-label">
                      Nível da Água (metros)
                    </label>
                    <input
                      id="nivelAgua"
                      name="nivelAgua"
                      type="number"
                      step="0.1"
                      value={waterDrillingDetails.nivelAgua || ""}
                      onChange={handleWaterDrillingChange}
                      className="form-input"
                      placeholder="Ex: 12.3"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="profundidadeBomba" className="form-label">
                      Profundidade da Bomba (metros)
                    </label>
                    <input
                      id="profundidadeBomba"
                      name="profundidadeBomba"
                      type="number"
                      step="0.1"
                      value={waterDrillingDetails.profundidadeBomba || ""}
                      onChange={handleWaterDrillingChange}
                      className="form-input"
                      placeholder="Ex: 38.0"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="caudal" className="form-label">
                      Caudal do Furo (m³/h)
                    </label>
                    <input
                      id="caudal"
                      name="caudal"
                      type="number"
                      step="0.1"
                      value={waterDrillingDetails.caudal || ""}
                      onChange={handleWaterDrillingChange}
                      className="form-input"
                      placeholder="Ex: 2.5"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="tipoColuna" className="form-label">
                      Tipo de Coluna
                    </label>
                    <select
                      id="tipoColuna"
                      name="tipoColuna"
                      value={waterDrillingDetails.tipoColuna || ""}
                      onChange={handleWaterDrillingChange}
                      className="form-select"
                    >
                      <option value="">Selecionar tipo...</option>
                      <option value="PEAD">PEAD</option>
                      <option value="HIDROROSCADO">HIDROROSCADO</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="diametroColuna" className="form-label">
                      Diâmetro da Coluna (mm)
                    </label>
                    <select
                      id="diametroColuna"
                      name="diametroColuna"
                      value={waterDrillingDetails.diametroColuna || ""}
                      onChange={handleWaterDrillingChange}
                      className="form-select"
                    >
                      <option value="">Selecionar diâmetro...</option>
                      <option value="50">50mm</option>
                      <option value="63">63mm</option>
                      <option value="75">75mm</option>
                      <option value="90">90mm</option>
                      <option value="110">110mm</option>
                      <option value="125">125mm</option>
                      <option value="160">160mm</option>
                      <option value="200">200mm</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="modeloBomba" className="form-label">
                      Modelo da Bomba
                    </label>
                    <input
                      id="modeloBomba"
                      name="modeloBomba"
                      type="text"
                      value={waterDrillingDetails.modeloBomba || ""}
                      onChange={handleWaterDrillingChange}
                      className="form-input"
                      placeholder="Ex: Grundfos SQ3-105"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="potenciaMotor" className="form-label">
                      Potência Motor (HP)
                    </label>
                    <select
                      id="potenciaMotor"
                      name="potenciaMotor"
                      value={waterDrillingDetails.potenciaMotor || ""}
                      onChange={handleWaterDrillingChange}
                      className="form-select"
                    >
                      <option value="">Selecionar potência...</option>
                      <option value="0.5">0.5 HP</option>
                      <option value="0.75">0.75 HP</option>
                      <option value="1">1 HP</option>
                      <option value="1.5">1.5 HP</option>
                      <option value="2">2 HP</option>
                      <option value="3">3 HP</option>
                      <option value="5">5 HP</option>
                      <option value="7.5">7.5 HP</option>
                      <option value="10">10 HP</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="voltagemBomba" className="form-label">
                      Voltagem da Bomba
                    </label>
                    <select
                      id="voltagemBomba"
                      name="voltagemBomba"
                      value={waterDrillingDetails.voltagemBomba || ""}
                      onChange={handleWaterDrillingChange}
                      className="form-select"
                    >
                      <option value="">Selecionar voltagem...</option>
                      <option value="230V">230V (Monofásica)</option>
                      <option value="400V">400V (Trifásica)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-cyan-100 rounded-lg text-sm text-cyan-800">
                  💡 <strong>Informação:</strong> Estes dados técnicos são
                  específicos para furos de água e serão guardados junto com a
                  obra.
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/works")}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                <Save size={18} />
                {isSubmitting ? "A guardar..." : "Guardar Obra"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
