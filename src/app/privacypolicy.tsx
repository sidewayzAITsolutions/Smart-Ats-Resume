import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Smart ATS Resume</title>
        <meta name="description" content="Privacy Policy for Smart ATS Resume" />
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-12 text-gray-900">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm mb-6 text-gray-500">Effective Date: [Insert Date]</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">1. Overview</h2>
          <p>Smart ATS Resume (“we,” “us,” or “our”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services at <strong>smartatsresume.com</strong>.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <ul className="list-disc list-inside">
            <li><strong>Personal Information:</strong> Name, email address, job title, resume content, and other data you provide when building a resume or signing in.</li>
            <li><strong>Authentication Data:</strong> Information from Google OAuth (e.g., name, email, profile picture).</li>
            <li><strong>Derivative Data:</strong> Log and usage data such as browser type, IP address, device info, and approximate location (via IP geolocation).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside">
            <li>To provide and operate our resume-building service</li>
            <li>To authenticate users and enable secure sign-in via Google</li>
            <li>To save and display resume content for editing and download</li>
            <li>To improve user experience and system performance</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">4. Legal Basis for Processing</h2>
          <p>We process personal information as necessary to fulfill our contract with you and deliver the service you requested, in compliance with applicable data protection laws (e.g., GDPR, CCPA).</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">5. Sharing Your Information</h2>
          <p>We do <strong>not sell</strong> your data. We may share data only with trusted service providers like:</p>
          <ul className="list-disc list-inside">
            <li>Supabase (for authentication and storage)</li>
            <li>Stripe (for payment processing)</li>
            <li>Google (for sign-in services)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">6. Cookies and Tracking</h2>
          <p>We may use cookies or analytics tools (such as Google Analytics) to collect non-personal data and improve our services. You can manage cookie preferences in your browser settings.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">7. Data Retention</h2>
          <p>We retain user data for as long as necessary to provide our services or as required by law. Users may request deletion of their data by contacting us.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">8. Security</h2>
          <p>We implement technical and organizational security measures to protect your information. However, no system is completely secure, and we cannot guarantee absolute protection.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">9. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at <a href="mailto:support@smartatsresume.com" className="text-blue-600 underline">support@smartatsresume.com</a>.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">10. Children’s Privacy</h2>
          <p>Smart ATS Resume is not intended for children under 13. We do not knowingly collect data from anyone under this age.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">11. Updates to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, contact us at:</p>
          <p>Email: <a href="mailto:support@smartatsresume.com" className="text-blue-600 underline">support@smartatsresume.com</a></p>
        </section>
      </main>
    </>
  );
}
