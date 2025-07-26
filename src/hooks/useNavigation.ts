'use client'

import { usePathname } from 'next/navigation';

interface NavigationConfig {
  showBuilderActions: boolean;
  showMainNav: boolean;
  showAuthButtons: boolean;
}

export const useNavigation = (): NavigationConfig => {
  const pathname = usePathname();

  // Builder page - show builder actions, minimal nav
  if (pathname === '/builder') {
    return {
      showBuilderActions: true,
      showMainNav: false,
      showAuthButtons: true
    };
  }

  // Auth pages - minimal nav, no auth buttons
  if (pathname?.startsWith('/auth') || pathname === '/login' || pathname === '/signup') {
    return {
      showBuilderActions: false,
      showMainNav: false,
      showAuthButtons: false
    };
  }

  // Landing page - full nav with auth buttons
  if (pathname === '/') {
    return {
      showBuilderActions: false,
      showMainNav: true,
      showAuthButtons: true
    };
  }

  // All other pages - full nav
  return {
    showBuilderActions: false,
    showMainNav: true,
    showAuthButtons: true
  };
};
