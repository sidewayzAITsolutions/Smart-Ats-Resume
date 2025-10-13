// src/components/Builder/sections/ProjectsForm.tsx
'use client';

import React from 'react';
import { GripVertical, Plus, Trash2 } from 'lucide-react';

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

export default function ProjectsForm({ projects, onChange }: ProjectsFormProps) {
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
    onChange(projects.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const removeProject = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <div key={project.id} className="bg-gray-50 rounded-lg p-6 relative group">
          <div className="absolute left-2 top-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>

          <button type="button"
            onClick={() => removeProject(project.id)}
            className="absolute right-4 top-4 text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, { name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., E-commerce Platform"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Link (Optional)</label>
              <input
                type="url"
                value={project.link || ''}
                onChange={(e) => updateProject(project.id, { link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://github.com/username/project"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, { description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe the project, your role, and key achievements..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
              <input
                type="text"
                value={project.technologies.join(', ')}
                onChange={(e) =>
                  updateProject(project.id, {
                    technologies: e.target.value
                      .split(',')
                      .map((t) => t.trim())
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

      <button type="button"
        onClick={addProject}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600"
      >
        <Plus className="h-5 w-5" />
        Add Project
      </button>
    </div>
  );
}

