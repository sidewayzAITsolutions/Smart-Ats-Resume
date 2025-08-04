// src/hooks/useAutoSave.ts
import { useEffect, useRef } from 'react';
import { debounce } from '@/lib/utils';

interface UseAutoSaveProps<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 3000,
  enabled = true,
}: UseAutoSaveProps<T>) {
  const previousDataRef = useRef<T>(data);
  
  useEffect(() => {
    if (!enabled) return;
    
    const debouncedSave = debounce(async () => {
      // Only save if data has actually changed
      if (JSON.stringify(data) !== JSON.stringify(previousDataRef.current)) {
        try {
          await onSave(data);
          previousDataRef.current = data;
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }
    }, delay);
    
    debouncedSave();
    
    return () => {
      debouncedSave.cancel();
    };
  }, [data, onSave, delay, enabled]);
}

// src/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';

type ShortcutMap = {
  [key: string]: () => void;
};

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Build the shortcut string
      let shortcut = '';
      if (event.metaKey || event.ctrlKey) shortcut += 'cmd+';
      if (event.altKey) shortcut += 'alt+';
      if (event.shiftKey) shortcut += 'shift+';
      shortcut += event.key.toLowerCase();
      
      // Check if we have a handler for this shortcut
      const handler = shortcuts[shortcut];
      if (handler) {
        event.preventDefault();
        handler();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// src/lib/utils.ts (add these utility functions)
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;
  
  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  
  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
  };
  
  return debounced as T & { cancel: () => void };
}

export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ');
}