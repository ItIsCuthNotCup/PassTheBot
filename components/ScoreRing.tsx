"use client";

interface ScoreRingProps {
  score: number;
  size?: number;
}

function scoreColor(score: number): string {
  if (score >= 75) return "#22c55e"; // green
  if (score >= 50) return "#f59e0b"; // amber
  return "#ef4444"; // red
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 45) return "Needs Work";
  return "Poor";
}

export default function ScoreRing({ score, size = 160 }: ScoreRingProps) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#1e3a8a"
            strokeWidth="12"
          />
          {/* Progress */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1.2s ease-out",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{score}</span>
          <span className="text-xs text-navy-300 mt-0.5">out of 100</span>
        </div>
      </div>
      <span
        className="text-sm font-semibold"
        style={{ color }}
      >
        {scoreLabel(score)}
      </span>
    </div>
  );
}
