"use client";

interface CategoryCardProps {
  title: string;
  icon: string;
  score: number;
  suggestions: string[];
  locked?: boolean;
  onUnlock?: () => void;
}

function barColor(score: number): string {
  if (score >= 75) return "bg-accent-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

function scoreText(score: number): string {
  if (score >= 75) return "text-accent-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

export default function CategoryCard({
  title,
  icon,
  score,
  suggestions,
  locked = false,
  onUnlock,
}: CategoryCardProps) {
  return (
    <div className="bg-navy-800/60 border border-navy-700 rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="font-semibold text-white text-sm">{title}</h3>
        </div>
        <span className={`font-bold text-lg ${scoreText(score)}`}>{score}</span>
      </div>

      {/* Score bar */}
      <div className="w-full bg-navy-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${barColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Suggestions */}
      {locked ? (
        <div className="relative">
          <ul className="space-y-2 blur-gated select-none">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-accent-400 mt-0.5 shrink-0">→</span>
                <span className="text-navy-300 text-sm">
                  {"This is a placeholder suggestion that is blurred until unlocked with payment."}
                </span>
              </li>
            ))}
          </ul>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-navy-900/80 rounded-lg">
            <span className="text-sm text-navy-300 text-center">
              Unlock all suggestions
            </span>
            <button
              onClick={onUnlock}
              className="bg-accent-500 hover:bg-accent-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Unlock Full Report — $7
            </button>
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-accent-400 mt-0.5 shrink-0 text-sm">→</span>
                <span className="text-navy-300 text-sm leading-relaxed">{s}</span>
              </li>
            ))
          ) : (
            <li className="text-navy-500 text-sm italic">No suggestions — great work!</li>
          )}
        </ul>
      )}
    </div>
  );
}
