// src/store/resumeStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ResumeData } from '@/types/resume';

interface ResumeStore {
  resumeData: ResumeData;
  updateResumeData: (data: Partial<ResumeData>) => void;
  setResumeData: (data: ResumeData) => void;
  resetResumeData: () => void;
  saveResume: (id: string, data: ResumeData) => Promise<void>;
  loadResume: (id: string) => Promise<void>;
}

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  customSections: [],
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumeData: initialResumeData,
      
      updateResumeData: (data) => 
        set((state) => ({
          resumeData: { ...state.resumeData, ...data },
        })),
      
      setResumeData: (data) => 
        set({ resumeData: data }),
      
      resetResumeData: () => 
        set({ resumeData: initialResumeData }),
      
      saveResume: async (id, data) => {
        try {
          const response = await fetch(`/api/resumes/${id}`, {
            method: id === 'new' ? 'POST' : 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          
          if (!response.ok) {
            throw new Error('Failed to save resume');
          }
          
          const result = await response.json();
          
          // If it was a new resume, update the URL
          if (id === 'new' && result.id) {
            window.history.replaceState({}, '', `/builder/${result.id}`);
          }
        } catch (error) {
          console.error('Error saving resume:', error);
          throw error;
        }
      },
      
      loadResume: async (id) => {
        try {
          const response = await fetch(`/api/resumes/${id}`);
          
          if (!response.ok) {
            throw new Error('Failed to load resume');
          }
          
          const data = await response.json();
          set({ resumeData: data });
        } catch (error) {
          console.error('Error loading resume:', error);
          throw error;
        }
      },
    }),
    {
      name: 'resume-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ resumeData: state.resumeData }),
    }
  )
);