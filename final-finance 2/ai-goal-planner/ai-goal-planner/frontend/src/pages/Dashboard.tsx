import React, { useState, useEffect } from 'react';
import GoalCard from '../components/GoalCard';
import ProgressChart from '../components/ProgressChart';
import WeeklySavingsTracker from '../components/WeeklySavingsTracker';
import NotificationPanel from '../components/NotificationPanel';
import apiService from '../services/api';

interface Goal {
  _id: string;
  goal: string;
  amount: number;
  duration: number;
  income: number;
  savings: number;
  plan: {
    monthly_saving: number;
    investment_strategy: string;
    summary: string;
  };
  progress?: {
    currentSaved: number;
    weeklyUpdates: Array<{
      week: number;
      amount: number;
      date: string;
    }>;
    lastUpdated: string;
  };
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    loadGoals();
    loadNotifications();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await apiService.getGoals();
      setGoals(response.goals || []);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await apiService.getNotifications();
      console.log('Notifications loaded:', response);
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleUpdateProgress = async (goalId: string, amount: number) => {
    try {
      // Update goal progress
      await apiService.updateGoalProgress(goalId, amount);
      await loadGoals();
      await loadNotifications(); // Reload notifications after update
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await apiService.deleteGoal(goalId);
        await loadGoals();
      } catch (error) {
        console.error('Failed to delete goal:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-light py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">📊 My Goals Dashboard</h1>
          <p className="text-accent">Track your financial goals and progress</p>
        </div>

        {/* Notifications */}
        <NotificationPanel 
          notifications={notifications}
          onDismiss={(id: string) => setNotifications(notifications.filter(n => n.goalId !== id))}
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-accent border-opacity-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent mb-1">Total Goals</p>
                <p className="text-3xl font-bold text-primary">{goals.length}</p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-accent border-opacity-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent mb-1">Total Target</p>
                <p className="text-3xl font-bold text-secondary">
                  ₹{goals.reduce((sum, g) => sum + g.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-accent border-opacity-30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent mb-1">Total Saved</p>
                <p className="text-3xl font-bold text-primary">
                  ₹{goals.reduce((sum, g) => sum + (g.progress?.currentSaved || g.savings), 0).toLocaleString()}
                </p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-6xl mb-4">⏳</div>
            <p className="text-accent">Loading your goals...</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-accent border-opacity-30">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-primary mb-2">No Goals Yet</h3>
            <p className="text-accent mb-6">Create your first financial goal to get started!</p>
            <a
              href="/"
              className="inline-block bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Create Your First Goal
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {goals.map(goal => (
              <div key={goal._id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-accent border-opacity-30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Goal Details */}
                  <div>
                    <GoalCard 
                      goal={goal} 
                      onDelete={handleDeleteGoal}
                      onUpdate={() => setSelectedGoal(goal)}
                    />
                  </div>

                  {/* Progress Chart */}
                  <div>
                    <ProgressChart goal={goal} />
                    <WeeklySavingsTracker 
                      goal={goal}
                      onUpdate={(amount) => handleUpdateProgress(goal._id, amount)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
