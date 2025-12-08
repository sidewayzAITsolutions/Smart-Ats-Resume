import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Smart ATS Resume</title>
        <meta name="description" content="Privacy Policy for Smart ATS Resume - Learn how we collect, use, and protect your data including AI processing of resumes." />
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-12 bg-gray-950 min-h-screen">
        <h1 className="text-4xl font-bold mb-6 text-white">Privacy Policy</h1>
        <p className="text-sm mb-8 text-gray-400">Effective Date: December 8, 2025 | Last Updated: December 8, 2025</p>

        <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4 mb-8">
          <p className="text-amber-300 text-sm">
            <strong>Important Notice:</strong> This service uses artificial intelligence (AI) and machine learning models to process your resume data. Please read Section 5 carefully to understand how your data is processed by AI systems.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">1. Overview</h2>
          <p className="text-gray-300 leading-relaxed">
            Smart ATS Resume, operated by Sidewayz AiT Solutions (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), is committed to protecting your privacy and ensuring transparency about how we handle your personal information. This Privacy Policy explains how we collect, use, disclose, store, and safeguard your information when you use our website and services at <strong className="text-teal-400">smartatsresume.com</strong>.
          </p>
          <p className="text-gray-300 leading-relaxed mt-3">
            By using our services, you acknowledge that you have read, understood, and agree to this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">2. Information We Collect</h2>
          <p className="text-gray-300 mb-4">We collect several types of information from and about users of our service:</p>
          
          <h3 className="text-lg font-medium text-teal-400 mb-2">2.1 Personal Information You Provide</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
            <li><strong>Account Information:</strong> Name, email address, and profile picture (when signing in via Google OAuth)</li>
            <li><strong>Resume Content:</strong> Full name, contact information, work history, education, skills, certifications, and any other information you include in your resume</li>
            <li><strong>Job Application Data:</strong> Target job descriptions, job titles, and company names you provide for optimization</li>
            <li><strong>Payment Information:</strong> Billing address and payment method details (processed securely by Stripe; we do not store full credit card numbers)</li>
            <li><strong>Communications:</strong> Any messages, feedback, or support requests you send to us</li>
          </ul>

          <h3 className="text-lg font-medium text-teal-400 mb-2">2.2 Information Collected Automatically</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Device Information:</strong> Browser type, operating system, device identifiers, and screen resolution</li>
            <li><strong>Usage Data:</strong> Pages visited, features used, time spent on pages, and clickstream data</li>
            <li><strong>Log Data:</strong> IP address, access times, referring URLs, and error logs</li>
            <li><strong>Location Data:</strong> Approximate geographic location derived from IP address (country/region level only)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">3. How We Use Your Information</h2>
          <p className="text-gray-300 mb-4">We use the information we collect for the following purposes:</p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Service Delivery:</strong> To provide, maintain, and improve our resume-building and ATS optimization services</li>
            <li><strong>AI Processing:</strong> To analyze your resume using artificial intelligence models for ATS scoring, keyword optimization, and content suggestions (see Section 5)</li>
            <li><strong>Authentication:</strong> To verify your identity and enable secure sign-in via Google OAuth or email</li>
            <li><strong>Personalization:</strong> To customize your experience based on your preferences and usage patterns</li>
            <li><strong>Payment Processing:</strong> To process subscription payments and manage billing through Stripe</li>
            <li><strong>Communication:</strong> To send service-related notifications, updates, and promotional materials (with your consent)</li>
            <li><strong>Analytics:</strong> To analyze usage trends and improve our platform&apos;s performance and features</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">4. Legal Basis for Processing (GDPR)</h2>
          <p className="text-gray-300 mb-4">For users in the European Economic Area (EEA) and UK, we process your personal data based on the following legal grounds:</p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Contract Performance:</strong> Processing necessary to provide the services you requested</li>
            <li><strong>Legitimate Interests:</strong> Processing for our legitimate business interests, such as improving our services and preventing fraud</li>
            <li><strong>Consent:</strong> Processing based on your explicit consent, which you may withdraw at any time</li>
            <li><strong>Legal Obligation:</strong> Processing required to comply with applicable laws</li>
          </ul>
        </section>

        <section className="mb-10 bg-purple-900/20 border border-purple-700/50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
            <span className="mr-2">🤖</span> 5. Artificial Intelligence and Data Processing
          </h2>
          <p className="text-gray-300 mb-4">
            Smart ATS Resume uses artificial intelligence (AI) and machine learning technologies to enhance our services. This section explains how AI processes your data.
          </p>

          <h3 className="text-lg font-medium text-purple-400 mb-2">5.1 AI Technologies Used</h3>
          <p className="text-gray-300 mb-4">We utilize the following AI services to process your resume and provide our features:</p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
            <li><strong>OpenAI GPT Models:</strong> We use OpenAI&apos;s GPT-4 and GPT-4o-mini models to generate resume content, bullet points, professional summaries, and optimization suggestions</li>
            <li><strong>ATS Scoring Algorithms:</strong> Our proprietary algorithms analyze your resume structure, keywords, and formatting for ATS compatibility</li>
            <li><strong>Natural Language Processing (NLP):</strong> We use NLP techniques to extract keywords, analyze job descriptions, and match skills</li>
          </ul>

          <h3 className="text-lg font-medium text-purple-400 mb-2">5.2 Data Sent to AI Providers</h3>
          <p className="text-gray-300 mb-4">When you use AI-powered features, the following data may be sent to our AI providers:</p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
            <li>Resume content (work history, skills, education, achievements)</li>
            <li>Job titles and descriptions you provide for tailored optimization</li>
            <li>Text you input for AI-generated suggestions or improvements</li>
          </ul>
          <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
            <p className="text-gray-300 text-sm">
              <strong className="text-amber-400">Important:</strong> We do NOT send your email address, password, payment information, or government-issued identification numbers to AI providers. Only resume-related content necessary for the requested feature is transmitted.
            </p>
          </div>

          <h3 className="text-lg font-medium text-purple-400 mb-2">5.3 AI Provider Data Handling</h3>
          <p className="text-gray-300 mb-4">Our primary AI provider, OpenAI, handles data according to their policies:</p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
            <li>Data sent via API is <strong>not used to train OpenAI&apos;s models</strong> (per OpenAI&apos;s API data usage policy)</li>
            <li>OpenAI retains API data for up to 30 days for abuse monitoring, then deletes it</li>
            <li>All data transmission is encrypted using TLS 1.2+</li>
            <li>For more details, see <a href="https://openai.com/policies/privacy-policy" className="text-teal-400 underline" target="_blank" rel="noopener noreferrer">OpenAI&apos;s Privacy Policy</a></li>
          </ul>

          <h3 className="text-lg font-medium text-purple-400 mb-2">5.4 AI Response Caching</h3>
          <p className="text-gray-300 mb-4">
            To improve performance and reduce costs, we cache AI-generated responses in our database for up to 30 days. Cached data includes:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
            <li>A hash of the original prompt (not the full text)</li>
            <li>The AI-generated response</li>
            <li>Timestamp and expiration date</li>
          </ul>
          <p className="text-gray-300">
            Cached responses are automatically deleted after 30 days. You can request immediate deletion by contacting us.
          </p>

          <h3 className="text-lg font-medium text-purple-400 mb-2">5.5 Your Rights Regarding AI Processing</h3>
          <p className="text-gray-300 mb-4">You have the following rights regarding AI processing of your data:</p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Opt-Out:</strong> You may choose not to use AI-powered features. Basic resume building is available without AI.</li>
            <li><strong>Transparency:</strong> You can request information about how AI was used to process your specific data</li>
            <li><strong>Human Review:</strong> You can request human review of any AI-generated content or decisions</li>
            <li><strong>Deletion:</strong> You can request deletion of all AI-processed data associated with your account</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">6. Information Sharing and Disclosure</h2>
          <p className="text-gray-300 mb-4">
            We do <strong className="text-red-400">NOT sell, rent, or trade</strong> your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          
          <h3 className="text-lg font-medium text-teal-400 mb-2">6.1 Service Providers</h3>
          <p className="text-gray-300 mb-4">We share data with trusted third-party service providers who assist us in operating our platform:</p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
            <li><strong>Supabase:</strong> Database hosting, authentication, and data storage</li>
            <li><strong>Stripe:</strong> Payment processing and subscription management</li>
            <li><strong>Google:</strong> OAuth authentication services</li>
            <li><strong>OpenAI:</strong> AI-powered content generation (see Section 5)</li>
            <li><strong>Vercel:</strong> Website hosting and content delivery</li>
          </ul>

          <h3 className="text-lg font-medium text-teal-400 mb-2">6.2 Legal Requirements</h3>
          <p className="text-gray-300">
            We may disclose your information if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
          </p>
        </section>

        <section className="mb-10 bg-teal-900/20 border border-teal-700/50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white flex items-center">
            <span className="mr-2">📦</span> 7. Data Retention Policy
          </h2>
          <p className="text-gray-300 mb-4">
            We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy. Below are our specific retention periods:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-300 mb-4">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left p-3 font-semibold">Data Type</th>
                  <th className="text-left p-3 font-semibold">Retention Period</th>
                  <th className="text-left p-3 font-semibold">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="p-3">Account Information</td>
                  <td className="p-3">Until account deletion + 30 days</td>
                  <td className="p-3">Account recovery grace period</td>
                </tr>
                <tr>
                  <td className="p-3">Resume Content</td>
                  <td className="p-3">Until account deletion + 30 days</td>
                  <td className="p-3">Service delivery and recovery</td>
                </tr>
                <tr>
                  <td className="p-3">AI-Generated Content</td>
                  <td className="p-3">Until account deletion</td>
                  <td className="p-3">User access to generated content</td>
                </tr>
                <tr>
                  <td className="p-3">AI Response Cache</td>
                  <td className="p-3">30 days from generation</td>
                  <td className="p-3">Performance optimization</td>
                </tr>
                <tr>
                  <td className="p-3">Payment Records</td>
                  <td className="p-3">7 years from transaction</td>
                  <td className="p-3">Legal and tax compliance</td>
                </tr>
                <tr>
                  <td className="p-3">Usage Logs</td>
                  <td className="p-3">90 days</td>
                  <td className="p-3">Security and debugging</td>
                </tr>
                <tr>
                  <td className="p-3">Support Communications</td>
                  <td className="p-3">3 years from last interaction</td>
                  <td className="p-3">Customer service quality</td>
                </tr>
                <tr>
                  <td className="p-3">Analytics Data</td>
                  <td className="p-3">26 months (anonymized)</td>
                  <td className="p-3">Service improvement</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-medium text-teal-400 mb-2">7.1 Account Deletion</h3>
          <p className="text-gray-300 mb-4">
            When you delete your account, we initiate a 30-day grace period during which your data is retained but inaccessible. After this period, we permanently delete:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
            <li>All resume content and versions</li>
            <li>Profile information and preferences</li>
            <li>AI-generated content associated with your account</li>
            <li>Authentication tokens and session data</li>
          </ul>
          <p className="text-gray-300">
            <strong>Note:</strong> Payment records are retained for 7 years as required by tax and financial regulations. These records are stored securely by Stripe and contain minimal personal information.
          </p>

          <h3 className="text-lg font-medium text-teal-400 mb-2">7.2 Data Portability</h3>
          <p className="text-gray-300">
            You can export your resume data at any time in PDF or JSON format. To request a complete export of all your personal data, contact us at <a href="mailto:privacy@smartatsresume.com" className="text-teal-400 underline">privacy@smartatsresume.com</a>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">8. Cookies and Tracking Technologies</h2>
          <p className="text-gray-300 mb-4">We use cookies and similar tracking technologies to enhance your experience:</p>
          
          <h3 className="text-lg font-medium text-teal-400 mb-2">8.1 Types of Cookies</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
            <li><strong>Essential Cookies:</strong> Required for authentication and core functionality (cannot be disabled)</li>
            <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our site (Google Analytics)</li>
            <li><strong>Performance Cookies:</strong> Monitor site performance and identify issues</li>
          </ul>
          <p className="text-gray-300">
            You can manage cookie preferences through your browser settings. Disabling certain cookies may affect site functionality.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">9. Data Security</h2>
          <p className="text-gray-300 mb-4">We implement robust security measures to protect your information:</p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
            <li><strong>Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
            <li><strong>Access Controls:</strong> Strict role-based access to personal data</li>
            <li><strong>Infrastructure:</strong> Hosted on secure, SOC 2 compliant infrastructure (Supabase, Vercel)</li>
            <li><strong>Authentication:</strong> Secure OAuth 2.0 implementation with token encryption</li>
            <li><strong>Monitoring:</strong> 24/7 security monitoring and intrusion detection</li>
          </ul>
          <p className="text-gray-300 mt-4">
            While we strive to protect your data, no method of transmission or storage is 100% secure. We cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">10. Your Privacy Rights</h2>
          <p className="text-gray-300 mb-4">Depending on your location, you may have the following rights:</p>
          
          <h3 className="text-lg font-medium text-teal-400 mb-2">10.1 All Users</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Request correction of inaccurate data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
          </ul>

          <h3 className="text-lg font-medium text-teal-400 mb-2">10.2 EEA/UK Residents (GDPR)</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
            <li>Right to restrict processing</li>
            <li>Right to object to processing</li>
            <li>Right to withdraw consent</li>
            <li>Right to lodge a complaint with a supervisory authority</li>
          </ul>

          <h3 className="text-lg font-medium text-teal-400 mb-2">10.3 California Residents (CCPA/CPRA)</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
            <li>Right to know what personal information is collected</li>
            <li>Right to know if personal information is sold or shared</li>
            <li>Right to opt-out of sale of personal information (we do not sell data)</li>
            <li>Right to non-discrimination for exercising your rights</li>
          </ul>

          <p className="text-gray-300 mt-4">
            To exercise any of these rights, contact us at <a href="mailto:privacy@smartatsresume.com" className="text-teal-400 underline">privacy@smartatsresume.com</a>. We will respond within 30 days.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">11. International Data Transfers</h2>
          <p className="text-gray-300">
            Our services are hosted in the United States. If you access our services from outside the US, your data may be transferred to and processed in the US. We ensure appropriate safeguards are in place for international transfers, including Standard Contractual Clauses (SCCs) where required.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">12. Children&apos;s Privacy</h2>
          <p className="text-gray-300">
            Smart ATS Resume is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If we discover that we have collected data from a child under 16, we will delete it immediately. If you believe we have collected information from a child, please contact us at <a href="mailto:privacy@smartatsresume.com" className="text-teal-400 underline">privacy@smartatsresume.com</a>.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">13. Changes to This Privacy Policy</h2>
          <p className="text-gray-300">
            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a prominent notice on our website and updating the &quot;Last Updated&quot; date. For material changes, we will send an email notification to registered users. Your continued use of the service after changes become effective constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-white">14. Contact Us</h2>
          <p className="text-gray-300 mb-4">If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-300"><strong>Sidewayz AiT Solutions</strong></p>
            <p className="text-gray-300">Email: <a href="mailto:privacy@smartatsresume.com" className="text-teal-400 underline">privacy@smartatsresume.com</a></p>
            <p className="text-gray-300">General Support: <a href="mailto:support@smartatsresume.com" className="text-teal-400 underline">support@smartatsresume.com</a></p>
            <p className="text-gray-300 mt-2 text-sm">Response time: Within 30 days for privacy-related requests</p>
          </div>
        </section>

        <div className="border-t border-gray-700 pt-6 mt-10">
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} Sidewayz AiT Solutions. All rights reserved.
          </p>
        </div>
      </main>
    </>
  );
}
