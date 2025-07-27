import React, { useState, useEffect, useMemo } from "react";
import { fetchCustomers, fetchUserActivity } from "../../services/apiService";
import { formatCurrency } from "../../utils/formatting";
import StatCard from "../../components/stat_card";
import ActivityItem from "../../components/activity_item";
import ActionItem from "../../components/action_item";
import useStore from "../../store/useStore";

// Import react-icons
import {
  FaDollarSign,
  FaExclamationTriangle,
  FaUsers,
  FaClock,
} from "react-icons/fa";
import { MdFlashOn, MdWarning } from "react-icons/md";

interface DashboardPageProps {
  // userId is no longer a prop, it comes from the store
}

interface Stats {
  totalCustomers: number;
  totalRevenue: number;
  // Add other stats properties as needed
}

const DashboardPage = () => {
  const { user, isLoading, error, setError } = useStore();
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!user?.id) return; // Only load data if user is available

      try {
        const [customers, activity] = await Promise.all([
          fetchCustomers(),
          fetchUserActivity(user.id),
        ]);

        if (isMounted) {
          const totalRevenue = customers.reduce(
            (sum, customer) =>
              sum +
              (customer.purchases?.reduce((s, p) => s + p.amount, 0) || 0),
            0
          );

          setStats({
            totalCustomers: customers.length,
            totalRevenue,
            // ... other stats
          });

          setRecentActivity(activity);
        }
      } catch (err) {
        if (isMounted)
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
      } finally {
        // isLoading is managed by useStore
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user, setError]); // Depend on user to refetch when user data is loaded

  const formattedRevenue = useMemo(() => {
    console.log("Formatting revenue...");
    return formatCurrency(stats.totalRevenue || 0);
  }, [stats.totalRevenue]);

  const customerCountText = useMemo(
    () => `Total Customers: ${stats.totalCustomers || 0}`,
    [stats.totalCustomers]
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
      {/* Left Column */}
      <div>
        {/* Dashboard Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Collections Dashboard
          </h1>
          <p className="text-base text-secondary">
            Monitor and manage your accounts receivable in real-time
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            label="Total Outstanding"
            value={formattedRevenue}
            icon={<FaDollarSign className="text-white" />}
            iconBgColor="bg-blue-500"
            percentageChange="+5.2%"
            percentageColor="success"
          />
          <StatCard
            label="Overdue Invoices"
            value="120"
            icon={<FaExclamationTriangle className="text-white" />}
            iconBgColor="bg-red-500"
            percentageChange="-1.5%"
            percentageColor="error"
          />
          <StatCard
            label="Customers"
            value={customerCountText}
            icon={<FaUsers className="text-white" />}
            iconBgColor="bg-green-500"
            percentageChange="+2.1%"
            percentageColor="success"
          />
          <StatCard
            label="Avg. Payment Time"
            value="32 Days"
            icon={<FaClock className="text-white" />}
            iconBgColor="bg-purple-500"
            percentageChange="+0.8%"
            percentageColor="error"
          />
        </div>

        {/* Invoice Management (Placeholder for DataTableContainer) */}
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Invoice Management
          </h2>
          {/* DataTableContainer will go here */}
          <p>Placeholder for Invoice Table</p>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-6">
        {/* Recent Activity Card */}
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MdFlashOn className="text-xl text-info" />
            <h3 className="text-lg font-bold text-foreground">
              Recent Activity
            </h3>
          </div>
          <div className="flex flex-col gap-4">
            <ActivityItem
              title="Invoice #INV-2023-001 Paid"
              subtitle="by John Doe"
              timestamp="2 hours ago"
              titleColorClass="text-success"
            />
            <ActivityItem
              title="New Customer Added"
              subtitle="Jane Smith"
              timestamp="1 day ago"
              titleColorClass="text-primary"
            />
            <ActivityItem
              title="Invoice #INV-2023-005 Overdue"
              subtitle="for Acme Corp"
              timestamp="3 days ago"
              titleColorClass="text-error"
            />
          </div>
        </div>

        {/* Priority Actions Card */}
        <div className="bg-card rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MdWarning className="text-xl text-warning" />
            <h3 className="text-lg font-bold text-foreground">
              Priority Actions
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            <ActionItem
              title="Follow up on INV-2023-005"
              subtitle="Overdue by 3 days"
              statusColor="error"
            />
            <ActionItem
              title="Review pending payments"
              subtitle="5 invoices pending"
              statusColor="warning"
            />
            <ActionItem
              title="Approve new customer"
              subtitle="New registration from Acme Corp"
              statusColor="success"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
