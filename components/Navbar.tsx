"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-navy-700 bg-navy-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-accent-400 font-bold text-xl tracking-tight">
            PassTheBot
          </span>
          <span className="hidden sm:inline text-navy-400 text-sm">.com</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/pricing"
            className="text-navy-300 hover:text-white text-sm transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/privacy"
            className="text-navy-300 hover:text-white text-sm transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/"
            className="bg-accent-500 hover:bg-accent-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Scan Resume
          </Link>
        </div>
      </div>
    </nav>
  );
}
