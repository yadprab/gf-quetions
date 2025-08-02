import React from 'react';
import { formatCurrency } from '../../../utils/formatting';
import { getDaysOverdue } from '../utils/helperFunctions';

const getInvoiceStatusStyle = (status) => {
  const styles = {
    paid: { backgroundColor: '#e6fffa', color: '#234e52' },
    pending: { backgroundColor: '#feebc8', color: '#7b341e' },
    overdue: { backgroundColor: '#fed7d7', color: '#822727' },
    draft: { backgroundColor: '#ebf8ff', color: '#2c5282' }
  };
  return styles[status] || { backgroundColor: '#f7fafc', color: '#4a5568' };
};

export const RenderCell = ({ 
  type, 
  value, 
  item, 
  field, 
  handleFieldUpdate, 
  options = [], 
  ...props 
}) => {
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const cellValue = field ? getNestedValue(item, field) : value;

  switch (type) {
    case 'text':
      return <span {...props}>{cellValue || 'N/A'}</span>;

    case 'currency':
      return (
        <span style={{ fontWeight: '500', ...props.style }} {...props}>
          {formatCurrency(cellValue)}
        </span>
      );

    case 'date':
      return (
        <span {...props}>
          {cellValue ? new Date(cellValue).toLocaleDateString() : 'N/A'}
        </span>
      );

    case 'due_date':
      const daysOverdue = getDaysOverdue(cellValue);
      return (
        <div {...props}>
          <div>{cellValue ? new Date(cellValue).toLocaleDateString() : 'N/A'}</div>
          {daysOverdue > 0 && (
            <div style={{ fontSize: '12px', color: '#e53e3e' }}>
              {daysOverdue} days overdue
            </div>
          )}
        </div>
      );

    case 'select':
      return (
        <select
          value={cellValue}
          onChange={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const newValue = e.target.value;
            setTimeout(async () => {
              try {
                if (handleFieldUpdate && typeof handleFieldUpdate === 'function') {
                  await handleFieldUpdate(item.id, field, newValue);
                }     
              } catch (error) {
                console.error('Error in handleFieldUpdate:', error);
              }
            }, 0);
          }}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #e2e8f0',
            backgroundColor: type === 'select' && field === 'status' 
              ? getInvoiceStatusStyle(cellValue).backgroundColor 
              : 'white',
            color: type === 'select' && field === 'status' 
              ? getInvoiceStatusStyle(cellValue).color 
              : 'black',
            cursor: 'pointer',
            minWidth: '100px',
            ...props.style
          }}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );

    default:
      return <span {...props}>{cellValue}</span>;
  }
};

export default RenderCell;