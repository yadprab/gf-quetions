import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { InvoiceTable } from '../../components/invoices/InvoiceTable';
import { InvoiceFilters } from '../../components/invoices/InvoiceFilters';
import { CollaborationPanel } from '../../components/invoices/CollaborationPanel';
import { InvoiceModal } from '../../components/invoices/InvoiceModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

// Types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  daysOverdue: number;
  lastUpdated: string;
  assignedTo?: string;
  comments: Comment[];
  tags: string[];
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  type: 'comment' | 'status_change' | 'assignment';
}

export interface FilterState {
  status: string;
  amountRange: { min: number; max: number };
  daysOverdue: number;
  assignedTo: string;
  searchTerm: string;
}

export interface SortConfig {
  key: keyof Invoice;
  direction: 'asc' | 'desc';
}

const InvoiceDashboard: React.FC = () => {
  const { user, addNotification } = useAppContext();
  
  // State management
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    status: '',
    amountRange: { min: 0, max: 100000 },
    daysOverdue: 0,
    assignedTo: '',
    searchTerm: ''
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'dueDate',
    direction: 'asc'
  });
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<Record<string, any>>({});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Memoized filtered and sorted invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const matchesStatus = !filters.status || invoice.status === filters.status;
      const matchesAmount = invoice.amount >= filters.amountRange.min && 
                           invoice.amount <= filters.amountRange.max;
      const matchesDaysOverdue = filters.daysOverdue === 0 || 
                                 invoice.daysOverdue >= filters.daysOverdue;
      const matchesAssignedTo = !filters.assignedTo || 
                                invoice.assignedTo === filters.assignedTo;
      const matchesSearch = !filters.searchTerm || 
                           invoice.customerName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           invoice.invoiceNumber.toLowerCase().includes(filters.searchTerm.toLowerCase());

      return matchesStatus && matchesAmount && matchesDaysOverdue && 
             matchesAssignedTo && matchesSearch;
    });
  }, [invoices, filters]);

  const sortedInvoices = useMemo(() => {
    return [...filteredInvoices].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
      
      return 0;
    });
  }, [filteredInvoices, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = sortedInvoices.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortConfig]);

  // Memoized statistics
  const stats = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter(inv => inv.status === 'paid').length;
    const overdue = invoices.filter(inv => inv.status === 'overdue').length;
    const pending = invoices.filter(inv => inv.status === 'sent').length;
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const overdueAmount = invoices
      .filter(inv => inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);

    return {
      total,
      paid,
      overdue,
      pending,
      totalAmount,
      overdueAmount,
      paidPercentage: total > 0 ? (paid / total) * 100 : 0
    };
  }, [invoices]);

  // Fetch invoices
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockInvoices: Invoice[] = Array.from({ length: 100 }, (_, index) => ({
        id: `inv-${index + 1}`,
        invoiceNumber: `INV-${String(index + 1).padStart(4, '0')}`,
        customerName: `Customer ${index + 1}`,
        amount: Math.floor(Math.random() * 50000) + 1000,
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: ['draft', 'sent', 'paid', 'overdue', 'cancelled'][Math.floor(Math.random() * 5)] as Invoice['status'],
        daysOverdue: Math.floor(Math.random() * 90),
        lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: Math.random() > 0.5 ? `User ${Math.floor(Math.random() * 5) + 1}` : undefined,
        comments: [],
        tags: []
      }));

      setInvoices(mockInvoices);
    } catch (err) {
      setError('Failed to fetch invoices');
      addNotification('Error loading invoices');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  // Update invoice status
  const updateInvoiceStatus = useCallback(async (invoiceId: string, newStatus: Invoice['status']) => {
    try {
      setInvoices(prev => prev.map(invoice => 
        invoice.id === invoiceId 
          ? { 
              ...invoice, 
              status: newStatus,
              lastUpdated: new Date().toISOString(),
              daysOverdue: newStatus === 'overdue' ? 
                Math.max(0, Math.floor((Date.now() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))) : 
                invoice.daysOverdue
            }
          : invoice
      ));

      addNotification(`Invoice status updated to ${newStatus}`);
    } catch (err) {
      addNotification('Failed to update invoice status');
    }
  }, [addNotification]);

  // Update invoice with status and comment
  const handleInvoiceUpdate = useCallback(async (invoiceId: string, updates: { status: Invoice['status']; comment?: string }) => {
    try {
      setInvoices(prev => prev.map(invoice => {
        if (invoice.id === invoiceId) {
          const updatedInvoice = {
            ...invoice,
            status: updates.status,
            lastUpdated: new Date().toISOString(),
            daysOverdue: updates.status === 'overdue' ? 
              Math.max(0, Math.floor((Date.now() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))) : 
              invoice.daysOverdue
          };

          // Add comment if provided
          if (updates.comment) {
            const newComment: Comment = {
              id: `comment-${Date.now()}`,
              text: updates.comment,
              author: user?.name || 'Unknown User',
              timestamp: new Date().toISOString(),
              type: 'comment'
            };
            updatedInvoice.comments = [...invoice.comments, newComment];
          }

          return updatedInvoice;
        }
        return invoice;
      }));

      addNotification(`Invoice updated successfully${updates.comment ? ' with comment' : ''}`);
    } catch (err) {
      addNotification('Failed to update invoice');
      throw err; // Re-throw to let the modal handle the error
    }
  }, [user, addNotification]);

  // Add comment to invoice
  const addComment = useCallback((invoiceId: string, commentText: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      text: commentText,
      author: user?.name || 'Unknown User',
      timestamp: new Date().toISOString(),
      type: 'comment'
    };

    setInvoices(prev => prev.map(invoice => 
      invoice.id === invoiceId 
        ? { 
            ...invoice, 
            comments: [...invoice.comments, newComment],
            lastUpdated: new Date().toISOString()
          }
        : invoice
    ));

    addNotification('Comment added successfully');
  }, [user, addNotification]);

  // Handle invoice selection
  const handleInvoiceSelect = useCallback((invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  }, []);

  // Handle invoice click
  const handleInvoiceClick = useCallback((invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  }, []);

  // Handle sorting
  const handleSort = useCallback((key: keyof Invoice) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Pagination handlers
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  // Simulate real-time collaboration updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate other users making changes
      if (invoices.length > 0 && Math.random() > 0.7) {
        const randomInvoice = invoices[Math.floor(Math.random() * invoices.length)];
        const actions = ['editing', 'reviewing', 'commenting on'];
        const names = ['Alex Johnson', 'Sam Wilson', 'Taylor Smith', 'Jordan Lee'];
        
        setCollaborators(prev => ({
          ...prev,
          [randomInvoice.id]: {
            name: names[Math.floor(Math.random() * names.length)],
            action: actions[Math.floor(Math.random() * actions.length)],
            timestamp: new Date().toISOString()
          }
        }));

        // Clear collaborator after 30 seconds
        setTimeout(() => {
          setCollaborators(prev => {
            const newCollaborators = { ...prev };
            delete newCollaborators[randomInvoice.id];
            return newCollaborators;
          });
        }, 30000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [invoices]);

  // Initial data fetch
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchInvoices}>Retry</button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="invoice-dashboard">

        {/* Header with Stats */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <h1>Invoice Management</h1>
              <p className="header-subtitle">Manage and track your invoices efficiently</p>
            </div>
            <div className="header-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setFilters({
                  status: '',
                  amountRange: { min: 0, max: 100000 },
                  daysOverdue: 0,
                  assignedTo: '',
                  searchTerm: ''
                })}
              >
                Clear Filters
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setIsModalOpen(true)}
                disabled={selectedInvoices.length === 0}
              >
                Bulk Actions ({selectedInvoices.length})
              </button>
            </div>
          </div>
        </header>



        {/* Fixed Filters Section */}
        <div className="filters-section">
          <InvoiceFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={() => setFilters({
              status: '',
              amountRange: { min: 0, max: 100000 },
              daysOverdue: 0,
              assignedTo: '',
              searchTerm: ''
            })}
          />
        </div>

        {/* Main Content Area */}
        <div className="dashboard-content">
          <div className="table-container">
            <InvoiceTable
              invoices={paginatedInvoices}
              selectedInvoices={selectedInvoices}
              sortConfig={sortConfig}
              collaborators={collaborators}
              onInvoiceSelect={handleInvoiceSelect}
              onInvoiceClick={handleInvoiceClick}
              onSort={handleSort}
              onStatusUpdate={updateInvoiceStatus}
              onInvoiceUpdate={handleInvoiceUpdate}
              // Pagination props
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={sortedInvoices.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
            />
          </div>

          <CollaborationPanel 
            collaborators={collaborators}
            selectedInvoices={selectedInvoices}
          />
        </div>

        {selectedInvoice && (
          <InvoiceModal
            invoice={selectedInvoice}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedInvoice(null);
            }}
            onStatusUpdate={updateInvoiceStatus}
            onAddComment={addComment}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default InvoiceDashboard; 