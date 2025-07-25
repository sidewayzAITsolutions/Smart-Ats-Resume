import Head from 'next/head';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service | Smart ATS Resume</title>
        <meta name="description" content="Terms of Service for Smart ATS Resume" />
      </Head>
      <main className="max-w-3xl mx-auto px-4 py-12 text-gray-900">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-sm mb-6 text-gray-500">Effective Date: [Insert Date]</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">1. Eligibility</h2>
          <p>You must be at least 13 years old to use Smart ATS Resume. By using our service, you confirm that you are eligible and legally able to agree to these terms.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">2. User Accounts</h2>
          <p>You can sign in using Google OAuth. You are responsible for keeping your login credentials secure and are liable for any activity under your account.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">3. Acceptable Use</h2>
          <p>You agree not to use the service for unlawful purposes or to violate any applicable laws. We reserve the right to suspend or terminate your account if you engage in prohibited behavior.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">4. Resume Content</h2>
          <p>You retain ownership of your resume data. By submitting resume content, you grant us a license to use and store it solely to operate our service.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">5. Payments</h2>
          <p>If you purchase a premium plan, payments may be processed through Stripe. We do not store credit card information directly on our servers.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">6. Intellectual Property</h2>
          <p>The Smart ATS Resume brand, design, and all content (excluding user content) are the property of Sidewayz AiT Solutions and protected under intellectual property law.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">7. Disclaimer</h2>
          <p>We provide the service "as is" without any warranties. We do not guarantee that your resume will pass ATS filters or secure employment.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">8. Limitation of Liability</h2>
          <p>We are not liable for any indirect or consequential damages resulting from your use of the service.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">9. Privacy</h2>
          <p>Your use of the service is also governed by our <a href="/privacypolicy" className="text-blue-600 underline">Privacy Policy</a>.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">10. Termination</h2>
          <p>We reserve the right to suspend or terminate your access to the service for violating these terms or for operational reasons.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">11. Modifications</h2>
          <p>We may update these terms from time to time. Continued use of the service means you accept the new terms.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">12. Contact Us</h2>
          <p>If you have questions or concerns, please contact us at <a href="mailto:support@smartatsresume.com" className="text-blue-600 underline">support@smartatsresume.com</a>.</p>
        </section>
      </main>
    </>
  );
}
