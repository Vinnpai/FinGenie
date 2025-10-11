import React from 'react';

interface Notification {
  type: 'daily' | 'weekly' | 'deadline' | 'achievement' | 'warning' | 'milestone' | 'urgent';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  goalId: string;
  action?: string;
  daysRemaining?: number;
  daysOverdue?: number;
  deficit?: number;
  milestone?: number;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onDismiss: (goalId: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onDismiss }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'daily':
        return '📆';
      case 'weekly':
        return '📅';
      case 'deadline':
      case 'urgent':
        return '⏰';
      case 'achievement':
        return '🎉';
      case 'warning':
        return '⚠️';
      case 'milestone':
        return '🎯';
      default:
        return '🔔';
    }
  };

  const getColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/10 border-red-500/50 border-2';
      case 'high':
        return 'bg-brand-500/10 border-brand-500/50 border-2';
      case 'medium':
        return 'bg-zinc-800/50 border-zinc-700 border';
      case 'low':
        return 'bg-zinc-800/30 border-zinc-700 border';
      default:
        return 'bg-zinc-800/30 border-zinc-700 border';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <span className="text-2xl mr-2">🔔</span>
          Notifications {notifications.length > 0 && `(${notifications.length})`}
        </h3>
        {notifications.length === 0 && (
          <span className="text-sm text-zinc-400">No new notifications</span>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="bg-zinc-900/40 backdrop-blur-sm rounded-lg p-6 text-center border border-zinc-800">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-zinc-400">You're all caught up! No notifications at the moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className={`${getColor(notification.priority)} rounded-lg p-4 flex items-start justify-between animate-fadeIn`}
        >
          <div className="flex items-start space-x-3 flex-1">
            <span className="text-2xl">{getIcon(notification.type)}</span>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-white font-bold">{notification.title}</h4>
                {notification.priority === 'urgent' && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                    URGENT
                  </span>
                )}
              </div>
              <p className="text-zinc-300">{notification.message}</p>
              {notification.daysOverdue && (
                <p className="text-xs text-red-400 font-semibold mt-1">
                  {notification.daysOverdue} days overdue
                </p>
              )}
              {notification.daysRemaining && (
                <p className="text-xs text-zinc-400 mt-1">
                  {notification.daysRemaining} days remaining
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => onDismiss(notification.goalId)}
            className="text-zinc-400 hover:text-white transition-colors ml-4"
            title="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
