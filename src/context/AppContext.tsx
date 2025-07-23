
import { createContext, useContext, useEffect, useState } from 'react';

type AppContextType = {
  user: any;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch('/api/me');
        const userData = await response.json();
        setUser(userData);
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
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
