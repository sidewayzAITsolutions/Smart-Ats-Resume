// src/components/Builder/sections/CertificationsForm.tsx
'use client';

import React from 'react';
import { Award, Plus, Trash2 } from 'lucide-react';

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

export default function CertificationsForm({ certifications, onChange }: CertificationsFormProps) {
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
    onChange(certifications.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const removeCertification = (id: string) => {
    onChange(certifications.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {certifications.map((cert) => (
        <div key={cert.id} className="bg-gray-50 rounded-lg p-6 relative">
          <div className="absolute left-4 top-4">
            <Award className="h-5 w-5 text-indigo-500" />
          </div>

          <button type="button"
            onClick={() => removeCertification(cert.id)}
            className="absolute right-4 top-4 text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          <div className="ml-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., AWS Certified Solutions Architect"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Amazon Web Services"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Obtained</label>
              <input
                type="month"
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date (Optional)</label>
              <input
                type="month"
                value={cert.expirationDate || ''}
                onChange={(e) => updateCertification(cert.id, { expirationDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credential ID (Optional)</label>
              <input
                type="text"
                value={cert.credentialId || ''}
                onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., ABC123XYZ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Credential URL (Optional)</label>
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

      <button type="button"
        onClick={addCertification}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600"
      >
        <Plus className="h-5 w-5" />
        Add Certification
      </button>
    </div>
  );
}

