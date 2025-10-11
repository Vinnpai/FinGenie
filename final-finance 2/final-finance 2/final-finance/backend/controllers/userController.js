import User from "../models/User.js";

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profileData = req.body;

    // Validate required fields
    if (
      !profileData.age ||
      !profileData.occupation ||
      !profileData.monthlyExpenses
    ) {
      return res.status(400).json({
        message: "Age, occupation, and monthly expenses are required",
      });
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          profile: profileData,
          "budget.monthlyIncome": profileData.monthlyIncome || 0,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        profile: updatedUser.profile,
        budget: updatedUser.budget,
        financialGoals: updatedUser.financialGoals,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profile: user.profile,
        budget: user.budget,
        financialGoals: user.financialGoals,
        aiConversationHistory: user.aiConversationHistory,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

// @desc    Add AI conversation to history
// @route   POST /api/user/conversation
// @access  Private
export const addConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { userMessage, aiResponse, context } = req.body;

    if (!userMessage || !aiResponse) {
      return res.status(400).json({
        message: "User message and AI response are required",
      });
    }

    const conversationEntry = {
      userMessage,
      aiResponse,
      context: context || { section: "general", sentiment: "neutral" },
      timestamp: new Date(),
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { aiConversationHistory: conversationEntry } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "Conversation added successfully",
    });
  } catch (error) {
    console.error("Add conversation error:", error);
    res.status(500).json({
      message: "Failed to add conversation",
      error: error.message,
    });
  }
};

// @desc    Get AI conversation history
// @route   GET /api/user/conversations
// @access  Private
export const getConversationHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 50;

    const user = await User.findById(userId).select("aiConversationHistory");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get recent conversations (last N entries)
    const recentConversations = user.aiConversationHistory
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    res.json({
      success: true,
      conversations: recentConversations,
    });
  } catch (error) {
    console.error("Get conversation history error:", error);
    res.status(500).json({
      message: "Failed to get conversation history",
      error: error.message,
    });
  }
};
