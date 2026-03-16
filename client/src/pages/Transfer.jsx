import React, { useState } from "react";
import { 
  ArrowRight, 
  Search, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  ArrowLeft,
  Menu,
  Clock
} from "lucide-react";

const Transfer = ({ onMenuClick }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipientName: "",
    accountNumber: "",
    bankName: "",
    amount: "",
    note: ""
  });

  const recentPayees = [
    { id: 1, name: "Sarah Jenkins", bank: "Chase Bank", img: "https://i.pravatar.cc/150?img=32" },
    { id: 2, name: "David Chen", bank: "Wells Fargo", img: "https://i.pravatar.cc/150?img=33" },
    { id: 3, name: "Emily Rodriguez", bank: "HSBC", img: "https://i.pravatar.cc/150?img=44" },
    { id: 4, name: "Michael Brown", bank: "Citibank", img: "https://i.pravatar.cc/150?img=12" },
  ];

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const renderStepIcon = (stepNum) => {
    if (step > stepNum) return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    return (
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold
        ${step === stepNum ? "border-blue-500 text-blue-500" : "border-gray-400 text-gray-400"}`}>
        {stepNum}
      </div>
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-50 dark:bg-[#0c0f1a]">
      {/* Recently Paid Sidebar - Hidden on mobile, shown on md+ */}
      <div className="hidden lg:flex w-72 flex-col border-r border-gray-200 dark:border-white/5 p-6 bg-white dark:bg-[#0f1221]">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
           Recently Paid
        </h3>
        <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide">
          {recentPayees.map((payee) => (
            <button 
              key={payee.id}
              onClick={() => setFormData({ ...formData, recipientName: payee.name, bankName: payee.bank })}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group text-left"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-colors">
                <img src={payee.img} alt={payee.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{payee.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{payee.bank}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/5">
            <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                <Clock className="w-4 h-4" />
                View all History
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={onMenuClick}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#151828] border border-gray-200 dark:border-[#232738] text-gray-600 dark:text-gray-300 shadow-sm"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Bank-to-Bank Transfer
              </h2>
            </div>
            
            <div className="hidden sm:flex items-center gap-6 bg-white dark:bg-[#151828] p-2 px-4 rounded-2xl border border-gray-200 dark:border-[#232738] shadow-sm">
                <div className="flex items-center gap-2">
                    {renderStepIcon(1)}
                    <span className={`text-xs font-medium ${step >= 1 ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>Details</span>
                </div>
                <ArrowRight className="w-3 h-3 text-gray-300" />
                <div className="flex items-center gap-2">
                    {renderStepIcon(2)}
                    <span className={`text-xs font-medium ${step >= 2 ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>Review</span>
                </div>
                <ArrowRight className="w-3 h-3 text-gray-300" />
                <div className="flex items-center gap-2">
                    {renderStepIcon(3)}
                    <span className={`text-xs font-medium ${step >= 3 ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>Confirmation</span>
                </div>
            </div>
          </div>

          {/* Stepper Logic */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From Account Card */}
                <div className="glass-card rounded-3xl border p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">From Account</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Quantum Platinum Card</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Main Account • **** 4521</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-white/5">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Available Balance</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">$14,890.50</p>
                  </div>
                </div>

                {/* To Account Form */}
                <div className="bg-white dark:bg-[#0c0f1a] rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider">Recipient Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 px-1">Recipient Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. Jane Alistair"
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        value={formData.recipientName}
                        onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                      />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 px-1">IBAN / Account Number</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Building2 className="w-4 h-4" />
                            </span>
                            <input 
                                type="text"
                                placeholder="GB 29 NWBK 6018..."
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
                                value={formData.accountNumber}
                                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                            />
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount and Note */}
              <div className="bg-white dark:bg-[#0c0f1a] rounded-3xl border border-gray-200 dark:border-white/5 p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white block mb-3">Amount to Transfer</label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">$</span>
                            <input 
                                type="text"
                                placeholder="0.00"
                                className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-blue-500/50 rounded-2xl pl-12 pr-6 py-5 text-4xl font-bold text-gray-900 dark:text-white transition-all placeholder:text-gray-200 dark:placeholder:text-white/5"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            />
                        </div>
                        <p className="mt-3 text-xs text-gray-500 flex items-center gap-2 px-1">
                            Daily Limit: <span className="font-semibold text-gray-900 dark:text-white">$25,000.00</span>
                        </p>
                    </div>
                    <div className="flex flex-col justify-end">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1.5 px-1">Note / Reference (Optional)</label>
                        <textarea 
                            rows="2"
                            placeholder="e.g. Rent Payment"
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        ></textarea>
                    </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                  <button 
                    disabled={!formData.amount || !formData.accountNumber}
                    onClick={handleNext}
                    className="flex items-center gap-2 px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold shadow-xl shadow-blue-500/20 transition-all transform hover:translate-y-[-2px] active:scale-[0.98]"
                  >
                      Review Transfer
                      <ArrowRight className="w-5 h-5" />
                  </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
               <div className="bg-white dark:bg-[#0f1221] rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-xl">
                    <div className="p-8 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                        <h3 className="text-center text-lg font-bold text-gray-900 dark:text-white mb-1">Confirm Transaction</h3>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">Please review the details below before confirming</p>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="flex flex-col items-center mb-8">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-1">Sending</p>
                            <h2 className="text-5xl font-black text-blue-600 dark:text-blue-400">${formData.amount}</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-transparent">
                                <span className="text-sm text-gray-500">Recipient</span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{formData.recipientName}</span>
                            </div>
                            <div className="flex justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-transparent">
                                <span className="text-sm text-gray-500">Bank / IBAN</span>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formData.accountNumber}</p>
                                    <p className="text-xs text-gray-500">{formData.bankName}</p>
                                </div>
                            </div>
                            <div className="flex justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-transparent">
                                <span className="text-sm text-gray-500">Reference</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white italic">"{formData.note || "No note added"}"</span>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button 
                                onClick={handleBack}
                                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-gray-200 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all font-bold"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Edit
                            </button>
                            <button 
                                onClick={handleNext}
                                className="flex-[2] flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xl shadow-emerald-500/20 transition-all transform hover:translate-y-[-2px]"
                            >
                                Confirm & Send
                                <CheckCircle2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
               </div>
               <p className="text-center text-xs text-gray-400 px-8">
                 By confirming this transaction, you agree to NeuroBank's <span className="underline cursor-pointer">Terms of Service</span>. Funds will be deducted immediately.
               </p>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-md mx-auto py-12 text-center animate-in zoom-in-95 fade-in duration-700">
                <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/30">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Transfer Successful!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 px-6">Your payment of <span className="font-bold text-emerald-600">${formData.amount}</span> to {formData.recipientName} has been processed successfully.</p>
                
                <div className="bg-white dark:bg-[#0c0f1a] rounded-3xl border border-dashed border-gray-300 dark:border-white/10 p-6 mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-xs text-gray-400 uppercase tracking-widest">Transaction ID</span>
                        <span className="text-xs font-mono text-gray-900 dark:text-white">TXN-8829-1029-4822</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs text-gray-400 uppercase tracking-widest">Estimated Arrival</span>
                        <span className="text-xs font-bold text-emerald-500">Instant</span>
                    </div>
                </div>

                <div className="space-y-4 px-8">
                    <button 
                        onClick={() => { setStep(1); setFormData({ recipientName: "", accountNumber: "", bankName: "", amount: "", note: "" }); }}
                        className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all"
                    >
                        Make Another Transfer
                    </button>
                    <button className="w-full py-4 rounded-2xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                        Download Receipt (PDF)
                    </button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transfer;
