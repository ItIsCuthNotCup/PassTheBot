import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-4xl font-extrabold text-white mb-4">Privacy Policy</h1>
        <p className="text-navy-400 text-sm mb-10">Last updated: March 2025</p>

        <div className="space-y-10 text-navy-300 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              The short version
            </h2>
            <div className="bg-accent-900/20 border border-accent-700/40 rounded-xl p-5 text-accent-300 text-sm">
              <strong>We do not store your resume.</strong> Your resume text is
              processed in-memory to generate an analysis and is immediately
              discarded. We never write your resume to disk, a database, or any
              external service.
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              What we collect
            </h2>
            <ul className="space-y-3 text-sm">
              {[
                {
                  item: "Resume text (temporary)",
                  detail:
                    "Your resume text or PDF content is sent to the Claude API (Anthropic) for analysis. It is not persisted on our servers. The Claude API processes it according to Anthropic's privacy policy.",
                },
                {
                  item: "Analysis results (stored)",
                  detail:
                    "We store only the JSON output of the analysis — your scores and suggestions — tied to a randomly generated UUID. No personally identifiable information is in this data.",
                },
                {
                  item: "Job title (stored)",
                  detail:
                    "The job title you enter is stored alongside the analysis result to contextualise the scores in your report.",
                },
                {
                  item: "Payment information (never stored by us)",
                  detail:
                    "Payments are processed entirely by Stripe. We never see or store your card details. Stripe's privacy policy applies to payment data.",
                },
              ].map(({ item, detail }) => (
                <li key={item} className="flex flex-col gap-1">
                  <span className="text-white font-medium">{item}</span>
                  <span className="text-navy-400">{detail}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              What we do NOT collect
            </h2>
            <ul className="space-y-2 text-sm">
              {[
                "Your name, email address, or any contact information",
                "Your full resume text (not persisted anywhere)",
                "Account credentials (no accounts exist)",
                "Cookies beyond what Next.js uses for routing",
                "Analytics or tracking data (no third-party analytics)",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">✗</span> {f}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              Third-party services
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <div className="text-white font-medium mb-1">
                  Anthropic (Claude API)
                </div>
                <p className="text-navy-400">
                  Your resume text is sent to Anthropic&apos;s Claude API for
                  analysis. Anthropic may process this data according to their
                  API data usage policy. We recommend reviewing{" "}
                  <span className="text-accent-400">anthropic.com/privacy</span> for
                  details on how API inputs are handled.
                </p>
              </div>
              <div>
                <div className="text-white font-medium mb-1">Stripe</div>
                <p className="text-navy-400">
                  Payments are processed by Stripe, Inc. When you complete a
                  payment, Stripe collects your card and billing information
                  according to their privacy policy at{" "}
                  <span className="text-accent-400">stripe.com/privacy</span>.
                  We receive only a payment confirmation and your scan ID from
                  Stripe&apos;s webhook.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              Data retention
            </h2>
            <p className="text-sm text-navy-400">
              Analysis results (scores and suggestions) are stored for 30 days
              to allow you to revisit your report. After 30 days, records are
              automatically purged. Resume text is never stored at any point.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              Security
            </h2>
            <p className="text-sm text-navy-400">
              All data is transmitted over HTTPS. Analysis results are stored in
              a local SQLite database accessible only to the server process.
              Each result is identified by a UUID — without that UUID, the data
              cannot be retrieved.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">
              Children&apos;s privacy
            </h2>
            <p className="text-sm text-navy-400">
              PassTheBot is intended for adults seeking employment. We do not
              knowingly collect information from anyone under 16 years of age.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
            <p className="text-sm text-navy-400">
              If you have questions about this privacy policy or want to request
              deletion of your analysis data, please open an issue on our GitHub
              repository or contact us through the website.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block bg-navy-700 hover:bg-navy-600 text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
