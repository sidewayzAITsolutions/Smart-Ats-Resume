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
 * Export to DOCX format - Complete and professional formatting
 */
async function exportToDOCX(resumeData: any, fileName: string) {
  const loadingToast = toast.loading('Generating DOCX...');
  
  try {
    // Dynamically import docx library
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, TabStopType, TabStopPosition, convertInchesToTwip } = await import('docx');
    
    const children: any[] = [];
    
    // Helper function to create a section header
    const createSectionHeader = (title: string) => {
      return new Paragraph({
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24,
            font: 'Calibri',
          }),
        ],
        spacing: { before: 240, after: 120 },
        border: {
          bottom: {
            color: '2E74B5',
            space: 1,
            size: 12,
            style: BorderStyle.SINGLE,
          },
        },
      });
    };
    
    // ===== PERSONAL INFORMATION HEADER =====
    if (resumeData.personalInfo) {
      const info = resumeData.personalInfo;
      
      // Full Name - Large and centered
      if (info.fullName) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: info.fullName,
                bold: true,
                size: 36,
                font: 'Calibri',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
          })
        );
      }
      
      // Job Title
      if (info.title) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: info.title,
                size: 24,
                color: '555555',
                font: 'Calibri',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 160 },
          })
        );
      }
      
      // Contact Information Line
      const contactParts: string[] = [];
      if (info.email) contactParts.push(info.email);
      if (info.phone) contactParts.push(info.phone);
      if (info.location) contactParts.push(info.location);
      
      if (contactParts.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: contactParts.join('  •  '),
                size: 20,
                font: 'Calibri',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
          })
        );
      }
      
      // Links Line (LinkedIn, Portfolio)
      const linkParts: string[] = [];
      if (info.linkedin) linkParts.push(info.linkedin);
      if (info.portfolio) linkParts.push(info.portfolio);
      
      if (linkParts.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: linkParts.join('  •  '),
                size: 20,
                color: '0563C1',
                font: 'Calibri',
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
          })
        );
      }
    }
    
    // ===== PROFESSIONAL SUMMARY =====
    if (resumeData.summary && resumeData.summary.trim()) {
      children.push(createSectionHeader('Professional Summary'));
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.summary,
              size: 22,
              font: 'Calibri',
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }
    
    // ===== PROFESSIONAL EXPERIENCE =====
    if (resumeData.experience && resumeData.experience.length > 0) {
      children.push(createSectionHeader('Professional Experience'));
      
      for (const exp of resumeData.experience) {
        // Job Title - Bold
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.position || exp.title || 'Position',
                bold: true,
                size: 24,
                font: 'Calibri',
              }),
            ],
            spacing: { before: 160, after: 40 },
          })
        );
        
        // Company and Dates on same line
        const dateText = `${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}`;
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: exp.company || 'Company',
                size: 22,
                font: 'Calibri',
              }),
              new TextRun({
                text: `\t${dateText}`,
                size: 22,
                italics: true,
                color: '666666',
                font: 'Calibri',
              }),
            ],
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: TabStopPosition.MAX,
              },
            ],
            spacing: { after: 80 },
          })
        );
        
        // Description - Parse line by line if it contains bullet points
        if (exp.description) {
          const lines = exp.description.split('\n').filter((line: string) => line.trim());
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            // Check if line starts with a bullet-like character
            const isBullet = /^[•\-\*\–]/.test(trimmedLine);
            const cleanLine = isBullet ? trimmedLine.replace(/^[•\-\*\–]\s*/, '') : trimmedLine;
            
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: isBullet ? `• ${cleanLine}` : cleanLine,
                    size: 22,
                    font: 'Calibri',
                  }),
                ],
                indent: isBullet ? { left: convertInchesToTwip(0.25) } : undefined,
                spacing: { after: 40 },
              })
            );
          }
        }
        
        // Achievements as bullet points
        if (exp.achievements && exp.achievements.length > 0) {
          for (const achievement of exp.achievements) {
            if (achievement && achievement.trim()) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${achievement}`,
                      size: 22,
                      font: 'Calibri',
                    }),
                  ],
                  indent: { left: convertInchesToTwip(0.25) },
                  spacing: { after: 40 },
                })
              );
            }
          }
        }
      }
    }
    
    // ===== EDUCATION =====
    if (resumeData.education && resumeData.education.length > 0) {
      children.push(createSectionHeader('Education'));
      
      for (const edu of resumeData.education) {
        // Degree and Field
        const degreeText = [edu.degree, edu.field].filter(Boolean).join(' in ');
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: degreeText || 'Degree',
                bold: true,
                size: 24,
                font: 'Calibri',
              }),
            ],
            spacing: { before: 160, after: 40 },
          })
        );
        
        // Institution and Date
        const gradDate = edu.graduationDate || edu.endDate || '';
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.institution || edu.school || 'Institution',
                size: 22,
                font: 'Calibri',
              }),
              gradDate ? new TextRun({
                text: `\t${gradDate}`,
                size: 22,
                italics: true,
                color: '666666',
                font: 'Calibri',
              }) : new TextRun({ text: '' }),
            ],
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: TabStopPosition.MAX,
              },
            ],
            spacing: { after: 40 },
          })
        );
        
        // GPA if present
        if (edu.gpa) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `GPA: ${edu.gpa}`,
                  size: 20,
                  font: 'Calibri',
                }),
              ],
              spacing: { after: 40 },
            })
          );
        }
        
        // Education achievements if any
        if (edu.achievements && edu.achievements.length > 0) {
          for (const achievement of edu.achievements) {
            if (achievement && achievement.trim()) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${achievement}`,
                      size: 22,
                      font: 'Calibri',
                    }),
                  ],
                  indent: { left: convertInchesToTwip(0.25) },
                  spacing: { after: 40 },
                })
              );
            }
          }
        }
      }
    }
    
    // ===== SKILLS =====
    if (resumeData.skills && resumeData.skills.length > 0) {
      children.push(createSectionHeader('Skills'));
      
      // Group skills by category
      const skillsByCategory = new Map<string, string[]>();
      
      for (const skill of resumeData.skills) {
        const skillName = typeof skill === 'string' ? skill : skill.name;
        const category = (typeof skill === 'object' && skill.category) ? formatCategory(skill.category) : 'Other';
        
        if (!skillsByCategory.has(category)) {
          skillsByCategory.set(category, []);
        }
        skillsByCategory.get(category)!.push(skillName);
      }
      
      // If all skills are in "Other", just list them without categories
      if (skillsByCategory.size === 1 && skillsByCategory.has('Other')) {
        const allSkills = skillsByCategory.get('Other')!;
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: allSkills.join(', '),
                size: 22,
                font: 'Calibri',
              }),
            ],
            spacing: { after: 80 },
          })
        );
      } else {
        // List by category
        for (const [category, skills] of skillsByCategory) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${category}: `,
                  bold: true,
                  size: 22,
                  font: 'Calibri',
                }),
                new TextRun({
                  text: skills.join(', '),
                  size: 22,
                  font: 'Calibri',
                }),
              ],
              spacing: { after: 80 },
            })
          );
        }
      }
    }
    
    // ===== PROJECTS =====
    if (resumeData.projects && resumeData.projects.length > 0) {
      children.push(createSectionHeader('Projects'));
      
      for (const project of resumeData.projects) {
        // Project Name
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: project.name || project.title || 'Project',
                bold: true,
                size: 24,
                font: 'Calibri',
              }),
            ],
            spacing: { before: 160, after: 40 },
          })
        );
        
        // Description
        if (project.description) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: project.description,
                  size: 22,
                  font: 'Calibri',
                }),
              ],
              spacing: { after: 60 },
            })
          );
        }
        
        // Technologies
        if (project.technologies && project.technologies.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Technologies: ',
                  bold: true,
                  size: 20,
                  font: 'Calibri',
                }),
                new TextRun({
                  text: project.technologies.join(', '),
                  size: 20,
                  font: 'Calibri',
                }),
              ],
              spacing: { after: 40 },
            })
          );
        }
        
        // URL if present
        if (project.url || project.link) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: project.url || project.link,
                  size: 20,
                  color: '0563C1',
                  font: 'Calibri',
                }),
              ],
              spacing: { after: 40 },
            })
          );
        }
      }
    }
    
    // ===== CERTIFICATIONS =====
    if (resumeData.certifications && resumeData.certifications.length > 0) {
      children.push(createSectionHeader('Certifications'));
      
      for (const cert of resumeData.certifications) {
        const certName = cert.name || cert.title || 'Certification';
        const issuer = cert.issuer || cert.organization || '';
        const date = cert.date || cert.dateObtained || '';
        
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: certName,
                bold: true,
                size: 22,
                font: 'Calibri',
              }),
              issuer ? new TextRun({
                text: ` – ${issuer}`,
                size: 22,
                font: 'Calibri',
              }) : new TextRun({ text: '' }),
              date ? new TextRun({
                text: `\t${date}`,
                size: 22,
                italics: true,
                color: '666666',
                font: 'Calibri',
              }) : new TextRun({ text: '' }),
            ],
            tabStops: [
              {
                type: TabStopType.RIGHT,
                position: TabStopPosition.MAX,
              },
            ],
            spacing: { after: 60 },
          })
        );
        
        // Expiration date if present
        if (cert.expirationDate) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Expires: ${cert.expirationDate}`,
                  size: 20,
                  italics: true,
                  color: '888888',
                  font: 'Calibri',
                }),
              ],
              spacing: { after: 40 },
            })
          );
        }
      }
    }
    
    // Create the document with proper formatting
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: 'Calibri',
              size: 22,
            },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(0.75),
                right: convertInchesToTwip(0.75),
                bottom: convertInchesToTwip(0.75),
                left: convertInchesToTwip(0.75),
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
 * Helper to format skill category names
 */
function formatCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    'technical': 'Technical Skills',
    'soft': 'Soft Skills',
    'language': 'Languages',
    'certification': 'Certifications',
    'other': 'Other',
  };
  return categoryMap[category.toLowerCase()] || category;
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
