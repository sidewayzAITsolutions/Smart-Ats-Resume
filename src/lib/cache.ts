// src/lib/cache.ts

// This file provides a simple caching mechanism, potentially using a key-value store
// or an in-memory cache for server-side operations, or localStorage/sessionStorage
// for client-side. Given the context of Next.js, this might involve server-side caching
// or client-side state persistence.

// For server-side caching (e.g., with Redis or a simple in-memory store)
// This is a very basic in-memory cache for demonstration purposes.
// In a real production environment, consider a dedicated caching solution like Redis,
// or Next.js's built-in caching mechanisms (e.g., `revalidateTag`, `fetch` caching).
const serverCache = new Map<string, { value: any; expiry: number }>();
const DEFAULT_TTL = 60 * 5 * 1000; // Default TTL: 5 minutes in milliseconds

/**
 * Sets a value in the server-side cache.
 * @param key The cache key.
 * @param value The value to store.
 * @param ttl Time-to-live in milliseconds. Defaults to 5 minutes.
 */
export function setServerCache(key: string, value: any, ttl: number = DEFAULT_TTL) {
  const expiry = Date.now() + ttl;
  serverCache.set(key, { value, expiry });
  console.log(`Server cache: Set key "${key}" with TTL ${ttl / 1000}s`);
}

/**
 * Gets a value from the server-side cache.
 * @param key The cache key.
 * @returns The cached value, or undefined if not found or expired.
 */
export function getServerCache(key: string): any | undefined {
  const item = serverCache.get(key);
  if (!item) {
    return undefined;
  }
  if (Date.now() > item.expiry) {
    serverCache.delete(key); // Remove expired item
    console.log(`Server cache: Key "${key}" expired and removed.`);
    return undefined;
  }
  console.log(`Server cache: Retrieved key "${key}".`);
  return item.value;
}

/**
 * Deletes a value from the server-side cache.
 * @param key The cache key.
 */
export function deleteServerCache(key: string) {
  serverCache.delete(key);
  console.log(`Server cache: Deleted key "${key}".`);
}

// For client-side caching (using localStorage for persistence)
/**
 * Sets a value in the client-side local storage.
 * @param key The storage key.
 * @param value The value to store.
 */
export function setLocalCache(key: string, value: any) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      console.log(`Local cache: Set key "${key}".`);
    } catch (error) {
      console.error('Error setting local cache:', error);
    }
  }
}

/**
 * Gets a value from the client-side local storage.
 * @param key The storage key.
 * @returns The cached value, or undefined if not found.
 */
export function getLocalCache(key: string): any | undefined {
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : undefined;
    } catch (error) {
      console.error('Error getting local cache:', error);
      return undefined;
    }
  }
  return undefined;
}

/**
 * Deletes a value from the client-side local storage.
 * @param key The storage key.
 */
export function deleteLocalCache(key: string) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(key);
      console.log(`Local cache: Deleted key "${key}".`);
    } catch (error) {
      console.error('Error deleting local cache:', error);
    }
  }
}

// You might also consider sessionStorage for session-based caching.
