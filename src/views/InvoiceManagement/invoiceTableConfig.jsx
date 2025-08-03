import React, { useState } from 'react';
import RenderCell from '../../components/DataTable/components/RenderCell';
import CommentModal from './components/CommentModal';
import { getDaysOverdue } from '../../components/DataTable/utils/helperFunctions';
import { FaRegCommentAlt } from "react-icons/fa";


export const invoiceDataProcessor = (invoices) => {
  const now = new Date();
  
  return invoices.map(invoice => ({
    ...invoice,
    lastUpdated: new Date(now - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 2)),
    daysOverdue: getDaysOverdue(invoice.dueDate)
  }));
};


export const invoiceColumns = [
  {
    key: 'id',
    header: 'Invoice #',
    sortable: true,
    bold: true,
    width: '150px',
    cellType: 'text'
  },
  {
    key: 'customer.name',
    header: 'Customer',
    sortable: true,
    cellType: 'text',
    width: '200px'
  },
  {
    key: 'amount',
    header: 'Amount',
    sortable: true,
    align: 'right',
    bold: true,
    width: '120px',
    cellType: 'currency'
  },
  {
    key: 'dueDate',
    header: 'Due Date',
    sortable: true,
    width: '150px',
    cellType: 'due_date'
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    width: '140px',
    cellType: 'select',
    selectOptions: [
      { value: 'draft', label: 'Draft' },
      { value: 'pending', label: 'Pending' },
      { value: 'paid', label: 'Paid' },
      { value: 'overdue', label: 'Overdue' }
    ]
  },
  {
    key: 'actions',
    header: 'Actions',
    width: '150px',
    render: (invoice, handleFieldUpdate) => {
      const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={() => {
                setIsCommentModalOpen(true);
              }}
              className='text-gray-500 hover:text-gray-700 cursor-pointer'
            >
              <FaRegCommentAlt />
            </button>
          </div>
          <CommentModal 
            isOpen={isCommentModalOpen}
            onClose={() => setIsCommentModalOpen(false)}
            invoiceId={invoice.id}
          />
        </div>
      );
    }
  }
];

export const invoiceSearchableFields = [
  'customer.name',
  'id',
  'amount'
];

export const invoiceCustomFilters = [
  {
    key: 'status',
    type: 'select',
    placeholder: 'All Statuses',
    defaultValue: '',
    options: [
      { value: 'paid', label: 'Paid' },
      { value: 'pending', label: 'Pending' },
      { value: 'overdue', label: 'Overdue' },
      { value: 'draft', label: 'Draft' }
    ],
    filterFunction: (invoice, filterValue) => invoice.status === filterValue
  }
];

// Default sort configuration for invoices
export const invoiceDefaultSort = {
  key: 'dueDate',
  direction: 'asc'
};

export const invoiceBulkActions = [
  {
    key: 'export',
    label: 'Export',
    icon: '📤',
    style: {
      backgroundColor: '#ebf8ff',
      color: '#2b6cb0',
      borderColor: '#bee3f8'
    },
    handler: async (selectedIds, selectedItems) => {
      alert(`Exporting ${selectedIds.length} invoices...`);
    }
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: '🗑️',
    style: {
      backgroundColor: '#fff5f5',
      color: '#e53e3e',
      borderColor: '#fed7d7'
    }
  }
];