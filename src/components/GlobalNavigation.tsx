'use client'

import React, {
  useEffect,
  useState,
} from 'react';

import {
  BookOpen,
  Building,
  Check,
  CreditCard,
  Download,
  Eye,
  FileText,
  Menu,
  Phone,
  Settings,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import {
  usePathname,
  useRouter,
} from 'next/navigation';

import UserDropdown from './UserDropdown';

interface GlobalNavigationProps {
  // Builder-specific props
  resumeName?: string;
  saveStatus?: 'saved' | 'saving' | 'unsaved';
  onPreview?: () => void;
  onExportPDF?: () => void;
  userData?: any;
  
  // Page-specific props
  showBuilderActions?: boolean;
  showMainNav?: boolean;
  showAuthButtons?: boolean;
}

const GlobalNavigation: React.FC<GlobalNavigationProps> = ({
  resumeName,
  saveStatus = 'saved',
  onPreview,
  onExportPDF,
  userData,
  showBuilderActions = false,
  showMainNav = true,
  showAuthButtons = true
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  // Main navigation items for public pages
  const mainNavItems = [
    { href: '/templates', label: 'Templates', icon: FileText },
    { href: '/pricing', label: 'Pricing', icon: CreditCard },
    { href: '/ats-guide', label: 'ATS Guide', icon: BookOpen },
    { href: '/contact-sales', label: 'Contact', icon: Phone }
  ];

  // Authenticated user navigation items
  const userNavItems = [
    { href: '/builder', label: 'Builder', icon: FileText },
    { href: '/templates', label: 'Templates', icon: FileText },
    { href: '/profiles', label: 'My Resumes', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings }
  ];

  const isAuthenticated = !!userData;
  const navItems = isAuthenticated ? userNavItems : mainNavItems;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-4 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo - Always on far left */}
        <div className="flex items-center gap-4">
          <Link href="/" className="group flex items-center gap-3 hover:opacity-90 transition-all duration-300">
            <div className="relative w-10 h-10 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <img 
                src="/horse-logo.png" 
                alt="SmartATS Logo" 
                className="w-full h-full object-contain group-hover:drop-shadow-[0_0_10px_rgba(56,178,172,0.5)] transition-all duration-300" 
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold bg-gradient-to-r from-teal-400 to-amber-400 bg-clip-text text-transparent group-hover:from-teal-300 group-hover:to-amber-300 transition-all duration-300">
                SmartATS
              </div>
            </div>
          </Link>
        </div>

        {/* Center Content - Builder-specific or empty */}
        <div className="flex-1 flex items-center justify-center">
          {showBuilderActions && resumeName && (
            <div className="flex items-center gap-3">
              <span className="text-gray-300 font-medium text-sm sm:text-base truncate max-w-[200px]">
                {resumeName}
              </span>
            </div>
          )}
        </div>

        {/* Right Side Navigation */}
        <div className="flex items-center gap-4">
          {/* Builder Action Buttons */}
          {showBuilderActions && (
            <>
              {onPreview && (
                <button
                  type="button"
                  onClick={onPreview}
                  className="hidden sm:flex px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-300 transition-all duration-200 items-center gap-2 hover:scale-105 shadow-sm hover:shadow-md"
                  title="Preview Resume"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden md:inline">Preview</span>
                </button>
              )}
              {onExportPDF && (
                <button
                  type="button"
                  onClick={onExportPDF}
                  className="hidden sm:flex px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-white transition-all duration-200 items-center gap-2 hover:scale-105 shadow-sm hover:shadow-md"
                  title="Export as PDF"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden md:inline">Export</span>
                </button>
              )}
              <div className="w-px h-6 bg-gray-700"></div>
            </>
          )}

          {/* Desktop Navigation */}
          {showMainNav && (
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:text-teal-400 hover-underline ${
                      isActive ? 'text-teal-400' : 'text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Auth Buttons or User Dropdown */}
          {showAuthButtons && (
            <>
              {isAuthenticated ? (
                <UserDropdown userData={userData} />
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigateTo('/login')}
                    className="text-gray-300 hover:text-white font-medium transition-all duration-300 hover-underline"
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('/signup')}
                    className="bg-gradient-to-r from-teal-600 to-amber-600 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg hover:shadow-teal-500/25 transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 btn-shine"
                  >
                    Start Now
                  </button>
                </div>
              )}
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900 shadow-lg border-t border-gray-800 p-6 space-y-4">
          {/* Mobile Builder Actions */}
          {showBuilderActions && (
            <div className="space-y-3 pb-4 border-b border-gray-800">
              {onPreview && (
                <button
                  type="button"
                  onClick={onPreview}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  Preview Resume
                </button>
              )}
              {onExportPDF && (
                <button
                  type="button"
                  onClick={onExportPDF}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Export PDF
                </button>
              )}
            </div>
          )}

          {/* Mobile Navigation Items */}
          {showMainNav && (
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive 
                        ? 'bg-teal-600/20 text-teal-400' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Mobile Auth Buttons */}
          {showAuthButtons && !isAuthenticated && (
            <div className="space-y-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => navigateTo('/login')}
                className="w-full px-4 py-3 text-gray-300 hover:text-white font-medium transition-colors text-left"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => navigateTo('/signup')}
                className="w-full bg-gradient-to-r from-teal-600 to-amber-600 text-white px-4 py-3 rounded-xl font-medium"
              >
                Start Now
              </button>
            </div>
          )}

          {/* Mobile User Menu */}
          {showAuthButtons && isAuthenticated && (
            <div className="space-y-2 pt-4 border-t border-gray-800">
              <Link
                href="/profiles"
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <User className="w-5 h-5" />
                Profile
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
                Settings
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default GlobalNavigation;
