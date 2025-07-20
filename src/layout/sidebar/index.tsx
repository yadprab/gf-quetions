import { NavLink } from "react-router-dom";
import "./styles.css"

export const SideBar = () => {
  return (
    <>
      <NavLink to="/" end className="nav-link">
        Home
      </NavLink>
      <NavLink to="/dashboard" className="nav-link">
        Dashboard
      </NavLink>
      <NavLink to="/customers" className="nav-link">
        Customers
      </NavLink>
      <NavLink to="/customer-details" className="nav-link">
        Customer Details
      </NavLink>
      <NavLink to="/settings" className="nav-link">
        Settings
      </NavLink>
    </>
  );
};
