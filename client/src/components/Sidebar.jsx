import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLogoutMutation, useProfileQuery } from "../services/auth.api";
import {
  LayoutDashboard,
  Compass,
  CreditCard,
  ArrowRightLeft,
  FileText,
  TrendingUp,
  Landmark,
  Calculator,
  Moon,
  Sun,
  Sparkles,
  LogOut,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const [logout, { isLoading }] = useLogoutMutation();
  const { data: profile } = useProfileQuery();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const location = useLocation();
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: ArrowRightLeft, label: "Transfer", path: "/transfer" },
    { icon: Compass, label: "Neuro AI", path: "/ai" },
    { icon: CreditCard, label: "Accounts", path: "/accounts" },
    { icon: ArrowRightLeft, label: "Transactions", path: "/transactions" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: TrendingUp, label: "Investments", path: "/investments" },
    { icon: Landmark, label: "Loans", path: "/loans" },
    { icon: Calculator, label: "Taxes", path: "/taxes" },
  ];

  return (
    <>
      {/* Mobile Overlay Background */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`
        fixed md:static inset-y-0 left-0 z-50
        w-[280px] sm:w-80 h-screen bg-white dark:bg-[#0f1221] border-r border-gray-200 dark:border-[#1f2335] flex flex-col p-6 
        overflow-y-auto transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-wide text-gray-900 dark:text-white">
              NeuroBank
            </span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-between bg-gray-50 dark:bg-[#15182a] p-3 rounded-2xl mb-8 border border-gray-100 dark:border-[#232738] transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 overflow-hidden">
              <img
                src="https://i.pravatar.cc/150?img=11"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium tracking-wider mb-0.5">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Welcome back,
                <br />
                {profile?.user?.fullName?.firstName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {profile?.user?.email || "guest@example.com"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 pr-1 bg-white dark:bg-[#0f1221] p-1 rounded-lg border border-gray-200 dark:border-[#1f2335]">
            <button
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded-md transition-colors ${theme === "light" ? "bg-gray-100 text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}
              title="Light Mode"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded-md transition-colors ${theme === "dark" ? "bg-gray-100 text-gray-900 shadow-sm dark:bg-[#1a1d2d] dark:text-white" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}
              title="Dark Mode"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={index}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-[#1e2235] dark:text-white font-medium"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a1d2d] hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 space-y-4">
          <div className="bg-linear-to-br from-blue-600 to-indigo-800 rounded-2xl p-4 overflow-hidden relative cursor-pointer group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-blue-200" />
              <h4 className="font-semibold text-sm text-white">
                Activate NeuroBank Pro
              </h4>
            </div>
            <p className="text-xs text-blue-200/80">Elevate finances with AI</p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span
              className={`font-medium text-sm ${isLoading ? "text-red-500/50" : "text-red-400"}`}
            >
              {isLoading ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
