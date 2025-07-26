import { createContext, useContext, useEffect, useState } from 'react';

type AppContextType = {
  user: any;
  theme: string;
  setTheme: (theme: string) => void;
  isLoading: boolean;
  error: string | null;
  notifications: any[];
  addNotification: (msg: string) => void;
  removeNotification: (id: number) => void;
  cart: any[];
  addToCart: (item: any) => void;
  setUser: (user: any) => void;
  setError: (error: string | null) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    // Mock user data instead of API call
    setUser({ id: 1, name: 'Demo User', email: 'demo@example.com' });
    setIsLoading(false);
  }, []);

  const addNotification = (message: string) => {
    const newNotification = {
      id: Date.now(),
      message,
      timestamp: new Date().toISOString()
    };

    setNotifications(prev => [...prev, newNotification]);

    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id
            ? { ...i, quantity: (i.quantity || 1) + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    addNotification('Item added to cart');
  };

  const value = {
    user,
    theme,
    setTheme,
    isLoading,
    error,
    notifications,
    addNotification,
    removeNotification,
    cart,
    addToCart,
    setUser,
    setError
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};