"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CreditScoreRequest, CreditScoreResponse, CreditMixType, PaymentMinType } from "@/lib/types"
import { Loader2, DollarSign, CreditCard, Clock, Building2, Sparkles } from "lucide-react"

interface CreditScoreFormProps {
  onResult: (result: CreditScoreResponse) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const defaultValues: CreditScoreRequest = {
  Annual_Income: 39628.99,
  Monthly_Inhand_Salary: 3359.41,
  Total_EMI_per_month: 35.1,
  Interest_Rate: 7,
  Num_Bank_Accounts: 4,
  Num_Credit_Card: 6,
  Num_Credit_Inquiries: 3,
  Delay_from_due_date: 23,
  Changed_Credit_Limit: 11.5,
  Outstanding_Debt: 502.38,
  Credit_History_Age: "31 Years and 6 Months",
  Credit_Mix: "Standard",
  Payment_of_Min_Amount: "No",
}

export function CreditScoreForm({ onResult, isLoading, setIsLoading }: CreditScoreFormProps) {
  const [formData, setFormData] = useState<CreditScoreRequest>(defaultValues)

  const handleInputChange = (field: keyof CreditScoreRequest, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result: CreditScoreResponse = await response.json()
      onResult(result)
    } catch (error) {
      console.error("Prediction error:", error)
      onResult({
        success: false,
        prediction: "Poor",
        classIndex: 1,
        details: {
          risk_threshold_used: 0,
          probabilities: { Good: 0, Poor: 0, Standard: 0 },
        },
        error: "Failed to get prediction",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 border-t-4 border-violet-500 shadow-premium-lg bg-white/80 glass-subtle overflow-hidden">

      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Income Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-100">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Income & Salary</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="annual_income" className="text-xs font-medium text-muted-foreground">
                  Annual Income ($)
                </Label>
                <Input
                  id="annual_income"
                  type="number"
                  step="0.01"
                  value={formData.Annual_Income}
                  onChange={(e) => handleInputChange("Annual_Income", Number.parseFloat(e.target.value) || 0)}
                  className="h-11 bg-white/60 border-border/50 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly_salary" className="text-xs font-medium text-muted-foreground">
                  Monthly Inhand Salary ($)
                </Label>
                <Input
                  id="monthly_salary"
                  type="number"
                  step="0.01"
                  value={formData.Monthly_Inhand_Salary}
                  onChange={(e) => handleInputChange("Monthly_Inhand_Salary", Number.parseFloat(e.target.value) || 0)}
                  className="h-11 bg-white/60 border-border/50 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Debt Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-rose-100">
                <CreditCard className="w-4 h-4 text-rose-600" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Debt & Payments</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emi" className="text-xs font-medium text-muted-foreground">
                  Total EMI/Month ($)
                </Label>
                <Input
                  id="emi"
                  type="number"
                  step="0.01"
                  value={formData.Total_EMI_per_month}
                  onChange={(e) => handleInputChange("Total_EMI_per_month", Number.parseFloat(e.target.value) || 0)}
                  className="h-11 bg-white/60 border-border/50 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="debt" className="text-xs font-medium text-muted-foreground">
                  Outstanding Debt ($)
                </Label>
                <Input
                  id="debt"
                  type="number"
                  step="0.01"
                  value={formData.Outstanding_Debt}
                  onChange={(e) => handleInputChange("Outstanding_Debt", Number.parseFloat(e.target.value) || 0)}
                  className="h-11 bg-white/60 border-border/50 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delay" className="text-xs font-medium text-muted-foreground">
                  Delay From Due (days)
                </Label>
                <Input
                  id="delay"
                  type="number"
                  value={formData.Delay_from_due_date}
                  onChange={(e) => handleInputChange("Delay_from_due_date", Number.parseInt(e.target.value) || 0)}
                  className="h-11 bg-white/60 border-border/50 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Credit Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100">
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Credit Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interest" className="text-xs font-medium text-muted-foreground">
                  Interest Rate (%)
                </Label>
                <Input
                  id="interest"
                  type="number"
                  value={formData.Interest_Rate}
                  onChange={(e) => handleInputChange("Interest_Rate", Number.parseInt(e.target.value) || 0)}
                  className="h-11 bg-white/60 border-border/50 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credit_limit" className="text-xs font-medium text-muted-foreground">
                  Changed Credit Limit (%)
                </Label>
                <Input
                  id="credit_limit"
                  type="number"
                  step="0.1"
                  value={formData.Changed_Credit_Limit}
                  onChange={(e) => handleInputChange("Changed_Credit_Limit", Number.parseFloat(e.target.value) || 0)}
                  className="h-11 bg-white/60 border-border/50 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inquiries" className="text-xs font-medium text-muted-foreground">
                  Credit Inquiries
                </Label>
                <Input
                  id="inquiries"
                  type="number"
                  value={formData.Num_Credit_Inquiries}
                  onChange={(e) => handleInputChange("Num_Credit_Inquiries", Number.parseFloat(e.target.value) || 0)}
                  className="h-11 bg-white/60 border-border/50 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Accounts Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bank_accounts" className="text-xs font-medium text-muted-foreground">
                  Number of Bank Accounts
                </Label>
                <Input
                  id="bank_accounts"
                  type="number"
                  value={formData.Num_Bank_Accounts}
                  onChange={(e) => handleInputChange("Num_Bank_Accounts", Number.parseInt(e.target.value) || 0)}
                  className="h-11 bg-white/60 border-border/50 focus:bg-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credit_cards" className="text-xs font-medium text-muted-foreground">
                  Number of Credit Cards
                </Label>
                <Input
                  id="credit_cards"
                  type="number"
                  value={formData.Num_Credit_Card}
                  onChange={(e) => handleInputChange("Num_Credit_Card", Number.parseInt(e.target.value) || 0)}
                  className="h-11 bg-white/60 border-border/50 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* History & Classification */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-violet-100">
                <Clock className="w-4 h-4 text-violet-600" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Credit History</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="history_age" className="text-xs font-medium text-muted-foreground">
                  Credit History Age
                </Label>
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <div className="space-y-1">
                    <Label htmlFor="history_age_years" className="text-[10px] uppercase text-muted-foreground tracking-wider">
                      Years
                    </Label>
                    <Input
                      id="history_age_years"
                      type="number"
                      min="0"
                      value={(() => {
                        const match = formData.Credit_History_Age.match(/(\d+)\s*Years?/i)
                        return match ? parseInt(match[1]) : 0
                      })()}
                      onChange={(e) => {
                        const years = Math.max(0, parseInt(e.target.value) || 0)
                        const monthsMatch = formData.Credit_History_Age.match(/(\d+)\s*Months?/i)
                        const months = monthsMatch ? parseInt(monthsMatch[1]) : 0
                        handleInputChange("Credit_History_Age", `${years} Years and ${months} Months`)
                      }}
                      className="h-11 bg-white/60 border-border/50 focus:bg-white transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="history_age_months" className="text-[10px] uppercase text-muted-foreground tracking-wider">
                      Months
                    </Label>
                    <Input
                      id="history_age_months"
                      type="number"
                      min="0"
                      max="11"
                      value={(() => {
                        const match = formData.Credit_History_Age.match(/(\d+)\s*Months?/i)
                        return match ? parseInt(match[1]) : 0
                      })()}
                      onChange={(e) => {
                        let months = Math.max(0, parseInt(e.target.value) || 0)
                        if (months > 11) months = 11
                        const yearsMatch = formData.Credit_History_Age.match(/(\d+)\s*Years?/i)
                        const years = yearsMatch ? parseInt(yearsMatch[1]) : 0
                        handleInputChange("Credit_History_Age", `${years} Years and ${months} Months`)
                      }}
                      className="h-11 bg-white/60 border-border/50 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="credit_mix" className="text-xs font-medium text-muted-foreground">
                  Credit Mix
                </Label>
                <div className="mt-auto">
                  <Select
                    value={formData.Credit_Mix}
                    onValueChange={(value) => handleInputChange("Credit_Mix", value as CreditMixType)}
                  >
                    <SelectTrigger className="h-11 bg-white/60 border-border/50 focus:bg-white transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Bad">Bad</SelectItem>
                      <SelectItem value="_">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="min_payment" className="text-xs font-medium text-muted-foreground">
                  Payment of Min Amount
                </Label>
                <div className="mt-auto">
                  <Select
                    value={formData.Payment_of_Min_Amount}
                    onValueChange={(value) => handleInputChange("Payment_of_Min_Amount", value as PaymentMinType)}
                  >
                    <SelectTrigger className="h-11 bg-white/60 border-border/50 focus:bg-white transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="NM">Not Mentioned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-14 text-base font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Your Data...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Predict Credit Score
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
