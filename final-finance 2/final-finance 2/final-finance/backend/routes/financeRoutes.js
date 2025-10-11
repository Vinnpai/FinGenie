import express from 'express';
import {
  addFinancialGoal,
  getFinancialGoals,
  updateFinancialGoal,
  deleteFinancialGoal,
  updateBudget,
  getBudget,
} from '../controllers/financeController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/goals')
  .get(protect, getFinancialGoals)
  .post(protect, addFinancialGoal);

router.route('/goals/:id')
  .put(protect, updateFinancialGoal)
  .delete(protect, deleteFinancialGoal);

router.route('/budget')
  .get(protect, getBudget)
  .put(protect, updateBudget);

export default router;
