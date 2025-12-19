"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ScoreGaugeProps {
  score: "Good" | "Standard" | "Poor"
  probability: number
}

const scoreConfig = {
  Good: {
    color: "#22c55e",
    gradient: "from-emerald-400 to-green-500",
    bgGradient: "from-emerald-50 to-green-50",
    label: "Excellent",
  },
  Standard: {
    color: "#8b5cf6",
    gradient: "from-violet-400 to-purple-500",
    bgGradient: "from-violet-50 to-purple-50",
    label: "Average",
  },
  Poor: {
    color: "#ef4444",
    gradient: "from-rose-400 to-red-500",
    bgGradient: "from-rose-50 to-red-50",
    label: "Needs Work",
  },
}

export function ScoreGauge({ score, probability }: ScoreGaugeProps) {
  const [mounted, setMounted] = useState(false)
  const config = scoreConfig[score]

  // Circle properties
  const size = 200
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = probability * 100
  const strokeDashoffset = circumference - (progress / 100) * circumference

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative flex items-center justify-center">
      {/* Background glow */}
      <div
        className={cn("absolute w-48 h-48 rounded-full blur-3xl opacity-30", `bg-gradient-to-br ${config.bgGradient}`)}
      />

      {/* SVG Gauge */}
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
          className="opacity-50"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={config.color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? strokeDashoffset : circumference}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${config.color}40)`,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color: config.color }}>
          {(probability * 100).toFixed(0)}%
        </span>
        <span className="text-lg font-semibold text-foreground mt-1">{score}</span>
        <span className="text-xs text-muted-foreground">{config.label}</span>
      </div>
    </div>
  )
}
