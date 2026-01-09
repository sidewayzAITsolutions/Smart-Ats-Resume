// src/components/Builder/PremiumGate.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, Lock, Sparkles } from 'lucide-react';

interface PremiumGateProps {
  feature: string;
  children?: React.ReactNode;
  showUpgradeButton?: boolean;
}

export function PremiumGate({ feature, children, showUpgradeButton = true }: PremiumGateProps) {
  return (
    <div className="relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
        <div className="text-center p-6 max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Premium Feature</h3>
          <p className="text-gray-300 mb-4">
            {feature} is only available for premium users.
          </p>
          {showUpgradeButton && (
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all duration-200 shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Upgrade to Premium
            </Link>
          )}
        </div>
      </div>
      
      {/* Blurred content */}
      <div className="pointer-events-none opacity-50 blur-sm">
        {children}
      </div>
    </div>
  );
}

interface PremiumButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  isPremium: boolean;
  feature: string;
}

export function PremiumButton({ 
  onClick, 
  disabled, 
  children, 
  className = '', 
  isPremium,
  feature 
}: PremiumButtonProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);

  const handleClick = () => {
    if (!isPremium) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
      return;
    }
    onClick?.();
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        disabled={disabled || !isPremium}
        className={`${className} ${!isPremium ? 'opacity-50 cursor-not-allowed' : ''} relative`}
      >
        {!isPremium && (
          <Lock className="absolute -top-1 -right-1 w-4 h-4 text-amber-500" />
        )}
        {children}
      </button>
      
      {showTooltip && !isPremium && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-gray-800 border border-amber-500/50 rounded-lg shadow-xl z-50 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-white">
              {feature} requires Premium
            </span>
          </div>
          <Link
            href="/pricing"
            className="block mt-2 text-xs text-amber-400 hover:text-amber-300 underline"
          >
            Upgrade Now
          </Link>
        </div>
      )}
    </div>
  );
}

export function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-semibold rounded-full">
      <Crown className="w-3 h-3" />
      Premium
    </span>
  );
}

