"use client"

import { useState } from "react"
import { CreditScoreForm } from "@/components/credit-score-form"
import { ResultDisplay } from "@/components/result-display"
import { ProbabilityChart } from "@/components/probability-chart"
import { Header } from "@/components/header"
import type { CreditScoreResponse } from "@/lib/types"
import { Sparkles, ArrowRight, Shield, Zap, BarChart3 } from "lucide-react"

export default function Home() {
  const [result, setResult] = useState<CreditScoreResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" />
        <div
          className="absolute top-1/4 -right-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Analysis
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance leading-tight">
            Predict Your{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Credit Score
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Get instant insights into your financial standing with our advanced machine learning model.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { icon: Shield, label: "Bank-Grade Security" },
              { icon: Zap, label: "Instant Results" },
              { icon: BarChart3, label: "Detailed Analytics" },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 glass-subtle border border-border/50 text-sm text-muted-foreground"
              >
                <feature.icon className="w-4 h-4" />
                {feature.label}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Form */}
          <div className="space-y-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <CreditScoreForm onResult={setResult} isLoading={isLoading} setIsLoading={setIsLoading} />
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {result ? (
              <>
                <ResultDisplay result={result} />
                <ProbabilityChart result={result} />
              </>
            ) : (
              <div
                className="h-full min-h-[400px] flex items-center justify-center animate-fade-up"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="text-center p-12 rounded-3xl border-2 border-dashed border-border/50 bg-white/30 glass-subtle max-w-md">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
                    <BarChart3 className="w-10 h-10 text-violet-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Analyze</h3>
                  <p className="text-muted-foreground mb-6">
                    Fill in your financial details and click predict to see your credit score analysis.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-violet-600 font-medium">
                    <span>Enter your data</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 mt-20 bg-white/30 glass-subtle">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">CreditScore AI • Powered by XGBoost</p>
        </div>
      </footer>
    </div>
  )
}
