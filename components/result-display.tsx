"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { CreditScoreResponse } from "@/lib/types"
import { AlertTriangle, TrendingUp, TrendingDown, Minus, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScoreGauge } from "./score-gauge"

interface ResultDisplayProps {
  result: CreditScoreResponse
}

const scoreConfig = {
  Good: {
    icon: CheckCircle,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500",
    topBorderColor: "border-emerald-500",
    lightBg: "bg-emerald-50",
    border: "border-emerald-200",
    description: "Excellent credit standing",
    advice: "You qualify for the best rates and premium offers.",
    trend: TrendingUp,
  },
  Standard: {
    icon: Minus,
    color: "text-violet-600",
    bgColor: "bg-violet-500",
    topBorderColor: "border-violet-500",
    lightBg: "bg-violet-50",
    border: "border-violet-200",
    description: "Average credit standing",
    advice: "Room for improvement with better payment habits.",
    trend: Minus,
  },
  Poor: {
    icon: XCircle,
    color: "text-rose-600",
    bgColor: "bg-rose-500",
    topBorderColor: "border-rose-500",
    lightBg: "bg-rose-50",
    border: "border-rose-200",
    description: "Credit needs attention",
    advice: "Consider debt management and timely payments.",
    trend: TrendingDown,
  },
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  if (!result.success) {
    return (
      <Card className="border-rose-200 bg-rose-50/50 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-rose-600">
            <AlertTriangle className="w-6 h-6" />
            <span className="font-medium">Error: {result.error || "Failed to get prediction"}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const config = scoreConfig[result.prediction]
  const Icon = config.icon
  const { probabilities } = result.details


  return (
    <Card className={cn(
      "border-x-0 border-b-0 border-t-4 shadow-premium-lg bg-white/80 glass-subtle overflow-hidden animate-scale-in",
      config.topBorderColor
    )}>
      <CardContent className="p-8">
        <div className="space-y-8">
          {/* Score Gauge */}
          <div className="flex justify-center">
            <ScoreGauge score={result.prediction} probability={probabilities[result.prediction]} />
          </div>

          {/* Description */}
          <div className={cn("p-4 rounded-2xl text-center", config.lightBg, config.border, "border")}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Icon className={cn("w-5 h-5", config.color)} />
              <span className={cn("font-semibold", config.color)}>{config.description}</span>
            </div>
            <p className="text-sm text-muted-foreground">{config.advice}</p>
          </div>

          {/* Probability Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Probability Breakdown
            </h4>

            <div className="space-y-3">
              {[
                { label: "Good", value: probabilities.Good, color: "bg-emerald-500", lightColor: "bg-emerald-100" },
                {
                  label: "Standard",
                  value: probabilities.Standard,
                  color: "bg-violet-500",
                  lightColor: "bg-violet-100",
                },
                { label: "Poor", value: probabilities.Poor, color: "bg-rose-500", lightColor: "bg-rose-100" },
              ].map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground">{(item.value * 100).toFixed(1)}%</span>
                  </div>
                  <div className={cn("h-2.5 rounded-full overflow-hidden", item.lightColor)}>
                    <div
                      className={cn("h-full rounded-full transition-all duration-1000 ease-out", item.color)}
                      style={{ width: `${item.value * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
