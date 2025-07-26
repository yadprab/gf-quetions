// Main application file - last updated by dev3
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import CustomerPage from './components/legacy/customer/CustomerPage.jsx';
import CustomerDetailsPage from './views/CustomerDetails/CustomerDetailsPage.jsx';
import DashboardPage from './views/dashboard/DashboardPage.jsx';
import SettingsPage from './views/settings/SettingsPage.tsx';
import InvoiceList from './components/InvoiceManagement/InvoiceList';
import { AppProvider } from './context/AppContext';
import { InvoiceProvider } from './context/InvoiceContext';
import './App.css';

const Navigation = () => {
  const location = useLocation();
  
  const linkStyle = {
    margin: '0 10px',
    textDecoration: 'none',
    color: '#333',
    padding: '8px 16px',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    display: 'inline-block'
  };
  
  const isActive = (path: string) => {
    const isCurrentPath = location.pathname === path || 
      (path === '/settings' && location.pathname.startsWith('/settings'));
    
    return isCurrentPath ? {
      ...linkStyle,
      backgroundColor: '#007bff',
      color: 'white'
    } : linkStyle;
  };
  
  return (
    <nav style={{ 
      padding: '15px 0',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #dee2e6',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ padding: '0 20px' }}>
        <Link to="/dashboard" style={isActive('/dashboard')}>Dashboard</Link>
        <Link to="/customers" style={isActive('/customers')}>Customers</Link>
        <Link to="/" style={isActive('/')}>Invoices</Link>
        <Link to="/customer-details" style={isActive('/customer-details')}>Customer Details</Link>
        <Link to="/settings" style={isActive('/settings')}>Settings</Link>
      </div>
    </nav>
  );
};

function App() {
  try {
    return (
      <AppProvider>
        <InvoiceProvider>
          <Router>
            <div className="App" style={{ margin: 0, padding: 0, paddingTop: '60px' }}>
              <div style={{ textAlign: 'left' }}>
              <Navigation />
              <Routes>
                <Route path="/" element={<InvoiceList />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/customers" element={<CustomerPage />} />
                <Route path="/customer-details" element={<CustomerDetailsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/settings/:tab" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              </div>
            </div>
          </Router>
        </InvoiceProvider>
      </AppProvider>
    );
  } catch (error) {
    return <div>Error loading application: {String(error)}</div>;
  }
}

export default App;