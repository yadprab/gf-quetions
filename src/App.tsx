// Main application file - last updated by dev3
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CustomerPage } from './components/legacy/customer/CustomerPage';
import CustomerDetailsPage from './views/CustomerDetails/CustomerDetailsPage';
import DashboardPage from './views/dashboard/DashboardPage';
import SettingsPage from './views/settings/SettingsPage';
import { AppProvider } from './context/AppContext';
import Layout from './components/layouts/Layout';
import './App.css';
import InvoicePage from './views/invoice/InvoicePage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
          <Route path="/" element={<Navigate to="/invoice" replace />} />
            <Route path="/dashboard" element={<DashboardPage userId={1} />} />
            <Route path="/invoice" element={<InvoicePage />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/customer-details" element={<CustomerDetailsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/:tab" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;