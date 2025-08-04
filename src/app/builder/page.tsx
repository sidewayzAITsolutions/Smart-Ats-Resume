/ src/app/builder/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import BuilderLayout from '@/components/Builder/BuilderLayout';
import LoadingSpinner from '@/components/LoadingStates';
import { useSupabase } from '@/hooks/useSupabase';
import { ResumeData } from '@/types/resume';

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = useSupabase();
  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const resumeId = params?.id as string;

  useEffect(() => {
    checkAuthAndLoadResume();
  }, [resumeId]);

  const checkAuthAndLoadResume = async () => {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login?redirect=/builder');
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
        <LoadingSpinner />
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

  return <BuilderLayout initialData={resumeData} resumeId={resumeId} />;
}

// src/app/builder/[id]/page.tsx
export { default } from '../page';