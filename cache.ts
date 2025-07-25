// lib/cache.ts
import { unstable_cache } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export const getCachedTemplates = unstable_cache(
  async () => {
    const supabase = createClient();
    const { data } = await supabase.from('templates').select('*');
    return data;
  },
  ['templates'],
  { revalidate: 3600 } // 1 hour
);
