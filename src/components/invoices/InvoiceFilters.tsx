import React from 'react';

interface FilterState {
  status: string;
  amountRange: { min: number; max: number };
  daysOverdue: number;
  assignedTo: string;
  searchTerm: string;
}

interface InvoiceFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

export const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const daysOverdueOptions = [
    { value: 0, label: 'Any Days Overdue' },
    { value: 1, label: '1+ Days' },
    { value: 7, label: '7+ Days' },
    { value: 30, label: '30+ Days' },
    { value: 60, label: '60+ Days' },
    { value: 90, label: '90+ Days' }
  ];

  const assignedToOptions = [
    { value: '', label: 'All Users' },
    { value: 'User 1', label: 'User 1' },
    { value: 'User 2', label: 'User 2' },
    { value: 'User 3', label: 'User 3' },
    { value: 'User 4', label: 'User 4' },
    { value: 'User 5', label: 'User 5' }
  ];

  return (
    <div className="invoice-filters  py-2 px-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{display: 'block',width: '100%',textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px'}}>
            Search
          </label>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            placeholder="Search invoices..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{display: 'block',width: '100%',textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px'}}>
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Days Overdue */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{display: 'block',width: '100%',textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px'}}>
            Days Overdue
          </label>
          <select
            value={filters.daysOverdue}
            onChange={(e) => onFilterChange({ daysOverdue: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          >
            {daysOverdueOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Assigned To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" style={{display: 'block',width: '100%',textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px'}}>
            Assigned To
          </label>
          <select
            value={filters.assignedTo}
            onChange={(e) => onFilterChange({ assignedTo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          >
            {assignedToOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Amount Range */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block',width: '100%',textAlign: 'left', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '5px'}}>
          Amount Range
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={filters.amountRange.min}
            onChange={(e) => onFilterChange({
              amountRange: { ...filters.amountRange, min: parseInt(e.target.value) || 0 }
            })}
            placeholder="Min"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="number"
            value={filters.amountRange.max}
            onChange={(e) => onFilterChange({
              amountRange: { ...filters.amountRange, max: parseInt(e.target.value) || 100000 }
            })}
            placeholder="Max"
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>
    </div>
  );
}; 