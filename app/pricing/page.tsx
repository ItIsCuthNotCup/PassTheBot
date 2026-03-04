import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Simple, honest pricing
          </h1>
          <p className="text-navy-400 text-lg max-w-xl mx-auto">
            Start free. Upgrade only when you want the full breakdown.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 items-start">
          {/* Free */}
          <div className="bg-navy-800/50 border border-navy-700 rounded-2xl p-6 flex flex-col gap-5">
            <div>
              <div className="text-navy-400 text-sm font-medium mb-1">Free</div>
              <div className="text-4xl font-extrabold text-white">$0</div>
              <div className="text-navy-500 text-sm mt-1">forever</div>
            </div>
            <ul className="space-y-3 text-sm text-navy-300 flex-1">
              {[
                "Overall ATS score (0–100)",
                "1 category breakdown (Keyword Match)",
                "PDF upload or paste text",
                "Results in under 30 seconds",
                "No account required",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-accent-500 mt-0.5">✓</span> {f}
                </li>
              ))}
              <li className="flex items-start gap-2 text-navy-600">
                <span className="mt-0.5">✗</span> 5 remaining categories
              </li>
              <li className="flex items-start gap-2 text-navy-600">
                <span className="mt-0.5">✗</span> Full suggestions per category
              </li>
            </ul>
            <Link
              href="/"
              className="w-full text-center bg-navy-700 hover:bg-navy-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Scan for free
            </Link>
          </div>

          {/* One-time — highlighted */}
          <div className="bg-gradient-to-b from-accent-900/30 to-navy-800/60 border-2 border-accent-500 rounded-2xl p-6 flex flex-col gap-5 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </span>
            </div>
            <div>
              <div className="text-accent-400 text-sm font-medium mb-1">Full Report</div>
              <div className="text-4xl font-extrabold text-white">$7</div>
              <div className="text-navy-400 text-sm mt-1">one-time · per scan</div>
            </div>
            <ul className="space-y-3 text-sm text-navy-300 flex-1">
              {[
                "Everything in Free",
                "All 6 category breakdowns",
                "3–5 specific suggestions per category",
                "AI references your actual resume content",
                "Immediate, permanent access",
                "No subscription",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-accent-400 mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className="w-full text-center bg-accent-500 hover:bg-accent-400 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Get full report — $7
            </Link>
          </div>

          {/* Monthly */}
          <div className="bg-navy-800/50 border border-navy-700 rounded-2xl p-6 flex flex-col gap-5">
            <div>
              <div className="text-navy-400 text-sm font-medium mb-1">Unlimited</div>
              <div className="text-4xl font-extrabold text-white">$19</div>
              <div className="text-navy-500 text-sm mt-1">per month</div>
            </div>
            <ul className="space-y-3 text-sm text-navy-300 flex-1">
              {[
                "Everything in Full Report",
                "Unlimited scans per month",
                "Perfect for active job searchers",
                "Test multiple resume versions",
                "Cancel anytime",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-accent-500 mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link
              href="/"
              className="w-full text-center bg-navy-700 hover:bg-navy-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Start unlimited — $19/mo
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Pricing FAQs
          </h2>
          {[
            {
              q: "What payment methods are accepted?",
              a: "We use Stripe for secure payment processing. All major credit and debit cards are accepted.",
            },
            {
              q: "Is the $7 payment per scan or per account?",
              a: "It's per scan. Each analysis generates a unique report link. If you want to scan multiple resumes, consider the $19/mo unlimited plan.",
            },
            {
              q: "Can I get a refund?",
              a: "If the analysis fails or produces clearly broken results, contact us and we'll make it right. Because the analysis runs immediately on payment, we generally don't offer refunds for completed scans.",
            },
            {
              q: "How do I cancel my monthly subscription?",
              a: "You can cancel anytime from your email receipt or by contacting us. Cancellation takes effect at the end of the billing period.",
            },
          ].map(({ q, a }) => (
            <div
              key={q}
              className="bg-navy-800/40 border border-navy-700 rounded-xl p-5"
            >
              <h3 className="text-white font-semibold text-sm mb-2">{q}</h3>
              <p className="text-navy-400 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
