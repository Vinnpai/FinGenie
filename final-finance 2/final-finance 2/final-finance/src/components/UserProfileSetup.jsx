import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const UserProfileSetup = ({ onComplete }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    occupation: "",
    riskTolerance: "moderate",
    investmentExperience: "beginner",
    financialPriorities: [],
    monthlyExpenses: "",
    emergencyFund: "",
    debtAmount: "",
    investmentGoals: [],
  });

  const totalSteps = 4;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "financialPriorities") {
        setFormData((prev) => ({
          ...prev,
          financialPriorities: checked
            ? [...prev.financialPriorities, value]
            : prev.financialPriorities.filter((item) => item !== value),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addInvestmentGoal = () => {
    setFormData((prev) => ({
      ...prev,
      investmentGoals: [
        ...prev.investmentGoals,
        { title: "", targetAmount: "", timeframe: "", priority: "medium" },
      ],
    }));
  };

  const updateInvestmentGoal = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      investmentGoals: prev.investmentGoals.map((goal, i) =>
        i === index ? { ...goal, [field]: value } : goal
      ),
    }));
  };

  const removeInvestmentGoal = (index) => {
    setFormData((prev) => ({
      ...prev,
      investmentGoals: prev.investmentGoals.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Here you would call the API to update user profile
      console.log("Profile data:", formData);
      onComplete(formData);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Basic Information
        </h2>
        <p className="text-zinc-400">
          Help us personalize your financial experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Age
          </label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            min="18"
            max="100"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Enter your age"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Occupation
          </label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="e.g., Software Engineer, Teacher, etc."
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Monthly Expenses
        </label>
        <input
          type="number"
          name="monthlyExpenses"
          value={formData.monthlyExpenses}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Enter your monthly expenses"
          required
        />
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Financial Priorities
        </h2>
        <p className="text-zinc-400">What are your main financial goals?</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-4">
          Select your priorities (multiple selection allowed)
        </label>
        <div className="grid grid-cols-2 gap-4">
          {[
            { value: "emergency_fund", label: "Emergency Fund" },
            { value: "retirement", label: "Retirement Planning" },
            { value: "home_purchase", label: "Home Purchase" },
            { value: "education", label: "Education Fund" },
            { value: "debt_payoff", label: "Debt Payoff" },
            { value: "investment", label: "Investment Growth" },
            { value: "travel", label: "Travel Fund" },
            { value: "other", label: "Other" },
          ].map((priority) => (
            <label
              key={priority.value}
              className="flex items-center space-x-3 p-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 cursor-pointer"
            >
              <input
                type="checkbox"
                name="financialPriorities"
                value={priority.value}
                checked={formData.financialPriorities.includes(priority.value)}
                onChange={handleInputChange}
                className="w-4 h-4 text-brand-500 bg-zinc-700 border-zinc-600 rounded focus:ring-brand-500"
              />
              <span className="text-white text-sm">{priority.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Emergency Fund Amount
          </label>
          <input
            type="number"
            name="emergencyFund"
            value={formData.emergencyFund}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Current emergency fund amount"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Total Debt Amount
          </label>
          <input
            type="number"
            name="debtAmount"
            value={formData.debtAmount}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Total debt amount"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Investment Profile
        </h2>
        <p className="text-zinc-400">
          Help us understand your investment preferences
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-4">
          Risk Tolerance
        </label>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              value: "conservative",
              label: "Conservative",
              desc: "Low risk, stable returns",
            },
            {
              value: "moderate",
              label: "Moderate",
              desc: "Balanced risk and return",
            },
            {
              value: "aggressive",
              label: "Aggressive",
              desc: "High risk, high potential returns",
            },
          ].map((risk) => (
            <label
              key={risk.value}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                formData.riskTolerance === risk.value
                  ? "border-brand-500 bg-brand-500/10"
                  : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
              }`}
            >
              <input
                type="radio"
                name="riskTolerance"
                value={risk.value}
                checked={formData.riskTolerance === risk.value}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="text-center">
                <div className="font-semibold text-white mb-1">
                  {risk.label}
                </div>
                <div className="text-xs text-zinc-400">{risk.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-4">
          Investment Experience
        </label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: "beginner", label: "Beginner", desc: "New to investing" },
            {
              value: "intermediate",
              label: "Intermediate",
              desc: "Some experience",
            },
            {
              value: "advanced",
              label: "Advanced",
              desc: "Experienced investor",
            },
          ].map((exp) => (
            <label
              key={exp.value}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                formData.investmentExperience === exp.value
                  ? "border-brand-500 bg-brand-500/10"
                  : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
              }`}
            >
              <input
                type="radio"
                name="investmentExperience"
                value={exp.value}
                checked={formData.investmentExperience === exp.value}
                onChange={handleInputChange}
                className="sr-only"
              />
              <div className="text-center">
                <div className="font-semibold text-white mb-1">{exp.label}</div>
                <div className="text-xs text-zinc-400">{exp.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Investment Goals</h2>
        <p className="text-zinc-400">
          Define your specific investment objectives
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-zinc-300">
            Investment Goals
          </label>
          <button
            type="button"
            onClick={addInvestmentGoal}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            Add Goal
          </button>
        </div>

        {formData.investmentGoals.map((goal, index) => (
          <div key={index} className="bg-zinc-800 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={goal.title}
                  onChange={(e) =>
                    updateInvestmentGoal(index, "title", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g., Retirement Fund"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Target Amount
                </label>
                <input
                  type="number"
                  value={goal.targetAmount}
                  onChange={(e) =>
                    updateInvestmentGoal(index, "targetAmount", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="100000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Timeframe
                </label>
                <input
                  type="text"
                  value={goal.timeframe}
                  onChange={(e) =>
                    updateInvestmentGoal(index, "timeframe", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g., 10 years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Priority
                </label>
                <select
                  value={goal.priority}
                  onChange={(e) =>
                    updateInvestmentGoal(index, "priority", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeInvestmentGoal(index)}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
            >
              Remove Goal
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-zinc-900 rounded-2xl border border-zinc-800 p-8"
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-white">Profile Setup</h1>
            <span className="text-zinc-400">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-brand-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  : "bg-zinc-700 text-white hover:bg-zinc-600"
              }`}
            >
              Previous
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-brand-500 to-purple-500 text-white rounded-lg hover:from-brand-600 hover:to-purple-600 transition-all font-medium"
              >
                Complete Setup
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UserProfileSetup;
