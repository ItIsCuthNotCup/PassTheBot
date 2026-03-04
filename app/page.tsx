import Navbar from "@/components/Navbar";
import UploadWidget from "@/components/UploadWidget";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const STEPS = [
  {
    num: "01",
    title: "Upload your resume",
    desc: "Drop your PDF or paste your resume text. We parse it instantly — no account needed.",
  },
  {
    num: "02",
    title: "Tell us your target role",
    desc: "Enter the job title you're applying for so we can tailor the analysis to that role.",
  },
  {
    num: "03",
    title: "Get your ATS score",
    desc: "Receive a detailed breakdown with actionable fixes you can apply today.",
  },
];

const FAQS = [
  {
    q: "What is an ATS and why does it matter?",
    a: "Applicant Tracking Systems are software used by 99% of Fortune 500 companies to automatically filter resumes before a human ever reads them. A poorly optimised resume can be auto-rejected in seconds.",
  },
  {
    q: "Do you store my resume?",
    a: "No. Your resume text is processed in memory and immediately discarded. We only store the anonymised JSON analysis result tied to a random UUID. See our Privacy page for full details.",
  },
  {
    q: "How is this different from other resume checkers?",
    a: "PassTheBot is built specifically for software engineers. The scoring model understands tech roles, frameworks, and the keywords that matter for engineering JDs — not generic corporate resume advice.",
  },
  {
    q: "What do I get for free vs paid?",
    a: "The free scan shows your overall score and the full breakdown for one category (Keyword Match). Unlock the full report with all 6 categories and detailed suggestions for a one-time $7 payment.",
  },
  {
    q: "Which ATS systems does this optimise for?",
    a: "The analysis targets the most common ATS platforms used by tech companies: Greenhouse, Lever, and Workday. The suggestions apply broadly across all major systems.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — copy */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent-900/30 border border-accent-700/50 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-accent-400 text-xs font-medium">
                Built for software engineers
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              See exactly why ATS systems{" "}
              <span className="text-accent-400">reject your tech resume</span>
              {" "}— and fix it in minutes.
            </h1>
            <p className="text-navy-300 text-lg leading-relaxed">
              Most engineering resumes are auto-rejected before a human ever reads
              them. PassTheBot scores your resume across 6 ATS-critical dimensions
              and gives you specific, actionable fixes — not vague advice.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-navy-400">
              <span className="flex items-center gap-1.5">
                <span className="text-accent-400">✓</span> No account required
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-accent-400">✓</span> Resume never stored
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-accent-400">✓</span> Results in &lt;30 seconds
              </span>
            </div>
          </div>

          {/* Right — upload card */}
          <div className="bg-navy-900/70 border border-navy-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-white font-bold text-lg mb-6">
              Scan your resume free
            </h2>
            <UploadWidget />
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-navy-800 bg-navy-900/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { val: "99%", label: "Fortune 500s use ATS" },
            { val: "75%", label: "Resumes auto-rejected" },
            { val: "6", label: "Scoring dimensions" },
            { val: "$0", label: "To get your score" },
          ].map(({ val, label }) => (
            <div key={label}>
              <div className="text-2xl font-extrabold text-accent-400">{val}</div>
              <div className="text-navy-400 text-xs mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          How it works
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {STEPS.map(({ num, title, desc }) => (
            <div
              key={num}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-accent-900/40 border border-accent-700/60 flex items-center justify-center">
                <span className="text-accent-400 font-bold text-lg">{num}</span>
              </div>
              <h3 className="text-white font-semibold">{title}</h3>
              <p className="text-navy-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What we score */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          6 dimensions that matter to ATS
        </h2>
        <p className="text-navy-400 text-center mb-12 max-w-xl mx-auto text-sm">
          Generic resume checkers miss what matters for engineering roles. We score
          the six dimensions that tech ATS systems actually evaluate.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: "🔑", title: "Keyword Match", desc: "Does your resume contain the frameworks, languages, and tools the role demands?" },
            { icon: "📐", title: "ATS Formatting", desc: "Tables, columns, and graphics cause ATS parse failures. We check for all of them." },
            { icon: "📊", title: "Measurable Achievements", desc: "Quantified impact (numbers, %, $) gets significantly more attention from screeners." },
            { icon: "🛠️", title: "Skills Section", desc: "A well-organised, complete skills section is the first thing ATS parsers extract." },
            { icon: "🏗️", title: "Section Structure", desc: "Summary, Experience, Skills, Education — in the right order, every time." },
            { icon: "⚡", title: "Action Verb Strength", desc: "Led vs. Helped. Built vs. Worked on. Word choice signals seniority to both ATS and humans." },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-navy-800/50 border border-navy-700 rounded-xl p-5"
            >
              <div className="text-2xl mb-3">{icon}</div>
              <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
              <p className="text-navy-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof placeholder */}
      <section className="border-t border-navy-800 bg-navy-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-white text-center mb-10">
            What engineers are saying
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                quote: "Went from 0 callbacks to 3 interviews in two weeks after fixing the ATS formatting issues PassTheBot caught.",
                name: "Jordan K.",
                role: "Senior Frontend Engineer",
              },
              {
                quote: "I was using tables and a two-column layout. No wonder I was getting ignored. Fixed it in an afternoon.",
                name: "Priya M.",
                role: "Full Stack Developer",
              },
              {
                quote: "The keyword gap analysis was incredibly specific. It pointed to exact terms missing from my skills section.",
                name: "Marcus T.",
                role: "DevOps / Platform Engineer",
              },
            ].map(({ quote, name, role }) => (
              <div
                key={name}
                className="bg-navy-800/40 border border-navy-700 rounded-xl p-5"
              >
                <p className="text-navy-300 text-sm italic leading-relaxed mb-4">
                  &ldquo;{quote}&rdquo;
                </p>
                <div>
                  <div className="text-white font-medium text-sm">{name}</div>
                  <div className="text-navy-500 text-xs">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-10">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {FAQS.map(({ q, a }) => (
            <div
              key={q}
              className="bg-navy-800/40 border border-navy-700 rounded-xl p-5"
            >
              <h3 className="text-white font-semibold text-sm mb-2">{q}</h3>
              <p className="text-navy-400 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 text-center">
        <div className="bg-gradient-to-r from-navy-800 to-navy-700 border border-navy-600 rounded-2xl p-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to beat the bots?
          </h2>
          <p className="text-navy-300 mb-8 max-w-md mx-auto">
            Free scan. No account. Your resume is never stored.
          </p>
          <ScrollToTopButton />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-800 py-8 text-center text-navy-600 text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} PassTheBot.com — All rights reserved.</span>
          <div className="flex gap-6">
            <a href="/pricing" className="hover:text-navy-400 transition-colors">Pricing</a>
            <a href="/privacy" className="hover:text-navy-400 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
