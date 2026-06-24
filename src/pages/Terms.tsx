import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="py-8 border-b border-uber-gray-100 last:border-0">
      <div className="flex gap-5 items-baseline mb-4">
        <span className="text-xs font-bold text-uber-gray-300 tracking-widest uppercase w-6 flex-shrink-0">{number}</span>
        <h2 className="text-lg font-black text-black">{title}</h2>
      </div>
      <div className="pl-11 space-y-3 text-[15px] text-uber-gray-600 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-uber-gray-50 border-l-4 border-black px-4 py-3 rounded-r-lg text-[14px] text-black font-medium">
      {children}
    </div>
  );
}

export default function Terms() {
  return (
    <div className="min-h-screen bg-white pt-20 pb-24">
      <Helmet>
        <title>Terms of Service | Lintel</title>
        <meta name="description" content="Read Lintel's terms of service. Understand your rights and responsibilities when booking home services on the Lintel platform." />
        <link rel="canonical" href="https://uselintel.pro/terms" />
      </Helmet>

      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <Link to="/" className="text-sm text-uber-gray-400 hover:text-black transition-colors">
            ← Back
          </Link>
          <h1 className="text-4xl font-black text-black mt-6 mb-2">Terms of Service</h1>
          <p className="text-sm text-uber-gray-400">Last updated: June 23, 2026</p>
        </div>

        {/* Intro */}
        <p className="text-[15px] text-uber-gray-600 leading-relaxed mb-2 pb-8 border-b border-uber-gray-100">
          By accessing or using the Lintel platform, you agree to be bound by these Terms of Service. Please read them carefully. If you do not agree, you may not use our service.
        </p>

        <Section number="1" title="Service Description">
          <p>
            Lintel connects customers with independent home service professionals for gutter cleaning, window washing, pressure washing, house cleaning, and lawn care in Montgomery County, MD and surrounding areas.
          </p>
          <p>
            Lintel is a technology platform and marketplace. We do not directly provide home services and are not responsible for the quality, safety, or legality of services performed by professionals.
          </p>
        </Section>

        <Section number="2" title="User Accounts">
          <p>
            You must sign in with a valid Google account to book services. You are responsible for all activity on your account. You must be at least 18 years old to use this service.
          </p>
        </Section>

        <Section number="3" title="Electronic Signatures & Booking Agreement">
          <p>
            When you complete a booking on Lintel, you provide an electronic signature by entering your full name and checking an agreement checkbox. This constitutes a legally binding signature under the{' '}
            <strong className="font-semibold text-black">U.S. Electronic Signatures in Global and National Commerce Act (E-SIGN Act)</strong>{' '}
            and the{' '}
            <strong className="font-semibold text-black">Uniform Electronic Transactions Act (UETA)</strong>.
          </p>
          <Callout>
            Your electronic signature is legally equivalent to a handwritten signature. The agreement text, your identity (verified via Google OAuth), timestamp, and IP address are stored with your booking record.
          </Callout>
          <p>
            If the terms displayed at the time of booking conflict with these Terms of Service, the terms displayed at booking govern for that specific transaction.
          </p>
        </Section>

        <Section number="4" title="Payment Terms">
          <p>
            Payment for services is <strong className="font-semibold text-black">due upon completion</strong>, collected on-site by your assigned professional. We accept cash, check, and Venmo.
          </p>
          <p>
            By completing a booking, you enter into a binding obligation to pay the amount disclosed at checkout. The total price is shown before you sign — there are no hidden fees.
          </p>
          <p>
            Dispute requests must be submitted within 7 days of service completion by contacting{' '}
            <a href="tel:3012727224" className="font-semibold text-black underline underline-offset-2 hover:text-uber-gray-600">
              (301) 272-7224
            </a>.
          </p>
        </Section>

        <Section number="5" title="Cancellation Policy">
          <p>
            You may cancel or reschedule an appointment at no charge if you do so <strong className="font-semibold text-black">more than 24 hours before the scheduled appointment time</strong>.
          </p>
          <Callout>
            Same-day cancellations — made less than 24 hours before a scheduled appointment — are subject to a <strong className="font-semibold text-black">$40 cancellation fee</strong>. This fee compensates the professional for lost income and travel costs.
          </Callout>
          <p>
            By completing a booking with a scheduled appointment, you expressly acknowledge and agree to this cancellation policy. Lintel reserves the right to suspend or permanently terminate platform access for accounts with unpaid cancellation fees.
          </p>
        </Section>

        <Section number="6" title="Recurring Service Commitments">
          <p>
            When you select a recurring service plan, you are entering a <strong className="font-semibold text-black">minimum 12-month service commitment</strong> at the price and interval disclosed at the time of booking. Each visit is billed individually upon completion.
          </p>
          <Callout>
            Recurring plans have a 12-month minimum term. Early cancellation does not relieve you of payment obligations for services already rendered.
          </Callout>
          <p>
            You may cancel a recurring plan after completing the 12-month minimum term by contacting support. Early termination may result in the retroactive loss of any recurring-plan discount applied to prior visits.
          </p>
          <p>
            Lintel reserves the right to adjust pricing for recurring plans with <strong className="font-semibold text-black">30 days' written notice</strong> to the email address on your account.
          </p>
        </Section>

        <Section number="7" title="Promo Codes">
          <p>
            Each registered professional receives a unique promo code. Users who apply a professional's promo code at checkout authorize a portion of the payment to be directed to that professional as a referral benefit. Promo codes cannot be combined with recurring plan discounts.
          </p>
        </Section>

        <Section number="8" title="Disputes">
          <p>
            If you have a dispute regarding a job, contact us immediately at{' '}
            <a href="tel:3012727224" className="font-semibold text-black underline underline-offset-2 hover:text-uber-gray-600">
              (301) 272-7224
            </a>
            . Our support team will review within 24 hours. Do not release payment (confirmation code) if you are not satisfied with the work — releasing payment is final.
          </p>
        </Section>

        <Section number="9" title="Professional Terms">
          <p>
            Professionals are independent contractors, not employees of Lintel. They are responsible for their own taxes, insurance, and compliance with applicable laws. Lintel does not guarantee the quality of any professional's work.
          </p>
        </Section>

        <Section number="10" title="Prohibited Conduct">
          <p>
            You may not use the service for any unlawful purpose, provide false information, attempt to circumvent payment, harass other users, or engage in any conduct that could damage, disable, or impair the platform.
          </p>
        </Section>

        <Section number="11" title="Limitation of Liability">
          <p>
            To the fullest extent permitted by law, Lintel shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service, including property damage caused by professionals.
          </p>
          <p>
            Our total liability to you for any claim arising from these terms or the service shall not exceed the amount you paid for the specific job giving rise to the claim.
          </p>
        </Section>

        <Section number="12" title="Contact">
          <p>
            For questions or support:
          </p>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href="tel:3012727224"
              className="flex flex-col items-center justify-center border border-uber-gray-200 rounded-xl py-4 hover:border-black transition-colors"
            >
              <span className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-1">Phone</span>
              <span className="font-bold text-black text-sm">(301) 272-7224</span>
            </a>
            <a
              href="mailto:support@uselintel.pro"
              className="flex flex-col items-center justify-center border border-uber-gray-200 rounded-xl py-4 hover:border-black transition-colors"
            >
              <span className="text-xs font-bold text-uber-gray-400 uppercase tracking-widest mb-1">Email</span>
              <span className="font-bold text-black text-sm">support@uselintel.pro</span>
            </a>
          </div>
        </Section>

        <p className="text-xs text-center text-uber-gray-300 pt-8">
          © 2026 Lintel. These terms were last updated June 23, 2026.
        </p>
      </div>
    </div>
  );
}
