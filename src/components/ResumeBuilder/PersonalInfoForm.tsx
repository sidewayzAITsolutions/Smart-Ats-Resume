// src/components/ResumeBuilder/PersonalInfoForm.tsx
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { VoiceInputButton } from '@/components/ui/VoiceInput';
import { Mic } from 'lucide-react';

// Define the PersonalInfo interface
interface PersonalInfo {
  fullName: string;
  email: string;
  title?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
}

interface PersonalInfoFormProps {
  initialData: PersonalInfo;
  onUpdate: (data: PersonalInfo) => void;
}

export default function PersonalInfoForm({ initialData, onUpdate }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState<PersonalInfo>(initialData);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-pink-500">Personal Information</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Mic className="w-4 h-4 text-teal-400" />
          <span>Voice input available</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Full Name *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="John Doe"
              required
            />
            <VoiceInputButton
              onTranscript={(text) => handleChange('fullName', text)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Job Title
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="e.g., Software Engineer, Marketing Manager"
            />
            <VoiceInputButton
              onTranscript={(text) => handleChange('title', text)}
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">Required for AI-powered summary generation</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Location
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              placeholder="New York, NY"
            />
            <VoiceInputButton
              onTranscript={(text) => handleChange('location', text)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={formData.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Portfolio Website
          </label>
          <input
            type="url"
            value={formData.portfolio || ''}
            onChange={(e) => handleChange('portfolio', e.target.value)}
            className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            placeholder="https://johndoe.com"
          />
        </div>
      </div>
    </div>
  );
}
