import React, { useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  FileText,
  Share,
  Download,
  Mail,
  MessageCircle,
  Copy,
  Printer,
  Droplets,
} from "lucide-react";
import { PoolMaintenance, MaintenanceIntervention } from "@shared/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PDFGenerator } from "@/lib/pdf-generator";

interface MaintenanceReportProps {
  maintenance: PoolMaintenance;
  intervention?: MaintenanceIntervention;
  onClose?: () => void;
}

export function MaintenanceReport({
  maintenance,
  intervention,
  onClose,
}: MaintenanceReportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Define work labels at component level to be accessible everywhere
  const workLabels = {
    filtros: "Limpeza de Filtros",
    preFiltero: "Pré-filtro",
    filtroAreiaVidro: "Filtro Areia/Vidro",
    enchimentoAutomatico: "Enchimento Automático",
    linhaAgua: "Linha de Água",
    limpezaFundo: "Limpeza do Fundo",
    limpezaParedes: "Limpeza das Paredes",
    limpezaSkimmers: "Limpeza dos Skimmers",
    verificacaoEquipamentos: "Verificação de Equipamentos",
    aspiracao: "Aspiração",
    escovagem: "Escovagem",
    limpezaFiltros: "Limpeza de Filtros",
    tratamentoAlgas: "Tratamento de Algas",
  };

  const getPoolTypeLabel = (type: string) => {
    const labels = {
      outdoor: "Exterior",
      indoor: "Interior",
      spa: "Spa",
      olympic: "Olímpica",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getWaterQualityStatus = (waterValues: any) => {
    const ph = waterValues.ph;
    const chlorine = waterValues.chlorine;
    if (ph >= 7.0 && ph <= 7.4 && chlorine >= 1.0 && chlorine <= 2.0) {
      return "Excelente - Água em condições ideais";
    } else if (ph >= 6.8 && ph <= 7.6 && chlorine >= 0.8 && chlorine <= 2.5) {
      return "Aceitável - Pequenos ajustes recomendados";
    }
    return "Requer Atenção - Ajustes necessários";
  };

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(`2000-01-01 ${start}`);
    const endTime = new Date(`2000-01-01 ${end}`);
    const diff = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min`;
  };

  const getProductPurpose = (productName: string) => {
    const purposes: Record<string, string> = {
      cloro: "Desinfeção da água",
      "ph+": "Aumentar pH",
      "ph-": "Diminuir pH",
      algicida: "Prevenção de algas",
      floculante: "Clarificação da água",
      cal: "Ajuste de alcalinidade",
      sal: "Eletrólise salina",
      estabilizador: "Proteção do cloro",
      clarificante: "Limpeza da água",
      choque: "Tratamento choque",
    };

    for (const [key, purpose] of Object.entries(purposes)) {
      if (productName.toLowerCase().includes(key)) {
        return purpose;
      }
    }
    return "Tratamento geral";
  };

  // Helper function to process and include photos in PDF
  const createPhotoGallery = (photos: string[], title: string) => {
    if (!photos || photos.length === 0) return "";

    const photosHTML = photos
      .map(
        (photo, index) => `
        <div class="photo-item">
          <img src="${photo}" alt="${title} ${index + 1}" class="photo-img" crossorigin="anonymous" />
          <div class="photo-caption">${title} ${index + 1}</div>
        </div>
      `,
      )
      .join("");

    return `
      <div class="section">
        <div class="section-header">
          <div class="section-title">📸 ${title}</div>
        </div>
        <div class="section-content">
          <div class="photo-gallery">
            ${photosHTML}
          </div>
        </div>
      </div>
    `;
  };

  const createInterventionContent = () => {
    if (!intervention) return "";

    // Get water quality status with color coding
    const getWaterQualityColor = (waterValues: any) => {
      const ph = waterValues.ph;
      const chlorine = waterValues.chlorine;
      if (ph >= 7.0 && ph <= 7.4 && chlorine >= 1.0 && chlorine <= 2.5) {
        return "success";
      } else if (ph >= 6.8 && ph <= 7.6 && chlorine >= 0.8 && chlorine <= 3.0) {
        return "warning";
      }
      return "danger";
    };

    const waterQualityColor = getWaterQualityColor(intervention.waterValues);
    const waterQualityClass =
      waterQualityColor === "success"
        ? "quality-excellent"
        : waterQualityColor === "warning"
          ? "quality-acceptable"
          : "quality-poor";

    // Get ideal water values for comparison
    const idealValues = {
      ph: "7.0 - 7.4",
      chlorine: "1.0 - 2.5 ppm",
      alkalinity: "80 - 120 ppm",
      temperature: "24 - 28°C",
      salt: "3.0 - 4.0 gr/lt",
    };

    return `
      <!-- Pool Information Section -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">🏊‍♂️ Informações da Piscina</div>
        </div>
        <div class="section-content">
          <table class="data-table">
            <tr>
              <td class="table-label">Nome:</td>
              <td class="table-value">${maintenance.poolName}</td>
            </tr>
            <tr>
              <td class="table-label">Cliente:</td>
              <td class="table-value">${maintenance.clientName}</td>
            </tr>
            <tr>
              <td class="table-label">Morada:</td>
              <td class="table-value">${maintenance.address}</td>
            </tr>
            <tr>
              <td class="table-label">Tipo:</td>
              <td class="table-value">${getPoolTypeLabel(maintenance.poolType)}</td>
            </tr>
            <tr>
              <td class="table-label">Estado:</td>
              <td class="table-value">${maintenance.status === "ativa" ? "Ativa" : "Inativa"}</td>
            </tr>
            ${
              maintenance.waterCubicage
                ? `
            <tr>
              <td class="table-label">Volume:</td>
              <td class="table-value">${maintenance.waterCubicage} litros</td>
            </tr>`
                : ""
            }
          </table>
        </div>
      </div>

      <!-- Intervention Details Section -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">📅 Detalhes da Intervenção</div>
        </div>
        <div class="section-content">
          <table class="data-table">
            <tr>
              <td class="table-label">Data:</td>
              <td class="table-value">${format(new Date(intervention.date), "dd 'de' MMMM 'de' yyyy", { locale: pt })}</td>
            </tr>
            <tr>
              <td class="table-label">Horário:</td>
              <td class="table-value">${intervention.timeStart} - ${intervention.timeEnd}</td>
            </tr>
            <tr>
              <td class="table-label">Duração:</td>
              <td class="table-value">${calculateDuration(intervention.timeStart, intervention.timeEnd)}</td>
            </tr>
            <tr>
              <td class="table-label">Técnicos:</td>
              <td class="table-value">${intervention.technicians.join(", ")}</td>
            </tr>
            ${
              intervention.vehicles && intervention.vehicles.length > 0
                ? `
            <tr>
              <td class="table-label">Viaturas:</td>
              <td class="table-value">${intervention.vehicles.join(", ")}</td>
            </tr>`
                : ""
            }
          </table>
        </div>
      </div>

      <!-- Water Analysis Section -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">🧪 Análise Completa da Água</div>
        </div>
        <div class="section-content">
          <table class="data-table">
            <thead>
              <tr>
                <th>Parâmetro</th>
                <th>Valor Medido</th>
                <th>Valor Ideal</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>pH</strong></td>
                <td>${intervention.waterValues.ph || "N/A"}</td>
                <td>${idealValues.ph}</td>
                <td>${getWaterQualityColor(intervention.waterValues) === "success" ? "✅ Excelente" : getWaterQualityColor(intervention.waterValues) === "warning" ? "⚠️ Aceitável" : "❌ Ajustar"}</td>
              </tr>
              <tr>
                <td><strong>Cloro</strong></td>
                <td>${intervention.waterValues.chlorine || "N/A"} ppm</td>
                <td>${idealValues.chlorine}</td>
                <td>${intervention.waterValues.chlorine >= 1.0 && intervention.waterValues.chlorine <= 2.5 ? "✅ Excelente" : intervention.waterValues.chlorine >= 0.8 && intervention.waterValues.chlorine <= 3.0 ? "⚠️ Aceitável" : "❌ Ajustar"}</td>
              </tr>
              ${
                intervention.waterValues.alkalinity
                  ? `
              <tr>
                <td><strong>Alcalinidade</strong></td>
                <td>${intervention.waterValues.alkalinity} ppm</td>
                <td>${idealValues.alkalinity}</td>
                <td>${intervention.waterValues.alkalinity >= 80 && intervention.waterValues.alkalinity <= 120 ? "✅ Excelente" : "⚠️ Monitorizar"}</td>
              </tr>`
                  : ""
              }
              <tr>
                <td><strong>Temperatura</strong></td>
                <td>${intervention.waterValues.temperature || "N/A"}°C</td>
                <td>${idealValues.temperature}</td>
                <td>${intervention.waterValues.temperature >= 24 && intervention.waterValues.temperature <= 28 ? "✅ Confortável" : "📊 Informativo"}</td>
              </tr>
              ${
                intervention.waterValues.salt
                  ? `
              <tr>
                <td><strong>Sal</strong></td>
                <td>${intervention.waterValues.salt} gr/lt</td>
                <td>${idealValues.salt}</td>
                <td>${intervention.waterValues.salt >= 3.0 && intervention.waterValues.salt <= 4.0 ? "✅ Excelente" : "⚠️ Ajustar"}</td>
              </tr>`
                  : ""
              }
            </tbody>
          </table>
          <div class="water-summary">
            <strong>Avaliação Geral:</strong> 
            <span class="${waterQualityClass}">${getWaterQualityStatus(intervention.waterValues)}</span>
          </div>
        </div>
      </div>
      
      <!-- Work Performed Section -->
      ${
        Object.values(intervention.workPerformed).some((v) => v)
          ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">🔧 Trabalho Realizado</div>
        </div>
        <div class="section-content">
          <div class="work-categories">
            <!-- Sistema de Filtração -->
            ${
              Object.entries(intervention.workPerformed).filter(
                ([key, value]) =>
                  value &&
                  ["filtros", "preFiltero", "filtroAreiaVidro"].includes(key),
              ).length > 0
                ? `
            <div class="work-category">
              <h4 class="category-title">💧 Sistema de Filtração</h4>
              <div class="work-items">
                ${Object.entries(intervention.workPerformed)
                  .filter(
                    ([key, value]) =>
                      value &&
                      ["filtros", "preFiltero", "filtroAreiaVidro"].includes(
                        key,
                      ),
                  )
                  .map(
                    ([key]) => `
                    <div class="work-item">
                      <span class="work-check">✅</span>
                      <span class="work-text">${workLabels[key as keyof typeof workLabels] || key}</span>
                    </div>
                  `,
                  )
                  .join("")}
              </div>
            </div>`
                : ""
            }
            
            <!-- Sistemas da Piscina -->
            ${
              Object.entries(intervention.workPerformed).filter(
                ([key, value]) =>
                  value &&
                  [
                    "enchimentoAutomatico",
                    "linhaAgua",
                    "limpezaFundo",
                    "limpezaParedes",
                    "limpezaSkimmers",
                    "verificacaoEquipamentos",
                    "aspiracao",
                    "escovagem",
                    "limpezaFiltros",
                    "tratamentoAlgas",
                  ].includes(key),
              ).length > 0
                ? `
            <div class="work-category">
              <h4 class="category-title">🏊‍♂️ Sistemas da Piscina</h4>
              <div class="work-items">
                ${Object.entries(intervention.workPerformed)
                  .filter(
                    ([key, value]) =>
                      value &&
                      [
                        "enchimentoAutomatico",
                        "linhaAgua",
                        "limpezaFundo",
                        "limpezaParedes",
                        "limpezaSkimmers",
                        "verificacaoEquipamentos",
                        "aspiracao",
                        "escovagem",
                        "limpezaFiltros",
                        "tratamentoAlgas",
                      ].includes(key),
                  )
                  .map(
                    ([key]) => `
                    <div class="work-item">
                      <span class="work-check">✅</span>
                      <span class="work-text">${workLabels[key as keyof typeof workLabels] || key}</span>
                    </div>
                  `,
                  )
                  .join("")}
              </div>
            </div>`
                : ""
            }
            
            ${
              intervention.workPerformed.outros
                ? `
            <div class="work-category">
              <h4 class="category-title">📋 Trabalho Adicional</h4>
              <div class="work-items">
                <div class="work-item-note">
                  <span class="work-check">📝</span>
                  <span class="work-text">${intervention.workPerformed.outros}</span>
                </div>
              </div>
            </div>`
                : ""
            }
          </div>
        </div>
      </div>`
          : ""
      }

      <!-- Chemical Products Section -->
      ${
        intervention.chemicalProducts &&
        intervention.chemicalProducts.length > 0
          ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">🧴 Produtos Químicos Aplicados</div>
        </div>
        <div class="section-content">
          <table class="data-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Finalidade</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              ${intervention.chemicalProducts
                .map(
                  (product) => `
                <tr>
                  <td class="product-name">${product.productName}</td>
                  <td class="product-quantity">${product.quantity} ${product.unit}</td>
                  <td class="product-purpose">${getProductPurpose(product.productName)}</td>
                  <td class="product-notes">${product.observations || "N/A"}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>`
          : ""
      }

      <!-- Pool Photos Section -->
      ${maintenance.photos && maintenance.photos.length > 0 ? createPhotoGallery(maintenance.photos, "Fotos da Piscina") : ""}

      <!-- Intervention Photos Section -->
      ${intervention.photos && intervention.photos.length > 0 ? createPhotoGallery(intervention.photos, "Fotos da Intervenção") : ""}

      <!-- Observations Section -->
      ${
        intervention.observations
          ? `
      <div class="section">
        <div class="section-header">
          <div class="section-title">📝 Observações</div>
        </div>
        <div class="section-content">
          <div class="observations-content">
            ${intervention.observations}
          </div>
        </div>
      </div>`
          : ""
      }

      <!-- Summary Section -->
      <div class="section">
        <div class="section-header">
          <div class="section-title">📊 Resumo da Intervenção</div>
        </div>
        <div class="section-content">
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">Estado da Água</div>
              <div class="summary-value ${waterQualityClass}">${getWaterQualityStatus(intervention.waterValues)}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Produtos Aplicados</div>
              <div class="summary-value">${intervention.chemicalProducts ? intervention.chemicalProducts.length : 0} produto${intervention.chemicalProducts && intervention.chemicalProducts.length !== 1 ? "s" : ""}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Trabalhos Realizados</div>
              <div class="summary-value">${Object.values(intervention.workPerformed).filter((v) => v).length} atividade${Object.values(intervention.workPerformed).filter((v) => v).length !== 1 ? "s" : ""}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Próxima Visita</div>
              <div class="summary-value">${intervention.nextVisit ? format(new Date(intervention.nextVisit), "dd/MM/yyyy", { locale: pt }) : "A definir"}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const createMaintenanceContent = () => {
    const currentDate = new Date().toLocaleDateString("pt-PT");

    return `
      <div class="section">
        <div class="section-header">
          <div class="section-title">🏊‍♂️ Informações da Piscina</div>
        </div>
        <div class="section-content">
          <table class="data-table">
            <tr>
              <td class="table-label">Nome:</td>
              <td class="table-value">${maintenance.poolName}</td>
            </tr>
            <tr>
              <td class="table-label">Cliente:</td>
              <td class="table-value">${maintenance.clientName}</td>
            </tr>
            <tr>
              <td class="table-label">Morada:</td>
              <td class="table-value">${maintenance.address}</td>
            </tr>
            <tr>
              <td class="table-label">Tipo:</td>
              <td class="table-value">${getPoolTypeLabel(maintenance.poolType)}</td>
            </tr>
            <tr>
              <td class="table-label">Estado:</td>
              <td class="table-value">${maintenance.status === "ativa" ? "Ativa" : "Inativa"}</td>
            </tr>
            ${
              maintenance.waterCubicage
                ? `
            <tr>
              <td class="table-label">Volume:</td>
              <td class="table-value">${maintenance.waterCubicage} litros</td>
            </tr>`
                : ""
            }
          </table>
        </div>
      </div>

      ${maintenance.photos && maintenance.photos.length > 0 ? createPhotoGallery(maintenance.photos, "Fotos da Piscina") : ""}
    `;
  };

  const generatePDFReport = async (shareMethod?: string, retryCount = 0) => {
    setIsGenerating(true);

    try {
      const content = intervention
        ? createInterventionContent()
        : createMaintenanceContent();

      const pdfData = {
        title: intervention
          ? `Relatório de Intervenção - ${maintenance.poolName}`
          : `Relatório de Manutenção - ${maintenance.poolName}`,
        subtitle: intervention
          ? `Intervenção de ${format(new Date(intervention.date), "dd/MM/yyyy", { locale: pt })}`
          : `Relatório geral da piscina`,
        date: intervention
          ? format(new Date(intervention.date), "dd/MM/yyyy", { locale: pt })
          : new Date().toLocaleDateString("pt-PT"),
        additionalInfo: `Cliente: ${maintenance.clientName} • Tipo: ${getPoolTypeLabel(maintenance.poolType)} • Volume: ${maintenance.waterCubicage || "N/A"} litros`,
      };

      const htmlContent = PDFGenerator.createModernReportHTML({
        type: "maintenance",
        title: pdfData.title,
        subtitle: pdfData.subtitle,
        date: pdfData.date,
        content:
          content +
          `
          <style>
            .photo-gallery { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 15px 0; }
            .photo-item { text-align: center; }
            .photo-img { width: 100%; max-width: 250px; height: 200px; object-fit: cover; border-radius: 8px; border: 2px solid #e2e8f0; }
            .photo-caption { font-size: 10px; color: #666; margin-top: 5px; }
            .work-categories { margin: 15px 0; }
            .work-category { margin-bottom: 20px; }
            .category-title { font-size: 14px; color: #2d3748; margin-bottom: 10px; padding: 8px; background: #f7fafc; border-radius: 6px; }
            .work-items { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
            .work-item { display: flex; align-items: center; gap: 8px; padding: 6px; background: #f0fff4; border-radius: 4px; font-size: 11px; }
            .work-item-note { display: flex; align-items: center; gap: 8px; padding: 8px; background: #ebf8ff; border-radius: 4px; font-size: 11px; }
            .work-check { font-size: 12px; }
            .work-text { flex: 1; }
            .table-label { font-weight: bold; background: #f8fafc; padding: 8px; width: 30%; }
            .table-value { padding: 8px; }
            .water-summary { margin-top: 15px; padding: 10px; background: #f7fafc; border-radius: 6px; font-size: 12px; }
            .quality-excellent { color: #10b981; }
            .quality-acceptable { color: #f59e0b; }
            .quality-poor { color: #ef4444; }
            .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
            .summary-item { text-align: center; padding: 10px; background: #f8fafc; border-radius: 6px; }
            .summary-label { font-size: 10px; color: #666; margin-bottom: 5px; }
            .summary-value { font-size: 14px; font-weight: bold; }
            .observations-content { padding: 10px; background: #fffdf7; border-left: 4px solid #f59e0b; border-radius: 4px; font-size: 11px; line-height: 1.5; }
          </style>
        `,
        additionalInfo: pdfData.additionalInfo,
      });

      const filename = `${intervention ? "intervencao" : "manutencao"}_${maintenance.poolName.replace(/\s+/g, "_")}_${format(new Date(), "yyyyMMdd", { locale: pt })}.pdf`;

      await PDFGenerator.downloadPDF(htmlContent, {
        title: pdfData.title,
        filename: filename,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "Erro ao gerar PDF: " +
          (error instanceof Error ? error.message : "Erro desconhecido"),
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async (method: string) => {
    await generatePDFReport();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Relatório PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Droplets className="mr-2 h-5 w-5 text-blue-600" />
            Relatório de {intervention ? "Intervenção" : "Manutenção"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>
              <strong>Piscina:</strong> {maintenance.poolName}
            </p>
            <p>
              <strong>Cliente:</strong> {maintenance.clientName}
            </p>
            {intervention && (
              <p>
                <strong>Data:</strong>{" "}
                {format(new Date(intervention.date), "dd/MM/yyyy", {
                  locale: pt,
                })}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => generatePDFReport("download")}
              disabled={isGenerating}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              {isGenerating ? "A gerar..." : "Descarregar"}
            </Button>
            <Button
              onClick={() => generatePDFReport("email")}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button
              onClick={() => generatePDFReport("whatsapp")}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
            <Button
              onClick={() => generatePDFReport("copy")}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copiar
            </Button>
          </div>

          {isGenerating && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-sm text-gray-600">
                A gerar PDF com todas as fotos...
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
