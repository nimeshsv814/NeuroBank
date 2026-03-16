import React from "react";
import { 
  User,  
  Shield, 
  Bell, 
  Moon, 
  Key, 
  LogOut,
  Camera,
  CheckCircle,
  ChevronRight,
  Menu
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import {useProfileQuery} from "../services/auth.api"

const ProfilePage = ({ onMenuClick }) => {
  const { theme, setTheme } = useTheme();
  const {data: user} = useProfileQuery();

  const userStats = [
    { label: "Member Since", value: "Nov 2022" },
    { label: "Account Level", value: "Platinum Pro" },
    { label: "Safety Score", value: "98/100" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-[#0c0f1a]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onMenuClick}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#151828] border border-gray-200 dark:border-[#232738] text-gray-600 dark:text-gray-300 shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-[#0f1221] rounded-[32px] border border-gray-200 dark:border-white/5 p-8 mb-8 relative overflow-hidden shadow-sm">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-blue-500/20 p-1">
                    <img 
                        src="https://i.pravatar.cc/150?img=11" 
                        alt="Profile" 
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center border-4 border-white dark:border-[#0f1221] hover:bg-blue-500 transition-all shadow-lg">
                    <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 text-center md:text-left">
                 <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{user?.user?.fullName?.firstName} {user?.user?.fullName?.lastName}</h3>
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                 </div>
                 <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">Verified Platinum Account</p>
                 <div className="grid grid-cols-3 gap-8">
                    {userStats.map((stat, i) => (
                        <div key={i}>
                            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">{stat.label}</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Info */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-[#0f1221] rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500" />
                        Personal Information
                    </h3>
                    <div className="space-y-4">
                        <div className="group cursor-pointer">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1"> Email Address</label>
                            <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent group-hover:border-blue-500/30 transition-all mt-1">
                                <span className="text-sm font-medium">{user?.user?.email}</span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0f1221] rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        Security & Privacy
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                    <Key className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">Change Password</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Preferences */}
            <div className="space-y-6">
                <div className="bg-white dark:bg-[#0f1221] rounded-3xl border border-gray-200 dark:border-white/5 p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-500" />
                        App Preferences
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-white/5 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                    <Moon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium">Dark Mode</span>
                            </div>
                            <div 
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className={`w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors ${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-all ${theme === 'dark' ? 'ml-auto' : ''}`}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 dark:bg-red-500/5 rounded-3xl border border-red-100 dark:border-red-500/10 p-6">
                    <h3 className="text-sm font-bold text-red-600 mb-4 uppercase tracking-wider">Danger Zone</h3>
                    <p className="text-xs text-red-500/70 mb-6 leading-relaxed">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-lg shadow-red-600/20">
                        <LogOut className="w-4 h-4" />
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
