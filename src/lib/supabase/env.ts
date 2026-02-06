// Centralized Supabase env parsing/validation.
// Goal: avoid hard crashes during build/SSG when env vars are unset or placeholders.

function isPlaceholder(value: string): boolean {
  const v = value.trim();
  return (
    v.length === 0 ||
    v === 'your_supabase_project_url' ||
    v === 'your_supabase_url' ||
    v === 'your_project_url' ||
    v === 'your-project-id.supabase.co' ||
    v === 'your_anon_key_here' ||
    v === 'your_supabase_anon_key' ||
    v.startsWith('your_')
  );
}

export function normalizeSupabaseUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed || isPlaceholder(trimmed)) return null;

  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : trimmed.endsWith('.supabase.co')
      ? `https://${trimmed}`
      : trimmed;

  try {
    const u = new URL(withScheme);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    // Basic host sanity checks: must have a hostname and no obvious invalid chars
    if (!u.hostname || /\s/.test(u.hostname)) return null;
    // If it looks like a Supabase URL, require the expected host suffix.
    // This prevents broken/typoed project refs from producing a non-resolving domain.
    if (u.hostname.includes('supabase') && !u.hostname.endsWith('.supabase.co')) return null;
    return u.toString().replace(/\/$/, ''); // normalize trailing slash
  } catch {
    return null;
  }
}

export function getSupabasePublicEnv(): { url: string; anonKey: string } | null {
  const urlRaw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKeyRaw = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!urlRaw || !anonKeyRaw) return null;
  if (isPlaceholder(urlRaw) || isPlaceholder(anonKeyRaw)) return null;

  const url = normalizeSupabaseUrl(urlRaw);
  if (!url) return null;

  return { url, anonKey: anonKeyRaw.trim() };
}
