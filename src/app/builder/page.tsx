'use client';

import {
  Suspense,
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
  useSearchParams,
} from 'next/navigation';

import BuilderLayout from '@/components/Builder/BuilderLayout';
import { ATSLoadingState } from '@/components/LoadingStates';
import { useSupabase } from '@/hooks/useSupabase';
import { useResumeStore } from '@/store/resumeStore';
import { ResumeData } from '@/types/resume';

export const dynamic = 'force-dynamic';

function BuilderPageInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = useSupabase();
  const { updateResumeData, resetResumeData } = useResumeStore();

  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resumeId = params?.id as string | undefined;

  useEffect(() => {
    checkAuthAndLoadResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  const checkAuthAndLoadResume = async () => {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Preserve selected template in redirect if present
        const tpl = searchParams.get('template');
        const next = tpl ? `/builder?template=${encodeURIComponent(tpl)}` : '/builder';
        router.push(`/login?next=${encodeURIComponent(next)}`);
        return;
      }

      // If resumeId is provided, load the resume
      if (resumeId && resumeId !== 'new') {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', resumeId)
          .eq('user_id', session.user.id)
          .single();

        if (error || !data) {
          setError('Resume not found');
          router.push('/builder/new');
          return;
        }

        setResumeData(data.content);
      } else {
        // New resume flow: reset to blank state first
        resetResumeData();

        // Apply template selection if provided
        const tpl = searchParams.get('template');
        if (tpl) {
          updateResumeData({ templateId: tpl });
        }
      }
    } catch (err) {
      console.error('Error loading resume:', err);
      setError('Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ATSLoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/builder/new')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Create New Resume
          </button>
        </div>
      </div>
    );
  }

  return <BuilderLayout initialData={resumeData || undefined} resumeId={resumeId} />;
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><ATSLoadingState /></div>}>
      <BuilderPageInner />
    </Suspense>
  );
}


