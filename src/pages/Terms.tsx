import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <Helmet>
        <title>Terms of Service | Lintel</title>
        <meta name="description" content="Read Lintel's terms of service. Understand your rights and responsibilities when booking home services on the Lintel platform." />
        <link rel="canonical" href="https://uselintel.pro/terms" />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <Link to="/" className="text-muted hover:text-white text-sm transition-colors">
              ← Back
            </Link>
            <h1 className="text-3xl font-bold text-white mt-4 mb-2">Terms of Service</h1>
            <p className="text-muted text-sm">Last updated: April 19, 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-6 text-muted leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the lintel platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree, you may not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. Service Description</h2>
              <p>
                lintel connects customers ("Users") with independent service professionals ("Workers") for home maintenance services including gutter cleaning, window washing, pressure washing, house cleaning, and lawn care.
              </p>
              <p className="mt-2">
                lintel is a technology platform and marketplace. We do not directly provide home services and are not responsible for the quality, safety, or legality of services performed by Workers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. User Accounts</h2>
              <p>
                You must sign in with a valid Google account. You are responsible for maintaining the confidentiality of your account. You must be at least 18 years old to use this Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Payments and Refunds</h2>
              <p>
                Payments are processed securely via Stripe. Your payment method is authorized at the time of booking but charged only after job completion and confirmation. Tips are entirely optional and go 100% to the Worker.
              </p>
              <p className="mt-2">
                Refund requests must be submitted within 7 days of service completion. Disputes are reviewed on a case-by-case basis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Confirmation Code Policy</h2>
              <p>
                Upon job completion, you will receive a 6-digit confirmation code from your Worker. <strong className="text-white">Only provide this code if you are fully satisfied with the work.</strong> Entering the code releases payment to the Worker and cannot be reversed.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">6. Promo Codes</h2>
              <p>
                Each registered Worker receives a unique promo code. Users who apply a Worker's promo code at checkout authorize a portion of the payment to be directed to that Worker as a referral benefit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">7. Disputes</h2>
              <p>
                If you have a dispute regarding a job, you may file a dispute through the app. Our support team will review within 24 hours. For urgent matters, call{' '}
                <a href="tel:3012727224" className="text-accent hover:underline">
                  (301) 272-7224
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">8. Worker Terms</h2>
              <p>
                Workers are independent contractors, not employees of lintel. Workers are responsible for their own taxes, insurance, and compliance with local regulations. Workers must complete Stripe Connect onboarding to receive payments.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">9. Prohibited Conduct</h2>
              <p>
                You may not use the Service for any unlawful purpose, provide false information, attempt to circumvent payment, or harass other users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">10. Limitation of Liability</h2>
              <p>
                lintel shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including property damage caused by Workers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">11. Contact</h2>
              <p>
                For questions, email{' '}
                <a href="mailto:support@lintel.com" className="text-accent hover:underline">
                  support@lintel.com
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
