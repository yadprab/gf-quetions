export interface User {
  id: string;
  name: string;
  permissions?: string[];
}

export interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

export interface CartItem {
  id: string;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  purchases?: { amount: number }[];
}

export interface Invoice {
  id: string;
  customer: Customer;
  amount: number;
  dueDate: string;
  status: string;
  lastUpdated?: Date;
  daysOverdue?: number;
  [key: string]: unknown;
}

export interface InvoicesApiResponse {
  data: Invoice[];
  [key: string]: unknown;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms?: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  preferences: Record<string, any>;
}

export interface SettingsApiResponse {
  settings: UserSettings;
}
