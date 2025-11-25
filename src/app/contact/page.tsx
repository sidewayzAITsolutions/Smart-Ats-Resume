'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white py-16 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-amber-300 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-2xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Have questions about Smart ATS Resume? We're here to help you land your dream job.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-900/70 border border-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
            
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/60 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-300" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                <p className="text-gray-300 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-amber-300 hover:text-amber-200 font-medium"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-900/80 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-900/80 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-white placeholder-gray-500"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-900/80 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="enterprise">Enterprise Plans</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership Opportunity</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-700 bg-gray-900/80 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none text-white placeholder-gray-500"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-amber-500 hover:to-orange-500 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              <p className="text-gray-300 mb-8">
                Whether you have questions about our features, pricing, need help with your resume, 
                or want to explore enterprise solutions, our team is ready to assist you.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gray-900/70 border border-gray-800 rounded-xl shadow-md hover-card animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email Us</h3>
                  <a href="mailto:support@smartatsresume.com" className="text-amber-300 hover:text-amber-200 transition-colors">
                    contact@smartatsresume.com
                  </a>
                  <p className="text-sm text-gray-400 mt-1">We respond within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-900/70 border border-gray-800 rounded-xl shadow-md hover-card animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Business Hours</h3>
                  <p className="text-gray-300">Monday - Friday</p>
                  <p className="text-sm text-gray-400 mt-1">9:00 AM - 6:00 PM EST</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-gray-900/70 border border-gray-800 rounded-xl shadow-md hover-card animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Location</h3>
                  <p className="text-gray-300">New Orleans, LA</p>
                  <p className="text-sm text-gray-400 mt-1">Remote-first company</p>
                </div>
              </div>
            </div>
            
            {/* FAQ Section */}
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link href="/ats-guide" className="flex items-center text-amber-300 hover:text-amber-200 transition-colors group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  <span className="ml-2">ATS Optimization Guide</span>
                </Link>
                <Link href="/pricing" className="flex items-center text-amber-300 hover:text-amber-200 transition-colors group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  <span className="ml-2">View Pricing Plans</span>
                </Link>
                <Link href="/about" className="flex items-center text-amber-300 hover:text-amber-200 transition-colors group">
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  <span className="ml-2">About Smart ATS Resume</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
