const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return {
    "Content-Type": "application/json",
    ...(user?.token && { Authorization: `Bearer ${user.token}` }),
  };
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  getProfile: async () => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (userData) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
};

// Finance API
export const financeAPI = {
  // Goals
  getGoals: async () => {
    const response = await fetch(`${API_URL}/finance/goals`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  addGoal: async (goalData) => {
    const response = await fetch(`${API_URL}/finance/goals`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(goalData),
    });
    return handleResponse(response);
  },

  updateGoal: async (id, goalData) => {
    const response = await fetch(`${API_URL}/finance/goals/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(goalData),
    });
    return handleResponse(response);
  },

  deleteGoal: async (id) => {
    const response = await fetch(`${API_URL}/finance/goals/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Budget
  getBudget: async () => {
    const response = await fetch(`${API_URL}/finance/budget`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateBudget: async (budgetData) => {
    const response = await fetch(`${API_URL}/finance/budget`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(budgetData),
    });
    return handleResponse(response);
  },
};

// User Profile API
export const userAPI = {
  // Profile management
  getProfile: async () => {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  // AI Conversation management
  addConversation: async (conversationData) => {
    const response = await fetch(`${API_URL}/user/conversation`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(conversationData),
    });
    return handleResponse(response);
  },

  getConversationHistory: async (limit = 50) => {
    const response = await fetch(
      `${API_URL}/user/conversations?limit=${limit}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },
};
