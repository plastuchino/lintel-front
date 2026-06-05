import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <Helmet>
        <title>Privacy Policy | Lintel</title>
        <meta name="description" content="Read Lintel's privacy policy. Learn how we collect, use, and protect your personal information when you use our home services platform." />
        <link rel="canonical" href="https://uselintel.pro/privacy" />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <Link to="/" className="text-muted hover:text-white text-sm transition-colors">
              ← Back
            </Link>
            <h1 className="text-3xl font-bold text-white mt-4 mb-2">Privacy Policy</h1>
            <p className="text-muted text-sm">Last updated: April 19, 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-muted leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
              <p>
                We collect information you provide directly, including name, email address, service address, and payment information. We also collect usage data such as jobs booked and ratings.
              </p>
              <p className="mt-2">
                <strong className="text-white">Data Security:</strong> Your email address and home address are encrypted at rest using AES-256. We store only an MD5 hash of your email for account lookup purposes. We never store full payment card details — all payments are handled by Stripe.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To match you with available service professionals</li>
                <li>To process payments and manage transactions</li>
                <li>To send notifications about job status updates</li>
                <li>To resolve disputes and provide customer support</li>
                <li>To improve our platform and services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Information Sharing</h2>
              <p>
                We share your service address with the Worker assigned to your job. We do not sell your personal information to third parties.
              </p>
              <p className="mt-2">
                We use the following third-party services: Google (authentication), Stripe (payments), AWS (storage), and SendGrid (email).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Worker Data</h2>
              <p>
                Workers' profile images are stored in AWS S3. Workers' payout information is managed by Stripe. We display Worker name, rating, and profile image to Users when a job is accepted.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Push Notifications</h2>
              <p>
                With your permission, we send push notifications for job updates. You can disable these in your device or browser settings at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Data Retention</h2>
              <p>
                We retain your account data for as long as your account is active. You may request deletion of your account by contacting support. Job records are retained for 7 years for financial compliance purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information. Contact us at{' '}
                <a href="mailto:privacy@lintel.com" className="text-accent hover:underline">
                  privacy@lintel.com
                </a>{' '}
                to exercise these rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">8. Contact</h2>
              <p>
                For privacy concerns, contact{' '}
                <a href="mailto:privacy@lintel.com" className="text-accent hover:underline">
                  privacy@lintel.com
                </a>{' '}
                or call{' '}
                <a href="tel:3012727224" className="text-accent hover:underline">
                  (301) 272-7224
                </a>
                .
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
