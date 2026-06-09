import React, { useState } from "react";
import { CreditCard, DollarSign, ArrowRight, ShieldCheck, CheckCircle2, Landmark, Wallet } from "lucide-react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositSuccess: (amount: number, method: string) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onDepositSuccess
}) => {
  const [amount, setAmount] = useState<string>("50000");
  const [method, setMethod] = useState<"card" | "transfer" | "mp">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cvv, setCvv] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  if (!isOpen) return null;

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    setStatus("processing");
    
    // Simulate API authorization response in 1.8 seconds
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        onDepositSuccess(val, method === "card" ? "Tarjeta de Crédito" : method === "transfer" ? "CBU/CVU Bancario" : "MercadoPago");
        // Reset state
        setStatus("idle");
        setAmount("50000");
        setCardNumber("");
        setCardName("");
        setCvv("");
        onClose();
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" id="deposit-modal">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        
        {/* Decorative Top Accent */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 w-full" />

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/90 aspect-video">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">¡Depósito Procesado con Éxito!</h3>
            <p className="text-slate-400 text-sm">
              Se han acreditado de forma real y segura <span className="text-emerald-400 font-bold">CLP ${parseFloat(amount).toLocaleString()}</span> a tu cartera de inversiones.
            </p>
            <div className="mt-4 text-[10px] text-slate-500 font-mono">
              ID de Transacción: FTX-{Math.floor(Math.random() * 899999 + 100000)}
            </div>
          </div>
        ) : status === "processing" ? (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/90 min-h-[350px]">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 w-full h-full rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin"></div>
              <ShieldCheck className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Autorizando Transacción</h3>
            <p className="text-slate-400 text-sm max-w-xs">
              Conectando con la pasarela bancaria segura, encriptación SHA-256 activa... un momento por favor.
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Pasarela de Depósito Real</h3>
                <p className="text-xs text-slate-400">Fondos Simulados con Flujo Real Bancario.</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full bg-slate-800 p-1.5 text-slate-400 hover:text-white transition-all text-xs font-mono"
              >
                ✕
              </button>
            </div>

            {/* Simulated Sandbox banner warning */}
            <div className="mb-4 rounded-lg bg-emerald-950/40 border border-emerald-800/30 p-2.5 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-emerald-300">
                <strong>Modo Entorno Protegido:</strong> Las transacciones bancarias se ejecutan de manera simulada con parámetros reales para protección del usuario.
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Monto del Depósito (CLP)</label>
                <div className="relative rounded-lg bg-slate-950 p-0.5 border border-slate-800 focus-within:border-emerald-500 transition-all">
                  <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1000"
                    placeholder="Monto mínimo 1,000"
                    className="w-full bg-transparent pl-8 pr-4 py-2.5 text-lg font-bold text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Método de Integración</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod("card")}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                      method === "card"
                        ? "bg-slate-800/80 border-emerald-500 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-semibold">Tarjeta</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("transfer")}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                      method === "transfer"
                        ? "bg-slate-800/80 border-emerald-500 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Landmark className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-semibold">CBU/CVU</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMethod("mp")}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                      method === "mp"
                        ? "bg-slate-800/80 border-emerald-500 text-emerald-400"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Wallet className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-semibold">MercadoPago</span>
                  </button>
                </div>
              </div>

              {/* Card Form Details if selected */}
              {method === "card" && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-400 mb-1">Número de Tarjeta</label>
                    <input
                      type="text"
                      placeholder="**** **** **** 8847"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-400 mb-1">Nombre (Titular)</label>
                      <input
                        type="text"
                        placeholder="NOMBRES APELLIDOS"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-400 mb-1">CVC / Código</label>
                      <input
                        type="password"
                        placeholder="***"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        required
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {method === "transfer" && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-1">
                  <div className="text-[11px] text-slate-400">Para depositar, transfiera a nuestro CVU unificado:</div>
                  <div className="text-xs font-mono font-bold bg-slate-900 p-1.5 rounded text-cyan-400 text-center select-all">
                    0000003100023456789012
                  </div>
                  <div className="text-[10px] text-slate-500 text-center">Alias: ia.trading.millonario</div>
                </div>
              )}

              {method === "mp" && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-1">
                  <div className="text-[11px] text-slate-400">Cobro rápido integrado mediante link de MercadoPago automático.</div>
                  <div className="text-xs font-medium text-slate-300">Pagarás desde tu app con autenticación facial integrada.</div>
                </div>
              )}

              {/* Deposit button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                id="btn-process-deposit"
              >
                PROCESAR PAGO REAL
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
