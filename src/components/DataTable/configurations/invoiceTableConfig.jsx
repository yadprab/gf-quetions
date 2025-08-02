import React from 'react';
import RenderCell from '../components/RenderCell';
import { getDaysOverdue } from '../utils/helperFunctions';

// Data processor for invoices
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
    cellType: 'text'
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
    width: '200px',
    render: (invoice, handleFieldUpdate, collaborator) => (
      <div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              padding: '4px 8px',
              backgroundColor: '#ebf8ff',
              color: '#3182ce',
              border: '1px solid #bee3f8',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            View
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
            }}
            style={{
              padding: '4px 8px',
              backgroundColor: '#fefcbf',
              color: '#975a16',
              border: '1px solid #faf089',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Edit
          </button>
        </div>
        {collaborator && (
          <div style={{ 
            fontSize: '12px',
            color: '#718096',
            marginTop: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#48bb78'
            }}></span>
            {collaborator.name} is {collaborator.action} this invoice
          </div>
        )}
      </div>
    )
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