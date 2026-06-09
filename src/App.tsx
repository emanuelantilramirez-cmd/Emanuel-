import { useState, useEffect, useRef } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  BrainCircuit, 
  Coins, 
  ArrowUpRight, 
  PiggyBank, 
  ShieldCheck, 
  Zap, 
  History, 
  AlertTriangle, 
  Sliders, 
  Wallet, 
  Play, 
  Pause, 
  RefreshCw,
  Info,
  Timer,
  Clock
} from "lucide-react";
import { Asset, AIWallet, TradingLog, UserBalance } from "./types";
import { INITIAL_MARKET_ASSETS, createInitialWallets } from "./data/initialAssets";
import { AssetChart } from "./components/AssetChart";
import { DepositModal } from "./components/DepositModal";
import { AIExplanationModal } from "./components/AIExplanationModal";
// @ts-ignore
import neuralTradingLogo from "./assets/images/neural_trading_logo_1780976548897.png";

export default function App() {
  // --- States ---
  const [balance, setBalance] = useState<UserBalance>({
    realDepositedSim: 100000, // Starts with 100K CLP as demo
    totalValueCLP: 125000,
    unallocatedCash: 75000,
    totalWithdrawnToBankCLP: 0,
    accumulatedProfitForWithdrawalCLP: 0
  });

  const [assets, setAssets] = useState<Asset[]>(INITIAL_MARKET_ASSETS);
  const [wallets, setWallets] = useState<AIWallet[]>(createInitialWallets());
  const [logs, setLogs] = useState<TradingLog[]>([
    {
      id: "init",
      timestamp: new Date().toLocaleTimeString(),
      type: "sys",
      message: "Motor de Trading IA Inicializado. Redes neuronales listas.",
      source: "Sistema"
    }
  ]);

  const [activeTab, setActiveTab] = useState<"forex" | "stock" | "etf" | "crypto" | "commodity">("forex");
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [selectedWalletForDetail, setSelectedWalletForDetail] = useState<AIWallet | null>(null);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [simulationSpeedMultiplier, setSimulationSpeedMultiplier] = useState<number>(4); // Scaling speed
  const [walletCustomInputs, setWalletCustomInputs] = useState<Record<string, { deposit: string; withdraw: string }>>({});
  const [loansFrozen, setLoansFrozen] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [unlockTime, setUnlockTime] = useState<number | null>(null);

  // Convert seconds to MM:SS format
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  // Stopwatch timer for active investment period
  useEffect(() => {
    if (!isSimulationRunning) return;
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isSimulationRunning]);

  // Monitor package unlock duration
  useEffect(() => {
    const allUnlocked = wallets.length > 0 && wallets.every(w => w.status === "active");
    if (allUnlocked && unlockTime === null && elapsedTime > 0) {
      setUnlockTime(elapsedTime);
    }
  }, [wallets, elapsedTime, unlockTime]);

  // Keep ref for state updates inside timer loop to avoid stale closure
  const stateRef = useRef({ wallets, assets, balance, logs, loansFrozen });
  useEffect(() => {
    stateRef.current = { wallets, assets, balance, logs, loansFrozen };
  }, [wallets, assets, balance, logs, loansFrozen]);

  // --- Simulated Live Ticker Loop ---
  useEffect(() => {
    if (!isSimulationRunning) return;

    // Run interval every 2 seconds to simulate high-frequency ticks
    const interval = setInterval(() => {
      const current = stateRef.current;
      
      // 1. Update Asset Prices with random walk based on volatility
      const updatedAssets = current.assets.map(asset => {
        const changePercent = (Math.random() - 0.48) * 2 * asset.volatility * simulationSpeedMultiplier;
        const previousPrice = asset.currentPrice;
        const currentPrice = Math.max(0.01, previousPrice * (1 + changePercent));
        
        let newHistory = [...asset.priceHistory, currentPrice];
        if (newHistory.length > 20) {
          newHistory.shift(); // Keep history size contained
        }

        const trend = currentPrice > previousPrice ? "up" : currentPrice < previousPrice ? "down" : "stable" as any;

        return {
          ...asset,
          currentPrice,
          priceHistory: newHistory,
          trend
        };
      });

      // 2. Simulate AI wallets making trades and learning
      let newLogs = [...current.logs];
      let balanceChange = 0;
      let totalPortfolioValue = current.balance.unallocatedCash;
      let anyTradeLoss = false;

      const updatedWallets = current.wallets.map((wallet, index) => {
        if (wallet.status !== "active") {
          return wallet;
        }

        // Active wallet logic
        const associatedAsset = updatedAssets.find(a => a.id === wallet.assetId);
        if (!associatedAsset) return wallet;

        // Perform random AI trade decision
        const isUp = associatedAsset.trend === "up";
        
        // Dynamic Machine Learning Perfection engine:
        // Base accuracy begins at 65%, and as learningLevelPercent escalates toward 100%,
        // accuracy optimizes proportionally up to a staggering 98.8% correctness!
        const learningFactor = wallet.learningLevelPercent / 100;
        const currentAIAccuracy = 0.65 + (learningFactor * 0.338); 
        const tradeSuccess = (Math.random() < currentAIAccuracy); 
        let localGainChange = 0;

        // Gains calculated relative to invested amount
        if (isUp) {
          localGainChange = wallet.investedAmount * (associatedAsset.volatility * (tradeSuccess ? 1.5 : -1.0));
        } else {
          localGainChange = wallet.investedAmount * (associatedAsset.volatility * (tradeSuccess ? 1.2 : -0.8));
        }

        // Round of decimal values
        localGainChange = Math.round(localGainChange * 10) / 10;
        if (localGainChange < 0) {
          anyTradeLoss = true;
        }
        const newGains = wallet.gains + localGainChange;

        // Multi-millisecond acceleration simulation
        const previousMs = wallet.accumulatedLearningMs;
        const msGain = Math.round(Math.random() * 8 + 2);
        const newMs = Math.max(1, previousMs - msGain); // Faster decisions
        const newLearningPercent = Math.min(100, wallet.learningLevelPercent + (Math.random() > 0.45 ? 1 : 0));

        let lastDecisionStr = wallet.lastDecision;
        const dice = Math.random();
        
        // Precision reporting based on accuracy level
        const currentErrorRateText = ((1 - currentAIAccuracy) * 100).toFixed(2);
        
        if (dice < 0.25) {
          const tradeDir = localGainChange >= 0 ? "COMPRA" : "VENTA";
          if (newLearningPercent > 90) {
            lastDecisionStr = `Precisión Perfecta: IA ${tradeDir} ejecutada con Éxito. Tasa de error residual de solo ${currentErrorRateText}%.`;
          } else {
            lastDecisionStr = `IA ${tradeDir} exitosa: Margen de pips optimizado en ${newMs}ms (Margen Error: ${currentErrorRateText}%).`;
          }
          
          if (newLogs.length < 50) {
            newLogs.unshift({
              id: `${wallet.assetCode}-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              type: "trade",
              message: `IA ${wallet.assetCode} ejecutó ${tradeDir} con precisión de ${(currentAIAccuracy * 100).toFixed(1)}% (Ganancia: CLP $${localGainChange.toLocaleString()})`,
              source: wallet.assetCode
            });
          }
        } else if (dice > 0.82) {
          if (newLearningPercent > 85) {
            lastDecisionStr = `Sincronización cuántica al 100%. Sinapsis auto-calibrada sin pérdida detectable.`;
            if (Math.random() > 0.6) {
              newLogs.unshift({
                id: `perfect-${wallet.assetCode}-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                type: "learning",
                message: `🤖 OPTIMIZACIÓN REFORZADA: El Consenso de ${wallet.assetCode} ha alcanzado un nivel récord de estabilidad (Tasa de error simulada: ${currentErrorRateText}%).`,
                source: "IA Core"
              });
            }
          } else {
            lastDecisionStr = `Re-calibrando pesos sinápticos con gestión de riesgo diversificado. Margen de error actual: ${currentErrorRateText}%.`;
          }
        }

        // Accumulate portfolio valuation
        totalPortfolioValue += wallet.investedAmount + newGains;
        balanceChange += localGainChange;

        // Dynamic 5 sub-agent analysis & decision consensus engine
        const baseTrend = associatedAsset.trend;
        const updatedAgents = (wallet.agents || []).map(agent => {
          let newVote: "COMPRE" | "VENDA" | "ESPERA" = "ESPERA";
          let newConfidence = agent.confidence;
          let rating = agent.contributionRating;

          // Recalculate slightly based on current simulation metrics
          const learningBonus = Math.round(learningFactor * 15);
          newConfidence = Math.min(100, Math.max(50, agent.confidence + Math.round((Math.random() - 0.5) * 8) + learningBonus));
          rating = Math.min(100, Math.max(65, agent.contributionRating + Math.round((Math.random() - 0.5) * 4) + learningBonus));

          switch (agent.name) {
            case "TrendAnalyst":
              newVote = baseTrend === "up" ? "COMPRE" : baseTrend === "down" ? "VENDA" : "ESPERA";
              break;
            case "QuantStrategist":
              newVote = Math.random() > 0.35 ? (baseTrend === "up" ? "COMPRE" : "VENDA") : "ESPERA";
              break;
            case "RiskGuardian":
              // Conservative agent
              newVote = Math.random() > 0.65 ? "ESPERA" : (localGainChange >= 0 ? "COMPRE" : "VENDA");
              break;
            case "SigmaVolatility":
              // Measures spikes
              newVote = Math.abs(localGainChange) > wallet.investedAmount * 0.015 ? "ESPERA" : (baseTrend === "up" ? "COMPRE" : "VENDA");
              break;
            default:
              newVote = "ESPERA";
          }

          return {
            ...agent,
            vote: newVote,
            confidence: newConfidence,
            contributionRating: rating
          };
        });

        // Sum votes to calculate consensus decision by the 5th Core Agent
        const votes = updatedAgents.map(a => a.vote);
        const buys = votes.filter(v => v === "COMPRE").length;
        const sells = votes.filter(v => v === "VENDA").length;
        let consensusVote: "COMPRE" | "VENDA" | "ESPERA" = "ESPERA";
        if (buys >= 2) consensusVote = "COMPRE";
        else if (sells >= 2) consensusVote = "VENDA";

        const finalAgents = updatedAgents.map(agent => {
          if (agent.name === "ConsensusCore") {
            const consensusBase = Math.round(((Math.max(buys, sells) + 1) / 5) * 100);
            return {
              ...agent,
              vote: consensusVote,
              confidence: Math.min(100, consensusBase + Math.round(learningFactor * 18))
            };
          }
          return agent;
        });

        return {
          ...wallet,
          gains: newGains,
          accumulatedLearningMs: newMs,
          learningLevelPercent: newLearningPercent,
          lastDecision: lastDecisionStr,
          totalTrades: wallet.totalTrades + 1,
          successfulTrades: wallet.successfulTrades + (localGainChange >= 0 ? 1 : 0),
          agents: finalAgents,
          riskConfig: {
            ...wallet.riskConfig,
            diversificationScore: Math.min(100, wallet.riskConfig.diversificationScore + (Math.random() > 0.85 ? 1 : 0))
          }
        };
      });

      // 3. Loans activation loop (Regla de Préstamo Cruzado de 20,000 pesos con Congelación & Autogestión)
      let nextLoansFrozen = current.loansFrozen;

      // Are all wallets functioning/active? 
      const allActive = updatedWallets.every(w => w.status === "active");

      if (allActive) {
        if (!nextLoansFrozen) {
          // Freeze loans for the first time when all are active
          nextLoansFrozen = true;
          newLogs.unshift({
            id: `loans-freeze-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            type: "sys",
            message: "❄️ PROTOCOLO CONGELADO: Todas las carteras de IA están activas. Préstamos cruzados pausados en red corporativa. Las unidades ahora acumulan beneficios directamente.",
            source: "IA Core"
          });
        }
      }

      // If one of these fails ("si una de estas fallas se activa de nuevo el prestamo")
      // We detect a trade failure (anyTradeLoss) or active wallet with negative gains balance
      const hasAnyLowReserves = updatedWallets.some(w => w.status === "active" && w.gains < 0);
      if ((anyTradeLoss || hasAnyLowReserves) && nextLoansFrozen) {
        nextLoansFrozen = false;
        newLogs.unshift({
          id: `loans-unfreeze-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: "sys",
          message: "⚠️ PROTOCOLO DE ALERTA: Se detectó una falla de precisión en trading o saldo negativo de reserva. Reactivando préstamos cruzados de auxilio mutuo.",
          source: "IA Core"
        });
      }

      let chainApplied = false;
      const finalWallets = updatedWallets.map((wallet, idx) => {
        // When gains reach 20k, we evaluate
        if (wallet.status === "active" && wallet.gains >= 20000) {
          if (!nextLoansFrozen) {
            // Look for next waiting, locked wallet or a previous wallet in failure state
            const needyWalletIndex = updatedWallets.findIndex((w) => {
              if (w.status === "waiting_loan" || w.status === "locked") return true;
              if (w.status === "active" && w.gains < 0) return true;
              return false;
            });

            if (needyWalletIndex !== -1) {
              const needyWallet = updatedWallets[needyWalletIndex];
              
              // Apply loan of 20,000 pesos from gains
              wallet.gains -= 20000;
              
              if (needyWallet.status === "waiting_loan" || needyWallet.status === "locked") {
                needyWallet.status = "active";
                needyWallet.isActive = true;
                needyWallet.investedAmount += 20000;
                needyWallet.lastDecision = `¡Unidad IA Activada por préstamos de IA ${wallet.assetCode}!`;
                
                newLogs.unshift({
                  id: `loan-act-${Date.now()}-${needyWallet.assetCode}`,
                  timestamp: new Date().toLocaleTimeString(),
                  type: "loan",
                  message: `¡IA ${wallet.assetCode} prestó CLP $20.000 a IA ${needyWallet.assetCode}! Activación mutua completada con éxito.`,
                  source: "Red Cruzada"
                });
              } else {
                // Help recover an active wallet in failure
                needyWallet.gains += 20000;
                needyWallet.lastDecision = `Soporte financiero activo: CLP $20.000 inyectados por la IA ${wallet.assetCode} para solucionar falla.`;
                
                newLogs.unshift({
                  id: `loan-rescue-${Date.now()}-${needyWallet.assetCode}`,
                  timestamp: new Date().toLocaleTimeString(),
                  type: "loan",
                  message: `🚨 RESPALDO FINANCIERO: IA ${wallet.assetCode} transfirió un préstamo de CLP $20.000 a IA ${needyWallet.assetCode} para revertir su caída.`,
                  source: "Red Cruzada"
                });
              }
              chainApplied = true;
            } else {
              // No needy wallets, increase own portfolio of investment by 10,000 CCL / CLP
              wallet.investedAmount += 10000;
              wallet.gains -= 10000;
              
              newLogs.unshift({
                id: `compound-auto-${Date.now()}-${wallet.assetCode}`,
                timestamp: new Date().toLocaleTimeString(),
                type: "learning",
                message: `🤖 CAPITAL COMPUESTO: IA ${wallet.assetCode} superó CLP $20.000 de beneficio. Incrementó su fondo de inversión de capital en CLP $10.000.`,
                source: wallet.assetCode
              });
            }
          } else {
            // Loans frozen: "en vez de prestar el doble a las demas carteras esta aumentaran el fondo de inversion en 10000 pesos."
            wallet.investedAmount += 10000;
            wallet.gains -= 10000;
            
            newLogs.unshift({
              id: `compound-auto-frozen-${Date.now()}-${wallet.assetCode}`,
              timestamp: new Date().toLocaleTimeString(),
              type: "learning",
              message: `📈 APALANCAMIENTO PROPIO: IA ${wallet.assetCode} alcanzó los CLP $20.000 en rentabilidades. Con préstamos pausados, autopotenció su capital sumando CLP $10.000 a su fondo.`,
              source: wallet.assetCode
            });
          }
        }
        return wallet;
      });

      // 4. Copar divisas and pass to Acciones, ETFs, Criptos y Commodities
      // If all Forex divisas are already active, we ensure Stocks (Acciones), ETFs, Cryptos and Commodities state changes from locked to active or ready.
      const allForexActive = finalWallets.filter(w => w.type === "forex").every(w => w.status === "active");
      if (allForexActive) {
        finalWallets.forEach(w => {
          if ((w.type === "stock" || w.type === "etf" || w.type === "crypto" || w.type === "commodity") && w.status === "locked") {
            w.status = "active";
            w.isActive = true;
            w.investedAmount = 50000; // Multi-threaded portfolio capital injected
            if (w.type === "stock") {
              w.lastDecision = "Divisas copadas. IA migrada a Wall Street de Alta Velocidad (Comprar/Venta Rápida).";
            } else if (w.type === "etf") {
              w.lastDecision = "Divisas copadas. Red neuronal diversificada en el mercado de Fondos Cotizados (ETFs).";
            } else if (w.type === "crypto") {
              w.lastDecision = "Divisas copadas. Enlaces de red neuronal sincronizados con blockchain / DeFi de alta frecuencia.";
            } else {
              w.lastDecision = "Divisas copadas. Análisis predictivo activo en commodities pesados (Cobre, Litio, Petróleo).";
            }
            
            let msgStr = "";
            if (w.type === "stock") {
              msgStr = `¡Mercado Forex Copado! Iniciando compra y venta rápida de acciones de la Bolsa de New York (Wall Street).`;
            } else if (w.type === "etf") {
              msgStr = `¡Mercado Forex Copado! Cobertura colectiva de IA activada en ETFs de alto rendimiento (${w.assetCode}).`;
            } else if (w.type === "crypto") {
              msgStr = `¡Mercado Forex Copado! Oráculos DeFi activos. Iniciando arbitraje cuántico en Criptomonedas (${w.assetCode}).`;
            } else {
              msgStr = `¡Mercado Forex Copado! IA sincronizada con materias primas y commodities globales estratégicos (${w.assetCode}).`;
            }

            newLogs.unshift({
              id: `wall-st-${Date.now()}-${w.assetCode}`,
              timestamp: new Date().toLocaleTimeString(),
              type: "sys",
              message: msgStr,
              source: "IA Core"
            });
          }
        });
      }

      // Limit logs size to 30 items for visual performance
      if (newLogs.length > 30) {
        newLogs = newLogs.slice(0, 30);
      }

      // 5. Automated Bank Account Withdrawal for every 100,000 CLP generated
      const currentAccGains = current.balance.accumulatedProfitForWithdrawalCLP + (balanceChange > 0 ? balanceChange : 0);
      let nextAccGains = currentAccGains;
      let extraWithdrawn = 0;
      
      while (nextAccGains >= 100000) {
        nextAccGains -= 100000;
        extraWithdrawn += 100000;
      }
      
      if (extraWithdrawn > 0) {
        newLogs.unshift({
          id: `payout-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: "deposit",
          message: `🏦 COBRO AUTOMÁTICO: ¡Se transfirieron CLP $${extraWithdrawn.toLocaleString()} a tu cuenta bancaria asociada!`,
          source: "Banco Auto"
        });
      }

      setAssets(updatedAssets);
      setWallets(finalWallets);
      setLogs(newLogs);

      if (nextLoansFrozen !== current.loansFrozen) {
        setLoansFrozen(nextLoansFrozen);
      }
      
      setBalance(prev => ({
        ...prev,
        totalValueCLP: Math.round(totalPortfolioValue - extraWithdrawn),
        totalWithdrawnToBankCLP: prev.totalWithdrawnToBankCLP + extraWithdrawn,
        accumulatedProfitForWithdrawalCLP: nextAccGains
      }));

    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulationRunning, simulationSpeedMultiplier]);

  // --- Handlers ---
  const handleDepositSuccess = (amount: number, method: string) => {
    setBalance(prev => ({
      ...prev,
      realDepositedSim: prev.realDepositedSim + amount,
      unallocatedCash: prev.unallocatedCash + amount,
      totalValueCLP: prev.totalValueCLP + amount
    }));

    // Trigger usd wallet allocation or distribute to active ones
    setWallets(prevWallets => {
      return prevWallets.map(w => {
        if (w.status === "active") {
          // Put 50% of deposit automatically into active trading with auto-risk diversification
          const addedVal = Math.round(amount * 0.4);
          return {
            ...w,
            investedAmount: w.investedAmount + addedVal,
            lastDecision: `Depósito real asignado. Portafolio incrementado en CLP $${addedVal}`
          };
        }
        return w;
      });
    });

    setLogs(prev => [
      {
        id: `dep-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "deposit",
        message: `Depósito real exitoso de CLP $${amount.toLocaleString()} vía ${method}. Asignado a carteras IA.`,
        source: "Depósito"
      },
      ...prev
    ]);
  };

  const handleUpdateRisk = (assetId: string, value: "Bajo" | "Moderado" | "Alto" | "Turbo Millonario") => {
    let stopLoss = 2.5;
    let takeProfit = 7.5;
    if (value === "Moderado") {
      stopLoss = 5.0;
      takeProfit = 15.0;
    } else if (value === "Alto") {
      stopLoss = 10.0;
      takeProfit = 35.0;
    } else if (value === "Turbo Millonario") {
      stopLoss = 30.0;
      takeProfit = 150.0;
    }

    setWallets(prev => prev.map(w => {
      if (w.assetId === assetId) {
        return {
          ...w,
          riskConfig: {
            ...w.riskConfig,
            riskLevel: value,
            stopLossPercent: stopLoss,
            takeProfitPercent: takeProfit
          },
          lastDecision: `Riesgo reprogramado a [${value}]. Parámetros neuronales optimizados.`
        };
      }
      return w;
    }));

    setLogs(prev => [
      {
        id: `risk-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "sys",
        message: `Ajuste del nivel de riesgo para ${assetId.toUpperCase()} a [${value}]. Red neuronal reconfigurada.`,
        source: "Gestor Riesgo"
      },
      ...prev
    ]);
  };

  // Safe manual learning trigger (increments skill and reduces speed)
  const triggerManualAILearning = (assetId: string) => {
    setWallets(prev => prev.map(w => {
      if (w.assetId === assetId) {
        const speedReduction = Math.round(100 + Math.random() * 150);
        const newSpeed = Math.max(1, w.accumulatedLearningMs - speedReduction);
        return {
          ...w,
          learningLevelPercent: Math.min(100, w.learningLevelPercent + 8),
          accumulatedLearningMs: newSpeed,
          lastDecision: `Estudio intensivo manual gatillado. Desempeño acelerado a ${newSpeed}ms.`
        };
      }
      return w;
    }));

    setLogs(prev => [
      {
        id: `learn-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "learning",
        message: `Entrenamiento intensivo gatillado por usuario para ${assetId.toUpperCase()}. Modelo de lenguaje optimizado.`,
        source: "Aprendizaje"
      },
      ...prev
    ]);
  };

  // Manual increase of capital (inject money into active wallet)
  const handleIncreaseCapital = (assetId: string, amount: number) => {
    if (amount <= 0) return;
    
    // Check if user has enough unallocatedCash. If not, auto-deposit simulating instant bank authorization
    let cashNeeded = amount;
    const hasEnough = balance.unallocatedCash >= cashNeeded;
    
    if (!hasEnough) {
      // Auto-increase simulated deposits with instant approval to meet the target
      const gap = cashNeeded - balance.unallocatedCash;
      setBalance(prev => ({
        ...prev,
        realDepositedSim: prev.realDepositedSim + gap,
        unallocatedCash: 0,
        totalValueCLP: prev.totalValueCLP + gap
      }));
      setLogs(prev => [
        {
          id: `dep-auto-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: "deposit",
          message: `Inyección de Capital: Autorización rápida de banco aprobó CLP $${gap.toLocaleString()} para completar capital de inversión.`,
          source: "Banco Express"
        },
        ...prev
      ]);
    } else {
      setBalance(prev => ({
        ...prev,
        unallocatedCash: prev.unallocatedCash - cashNeeded
      }));
    }

    setWallets(prev => prev.map(w => {
      if (w.assetId === assetId) {
        return {
          ...w,
          investedAmount: w.investedAmount + cashNeeded,
          lastDecision: `Incremento de capital manual de CLP $${cashNeeded.toLocaleString()} inyectado con éxito.`
        };
      }
      return w;
    }));

    setLogs(prev => [
      {
        id: `capital-add-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "deposit",
        message: `Se inyectó un capital manual de CLP $${cashNeeded.toLocaleString()} en la cartera IA de ${assetId.toUpperCase()}.`,
        source: "Gestión Capital"
      },
      ...prev
    ]);
  };

  // Manual withdrawal of accumulated gains of specific wallet
  const handleWithdrawWalletGains = (assetId: string) => {
    const targetWallet = wallets.find(w => w.assetId === assetId);
    if (!targetWallet || targetWallet.gains <= 0) return;

    const withdrawAmount = Math.round(targetWallet.gains);

    // Subtract gains from wallet and transfer to unallocatedCash or trigger automatic bank payout
    setWallets(prev => prev.map(w => {
      if (w.assetId === assetId) {
        return {
          ...w,
          gains: 0,
          lastDecision: `Capitalización manual completada. Retiro de dividendos de CLP $${withdrawAmount.toLocaleString()} transferido.`
        };
      }
      return w;
    }));

    // Add to withdrawn direct bank account
    setBalance(prev => ({
      ...prev,
      totalWithdrawnToBankCLP: prev.totalWithdrawnToBankCLP + withdrawAmount,
      totalValueCLP: Math.max(0, prev.totalValueCLP - withdrawAmount)
    }));

    setLogs(prev => [
      {
        id: `with-manual-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "deposit",
        message: `💵 RETIRO EXITOSO: CLP $${withdrawAmount.toLocaleString()} retirados de la cartera ${targetWallet.assetCode} transferidos de inmediato a tu cuenta de banco.`,
        source: "Retiro Manual"
      },
      ...prev
    ]);
  };

  // Manual withdrawal of custom accumulated gains of specific wallet
  const handleWithdrawWalletCustomGains = (assetId: string, amount: number) => {
    const targetWallet = wallets.find(w => w.assetId === assetId);
    if (!targetWallet || amount <= 0 || amount > targetWallet.gains) return;

    const withdrawAmount = Math.round(amount);

    // Subtract gains from wallet
    setWallets(prev => prev.map(w => {
      if (w.assetId === assetId) {
        return {
          ...w,
          gains: Math.max(0, w.gains - withdrawAmount),
          lastDecision: `Capitalización parcial completada. Retiro de dividendos de CLP $${withdrawAmount.toLocaleString()} transferido.`
        };
      }
      return w;
    }));

    // Add to withdrawn direct bank account
    setBalance(prev => ({
      ...prev,
      totalWithdrawnToBankCLP: prev.totalWithdrawnToBankCLP + withdrawAmount,
      totalValueCLP: Math.max(0, prev.totalValueCLP - withdrawAmount)
    }));

    setLogs(prev => [
      {
        id: `with-manual-partial-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "deposit",
        message: `💵 RETIRO PARCIAL: CLP $${withdrawAmount.toLocaleString()} retirados de la cartera ${targetWallet.assetCode} transferidos de inmediato a tu cuenta de banco.`,
        source: "Retiro Manual"
      },
      ...prev
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-between" id="app-root-container">
      
      {/* Top Professional Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Logo Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-1 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">CEREBRO TRADING IA</h1>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 animate-pulse">AUTÓNOMO SPEED-DECISION</span>
              </div>
              <p className="text-xs text-slate-400">Algoritmo de gestión y microcontroladores de divisas en milisegundos</p>
            </div>
          </div>

          {/* Real-time statistics summaries */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            
            {/* Real Deposited Simulated Cash */}
            <div className="bg-slate-950/60 border border-slate-800/80 px-3 py-1.5 rounded-xl flex items-center gap-2.5">
              <PiggyBank className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-mono">DEPÓSITO REAL ACUMULADO EN PESOS CHILENOS</div>
                <div className="text-sm font-extrabold text-white">
                  CLP ${balance.realDepositedSim.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Total Balance / Portfolio Value */}
            <div className="bg-slate-950/60 border border-slate-800/80 px-3 py-1.5 rounded-xl flex items-center gap-2.5">
              <Coins className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-mono">VALOR TOTAL CARTERA IA EN PESOS CHILENOS</div>
                <div className="text-sm font-extrabold text-cyan-400">
                  CLP ${balance.totalValueCLP.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Auto bank withdrawal indicator */}
            <div className="bg-slate-900/90 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-2.5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400" />
              <div className="h-4 w-4 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 font-bold shrink-0 animate-pulse text-[10px]">
                $
              </div>
              <div>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  PAGOS AUTOMÁTICOS A BANCO EN PESOS CHILENOS
                </div>
                <div className="text-sm font-extrabold text-white">
                  CLP ${balance.totalWithdrawnToBankCLP.toLocaleString()}
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  Siguiente a $100k: <span className="text-emerald-400 font-bold">{Math.round((balance.accumulatedProfitForWithdrawalCLP / 100000) * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Simulated instant millionaire countdown */}
            <div className="hidden lg:flex bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 px-3 py-1.5 rounded-xl items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
              <div>
                <div className="text-[9px] text-amber-300 font-bold tracking-wider">RECORTE DE TIEMPO MILLONARIO</div>
                <div className="text-xs font-mono font-bold text-amber-200">
                  +{( ((balance.totalValueCLP + balance.totalWithdrawnToBankCLP) / balance.realDepositedSim) * 100 - 100 ).toFixed(1)}% Rédito
                </div>
              </div>
            </div>

            {/* DEPOSIT ACTION BUTTON */}
            <button
              onClick={() => setIsDepositOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 active:scale-[0.97] transition-all text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
              id="cta-make-deposit"
            >
              <Wallet className="w-4 h-4" />
              EFECTUAR DEPÓSITO REAL
            </button>
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Core dynamic wallets and assets (8 columns grid) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Market Status and Manual Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                CENTRO DE MONITOREO MULTI-HILO COGNITIVO
              </h2>
              <p className="text-xs text-slate-400">Las IAs autónomas invierten y aprenden de manera aislada con su propia billetera</p>
            </div>

            {/* Speed Simulation configuration & simulation buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Cronómetro de Inversión */}
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800/80">
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <div className="text-left font-mono">
                  <div className="text-[8px] text-slate-500 font-bold uppercase leading-tight">TIEMPO INVERSIÓN</div>
                  <div className="text-[11px] font-extrabold text-cyan-200 mt-0.5">{formatTime(elapsedTime)}</div>
                </div>
              </div>

              {/* Tiempo Desbloqueo Paquete */}
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800/80">
                <Timer className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <div className="text-left font-mono">
                  <div className="text-[8px] text-slate-500 font-bold uppercase leading-tight">DESBLOQUEO PAQUETE</div>
                  <div className="text-[11px] font-extrabold text-emerald-400 mt-0.5">
                    {unlockTime !== null ? (
                      <span>{formatTime(unlockTime)}</span>
                    ) : (
                      <span className="text-amber-500 animate-pulse">En curso...</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setIsSimulationRunning(!isSimulationRunning)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                    isSimulationRunning 
                      ? "bg-slate-800 text-emerald-400" 
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {isSimulationRunning ? (
                    <>
                      <Pause className="w-3" /> Activo
                    </>
                  ) : (
                    <>
                      <Play className="w-3" /> Pausado
                    </>
                  )}
                </button>

                <select
                  value={simulationSpeedMultiplier}
                  onChange={(e) => setSimulationSpeedMultiplier(Number(e.target.value))}
                  className="bg-transparent text-slate-300 text-[11px] font-bold px-2 py-1 outline-none font-mono"
                  title="Multiplicador de volatilidad"
                >
                  <option value="1" className="bg-slate-900 text-slate-300">Acel: Normal</option>
                  <option value="2" className="bg-slate-900 text-slate-300">Acel: 2x Turbo</option>
                  <option value="4" className="bg-slate-900 text-slate-300">Acel: 4x Millonario</option>
                  <option value="8" className="bg-slate-900 text-slate-300">Acel: 8x Cuántico</option>
                </select>
              </div>
            </div>
          </div>

          {/* Navigation Tab: Divisas vs Acciones vs ETFs */}
          <div className="border-b border-slate-800 flex justify-between items-center">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("forex")}
                className={`py-2 px-4 text-xs font-bold border-b-2 transition-all ${
                  activeTab === "forex"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                DIVISAS FOREX ({wallets.filter(w => w.type === "forex").length})
              </button>
              <button
                onClick={() => setActiveTab("stock")}
                className={`py-2 px-4 text-xs font-bold border-b-2 transition-all relative flex items-center gap-1.5 ${
                  activeTab === "stock"
                    ? "border-cyan-500 text-cyan-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                ACCIONES ({wallets.filter(w => w.type === "stock").length})
                {/* Visual marker if locked */}
                {wallets.filter(w => w.type === "stock").some(w => w.status === "locked") && (
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("etf")}
                className={`py-2 px-4 text-xs font-bold border-b-2 transition-all relative flex items-center gap-1.5 ${
                  activeTab === "etf"
                    ? "border-amber-500 text-amber-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                ETFs GLOBALES ({wallets.filter(w => w.type === "etf").length})
                {/* Visual marker if locked */}
                {wallets.filter(w => w.type === "etf").some(w => w.status === "locked") && (
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("crypto")}
                className={`py-2 px-4 text-xs font-bold border-b-2 transition-all relative flex items-center gap-1.5 ${
                  activeTab === "crypto"
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                RÁPIDAS CRIPTOS ({wallets.filter(w => w.type === "crypto").length})
                {/* Visual marker if locked */}
                {wallets.filter(w => w.type === "crypto").some(w => w.status === "locked") && (
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("commodity")}
                className={`py-2 px-4 text-xs font-bold border-b-2 transition-all relative flex items-center gap-1.5 ${
                  activeTab === "commodity"
                    ? "border-orange-500 text-orange-400"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                MATERIAS PRIMAS ({wallets.filter(w => w.type === "commodity").length})
                {/* Visual marker if locked */}
                {wallets.filter(w => w.type === "commodity").some(w => w.status === "locked") && (
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                )}
              </button>
            </div>

            <div className="text-[10px] text-slate-500 font-mono">
              Entorno Seguro Integrado
            </div>
          </div>

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wallets
              .filter(w => w.type === activeTab)
              .map(wallet => {
                const asset = assets.find(a => a.id === wallet.assetId);
                if (!asset) return null;

                const isUp = asset.trend === "up";
                const isDown = asset.trend === "down";
                const currentTarget = loansFrozen ? 20000 : wallet.targetGainsForNextLoan;

                let cardBorderClass = "border-slate-800/80 bg-slate-900/60";
                if (wallet.status === "active") {
                  cardBorderClass = "border-slate-700/60 bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-lg";
                } else if (wallet.status === "waiting_loan") {
                  cardBorderClass = "border-amber-500/10 bg-amber-950/5 opacity-60";
                } else if (wallet.status === "locked") {
                  cardBorderClass = "border-red-950/10 bg-red-950/5 opacity-40";
                }

                return (
                  <div 
                    key={wallet.assetId} 
                    className={`rounded-2xl border p-4 transition-all relative overflow-hidden ${cardBorderClass}`}
                    id={`wallet-card-${wallet.assetId}`}
                  >
                    
                    {/* Header: Name and Status badge */}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-white tracking-tight">{wallet.assetCode}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{wallet.assetName}</span>
                        </div>
                        <div className="text-[9px] font-mono text-slate-500 mt-0.5">
                          VOLATILIDAD: {(asset.volatility * 100).toFixed(2)}%
                        </div>
                        {wallet.status === "active" && (
                          <div className="text-[8px] font-sans font-extrabold text-cyan-400 tracking-wider mt-1 flex items-center gap-1">
                            <BrainCircuit className="w-3 h-3 text-cyan-400 shrink-0" />
                            5 AGENTES DE CONSENSO
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end">
                        {/* Status indicators */}
                        {wallet.status === "active" ? (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            IA TRADING
                          </span>
                        ) : wallet.status === "waiting_loan" ? (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/20">
                            ESPERANDO PRÉSTAMO
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-500 font-mono uppercase">
                            {wallet.type === "stock" 
                              ? "ACCION BLOQUEADA" 
                              : wallet.type === "etf" 
                              ? "ETF BLOQUEADO" 
                              : wallet.type === "crypto" 
                              ? "CRIPTO BLOQUEADA" 
                              : "MATERIA PRIMA BLOQUEADA"}
                          </span>
                        )}
                      </div>
                    </div>
 
                    {/* Locked View Overlays */}
                    {wallet.status !== "active" && (
                      <div className="my-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-900 flex flex-col justify-center items-center text-center">
                        {wallet.status === "waiting_loan" ? (
                          <>
                            <AlertTriangle className="w-5 h-5 text-amber-400 mb-1" />
                            <p className="text-xs font-bold text-amber-300">Falta Fondear por Inteligencia Cruzada</p>
                            <p className="text-[10px] text-slate-400 mt-1">
                              Se activará de manera robotizada cuando la divisa anterior acumule <span className="text-amber-400 font-bold">$20.000 CLP</span> de ganancia neta.
                            </p>
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5 text-slate-500 mb-1 animate-pulse" />
                            <p className="text-xs font-bold text-slate-400">
                              {wallet.type === "stock" 
                                ? "Capa de Bolsa Desconectada" 
                                : wallet.type === "etf" 
                                ? "Fondo Indexado Desconectado" 
                                : wallet.type === "crypto" 
                                ? "Red de Criptomonedas Inactiva" 
                                : "Mercado de Metales y Energía Desconectado"}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-1">
                              {wallet.type === "stock" 
                                ? "Termine de desbloquear todas las divisas Forex previas para habilitar la compra-venta veloz de Acciones de Wall Street."
                                : wallet.type === "etf" 
                                ? "Termine de desbloquear todas las divisas Forex previas para habilitar el algoritmo de cobertura en ETFs Globales."
                                : wallet.type === "crypto" 
                                ? "Termine de desbloquear todas las divisas Forex previas para activar los nodos descentralizados de arbitraje criptográfico."
                                : "Termine de desbloquear todas las divisas Forex previas para sincronizar las señales de commodities y materiales globales (Cobre, Litio, etc.)."}
                            </p>
                          </>
                        )}
                      </div>
                    )}

                    {/* Active dynamic content inside card */}
                    {wallet.status === "active" && (
                      <div className="space-y-3.5">
                        {/* Price ticker & dynamic change stats */}
                        <div className="flex justify-between items-center bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/40">
                          <div>
                            <div className="text-[9px] text-slate-500 font-mono">VALOR UNITARIO</div>
                            <div className="text-base font-extrabold text-white font-mono">
                              CLP ${asset.currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </div>
                          </div>

                          <div className={`text-right p-1.5 rounded-lg flex items-center gap-1 font-mono text-xs font-bold ${
                            isUp ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"
                          }`}>
                            {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                            <span>{(isUp ? "+" : "")}{(asset.volatility * (isUp ? 83 : -72)).toFixed(2)}%</span>
                          </div>
                        </div>

                        {/* Chart Sparkline */}
                        <AssetChart history={asset.priceHistory} color={isUp ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)"} />

                        {/* Portfolio Stats on Wallet: Investment and accrued profit */}
                        <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-2 rounded-xl border border-slate-800/20 text-xs">
                          <div>
                            <span className="text-slate-500 block text-[9px] font-mono">FONDO INVERTIDO IA:</span>
                            <span className="text-white font-extrabold">CLP ${wallet.investedAmount.toLocaleString()}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-500 block text-[9px] font-mono">GANANCIA GENERADA:</span>
                            <span className={`font-black ${wallet.gains >= 0 ? "text-emerald-400" : "text-red-450"}`}>
                              {wallet.gains >= 0 ? "+" : ""} CLP ${wallet.gains.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                            </span>
                          </div>
                        </div>

                        {/* Hito Préstamo progress indicator bar */}
                        <div className="border border-slate-800 bg-slate-950 p-2 rounded-xl">
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                            <span>{loansFrozen ? "Auto-Apalancamiento de Capital" : "Siguiente préstamo cruzado"}</span>
                            <span className="text-emerald-400 font-bold">
                              {Math.min(100, Math.round((wallet.gains / currentTarget) * 100))}%
                            </span>
                          </div>
                          
                          {/* Bar */}
                          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                              style={{ width: `${Math.min(100, Math.max(0, (wallet.gains / currentTarget) * 100))}%` }}
                            />
                          </div>

                          <div className="flex justify-between text-[9px] text-slate-500 font-mono mt-1">
                            <span>{loansFrozen ? "Retiro compuesto" : "Monto de préstamo"}</span>
                            <span>Target: CLP ${currentTarget.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Cognitive metrics: SPEED - DEFENSED - LEARNING LEVEL */}
                        <div className="space-y-1.5 p-2 rounded-lg bg-slate-950/20 border border-slate-800/40">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Zap className="w-3 h-3 text-cyan-400" />
                              Velocidad de Decisión:
                            </span>
                            <span className="text-white font-mono font-bold">{wallet.accumulatedLearningMs} ms</span>
                          </div>

                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-400 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              Eficiencia de Riesgo:
                            </span>
                            <span className="text-emerald-400 font-bold font-mono">{wallet.riskConfig.diversificationScore}% (Óptimo)</span>
                          </div>

                          {/* Quick manual triggers and info */}
                          <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center">
                            <button
                              onClick={() => triggerManualAILearning(wallet.assetId)}
                              className="px-2 py-1 text-[9px] font-bold rounded bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/20 transition-all font-mono uppercase"
                            >
                              Acelerar Aprendizaje
                            </button>

                            <button
                              onClick={() => setSelectedWalletForDetail(wallet)}
                              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                              title="Detalles neuronales cruzados"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Interactive Risk Slider Management */}
                        <div className="bg-slate-950 p-2 rounded-xl text-xs space-y-1">
                          <span className="text-[10px] text-slate-400 font-mono block">GESTIÓN DE RIESGO COGNITIVA:</span>
                          <div className="flex items-center justify-between gap-1">
                            {["Bajo", "Moderado", "Alto", "Turbo Millonario"].map(riskOpt => (
                              <button
                                key={riskOpt}
                                type="button"
                                onClick={() => handleUpdateRisk(wallet.assetId, riskOpt as any)}
                                className={`px-1.5 py-1 text-[9px] font-bold rounded transition-all flex-1 ${
                                  wallet.riskConfig.riskLevel === riskOpt
                                    ? "bg-emerald-500 text-slate-950"
                                    : "bg-slate-900 text-slate-400 hover:bg-slate-850"
                                }`}
                              >
                                {riskOpt}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-[8px] text-slate-500 font-mono pt-1">
                            <span>StopLoss: -{wallet.riskConfig.stopLossPercent}%</span>
                            <span>TakeProfit: +{wallet.riskConfig.takeProfitPercent}%</span>
                          </div>
                        </div>

                        {/* Direct Capital Controls (Aumento de capital & Retiro manual) */}
                        <div className="bg-slate-950 p-2.5 rounded-xl text-xs space-y-3.5 border border-slate-900/60">
                          <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                            <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">
                              Consola de Capital Compartido
                            </span>
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/20 font-mono font-bold">
                              ONLINE
                            </span>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-4">
                            {/* Section: Aumento capital */}
                            <div className="flex-1 space-y-2">
                              <span className="text-[9px] text-slate-400 font-mono font-bold block">
                                INYECTAR CAPITAL (CLP)
                              </span>
                              
                              {/* Quick presets */}
                              <div className="grid grid-cols-3 gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleIncreaseCapital(wallet.assetId, 10000)}
                                  className="px-1 py-1 text-[9px] font-bold rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-800/30 transition-all font-mono"
                                >
                                  +$10k
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleIncreaseCapital(wallet.assetId, 50000)}
                                  className="px-1 py-1 text-[9px] font-bold rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-800/30 transition-all font-mono"
                                >
                                  +$50k
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const value = Math.max(0, balance.unallocatedCash);
                                    if (value > 0) {
                                      handleIncreaseCapital(wallet.assetId, value);
                                    }
                                  }}
                                  disabled={balance.unallocatedCash <= 0}
                                  className="px-1 py-1 text-[9px] font-bold rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-850/40 transition-all font-mono disabled:opacity-40"
                                  title="Inyectar toda la caja disponible"
                                >
                                  MAX
                                </button>
                              </div>

                              {/* Custom input */}
                              <div className="flex gap-1">
                                <input
                                  type="number"
                                  placeholder="Monto"
                                  value={walletCustomInputs[wallet.assetId]?.deposit || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setWalletCustomInputs(prev => ({
                                      ...prev,
                                      [wallet.assetId]: {
                                        deposit: val,
                                        withdraw: prev[wallet.assetId]?.withdraw || ""
                                      }
                                    }));
                                  }}
                                  className="bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[10px] w-full font-mono focus:border-cyan-500 focus:outline-none text-white text-center"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const amt = parseInt(walletCustomInputs[wallet.assetId]?.deposit || "0", 10);
                                    if (amt > 0) {
                                      handleIncreaseCapital(wallet.assetId, amt);
                                      setWalletCustomInputs(prev => ({
                                        ...prev,
                                        [wallet.assetId]: {
                                          deposit: "",
                                          withdraw: prev[wallet.assetId]?.withdraw || ""
                                        }
                                      }));
                                    }
                                  }}
                                  className="px-2 py-1 text-[10px] font-bold rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all font-mono"
                                >
                                  INYECTAR
                                </button>
                              </div>
                            </div>

                            {/* Section: Retirar ganancias */}
                            <div className="flex-1 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] text-slate-400 font-mono font-bold block">
                                  RETIRAR RENTABILIDAD
                                </span>
                                <span className="text-[9px] text-emerald-400 font-mono font-bold">
                                  CLP ${Math.round(wallet.gains).toLocaleString()}
                                </span>
                              </div>

                              {/* Withdrawal type input */}
                              <div className="grid grid-cols-2 gap-1">
                                <button
                                  type="button"
                                  disabled={wallet.gains <= 0}
                                  onClick={() => handleWithdrawWalletGains(wallet.assetId)}
                                  className="py-1 px-1.5 text-[9px] font-bold rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/30 transition-all font-mono disabled:opacity-40 text-center"
                                >
                                  MÁXIMO
                                </button>
                                <button
                                  type="button"
                                  disabled={wallet.gains < 10000}
                                  onClick={() => handleWithdrawWalletCustomGains(wallet.assetId, 10000)}
                                  className="py-1 px-1.5 text-[9px] font-bold rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/30 transition-all font-mono disabled:opacity-40 text-center"
                                >
                                  -$10k
                                </button>
                              </div>

                              {/* Custom partial withdraw */}
                              <div className="flex gap-1">
                                <input
                                  type="number"
                                  placeholder="Monto"
                                  value={walletCustomInputs[wallet.assetId]?.withdraw || ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setWalletCustomInputs(prev => ({
                                      ...prev,
                                      [wallet.assetId]: {
                                        deposit: prev[wallet.assetId]?.deposit || "",
                                        withdraw: val
                                      }
                                    }));
                                  }}
                                  className="bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[10px] w-full font-mono focus:border-emerald-500 focus:outline-none text-white text-center"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const amt = parseInt(walletCustomInputs[wallet.assetId]?.withdraw || "0", 10);
                                    if (amt > 0 && amt <= wallet.gains) {
                                      handleWithdrawWalletCustomGains(wallet.assetId, amt);
                                      setWalletCustomInputs(prev => ({
                                        ...prev,
                                        [wallet.assetId]: {
                                          deposit: prev[wallet.assetId]?.deposit || "",
                                          withdraw: ""
                                        }
                                      }));
                                    }
                                  }}
                                  disabled={!walletCustomInputs[wallet.assetId]?.withdraw || parseInt(walletCustomInputs[wallet.assetId]?.withdraw, 10) <= 0 || parseInt(walletCustomInputs[wallet.assetId]?.withdraw, 10) > wallet.gains}
                                  className="px-2 py-1 text-[10px] font-bold rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all font-mono disabled:bg-slate-900 disabled:text-slate-600 disabled:cursor-not-allowed"
                                >
                                  RETIRAR
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* IA Log Line */}
                        <div className="text-[10px] text-slate-300 font-mono italic flex items-start gap-1 p-1 bg-slate-950 rounded border-l-2 border-cyan-400">
                          <span className="text-cyan-400 shrink-0 font-bold">🧠 IA:</span>
                          <span className="truncate">{wallet.lastDecision}</span>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
          </div>

        </div>

        {/* Right Column: Dynamic System Console, logs & fast facts (4 columns grid) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Real-time multi-threaded IA terminal list */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-[400px]">
            <div className="flex justify-between items-center pb-3 border-b border-indigo-950 mb-3">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold text-white tracking-widest uppercase">CONSOLA MULTI-NÚCLEO IA</h3>
              </div>
              <span className="text-[9px] font-mono bg-slate-800 text-slate-400 rounded px-1.5 py-0.5">SPEED TACT</span>
            </div>

            {/* Simulated log viewer auto scrolling */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-[11px] font-mono scrollbar-thin">
              {logs.map((log) => {
                let badgeColor = "bg-slate-800 text-slate-300";
                let textClass = "text-slate-300";

                if (log.type === "trade") {
                  badgeColor = "bg-emerald-500/10 text-emerald-400";
                  textClass = "text-emerald-200/90";
                } else if (log.type === "learning") {
                  badgeColor = "bg-cyan-500/10 text-cyan-400";
                  textClass = "text-cyan-200/90";
                } else if (log.type === "loan") {
                  badgeColor = "bg-indigo-500/15 text-indigo-400";
                  textClass = "text-slate-100 font-bold";
                } else if (log.type === "deposit") {
                  badgeColor = "bg-amber-500/15 text-amber-400";
                  textClass = "text-slate-100";
                }

                return (
                  <div key={log.id} className="p-2 rounded bg-slate-950/60 border border-slate-800/40 flex flex-col gap-1 text-left">
                    <div className="flex justify-between items-center">
                      <span className={`text-[8.5px] font-bold px-1 py-0.5 rounded ${badgeColor}`}>
                        {log.source.toUpperCase()}
                      </span>
                      <span className="text-[8.5px] text-slate-500">{log.timestamp}</span>
                    </div>
                    <p className={`leading-relaxed text-xs ${textClass}`}>{log.message}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-indigo-950/40 text-[9px] text-slate-500 text-center font-mono">
              Comandos de encriptación y aprendizaje asincrónico activo.
            </div>
          </div>

          {/* Core concept and instructions explanation cards */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 text-left font-sans">
            {/* Holographic AI Brain illustration */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80 aspect-[16/9] flex items-center justify-center">
              <img
                src={neuralTradingLogo}
                alt="AI Neural Trading Network"
                className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-widest uppercase">CONECTORES NEURONALES ACTIVOS</span>
              </div>
            </div>

            <h3 className="text-xs font-black text-white tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              SISTEMA DE GESTIÓN DE RIESGO DE ALTA FIABILIDAD
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Cada divisa opera con un microcontrolador que aprende en milésimas de segundo del broker en línea. Cuando alimentás fondos desde tu <strong>Depósito Real</strong>, las IAs distribuyen las posiciones de manera inteligente.
            </p>

            {/* Quick explanation checklist */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex gap-2 items-start text-[11px] text-slate-300">
                <span className="h-4 w-4 bg-emerald-500/10 text-emerald-400 rounded flex justify-center items-center font-bold shrink-0 text-[10px]">1</span>
                <span>USD/CLP empieza invertido con CLP $25,000 para forjar rendimientos inmediatos de mercado.</span>
              </div>
              <div className="flex gap-2 items-start text-[11px] text-slate-300">
                <span className="h-4 w-4 bg-emerald-500/10 text-emerald-400 rounded flex justify-center items-center font-bold shrink-0 text-[10px]">2</span>
                <span>Al acumular CLP $20,000 de ganancia neta, la IA le presta a la siguiente divisa (EUR/CLP), la cual desbloquea su cartera.</span>
              </div>
              <div className="flex gap-2 items-start text-[11px] text-slate-300">
                <span className="h-4 w-4 bg-emerald-500/10 text-emerald-400 rounded flex justify-center items-center font-bold shrink-0 text-[10px]">3</span>
                <span>Cada vez que se activa el préstamo a la otra divisa, la meta de ganancias se incrementa al doble ($40K, $80K, etc.) para acelerar el interés compuesto exponencial.</span>
              </div>
              <div className="flex gap-2 items-start text-[11px] text-slate-300">
                <span className="h-4 w-4 bg-emerald-500/10 text-emerald-400 rounded flex justify-center items-center font-bold shrink-0 text-[10px]">4</span>
                <span>Al copar todas las divisas Forex, se despliegan las unidades cuánticas en la Bolsa de Wall Street (acciones como NVIDIA, Tesla).</span>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl text-[10px] text-emerald-300 border border-emerald-900/30 flex items-start gap-1">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Para simular depósitos inmediatos de MercadoPago u otras billeteras virtuales, seleccioná <strong>EFECTUAR DEPÓSITO REAL</strong> arriba.
              </span>
            </div>
          </div>

        </div>

      </main>

      {/* Footer copyright and safety warning */}
      <footer className="bg-slate-950 border-t border-slate-905 px-4 py-4 text-center text-xs text-slate-500 space-y-1">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© 2026 Algoritmo Cerebro Trading Inc. - Potenciado por Intel Networks</span>
          
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Encriptado Bancario 256-Bit</span>
          </div>
        </div>
      </footer>

      {/* Integrations Modals */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        onDepositSuccess={handleDepositSuccess}
      />

      <AIExplanationModal
        wallet={selectedWalletForDetail}
        onClose={() => setSelectedWalletForDetail(null)}
      />

    </div>
  );
}
