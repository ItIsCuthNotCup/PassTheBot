"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ScoreRing from "@/components/ScoreRing";
import CategoryCard from "@/components/CategoryCard";
import type { ScanResult } from "@/lib/store";

const CATEGORY_META: Record<
  keyof ScanResult["categories"],
  { title: string; icon: string }
> = {
  keywordMatch:   { title: "Keyword Match",           icon: "🔑" },
  formatting:     { title: "ATS Formatting",           icon: "📐" },
  achievements:   { title: "Measurable Achievements", icon: "📊" },
  skillsSection:  { title: "Skills Section",           icon: "🛠️" },
  structure:      { title: "Section Structure",        icon: "🏗️" },
  actionVerbs:    { title: "Action Verb Strength",     icon: "⚡" },
};

interface Props {
  scan: ScanResult;
  scanId: string;
  justPaid: boolean;
}

function isSafeRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Allow Stripe-hosted checkout pages
    if (parsed.protocol === "https:" && parsed.hostname.endsWith(".stripe.com")) return true;
    // Allow same-origin redirects (e.g. already-paid flow)
    if (typeof window !== "undefined" && parsed.origin === window.location.origin) return true;
    return false;
  } catch {
    return false;
  }
}

export default function ResultsDashboard({ scan, scanId, justPaid }: Props) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [currentScan, setCurrentScan] = useState<ScanResult>(scan);

  // If just paid, refresh data from API to get unlocked suggestions
  if (justPaid && !currentScan.paid) {
    fetch(`/api/results/${scanId}`)
      .then((r) => r.json())
      .then((data: ScanResult) => setCurrentScan(data))
      .catch(() => {/* silent */});
  }

  async function handleCheckout(plan: "one-time" | "monthly") {
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId, plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to start checkout.");
      // Validate the redirect URL is safe before navigating
      if (!isSafeRedirectUrl(data.url)) {
        throw new Error("Invalid redirect URL received from server.");
      }
      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Something went wrong.");
      setCheckoutLoading(false);
    }
  }

  const categories = currentScan.categories;
  const categoryKeys = Object.keys(CATEGORY_META) as Array<keyof typeof CATEGORY_META>;

  const avgCategoryScore = Math.round(
    categoryKeys.reduce((sum, k) => sum + categories[k].score, 0) / categoryKeys.length
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="text-navy-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1 mb-6"
          >
            ← Scan another resume
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">ATS Analysis Results</h1>
              <p className="text-navy-400 text-sm mt-1">
                Target role:{" "}
                <span className="text-accent-400 font-medium">{currentScan.jobTitle}</span>
              </p>
            </div>
            {currentScan.paid && (
              <span className="inline-flex items-center gap-1.5 bg-accent-900/40 border border-accent-700/60 text-accent-400 text-xs font-medium px-3 py-1.5 rounded-full">
                ✓ Full report unlocked
              </span>
            )}
          </div>
        </div>

        {/* Score overview */}
        <div className="bg-navy-900/60 border border-navy-700 rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center gap-8">
          <ScoreRing score={currentScan.overallScore} size={160} />
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-white font-bold text-xl">Overall ATS Score</h2>
              <p className="text-navy-400 text-sm mt-1">
                {currentScan.overallScore >= 75
                  ? "Your resume is well-optimised for ATS systems. Review the category suggestions for final polish."
                  : currentScan.overallScore >= 50
                  ? "Your resume passes basic ATS checks but has significant room for improvement."
                  : "Your resume has critical ATS issues that are likely causing automatic rejections."}
              </p>
            </div>
            {/* Mini category bar chart */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {categoryKeys.map((key) => {
                const { title } = CATEGORY_META[key];
                const score = categories[key].score;
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-navy-400 text-xs w-28 truncate">{title}</span>
                    <div className="flex-1 bg-navy-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          score >= 75
                            ? "bg-accent-500"
                            : score >= 50
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className="text-xs text-navy-300 w-6 text-right">{score}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Paywall banner (if not paid) */}
        {!currentScan.paid && (
          <div className="bg-gradient-to-r from-accent-900/40 to-navy-800/60 border border-accent-700/50 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">
                Unlock your full report
              </h3>
              <p className="text-navy-300 text-sm mt-1">
                You&apos;re seeing 1 of 6 categories. Unlock detailed suggestions for all
                categories including formatting issues, missing keywords, and action
                verb improvements.
              </p>
              {checkoutError && (
                <p className="text-red-400 text-xs mt-2">{checkoutError}</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => handleCheckout("one-time")}
                disabled={checkoutLoading}
                className="bg-accent-500 hover:bg-accent-400 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
              >
                {checkoutLoading ? "Loading..." : "Unlock — $7 one-time"}
              </button>
              <button
                onClick={() => handleCheckout("monthly")}
                disabled={checkoutLoading}
                className="bg-navy-700 hover:bg-navy-600 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
              >
                $19/mo unlimited
              </button>
            </div>
          </div>
        )}

        {/* Category breakdown */}
        <div className="grid sm:grid-cols-2 gap-4">
          {categoryKeys.map((key, idx) => {
            const { title, icon } = CATEGORY_META[key];
            const category = categories[key];
            const isLocked = !currentScan.paid && idx > 0;

            return (
              <CategoryCard
                key={key}
                title={title}
                icon={icon}
                score={category.score}
                suggestions={category.suggestions}
                locked={isLocked}
                onUnlock={() => handleCheckout("one-time")}
              />
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-10 bg-navy-900/40 border border-navy-700 rounded-xl p-4 text-center">
          <p className="text-navy-500 text-xs leading-relaxed">
            <strong className="text-navy-400">Disclaimer:</strong> PassTheBot provides
            AI-generated suggestions for informational purposes only. Results are not
            guaranteed and should not be taken as professional career advice. ATS behaviour
            varies by system and employer configuration.
          </p>
        </div>

        {/* New scan CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block bg-navy-700 hover:bg-navy-600 text-white font-medium px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Scan a different resume
          </Link>
        </div>
      </main>
    </div>
  );
}
