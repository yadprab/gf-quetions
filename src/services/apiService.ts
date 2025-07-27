import { ENDPOINTS, STORAGE_KEYS } from "../config";
import { API_CONFIG } from "../config/env";
import useStore from "../store/useStore";
import type { User, Customer, UserSettings } from "../types";

interface AuthResponse {
  token: string;
  user: User;
}

interface Activity {
  description: string;
  timestamp: string;
}

const getAuthToken = (): string | null => {
  // Get token from Zustand store or localStorage
  return localStorage.getItem(STORAGE_KEYS.token); // Assuming token is still stored in localStorage for now
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

export const fetchCustomers = (): Promise<Customer[]> => {
  return request<Customer[]>(ENDPOINTS.users); // Assuming ENDPOINTS.users returns customers
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
  // Store token in localStorage for now, will move to Zustand later
  localStorage.setItem(STORAGE_KEYS.token, data.token);
  useStore.getState().setUser(data.user); // Update user in Zustand store
  return data;
};

export const fetchUser = (userId: string): Promise<User> => {
  return request<User>(`${ENDPOINTS.users}/${userId}`);
};

export const fetchUserActivity = (userId: string): Promise<Activity[]> => {
  return request<Activity[]>(`${ENDPOINTS.users}/${userId}/activity`);
};

export const fetchSettings = (): Promise<UserSettings> => {
  return request<UserSettings>(`/api/settings`); // Assuming a settings endpoint
};

export const saveSettings = (settings: UserSettings): Promise<UserSettings> => {
  return request<UserSettings>(`/api/settings`, {
    method: 'POST',
    body: JSON.stringify(settings),
  });
};
