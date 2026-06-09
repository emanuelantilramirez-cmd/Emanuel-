export type AssetType = "forex" | "stock" | "etf" | "crypto" | "commodity";

export interface Asset {
  id: string;
  name: string;
  code: string; // e.g. USD, EUR, AAPL, NVDA
  type: AssetType;
  basePrice: number;
  currentPrice: number;
  priceHistory: number[]; // For our sparklines and dynamic charts
  volatility: number; // Factor for simulating price changes
  trend: "up" | "down" | "stable";
}

export interface AIRiskManager {
  stopLossPercent: number;
  takeProfitPercent: number;
  maxDrawdown: number;
  diversificationScore: number; // 0-100
  riskLevel: "Bajo" | "Moderado" | "Alto" | "Turbo Millonario";
}

export interface MicroAgent {
  name: string;
  role: string;
  confidence: number; // percentage 0-100
  vote: "COMPRE" | "VENDA" | "ESPERA";
  contributionRating: number; // score 0-100
}

export interface AIWallet {
  assetId: string;
  assetCode: string;
  assetName: string;
  type: AssetType;
  isActive: boolean;
  status: "locked" | "waiting_loan" | "active";
  investedAmount: number; // Amount currently allocated to trade
  gains: number; // Profit generated in CLP (Pesos Chilenos)
  targetGainsForNextLoan: number; // Starts at 20,000 pesos
  accumulatedLearningMs: number; // Faster AI execution simulated in ms
  learningLevelPercent: number; // AI learning progress (0 to 100%)
  riskConfig: AIRiskManager;
  lastDecision: string; // Log message of last action
  totalTrades: number;
  successfulTrades: number;
  agents: MicroAgent[]; // The 5 team micro-agents taking collective decisions
}

export interface UserBalance {
  realDepositedSim: number; // Simulated "Real money" deposits
  totalValueCLP: number; // Total portfolio value across all active wallets in CLP
  unallocatedCash: number; // Liquid cash available in CLP to deploy
  totalWithdrawnToBankCLP: number; // Total auto-withdrawn money transferred to bank account in CLP
  accumulatedProfitForWithdrawalCLP: number; // Profit tracker to trigger next 100k payment
}

export interface TradingLog {
  id: string;
  timestamp: string; // e.g. "10:42:01"
  type: "trade" | "learning" | "loan" | "sys" | "deposit";
  message: string;
  source: string; // Which AI or asset did it
}
