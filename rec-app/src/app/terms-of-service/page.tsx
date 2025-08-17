// app/terms-of-service.tsx
export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-base text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-12 text-center">
        Last Updated: August 17, 2025
      </p>

      <section className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Recoards (the "Service"), you agree to be bound by
            these Terms of Service ("Terms"). If you do not agree to these Terms,
            you must not use the Service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">2. Description of Service</h2>
          <p>
            Recoards is a web application that allows users to create, organize, and
            share recommendation boards for media such as anime, books, games,
            music, and more.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">3. Account Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account. Recoards is not liable for any loss or damage from your failure
            to protect your login information.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">4. Payment and Access</h2>
          <p>
            Recoards offers both free and paid plans. The paid plan is a one-time
            purchase that grants immediate access to additional features such as
            unlimited boards and recommendations. By purchasing, you agree to pay
            the posted price and receive instant access to the premium features.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">5. No Refund Policy</h2>
          <p>
            All payments are final. Due to the digital nature of the Service and
            immediate feature access upon purchase, we do not offer refunds under
            any circumstances. By purchasing, you acknowledge and agree to this
            policy.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">6. Acceptable Use</h2>
          <p>You agree not to use Recoards to:</p>
          <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
            <li>Break any laws or infringe on any third-party rights</li>
            <li>Publish or link to harmful, offensive, or misleading content</li>
            <li>Attempt to interfere with or disrupt the Service’s functionality</li>
            <li>Scrape, copy, or resell the Service or its content</li>
            <li>Abuse the platform to spam or harass others</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold">7. Public Sharing</h2>
          <p>
            Boards shared publicly are visible to anyone with the link. Users are
            solely responsible for the content they choose to make public. Do not
            share private or sensitive information unless you are comfortable with
            it being accessible online.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">8. Intellectual Property & Copyright</h2>
          <p>
            All original code, design, and branding on Recoards are the property of its creator. 
            You may not copy, reproduce, or distribute any part of the Service without express permission. 
          </p>
          <br />
          <p>
            Recoards provides a platform for users to create boards and recommendations. 
            User-generated content remains the property of the user; however, by uploading content, 
            you grant us a license to display and host it within the Service. While we facilitate this content, 
            we do not manually control, verify, or endorse every individual submission and are not responsible 
            for user-generated content.
          </p>
          <br />
          <p>
            If a copyright owner believes that any content uploaded to Recoards infringes their rights, 
            they may contact us at <a href="mailto:contact@recoards.com" className="text-blue-600">contact@recoards.com</a> {''}
            to request removal. Upon receiving a valid notice, we will remove or disable access to the 
            infringing content in order to comply with copyright law. We reserve the right to terminate 
            accounts of users who repeatedly upload infringing content.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">9. Service Availability</h2>
          <p>
            While we aim to keep the Service available at all times, we do not
            guarantee uninterrupted uptime. Recoards may be subject to outages,
            updates, or maintenance without prior notice.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">10. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Recoards shall not be liable
            for any indirect, incidental, special, or consequential damages,
            including but not limited to loss of data, profits, or usage.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">11. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your access to the
            Service at any time, with or without cause, including for violations of
            these Terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">12. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be
            announced, and your continued use of the Service after changes have
            been made constitutes your agreement to the revised Terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">13. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws
            of Mauritius, without regard to conflict of law principles.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold">14. Contact</h2>
          <p>
            For any questions about these Terms of Service, please contact us at:{" "}
            <a
              href="mailto:contact@recoards.com"
              className="text-blue-600 underline"
            >
              contact@recoards.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
