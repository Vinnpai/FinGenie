import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please add a first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please add a last name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    financialGoals: [
      {
        title: String,
        targetAmount: Number,
        currentAmount: Number,
        deadline: Date,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    budget: {
      monthlyIncome: {
        type: Number,
        default: 0,
      },
      categories: [
        {
          name: String,
          allocatedAmount: Number,
          spentAmount: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
    // Enhanced user profile for AI chatbot
    profile: {
      age: {
        type: Number,
        min: 18,
        max: 100,
      },
      occupation: {
        type: String,
        trim: true,
      },
      riskTolerance: {
        type: String,
        enum: ["conservative", "moderate", "aggressive"],
        default: "moderate",
      },
      investmentExperience: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner",
      },
      financialPriorities: [
        {
          type: String,
          enum: [
            "emergency_fund",
            "retirement",
            "home_purchase",
            "education",
            "debt_payoff",
            "investment",
            "travel",
            "other",
          ],
        },
      ],
      monthlyExpenses: {
        type: Number,
        default: 0,
      },
      emergencyFund: {
        type: Number,
        default: 0,
      },
      debtAmount: {
        type: Number,
        default: 0,
      },
      investmentGoals: [
        {
          title: String,
          targetAmount: Number,
          timeframe: String, // e.g., "5 years", "10 years"
          priority: {
            type: String,
            enum: ["high", "medium", "low"],
            default: "medium",
          },
        },
      ],
    },
    // AI conversation history for context
    aiConversationHistory: [
      {
        userMessage: String,
        aiResponse: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        context: {
          section: String, // e.g., 'budget', 'goals', 'investment', 'general'
          sentiment: String, // e.g., 'positive', 'negative', 'neutral'
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
