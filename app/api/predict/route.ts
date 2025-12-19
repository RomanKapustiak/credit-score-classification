import { NextResponse } from "next/server"
import { predictCreditScore, type RawInputData, POOR_THRESHOLD } from "@/lib/creditScoreService"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const rawData: RawInputData = body

    if (!rawData) {
      return NextResponse.json({ success: false, error: "No data provided" }, { status: 400 })
    }

    const result = await predictCreditScore(rawData)

    return NextResponse.json({
      success: true,
      prediction: result.label,
      classIndex: result.class,
      details: {
        risk_threshold_used: POOR_THRESHOLD,
        probabilities: {
          Good: result.probabilities[0],
          Poor: result.probabilities[1],
          Standard: result.probabilities[2],
        },
      },
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}