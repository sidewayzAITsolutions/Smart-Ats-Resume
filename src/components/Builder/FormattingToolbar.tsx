'use client';
import React from 'react';
import { Type, AlignLeft, List, ListOrdered, Minus, Circle } from 'lucide-react';

export interface FormattingOptions {
  bulletStyle: 'bullet' | 'dash' | 'circle' | 'number';
  fontSize: 'small' | 'medium' | 'large';
  lineSpacing: 'compact' | 'normal' | 'relaxed';
}

interface FormattingToolbarProps {
  options: FormattingOptions;
  onChange: (options: FormattingOptions) => void;
}

export default function FormattingToolbar({ options, onChange }: FormattingToolbarProps) {
  const bulletStyles = [
    { value: 'bullet' as const, icon: List, label: 'Bullet (•)' },
    { value: 'dash' as const, icon: Minus, label: 'Dash (-)' },
    { value: 'circle' as const, icon: Circle, label: 'Circle (○)' },
    { value: 'number' as const, icon: ListOrdered, label: 'Numbers (1.)' },
  ];

  const fontSizes = [
    { value: 'small' as const, label: 'Small', size: '10pt' },
    { value: 'medium' as const, label: 'Medium', size: '11pt' },
    { value: 'large' as const, label: 'Large', size: '12pt' },
  ];

  const lineSpacings = [
    { value: 'compact' as const, label: 'Compact', spacing: '1.0' },
    { value: 'normal' as const, label: 'Normal', spacing: '1.15' },
    { value: 'relaxed' as const, label: 'Relaxed', spacing: '1.5' },
  ];

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-300">
        <Type className="w-4 h-4" />
        <span className="font-semibold">Formatting Options</span>
      </div>

      {/* Bullet Style */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Bullet Style</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {bulletStyles.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ ...options, bulletStyle: value })}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                options.bulletStyle === value
                  ? 'bg-blue-600 text-white border-2 border-blue-400'
                  : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Font Size</label>
        <div className="grid grid-cols-3 gap-2">
          {fontSizes.map(({ value, label, size }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ ...options, fontSize: value })}
              className={`px-3 py-2 rounded-lg text-xs transition-all ${
                options.fontSize === value
                  ? 'bg-blue-600 text-white border-2 border-blue-400'
                  : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
              }`}
            >
              <div className="font-semibold">{label}</div>
              <div className="text-[10px] text-gray-400">{size}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Line Spacing */}
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">Line Spacing</label>
        <div className="grid grid-cols-3 gap-2">
          {lineSpacings.map(({ value, label, spacing }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ ...options, lineSpacing: value })}
              className={`px-3 py-2 rounded-lg text-xs transition-all ${
                options.lineSpacing === value
                  ? 'bg-blue-600 text-white border-2 border-blue-400'
                  : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
              }`}
            >
              <div className="font-semibold">{label}</div>
              <div className="text-[10px] text-gray-400">{spacing}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
        <div className="text-xs text-gray-400 mb-2">Preview:</div>
        <div 
          className={`text-gray-200 ${
            options.fontSize === 'small' ? 'text-xs' : 
            options.fontSize === 'large' ? 'text-base' : 'text-sm'
          } ${
            options.lineSpacing === 'compact' ? 'leading-tight' :
            options.lineSpacing === 'relaxed' ? 'leading-relaxed' : 'leading-normal'
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="mt-1">
              {options.bulletStyle === 'bullet' ? '•' :
               options.bulletStyle === 'dash' ? '−' :
               options.bulletStyle === 'circle' ? '○' : '1.'}
            </span>
            <span>Increased sales by 25% through strategic initiatives</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-1">
              {options.bulletStyle === 'bullet' ? '•' :
               options.bulletStyle === 'dash' ? '−' :
               options.bulletStyle === 'circle' ? '○' : '2.'}
            </span>
            <span>Led team of 5 developers on critical project</span>
          </div>
        </div>
      </div>
    </div>
  );
}

