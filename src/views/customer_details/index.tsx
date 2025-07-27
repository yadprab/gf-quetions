// Customer details view - created by dev1
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatting";
import { Link } from "react-router-dom";

const CustomerDetailsPage = () => {
  const [customer, setCustomer] = useState({
    id: "CUST-001",
    name: "John Doe",
    email: "john@example.com",
  });

  useEffect(() => {
    // No need to fetch data, it's static now
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
      <Link to="/" className="text-primary hover:underline">
        Back to List
      </Link>
    </div>
  );
};

export default CustomerDetailsPage;
