// Main application file - last updated by dev3
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { CustomerPage } from './components/legacy/customer/CustomerPage';
import CustomerDetailsPage from './views/CustomerDetails/CustomerDetailsPage.jsx';
import DashboardPage from './views/dashboard/DashboardPage';
import SettingsPage from './views/settings/SettingsPage';
import InvoiceDashboard from './views/invoices/InvoiceDashboard';
import HomePage from './views/HomePage';
import { AppProvider } from './context/AppContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';
import './styles/invoices.css';

// Navigation component with proper React Router integration
const Navigation = () => {
  const location = useLocation();
  const { isDark } = useTheme();
  
  // Clean white theme link styles
  const linkStyle = {
    margin: '0 10px',
    textDecoration: 'none',
    color: isDark ? '#e5e7eb' : '#374151',
    padding: '8px 16px',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    fontWeight: '500'
  };
  
  // Active state logic using React Router's location
  const isActive = (path: string) => {
    return location.pathname === path ? {
      ...linkStyle,
      backgroundColor: '#3b82f6',
      color: 'white',
      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
    } : linkStyle;
  };
  
  return (
    <nav style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: '15px 20px',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderBottom: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
      <Link to="/" style={isActive('/')} onMouseEnter={(e) => {
        if (location.pathname !== '/') {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
          e.currentTarget.style.color = '#374151';
        }
      }} onMouseLeave={(e) => {
        if (location.pathname !== '/') {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#374151';
        }
      }}>Home</Link>
      <Link to="/dashboard" style={isActive('/dashboard')} onMouseEnter={(e) => {
        if (location.pathname !== '/dashboard') {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
          e.currentTarget.style.color = '#374151';
        }
      }} onMouseLeave={(e) => {
        if (location.pathname !== '/dashboard') {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#374151';
        }
      }}>Dashboard</Link>
      <Link to="/invoices" style={isActive('/invoices')} onMouseEnter={(e) => {
        if (location.pathname !== '/invoices') {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
          e.currentTarget.style.color = '#374151';
        }
      }} onMouseLeave={(e) => {
        if (location.pathname !== '/invoices') {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#374151';
        }
      }}>Invoices</Link>
      <Link to="/customers" style={isActive('/customers')} onMouseEnter={(e) => {
        if (location.pathname !== '/customers') {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
          e.currentTarget.style.color = '#374151';
        }
      }} onMouseLeave={(e) => {
        if (location.pathname !== '/customers') {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#374151';
        }
      }}>Customers</Link>
      <Link to="/customer-details" style={isActive('/customer-details')} onMouseEnter={(e) => {
        if (location.pathname !== '/customer-details') {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
          e.currentTarget.style.color = '#374151';
        }
      }} onMouseLeave={(e) => {
        if (location.pathname !== '/customer-details') {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#374151';
        }
      }}>Customer Details</Link>
      <Link to="/settings" style={isActive('/settings')} onMouseEnter={(e) => {
        if (location.pathname !== '/settings') {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
          e.currentTarget.style.color = '#374151';
        }
      }} onMouseLeave={(e) => {
        if (location.pathname !== '/settings') {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#374151';
        }
      }}>Settings</Link>
        </div>
        <ThemeToggle size="sm" />
      </div>
    </nav>
  );
};

// App content component that uses theme
const AppContent = () => {
  const { isDark } = useTheme();
  const location = useLocation();
  
  // Don't apply background color to HomePage since it has its own gradient
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="App" style={{ 
      padding: '80px 20px 20px 20px', 
      backgroundColor: isHomePage ? 'transparent' : (isDark ? '#111827' : '#ffffff'), 
      minHeight: '90vh',
      color: isDark ? '#e5e7eb' : '#374151'
    }}>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/invoices" element={<InvoiceDashboard />} />
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/customer-details" element={<CustomerDetailsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/:tab" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <AppContent />
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
