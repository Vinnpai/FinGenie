import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Chatbot from "./components/Chatbot";
import UserProfileSetup from "./components/UserProfileSetup";
import DashboardOverview from "./components/DashboardOverview";
import SpendAnalyzer from "./components/SpendAnalyzer";
import AIGoalPlanner from "./components/AIGoalPlanner";
import FinancialAlerts from "./components/FinancialAlerts";
import InvestmentAdvisor from "./components/InvestmentAdvisor";
import { userAPI } from "./services/api";

// --- Helper Icons (as React Components) ---
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 13a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z"
    />
  </svg>
);
const SpendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);
const GoalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
    />
  </svg>
);
const AlertIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);
const InvestIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
    />
  </svg>
);

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user profile is complete on component mount
  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        const profile = response.user.profile;

        // Check if essential profile data is missing
        if (
          !profile ||
          !profile.age ||
          !profile.occupation ||
          !profile.monthlyExpenses
        ) {
          setShowProfileSetup(true);
        } else {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error("Error checking user profile:", error);
        // If there's an error, show profile setup
        setShowProfileSetup(true);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      checkUserProfile();
    }
  }, [user]);

  const handleProfileComplete = async (profileData) => {
    try {
      const response = await userAPI.updateProfile(profileData);
      setUserProfile(response.user.profile);
      setShowProfileSetup(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", icon: <DashboardIcon /> },
    { name: "Spend Analyzer", icon: <SpendIcon /> },
    { name: "AI Goal Planner", icon: <GoalIcon /> },
    { name: "Financial Alerts", icon: <AlertIcon />, badge: "3" },
    { name: "Investment Advisor", icon: <InvestIcon /> },
  ];

  const renderContent = () => {
    switch (activeNav) {
      case "Dashboard":
        return <DashboardOverview />;
      case "Spend Analyzer":
        return <SpendAnalyzer />;
      case "AI Goal Planner":
        return <AIGoalPlanner />;
      case "Financial Alerts":
        return <FinancialAlerts />;
      case "Investment Advisor":
        return <InvestmentAdvisor />;
      default:
        return <DashboardOverview />;
    }
  };

  // Show profile setup if needed
  if (showProfileSetup) {
    return <UserProfileSetup onComplete={handleProfileComplete} />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header
        className="sticky top-0 z-40 backdrop-blur bg-black/50 border-b border-zinc-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <img
                  src="/fin-logo.jpg"
                  alt="finGenie Logo"
                  className="h-10 w-10 rounded-lg object-cover"
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
                  finGenie
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <span className="text-xs text-zinc-400">Current:</span>
                <span className="text-sm font-semibold text-brand-400">
                  {activeNav}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-300">
                Welcome, {user?.firstName || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700 hover:border-brand-500/50 text-zinc-300 hover:text-white rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-4 sm:p-6">
              <nav className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href="#"
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeNav === item.name
                        ? "bg-brand-600 text-white shadow-lg"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveNav(item.name);
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </motion.a>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">{renderContent()}</div>
        </div>
      </div>

      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  );
}

export default Dashboard;
