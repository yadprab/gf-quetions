import React, { useState, useEffect, useMemo } from 'react';

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  daysOverdue: number;
}

const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Invoice>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const loadInvoices = async () => {
      const mockInvoices: Invoice[] = [
        { id: 'INV-001', customer: 'Acme Corp', amount: 5000, dueDate: '2024-01-15', status: 'overdue', daysOverdue: 10 },
        { id: 'INV-002', customer: 'Tech Solutions', amount: 3200, dueDate: '2024-01-20', status: 'pending', daysOverdue: 0 },
        { id: 'INV-003', customer: 'Global Inc', amount: 7500, dueDate: '2024-01-25', status: 'paid', daysOverdue: 0 },
        { id: 'INV-004', customer: 'StartupXYZ', amount: 1800, dueDate: '2024-01-30', status: 'draft', daysOverdue: 0 },
        { id: 'INV-005', customer: 'Enterprise Ltd', amount: 12000, dueDate: '2024-02-05', status: 'pending', daysOverdue: 0 }
      ];
      setInvoices(mockInvoices);
      setLoading(false);
    };

    loadInvoices();
  }, []);

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setInvoices(prev => 
      prev.map(inv => 
        inv.id === id ? { ...inv, status: newStatus as Invoice['status'] } : inv
      )
    );
  };

  const handleSort = (field: keyof Invoice) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  const filteredAndSortedInvoices = useMemo(() => {
    let result = [...invoices];
    
    if (statusFilter) {
      result = result.filter(inv => inv.status === statusFilter);
    }
    
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      return aVal < bVal ? -modifier : aVal > bVal ? modifier : 0;
    });
    
    return result;
  }, [invoices, statusFilter, sortField, sortDirection]);

  const getStatusStyle = (status: string) => {
    const styles = {
      paid: { backgroundColor: '#d4edda', color: '#155724' },
      pending: { backgroundColor: '#fff3cd', color: '#856404' },
      overdue: { backgroundColor: '#f8d7da', color: '#721c24' },
      draft: { backgroundColor: '#e2e3e5', color: '#383d41' }
    };
    return styles[status as keyof typeof styles] || {};
  };

  if (loading) return <div>Loading invoices...</div>;

  return (
    <div style={{ padding: '25px', minHeight: 'calc(100vh - 60px)', width: '100vw', boxSizing: 'border-box', margin: 0 }}>
      <h1 style={{ marginTop: 0, marginBottom: '30px', fontSize: '28px' }}>Invoice Management</h1>
      
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
          <option value="draft">Draft</option>
        </select>
        </div>
        <div style={{ fontSize: '16px', fontWeight: '500', color: '#495057' }}>
          Total: {invoices.length} invoices
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e9ecef' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f8f9fa' }}>
          <tr>
            <th onClick={() => handleSort('id')} style={{ padding: '12px', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid #dee2e6' }}>
              Invoice # {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('customer')} style={{ padding: '12px', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid #dee2e6' }}>
              Customer {sortField === 'customer' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('amount')} style={{ padding: '12px', textAlign: 'right', cursor: 'pointer', borderBottom: '1px solid #dee2e6' }}>
              Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('dueDate')} style={{ padding: '12px', textAlign: 'left', cursor: 'pointer', borderBottom: '1px solid #dee2e6' }}>
              Due Date {sortField === 'dueDate' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Days Overdue</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedInvoices.map((invoice) => (
            <tr key={invoice.id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '12px', fontWeight: '500' }}>{invoice.id}</td>
              <td style={{ padding: '12px' }}>{invoice.customer}</td>
              <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>
                ${invoice.amount.toLocaleString()}
              </td>
              <td style={{ padding: '12px' }}>{new Date(invoice.dueDate).toLocaleDateString()}</td>
              <td style={{ padding: '12px', color: invoice.daysOverdue > 0 ? '#dc3545' : '#6c757d' }}>
                {invoice.daysOverdue > 0 ? `${invoice.daysOverdue} days` : '-'}
              </td>
              <td style={{ padding: '12px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  ...getStatusStyle(invoice.status)
                }}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <select
                  value={invoice.status}
                  onChange={(e) => handleStatusUpdate(invoice.id, e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '14px', color: '#6c757d' }}>
          Showing {filteredAndSortedInvoices.length} of {invoices.length} invoices
        </div>
        <div style={{ fontSize: '14px', color: '#495057' }}>
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;