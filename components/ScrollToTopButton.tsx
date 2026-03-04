"use client";

export default function ScrollToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-block bg-accent-500 hover:bg-accent-400 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
    >
      Scan My Resume Now
    </button>
  );
}
