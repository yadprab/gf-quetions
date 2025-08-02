// Main application file - last updated by dev3
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { CustomerPage } from './components/legacy/customer/CustomerPage';
import Details from './views/CustomerDetails/CustomerDetailsPage';
import DashboardPage from './views/dashboard/DashboardPage';
import SettingsPage from './views/settings/SettingsPage';
import Navigation from './components/Navigation/Navigation';
import { AppProvider } from './context/AppContext';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App min-h-screen ">
          <Navigation />
          <main className="pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<h1 >Customer Portal</h1>} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/customers" element={<CustomerPage />} />
                <Route path="/customer-details" element={<Details />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/settings/:tab" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
