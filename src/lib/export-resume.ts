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
export async function exportResume(resumeData: Resume, format: 'pdf' | 'docx' | 'json' | 'txt', fileName: string = 'resume') {
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

      case 'txt':
        // Plain text export
        try {
          const textContent = generatePlainTextResume(resumeData);
          const txtBlob = new Blob([textContent], { type: 'text/plain' });
          const txtUrl = URL.createObjectURL(txtBlob);
          const txtLink = document.createElement('a');
          txtLink.href = txtUrl;
          txtLink.download = `${fileName}.txt`;
          document.body.appendChild(txtLink);
          txtLink.click();
          document.body.removeChild(txtLink);
          URL.revokeObjectURL(txtUrl);
          toast.success('Text file exported successfully!');
          console.log('Resume exported as TXT.');
        } catch (error) {
          console.error('TXT export failed:', error);
          toast.error('Failed to export as text file.');
        }
        break;

      case 'docx':
        // DOCX generation (requires server-side processing for best results)
        toast.error('DOCX export is coming soon! For now, please use PDF or TXT export.');
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

/**
 * Generates a plain text version of the resume
 */
function generatePlainTextResume(resumeData: Resume): string {
  const lines: string[] = [];
  
  // Personal Information
  if (resumeData.personalInfo) {
    const info = resumeData.personalInfo;
    if (info.fullName) lines.push(info.fullName.toUpperCase());
    if (info.title) lines.push(info.title);
    lines.push('');
    
    // Contact Information
    if (info.email || info.phone || info.location) {
      if (info.email) lines.push(`Email: ${info.email}`);
      if (info.phone) lines.push(`Phone: ${info.phone}`);
      if (info.location) lines.push(`Location: ${info.location}`);
      if (info.linkedin) lines.push(`LinkedIn: ${info.linkedin}`);
      if (info.portfolio) lines.push(`Portfolio: ${info.portfolio}`);
      lines.push('');
    }
  }
  
  // Professional Summary
  if (resumeData.summary) {
    lines.push('PROFESSIONAL SUMMARY');
    lines.push('-'.repeat(50));
    lines.push(resumeData.summary);
    lines.push('');
  }
  
  // Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    lines.push('PROFESSIONAL EXPERIENCE');
    lines.push('-'.repeat(50));
    
    resumeData.experience.forEach((exp, index) => {
      if (index > 0) lines.push('');
      
      lines.push(`${exp.position || 'Position'} | ${exp.company || 'Company'}`);
      if (exp.startDate || exp.endDate) {
        lines.push(`${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`);
      }
      
      if (exp.description) {
        lines.push('');
        lines.push(exp.description);
      }
      
      if (exp.achievements && exp.achievements.length > 0) {
        lines.push('');
        exp.achievements.forEach(achievement => {
          lines.push(`• ${achievement}`);
        });
      }
    });
    lines.push('');
  }
  
  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    lines.push('EDUCATION');
    lines.push('-'.repeat(50));
    
    resumeData.education.forEach((edu, index) => {
      if (index > 0) lines.push('');
      
      if (edu.degree) lines.push(edu.degree);
      if (edu.field) lines.push(edu.field);
      if (edu.institution) lines.push(edu.institution);
      if (edu.graduationDate) lines.push(`Graduated: ${edu.graduationDate}`);
      if (edu.gpa) lines.push(`GPA: ${edu.gpa}`);
    });
    lines.push('');
  }
  
  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    lines.push('SKILLS');
    lines.push('-'.repeat(50));
    
    const skillsList = resumeData.skills.map(skill => skill.name).join(', ');
    lines.push(skillsList);
    lines.push('');
  }
  
  // Projects
  if (resumeData.projects && resumeData.projects.length > 0) {
    lines.push('PROJECTS');
    lines.push('-'.repeat(50));
    
    resumeData.projects.forEach((project, index) => {
      if (index > 0) lines.push('');
      
      lines.push(project.name || 'Untitled Project');
      if (project.description) {
        lines.push(project.description);
      }
      if (project.technologies && project.technologies.length > 0) {
        lines.push(`Technologies: ${project.technologies.join(', ')}`);
      }
    });
    lines.push('');
  }
  
  // Certifications
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    lines.push('CERTIFICATIONS');
    lines.push('-'.repeat(50));
    
    resumeData.certifications.forEach((cert, index) => {
      if (index > 0) lines.push('');
      
      lines.push(cert.name || 'Certification');
      if (cert.issuer) lines.push(`Issuer: ${cert.issuer}`);
      if (cert.date) lines.push(`Date: ${cert.date}`);
    });
    lines.push('');
  }
  
  // Keywords (if any)
  if (resumeData.keywords && resumeData.keywords.length > 0) {
    lines.push('KEYWORDS');
    lines.push('-'.repeat(50));
    lines.push(resumeData.keywords.join(', '));
    lines.push('');
  }
  
  return lines.join('\n');
}
