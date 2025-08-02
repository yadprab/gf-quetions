// Main application file - last updated by dev3
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CustomerPage } from './components/legacy/customer/CustomerPage';
import Details from './views/CustomerDetails/CustomerDetailsPage';
import DashboardPage from './views/dashboard/DashboardPage';
import SettingsPage from './views/settings/SettingsPage';
import SideNavbar from './components/Navigation/SideNavbar';
import TopNavbar from './components/Navigation/TopNavbar';
import { AppProvider } from './context/AppContext';
import './App.css';
import InvoiceManagement from './components/InvoiceManagement';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <AppProvider>
      <Router>
        <div className="App min-h-screen">
          <TopNavbar 
            onToggleSidebar={toggleSidebar}
            sidebarCollapsed={sidebarCollapsed}
          />
          <div className="flex">
            <SideNavbar 
              isCollapsed={sidebarCollapsed}
            />
            <div className={`flex-1 pt-16 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
              <main className="p-8 bg-[#f3f8fd]">
                <Routes>
                  {/* <Route path="/" element={<h1 >Customer Portal</h1>} /> */}
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/invoices" element={<InvoiceManagement />} />
                  <Route path="/customers" element={<CustomerPage />} />
                  <Route path="/customer-details" element={<Details />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/settings/:tab" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
