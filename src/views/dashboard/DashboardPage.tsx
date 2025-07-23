import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { formatMoney } from '../../utils/formatting';
import { InvoiceStats } from '../../components/invoices/InvoiceStats';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

// Types
interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  daysOverdue: number;
  lastUpdated: string;
  assignedTo?: string;
}

interface DashboardStats {
  totalCustomers: number;
  totalRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  overdueInvoices: number;
  pendingInvoices: number;
  totalInvoiceAmount: number;
  overdueAmount: number;
  paidPercentage: number;
}

const DashboardPage = ({ userId }: { userId?: string }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalRevenue: 0,
    totalInvoices: 0,
    paidInvoices: 0,
    overdueInvoices: 0,
    pendingInvoices: 0,
    totalInvoiceAmount: 0,
    overdueAmount: 0,
    paidPercentage: 0
  });
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{id: string; description: string; timestamp: string}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API calls with mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock customers data
      const mockCustomers = Array.from({ length: 25 }, (_, index) => ({
        id: `customer-${index + 1}`,
        name: `Customer ${index + 1}`,
        purchases: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
          amount: Math.floor(Math.random() * 10000) + 1000
        }))
      }));
      
      // Mock invoices data
      const mockInvoices: Invoice[] = Array.from({ length: 50 }, (_, index) => ({
        id: `inv-${index + 1}`,
        invoiceNumber: `INV-${String(index + 1).padStart(4, '0')}`,
        customerName: `Customer ${Math.floor(Math.random() * 25) + 1}`,
        amount: Math.floor(Math.random() * 50000) + 1000,
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: ['draft', 'sent', 'paid', 'overdue', 'cancelled'][Math.floor(Math.random() * 5)] as Invoice['status'],
        daysOverdue: Math.floor(Math.random() * 90),
        lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: Math.random() > 0.5 ? `User ${Math.floor(Math.random() * 5) + 1}` : undefined
      }));
      
      // Mock activity data
      const mockActivity = Array.from({ length: 10 }, (_, index) => ({
        id: `activity-${index + 1}`,
        description: [
          'Invoice INV-001 marked as paid',
          'New customer added: Customer 15',
          'Invoice INV-023 is now overdue',
          'Payment received from Customer 8',
          'Invoice INV-045 sent to Customer 12',
          'Status updated for Invoice INV-067',
          'New invoice created for Customer 3',
          'Payment reminder sent for Invoice INV-089',
          'Customer 20 updated their information',
          'Invoice INV-101 cancelled'
        ][index],
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      // Calculate statistics
      const totalCustomers = mockCustomers.length;
      const totalRevenue = mockCustomers.reduce(
        (sum, customer) => sum + (customer.purchases?.reduce(
          (s, p) => s + p.amount, 0
        ) || 0), 0
      );
      
      const totalInvoices = mockInvoices.length;
      const paidInvoices = mockInvoices.filter(inv => inv.status === 'paid').length;
      const overdueInvoices = mockInvoices.filter(inv => inv.status === 'overdue').length;
      const pendingInvoices = mockInvoices.filter(inv => inv.status === 'sent').length;
      const totalInvoiceAmount = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
      const overdueAmount = mockInvoices
        .filter(inv => inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.amount, 0);
      
      setStats({
        totalCustomers,
        totalRevenue,
        totalInvoices,
        paidInvoices,
        overdueInvoices,
        pendingInvoices,
        totalInvoiceAmount,
        overdueAmount,
        paidPercentage: totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0
      });
      
      // Get recent invoices (last 5)
      const recentInvoicesData = mockInvoices
        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        .slice(0, 5);
      
      setRecentInvoices(recentInvoicesData);
      setRecentActivity(mockActivity);
      
         } catch (err) {
       setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  
  // Memoized calculations
  const formattedRevenue = useMemo(() => {
    return formatMoney(stats.totalRevenue);
  }, [stats.totalRevenue]);
  
  const formattedInvoiceAmount = useMemo(() => {
    return formatMoney(stats.totalInvoiceAmount);
  }, [stats.totalInvoiceAmount]);
  
  const formattedOverdueAmount = useMemo(() => {
    return formatMoney(stats.overdueAmount);
  }, [stats.overdueAmount]);
  
  // Invoice stats for the widget
  const invoiceStats = useMemo(() => ({
    total: stats.totalInvoices,
    paid: stats.paidInvoices,
    overdue: stats.overdueInvoices,
    pending: stats.pendingInvoices,
    totalAmount: stats.totalInvoiceAmount,
    overdueAmount: stats.overdueAmount,
    paidPercentage: stats.paidPercentage
  }), [stats]);
  
  // Get status style
  const getStatusStyle = (status: Invoice['status']) => {
    const styles = {
      paid: 'bg-green-100 text-green-800',
      sent: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-gray-100 text-gray-600'
    };
    return styles[status] || styles.draft;
  };
  
  if (isLoading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <div className="text-red-600 p-4">Error: {error}</div>;
  
  return (
    <div className="dashboard-page p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's an overview of your business.</p>
        </div>
        
        {/* Invoice Statistics Widget */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice Overview</h2>
          <InvoiceStats stats={invoiceStats} />
        </div>
        
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formattedRevenue}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <span className="text-2xl">📄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Invoice Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formattedInvoiceAmount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formattedOverdueAmount}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Invoices and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Invoices */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Invoices</h2>
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{invoice.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatMoney(invoice.amount)}</p>
                    <p className="text-xs text-gray-500">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                View All Invoices →
              </button>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
