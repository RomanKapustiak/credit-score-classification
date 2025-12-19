"use client"

import { Sparkles } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl blur-lg opacity-50 animate-pulse-ring" />
              <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              CreditScore AI
            </h1>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">Model Ready</span>
          </div>
        </div>
      </div>
    </header>
  )
}
