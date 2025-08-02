import React from 'react';

export const FloatingActionBar = ({
  selectedItems,
  entityName,
  bulkActions,
  handleBulkAction,
  setSelectedItems
}) => {
  if (selectedItems.length === 0 || bulkActions.length === 0) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      zIndex: 1000
    }}>
      <div style={{ fontWeight: '500' }}>
        {selectedItems.length} {entityName}{selectedItems.length > 1 ? 's' : ''} selected
      </div>
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
        <button
          onClick={() => setSelectedItems([])}
          style={{
            padding: '6px 12px',
            backgroundColor: '#f7fafc',
            color: '#4a5568',
            border: '1px solid #e2e8f0',
            borderRadius: '4px',
            cursor: 'pointer',
            marginLeft: '8px',
            fontSize: '14px'
          }}
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
};

export default FloatingActionBar;