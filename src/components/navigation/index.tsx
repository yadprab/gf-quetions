import NavItem from "./nav.item";

import { MdDashboard, MdOutlineAnalytics, MdPayment } from "react-icons/md";
import { FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { IoReceiptOutline } from "react-icons/io5";
import { LuActivity } from "react-icons/lu";

const Navigation = () => {
  return (
    <div className="flex flex-col gap-2">
      <NavItem to="/dashboard" icon={<MdDashboard />} label="Dashboard" />
      <NavItem to="/customers" icon={<FaUsers />} label="Customers" />
      <NavItem
        to="/customer-details"
        icon={<IoReceiptOutline />}
        label="Invoices"
      />
      <NavItem
        to="/analytics"
        icon={<MdOutlineAnalytics />}
        label="Analytics"
      />
      <NavItem
        to="/collections"
        icon={<FaMoneyBillWave />}
        label="Collections"
      />
      <NavItem to="/payments" icon={<MdPayment />} label="Payments" />
      <NavItem to="/activity" icon={<LuActivity />} label="Activity" />
    </div>
  );
};

export default Navigation;