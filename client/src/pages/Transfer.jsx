import React, { useState } from "react";
import {
  ArrowRight,
  Search,
  CreditCard,
  Building2,
  CheckCircle2,
  ArrowLeft,
  Menu,
  Clock,
  Loader2,
  AlertCircle,
  TrendingUp,
  History,
  User,
} from "lucide-react";
import { useGetAccountQuery } from "../services/account.api";
import {
  useCreateTransitionMutation,
  useGetHistoryQuery,
} from "../services/transition.api";

const Transfer = ({ onMenuClick }) => {
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    recipientName: "",
    accountNumber: "",
    bankName: "",
    amount: "",
    note: "",
  });

  const { data: accountData, isLoading: isAccountLoading } =
    useGetAccountQuery();
  const accountId = accountData?.account?._id;

  const { data: historyData } = useGetHistoryQuery(accountId, {
    skip: !accountId,
  });

  const [
    createTransition,
    { isLoading: isTransitioning, data: transitionResponse },
  ] = useCreateTransitionMutation();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => {
    setErrorMsg("");
    setStep(step - 1);
  };

  const handleConfirmTransfer = async () => {
    setErrorMsg("");
    if (!accountId) {
      setErrorMsg("Your account details are not loaded. Please refresh.");
      return;
    }

    try {
      const result = await createTransition({
        fromAccount: accountId,
        toAccount: formData.accountNumber,
        amount: Number(formData.amount),
        idempotencyKey: crypto.randomUUID(),
      }).unwrap();

      if (result) {
        setStep(3);
      }
    } catch (err) {
      setErrorMsg(
        err?.data?.message || "Something went wrong. Please try again.",
      );
    }
  };

  // Derive recent payees from history (accounts we sent money TO)
  const recentPayees =
    historyData?.transitions
      ?.filter((t) => t.fromAccount?._id === accountId)
      ?.reduce((acc, current) => {
        const exists = acc.find(
          (p) => p.accountNumber === current.toAccount?.accountNumber,
        );
        if (!exists && current.toAccount) {
          acc.push({
            id: current._id,
            accountNumber: current.toAccount.accountNumber,
            label: `Account ...${current.toAccount.accountNumber.slice(-4)}`,
          });
        }
        return acc;
      }, [])
      ?.slice(0, 5) || [];

  const renderStepIcon = (stepNum) => {
    if (step > stepNum)
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    return (
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold
        ${step === stepNum ? "border-blue-500 text-blue-500" : "border-gray-400 text-gray-400"}`}
      >
        {stepNum}
      </div>
    );
  };

  if (isAccountLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-[#0c0f1a]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const account = accountData?.account;

  return (
    <div className="flex-1 flex overflow-hidden bg-white dark:bg-[#0a0c14]">
      {/* Sidebar - Recent Activity/Payees */}
      <div className="hidden lg:flex w-80 flex-col border-r border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-[#0c0f1a]/50 backdrop-blur-xl p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <History className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Recent Payees
          </h3>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto scrollbar-hide">
          {recentPayees.length > 0 ? (
            recentPayees.map((payee) => (
              <button
                key={payee.id}
                onClick={() =>
                  setFormData({
                    ...formData,
                    recipientName: "Recent Recipient",
                    accountNumber: payee.accountNumber,
                  })
                }
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-gray-100 dark:border-white/5 transition-all group hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {payee.label}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                    Saved Contact
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
              <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                No recent users yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Your future transfers will appear here
              </p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/20">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5" />
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                Security Tip
              </p>
            </div>
            <p className="text-xs leading-relaxed font-medium opacity-90">
              Always double-check the Recipient ID before confirming your
              transfer.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={onMenuClick}
                  className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#151828] border border-gray-200 dark:border-[#232738]"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-wider">
                  Transfer Money
                </div>
              </div>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Bank Transfer
              </h2>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-2 rounded-2xl border border-gray-100 dark:border-white/5">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2 px-3 py-1">
                  {renderStepIcon(s)}
                  <span
                    className={`text-xs font-bold ${step >= s ? "text-gray-900 dark:text-white" : "text-gray-400"}`}
                  >
                    {s === 1 ? "Details" : s === 2 ? "Review" : "Done"}
                  </span>
                  {s < 3 && <ArrowRight className="w-3 h-3 text-gray-300" />}
                </div>
              ))}
            </div>
          </div>

          {/* Transfer Logic */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Source Account Card */}
                <div className="relative group perspective-1000">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative bg-white dark:bg-[#0c0f1a] rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-8 overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

                    <div className="flex items-center justify-between mb-8">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                        Source Account
                      </span>
                      <CreditCard className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="space-y-1 mb-8">
                      <p className="text-2xl font-black text-gray-900 dark:text-white">
                        {account?.accountType === "saving"
                          ? "Savings"
                          : "Current"}{" "}
                        Account
                      </p>
                      <p className="text-sm font-medium text-gray-400">
                        {account?.accountNumber
                          ? `**** ${account.accountNumber.slice(-4)}`
                          : "Loading..."}
                      </p>
                    </div>

                    <div className="pt-8 border-t border-gray-100 dark:border-white/5">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Available Funds
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-gray-900 dark:text-white">
                          {account?.currency === "INR" ? "₹" : "$"}
                          {account?.balance?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          {account?.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recipient Input */}
                <div className="bg-white dark:bg-[#0c0f1a] rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">
                      Recipient Information
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div className="group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block px-1 group-focus-within:text-blue-500 transition-colors">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        placeholder="Full name"
                        className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                        value={formData.recipientName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            recipientName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block px-1 group-focus-within:text-blue-500 transition-colors">
                        Account ID / Number
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                          type="text"
                          placeholder="Paste account ID"
                          className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold font-mono focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
                          value={formData.accountNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              accountNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="bg-white dark:bg-[#0c0f1a] rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-end">
                  <div className="lg:col-span-3 space-y-6">
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-6">
                        Transfer Amount
                      </h3>
                      <div className="relative group">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-5xl font-black text-gray-200 dark:text-gray-800 transition-colors group-focus-within:text-emerald-500/30">
                          {account?.currency === "INR" ? "₹" : "$"}
                        </span>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full bg-transparent border-b-2 border-gray-100 dark:border-white/5 focus:border-emerald-500 rounded-none pl-12 py-6 text-6xl font-black text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-100 dark:placeholder:text-white/5"
                          value={formData.amount}
                          onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {[100, 500, 1000, 5000].map((val) => (
                        <button
                          key={val}
                          onClick={() =>
                            setFormData({ ...formData, amount: val.toString() })
                          }
                          className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-blue-500 hover:text-white transition-all"
                        >
                          +{val}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-2 w-full">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">
                      Note / Reference
                    </label>
                    <textarea
                      rows="3"
                      placeholder="What's this for?"
                      className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all resize-none placeholder:text-gray-300 dark:placeholder:text-gray-600"
                      value={formData.note}
                      onChange={(e) =>
                        setFormData({ ...formData, note: e.target.value })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pr-4">
                <button
                  disabled={!formData.amount || !formData.accountNumber}
                  onClick={handleNext}
                  className="group relative flex items-center gap-4 pl-12 pr-6 py-6 rounded-[2rem] bg-gray-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 disabled:cursor-not-allowed overflow-hidden"
                >
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                  Review Transaction
                  <div className="w-10 h-10 rounded-2xl bg-white/10 dark:bg-black/5 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-20 transition duration-1000 group-hover:opacity-40"></div>
                <div className="relative bg-white dark:bg-[#0c0f1a] rounded-[3rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl">
                  <div className="p-10 border-b border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/5">
                    <h3 className="text-center text-xl font-black text-gray-900 dark:text-white">
                      Review Transaction
                    </h3>
                    <p className="text-center text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
                      Verify the recipient details
                    </p>
                  </div>

                  <div className="p-10 space-y-10">
                    {errorMsg && (
                      <div className="p-5 rounded-[1.5rem] bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-4 text-sm animate-pulse">
                        <AlertCircle className="w-6 h-6 flex-shrink-0" />
                        <p className="font-bold">{errorMsg}</p>
                      </div>
                    )}

                    <div className="flex flex-col items-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">
                        You are sending
                      </p>
                      <h2 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 tracking-tighter">
                        {account?.currency === "INR" ? "₹" : "$"}
                        {Number(formData.amount).toLocaleString()}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-6 rounded-3xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-transparent flex justify-between items-center transition-all hover:bg-white dark:hover:bg-white/10">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Recipient
                        </span>
                        <span className="text-base font-black text-gray-900 dark:text-white">
                          {formData.recipientName || "Unknown"}
                        </span>
                      </div>
                      <div className="p-6 rounded-3xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-transparent flex justify-between items-center transition-all hover:bg-white dark:hover:bg-white/10">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          Target ID
                        </span>
                        <span className="text-base font-black text-gray-900 dark:text-white font-mono">
                          {formData.accountNumber}
                        </span>
                      </div>
                      {formData.note && (
                        <div className="p-6 rounded-3xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-transparent flex justify-between items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Reference
                          </span>
                          <span className="text-sm font-bold text-gray-500 dark:text-gray-400 italic">
                            "{formData.note}"
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-6 pt-4">
                      <button
                        onClick={handleBack}
                        disabled={isTransitioning}
                        className="flex-1 py-6 rounded-2xl border-2 border-gray-100 dark:border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all transform active:scale-95"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmTransfer}
                        disabled={isTransitioning}
                        className="flex-[2] relative overflow-hidden py-6 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all transform hover:translate-y-[-2px] active:scale-95 flex items-center justify-center gap-3"
                      >
                        {isTransitioning ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            Confirm Transfer
                            <CheckCircle2 className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-xl mx-auto py-16 text-center animate-in zoom-in-95 fade-in duration-1000">
              <div className="relative mx-auto w-32 h-32 mb-12">
                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl">
                  <CheckCircle2 className="w-16 h-16" />
                </div>
              </div>

              <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tighter">
                Transfer Complete
              </h2>
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-12 px-10 leading-relaxed">
                Your payment of{" "}
                <span className="font-black text-gray-900 dark:text-white">
                  {account?.currency === "INR" ? "₹" : "$"}
                  {Number(formData.amount).toLocaleString()}
                </span>{" "}
                has been securely sent to{" "}
                <span className="font-black text-gray-900 dark:text-white">
                  {formData.recipientName}
                </span>
                .
              </p>

              <div className="bg-white dark:bg-[#0c0f1a] rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-white/10 p-8 mb-12 shadow-sm">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Transaction Reference
                    </span>
                    <span className="text-xs font-black text-blue-500 font-mono truncate max-w-[200px]">
                      #{transitionResponse?.transition?._id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Processing Time
                    </span>
                    <span className="text-xs font-black text-emerald-500">
                      INSTANT
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-10">
                <button
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      recipientName: "",
                      accountNumber: "",
                      bankName: "",
                      amount: "",
                      note: "",
                    });
                  }}
                  className="py-5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
                >
                  New Transfer
                </button>
                <button className="py-5 rounded-2xl border-2 border-gray-100 dark:border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all">
                  Get Receipt
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
