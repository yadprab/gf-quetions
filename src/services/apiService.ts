import { ENDPOINTS, STORAGE_KEYS } from "../config";
import { API_CONFIG } from "../config/env";
import useStore from "../store/useStore";
import type { User, Customer, UserSettings } from "../types";
import {
  CARD_MOCK_DATA,
  INVOICE_MANAGEMENT_MOCK_DATA,
  RECENT_ACTIVITY_MOCK_DATA,
} from "../mock";

interface AuthResponse {
  token: string;
  user: User;
}

interface Activity {
  description: string;
  timestamp: string;
}

const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.token);
};

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.json();
};

export const fetchUsers = () => {
  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () => {
      return {
        id: "USR-001",
        name: "John Doe",
        email: "john@example.com",
      };
    },
  });
};

export const fetchFeatureFlags = () => {
  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () => {
      return {
        feature1: true,
        feature2: false,
      };
    },
  });
};

export const fetchCustomers = (signal?: AbortSignal) => {
  // Mocking the API call to return CARD_MOCK_DATA
  console.info("Fetching customers", signal);
  return Promise.resolve({
    id: "CUST-001",
    name: "John Doe",
    email: "john@example.com",
  });
};

export const fetchStats = (
  signal?: AbortSignal
): Promise<typeof CARD_MOCK_DATA> => {
  // Mocking the API call to return CARD_MOCK_DATA
  console.info("Fetching customers", signal);
  return Promise.resolve(CARD_MOCK_DATA);
};

export const fetchRecentActivity = (
  signal?: AbortSignal
): Promise<typeof RECENT_ACTIVITY_MOCK_DATA> => {
  console.info("Fetching recent activity", signal);
  // Mocking the API call to return CARD_MOCK_DATA
  return Promise.resolve(RECENT_ACTIVITY_MOCK_DATA);
};

export const fetchInvoiceData = (signal?: AbortSignal) => {
  console.info("Fetching invoice data", signal);
  // Mocking the API call to return CARD_MOCK_DATA
  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () => INVOICE_MANAGEMENT_MOCK_DATA,
  });
};

export const updateCustomer = (
  id: string,
  data: Partial<Customer>
): Promise<Customer> => {
  return request<Customer>(`${ENDPOINTS.users}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${ENDPOINTS.auth.login}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  const data: AuthResponse = await response.json();
  localStorage.setItem(STORAGE_KEYS.token, data.token);
  useStore.getState().setUser(data.user);
  return data;
};

export const fetchUser = (userId: string): Promise<User> => {
  return request<User>(`${ENDPOINTS.users}/${userId}`);
};

export const fetchUserActivity = (userId: string): Promise<Activity[]> => {
  return request<Activity[]>(`${ENDPOINTS.users}/${userId}/activity`);
};

export const fetchSettings = (): Promise<UserSettings> => {
  return request<UserSettings>(`/api/settings`);
};

export const saveSettings = (settings: UserSettings): Promise<UserSettings> => {
  return request<UserSettings>(`/api/settings`, {
    method: "POST",
    body: JSON.stringify(settings),
  });
};
