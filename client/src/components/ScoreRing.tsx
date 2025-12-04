import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  duration?: number;
}

export function ScoreRing({ 
  score, 
  maxScore = 100, 
  size = 200, 
  strokeWidth = 12,
  duration = 0.7 
}: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = (score / maxScore) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#8b5cf6";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };
  
  const getVerdict = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Strong";
    if (score >= 40) return "Good foundation";
    return "Needs work";
  };

  useEffect(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(score * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [score, duration]);

  const scoreColor = getScoreColor(score);
  const verdict = getVerdict(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 8px ${scoreColor}50)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className="text-5xl font-bold"
          style={{ color: scoreColor }}
          data-testid="text-score-value"
        >
          {displayScore}
        </span>
        <span className="text-white/50 text-sm">/100</span>
        <span 
          className="mt-1 text-sm font-medium px-3 py-1 rounded-full"
          style={{ 
            backgroundColor: `${scoreColor}20`,
            color: scoreColor 
          }}
          data-testid="text-verdict"
        >
          {verdict}
        </span>
      </div>
    </div>
  );
}
