// src/hooks/useKeyboardShortcuts.ts
'use client';

import { useEffect } from 'react';

// Register simple keyboard shortcuts like 'cmd+s', 'cmd+p', 'cmd+e'
// On Windows/Linux, Ctrl acts as Cmd alternative.
export function useKeyboardShortcuts(map: Record<string, () => void>) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      const isCmd = e.metaKey || e.ctrlKey;

      const shortcut = isCmd ? `cmd+${key}` : key;
      const fn = map[shortcut];
      if (fn) {
        e.preventDefault();
        fn();
      }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [map]);
}

