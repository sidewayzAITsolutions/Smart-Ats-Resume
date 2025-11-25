// src/lib/export-resume.ts

import { Resume } from '@/types/resume';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

/**
 * Exports resume data to a specified format.
 * @param resumeData The complete resume data object.
 * @param format The desired export format ('pdf', 'docx', 'json', 'txt').
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
        toast.success('JSON exported successfully!');
        console.log('Resume exported as JSON.');
        break;

      case 'pdf':
        await exportToPDF(resumeData, fileName);
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
        await exportToDOCX(resumeData, fileName);
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
 * Export to PDF with proper page break handling
 */
async function exportToPDF(resumeData: Resume, fileName: string) {
  const loadingToast = toast.loading('Generating PDF...');
  
  try {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const input = document.querySelector('[data-resume-preview]') as HTMLElement;
    
    if (!input) {
      toast.dismiss(loadingToast);
      toast.error('Resume preview not found. Please ensure the preview is visible.');
      return;
    }

    // Get the sections within the resume preview for proper page breaking
    const sections = input.querySelectorAll('[data-section]');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 10; // margin in mm
    const contentWidth = pageWidth - (margin * 2);
    const contentHeight = pageHeight - (margin * 2);
    
    // If we have distinct sections, process them individually for better page breaks
    if (sections.length > 0) {
      let currentY = margin;
      let isFirstSection = true;
      
      for (const section of Array.from(sections)) {
        const sectionElement = section as HTMLElement;
        
        // Render section to canvas
        const canvas = await html2canvas(sectionElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Check if section fits on current page
        if (!isFirstSection && currentY + imgHeight > pageHeight - margin) {
          // Section doesn't fit, add new page
          pdf.addPage();
          currentY = margin;
        }
        
        // If section is taller than a full page, we need to split it carefully
        if (imgHeight > contentHeight) {
          // For very tall sections, split them but try to avoid cutting mid-line
          let remainingHeight = imgHeight;
          let sourceY = 0;
          
          while (remainingHeight > 0) {
            const heightToDraw = Math.min(remainingHeight, contentHeight - (currentY - margin));
            
            if (heightToDraw < 20 && currentY > margin) {
              // Not enough space, start new page
              pdf.addPage();
              currentY = margin;
              continue;
            }
            
            // Calculate source coordinates for cropping
            const sourceHeight = (heightToDraw / imgHeight) * canvas.height;
            
            // Create a temporary canvas for the portion we want to draw
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = sourceHeight;
            const tempCtx = tempCanvas.getContext('2d');
            
            if (tempCtx) {
              tempCtx.drawImage(
                canvas,
                0, sourceY,                    // source x, y
                canvas.width, sourceHeight,    // source width, height
                0, 0,                          // dest x, y
                canvas.width, sourceHeight     // dest width, height
              );
              
              const tempImgData = tempCanvas.toDataURL('image/png');
              pdf.addImage(tempImgData, 'PNG', margin, currentY, imgWidth, heightToDraw);
            }
            
            sourceY += sourceHeight;
            remainingHeight -= heightToDraw;
            
            if (remainingHeight > 0) {
              pdf.addPage();
              currentY = margin;
            } else {
              currentY += heightToDraw + 5; // Add some spacing between sections
            }
          }
        } else {
          // Section fits, add it
          pdf.addImage(imgData, 'PNG', margin, currentY, imgWidth, imgHeight);
          currentY += imgHeight + 5; // Add spacing between sections
        }
        
        isFirstSection = false;
      }
    } else {
      // Fallback: render entire preview and split by height with smarter breaks
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      if (imgHeight <= contentHeight) {
        // Fits on one page
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      } else {
        // Need multiple pages - split carefully
        const totalPages = Math.ceil(imgHeight / contentHeight);
        
        for (let page = 0; page < totalPages; page++) {
          if (page > 0) {
            pdf.addPage();
          }
          
          const sourceY = page * (canvas.height / totalPages);
          const sourceHeight = canvas.height / totalPages;
          
          // Create temporary canvas for this page portion
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = sourceHeight;
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            // Fill with white background first
            tempCtx.fillStyle = '#ffffff';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            
            tempCtx.drawImage(
              canvas,
              0, sourceY,
              canvas.width, sourceHeight,
              0, 0,
              canvas.width, sourceHeight
            );
            
            const pageImgData = tempCanvas.toDataURL('image/png');
            pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidth, contentHeight);
          }
        }
      }
    }
    
    pdf.save(`${fileName}.pdf`);
    toast.dismiss(loadingToast);
    toast.success('PDF exported successfully!');
  } catch (error) {
    console.error('PDF generation failed:', error);
    toast.dismiss(loadingToast);
    toast.error('Failed to generate PDF. Please try again.');
  }
}

/**
 * Export to DOCX format
 */
async function exportToDOCX(resumeData: Resume, fileName: string) {
  const loadingToast = toast.loading('Generating DOCX...');
  
  try {
    // Dynamically import docx library
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } = await import('docx');
    
    const children: any[] = [];
    
    // Personal Information Header
    if (resumeData.personalInfo) {
      const info = resumeData.personalInfo;
      
      if (info.fullName) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: info.fullName,
                bold: true,
                size: 32,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          })
        );
      }
      
      if (info.title) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: info.title,
                size: 24,
                color: '666666',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          })
        );
      }
      
      // Contact info line
      const contactParts: string[] = [];
      if (info.email) contactParts.push(info.email);
      if (info.phone) contactParts.push(info.phone);
      if (info.location) contactParts.push(info.location);
      
      if (contactParts.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: contactParts.join(' | '),
                size: 20,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          })
        );
      }
      
      // Links line
      const linkParts: string[] = [];
      if (info.linkedin) linkParts.push(info.linkedin);
      if (info.portfolio) linkParts.push(info.portfolio);
      
      if (linkParts.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: linkParts.join(' | '),
                size: 20,
                color: '0066CC',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          })
        );
      }
    }
    
    // Professional Summary
    if (resumeData.summary) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'PROFESSIONAL SUMMARY',
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          border: {
            bottom: {
              color: '000000',
              space: 1,
              size: 6,
              style: BorderStyle.SINGLE,
            },
          },
        })
      );
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.summary,
              size: 22,
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }
    
    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'PROFESSIONAL EXPERIENCE',
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          border: {
            bottom: {
              color: '000000',
              space: 1,
              size: 6,
              style: BorderStyle.SINGLE,
            },
          },
        })
      );
      
      for (const exp of resumeData.experience) {
        // Job title and company
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.position || 'Position',
                bold: true,
                size: 22,
              }),
              new TextRun({
                text: ` at ${exp.company || 'Company'}`,
                size: 22,
              }),
            ],
            spacing: { before: 150, after: 50 },
          })
        );
        
        // Dates and location
        const dateText = `${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`;
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: dateText,
                italics: true,
                size: 20,
                color: '666666',
              }),
            ],
            spacing: { after: 100 },
          })
        );
        
        // Description
        if (exp.description) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.description,
                  size: 22,
                }),
              ],
              spacing: { after: 100 },
            })
          );
        }
        
        // Achievements as bullet points
        if (exp.achievements && exp.achievements.length > 0) {
          for (const achievement of exp.achievements) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${achievement}`,
                    size: 22,
                  }),
                ],
                indent: { left: 360 },
                spacing: { after: 50 },
              })
            );
          }
        }
      }
    }
    
    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'EDUCATION',
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          border: {
            bottom: {
              color: '000000',
              space: 1,
              size: 6,
              style: BorderStyle.SINGLE,
            },
          },
        })
      );
      
      for (const edu of resumeData.education) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.degree || 'Degree',
                bold: true,
                size: 22,
              }),
              edu.field ? new TextRun({
                text: ` in ${edu.field}`,
                size: 22,
              }) : new TextRun({ text: '' }),
            ],
            spacing: { before: 150, after: 50 },
          })
        );
        
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.institution || 'Institution',
                size: 22,
              }),
              edu.graduationDate ? new TextRun({
                text: ` | ${edu.graduationDate}`,
                italics: true,
                size: 20,
                color: '666666',
              }) : new TextRun({ text: '' }),
            ],
            spacing: { after: 50 },
          })
        );
        
        if (edu.gpa) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `GPA: ${edu.gpa}`,
                  size: 20,
                }),
              ],
              spacing: { after: 100 },
            })
          );
        }
      }
    }
    
    // Skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'SKILLS',
              bold: true,
              size: 24,
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          border: {
            bottom: {
              color: '000000',
              space: 1,
              size: 6,
              style: BorderStyle.SINGLE,
            },
          },
        })
      );
      
      // Group skills by category if available
      const skillsByCategory = new Map<string, string[]>();
      
      for (const skill of resumeData.skills) {
        const category = skill.category || 'Other';
        if (!skillsByCategory.has(category)) {
          skillsByCategory.set(category, []);
        }
        skillsByCategory.get(category)!.push(skill.name);
      }
      
      for (const [category, skills] of skillsByCategory) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${category}: `,
                bold: true,
                size: 22,
              }),
              new TextRun({
                text: skills.join(', '),
                size: 22,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }
    }
    
    // Create the document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 720,    // 0.5 inch
                right: 720,
                bottom: 720,
                left: 720,
              },
            },
          },
          children: children,
        },
      ],
    });
    
    // Generate and download
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.dismiss(loadingToast);
    toast.success('DOCX exported successfully!');
  } catch (error) {
    console.error('DOCX generation failed:', error);
    toast.dismiss(loadingToast);
    toast.error('Failed to generate DOCX. Please try again.');
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

  // Note: Projects and Certifications are not part of the Resume type
  // They are part of ResumeData type used in the builder


  // Keywords (if any)
  if (resumeData.keywords && resumeData.keywords.length > 0) {
    lines.push('KEYWORDS');
    lines.push('-'.repeat(50));
    lines.push(resumeData.keywords.join(', '));
    lines.push('');
  }
  
  return lines.join('\n');
}
