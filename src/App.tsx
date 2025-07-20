// Main application file - last updated by dev3
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { CustomerPage } from "./components/legacy/customer/CustomerPage";
import Details from "./views/CustomerDetails/CustomerDetailsPage";
import DashboardPage from "./views/dashboard/DashboardPage";
import SettingsPage from "./views/settings/SettingsPage";
import { InvoicePage } from "./views/invoices/index";
import { AppProvider } from "./context/AppContext";
import "./App.css";
import Layout from "./layout";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<h1>Customer Portal</h1>} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/invoices" element={<InvoicePage />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/customer-details" element={<Details />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/:tab" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
