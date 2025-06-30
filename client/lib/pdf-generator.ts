import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface PDFOptions {
  title: string;
  filename: string;
  orientation?: "portrait" | "landscape";
  format?: "a4" | "letter";
}

export class PDFGenerator {
  private static readonly LEIRISONDA_BLUE = "#007784";
  private static readonly LEIRISONDA_RED = "#B3022A";
  private static readonly LEIRISONDA_BLUE_LIGHT = "#EFF5F6";

  // Check if device is mobile for optimized settings
  private static isMobileDevice(): boolean {
    return (
      window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    );
  }

  // Convert image URL to base64 data URI
  private static async imageToBase64(url: string): Promise<string> {
    try {
      // If already a data URI, return as-is
      if (url.startsWith("data:")) {
        console.log("Image is already base64 data URI");
        return url;
      }

      // For blob URLs or regular URLs
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();

      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          console.log(`✅ Converted to base64: ${result.substring(0, 50)}...`);
          resolve(result);
        };
        reader.onerror = () => {
          console.error("FileReader error");
          reject(new Error("Failed to read blob as data URL"));
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.warn(
        "Failed to convert image to base64:",
        url.substring(0, 100),
        error,
      );
      throw error;
    }
  }

  // Better image handling for all devices
  private static async waitForImages(container: HTMLElement): Promise<void> {
    const images = container.querySelectorAll("img");
    const isMobile = window.innerWidth < 768;

    console.log(
      `📷 Processando ${images.length} imagens (mobile: ${isMobile})...`,
    );

    if (isMobile) {
      // For mobile, replace with styled placeholders that include description
      Array.from(images).forEach((img, index) => {
        const placeholder = document.createElement("div");
        const alt = img.getAttribute("alt") || `Foto ${index + 1}`;

        placeholder.style.cssText = `
          width: 120px;
          height: 90px;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border: 1px solid #d1d5db;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #374151;
          margin: 0 auto;
          text-align: center;
          padding: 4px;
        `;

        placeholder.innerHTML = `
          <div style="font-size: 16px; margin-bottom: 4px;">📷</div>
          <div style="font-weight: 500;">${alt}</div>
        `;

        if (img.parentNode) {
          img.parentNode.replaceChild(placeholder, img);
        }
      });
    } else {
      // For desktop, try to load images normally with timeout
      const imagePromises = Array.from(images).map((img, index) => {
        return new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }

          const timeout = setTimeout(() => {
            console.warn(`⏰ Timeout na imagem ${index + 1}`);
            resolve();
          }, 3000);

          img.onload = () => {
            clearTimeout(timeout);
            resolve();
          };

          img.onerror = () => {
            clearTimeout(timeout);
            resolve();
          };
        });
      });

      await Promise.all(imagePromises);
    }

    console.log("✅ Processamento de imagens concluído");
  }

  static async generatePDFFromHTML(
    htmlContent: string,
    options: PDFOptions,
  ): Promise<Blob> {
    let tempContainer: HTMLElement | null = null;

    try {
      // Clear any cached styles to force refresh
      const cacheBuster = Date.now();
      console.log(`🔄 Iniciando geração PDF (${cacheBuster})`);

      // Detect mobile device for optimized settings
      const isMobile = this.isMobileDevice();

      // Create container preserving custom styles
      tempContainer = document.createElement("div");
      // Add cache buster to force content refresh
      const enhancedContent = htmlContent.replace(
        /(<style[^>]*>)/g,
        `$1/* Cache-Buster: ${cacheBuster} */`,
      );
      tempContainer.innerHTML = enhancedContent;
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.width = "210mm"; // Full A4 width for modern layout
      tempContainer.style.overflow = "visible"; // Allow content to expand
      tempContainer.style.zIndex = "-1000";

      document.body.appendChild(tempContainer);

      // Wait for content and images to load
      await new Promise((resolve) =>
        setTimeout(resolve, isMobile ? 1000 : 500),
      );
      await this.waitForImages(tempContainer);

      // Mobile-optimized settings to prevent black PDF
      const canvasOptions = {
        scale: isMobile ? 0.75 : 1.5, // Very low scale for mobile
        useCORS: false, // Disable CORS for mobile compatibility
        allowTaint: true, // Allow tainted canvas
        backgroundColor: "#ffffff",
        logging: true,
        height: isMobile
          ? Math.min(tempContainer.scrollHeight, 4000)
          : tempContainer.scrollHeight,
        width: isMobile
          ? Math.min(tempContainer.scrollWidth, 800)
          : tempContainer.scrollWidth,
        removeContainer: false,
        imageTimeout: isMobile ? 2000 : 5000, // Much shorter timeout on mobile
        onclone: (clonedDoc: Document) => {
          // Ensure styles are applied in cloned document
          const clonedContainer = clonedDoc.body.querySelector("div");
          if (clonedContainer) {
            (clonedContainer as HTMLElement).style.background = "#ffffff";
            (clonedContainer as HTMLElement).style.color = "#000000";
            (clonedContainer as HTMLElement).style.width = "210mm";
            (clonedContainer as HTMLElement).style.overflow = "visible";
          }
        },
      };

      // Generate canvas with error handling
      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(tempContainer, canvasOptions);
      } catch (canvasError) {
        console.error("Canvas generation error:", canvasError);
        // Retry with even more conservative settings
        const retryOptions = {
          ...canvasOptions,
          scale: 1,
          height: Math.min(tempContainer.scrollHeight, 3000), // Limit height
          width: Math.min(tempContainer.scrollWidth, 800), // Limit width
        };
        canvas = await html2canvas(tempContainer, retryOptions);
      }

      // Clean up container as soon as possible
      if (tempContainer && tempContainer.parentNode) {
        document.body.removeChild(tempContainer);
        tempContainer = null;
      }

      // Validate canvas
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error("Falha na geração do conteúdo visual");
      }

      // Create PDF with mobile-optimized settings
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true, // Enable compression
        precision: 2, // Reduce precision for smaller file size
      });

      // Add metadata
      pdf.setProperties({
        title: options.title,
        author: "Leirisonda",
        creator: "Leirisonda PDF Generator",
      });

      // Calculate for A4 with proper scaling
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 10;
      const maxWidth = pdfWidth - margin * 2;
      const maxHeight = pdfHeight - margin * 2;

      // Calculate scaling to fit width
      const usedScale = isMobile ? 1.5 : 2;
      const scaleToFitWidth = maxWidth / (canvas.width / usedScale);
      const scaledHeight = (canvas.height / usedScale) * scaleToFitWidth;

      let currentY = margin;

      // Convert canvas to image with quality optimization
      let canvasData: string;
      try {
        canvasData = canvas.toDataURL("image/jpeg", isMobile ? 0.7 : 0.8); // Lower quality on mobile
      } catch (toDataURLError) {
        console.error("Canvas toDataURL error:", toDataURLError);
        // Fallback to PNG with lower quality
        canvasData = canvas.toDataURL("image/png");
      }

      // If content fits in one page
      if (scaledHeight <= maxHeight) {
        pdf.addImage(
          canvasData,
          "JPEG",
          margin,
          currentY,
          maxWidth,
          scaledHeight,
          undefined,
          "MEDIUM", // Medium compression
        );
      } else {
        // Multi-page support with memory optimization
        const pageHeight = maxHeight;
        const totalPages = Math.ceil(scaledHeight / pageHeight);
        const maxPages = isMobile ? 10 : 20; // Limit pages on mobile

        const actualPages = Math.min(totalPages, maxPages);

        for (let i = 0; i < actualPages; i++) {
          if (i > 0) {
            pdf.addPage();
            currentY = margin;
          }

          const sourceY = (i * pageHeight * canvas.height) / scaledHeight;
          const sourceHeight = Math.min(
            (pageHeight * canvas.height) / scaledHeight,
            canvas.height - sourceY,
          );

          // Create a cropped canvas for this page
          const pageCanvas = document.createElement("canvas");
          const pageCtx = pageCanvas.getContext("2d");

          if (!pageCtx) {
            throw new Error("Não foi possível criar contexto do canvas");
          }

          pageCanvas.width = canvas.width;
          pageCanvas.height = sourceHeight;

          pageCtx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sourceHeight,
            0,
            0,
            canvas.width,
            sourceHeight,
          );

          const actualPageHeight =
            (sourceHeight / canvas.height) * scaledHeight;

          try {
            const pageImageData = pageCanvas.toDataURL(
              "image/jpeg",
              isMobile ? 0.7 : 0.8,
            );
            pdf.addImage(
              pageImageData,
              "JPEG",
              margin,
              currentY,
              maxWidth,
              actualPageHeight,
              undefined,
              "MEDIUM",
            );
          } catch (pageError) {
            console.error(`Error adding page ${i + 1}:`, pageError);
            // Continue with next page
          }
        }

        if (totalPages > actualPages) {
          console.warn(
            `PDF truncated: ${actualPages}/${totalPages} pages due to mobile limitations`,
          );
        }
      }

      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }

      return pdf.output("blob");
    } catch (error) {
      console.error("Error generating PDF:", error);

      // Clean up on error
      if (tempContainer && tempContainer.parentNode) {
        try {
          document.body.removeChild(tempContainer);
        } catch (cleanupError) {
          console.error("Cleanup error:", cleanupError);
        }
      }

      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes("canvas")) {
          throw new Error(
            "Erro na geração do PDF: problema com imagens. Tente novamente.",
          );
        } else if (
          error.message.includes("memory") ||
          error.message.includes("limit")
        ) {
          throw new Error(
            "Erro na geração do PDF: documento muito grande. Tente reduzir o conteúdo.",
          );
        } else if (
          error.message.includes("network") ||
          error.message.includes("cors")
        ) {
          throw new Error(
            "Erro na geração do PDF: problema de conectividade. Verifique a internet.",
          );
        }
      }

      throw new Error("Erro ao gerar PDF. Tente novamente em alguns segundos.");
    }
  }

  static async downloadPDF(
    htmlContent: string,
    options: PDFOptions,
  ): Promise<void> {
    try {
      const pdfBlob = await this.generatePDFFromHTML(htmlContent, options);

      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = options.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw new Error("Erro ao fazer download do PDF.");
    }
  }

  static createModernReportHTML(data: {
    type: "work" | "maintenance";
    title: string;
    subtitle?: string;
    date: string;
    content: string;
    additionalInfo?: string;
  }): string {
    const reportDate = new Date().toLocaleDateString("pt-PT");
    const primaryColor =
      data.type === "work" ? this.LEIRISONDA_RED : this.LEIRISONDA_BLUE;

    return `
      <!DOCTYPE html>
      <html lang="pt">
      <head>
        <meta charset="UTF-8">
        <title>${data.title}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
            background: white;
          }

          /* Header layout exactly like the image */
          .header {
            margin-bottom: 30px;
          }

          .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 15px;
            position: relative;
          }

          .logo-section {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .logo {
            height: 60px;
            width: auto;
            object-fit: contain;
          }

          .company-name {
            font-size: 12px;
            color: #333;
            font-weight: normal;
          }

          .report-title {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
          }

          .report-title h1 {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-bottom: 2px;
          }

          .report-title .subtitle {
            font-size: 14px;
            color: #333;
            margin: 0;
          }

          .header-meta {
            flex: 0 0 auto;
            text-align: right;
            font-size: 9px;
            color: #666;
          }

          .page-number {
            font-size: 14px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
          }

          .date-time {
            font-size: 9px;
            color: #666;
          }

          .sub-header {
            display: flex;
            justify-content: space-between;
            font-size: 9px;
            color: #666;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #e0e0e0;
          }

          .sub-left {
            flex: 1;
          }

          .sub-right {
            flex: 1;
            text-align: right;
          }

          /* Content sections */
          .section {
            margin-bottom: 20px;
          }

          .section-title {
            background: #f5f5f5;
            padding: 8px 12px;
            font-size: 12px;
            font-weight: bold;
            color: #333;
            border-left: 4px solid ${primaryColor};
            margin-bottom: 2px;
          }

          .section-content {
            background: #fafafa;
            padding: 12px;
            border: 1px solid #e0e0e0;
          }

          /* Info grid for client data */
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 15px;
          }

          .info-item {
            background: white;
            padding: 8px;
            border: 1px solid #e0e0e0;
          }

          .info-label {
            font-size: 10px;
            font-weight: bold;
            color: #666;
            margin-bottom: 2px;
          }

          .info-value {
            font-size: 11px;
            color: #333;
          }

          /* Table style for data */
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            background: white;
          }

          .data-table th {
            background: #f0f0f0;
            color: #333;
            padding: 8px;
            text-align: left;
            font-size: 10px;
            font-weight: bold;
            border: 1px solid #d0d0d0;
          }

          .data-table td {
            padding: 6px 8px;
            border: 1px solid #d0d0d0;
            font-size: 10px;
          }

          .data-table tr:nth-child(even) {
            background: #f9f9f9;
          }

          /* Simple lists */
          .simple-list {
            list-style: none;
            padding: 0;
            background: white;
            border: 1px solid #e0e0e0;
          }

          .simple-list li {
            padding: 6px 10px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 10px;
          }

          .simple-list li:last-child {
            border-bottom: none;
          }

          /* Footer */
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #e0e0e0;
            text-align: center;
          }

          .footer-logo {
            font-size: 12px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
          }

          .footer-info {
            font-size: 9px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <div class="header-top">
              <div class="logo-section">
                <img src="https://cdn.builder.io/api/v1/image/assets%2F24b5ff5dbb9f4bb493659e90291d92bc%2F9862202d056a426996e6178b9981c1c7?format=webp&width=200" alt="Leirisonda Logo" class="logo" />
              </div>

              <div class="report-title">
                <h1>${data.title}</h1>
                ${data.subtitle ? `<div class="subtitle">${data.subtitle}</div>` : ""}
              </div>

              <div class="header-meta">
                <div class="page-number">1</div>
              </div>
            </div>

            <div class="sub-header">
              <div class="sub-left">Por: Leirisonda (info@leirisonda.pt)</div>
              <div class="sub-right">Em: ${reportDate} ${new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
          </div>

          <div class="content">
            ${data.content}
          </div>

          <div class="footer">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div class="footer-logo">Leirisonda</div>
              <div class="footer-info">
                Relatório gerado no Sistema de Gestão
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
