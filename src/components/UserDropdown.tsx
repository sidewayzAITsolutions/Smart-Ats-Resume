'use client'

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ChevronDown,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { createClient } from '@/lib/supabase/client';

interface UserDropdownProps {
  userData: {
    email?: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
    };
    full_name?: string;
    name?: string;
  };
}

const UserDropdown: React.FC<UserDropdownProps> = ({ userData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Get display name - try multiple possible fields
  const getDisplayName = () => {
    if (userData?.user_metadata?.full_name) return userData.user_metadata.full_name;
    if (userData?.user_metadata?.name) return userData.user_metadata.name;
    if (userData?.full_name) return userData.full_name;
    if (userData?.name) return userData.name;
    if (userData?.email) {
      // Extract name from email if no name is available
      const emailName = userData.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return 'User';
  };

  const getDisplayEmail = () => {
    return userData?.email || '';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Error signing out');
        console.error('Logout error:', error);
      } else {
        toast.success('Signed out successfully');
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      toast.error('Error signing out');
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  const displayName = getDisplayName();
  const displayEmail = getDisplayEmail();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-300 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-6 h-6 bg-gradient-to-r from-teal-400 to-amber-400 rounded-full flex items-center justify-center text-gray-900 font-semibold text-xs">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:inline max-w-[120px] truncate">
          {displayName}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 py-2">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-amber-400 rounded-full flex items-center justify-center text-gray-900 font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {displayName}
                </p>
                {displayEmail && (
                  <p className="text-xs text-gray-400 truncate">
                    {displayEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/profiles"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              Profile
            </Link>
            
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-700 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4" />
              {isLoggingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
