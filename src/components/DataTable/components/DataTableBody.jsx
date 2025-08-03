import React from 'react';
import RenderCell from './RenderCell';

export const DataTableBody = ({
  paginatedData,
  columns,
  bulkActions,
  selectedItems,
  toggleItemSelection,
  handleFieldUpdate,
  collaborators,
  entityName,
  getNestedValue
}) => {
  return (
    <tbody>
      {paginatedData.length === 0 ? (
        <tr>
          <td colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)} style={{ textAlign: 'center', padding: '32px' }}>
            No {entityName}s found matching your criteria
          </td>
        </tr>
      ) : (
        paginatedData.map((item) => (
          <tr 
            key={item.id}
            style={{
              borderBottom: '1px solid #edf2f7',
              color: 'black',
              backgroundColor: selectedItems.includes(item.id) ? '#f0f9ff' : 'white'
            }}
          >
            {bulkActions.length > 0 && (
              <td style={{ padding: '16px', textAlign: 'center' }}>
                <input 
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleItemSelection(item.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
            )}
            {columns.map((column) => (
              <td 
                key={column.key}
                style={{ 
                  padding: '16px', 
                  textAlign: column.align || 'left',
                  fontWeight: column.bold ? '500' : 'normal'
                }}
              >
                {column.cellType ? (
                  <RenderCell
                    type={column.cellType}
                    item={item}
                    field={column.key}
                    handleFieldUpdate={handleFieldUpdate}
                    options={column.selectOptions || []}
                    style={{ fontWeight: column.bold ? '500' : 'normal' }}
                  />
                ) : column.render ? (
                  column.render(item, handleFieldUpdate, collaborators[item.id])
                ) : (
                  getNestedValue(item, column.key)
                )}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );
};

export default DataTableBody;