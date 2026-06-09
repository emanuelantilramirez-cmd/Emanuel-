import { Asset, AIWallet, MicroAgent } from "../types";

export const generateDefaultAgents = (): MicroAgent[] => [
  {
    name: "TrendAnalyst",
    role: "Análisis de Impulso y Promedios Móviles",
    confidence: 85,
    vote: "ESPERA",
    contributionRating: 94
  },
  {
    name: "QuantStrategist",
    role: "Modelos Estadísticos y Probabilidad",
    confidence: 78,
    vote: "ESPERA",
    contributionRating: 92
  },
  {
    name: "RiskGuardian",
    role: "Mitigación de Pérdida y Sizing",
    confidence: 95,
    vote: "ESPERA",
    contributionRating: 97
  },
  {
    name: "SigmaVolatility",
    role: "Medición de Desviación y Bandas",
    confidence: 80,
    vote: "ESPERA",
    contributionRating: 88
  },
  {
    name: "ConsensusCore",
    role: "Fusión Neuronal y Decisión Final",
    confidence: 90,
    vote: "ESPERA",
    contributionRating: 96
  }
];

export const INITIAL_MARKET_ASSETS: Asset[] = [
  // Forex (Divisas)
  {
    id: "usd",
    name: "Dólar Estadounidense / Peso",
    code: "USD/CLP",
    type: "forex",
    basePrice: 950,
    currentPrice: 950,
    priceHistory: [945, 947, 946, 948, 951, 950, 949, 952, 950],
    volatility: 0.004,
    trend: "up"
  },
  {
    id: "eur",
    name: "Euro / Peso",
    code: "EUR/CLP",
    type: "forex",
    basePrice: 1020,
    currentPrice: 1020,
    priceHistory: [1015, 1018, 1017, 1021, 1019, 1022, 1020, 1023, 1020],
    volatility: 0.005,
    trend: "up"
  },
  {
    id: "gbp",
    name: "Libra Esterlina / Peso",
    code: "GBP/CLP",
    type: "forex",
    basePrice: 1210,
    currentPrice: 1210,
    priceHistory: [1200, 1205, 1208, 1204, 1212, 1210, 1209, 1214, 1210],
    volatility: 0.006,
    trend: "stable"
  },
  {
    id: "jpy",
    name: "Yen Japonés / Peso",
    code: "JPY/CLP",
    type: "forex",
    basePrice: 6.2,
    currentPrice: 6.2,
    priceHistory: [6.1, 6.15, 6.18, 6.22, 6.19, 6.23, 6.21, 6.24, 6.2],
    volatility: 0.008,
    trend: "down"
  },
  {
    id: "chf",
    name: "Franco Suizo / Peso",
    code: "CHF/CLP",
    type: "forex",
    basePrice: 1060,
    currentPrice: 1060,
    priceHistory: [1048, 1052, 1050, 1056, 1055, 1061, 1058, 1064, 1060],
    volatility: 0.004,
    trend: "up"
  },
  {
    id: "aud",
    name: "Dólar Australiano / Peso",
    code: "AUD/CLP",
    type: "forex",
    basePrice: 630,
    currentPrice: 630,
    priceHistory: [622, 626, 624, 631, 628, 633, 629, 634, 630],
    volatility: 0.006,
    trend: "stable"
  },
  {
    id: "cad",
    name: "Dólar Canadiense / Peso",
    code: "CAD/CLP",
    type: "forex",
    basePrice: 690,
    currentPrice: 690,
    priceHistory: [680, 685, 683, 688, 689, 693, 688, 692, 690],
    volatility: 0.005,
    trend: "up"
  },
  {
    id: "brl",
    name: "Real Brasileño / Peso",
    code: "BRL/CLP",
    type: "forex",
    basePrice: 180,
    currentPrice: 180,
    priceHistory: [175, 178, 177, 181, 179, 182, 180, 183, 180],
    volatility: 0.007,
    trend: "stable"
  },
  {
    id: "cny",
    name: "Yuan Chino / Peso",
    code: "CNY/CLP",
    type: "forex",
    basePrice: 130,
    currentPrice: 130,
    priceHistory: [128, 129, 128, 131, 130, 132, 130, 131, 130],
    volatility: 0.005,
    trend: "stable"
  },
  {
    id: "mxn",
    name: "Peso Mexicano / Peso",
    code: "MXN/CLP",
    type: "forex",
    basePrice: 55,
    currentPrice: 55,
    priceHistory: [52, 53, 54, 53, 55, 54, 56, 55, 55],
    volatility: 0.008,
    trend: "up"
  },
  // Stocks (Acciones)
  {
    id: "nvda",
    name: "NVIDIA Corp.",
    code: "NVDA",
    type: "stock",
    basePrice: 120,
    currentPrice: 120,
    priceHistory: [115, 117, 116, 119, 121, 120, 118, 122, 120],
    volatility: 0.018,
    trend: "up"
  },
  {
    id: "aapl",
    name: "Apple Inc.",
    code: "AAPL",
    type: "stock",
    basePrice: 185,
    currentPrice: 185,
    priceHistory: [180, 182, 181, 184, 183, 186, 184, 187, 185],
    volatility: 0.012,
    trend: "stable"
  },
  {
    id: "tsla",
    name: "Tesla Inc.",
    code: "TSLA",
    type: "stock",
    basePrice: 210,
    currentPrice: 210,
    priceHistory: [200, 205, 202, 208, 207, 212, 209, 215, 210],
    volatility: 0.025,
    trend: "up"
  },
  {
    id: "msft",
    name: "Microsoft Corp.",
    code: "MSFT",
    type: "stock",
    basePrice: 415,
    currentPrice: 415,
    priceHistory: [405, 410, 408, 412, 414, 413, 416, 414, 415],
    volatility: 0.010,
    trend: "stable"
  },
  {
    id: "amzn",
    name: "Amazon.com Inc.",
    code: "AMZN",
    type: "stock",
    basePrice: 180,
    currentPrice: 180,
    priceHistory: [175, 178, 176, 179, 182, 180, 179, 183, 180],
    volatility: 0.015,
    trend: "up"
  },
  {
    id: "meta",
    name: "Meta Platforms Inc.",
    code: "META",
    type: "stock",
    basePrice: 470,
    currentPrice: 470,
    priceHistory: [455, 462, 458, 468, 465, 472, 468, 475, 470],
    volatility: 0.022,
    trend: "up"
  },
  // ETFs (Fondos Cotizados)
  {
    id: "spy",
    name: "SPDR S&P 500 ETF Trust",
    code: "SPY",
    type: "etf",
    basePrice: 520,
    currentPrice: 520,
    priceHistory: [510, 514, 513, 518, 516, 521, 518, 523, 520],
    volatility: 0.010,
    trend: "up"
  },
  {
    id: "qqq",
    name: "Invesco QQQ (Nasdaq 100)",
    code: "QQQ",
    type: "etf",
    basePrice: 460,
    currentPrice: 460,
    priceHistory: [448, 452, 450, 456, 455, 461, 458, 463, 460],
    volatility: 0.014,
    trend: "up"
  },
  {
    id: "iwm",
    name: "iShares Russell 2000 ETF",
    code: "IWM",
    type: "etf",
    basePrice: 200,
    currentPrice: 200,
    priceHistory: [195, 198, 197, 201, 199, 202, 200, 203, 200],
    volatility: 0.016,
    trend: "stable"
  },
  {
    id: "gld",
    name: "SPDR Gold Shares (Oro)",
    code: "GLD",
    type: "etf",
    basePrice: 220,
    currentPrice: 220,
    priceHistory: [215, 218, 217, 221, 219, 222, 220, 224, 220],
    volatility: 0.008,
    trend: "up"
  },
  {
    id: "dia",
    name: "SPDR Dow Jones Industrial",
    code: "DIA",
    type: "etf",
    basePrice: 390,
    currentPrice: 390,
    priceHistory: [382, 385, 384, 388, 387, 391, 389, 392, 390],
    volatility: 0.007,
    trend: "stable"
  },
  {
    id: "soxx",
    name: "iShares Semiconductor ETF (Chips/IA)",
    code: "SOXX",
    type: "etf",
    basePrice: 240,
    currentPrice: 240,
    priceHistory: [230, 235, 233, 238, 237, 242, 240, 243, 240],
    volatility: 0.022,
    trend: "up"
  },
  {
    id: "vti",
    name: "Vanguard Total Stock Market",
    code: "VTI",
    type: "etf",
    basePrice: 260,
    currentPrice: 260,
    priceHistory: [252, 255, 254, 258, 257, 261, 259, 262, 260],
    volatility: 0.009,
    trend: "up"
  },
  {
    id: "vnq",
    name: "Vanguard Real Estate ETF",
    code: "VNQ",
    type: "etf",
    basePrice: 85,
    currentPrice: 85,
    priceHistory: [81, 83, 82, 84, 85, 84, 86, 85, 85],
    volatility: 0.012,
    trend: "stable"
  },
  // Cryptocurrencies (Criptomonedas)
  {
    id: "btc",
    name: "Bitcoin (BTC / Peso)",
    code: "BTC/CLP",
    type: "crypto",
    basePrice: 65000000,
    currentPrice: 65000000,
    priceHistory: [63000000, 64200000, 63800000, 64800000, 64500000, 65500000, 64900000, 65800000, 65000000],
    volatility: 0.035,
    trend: "up"
  },
  {
    id: "eth",
    name: "Ethereum (ETH / Peso)",
    code: "ETH/CLP",
    type: "crypto",
    basePrice: 3200000,
    currentPrice: 3200000,
    priceHistory: [3100000, 3150000, 3120000, 3180000, 3170000, 3230000, 3190000, 3240000, 3200000],
    volatility: 0.045,
    trend: "up"
  },
  {
    id: "sol",
    name: "Solana (SOL / Peso)",
    code: "SOL/CLP",
    type: "crypto",
    basePrice: 140000,
    currentPrice: 140000,
    priceHistory: [132000, 137000, 135000, 142000, 139000, 144000, 141000, 145000, 140000],
    volatility: 0.055,
    trend: "stable"
  },
  {
    id: "bnb",
    name: "Binance Coin (BNB / Peso)",
    code: "BNB/CLP",
    type: "crypto",
    basePrice: 550000,
    currentPrice: 550000,
    priceHistory: [535000, 542000, 540000, 548000, 546000, 553000, 549000, 554000, 550000],
    volatility: 0.030,
    trend: "stable"
  },
  {
    id: "ada",
    name: "Cardano (ADA / Peso)",
    code: "ADA/CLP",
    type: "crypto",
    basePrice: 450,
    currentPrice: 450,
    priceHistory: [420, 440, 435, 460, 445, 455, 448, 462, 450],
    volatility: 0.065,
    trend: "stable"
  },
  {
    id: "dot",
    name: "Polkadot (DOT / Peso)",
    code: "DOT/CLP",
    type: "crypto",
    basePrice: 6200,
    currentPrice: 6200,
    priceHistory: [5900, 6100, 6000, 6300, 6150, 6250, 6180, 6350, 6200],
    volatility: 0.058,
    trend: "up"
  },
  // Commodities (Materias Primas / Materiales)
  {
    id: "copper",
    name: "Cobre Grado A (HG)",
    code: "COBRE",
    type: "commodity",
    basePrice: 4200,
    currentPrice: 4200,
    priceHistory: [4110, 4160, 4140, 4220, 4190, 4240, 4210, 4250, 4200],
    volatility: 0.015,
    trend: "up"
  },
  {
    id: "oil",
    name: "Petróleo Brent (BRENT)",
    code: "PETROLEO",
    type: "commodity",
    basePrice: 75000,
    currentPrice: 75000,
    priceHistory: [77200, 76500, 76800, 75900, 76200, 75300, 75600, 74800, 75000],
    volatility: 0.022,
    trend: "down"
  },
  {
    id: "lithium",
    name: "Carbonato de Litio",
    code: "LITIO",
    type: "commodity",
    basePrice: 12000,
    currentPrice: 12000,
    priceHistory: [12400, 12200, 12300, 12100, 12150, 11950, 12050, 11800, 12000],
    volatility: 0.040,
    trend: "stable"
  },
  {
    id: "silver",
    name: "Plata Física (XAG)",
    code: "PLATA",
    type: "commodity",
    basePrice: 28000,
    currentPrice: 28000,
    priceHistory: [27200, 27600, 27500, 27900, 27800, 28200, 28000, 28300, 28000],
    volatility: 0.018,
    trend: "up"
  },
  {
    id: "gold_com",
    name: "Oro Físico Comex",
    code: "ORO",
    type: "commodity",
    basePrice: 2350,
    currentPrice: 2350,
    priceHistory: [2300, 2320, 2315, 2340, 2330, 2360, 2345, 2370, 2350],
    volatility: 0.009,
    trend: "up"
  },
  {
    id: "gas",
    name: "Gas Natural Henry Hub",
    code: "GAS",
    type: "commodity",
    basePrice: 2500,
    currentPrice: 2500,
    priceHistory: [2650, 2600, 2580, 2530, 2540, 2480, 2510, 2460, 2500],
    volatility: 0.038,
    trend: "down"
  }
];

export const createInitialWallets = (): AIWallet[] => {
  return INITIAL_MARKET_ASSETS.map((asset, index) => {
    // Determine initial activation status
    // The user rules specify: USD/ARS starts active.
    let status: "locked" | "waiting_loan" | "active" = "locked";
    let isActive = false;

    if (asset.id === "usd") {
      status = "active";
      isActive = true;
    } else if (asset.type === "forex") {
      // Other forex are waiting for preceding currency gains
      status = "waiting_loan";
    } else {
      // Stocks are completely locked until currency cop is finalized
      status = "locked";
    }

    return {
      assetId: asset.id,
      assetCode: asset.code,
      assetName: asset.name,
      type: asset.type,
      isActive,
      status,
      investedAmount: asset.id === "usd" ? 25000 : 0, // Starts with 25,000 for USD
      gains: 0,
      targetGainsForNextLoan: 20000,
      accumulatedLearningMs: 1200, // Speed starts at 1,200ms
      learningLevelPercent: 5, // Basic level
      riskConfig: {
        stopLossPercent: 2.5,
        takeProfitPercent: 7.5,
        maxDrawdown: 10,
        diversificationScore: asset.id === "usd" ? 65 : 40,
        riskLevel: "Bajo"
      },
      lastDecision: asset.id === "usd" ? "Inicializando redes neuronales..." : "Inactivo - Esperando asignación de fondos",
      totalTrades: 0,
      successfulTrades: 0,
      agents: generateDefaultAgents()
    };
  });
};
