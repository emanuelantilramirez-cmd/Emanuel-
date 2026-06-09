import React from "react";
import { BrainCircuit, ShieldCheck, HeartHandshake, Zap, Cpu, CheckCircle2, UserCheck } from "lucide-react";
import { AIWallet } from "../types";

interface AIExplanationModalProps {
  wallet: AIWallet | null;
  onClose: () => void;
}

export const AIExplanationModal: React.FC<AIExplanationModalProps> = ({
  wallet,
  onClose
}) => {
  if (!wallet) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in" id="ai-concept-modal">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 w-full shrink-0" />
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 shrink-0 flex justify-between items-center bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <BrainCircuit className="w-6 h-6 text-cyan-400 animate-pulse" />
            <div>
              <h3 className="text-base font-black text-white leading-tight">Consorcio Multimodal de Decisiones IA: {wallet.assetCode}</h3>
              <p className="text-xs text-slate-400">Cinco (5) agentes especializados cooperando para optimizar esta cartera</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-white transition-all text-xs font-mono"
          >
            ✕
          </button>
        </div>

        {/* Content - Scrollable if needed */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 bg-slate-900/50">
          
          {/* Left Column: General stats and rules (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Sistemas de Flujo Autónomo
            </h4>

            {/* AI Bio */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                La cartera de <strong>{wallet.assetName} ({wallet.assetCode})</strong> está liderada por un comité heurístico continuo. En lugar de un solo modelo rudimentario, cinco agentes con redes neuronales independientes filtran señales de pips y ejecutan arbitraje de alta fidelidad.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Velocidad:</span>
                  <span className="text-cyan-400 font-bold">{wallet.accumulatedLearningMs} ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nivel de Red:</span>
                  <span className="text-emerald-400 font-bold">{wallet.learningLevelPercent}%</span>
                </div>
              </div>
            </div>

            {/* Interactive Rules */}
            <div className="space-y-2.5 font-sans">
              <div className="flex gap-2.5 bg-slate-950/20 p-2.5 rounded-xl border border-slate-800/40">
                <div className="p-2 h-fit rounded-lg bg-emerald-950/40 text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Riesgo Dinámico</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                    Ajuste continuo de Stop-Loss a {wallet.riskConfig.stopLossPercent}% y Take-Profit a {wallet.riskConfig.takeProfitPercent}%.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 bg-slate-950/20 p-2.5 rounded-xl border border-slate-800/40">
                <div className="p-2 h-fit rounded-lg bg-cyan-950/40 text-cyan-400 shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Regla de Préstamo (20K CLP)</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                    Al generar {wallet.targetGainsForNextLoan.toLocaleString()} CLP limpios, apoya con capital para abrir e iniciar la siguiente divisa.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 bg-slate-950/20 p-2.5 rounded-xl border border-slate-800/40">
                <div className="p-2 h-fit rounded-lg bg-amber-950/40 text-amber-400 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Wall Street Hub</h5>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                    La compleción de divisas migra todo el poder neuronal de inmediato a la Bolsa de New York de alta velocidad.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: The 5 Agents of the Wallet (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Los 5 Modelos en Acción
              </h4>
              <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10 uppercase font-black animate-pulse">
                Modo Colectivo Activo
              </span>
            </div>

            <div className="space-y-2.5">
              {(wallet.agents || []).map((agent, index) => {
                let voteColor = "bg-slate-800 text-slate-400";
                if (agent.vote === "COMPRE") {
                  voteColor = "bg-emerald-500 text-slate-950 font-black";
                } else if (agent.vote === "VENDA") {
                  voteColor = "bg-rose-500 text-slate-950 font-black";
                }

                return (
                  <div 
                    key={agent.name}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700/60 transition-all font-mono space-y-1.5 flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="h-4.5 w-4.5 bg-slate-900 rounded border border-slate-800 text-[10px] flex items-center justify-center font-bold text-cyan-400">
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-white">{agent.name}</span>
                        </div>
                        <p className="text-[9.5px] text-slate-400 mt-0.5 font-sans leading-tight">
                          {agent.role}
                        </p>
                      </div>

                      {/* Vote pill */}
                      <span className={`text-[8.5px] px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${voteColor}`}>
                        {agent.vote}
                      </span>
                    </div>

                    {/* Progress bars inside agent */}
                    <div className="grid grid-cols-2 gap-3 pt-1.5 border-t border-slate-900/60 text-[9px]">
                      <div>
                        <div className="flex justify-between text-[8px] text-slate-500 mb-0.5">
                          <span>CONFIANZA DEL SEÑAL</span>
                          <span className="text-cyan-400 font-bold">{agent.confidence}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${agent.confidence}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[8px] text-slate-500 mb-0.5">
                          <span>EFECTIVIDAD NEURONAL</span>
                          <span className="text-emerald-400 font-bold">{agent.contributionRating}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${agent.contributionRating}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer / Info */}
        <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-950/70 text-center font-mono text-[9px] text-slate-400 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Cinco cerebros cuánticos mitigando pérdidas y asegurando la mejor decisión en tiempo real.</span>
        </div>
      </div>
    </div>
  );
};
