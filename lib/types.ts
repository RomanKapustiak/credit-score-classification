export type CreditMixType = "Standard" | "Good" | "Bad" | "_"
export type PaymentMinType = "NM" | "Yes" | "No"

export interface CreditScoreRequest {
  Annual_Income: number
  Monthly_Inhand_Salary: number
  Total_EMI_per_month: number
  Interest_Rate: number
  Num_Bank_Accounts: number
  Num_Credit_Card: number
  Num_Credit_Inquiries: number
  Delay_from_due_date: number
  Changed_Credit_Limit: number
  Outstanding_Debt: number
  Credit_History_Age: string
  Credit_Mix: CreditMixType
  Payment_of_Min_Amount: PaymentMinType
}

export interface CreditScoreResponse {
  success: boolean
  prediction: "Good" | "Standard" | "Poor"
  classIndex: 0 | 1 | 2
  details: {
    risk_threshold_used: number
    probabilities: {
      Good: number
      Poor: number
      Standard: number
    }
  }
  error?: string
}
