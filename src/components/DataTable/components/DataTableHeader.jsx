import React from 'react';

export const DataTableHeader = ({
  columns,
  bulkActions,
  selectedItems,
  paginatedData,
  setSelectedItems,
  sortConfig,
  handleSort
}) => {
  return (
    <thead>
      <tr className="bg-gray-50 border-b border-gray-200">
        {bulkActions.length > 0 && (
          <th className="px-4 py-4 w-10">
            <input 
              type="checkbox"
              checked={selectedItems.length > 0 && selectedItems.length === paginatedData.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedItems(paginatedData.map(item => item.id));
                } else {
                  setSelectedItems([]);
                }
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </th>
        )}
        {columns.map((column) => (
          <th 
            key={column.key}
            className={`px-4 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider ${
              column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
            }`}
            style={{ 
              textAlign: column.align || 'left',
              width: column.width || 'auto'
            }} 
            onClick={column.sortable ? () => handleSort(column.key) : undefined}
          >
            <div className="flex items-center gap-1">
              {column.header}
              {column.sortable && sortConfig.key === column.key && (
                <span className="text-gray-400">
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default DataTableHeader;