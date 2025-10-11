/**
 * Notification Utility
 * Handles weekly reminders and deadline notifications
 */

/**
 * Check if user needs daily reminder
 * @param {Object} goal - Goal object
 * @returns {Object} - Notification details
 */
exports.checkDailyReminder = (goal) => {
  const now = new Date();
  const lastUpdated = goal.progress?.lastUpdated 
    ? new Date(goal.progress.lastUpdated)
    : new Date(goal.createdAt);
  
  const daysSinceUpdate = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));
  
  // Daily reminder if not updated today
  if (daysSinceUpdate >= 1) {
    const dailyTarget = Math.round(goal.plan.monthly_saving / 30);
    return {
      type: 'daily',
      priority: daysSinceUpdate >= 3 ? 'high' : 'medium',
      title: '📅 Daily Savings Reminder',
      message: `Don't forget to track your savings for "${goal.goal}"! Daily target: ₹${dailyTarget}`,
      goalId: goal._id,
      action: 'update_progress',
      daysOverdue: daysSinceUpdate
    };
  }
  
  return null;
};

/**
 * Check if user needs weekly reminder (kept for backward compatibility)
 * @param {Object} goal - Goal object
 * @returns {Object} - Notification details
 */
exports.checkWeeklyReminder = (goal) => {
  const now = new Date();
  const lastUpdated = goal.progress?.lastUpdated 
    ? new Date(goal.progress.lastUpdated)
    : new Date(goal.createdAt);
  
  const daysSinceUpdate = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));
  
  if (daysSinceUpdate >= 7) {
    const weeklyTarget = Math.round(goal.plan.monthly_saving / 4.33);
    return {
      type: 'weekly',
      priority: 'high',
      title: '📅 Weekly Savings Reminder',
      message: `Time to update your savings for "${goal.goal}"! Have you saved ₹${weeklyTarget} this week?`,
      goalId: goal._id,
      action: 'update_progress',
      daysOverdue: daysSinceUpdate - 7
    };
  }
  
  return null;
};

/**
 * Check if goal deadline is approaching
 * @param {Object} goal - Goal object
 * @returns {Object} - Notification details
 */
exports.checkDeadlineApproaching = (goal) => {
  const now = new Date();
  const createdDate = new Date(goal.createdAt);
  const durationMs = goal.duration * 30 * 24 * 60 * 60 * 1000; // months to milliseconds
  const deadlineDate = new Date(createdDate.getTime() + durationMs);
  const daysRemaining = Math.floor((deadlineDate - now) / (1000 * 60 * 60 * 24));
  
  if (daysRemaining <= 30 && daysRemaining > 0) {
    return {
      type: 'deadline',
      priority: daysRemaining <= 7 ? 'urgent' : 'medium',
      title: '⏰ Deadline Approaching',
      message: `Your goal "${goal.goal}" deadline is in ${daysRemaining} days! Target: ₹${goal.amount.toLocaleString()}`,
      goalId: goal._id,
      daysRemaining,
      action: 'view_goal'
    };
  }
  
  return null;
};

/**
 * Check if user is behind schedule
 * @param {Object} goal - Goal object
 * @returns {Object} - Notification details
 */
exports.checkBehindSchedule = (goal) => {
  const now = new Date();
  const createdDate = new Date(goal.createdAt);
  const monthsElapsed = (now - createdDate) / (1000 * 60 * 60 * 24 * 30);
  
  const expectedSaved = goal.savings + (monthsElapsed * goal.plan.monthly_saving);
  const currentSaved = goal.progress?.currentSaved || goal.savings;
  const deficit = expectedSaved - currentSaved;
  
  if (deficit > goal.plan.monthly_saving * 0.5) { // More than half month behind
    return {
      type: 'warning',
      priority: 'high',
      title: '⚠️ Behind Schedule',
      message: `You're behind on "${goal.goal}". Save ₹${Math.round(deficit).toLocaleString()} to catch up!`,
      goalId: goal._id,
      deficit: Math.round(deficit),
      action: 'update_progress'
    };
  }
  
  return null;
};

/**
 * Check if goal is completed
 * @param {Object} goal - Goal object
 * @returns {Object} - Notification details
 */
exports.checkGoalCompleted = (goal) => {
  const currentSaved = goal.progress?.currentSaved || goal.savings;
  
  if (currentSaved >= goal.amount && goal.status !== 'completed') {
    return {
      type: 'achievement',
      priority: 'high',
      title: '🎉 Goal Completed!',
      message: `Congratulations! You've achieved your goal "${goal.goal}" of ₹${goal.amount.toLocaleString()}!`,
      goalId: goal._id,
      action: 'celebrate'
    };
  }
  
  return null;
};

/**
 * Check milestone achievements (25%, 50%, 75%)
 * @param {Object} goal - Goal object
 * @returns {Object} - Notification details
 */
exports.checkMilestone = (goal) => {
  const currentSaved = goal.progress?.currentSaved || goal.savings;
  const percentage = (currentSaved / goal.amount) * 100;
  
  const milestones = [25, 50, 75];
  const previousSaved = currentSaved - (goal.progress?.weeklyUpdates?.slice(-1)[0]?.amount || 0);
  const previousPercentage = (previousSaved / goal.amount) * 100;
  
  for (const milestone of milestones) {
    if (percentage >= milestone && previousPercentage < milestone) {
      return {
        type: 'milestone',
        priority: 'medium',
        title: `🎯 ${milestone}% Milestone Reached!`,
        message: `Great progress on "${goal.goal}"! You've saved ${milestone}% (₹${currentSaved.toLocaleString()})`,
        goalId: goal._id,
        milestone,
        action: 'view_goal'
      };
    }
  }
  
  return null;
};

/**
 * Get all notifications for a goal
 * @param {Object} goal - Goal object
 * @returns {Array} - Array of notifications
 */
exports.getAllNotifications = (goal) => {
  const notifications = [];
  
  // Check daily reminder first (more frequent)
  const daily = exports.checkDailyReminder(goal);
  if (daily) notifications.push(daily);
  
  // Also check weekly for longer gaps
  const weekly = exports.checkWeeklyReminder(goal);
  if (weekly && !daily) notifications.push(weekly); // Only if no daily reminder
  
  const deadline = exports.checkDeadlineApproaching(goal);
  if (deadline) notifications.push(deadline);
  
  const behind = exports.checkBehindSchedule(goal);
  if (behind) notifications.push(behind);
  
  const completed = exports.checkGoalCompleted(goal);
  if (completed) notifications.push(completed);
  
  const milestone = exports.checkMilestone(goal);
  if (milestone) notifications.push(milestone);
  
  return notifications;
};

/**
 * Get all notifications for multiple goals
 * @param {Array} goals - Array of goal objects
 * @returns {Array} - Array of all notifications
 */
exports.getAllGoalsNotifications = (goals) => {
  const allNotifications = [];
  
  goals.forEach(goal => {
    const goalNotifications = exports.getAllNotifications(goal);
    allNotifications.push(...goalNotifications);
  });
  
  // Sort by priority
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  allNotifications.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  return allNotifications;
};
