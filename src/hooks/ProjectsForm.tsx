// src/components/Builder/sections/ProjectsForm.tsx
import React, { useState } from 'react';

import {
  AlertCircle,
  Award,
  GripVertical,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
}

interface ProjectsFormProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export function ProjectsForm({ projects, onChange }: ProjectsFormProps) {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
    };
    onChange([...projects, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    onChange(
      projects.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      )
    );
  };

  const removeProject = (id: string) => {
    onChange(projects.filter((project) => project.id !== id));
  };

  return (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="bg-gray-50 rounded-lg p-6 relative group"
        >
          <div className="absolute left-2 top-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>

          <button
            onClick={() => removeProject(project.id)}
            className="absolute right-4 top-4 text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, { name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., E-commerce Platform"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Link (Optional)
              </label>
              <input
                type="url"
                value={project.link || ''}
                onChange={(e) => updateProject(project.id, { link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://github.com/username/project"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe the project, your role, and key achievements..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technologies Used
              </label>
              <input
                type="text"
                value={project.technologies.join(', ')}
                onChange={(e) =>
                  updateProject(project.id, {
                    technologies: e.target.value
                      .split(',')
                      .map((tech) => tech.trim())
                      .filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="React, Node.js, MongoDB, AWS"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addProject}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600"
      >
        <Plus className="h-5 w-5" />
        Add Project
      </button>
    </div>
  );
}

// src/components/Builder/sections/CertificationsForm.tsx

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

interface CertificationsFormProps {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
}

export function CertificationsForm({
  certifications,
  onChange,
}: CertificationsFormProps) {
  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
    };
    onChange([...certifications, newCertification]);
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    onChange(
      certifications.map((cert) =>
        cert.id === id ? { ...cert, ...updates } : cert
      )
    );
  };

  const removeCertification = (id: string) => {
    onChange(certifications.filter((cert) => cert.id !== id));
  };

  return (
    <div className="space-y-6">
      {certifications.map((cert) => (
        <div
          key={cert.id}
          className="bg-gray-50 rounded-lg p-6 relative"
        >
          <div className="absolute left-4 top-4">
            <Award className="h-5 w-5 text-indigo-500" />
          </div>

          <button
            onClick={() => removeCertification(cert.id)}
            className="absolute right-4 top-4 text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certification Name
              </label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., AWS Certified Solutions Architect"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issuing Organization
              </label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Amazon Web Services"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Obtained
              </label>
              <input
                type="month"
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date (Optional)
              </label>
              <input
                type="month"
                value={cert.expirationDate || ''}
                onChange={(e) => updateCertification(cert.id, { expirationDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credential ID (Optional)
              </label>
              <input
                type="text"
                value={cert.credentialId || ''}
                onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., ABC123XYZ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credential URL (Optional)
              </label>
              <input
                type="url"
                value={cert.credentialUrl || ''}
                onChange={(e) => updateCertification(cert.id, { credentialUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addCertification}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600"
      >
        <Plus className="h-5 w-5" />
        Add Certification
      </button>
    </div>
  );
}

// src/components/Builder/sections/SummaryForm.tsx

interface SummaryFormProps {
  data: string;
  onChange: (summary: string) => void;
  jobTitle?: string;
}

export function SummaryForm({ data, onChange, jobTitle }: SummaryFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [charCount, setCharCount] = useState(data.length);

  const handleChange = (value: string) => {
    onChange(value);
    setCharCount(value.length);
  };

  const generateAISummary = async () => {
    setIsGenerating(true);
    try {
      // This would call your AI API to generate a summary
      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle }),
      });
      
      if (response.ok) {
        const { summary } = await response.json();
        handleChange(summary);
      }
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Tips for a great summary:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Keep it concise (2-4 sentences)</li>
              <li>Highlight your key strengths and experience</li>
              <li>Tailor it to the job you're applying for</li>
              <li>Use keywords from the job description</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Professional Summary
          </label>
          <button
            onClick={generateAISummary}
            disabled={isGenerating || !jobTitle}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>

        <textarea
          value={data}
          onChange={(e) => handleChange(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Write a brief summary of your professional background, key skills, and career objectives..."
        />

        <div className="mt-1 text-sm text-gray-500 text-right">
          {charCount} / 500 characters
        </div>
      </div>

      {!jobTitle && (
        <p className="text-sm text-amber-600">
          💡 Add a job title in Personal Info to enable AI summary generation
        </p>
      )}
    </div>
  );
}