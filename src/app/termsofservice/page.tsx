'use client';

import { ArrowLeft, FileText, Shield, AlertTriangle, Scale, Clock, Bot, Database, Users, Lock, Globe, CreditCard, Gavel, Mail } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
  const lastUpdated = 'January 15, 2025';
  const effectiveDate = 'January 15, 2025';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold text-white">Terms of Service</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full mb-6">
            <Scale className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-gray-400 text-lg">
            Please read these terms carefully before using Smart ATS Resume
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Last Updated: {lastUpdated}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              Effective: {effectiveDate}
            </span>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Important Notice About AI Features</h3>
              <p className="text-yellow-200/80 text-sm">
                Smart ATS Resume uses artificial intelligence (AI) and machine learning technologies, including 
                third-party AI services like OpenAI, to provide resume analysis, optimization, and content generation 
                features. By using our Service, you acknowledge and agree that your resume data and content may be 
                processed by AI systems. Please review Sections 6-8 carefully for complete details on AI usage.
              </p>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-gray-800/50 rounded-xl p-6 mb-12 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {[
              '1. Acceptance of Terms',
              '2. Description of Service',
              '3. Account Registration',
              '4. User Responsibilities',
              '5. Subscription and Payments',
              '6. AI-Powered Features',
              '7. Third-Party AI Services',
              '8. AI-Generated Content Ownership',
              '9. Data Processing Consent',
              '10. Intellectual Property Rights',
              '11. Prohibited Uses',
              '12. Disclaimer of Warranties',
              '13. Limitation of Liability',
              '14. Indemnification',
              '15. Termination',
              '16. Governing Law',
              '17. Changes to Terms',
              '18. Contact Information',
            ].map((item, index) => (
              <a
                key={index}
                href={`#section-${index + 1}`}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-10">
          {/* Section 1 */}
          <section id="section-1" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <p>
                By accessing or using Smart ATS Resume ("Service"), you agree to be bound by these Terms of Service 
                ("Terms"). If you disagree with any part of these Terms, you may not access the Service.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you ("User," "you," or "your") and 
                Smart ATS Resume ("Company," "we," "us," or "our"). Your continued use of the Service constitutes 
                acceptance of any updates or modifications to these Terms.
              </p>
              <p>
                You must be at least 16 years of age to use this Service. By using the Service, you represent and 
                warrant that you meet this age requirement and have the legal capacity to enter into this agreement.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section id="section-2" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">2. Description of Service</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <p>
                Smart ATS Resume provides an online platform for resume creation, optimization, and analysis, 
                including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI-powered resume analysis and scoring against Applicant Tracking Systems (ATS)</li>
                <li>AI-generated suggestions for resume improvement and optimization</li>
                <li>Professional resume templates with customizable designs</li>
                <li>AI-powered bullet point generation for work experience</li>
                <li>Keyword analysis and optimization tools</li>
                <li>Resume building and editing capabilities</li>
                <li>Application tracking features (Premium)</li>
                <li>Export functionality in various formats</li>
              </ul>
              <p>
                The Service may be updated, modified, or improved at any time without prior notice. We reserve 
                the right to add, remove, or modify features as we see fit.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section id="section-3" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">3. Account Registration</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <p>
                To access certain features of the Service, you must create an account. When creating an account, 
                you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and accept all risks of unauthorized access</li>
                <li>Immediately notify us if you discover or suspect any security breaches</li>
                <li>Take responsibility for all activities that occur under your account</li>
              </ul>
              <p>
                We reserve the right to suspend or terminate accounts that appear to be fraudulent, abusive, or 
                in violation of these Terms.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="section-4" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">4. User Responsibilities</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <p>As a user of the Service, you are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ensuring that all information you provide in your resume is accurate and truthful</li>
                <li>Reviewing and verifying all AI-generated content before using it</li>
                <li>Not misrepresenting your qualifications, experience, or credentials</li>
                <li>Using the Service only for lawful purposes</li>
                <li>Not attempting to access accounts, systems, or data belonging to others</li>
                <li>Not interfering with or disrupting the Service or its infrastructure</li>
              </ul>
              <div className="bg-orange-900/30 border border-orange-700/50 rounded-lg p-4 mt-4">
                <p className="text-orange-200 text-sm">
                  <strong>Important:</strong> You are solely responsible for the accuracy of your resume content. 
                  AI-generated suggestions are tools to assist you, not replacements for your own judgment and 
                  verification. Misrepresentation on resumes may have legal consequences.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="section-5" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">5. Subscription and Payments</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <h3 className="text-lg font-semibold text-white">5.1 Subscription Plans</h3>
              <p>
                Smart ATS Resume offers both free and premium subscription plans. Premium features include 
                advanced AI analysis, unlimited resume storage, premium templates, and AI-powered content 
                generation. Specific features and pricing are available on our pricing page.
              </p>
              
              <h3 className="text-lg font-semibold text-white">5.2 Billing</h3>
              <p>
                Premium subscriptions are billed through Stripe. By subscribing, you authorize us to charge 
                your payment method on a recurring basis according to your selected plan (monthly or annual).
              </p>
              
              <h3 className="text-lg font-semibold text-white">5.3 Cancellation</h3>
              <p>
                You may cancel your subscription at any time through your account settings. Upon cancellation, 
                you will retain access to premium features until the end of your current billing period.
              </p>
              
              <h3 className="text-lg font-semibold text-white">5.4 Refunds</h3>
              <p>
                Refund requests are handled on a case-by-case basis. Please contact our support team within 
                7 days of purchase for refund inquiries. We reserve the right to deny refunds for accounts 
                that have significantly used premium features.
              </p>
            </div>
          </section>

          {/* Section 6 - AI Features */}
          <section id="section-6" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">6. AI-Powered Features</h2>
            </div>
            <div className="bg-cyan-900/20 border border-cyan-700/50 rounded-xl p-6 mb-4">
              <p className="text-cyan-200 text-sm">
                <strong>AI Disclosure:</strong> This section details how artificial intelligence is used within 
                our Service and your rights and responsibilities when using AI-powered features.
              </p>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <h3 className="text-lg font-semibold text-white">6.1 What Our AI Does</h3>
              <p>Our Service uses AI technology to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Analyze your resume against ATS (Applicant Tracking System) algorithms</li>
                <li>Generate improvement suggestions and optimization recommendations</li>
                <li>Create professional bullet points for work experience descriptions</li>
                <li>Provide keyword analysis and recommendations based on job descriptions</li>
                <li>Score your resume's effectiveness and provide actionable feedback</li>
              </ul>

              <h3 className="text-lg font-semibold text-white">6.2 AI Limitations</h3>
              <p>You acknowledge and understand that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI-generated content may not always be accurate, complete, or appropriate</li>
                <li>AI suggestions are recommendations only and require your review and judgment</li>
                <li>AI cannot guarantee job placement or interview success</li>
                <li>AI may occasionally produce content that requires correction or modification</li>
                <li>ATS scores are estimates and actual performance may vary by company</li>
              </ul>

              <h3 className="text-lg font-semibold text-white">6.3 Your Responsibility</h3>
              <p>
                You are solely responsible for reviewing, editing, and approving all AI-generated content 
                before using it in your resume or job applications. We strongly recommend verifying all 
                facts, figures, and claims generated by our AI systems.
              </p>
            </div>
          </section>

          {/* Section 7 - Third-Party AI */}
          <section id="section-7" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">7. Third-Party AI Services</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <h3 className="text-lg font-semibold text-white">7.1 OpenAI Integration</h3>
              <p>
                Our Service utilizes OpenAI's API to power certain AI features. By using our AI-powered 
                features, you acknowledge that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your resume content may be transmitted to OpenAI's servers for processing</li>
                <li>OpenAI's usage policies apply to content processed by their systems</li>
                <li>We have no control over OpenAI's internal data handling processes</li>
              </ul>

              <h3 className="text-lg font-semibold text-white">7.2 Third-Party Terms</h3>
              <p>
                Your use of AI features is also subject to OpenAI's terms of use and usage policies, 
                available at{' '}
                <a 
                  href="https://openai.com/policies/terms-of-use" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  https://openai.com/policies/terms-of-use
                </a>
                . By using our AI features, you agree to comply with these third-party terms.
              </p>

              <h3 className="text-lg font-semibold text-white">7.3 Data Transmission</h3>
              <p>
                When using AI features, the following data may be transmitted to third-party AI providers:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Resume text content and formatting</li>
                <li>Job descriptions and titles you provide</li>
                <li>Work experience descriptions for bullet point generation</li>
                <li>Keywords and skills for analysis</li>
              </ul>
              <div className="bg-indigo-900/30 border border-indigo-700/50 rounded-lg p-4 mt-4">
                <p className="text-indigo-200 text-sm">
                  <strong>Note:</strong> We do not transmit your personal contact information (name, email, 
                  phone, address) to AI services unless it is part of your resume content being analyzed.
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 - AI Content Ownership */}
          <section id="section-8" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center">
                <Gavel className="w-5 h-5 text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">8. AI-Generated Content Ownership</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <h3 className="text-lg font-semibold text-white">8.1 Your Rights</h3>
              <p>
                Subject to these Terms and applicable law, you retain rights to use AI-generated content 
                created through our Service for your personal and professional use, including in your 
                resume and job applications.
              </p>

              <h3 className="text-lg font-semibold text-white">8.2 License to Us</h3>
              <p>
                By using our Service, you grant us a non-exclusive, worldwide, royalty-free license to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process your content through AI systems for the purpose of providing our Service</li>
                <li>Store and cache AI-generated results to improve service performance</li>
                <li>Use anonymized, aggregated data to improve our AI models and services</li>
              </ul>

              <h3 className="text-lg font-semibold text-white">8.3 No Guarantee of Originality</h3>
              <p>
                AI-generated content may be similar to content generated for other users or content 
                available elsewhere. We do not guarantee that AI-generated content is unique or original. 
                You are responsible for reviewing and customizing generated content for your specific use.
              </p>
            </div>
          </section>

          {/* Section 9 - Data Processing Consent */}
          <section id="section-9" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-teal-600/20 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-teal-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">9. Data Processing Consent</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <p>
                By using our Service, particularly AI-powered features, you explicitly consent to the 
                following data processing activities:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Collection and storage of your resume data in our secure databases</li>
                <li>Transmission of resume content to AI services for analysis and generation</li>
                <li>Caching of AI analysis results for up to 30 days to improve performance</li>
                <li>Anonymized analysis of usage patterns to improve our Service</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-white">9.1 Data Retention</h3>
              <p>
                Your data is retained according to our data retention policy:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Active Accounts:</strong> Resume data retained while your account is active</li>
                <li><strong>AI Cache:</strong> AI analysis results cached for 30 days</li>
                <li><strong>Inactive Accounts:</strong> Data may be deleted after 90 days of inactivity</li>
                <li><strong>Account Deletion:</strong> All data permanently deleted within 30 days of request</li>
              </ul>

              <h3 className="text-lg font-semibold text-white">9.2 Withdrawal of Consent</h3>
              <p>
                You may withdraw your consent to data processing by deleting your account or contacting 
                our support team. Note that withdrawal may limit your ability to use certain features 
                of the Service.
              </p>
            </div>
          </section>

          {/* Section 10 */}
          <section id="section-10" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">10. Intellectual Property Rights</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <h3 className="text-lg font-semibold text-white">10.1 Our Intellectual Property</h3>
              <p>
                The Service, including its original content, features, functionality, and design, is owned 
                by Smart ATS Resume and is protected by international copyright, trademark, patent, and 
                other intellectual property laws.
              </p>

              <h3 className="text-lg font-semibold text-white">10.2 Your Content</h3>
              <p>
                You retain ownership of the original content you create and upload to our Service. By 
                uploading content, you grant us the rights described in Section 8.2.
              </p>

              <h3 className="text-lg font-semibold text-white">10.3 Template Licensing</h3>
              <p>
                Resume templates provided by our Service are licensed for your personal use only. You may 
                not resell, redistribute, or sublicense our templates without express written permission.
              </p>
            </div>
          </section>

          {/* Section 11 */}
          <section id="section-11" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">11. Prohibited Uses</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <p>You agree not to use the Service to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Create fraudulent or misleading resumes with false credentials</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the intellectual property rights of others</li>
                <li>Transmit malware, viruses, or other malicious code</li>
                <li>Attempt to gain unauthorized access to our systems or user accounts</li>
                <li>Use automated systems to extract data or content (scraping)</li>
                <li>Resell or redistribute our services without authorization</li>
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Abuse AI features by submitting harmful, offensive, or inappropriate content</li>
                <li>Attempt to bypass premium feature restrictions or usage limits</li>
              </ul>
            </div>
          </section>

          {/* Section 12 */}
          <section id="section-12" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-600/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">12. Disclaimer of Warranties</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <p className="font-semibold">
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, 
                EITHER EXPRESS OR IMPLIED.
              </p>
              <p>We specifically disclaim:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Any warranty that AI-generated content will be accurate, complete, or error-free</li>
                <li>Any guarantee of job placement, interviews, or career success</li>
                <li>Any warranty that ATS scores accurately predict real-world resume performance</li>
                <li>Any warranty of uninterrupted or error-free service availability</li>
                <li>Any warranty regarding the accuracy or reliability of third-party AI services</li>
              </ul>
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mt-4">
                <p className="text-gray-300 text-sm">
                  <strong>AI Disclaimer:</strong> AI-powered features are tools to assist you, not guarantees 
                  of outcomes. The effectiveness of AI suggestions depends on many factors beyond our control, 
                  including specific employer requirements, market conditions, and individual circumstances.
                </p>
              </div>
            </div>
          </section>

          {/* Section 13 */}
          <section id="section-13" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-rose-600/20 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-rose-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">13. Limitation of Liability</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <p className="font-semibold">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SMART ATS RESUME SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Lost profits, revenue, data, or business opportunities</li>
                <li>Damages arising from reliance on AI-generated content</li>
                <li>Damages resulting from third-party AI service failures or errors</li>
                <li>Career outcomes or job application results</li>
                <li>Any damages exceeding the amount you paid us in the 12 months prior to the claim</li>
              </ul>
              <p className="mt-4">
                Some jurisdictions do not allow limitations on implied warranties or liability, so some 
                of these limitations may not apply to you.
              </p>
            </div>
          </section>

          {/* Section 14 */}
          <section id="section-14" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">14. Indemnification</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <p>
                You agree to indemnify, defend, and hold harmless Smart ATS Resume and its officers, 
                directors, employees, and agents from any claims, damages, losses, or expenses (including 
                reasonable attorneys' fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of any third party</li>
                <li>Any content you submit or generate through the Service</li>
                <li>Any misrepresentation in your resume or job applications</li>
              </ul>
            </div>
          </section>

          {/* Section 15 */}
          <section id="section-15" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-fuchsia-600/20 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-fuchsia-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">15. Termination</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <p>
                We may terminate or suspend your account and access to the Service immediately, without 
                prior notice or liability, for any reason, including if you breach these Terms.
              </p>
              <p>Upon termination:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your right to use the Service will immediately cease</li>
                <li>Any subscription fees already paid will not be refunded</li>
                <li>We may delete your data according to our data retention policy</li>
                <li>Provisions of these Terms that should survive termination will survive</li>
              </ul>
              <p>
                You may terminate your account at any time by contacting us or using the account 
                deletion feature in your settings.
              </p>
            </div>
          </section>

          {/* Section 16 */}
          <section id="section-16" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-sky-600/20 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-sky-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">16. Governing Law</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the 
                United States, without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising under or in connection with these Terms shall be subject to the 
                exclusive jurisdiction of the courts located in the United States. You waive any 
                objection to venue in such courts.
              </p>
            </div>
          </section>

          {/* Section 17 */}
          <section id="section-17" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-lime-600/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-lime-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">17. Changes to Terms</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <p>
                We reserve the right to modify or replace these Terms at any time. If we make material 
                changes, we will notify you by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Posting the new Terms on this page with an updated date</li>
                <li>Sending an email notification to registered users</li>
                <li>Displaying a notice within the Service</li>
              </ul>
              <p>
                Your continued use of the Service after changes become effective constitutes your 
                acceptance of the revised Terms. If you do not agree to the new Terms, you must stop 
                using the Service.
              </p>
            </div>
          </section>

          {/* Section 18 */}
          <section id="section-18" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">18. Contact Information</h2>
            </div>
            <div className="text-gray-300 space-y-4 pl-13">
              <p>If you have any questions about these Terms, please contact us:</p>
              <div className="bg-gray-800 rounded-lg p-6 space-y-3">
                <p className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <strong>Email:</strong>{' '}
                  <a href="mailto:legal@smartatsresume.com" className="text-blue-400 hover:text-blue-300">
                    legal@smartatsresume.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <strong>Website:</strong>{' '}
                  <a href="https://smartatsresume.com" className="text-blue-400 hover:text-blue-300">
                    smartatsresume.com
                  </a>
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                For privacy-related inquiries, please see our{' '}
                <Link href="/privacypolicy" className="text-blue-400 hover:text-blue-300 underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </section>
        </div>

        {/* Acceptance Notice */}
        <div className="mt-16 bg-gray-800/50 rounded-xl p-8 border border-gray-700 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Acknowledgment</h3>
          <p className="text-gray-300 mb-6">
            By using Smart ATS Resume, you acknowledge that you have read, understood, and agree to be 
            bound by these Terms of Service, including the provisions regarding AI-powered features 
            and third-party data processing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/privacypolicy"
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Read Privacy Policy
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Smart ATS Resume. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/privacypolicy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
