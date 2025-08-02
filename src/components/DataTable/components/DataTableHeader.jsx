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
      <tr style={{ 
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        textAlign: 'left',
        color: 'black'
      }}>
        {bulkActions.length > 0 && (
          <th style={{ padding: '12px 16px', width: '40px' }}>
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
            />
          </th>
        )}
        {columns.map((column) => (
          <th 
            key={column.key}
            style={{ 
              padding: '12px 16px', 
              cursor: column.sortable ? 'pointer' : 'default',
              textAlign: column.align || 'left',
              width: column.width || 'auto'
            }} 
            onClick={column.sortable ? () => handleSort(column.key) : undefined}
          >
            {column.header}
            {column.sortable && sortConfig.key === column.key && (
              <span style={{ marginLeft: '4px' }}>
                {sortConfig.direction === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default DataTableHeader;