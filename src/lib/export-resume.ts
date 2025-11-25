// src/lib/export-resume.ts

import { Resume } from '@/types/resume';
import jsPDF from 'jspdf';
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
 * Export to PDF with native text rendering for perfect output
 */
async function exportToPDF(resumeData: any, fileName: string) {
  const loadingToast = toast.loading('Generating PDF...');
  
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = margin;
    
    // Colors
    const primaryColor = '#1a1a1a';
    const secondaryColor = '#555555';
    const accentColor = '#2E74B5';
    const linkColor = '#0563C1';
    
    // Helper function to check if we need a new page
    const checkNewPage = (heightNeeded: number): void => {
      if (currentY + heightNeeded > pageHeight - margin) {
        pdf.addPage();
        currentY = margin;
      }
    };
    
    // Helper to draw section header with underline
    const drawSectionHeader = (title: string): void => {
      checkNewPage(15);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.setTextColor(accentColor);
      pdf.text(title.toUpperCase(), margin, currentY);
      currentY += 2;
      pdf.setDrawColor(accentColor);
      pdf.setLineWidth(0.5);
      pdf.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 6;
      pdf.setTextColor(primaryColor);
    };
    
    // Helper to wrap text and return lines
    const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
      pdf.setFontSize(fontSize);
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = pdf.getTextWidth(testLine);
        
        if (testWidth > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      return lines;
    };
    
    // Helper to draw wrapped text
    const drawWrappedText = (text: string, x: number, maxWidth: number, fontSize: number, lineHeight: number): void => {
      const lines = wrapText(text, maxWidth, fontSize);
      for (const line of lines) {
        checkNewPage(lineHeight);
        pdf.text(line, x, currentY);
        currentY += lineHeight;
      }
    };
    
    // ===== PERSONAL INFORMATION HEADER =====
    if (resumeData.personalInfo) {
      const info = resumeData.personalInfo;
      
      // Full Name - Large and centered
      if (info.fullName) {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(22);
        pdf.setTextColor(primaryColor);
        const nameWidth = pdf.getTextWidth(info.fullName);
        pdf.text(info.fullName, (pageWidth - nameWidth) / 2, currentY);
        currentY += 8;
      }
      
      // Job Title - Centered
      if (info.title) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(12);
        pdf.setTextColor(secondaryColor);
        const titleWidth = pdf.getTextWidth(info.title);
        pdf.text(info.title, (pageWidth - titleWidth) / 2, currentY);
        currentY += 6;
      }
      
      // Contact Information Line - Centered
      const contactParts: string[] = [];
      if (info.email) contactParts.push(info.email);
      if (info.phone) contactParts.push(info.phone);
      if (info.location) contactParts.push(info.location);
      
      if (contactParts.length > 0) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(primaryColor);
        const contactText = contactParts.join('  •  ');
        const contactWidth = pdf.getTextWidth(contactText);
        pdf.text(contactText, (pageWidth - contactWidth) / 2, currentY);
        currentY += 5;
      }
      
      // Links Line (LinkedIn, Portfolio) - Centered
      const linkParts: string[] = [];
      if (info.linkedin) linkParts.push(info.linkedin);
      if (info.portfolio) linkParts.push(info.portfolio);
      
      if (linkParts.length > 0) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(linkColor);
        const linksText = linkParts.join('  •  ');
        const linksWidth = pdf.getTextWidth(linksText);
        pdf.text(linksText, (pageWidth - linksWidth) / 2, currentY);
        currentY += 5;
      }
      
      currentY += 5; // Extra spacing after header
    }
    
    // ===== PROFESSIONAL SUMMARY =====
    if (resumeData.summary && resumeData.summary.trim()) {
      drawSectionHeader('Professional Summary');
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(primaryColor);
      drawWrappedText(resumeData.summary, margin, contentWidth, 10, 4.5);
      currentY += 4;
    }
    
    // ===== PROFESSIONAL EXPERIENCE =====
    if (resumeData.experience && resumeData.experience.length > 0) {
      drawSectionHeader('Professional Experience');
      
      for (const exp of resumeData.experience) {
        checkNewPage(20);
        
        // Job Title - Bold
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(primaryColor);
        const position = exp.position || exp.title || 'Position';
        pdf.text(position, margin, currentY);
        
        // Date - Right aligned
        const dateText = `${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}`;
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(10);
        pdf.setTextColor(secondaryColor);
        const dateWidth = pdf.getTextWidth(dateText);
        pdf.text(dateText, pageWidth - margin - dateWidth, currentY);
        currentY += 5;
        
        // Company
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(secondaryColor);
        pdf.text(exp.company || 'Company', margin, currentY);
        currentY += 5;
        
        // Description - Parse and render bullet points
        if (exp.description) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          pdf.setTextColor(primaryColor);
          
          const lines = exp.description.split('\n').filter((line: string) => line.trim());
          for (const line of lines) {
            const trimmedLine = line.trim();
            const isBullet = /^[•\-\*\–]/.test(trimmedLine);
            const cleanLine = isBullet ? trimmedLine.replace(/^[•\-\*\–]\s*/, '') : trimmedLine;
            
            if (isBullet) {
              checkNewPage(5);
              pdf.text('•', margin + 2, currentY);
              const bulletLines = wrapText(cleanLine, contentWidth - 8, 10);
              for (let i = 0; i < bulletLines.length; i++) {
                if (i > 0) {
                  checkNewPage(4.5);
                }
                pdf.text(bulletLines[i], margin + 6, currentY);
                currentY += 4.5;
              }
            } else {
              drawWrappedText(cleanLine, margin, contentWidth, 10, 4.5);
            }
          }
        }
        
        // Achievements as bullet points
        if (exp.achievements && exp.achievements.length > 0) {
          for (const achievement of exp.achievements) {
            if (achievement && achievement.trim()) {
              checkNewPage(5);
              pdf.setFont('helvetica', 'normal');
              pdf.setFontSize(10);
              pdf.setTextColor(primaryColor);
              pdf.text('•', margin + 2, currentY);
              const bulletLines = wrapText(achievement, contentWidth - 8, 10);
              for (let i = 0; i < bulletLines.length; i++) {
                if (i > 0) {
                  checkNewPage(4.5);
                }
                pdf.text(bulletLines[i], margin + 6, currentY);
                currentY += 4.5;
              }
            }
          }
        }
        
        currentY += 3; // Space between jobs
      }
    }
    
    // ===== EDUCATION =====
    if (resumeData.education && resumeData.education.length > 0) {
      drawSectionHeader('Education');
      
      for (const edu of resumeData.education) {
        checkNewPage(15);
        
        // Degree and Field - Bold
        const degreeText = [edu.degree, edu.field].filter(Boolean).join(' in ');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(primaryColor);
        pdf.text(degreeText || 'Degree', margin, currentY);
        
        // Date - Right aligned
        const gradDate = edu.graduationDate || edu.endDate || '';
        if (gradDate) {
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(10);
          pdf.setTextColor(secondaryColor);
          const dateWidth = pdf.getTextWidth(String(gradDate));
          pdf.text(String(gradDate), pageWidth - margin - dateWidth, currentY);
        }
        currentY += 5;
        
        // Institution
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(secondaryColor);
        pdf.text(edu.institution || edu.school || 'Institution', margin, currentY);
        currentY += 4;
        
        // GPA if present
        if (edu.gpa) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          pdf.setTextColor(primaryColor);
          pdf.text(`GPA: ${edu.gpa}`, margin, currentY);
          currentY += 4;
        }
        
        currentY += 2; // Space between education entries
      }
    }
    
    // ===== SKILLS =====
    if (resumeData.skills && resumeData.skills.length > 0) {
      drawSectionHeader('Skills');
      
      // Group skills by category
      const skillsByCategory = new Map<string, string[]>();
      
      for (const skill of resumeData.skills) {
        const skillName = typeof skill === 'string' ? skill : skill.name;
        const category = (typeof skill === 'object' && skill.category) ? formatCategory(skill.category) : 'Skills';
        
        if (!skillsByCategory.has(category)) {
          skillsByCategory.set(category, []);
        }
        skillsByCategory.get(category)!.push(skillName);
      }
      
      // Render skills - if only one category, don't show category name
      if (skillsByCategory.size === 1) {
        const allSkills = Array.from(skillsByCategory.values())[0];
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(primaryColor);
        drawWrappedText(allSkills.join(', '), margin, contentWidth, 10, 4.5);
      } else {
        for (const [category, skills] of skillsByCategory) {
          checkNewPage(6);
          
          // Category name bold
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(10);
          pdf.setTextColor(primaryColor);
          pdf.text(`${category}: `, margin, currentY);
          
          // Skills normal
          const categoryWidth = pdf.getTextWidth(`${category}: `);
          pdf.setFont('helvetica', 'normal');
          const skillsText = skills.join(', ');
          const remainingWidth = contentWidth - categoryWidth;
          
          // Check if skills fit on one line
          const skillsWidth = pdf.getTextWidth(skillsText);
          if (skillsWidth <= remainingWidth) {
            pdf.text(skillsText, margin + categoryWidth, currentY);
            currentY += 5;
          } else {
            // Wrap skills text
            const skillLines = wrapText(skillsText, contentWidth, 10);
            pdf.text(skillLines[0].substring(0, Math.floor(remainingWidth / pdf.getTextWidth('a') * skillLines[0].length)), margin + categoryWidth, currentY);
            currentY += 4.5;
            for (let i = 1; i < skillLines.length; i++) {
              checkNewPage(4.5);
              pdf.text(skillLines[i], margin, currentY);
              currentY += 4.5;
            }
          }
        }
      }
      currentY += 2;
    }
    
    // ===== PROJECTS =====
    if (resumeData.projects && resumeData.projects.length > 0) {
      drawSectionHeader('Projects');
      
      for (const project of resumeData.projects) {
        checkNewPage(15);
        
        // Project Name - Bold
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(primaryColor);
        pdf.text(project.name || project.title || 'Project', margin, currentY);
        currentY += 5;
        
        // Description
        if (project.description) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          pdf.setTextColor(primaryColor);
          drawWrappedText(project.description, margin, contentWidth, 10, 4.5);
        }
        
        // Technologies
        if (project.technologies && project.technologies.length > 0) {
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(9);
          pdf.setTextColor(secondaryColor);
          const techText = `Technologies: ${project.technologies.join(', ')}`;
          drawWrappedText(techText, margin, contentWidth, 9, 4);
        }
        
        // URL
        if (project.url || project.link) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          pdf.setTextColor(linkColor);
          pdf.text(project.url || project.link, margin, currentY);
          currentY += 4;
        }
        
        currentY += 3;
      }
    }
    
    // ===== CERTIFICATIONS =====
    if (resumeData.certifications && resumeData.certifications.length > 0) {
      drawSectionHeader('Certifications');
      
      for (const cert of resumeData.certifications) {
        checkNewPage(8);
        
        const certName = cert.name || cert.title || 'Certification';
        const issuer = cert.issuer || cert.organization || '';
        const date = cert.date || cert.dateObtained || '';
        
        // Certification name - Bold
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(primaryColor);
        
        let certText = certName;
        if (issuer) certText += ` – ${issuer}`;
        pdf.text(certText, margin, currentY);
        
        // Date - Right aligned
        if (date) {
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(9);
          pdf.setTextColor(secondaryColor);
          const dateWidth = pdf.getTextWidth(date);
          pdf.text(date, pageWidth - margin - dateWidth, currentY);
        }
        currentY += 5;
        
        // Expiration if present
        if (cert.expirationDate) {
          pdf.setFont('helvetica', 'italic');
          pdf.setFontSize(9);
          pdf.setTextColor(secondaryColor);
          pdf.text(`Expires: ${cert.expirationDate}`, margin, currentY);
          currentY += 4;
        }
      }
    }
    
    // Save the PDF
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
