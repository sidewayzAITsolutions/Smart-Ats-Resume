'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Briefcase, 
  Building, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  GripVertical, 
  Loader2, 
  MapPin, 
  MoreVertical, 
  Plus, 
  Star, 
  Trash2, 
  X 
} from 'lucide-react';
import GlobalNavigation from '@/components/GlobalNavigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

type JobApplication = {
  id: string;
  company: string;
  position: string;
  location?: string;
  url?: string;
  notes?: string;
  status: 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected';
  created_at: string;
  updated_at: string;
};

type Column = {
  id: 'saved' | 'applied' | 'interviewing' | 'offer';
  title: string;
  icon: React.ReactNode;
  color: string;
};

const COLUMNS: Column[] = [
  { id: 'saved', title: 'Saved', icon: <Star className="w-4 h-4" />, color: 'text-gray-400 bg-gray-900/50 border-gray-700' },
  { id: 'applied', title: 'Applied', icon: <Clock className="w-4 h-4" />, color: 'text-blue-400 bg-blue-900/20 border-blue-700/50' },
  { id: 'interviewing', title: 'Interviewing', icon: <Calendar className="w-4 h-4" />, color: 'text-amber-400 bg-amber-900/20 border-amber-700/50' },
  { id: 'offer', title: 'Offer', icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-400 bg-green-900/20 border-green-700/50' },
];

export default function TrackerPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);
  const [draggedItem, setDraggedItem] = useState<JobApplication | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    url: '',
    notes: '',
    status: 'saved' as JobApplication['status']
  });

  // Check auth and load applications
  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

        // Try to load applications from Supabase
        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Could not load applications:', error);
          // Table might not exist yet - use local storage fallback
          const stored = localStorage.getItem('smartats_job_applications');
          if (stored) {
            setApplications(JSON.parse(stored));
          }
        } else if (data) {
          setApplications(data);
        }
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save to local storage as fallback
  useEffect(() => {
    if (applications.length > 0) {
      localStorage.setItem('smartats_job_applications', JSON.stringify(applications));
    }
  }, [applications]);

  const handleAddApplication = async () => {
    if (!formData.company || !formData.position) {
      toast.error('Company and position are required');
      return;
    }

    const newApp: JobApplication = {
      id: crypto.randomUUID(),
      company: formData.company,
      position: formData.position,
      location: formData.location,
      url: formData.url,
      notes: formData.notes,
      status: formData.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Try to save to Supabase
    if (isAuthenticated) {
      try {
        const supabase = createClient();
        const { error } = await supabase.from('job_applications').insert(newApp);
        if (error) {
          console.warn('Could not save to Supabase:', error);
        }
      } catch (err) {
        console.warn('Supabase save error:', err);
      }
    }

    setApplications(prev => [newApp, ...prev]);
    setFormData({ company: '', position: '', location: '', url: '', notes: '', status: 'saved' });
    setShowAddModal(false);
    toast.success('Application added!');
  };

  const handleUpdateApplication = async (id: string, updates: Partial<JobApplication>) => {
    const updated = { ...updates, updated_at: new Date().toISOString() };

    // Try to update in Supabase
    if (isAuthenticated) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('job_applications')
          .update(updated)
          .eq('id', id);
        if (error) {
          console.warn('Could not update in Supabase:', error);
        }
      } catch (err) {
        console.warn('Supabase update error:', err);
      }
    }

    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, ...updated } : app)
    );
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;

    // Try to delete from Supabase
    if (isAuthenticated) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('job_applications')
          .delete()
          .eq('id', id);
        if (error) {
          console.warn('Could not delete from Supabase:', error);
        }
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    setApplications(prev => prev.filter(app => app.id !== id));
    toast.success('Application deleted');
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, app: JobApplication) => {
    setDraggedItem(app);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: JobApplication['status']) => {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== newStatus) {
      handleUpdateApplication(draggedItem.id, { status: newStatus });
      toast.success(`Moved to ${newStatus}`);
    }
    setDraggedItem(null);
  };

  // Group applications by status
  const getApplicationsByStatus = (status: JobApplication['status']) => 
    applications.filter(app => app.status === status);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
        <GlobalNavigation showBuilderActions={false} showMainNav={true} showAuthButtons={true} />
        <div className="pt-24 px-6">
          <div className="max-w-md mx-auto text-center">
            <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-4">Sign in to Track Applications</h1>
            <p className="text-gray-400 mb-8">Track your job applications and never lose track of where you've applied.</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <GlobalNavigation showBuilderActions={false} showMainNav={true} showAuthButtons={true} />

      {/* Header */}
      <section className="pt-24 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Job Application Tracker</h1>
              <p className="text-gray-400">Track your applications from saved to offer</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Application
            </button>
          </div>
        </div>
      </section>

      {/* Kanban Board */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLUMNS.map(column => (
              <div
                key={column.id}
                className={`rounded-xl border ${column.color} p-4 min-h-[400px]`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700/50">
                  {column.icon}
                  <h3 className="font-semibold text-white">{column.title}</h3>
                  <span className="ml-auto text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                    {getApplicationsByStatus(column.id).length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {getApplicationsByStatus(column.id).map(app => (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app)}
                      className={`bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-grab active:cursor-grabbing hover:border-gray-600 transition-all ${
                        draggedItem?.id === app.id ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-gray-600" />
                          <Building className="w-4 h-4 text-gray-500" />
                        </div>
                        <button
                          onClick={() => handleDeleteApplication(app.id)}
                          className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <h4 className="font-semibold text-white text-sm mb-1">{app.position}</h4>
                      <p className="text-gray-400 text-sm">{app.company}</p>
                      
                      {app.location && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {app.location}
                        </div>
                      )}
                      
                      {app.url && (
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-xs text-teal-400 hover:text-teal-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Job
                        </a>
                      )}

                      <div className="mt-3 pt-3 border-t border-gray-700/50 text-xs text-gray-500">
                        Added {new Date(app.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}

                  {getApplicationsByStatus(column.id).length === 0 && (
                    <div className="text-center py-8 text-gray-600">
                      <p className="text-sm">No applications</p>
                      <p className="text-xs mt-1">Drag cards here or add new</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Add Application</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-200 rounded-full hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  placeholder="e.g., Google"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Position *</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  placeholder="e.g., San Francisco, CA"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Job URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as JobApplication['status'] }))}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offer">Offer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-teal-500 focus:outline-none resize-none"
                  rows={3}
                  placeholder="Any notes about this application..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddApplication}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
              >
                Add Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} SmartATS. Beat the bots, land the job.</p>
        </div>
      </footer>
    </div>
  );
}
