'use client';
import React from 'react';
import { Type, AlignLeft, List, ListOrdered, Minus, Circle, Palette } from 'lucide-react';

export interface FormattingOptions {
  bulletStyle: 'bullet' | 'dash' | 'circle' | 'number';
  fontSize: 'small' | 'medium' | 'large';
  lineSpacing: 'compact' | 'normal' | 'relaxed';
  colors?: {
    primaryText?: string;
    headingText?: string;
    accentColor?: string;
  };
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
        <Type className="w-4 h-4 text-teal-400" />
        <span className="font-semibold">Formatting Options</span>
        <span className="ml-auto text-xs text-teal-400/70">Changes apply instantly to preview</span>
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
                  ? 'bg-teal-600 text-white border-2 border-teal-400 shadow-lg shadow-teal-900/30'
                  : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 hover:border-gray-500'
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
                  ? 'bg-teal-600 text-white border-2 border-teal-400 shadow-lg shadow-teal-900/30'
                  : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="font-semibold">{label}</div>
              <div className={`text-[10px] ${options.fontSize === value ? 'text-teal-200' : 'text-gray-400'}`}>{size}</div>
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
                  ? 'bg-teal-600 text-white border-2 border-teal-400 shadow-lg shadow-teal-900/30'
                  : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="font-semibold">{label}</div>
              <div className={`text-[10px] ${options.lineSpacing === value ? 'text-teal-200' : 'text-gray-400'}`}>{spacing}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Customization */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-3 h-3 text-gray-400" />
          <label className="block text-xs font-medium text-gray-400">Color Customization</label>
        </div>
        <div className="space-y-3">
          {/* Primary Text Color */}
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-300">Primary Text</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={options.colors?.primaryText || '#374151'}
                onChange={(e) => onChange({
                  ...options,
                  colors: { ...options.colors, primaryText: e.target.value }
                })}
                className="w-10 h-8 rounded border border-gray-600 bg-gray-700 cursor-pointer"
              />
              <input
                type="text"
                value={options.colors?.primaryText || '#374151'}
                onChange={(e) => onChange({
                  ...options,
                  colors: { ...options.colors, primaryText: e.target.value }
                })}
                className="w-20 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                placeholder="#374151"
              />
            </div>
          </div>

          {/* Heading Text Color */}
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-300">Heading Text</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={options.colors?.headingText || '#111827'}
                onChange={(e) => onChange({
                  ...options,
                  colors: { ...options.colors, headingText: e.target.value }
                })}
                className="w-10 h-8 rounded border border-gray-600 bg-gray-700 cursor-pointer"
              />
              <input
                type="text"
                value={options.colors?.headingText || '#111827'}
                onChange={(e) => onChange({
                  ...options,
                  colors: { ...options.colors, headingText: e.target.value }
                })}
                className="w-20 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                placeholder="#111827"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-300">Accent Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={options.colors?.accentColor || '#3B82F6'}
                onChange={(e) => onChange({
                  ...options,
                  colors: { ...options.colors, accentColor: e.target.value }
                })}
                className="w-10 h-8 rounded border border-gray-600 bg-gray-700 cursor-pointer"
              />
              <input
                type="text"
                value={options.colors?.accentColor || '#3B82F6'}
                onChange={(e) => onChange({
                  ...options,
                  colors: { ...options.colors, accentColor: e.target.value }
                })}
                className="w-20 px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
                placeholder="#3B82F6"
              />
            </div>
          </div>

          {/* Preset Colors */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Quick Presets</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'Default', primary: '#374151', heading: '#111827', accent: '#3B82F6' },
                { name: 'Professional', primary: '#1F2937', heading: '#000000', accent: '#2563EB' },
                { name: 'Creative', primary: '#4B5563', heading: '#7C3AED', accent: '#EC4899' },
                { name: 'Elegant', primary: '#6B7280', heading: '#1F2937', accent: '#10B981' },
              ].map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => onChange({
                    ...options,
                    colors: {
                      primaryText: preset.primary,
                      headingText: preset.heading,
                      accentColor: preset.accent,
                    }
                  })}
                  className="px-2 py-1.5 rounded text-[10px] bg-gray-700 border border-gray-600 hover:bg-gray-600 transition-all"
                >
                  <div className="flex gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.primary }}></div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.heading }}></div>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.accent }}></div>
                  </div>
                  <div className="text-gray-300">{preset.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
        <div className="text-xs text-gray-400 mb-3">Preview:</div>
        <div className="space-y-2">
          <h3
            className="font-bold mb-1"
            style={{
              color: options.colors?.headingText || '#111827',
              fontSize: options.fontSize === 'small' ? '14px' : options.fontSize === 'large' ? '18px' : '16px'
            }}
          >
            Senior Software Engineer
          </h3>
          <div
            className={`${
              options.lineSpacing === 'compact' ? 'leading-tight' :
              options.lineSpacing === 'relaxed' ? 'leading-relaxed' : 'leading-normal'
            }`}
            style={{
              color: options.colors?.primaryText || '#374151',
              fontSize: options.fontSize === 'small' ? '11px' : options.fontSize === 'large' ? '13px' : '12px'
            }}
          >
            <div className="flex items-start gap-2">
              <span className="mt-1" style={{ color: options.colors?.accentColor || '#3B82F6' }}>
                {options.bulletStyle === 'bullet' ? '•' :
                 options.bulletStyle === 'dash' ? '−' :
                 options.bulletStyle === 'circle' ? '○' : '1.'}
              </span>
              <span>Increased sales by 25% through strategic initiatives</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1" style={{ color: options.colors?.accentColor || '#3B82F6' }}>
                {options.bulletStyle === 'bullet' ? '•' :
                 options.bulletStyle === 'dash' ? '−' :
                 options.bulletStyle === 'circle' ? '○' : '2.'}
              </span>
              <span>Led team of 5 developers on critical project</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

