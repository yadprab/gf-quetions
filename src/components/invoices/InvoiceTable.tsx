import React, { useMemo, useState } from 'react';
import type { Invoice, SortConfig } from '../../views/invoices/InvoiceDashboard';
import { InvoiceEditModal } from './InvoiceEditModal';

interface InvoiceTableProps {
  invoices: Invoice[];
  selectedInvoices: string[];
  sortConfig: SortConfig;
  collaborators: Record<string, any>;
  onInvoiceSelect: (invoiceId: string) => void;
  onInvoiceClick: (invoice: Invoice) => void;
  onSort: (key: keyof Invoice) => void;
  onStatusUpdate: (invoiceId: string, status: Invoice['status']) => void;
  onInvoiceUpdate: (invoiceId: string, updates: { status: Invoice['status']; comment?: string }) => Promise<void>;
  // Pagination props
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  selectedInvoices,
  sortConfig,
  collaborators,
  onInvoiceSelect,
  onInvoiceClick,
  onSort,
  onStatusUpdate,
  onInvoiceUpdate,
  // Pagination props
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPreviousPage,
  onNextPage
}) => {
  // Edit modal state
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get status style
  const getStatusStyle = (status: Invoice['status']) => {
    const styles = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-600'
    };
    return styles[status] || styles.draft;
  };

  // Get days overdue style
  const getDaysOverdueStyle = (days: number) => {
    if (days === 0) return 'text-gray-500';
    if (days <= 7) return 'text-yellow-600';
    if (days <= 30) return 'text-orange-600';
    return 'text-red-600 font-semibold';
  };

  // Get sort indicator
  const getSortIndicator = (key: keyof Invoice) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Edit handlers
  const handleEditClick = (e: React.MouseEvent, invoice: Invoice) => {
    e.stopPropagation();
    console.log('Edit button clicked for invoice:', invoice.invoiceNumber);
    setEditingInvoice(invoice);
    setIsEditModalOpen(true);
    console.log('Modal state set to open');
  };

  const handleEditSave = async (invoiceId: string, updates: { status: Invoice['status']; comment?: string }) => {
    await onInvoiceUpdate(invoiceId, updates);
    setIsEditModalOpen(false);
    setEditingInvoice(null);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditingInvoice(null);
  };

  // Memoized table headers
  const tableHeaders = useMemo(() => [
    { key: 'invoiceNumber' as keyof Invoice, label: 'Invoice #', sortable: true },
    { key: 'customerName' as keyof Invoice, label: 'Customer', sortable: true },
    { key: 'amount' as keyof Invoice, label: 'Amount', sortable: true },
    { key: 'dueDate' as keyof Invoice, label: 'Due Date', sortable: true },
    { key: 'daysOverdue' as keyof Invoice, label: 'Days Overdue', sortable: true },
    { key: 'status' as keyof Invoice, label: 'Status', sortable: true },
    { key: 'assignedTo' as keyof Invoice, label: 'Assigned To', sortable: true },
    { key: 'lastUpdated' as keyof Invoice, label: 'Last Updated', sortable: true },
    { key: 'actions' as keyof Invoice, label: 'Actions', sortable: false }
  ], [sortConfig]);

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No invoices found matching your filters.
      </div>
    );
  }

  return (
    <div className="invoice-table">
      <div className="table-wrapper">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={invoices.length > 0 && invoices.every(invoice => selectedInvoices.includes(invoice.id))}
                  onChange={(e) => {
                    if (e.target.checked) {
                      // Select all invoices on current page
                      invoices.forEach(invoice => {
                        if (!selectedInvoices.includes(invoice.id)) {
                          onInvoiceSelect(invoice.id);
                        }
                      });
                    } else {
                      // Deselect all invoices on current page
                      invoices.forEach(invoice => {
                        if (selectedInvoices.includes(invoice.id)) {
                          onInvoiceSelect(invoice.id);
                        }
                      });
                    }
                  }}
                  className="rounded border-gray-300"
                />
              </th>
              {tableHeaders.map((header) => (
                <th
                  key={header.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    header.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => header.sortable && onSort(header.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{header.label}</span>
                    {header.sortable && (
                      <span className="text-gray-400">
                        {getSortIndicator(header.key)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => {
              const isSelected = selectedInvoices.includes(invoice.id);
              const collaborator = collaborators[invoice.id];
              const dueDate = new Date(invoice.dueDate);
              const lastUpdated = new Date(invoice.lastUpdated);

              return (
                <tr
                  key={invoice.id}
                  className={`group hover:bg-gray-50 cursor-pointer ${
                    isSelected ? 'bg-blue-50' : ''
                  } ${invoice.daysOverdue > 30 ? 'border-l-4 border-red-500' : ''}`}
                  onClick={() => onInvoiceClick(invoice)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onInvoiceSelect(invoice.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </span>
                      {collaborator && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          👤 {collaborator.name} {collaborator.action}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {invoice.customerName}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {dueDate.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${getDaysOverdueStyle(invoice.daysOverdue)}`}>
                      {invoice.daysOverdue === 0 ? '-' : `${invoice.daysOverdue} days`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {invoice.assignedTo || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {lastUpdated.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleEditClick(e, invoice)}
                      className="text-gray-400 hover:text-blue-600 transition-all duration-200 p-1 rounded-full hover:bg-blue-50"
                      title="Edit Invoice"
                    >
                     <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
</svg>

                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div className="flex items-center space-x-4">
            <span>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} invoices
            </span>
            <span>
              {selectedInvoices.length} selected
            </span>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                onClick={onPreviousPage}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`pagination-button ${currentPage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={onNextPage}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <InvoiceEditModal
        invoice={editingInvoice}
        isOpen={isEditModalOpen}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />
    </div>
  );
}; 