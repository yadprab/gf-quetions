import { create } from "zustand";
import { STORAGE_KEYS } from "../config";

import type { User, CartItem, Notification } from "../types";
import { fetchFeatureFlags, fetchUsers } from "../services/apiService";

interface StoreState {
  theme: "light" | "dark";
  user: User | null;
  isLoading: boolean;
  error: string | null;
  notifications: Notification[];
  cart: CartItem[];
  featureFlags: Record<string, boolean>;
  sideBarOpened: boolean;
}

interface StoreActions {
  toggleTheme: () => void;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  addNotification: (message: string) => void;
  removeNotification: (id: number) => void;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  loadUser: () => Promise<void>;
  loadFeatureFlags: () => Promise<void>;
  isFeatureEnabled: (featureName: string) => boolean;
  overrideFeatureFlag: (feature: string, enabled: boolean) => void;
  toggleSidebar: () => void;
}

type AppStore = StoreState & StoreActions;

const useStore = create<AppStore>((set, get) => ({
  theme:
    (localStorage.getItem(STORAGE_KEYS.theme) as "light" | "dark") || "light",
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEYS.theme, newTheme);
      return { theme: newTheme };
    }),

  user: null,
  isLoading: true,
  setLoading: (isLoading: boolean) => set({ isLoading }),
  error: null,
  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),

  cart: [],

  notifications: [],
  addNotification: (message) => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));
    setTimeout(() => {
      get().removeNotification(newNotification.id);
    }, 5000);
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  addToCart: (item) => {
    set((state) => {
      const existing = state.cart.find((i) => i.id === item.id);
      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: (i.quantity || 0) + 1 } : i
          ),
        };
      }
      return { cart: [...state.cart, { ...item, quantity: 1 }] };
    });
    get().addNotification("Item added to cart");
  },

  // Feature flags state
  featureFlags: {},
  isFeatureEnabled: (featureName) => {
    return !!get().featureFlags[featureName];
  },
  overrideFeatureFlag: (feature, enabled) => {
    set((state) => ({
      featureFlags: {
        ...state.featureFlags,
        [feature]: enabled,
      },
    }));
  },
  loadFeatureFlags: async () => {
    try {
      const response = await fetchFeatureFlags();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const flags: Record<string, boolean> = await response.json();
      set({ featureFlags: flags });
    } catch (err) {
      console.error("Failed to load feature flags", err);
    }
  },

  loadUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetchUsers();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const userData: User = await response.json();
      set({ user: userData });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load user data",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Sidebar state
  sideBarOpened: true, // Default to opened
  toggleSidebar: () =>
    set((state) => ({ sideBarOpened: !state.sideBarOpened })),
}));

export default useStore;
