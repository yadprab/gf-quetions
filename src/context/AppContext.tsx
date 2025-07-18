// Bad: Overused context, improper typing, and side effects
import { createContext, useContext, useEffect, useState } from 'react';

// Overly broad context type
type AppContextType = {
  user: any; // No proper type
  theme: string;
  setTheme: (theme: string) => void;
  isLoading: boolean;
  error: string | null;
  // Too many unrelated values in one context
  notifications: any[];
  addNotification: (msg: string) => void;
  removeNotification: (id: number) => void;
  // Business logic mixed with UI state
  cart: any[];
  addToCart: (item: any) => void;
  // ... more unrelated state
};

// No default values for required context
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Overly complex provider with too many responsibilities
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState('light');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  
  // Side effect that should be in a custom hook
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
    
    // No cleanup
  }, []);
  
  // Inefficient notification handling
  const addNotification = (message: string) => {
    const newNotification = {
      id: Date.now(),
      message,
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Side effect in business logic
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  };
  
  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  // Business logic mixed with UI state
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
    
    // Side effect - should be handled by the component
    addNotification('Item added to cart');
  };
  
  // Huge context value object causing unnecessary re-renders
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
    // Exposing setState directly - bad practice
    setUser,
    setError
  };
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Unsafe hook without proper error handling
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    console.error('useAppContext must be used within an AppProvider');
    // No proper error boundary or fallback
    return {} as AppContextType;
  }
  return context;
};
