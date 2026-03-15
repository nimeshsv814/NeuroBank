import React from "react";
import { Calendar, LayoutGrid, Plus, Menu } from "lucide-react";

const Dashboard = ({ onMenuClick }) => {
  // const { data, isLoading } = useGetDashboardQuery();

  // if (isLoading) {
  //   return <div className="flex-1 flex items-center justify-center text-white">Loading Dashboard...</div>;
  // }

  // const dashboardData = data?.data;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-[#0c0f1a] transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#151828] border border-gray-200 dark:border-[#232738] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#151828] border border-gray-200 dark:border-[#232738] text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors shadow-sm">
            <Calendar className="w-4 h-4" />
            <span>This Month</span>
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#151828] border border-gray-200 dark:border-[#232738] text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap shadow-sm">
            <LayoutGrid className="w-4 h-4" />
            <span>Manage Widgets</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm text-white font-medium transition-colors shadow-lg shadow-blue-600/20 whitespace-nowrap">
            <Plus className="w-4 h-4" />
            <span>Add new Widget</span>
          </button>
        </div>
      </div>

      {/* Grid Layout taking cues from the image */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Row 1 */}
        <div className="md:col-span-4 h-80 rounded-3xl glass-card border flex flex-col justify-between relative overflow-hidden group">
          {/* AI Insights placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 dark:from-indigo-900/50 to-blue-500/5 dark:to-blue-900/20"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10 p-6 flex flex-col h-full justify-between">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-xs font-medium text-blue-600 dark:text-blue-300 backdrop-blur-md self-start">
              AI Insights
            </div>
            <div>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${i === 1 ? "bg-gray-800 dark:bg-white" : "bg-gray-300 dark:bg-white/30"}`}
                  ></div>
                ))}
              </div>
              <h3 className="text-xl font-semibold leading-snug text-gray-900 dark:text-white max-w-[90%]">
                {dashboardData?.insights?.message}
              </h3>
              <button className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white dark:bg-[#1e2235] flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#2a2f4c] transition-colors border border-gray-200 dark:border-white/5 shadow-sm">
                <span className="text-gray-900 dark:text-white transform rotate-[-45deg] text-lg">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 h-80 rounded-3xl glass-card border p-6 relative">
          {/* Balance Overview placeholder */}
          <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">
            Balance Overview
          </h3>
          <div className="flex items-end gap-3 mb-4">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ${dashboardData?.balance?.total}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center bg-emerald-100 dark:bg-emerald-400/10 px-2 py-0.5 rounded text-xs mb-1">
              ↑ {dashboardData?.balance?.percentageChange}%{" "}
              <span className="text-gray-500 dark:text-gray-400 ml-1">
                From last month
              </span>
            </span>
          </div>
          <div className="flex gap-2 mb-8">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-gray-200 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-transparent">
              <span className="text-gray-400 dark:text-gray-500">⇄</span>{" "}
              {dashboardData?.balance?.transactionsCount} transactions
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-gray-200 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-transparent">
              <span className="text-gray-400 dark:text-gray-500">⬡</span>{" "}
              {dashboardData?.balance?.categoriesCount} categories
            </div>
          </div>
          <div className="absolute bottom-10 left-6 right-6 h-24 border-b border-dashed border-gray-300 dark:border-white/10">
            {/* Chart line placeholder */}
            <svg
              className="w-full h-full"
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
            >
              <path
                d="M0,35 Q10,25 20,30 T40,20 T60,25 T80,10 T100,5"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-2 px-1">
              {["15", "16", "17", "18", "19", "20", "21", "22", "23", "24"].map(
                (d) => (
                  <span
                    key={d}
                    className={
                      d === "21"
                        ? "text-blue-600 dark:text-white bg-blue-50 dark:bg-white/10 px-1 rounded font-medium"
                        : ""
                    }
                  >
                    {d}
                  </span>
                ),
              )}
            </div>
          </div>
          <button className="absolute top-6 right-6 w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-white dark:bg-transparent">
            <span className="transform rotate-[-45deg] text-xs">→</span>
          </button>
        </div>

        <div className="md:col-span-4 h-80 rounded-3xl glass-card border p-6 relative">
          {/* Earnings placeholder */}
          <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-2">
            Earnings
          </h3>
          <div className="flex items-end gap-3 mb-8">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ${dashboardData?.earnings?.total}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center bg-emerald-100 dark:bg-emerald-400/10 px-2 py-0.5 rounded text-xs mb-1">
              ↑ {dashboardData?.earnings?.percentageChange}%{" "}
              <span className="text-gray-500 dark:text-gray-400 ml-1">
                From last month
              </span>
            </span>
          </div>
          <div className="flex justify-center mt-6">
            <div className="relative w-48 h-24 overflow-hidden">
              {/* Doughnut arc placeholder */}
              <div className="absolute inset-0 box-border border-[16px] border-gray-100 dark:border-[#1e2235] rounded-t-[100px] border-b-0"></div>
              <div className="absolute top-0 left-0 w-[58%] h-full overflow-hidden origin-bottom-right">
                <div className="absolute top-0 -right-[42%] w-[100/58*100%] h-full box-border border-[16px] border-blue-500 rounded-t-[100px] border-b-0 transform rotate-[0deg]"></div>
              </div>
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Percentage
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData?.earnings?.progressPercentage}%
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Current
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500"></span>{" "}
              Month goal
            </div>
          </div>
          <button className="absolute top-6 right-6 w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-white dark:bg-transparent">
            <span className="transform rotate-[-45deg] text-xs">→</span>
          </button>
        </div>

        {/* Row 2 */}
        <div className="md:col-span-8 bg-white dark:bg-[#0c0f1a] rounded-3xl border border-gray-200 dark:border-white/5 p-6 relative shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Transactions
            </h3>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-transparent">
                <span className="text-xs">▼</span>
              </button>
              <button className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-transparent">
                <span className="transform rotate-[-45deg] text-xs">→</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 overflow-x-auto">
            <div className="min-w-[500px]">
              {dashboardData?.transactions?.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between group mb-4"
                >
                  <div className="flex items-center gap-4 w-1/4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0
                      ${
                        tx.merchant === "Netflix"
                          ? "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500"
                          : tx.merchant === "PlayStation"
                            ? "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500"
                            : tx.merchant === "Airbnb"
                              ? "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-500"
                              : tx.merchant === "Apple"
                                ? "bg-gray-100 dark:bg-gray-500/10 text-gray-600 dark:text-gray-300"
                                : "bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500"
                      }`}
                    >
                      ★
                    </div>
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-200 truncate">
                      {tx.merchant}
                    </span>
                  </div>
                  <div className="w-1/4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span
                      className={`w-6 h-4 rounded space-x-0.5 flex items-center justify-center overflow-hidden bg-gray-200 dark:bg-white shrink-0`}
                    >
                      <span className="w-1/2 h-full bg-red-500 block"></span>
                      <span className="w-1/2 h-full bg-orange-400 block -ml-1 rounded-l-full"></span>
                    </span>
                    <span className="truncate">{tx.card}</span>
                  </div>
                  <div className="w-1/4 text-sm text-gray-500 dark:text-gray-400 text-left truncate px-2">
                    {tx.date}
                  </div>
                  <div
                    className={`w-1/4 text-right font-medium text-sm ${tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-gray-200"}`}
                  >
                    {tx.type === "income" ? "+" : ""}
                    {tx.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-4 bg-white dark:bg-[#0c0f1a] rounded-3xl border border-gray-200 dark:border-white/5 p-6 relative shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Spending
            </h3>
            <button className="w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-50 dark:bg-transparent">
              <span className="transform rotate-[-45deg] text-xs">→</span>
            </button>
          </div>

          <div className="flex items-end gap-3 mb-8">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {dashboardData?.spending?.total}
            </span>
            <span className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center bg-red-100 dark:bg-red-400/10 px-2 py-0.5 rounded text-xs mb-1">
              ↓ {Math.abs(dashboardData?.spending?.percentageChange)}{" "}
              <span className="text-gray-500 dark:text-gray-400 ml-1">
                From last month
              </span>
            </span>
          </div>

          <div className="flex items-end justify-between mt-12 h-32 px-2 pb-4 border-b border-gray-200 dark:border-white/5">
            {dashboardData?.spending?.categories?.map((cat, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 flex-1 group"
              >
                <div
                  className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-gray-200 dark:from-[#1e2235] to-blue-400 dark:to-blue-500/80 relative group-hover:to-blue-500 dark:group-hover:to-blue-400 transition-colors"
                  style={{ height: `${cat.value * 3}px` }}
                >
                  <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700 dark:text-white">
                    {cat.value}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
