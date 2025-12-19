import ort from "onnxruntime-node"
import path from "path"

// Configuration constants from Python script
const SELECTED_FEATURES = [
  "Credit_Mix_Good",
  "Credit_Mix_Standard",
  "Payment_of_Min_Amount_No",
  "Payment_of_Min_Amount_Yes",
  "Num_Bank_Accounts_Bin",
  "Num_Credit_Card_Bin",
  "Monthly_Inhand_Salary",
  "Delay_from_due_date",
  "Changed_Credit_Limit",
  "Outstanding_Debt",
  "Credit_History_Age",
  "Annual_Income_log",
  "Interest_Rate_log",
  "Num_Credit_Inquiries_log",
  "Total_EMI_per_month_log",
]

export const POOR_THRESHOLD = 0.38059428;
const POOR_CLASS_INDEX = 1;

const CLASS_MAPPING: Record<number, string> = {
  0: "Good",
  1: "Poor",
  2: "Standard",
}

export interface RawInputData {
    Monthly_Inhand_Salary: number;
    Num_Bank_Accounts: number;
    Num_Credit_Card: number;
    Interest_Rate: number;
    Delay_from_due_date: number;
    Changed_Credit_Limit: number;
    Num_Credit_Inquiries: number;
    Credit_Mix: string;
    Outstanding_Debt: number;
    Credit_History_Age: string;
    Payment_of_Min_Amount: string;
    Total_EMI_per_month: number;
    Annual_Income: number;
    [key: string]: any;
}

// --- 2. Preprocessing Logic ---

class DataPreprocessor {
    static parseCreditHistoryAge(value: string | number | null): number {
        if (!value) return 0.0;
        if (typeof value === 'number') return value;

        const strVal = String(value);
        let years = 0;
        let months = 0;

        const yearsMatch = strVal.match(/(\d+)\s*Year/i);
        const monthsMatch = strVal.match(/(\d+)\s*Month/i);

        if (yearsMatch) years = parseInt(yearsMatch[1], 10);
        if (monthsMatch) months = parseInt(monthsMatch[1], 10);

        return (years * 12) + months;
    }

    static applyBinning(value: any, maxBin = 10): number {
        const val = parseFloat(value);
        if (isNaN(val) || val <= 0) return 0.0;
        if (val > maxBin) return maxBin + 1.0;
        return Math.floor(val);
    }

    static preprocessRow(raw: RawInputData): number[] {
        const processed: Record<string, number> = {};

        processed['Monthly_Inhand_Salary'] = Number(raw.Monthly_Inhand_Salary || 0);
        processed['Delay_from_due_date'] = Number(raw.Delay_from_due_date || 0);
        processed['Changed_Credit_Limit'] = Number(raw.Changed_Credit_Limit || 0);
        processed['Outstanding_Debt'] = Number(raw.Outstanding_Debt || 0);
        processed['Credit_History_Age'] = this.parseCreditHistoryAge(raw.Credit_History_Age);

        const annualIncome = Number(raw.Annual_Income || 0);
        processed['Annual_Income_log'] = annualIncome > 0 ? Math.log(annualIncome) : 0;

        const interestRate = Number(raw.Interest_Rate || 0);
        processed['Interest_Rate_log'] = interestRate > 0 ? Math.log(interestRate) : 0;

        const numInquiries = Number(raw.Num_Credit_Inquiries || 0);
        processed['Num_Credit_Inquiries_log'] = numInquiries > 0 ? Math.log(numInquiries) : 0;

        const totalEmi = Number(raw.Total_EMI_per_month || 0);
        processed['Total_EMI_per_month_log'] = totalEmi > 0 ? Math.log(totalEmi) : 0;

        processed['Num_Bank_Accounts_Bin'] = this.applyBinning(raw.Num_Bank_Accounts);
        processed['Num_Credit_Card_Bin'] = this.applyBinning(raw.Num_Credit_Card);

        const creditMix = String(raw.Credit_Mix || '').trim();
        processed['Credit_Mix_Good'] = creditMix === 'Good' ? 1.0 : 0.0;
        processed['Credit_Mix_Standard'] = creditMix === 'Standard' ? 1.0 : 0.0;

        const pmtMin = String(raw.Payment_of_Min_Amount || '').trim();
        processed['Payment_of_Min_Amount_No'] = pmtMin === 'No' ? 1.0 : 0.0;
        processed['Payment_of_Min_Amount_Yes'] = pmtMin === 'Yes' ? 1.0 : 0.0;

        return SELECTED_FEATURES.map(feature => processed[feature] || 0.0);
    }
}

// --- 3. Math Helper (Softmax) ---

/**
 * Перетворює сирі логіти (які можуть бути від'ємними) у ймовірності.
 * Formula: e^x / sum(e^x)
 */
function softmax(logits: number[]): number[] {
    const maxLogit = Math.max(...logits); // Для стабільності віднімаємо макс
    const exps = logits.map(x => Math.exp(x - maxLogit));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    return exps.map(x => x / sumExps);
}

// --- 4. Inference Logic ---

let session: ort.InferenceSession | null = null;

export async function predictCreditScore(rawInput: RawInputData) {
    try {
        const inputVector = DataPreprocessor.preprocessRow(rawInput);

        if (!session) {
            const modelPath = path.join(process.cwd(), 'public', 'model.onnx');
            session = await ort.InferenceSession.create(modelPath);
        }

        const tensor = new ort.Tensor('float32', Float32Array.from(inputVector), [1, 15]);
        const feeds = { float_input: tensor };

        const results = await session.run(feeds);

        // 1. Отримуємо сирі вихідні дані (Logits)
        // Залежно від версії конвертера, дані можуть бути в output_label або probabilities
        // Зазвичай, другий вихід містить масив значень
        const outputKey = session.outputNames[1] || session.outputNames[0];
        const outputTensor = results[outputKey];

        // Сирі логіти (наприклад: [-0.8, 0.6, 0.5])
        const rawLogits = Array.from(outputTensor.data as Float32Array);

        // 2. ЗАСТОСОВУЄМО SOFTMAX (Перетворюємо в ймовірності)
        const probabilities = softmax(rawLogits);

        // 3. Risk-First Logic
        const probPoor = probabilities[POOR_CLASS_INDEX]; // Index 1

        let finalClass = -1;

        // A. Risk Check
        if (probPoor >= POOR_THRESHOLD) {
            finalClass = POOR_CLASS_INDEX;
        } else {
            // B. Standard Logic
            const tempProbs = [...probabilities];
            tempProbs[POOR_CLASS_INDEX] = -1;

            let maxVal = -2;
            let maxIdx = -1;
            for (let i = 0; i < tempProbs.length; i++) {
                if (tempProbs[i] > maxVal) {
                    maxVal = tempProbs[i];
                    maxIdx = i;
                }
            }
            finalClass = maxIdx;
        }

        return {
            class: finalClass,
            label: CLASS_MAPPING[finalClass],
            probabilities: probabilities
        };

    } catch (e) {
        console.error("Prediction error:", e);
        throw e;
    }
}
