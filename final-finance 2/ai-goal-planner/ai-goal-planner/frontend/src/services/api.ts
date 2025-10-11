const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface GoalData {
  goal: string;
  amount: number;
  duration: number;
  income: number;
  savings: number;
}

interface PlanResponse {
  success: boolean;
  monthly_saving: number;
  investment_strategy: string;
  summary: string;
  goalId?: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

class APIService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage
    this.token = localStorage.getItem('token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async createGoal(goalData: GoalData): Promise<PlanResponse> {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(goalData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create goal');
    }

    return await response.json();
  }

  async getGoals() {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch goals');
    }

    return await response.json();
  }

  async deleteGoal(goalId: string) {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete goal');
    }

    return await response.json();
  }

  async updateGoalProgress(goalId: string, amount: number) {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}/progress`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error('Failed to update progress');
    }

    return await response.json();
  }

  async getNotifications() {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return await response.json();
  }

  async getGoalNotifications(goalId: string) {
    const response = await fetch(`${API_BASE_URL}/notifications/${goalId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch goal notifications');
    }

    return await response.json();
  }

  // Request browser notification permission
  async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      return await Notification.requestPermission();
    }
    return Notification.permission;
  }

  // Show browser notification
  showBrowserNotification(title: string, body: string, icon?: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/logo192.png',
        badge: '/logo192.png',
        tag: 'goal-notification',
        requireInteraction: false
      });
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export default new APIService();
