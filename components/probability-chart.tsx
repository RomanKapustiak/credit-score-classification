"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { CreditScoreResponse } from "@/lib/types"
import { AlertTriangle, CheckCircle2, Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProbabilityChartProps {
  result: CreditScoreResponse
}

const POOR_THRESHOLD = 0.38059428

export function ProbabilityChart({ result }: ProbabilityChartProps) {
  const { probabilities } = result.details
  const isAboveThreshold = probabilities.Poor >= POOR_THRESHOLD
  const poorPercentage = probabilities.Poor * 100
  const thresholdPercentage = POOR_THRESHOLD * 100

  return (
    <Card className="border-0 border-t-4 border-rose-500 shadow-premium-lg bg-white/80 glass-subtle overflow-hidden animate-fade-up">

      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-100 to-orange-100">
              <Target className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Risk Threshold Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Poor classification threshold: {thresholdPercentage.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Threshold Visualization */}
          <div className="relative pt-8 pb-4">
            {/* Scale markers */}
            <div className="absolute top-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>

            {/* Progress bar container */}
            <div className="relative h-8 bg-gradient-to-r from-emerald-100 via-amber-100 to-rose-100 rounded-full overflow-visible">
              {/* Grid lines */}
              <div className="absolute inset-0 flex">
                {[25, 50, 75].map((pos) => (
                  <div key={pos} className="absolute top-0 bottom-0 w-px bg-white/60" style={{ left: `${pos}%` }} />
                ))}
              </div>

              {/* Progress fill */}
              <div
                className={cn(
                  "absolute top-0 bottom-0 left-0 rounded-full transition-all duration-1000 ease-out",
                  isAboveThreshold
                    ? "bg-gradient-to-r from-rose-400 to-rose-500"
                    : "bg-gradient-to-r from-emerald-400 to-emerald-500",
                )}
                style={{
                  width: `${Math.min(poorPercentage, 100)}%`,
                  boxShadow: isAboveThreshold ? "0 0 20px rgba(244, 63, 94, 0.4)" : "0 0 20px rgba(34, 197, 94, 0.4)",
                }}
              />

              {/* Threshold marker */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-foreground/80 rounded-full z-10"
                style={{ left: `${thresholdPercentage}%`, transform: "translateX(-50%)" }}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold bg-foreground text-background rounded-md">
                    Threshold
                  </span>
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-foreground">
                  {thresholdPercentage.toFixed(1)}%
                </div>
              </div>

              {/* Current value marker */}
              <div
                className="absolute -bottom-10 transition-all duration-1000 ease-out"
                style={{ left: `${Math.min(poorPercentage, 100)}%`, transform: "translateX(-50%)" }}
              >
                <div
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg",
                    isAboveThreshold ? "bg-rose-500 text-white" : "bg-emerald-500 text-white",
                  )}
                >
                  {poorPercentage.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div
            className={cn(
              "flex items-center gap-3 p-4 rounded-2xl mt-8",
              isAboveThreshold ? "bg-rose-50 border border-rose-200" : "bg-emerald-50 border border-emerald-200",
            )}
          >
            {isAboveThreshold ? (
              <>
                <div className="p-2 rounded-full bg-rose-100">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <p className="font-semibold text-rose-700">High Risk Classification</p>
                  <p className="text-sm text-rose-600">
                    Poor probability ({poorPercentage.toFixed(1)}%) exceeds threshold ({thresholdPercentage.toFixed(1)}
                    %)
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 rounded-full bg-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-700">Acceptable Risk Level</p>
                  <p className="text-sm text-emerald-600">
                    Poor probability ({poorPercentage.toFixed(1)}%) is below threshold ({thresholdPercentage.toFixed(1)}
                    %)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
