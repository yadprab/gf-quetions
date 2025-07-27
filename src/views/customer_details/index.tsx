// Customer details view - created by dev1
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatting";
import { Link } from "react-router-dom";
import { fetchCustomers } from "../../services/apiService";

const CustomerDetailsPage = () => {
  const [customer, setCustomer] = useState<{
    id: string;
    name: string;
    email: string;
  }>({
    id: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    const getCustomer = async () => {
      const data = await fetchCustomers();
      setCustomer(data);
    };
    getCustomer();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">Customer Details</h1>
      <div className="bg-card rounded-lg shadow-sm p-6 mb-6 text-foreground">
        <div>ID: {customer.id}</div>
        <div>Name: {customer.name}</div>
        <div>Email: {customer.email}</div>
        <div>Member Since: {formatDate(new Date())}</div>
      </div>
      <Link to="/customers" className="text-primary hover:underline">
        Back to List
      </Link>
    </div>
  );
};

export default CustomerDetailsPage;
