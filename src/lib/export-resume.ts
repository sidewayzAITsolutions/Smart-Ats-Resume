// src/lib/export-resume.ts

import { Resume } from '@/types/resume';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

/**
 * Placeholder for resume export functionality.
 * In a real application, this would handle generating PDF, DOCX, or JSON files.
 *
 * Options for implementation:
 * 1.  **Client-side (less robust for complex layouts):**
 * -   For PDF: Use libraries like `jspdf` or `html2canvas` to convert rendered HTML to PDF.
 * -   For DOCX: More complex, often requires server-side processing.
 * -   For JSON: Simple `JSON.stringify(resumeData)`.
 * 2.  **Server-side (recommended for robust PDF/DOCX generation):**
 * -   Send `resumeData` to a backend API.
 * -   Backend uses libraries (e.g., Puppeteer for PDF, DocxTemplater for DOCX) to generate the file.
 * -   Backend sends the generated file back as a download.
 * 3.  **Third-party API (simplest, but external dependency):**
 * -   Use a service like DocRaptor, Aspose, or similar to convert HTML/JSON to desired formats.
 */

/**
 * Exports resume data to a specified format.
 * This is a client-side placeholder. For production, consider server-side generation for fidelity.
 * @param resumeData The complete resume data object.
 * @param format The desired export format ('pdf', 'docx', 'json').
 * @param fileName The desired file name (without extension).
 */
export async function exportResume(resumeData: Resume, format: 'pdf' | 'docx' | 'json', fileName: string = 'resume') {
  try {
    switch (format) {
      case 'json':
        // Client-side JSON export
        const jsonBlob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = `${fileName}.json`;
        document.body.appendChild(jsonLink);
        jsonLink.click();
        document.body.removeChild(jsonLink);
        URL.revokeObjectURL(jsonUrl);
        console.log('Resume exported as JSON.');
        break;

      case 'pdf':
        // Client-side PDF generation using html2canvas and jsPDF
        try {
          // Find the resume preview element
          const input = document.querySelector('[data-resume-preview]') as HTMLElement;

          if (!input) {
            toast.error('Resume preview not found. Please ensure the preview is visible.');
            console.error('Resume preview area not found for PDF export.');
            return;
          }

          // Show loading toast
          const loadingToast = toast.loading('Generating PDF...');

          // Generate canvas from HTML
          const canvas = await html2canvas(input, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
          });

          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 297; // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          // Add first page
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          // Add additional pages if needed
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          // Save the PDF
          pdf.save(`${fileName}.pdf`);

          // Dismiss loading and show success
          toast.dismiss(loadingToast);
          toast.success('PDF exported successfully!');
          console.log('PDF exported successfully.');
        } catch (error) {
          console.error('PDF generation failed:', error);
          toast.error('Failed to generate PDF. Please try again.');
        }
        break;

      case 'docx':
        // DOCX generation (requires server-side processing for best results)
        toast.error('DOCX export is coming soon! For now, please use PDF export.');
        console.warn('DOCX export initiated (placeholder). Server-side generation required for production.');
        break;

      default:
        console.error('Unsupported export format:', format);
        toast.error('Unsupported export format.');
        break;
    }
  } catch (error) {
    console.error('Error during resume export:', error);
    toast.error('Failed to export resume. Please try again.');
  }
}
