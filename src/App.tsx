// Main application file - last updated by dev3
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardPage from "./views/dashboard";
import SettingsPage from "./views/settings";
import "./App.css";
import CustomerDetailsPage from "./views/customer_details";

import useStore from "./store/useStore";
import AppLayout from "./layout";

function App() {
  const { theme, loadUser, loadFeatureFlags } = useStore();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    loadUser();
    loadFeatureFlags();
  }, [loadUser, loadFeatureFlags]);

  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<h1>Customer Portal</h1>} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/customer-details" element={<CustomerDetailsPage />} />
          <Route path="/customers" element={<p>Customers List</p>} />
          <Route path="/analytics" element={<p>Analytics</p>} />
          <Route path="/collections" element={<p>Collections</p>} />
          <Route path="/payments" element={<p>Payments</p>} />
          <Route path="/activity" element={<p>Activity</p>} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/:tab" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
