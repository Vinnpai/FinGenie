import express from "express";
import { protect } from "../middleware/auth.js";
import {
  updateUserProfile,
  getUserProfile,
  addConversation,
  getConversationHistory,
} from "../controllers/userController.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile routes
router.route("/profile").get(getUserProfile).put(updateUserProfile);

// Conversation routes
router.route("/conversation").post(addConversation);

router.route("/conversations").get(getConversationHistory);

export default router;
