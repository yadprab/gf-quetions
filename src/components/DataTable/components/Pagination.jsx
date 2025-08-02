import React from 'react';

export const Pagination = ({
  selectedItems,
  page,
  pageSize,
  filteredAndSortedData,
  entityName,
  lastUpdated,
  setPageSize,
  setPage,
  totalPages,
  bulkActions,
  handleBulkAction
}) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      borderTop: '1px solid #edf2f7',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{ fontSize: '14px', color: '#4a5568' }}>
        {selectedItems.length > 0 ? (
          `${selectedItems.length} selected`
        ) : (
          `Showing ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, filteredAndSortedData.length)} of ${filteredAndSortedData.length} ${entityName}s`
        )}
        {lastUpdated && (
          <span style={{ marginLeft: '16px', fontSize: '12px', color: '#a0aec0' }}>
            Updated {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: '#4a5568' }}>Rows per page:</span>
          <select 
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {[10, 25, 50, 100].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '6px 12px',
              backgroundColor: page === 1 ? '#edf2f7' : 'white',
              color: page === 1 ? '#a0aec0' : '#4a5568',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            Previous
          </button>
          
          <div style={{ 
            minWidth: '60px', 
            textAlign: 'center',
            fontSize: '14px',
            color: '#4a5568'
          }}>
            {page} of {totalPages}
          </div>
          
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            style={{
              padding: '6px 12px',
              backgroundColor: page >= totalPages ? '#edf2f7' : 'white',
              color: page >= totalPages ? '#a0aec0' : '#4a5568',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            Next
          </button>
        </div>

        {selectedItems.length > 0 && bulkActions.length > 0 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {bulkActions.map((action) => (
              <button
                key={action.key}
                onClick={() => handleBulkAction(action)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: action.style?.backgroundColor || '#ebf8ff',
                  color: action.style?.color || '#2b6cb0',
                  border: `1px solid ${action.style?.borderColor || '#bee3f8'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px'
                }}
              >
                {action.icon && <span>{action.icon}</span>} {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;