// app/privacy/page.tsx
export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-neutral-800">
      <h1 className="text-4xl font-semibold mb-6 text-black">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-10">Effective Date: August 15, 2025</p>

      <section className="space-y-6">
        <p>
          Recoards ("we", "our", or "us") is owned and operated by Knyro, a Mauritius-registered business, 
          and operates the website{" "}
          <a href="https://www.recoards.com" className="text-blue-600 underline">
            https://www.recoards.com
          </a>{" "}
          ("Service"). This Privacy Policy explains how we collect, use, and protect your personal information when you use our Service.
        </p>
        <p>By using our website, you consent to the practices described below.</p>

        <h2 className="text-2xl font-semibold text-black mt-8">1. Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Account Data:</strong> Name, email address, and password (via Supabase Auth).</li>
          <li><strong>Usage Data:</strong> Pages visited, time spent, and interactions with our website.</li>
          <li><strong>Payment Info:</strong> Payments are securely processed by PayPal; we do not store card data.</li>
          <li><strong>Analytics Data:</strong> Non-identifiable information about your interactions with our website (e.g., page views, scrolls, clicks on external links) collected via Google Analytics. We do not collect personally identifiable information through this tool.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-black mt-8">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To provide and maintain the Service</li>
          <li>To authenticate users and manage accounts</li>
          <li>To analyze usage and improve experience</li>
          <li>To communicate with you (e.g., updates, support)</li>
          <li>To process payments and enforce Pro access</li>
          <li>To comply with legal obligations</li>
          <li>To analyze general website usage for improving our Service (via Google Analytics)</li>
        </ul>

        <h2 className="text-2xl font-semibold text-black mt-8">3. Third-Party Services</h2>
        <p>
          We work with trusted providers to deliver core functionality:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Supabase (Auth & backend)</li>
          <li>PayPal (Payments)</li>
          <li>Google Analytics (Website analytics)</li>
        </ul>
        <p>
          These services may collect data as per their own privacy policies. We do not control or take responsibility for their practices; see the providers' privacy policies for more information.
        </p>

        <h2 className="text-2xl font-semibold text-black mt-8">4. Data Storage & Security</h2>
        <p>
          We implement commercially reasonable safeguards to protect your data. However, no online service is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="text-2xl font-semibold text-black mt-8">5. Cookies</h2>
        <p>
          We use cookies and similar technologies to improve your browsing experience and track usage. This includes cookies used by Google Analytics. You may disable cookies in your browser if you prefer.
        </p>

        <h2 className="text-2xl font-semibold text-black mt-8">6. Children’s Privacy</h2>
        <p>
          Recoards is not intended for children under 13. We do not knowingly collect data from minors. If we learn that a child has provided data, we will delete it promptly.
        </p>

        <h2 className="text-2xl font-semibold text-black mt-8">7. Data Retention</h2>
        <p>
          We retain data only as long as necessary for the purposes in this policy, unless longer retention is required by law.
        </p>

        <h2 className="text-2xl font-semibold text-black mt-8">8. Your Rights</h2>
        <p>
          Depending on your location, you may have rights under privacy laws, such as:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access your data</li>
          <li>Request correction or deletion</li>
          <li>Opt-out of communications</li>
          <li>Withdraw consent (if applicable)</li>
        </ul>
        <p>
          To exercise these rights, email us at{" "}
          <a href="mailto:contact@recoards.com" className="text-blue-600 underline">
            contact@recoards.com
          </a>
          .
        </p>

        <h2 className="text-2xl font-semibold text-black mt-8">9. Changes to This Policy</h2>
        <p>
          We may update this policy over time. Updates will be posted here with a new effective date. Continued use of our Service means you accept the updated terms.
        </p>

        <h2 className="text-2xl font-semibold text-black mt-8">10. Contact</h2>
        <p>
          Questions or concerns? Please contact Knyro (operator of Recoards) at{" "}
          <a href="mailto:contact@recoards.com" className="text-blue-600 underline">
            contact@recoards.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
