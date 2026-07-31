import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function PrivacyPolicy() {
  return (
    <div className="bg-forest-950">
      <SEO
        title="Privacy Policy"
        path="/privacy-policy"
        description="Privacy Policy for Silent Peak Kudremukh Homestay. Learn how we collect, use, and protect your personal information."
      />
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-950 via-[#0a1f0a] to-forest-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-4">Privacy <span className="text-gold-500">Policy</span></h1>
          <p className="text-gray-300 text-lg">Last updated: July 31, 2026</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="glass rounded-3xl p-5 md:p-12 gold-border space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="text-gray-400 leading-relaxed mb-3">
              When you visit our website or contact us, we may collect the following personal information:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Messages or inquiries you send us</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-400 leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Respond to your inquiries and booking requests</li>
              <li>Improve our website and services</li>
              <li>Send you information about your stay (if applicable)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Cookies & Advertising</h2>
            <p className="text-gray-400 leading-relaxed mb-3">
              Our website uses Google AdSense, which uses cookies to serve ads based on your prior visits to our website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the internet.
            </p>
            <p className="text-gray-400 leading-relaxed">
              You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:underline">Google Ads Settings</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing</h2>
            <p className="text-gray-400 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties. We may share information with trusted service providers (such as Google Analytics and Google AdSense) who assist us in operating our website, as long as those parties agree to keep this information confidential.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
            <p className="text-gray-400 leading-relaxed">
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
            <p className="text-gray-400 leading-relaxed">
              You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at <a href="mailto:hosamattamahesh@gmail.com" className="text-gold-500 hover:underline">hosamattamahesh@gmail.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Children&apos;s Privacy</h2>
            <p className="text-gray-400 leading-relaxed">
              Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-400 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Contact Us</h2>
            <p className="text-gray-400 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="mt-3 text-gray-400 space-y-1">
              <p>Silent Peak Kudremukh Homestay</p>
              <p>Hosmata, Samse, Kudremukh, Kalasa, Chikkamagaluru, Karnataka – 577124</p>
              <p>Phone: <a href="tel:+919481580589" className="text-gold-500 hover:underline">+91 94815 80589</a></p>
              <p>Email: <a href="mailto:hosamattamahesh@gmail.com" className="text-gold-500 hover:underline">hosamattamahesh@gmail.com</a></p>
            </div>
          </section>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-gold-500 hover:text-gold-400 transition-colors font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
