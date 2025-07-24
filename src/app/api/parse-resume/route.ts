import { NextResponse } from 'next/server';

// Enhanced parsing with multiple libraries
let pdfParse: any = null;
let mammoth: any = null;
let natural: any = null;
let compromise: any = null;

// Dynamic imports to handle potential library issues
async function loadLibraries() {
  try {
    if (!pdfParse) {
      pdfParse = (await import('pdf-parse')).default;
    }
    if (!mammoth) {
      mammoth = await import('mammoth');
    }
    if (!natural) {
      natural = await import('natural');
    }
    if (!compromise) {
      compromise = (await import('compromise')).default;
    }
  } catch (error) {
    console.warn('Some parsing libraries not available:', error);
  }
}

export async function POST(request: Request) {
  try {
    console.log('Enhanced Parse resume API called');
    await loadLibraries();

    const formData = await request.formData();
    const file = formData.get('resume') as File;

    console.log('File received:', file ? `${file.name} (${file.size} bytes, ${file.type})` : 'No file');

    if (!file) {
      return NextResponse.json(
        { message: 'No file uploaded', success: false },
        { status: 400 }
      );
    }

    // Enhanced file type validation
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/rtf',
      'application/rtf'
    ];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          message: 'Invalid file type. Please upload PDF, DOC, DOCX, RTF, or TXT files.',
          success: false
        },
        { status: 400 }
      );
    }

    // File size validation (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'File size must be less than 10MB.', success: false },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Enhanced parsing based on file type
    let extractedText = '';
    let parsingMethod = '';

    if (file.type === 'application/pdf') {
      const result = await parseEnhancedPDF(buffer);
      extractedText = result.text;
      parsingMethod = result.method;
    } else if (file.type === 'text/plain') {
      extractedText = buffer.toString('utf-8');
      parsingMethod = 'text';
    } else if (file.type.includes('word') || file.type.includes('document')) {
      const result = await parseEnhancedDocument(buffer);
      extractedText = result.text;
      parsingMethod = result.method;
    } else if (file.type.includes('rtf')) {
      extractedText = await parseRTF(buffer);
      parsingMethod = 'rtf';
    }

    console.log(`Extracted text length: ${extractedText.length} chars using ${parsingMethod}`);
    console.log('First 500 chars:', extractedText.substring(0, 500));

    if (!extractedText || extractedText.length < 50) {
      return NextResponse.json({
        success: false,
        message: 'Could not extract readable text from the file. Please try a different format or enter information manually.',
        data: getEmptyResumeData()
      });
    }

    // Enhanced structured data extraction
    const parsedData = await extractEnhancedData(extractedText);

    // Calculate extraction confidence
    const confidence = calculateExtractionConfidence(parsedData);

    console.log('Enhanced parsed data:', JSON.stringify(parsedData, null, 2));
    console.log('Extraction confidence:', confidence);

    // Determine success message based on confidence
    let message = 'Resume parsed successfully';
    if (confidence.overall < 0.3) {
      message = 'File uploaded successfully, but automatic extraction was limited. Please review and fill in missing information.';
    } else if (confidence.overall < 0.7) {
      message = 'Resume parsed with moderate success. Please review the extracted information for accuracy.';
    } else {
      message = 'Resume parsed successfully with high confidence. Please review the extracted information.';
    }

    const response = {
      success: true,
      data: parsedData,
      confidence: confidence,
      parsingMethod: parsingMethod,
      message: message
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Enhanced resume parsing error:', error);
    return NextResponse.json(
      {
        message: 'Failed to parse resume. Please try again or fill in the fields manually.',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Enhanced PDF parsing with multiple fallback methods
async function parseEnhancedPDF(buffer: Buffer): Promise<{text: string, method: string}> {
  console.log('Attempting enhanced PDF parsing, size:', buffer.length, 'bytes');

  // Method 1: Try pdf-parse library
  if (pdfParse) {
    try {
      const data = await pdfParse(buffer);
      if (data.text && data.text.length > 50) {
        console.log('PDF parsed successfully with pdf-parse');
        return { text: data.text, method: 'pdf-parse' };
      }
    } catch (error) {
      console.warn('pdf-parse failed:', error);
    }
  }

  // Method 2: Basic PDF text extraction (fallback)
  try {
    const text = buffer.toString('utf-8');
    const cleanText = text
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanText.length > 50) {
      console.log('PDF parsed with basic text extraction');
      return { text: cleanText, method: 'basic-pdf' };
    }
  } catch (error) {
    console.warn('Basic PDF extraction failed:', error);
  }

  // Method 3: Return helpful message for manual entry
  console.log('PDF parsing failed, returning manual entry message');
  return {
    text: 'PDF file uploaded successfully. The document appears to be in a complex format. Please manually enter your information below for the best results.',
    method: 'manual-fallback'
  };
}

// Enhanced document parsing with mammoth.js for DOC/DOCX
async function parseEnhancedDocument(buffer: Buffer): Promise<{text: string, method: string}> {
  console.log('Attempting enhanced document parsing, size:', buffer.length, 'bytes');

  // Method 1: Try mammoth.js for DOCX files
  if (mammoth) {
    try {
      const result = await mammoth.extractRawText({ buffer: buffer });
      if (result.value && result.value.length > 50) {
        console.log('Document parsed successfully with mammoth.js');
        if (result.messages && result.messages.length > 0) {
          console.log('Mammoth warnings:', result.messages);
        }
        return { text: result.value, method: 'mammoth' };
      }
    } catch (error) {
      console.warn('Mammoth.js parsing failed:', error);
    }
  }

  // Method 2: Basic text extraction (fallback)
  try {
    const text = buffer.toString('utf-8');
    let cleanText = text
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // Remove non-printable characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    if (cleanText.length > 50) {
      console.log('Document parsed with basic text extraction');
      return { text: cleanText, method: 'basic-doc' };
    }
  } catch (error) {
    console.warn('Basic document extraction failed:', error);
  }

  // Method 3: Return helpful message
  console.log('Document parsing failed, returning manual entry message');
  return {
    text: 'Document uploaded successfully, but automatic text extraction was limited. Please manually enter your information below.',
    method: 'manual-fallback'
  };
}

// RTF parsing function
async function parseRTF(buffer: Buffer): Promise<string> {
  try {
    // Basic RTF text extraction
    const text = buffer.toString('utf-8');
    // Remove RTF control codes and extract plain text
    let cleanText = text
      .replace(/\\[a-z]+\d*\s?/g, ' ') // Remove RTF control words
      .replace(/[{}]/g, ' ') // Remove braces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    if (cleanText.length > 50) {
      return cleanText;
    }

    return 'RTF file uploaded successfully. Please manually enter your information below.';
  } catch (error) {
    console.error('RTF parsing error:', error);
    return 'RTF file uploaded successfully, but text extraction failed. Please fill in the fields manually.';
  }
}

// Enhanced data extraction using multiple algorithms
async function extractEnhancedData(text: string): Promise<any> {
  console.log('Starting enhanced data extraction...');

  // Preprocess text for better parsing
  const processedText = preprocessText(text);

  // Extract data using multiple methods
  const personal = await extractEnhancedPersonal(processedText);
  const summary = await extractEnhancedSummary(processedText);
  const experience = await extractEnhancedExperience(processedText);
  const education = await extractEnhancedEducation(processedText);
  const skills = await extractEnhancedSkills(processedText);
  const certifications = extractCertifications(processedText);
  const languages = extractLanguages(processedText);

  return {
    personal,
    summary,
    experience,
    education,
    skills,
    certifications,
    languages
  };
}

// Text preprocessing for better extraction
function preprocessText(text: string): string {
  return text
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\t/g, ' ') // Replace tabs with spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
    .trim();
}

// Enhanced personal information extraction
async function extractEnhancedPersonal(text: string): Promise<any> {
  const personal = {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: ''
  };

  // Enhanced email extraction with multiple patterns
  const emailPatterns = [
    /[\w.-]+@[\w.-]+\.\w+/g,
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  ];

  for (const pattern of emailPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      personal.email = matches[0];
      break;
    }
  }

  // Enhanced phone extraction with international formats
  const phonePatterns = [
    /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
    /(\+?\d{1,3}[-.\s]?)?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g,
    /(\+?\d{1,3}[-.\s]?)?\d{10}/g
  ];

  for (const pattern of phonePatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      personal.phone = matches[0];
      break;
    }
  }

  // Enhanced name extraction
  personal.fullName = extractEnhancedName(text);

  // Location extraction
  personal.location = extractLocation(text);

  // Social media and website extraction
  personal.linkedin = extractLinkedIn(text);
  personal.github = extractGitHub(text);
  personal.website = extractWebsite(text);

  return personal;
}

function getEmptyResumeData() {
  return {
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: []
  };
}

// Enhanced name extraction with multiple strategies
function extractEnhancedName(text: string): string {
  const lines = text.split('\n').filter(line => line.trim().length > 0);

  // Strategy 1: First line name detection
  const firstLine = lines[0]?.trim() || '';
  const namePattern = /^[A-Za-z\s]{2,50}$/;
  if (namePattern.test(firstLine) && firstLine.split(' ').length >= 2 && firstLine.split(' ').length <= 4) {
    return firstLine;
  }

  // Strategy 2: Look for "Name:" or similar labels
  const nameLabels = ['name:', 'full name:', 'candidate:', 'applicant:'];
  for (const line of lines.slice(0, 10)) {
    const lowerLine = line.toLowerCase();
    for (const label of nameLabels) {
      if (lowerLine.includes(label)) {
        const nameMatch = line.substring(line.toLowerCase().indexOf(label) + label.length).trim();
        if (nameMatch && nameMatch.length > 2 && nameMatch.length < 50) {
          return nameMatch;
        }
      }
    }
  }

  // Strategy 3: Pattern matching for names in first few lines
  for (const line of lines.slice(0, 5)) {
    const words = line.trim().split(/\s+/);
    if (words.length >= 2 && words.length <= 4) {
      const isLikelyName = words.every(word =>
        /^[A-Z][a-z]+$/.test(word) && word.length > 1 && word.length < 20
      );
      if (isLikelyName) {
        return words.join(' ');
      }
    }
  }

  return '';
}

// Location extraction
function extractLocation(text: string): string {
  const locationPatterns = [
    /(?:address|location|city|residence):\s*([^,\n]+(?:,\s*[^,\n]+)*)/i,
    /([A-Z][a-z]+,\s*[A-Z]{2}(?:\s+\d{5})?)/g,
    /([A-Z][a-z]+\s+[A-Z][a-z]+,\s*[A-Z]{2})/g
  ];

  for (const pattern of locationPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      return matches[0].replace(/^(address|location|city|residence):\s*/i, '').trim();
    }
  }

  return '';
}

// LinkedIn extraction
function extractLinkedIn(text: string): string {
  const linkedinPatterns = [
    /linkedin\.com\/in\/[\w-]+/gi,
    /(?:linkedin|linked-in):\s*([\w-]+)/gi
  ];

  for (const pattern of linkedinPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      return matches[0];
    }
  }

  return '';
}

// GitHub extraction
function extractGitHub(text: string): string {
  const githubPatterns = [
    /github\.com\/[\w-]+/gi,
    /(?:github|git):\s*([\w-]+)/gi
  ];

  for (const pattern of githubPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      return matches[0];
    }
  }

  return '';
}

// Website extraction
function extractWebsite(text: string): string {
  const websitePatterns = [
    /(?:website|portfolio|blog):\s*(https?:\/\/[^\s]+)/gi,
    /(?:www\.)[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/gi
  ];

  for (const pattern of websitePatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0) {
      return matches[0].replace(/^(website|portfolio|blog):\s*/i, '').trim();
    }
  }

  return '';
}

// Enhanced summary extraction
async function extractEnhancedSummary(text: string): Promise<string> {
  const summaryKeywords = [
    'professional summary', 'summary', 'objective', 'profile', 'about me',
    'career objective', 'professional profile', 'overview', 'introduction'
  ];

  const lines = text.split('\n');
  let summaryText = '';

  // Strategy 1: Look for explicit summary sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase().trim();

    for (const keyword of summaryKeywords) {
      if (line.includes(keyword) && line.length < 100) {
        // Found a summary header, extract following content
        const summaryLines = [];
        let j = i + 1;

        while (j < lines.length && summaryLines.length < 10) {
          const nextLine = lines[j].trim();

          // Stop if we hit another section header
          if (nextLine.match(/^(experience|education|skills|work history|employment)/i)) {
            break;
          }

          // Skip empty lines and obvious headers
          if (nextLine && !nextLine.match(/^[A-Z\s]+$/) && nextLine.length > 10) {
            summaryLines.push(nextLine);
          }

          j++;
        }

        if (summaryLines.length > 0) {
          summaryText = summaryLines.join(' ').substring(0, 800);
          break;
        }
      }
    }

    if (summaryText) break;
  }

  // Strategy 2: If no explicit summary found, look for introductory paragraph
  if (!summaryText) {
    const firstParagraphs = text.split('\n\n').slice(1, 4); // Skip first paragraph (likely name/contact)

    for (const paragraph of firstParagraphs) {
      const cleanParagraph = paragraph.trim();
      if (cleanParagraph.length > 100 && cleanParagraph.length < 800) {
        // Check if it looks like a summary (contains professional keywords)
        const professionalKeywords = [
          'experience', 'skilled', 'professional', 'expertise', 'background',
          'specializing', 'focused', 'passionate', 'dedicated', 'accomplished'
        ];

        const hasKeywords = professionalKeywords.some(keyword =>
          cleanParagraph.toLowerCase().includes(keyword)
        );

        if (hasKeywords) {
          summaryText = cleanParagraph.substring(0, 800);
          break;
        }
      }
    }
  }

  return summaryText;
}

// Enhanced experience extraction with better parsing
async function extractEnhancedExperience(text: string): Promise<any[]> {
  const experienceKeywords = [
    'professional experience', 'work experience', 'experience', 'employment',
    'work history', 'career history', 'professional background'
  ];

  const lines = text.split('\n');
  const experiences: any[] = [];
  let inExperienceSection = false;
  let currentJob: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();

    // Check if we're entering experience section
    if (!inExperienceSection) {
      for (const keyword of experienceKeywords) {
        if (lowerLine.includes(keyword) && line.length < 100) {
          inExperienceSection = true;
          break;
        }
      }
      continue;
    }

    // Check if we're leaving experience section
    if (lowerLine.includes('education') || lowerLine.includes('skills') ||
        lowerLine.includes('certifications') || lowerLine.includes('projects')) {
      if (currentJob && currentJob.position) {
        experiences.push(currentJob);
      }
      break;
    }

    if (!line) continue;

    // Enhanced date pattern recognition
    const datePatterns = [
      /\b(19|20)\d{2}\s*[-–—]\s*(19|20)\d{2}\b/,
      /\b(19|20)\d{2}\s*[-–—]\s*present\b/i,
      /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(19|20)\d{2}/i,
      /\b\d{1,2}\/\d{4}\s*[-–—]\s*\d{1,2}\/\d{4}\b/,
      /\b\d{4}\s*[-–—]\s*\d{4}\b/
    ];

    const hasDate = datePatterns.some(pattern => pattern.test(line));

    if (hasDate) {
      // This line contains dates, likely a job period
      if (currentJob && currentJob.position) {
        experiences.push(currentJob);
      }

      currentJob = {
        id: Math.random().toString(36).substr(2, 9),
        position: '',
        company: '',
        years: line,
        description: '',
        achievements: []
      };
    } else if (currentJob && !currentJob.position && line.length > 5 && line.length < 150) {
      // This could be a job title
      const isLikelyJobTitle = !line.includes('@') && !line.includes('http') &&
                              !line.match(/^\d+/) && line.split(' ').length <= 10;

      if (isLikelyJobTitle) {
        currentJob.position = line;
      }
    } else if (currentJob && currentJob.position && !currentJob.company &&
               line.length > 2 && line.length < 100) {
      // This could be a company name
      const isLikelyCompany = !line.includes('@') && !line.includes('http') &&
                             !line.startsWith('•') && !line.startsWith('-');

      if (isLikelyCompany) {
        currentJob.company = line;
      }
    } else if (currentJob && currentJob.position) {
      // This could be a description or achievement
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        currentJob.achievements.push(line.substring(1).trim());
      } else if (line.length > 20) {
        if (!currentJob.description) {
          currentJob.description = line;
        } else {
          currentJob.description += ' ' + line;
        }
      }
    }
  }

  // Add the last job if exists
  if (currentJob && currentJob.position) {
    experiences.push(currentJob);
  }

  // Clean up and validate experiences
  return experiences
    .filter(exp => exp.position && exp.position.length > 2)
    .slice(0, 8) // Limit to 8 experiences
    .map(exp => ({
      ...exp,
      description: exp.description ? exp.description.substring(0, 500) : '',
      achievements: exp.achievements.slice(0, 5) // Limit achievements
    }));
}

// Enhanced education extraction
async function extractEnhancedEducation(text: string): Promise<any[]> {
  const educationKeywords = [
    'education', 'academic background', 'academic qualifications',
    'degrees', 'university', 'college', 'school'
  ];

  const lines = text.split('\n');
  const education: any[] = [];
  let inEducationSection = false;
  let currentEducation: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();

    // Check if we're entering education section
    if (!inEducationSection) {
      for (const keyword of educationKeywords) {
        if (lowerLine.includes(keyword) && line.length < 100) {
          inEducationSection = true;
          break;
        }
      }
      continue;
    }

    // Check if we're leaving education section
    if (lowerLine.includes('skills') || lowerLine.includes('experience') ||
        lowerLine.includes('certifications') || lowerLine.includes('projects')) {
      if (currentEducation && currentEducation.degree) {
        education.push(currentEducation);
      }
      break;
    }

    if (!line) continue;

    // Enhanced degree pattern recognition
    const degreePatterns = [
      /(bachelor|master|phd|doctorate|associate|diploma|certificate|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|m\.?b\.?a\.?)/i,
      /(degree|graduation|graduated)/i
    ];

    const hasDegree = degreePatterns.some(pattern => pattern.test(line));
    const hasYear = /\b(19|20)\d{2}\b/.test(line);

    if (hasDegree || hasYear) {
      // Start new education entry
      if (currentEducation && currentEducation.degree) {
        education.push(currentEducation);
      }

      currentEducation = {
        id: Math.random().toString(36).substr(2, 9),
        degree: '',
        institution: '',
        year: '',
        gpa: ''
      };

      if (hasDegree) {
        currentEducation.degree = line;
      }

      if (hasYear) {
        const yearMatch = line.match(/\b(19|20)\d{2}\b/);
        if (yearMatch) {
          currentEducation.year = yearMatch[0];
        }
      }
    } else if (currentEducation && line.length > 5 && line.length < 150) {
      // This could be an institution name
      const institutionKeywords = ['university', 'college', 'institute', 'school', 'academy'];
      const isLikelyInstitution = institutionKeywords.some(keyword =>
        lowerLine.includes(keyword)
      ) || line.split(' ').length <= 8;

      if (isLikelyInstitution && !currentEducation.institution) {
        currentEducation.institution = line;
      }

      // Check for GPA
      const gpaMatch = line.match(/gpa:?\s*(\d+\.?\d*)/i);
      if (gpaMatch) {
        currentEducation.gpa = gpaMatch[1];
      }
    }
  }

  // Add the last education if exists
  if (currentEducation && currentEducation.degree) {
    education.push(currentEducation);
  }

  // Clean up and validate education entries
  return education
    .filter(edu => edu.degree && edu.degree.length > 2)
    .slice(0, 5) // Limit to 5 education entries
    .map(edu => ({
      ...edu,
      degree: edu.degree.substring(0, 200),
      institution: edu.institution.substring(0, 200)
    }));
}

// Enhanced skills extraction with categorization
async function extractEnhancedSkills(text: string): Promise<string[]> {
  const skillsKeywords = [
    'skills', 'technical skills', 'competencies', 'technologies',
    'programming languages', 'tools', 'software', 'expertise'
  ];

  const lines = text.split('\n');
  const skills: Set<string> = new Set();
  let inSkillsSection = false;

  // Strategy 1: Extract from explicit skills section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();

    // Check if we're entering skills section
    if (!inSkillsSection) {
      for (const keyword of skillsKeywords) {
        if (lowerLine.includes(keyword) && line.length < 100) {
          inSkillsSection = true;
          break;
        }
      }
      continue;
    }

    // Check if we're leaving skills section
    if (lowerLine.includes('experience') || lowerLine.includes('education') ||
        lowerLine.includes('certifications') || lowerLine.includes('projects')) {
      break;
    }

    if (line) {
      // Enhanced skill extraction with multiple delimiters
      const delimiters = /[,•·|;\/\n\t]/;
      const lineSkills = line.split(delimiters)
        .map(s => s.trim())
        .filter(s => s.length > 1 && s.length < 50)
        .filter(s => !s.match(/^\d+$/)) // Remove pure numbers
        .filter(s => !s.match(/^[^\w\s]+$/)); // Remove pure symbols

      lineSkills.forEach(skill => skills.add(skill));
    }
  }

  // Strategy 2: Extract common technical skills from entire text
  const commonSkills = [
    // Programming Languages
    'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
    'TypeScript', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL', 'HTML', 'CSS',

    // Frameworks & Libraries
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
    'Laravel', 'Rails', 'jQuery', 'Bootstrap', 'Tailwind', 'Next.js', 'Nuxt.js',

    // Databases
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'Cassandra',

    // Cloud & DevOps
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub',
    'GitLab', 'CI/CD', 'Terraform', 'Ansible',

    // Tools & Software
    'Photoshop', 'Illustrator', 'Figma', 'Sketch', 'InDesign', 'After Effects',
    'Excel', 'PowerPoint', 'Word', 'Outlook', 'Slack', 'Jira', 'Trello'
  ];

  const textLower = text.toLowerCase();
  commonSkills.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      skills.add(skill);
    }
  });

  // Convert to array and clean up
  return Array.from(skills)
    .filter(skill => skill.length > 1 && skill.length < 50)
    .slice(0, 30); // Limit to 30 skills
}

// Certifications extraction
function extractCertifications(text: string): string[] {
  const certKeywords = ['certifications', 'certificates', 'certified', 'licensed'];
  const lines = text.split('\n');
  const certifications: string[] = [];
  let inCertSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();

    if (!inCertSection) {
      for (const keyword of certKeywords) {
        if (lowerLine.includes(keyword) && line.length < 100) {
          inCertSection = true;
          break;
        }
      }
      continue;
    }

    if (lowerLine.includes('experience') || lowerLine.includes('education') ||
        lowerLine.includes('skills')) {
      break;
    }

    if (line && line.length > 5 && line.length < 200) {
      certifications.push(line);
    }
  }

  return certifications.slice(0, 10);
}

// Languages extraction
function extractLanguages(text: string): string[] {
  const langKeywords = ['languages', 'language skills', 'linguistic'];
  const commonLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian',
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Dutch', 'Swedish'
  ];

  const languages: Set<string> = new Set();
  const lines = text.split('\n');
  let inLangSection = false;

  // Extract from language section
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();

    if (!inLangSection) {
      for (const keyword of langKeywords) {
        if (lowerLine.includes(keyword) && line.length < 100) {
          inLangSection = true;
          break;
        }
      }
      continue;
    }

    if (lowerLine.includes('experience') || lowerLine.includes('education') ||
        lowerLine.includes('skills')) {
      break;
    }

    if (line) {
      const lineLanguages = line.split(/[,•·|;]/)
        .map(s => s.trim())
        .filter(s => s.length > 2 && s.length < 50);

      lineLanguages.forEach(lang => languages.add(lang));
    }
  }

  // Extract common languages from entire text
  const textLower = text.toLowerCase();
  commonLanguages.forEach(lang => {
    if (textLower.includes(lang.toLowerCase())) {
      languages.add(lang);
    }
  });

  return Array.from(languages).slice(0, 10);
}

// Calculate extraction confidence based on extracted data quality
function calculateExtractionConfidence(data: any): any {
  let totalScore = 0;
  let maxScore = 0;
  const scores: any = {};

  // Personal information scoring (30% weight)
  let personalScore = 0;
  let personalMax = 5;

  if (data.personal.fullName && data.personal.fullName.length > 2) personalScore += 1;
  if (data.personal.email && data.personal.email.includes('@')) personalScore += 1;
  if (data.personal.phone && data.personal.phone.length > 5) personalScore += 1;
  if (data.personal.location && data.personal.location.length > 2) personalScore += 1;
  if (data.personal.linkedin || data.personal.github || data.personal.website) personalScore += 1;

  scores.personal = personalScore / personalMax;
  totalScore += scores.personal * 0.3;
  maxScore += 0.3;

  // Summary scoring (15% weight)
  let summaryScore = 0;
  if (data.summary && data.summary.length > 50) summaryScore = 1;
  else if (data.summary && data.summary.length > 20) summaryScore = 0.5;

  scores.summary = summaryScore;
  totalScore += summaryScore * 0.15;
  maxScore += 0.15;

  // Experience scoring (25% weight)
  let experienceScore = 0;
  if (data.experience && data.experience.length > 0) {
    const validExperiences = data.experience.filter((exp: any) =>
      exp.position && exp.position.length > 2
    );
    experienceScore = Math.min(validExperiences.length / 3, 1); // Up to 3 experiences for full score
  }

  scores.experience = experienceScore;
  totalScore += experienceScore * 0.25;
  maxScore += 0.25;

  // Education scoring (15% weight)
  let educationScore = 0;
  if (data.education && data.education.length > 0) {
    const validEducation = data.education.filter((edu: any) =>
      edu.degree && edu.degree.length > 2
    );
    educationScore = Math.min(validEducation.length / 2, 1); // Up to 2 education entries for full score
  }

  scores.education = educationScore;
  totalScore += educationScore * 0.15;
  maxScore += 0.15;

  // Skills scoring (15% weight)
  let skillsScore = 0;
  if (data.skills && data.skills.length > 0) {
    skillsScore = Math.min(data.skills.length / 10, 1); // Up to 10 skills for full score
  }

  scores.skills = skillsScore;
  totalScore += skillsScore * 0.15;
  maxScore += 0.15;

  const overall = maxScore > 0 ? totalScore / maxScore : 0;

  return {
    overall: Math.round(overall * 100) / 100,
    personal: Math.round(scores.personal * 100) / 100,
    summary: Math.round(scores.summary * 100) / 100,
    experience: Math.round(scores.experience * 100) / 100,
    education: Math.round(scores.education * 100) / 100,
    skills: Math.round(scores.skills * 100) / 100
  };
}

 
