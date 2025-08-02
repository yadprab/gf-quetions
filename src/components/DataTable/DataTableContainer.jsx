import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { useFetchData } from './hooks/useFetchData';
import RenderCell from './components/RenderCell';


export const DataTableContainer = ({ 
  endpoint, 
  columns, 
  initialPageSize = 10,
  entityName = 'item',
  dataProcessor,
  collaboratorSimulation = false,
  searchableFields = [],
  defaultSort = { key: 'id', direction: 'asc' },
  bulkActions = [],
  customFilters = [],
  updateHandler = null,
  className = '',
  style = {}
}) => {
  // Context and state
  const { user } = useContext(AppContext);
  const {
    data,
    loading,
    error,
    collaborators,
    lastUpdated,
    fetchData,
    updateItem,
    deleteItems
  } = useFetchData(endpoint, {
    dataProcessor,
    collaboratorSimulation,
    entityName,
    updateHandler
  });
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortConfig, setSortConfig] = useState(defaultSort);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  // Initialize filters from customFilters
  useEffect(() => {
    const initialFilters = {};
    customFilters.forEach(filter => {
      initialFilters[filter.key] = filter.defaultValue || '';
    });
    setFilters(initialFilters);
  }, [customFilters]);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        key,
        direction: 'asc'
      };
    });
  };

  // Handle field update (for inline editing)
  const handleFieldUpdate = async (itemId, field, value) => {
    await updateItem(itemId, field, value);
  };

  // Get nested value from object using dot notation
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchTerm && searchableFields.length > 0) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        searchableFields.some(field => {
          const value = getNestedValue(item, field);
          return value?.toString().toLowerCase().includes(term);
        })
      );
    }

    // Apply custom filters
    customFilters.forEach(filter => {
      const filterValue = filters[filter.key];
      if (filterValue && filterValue !== filter.defaultValue) {
        result = result.filter(item => filter.filterFunction(item, filterValue));
      }
    });

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = getNestedValue(a, sortConfig.key);
        const bValue = getNestedValue(b, sortConfig.key);
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, searchableFields, filters, customFilters, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, page, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

  // Handle row selection
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) return;

    try {
      if (action.key === 'delete') {
        if (!window.confirm(`Are you sure you want to delete ${selectedItems.length} selected ${entityName}s?`)) {
          return;
        }
        
        await deleteItems(selectedItems);
        setSelectedItems([]);
      } else if (action.handler) {
        await action.handler(selectedItems, data.filter(item => selectedItems.includes(item.id)));
        setSelectedItems([]);
      }
    } catch (err) {
      console.error('Error performing bulk action:', err);
      alert(`Failed to perform bulk action. Please try again.`);
    }
  };

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filters, sortConfig]);

  // Render loading state
  if (loading && data.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '300px' 
      }}>
        <div>Loading {entityName}s...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fff5f5', 
        color: '#e53e3e',
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        {error}
        <button 
          onClick={fetchData}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            backgroundColor: '#fff',
            border: '1px solid #e53e3e',
            color: '#e53e3e',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }
      
  // Render the main component
  return (
    <div style={{ padding: '20px', ...style }} className={className}>
      {/* Search and Filter Bar */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        {searchableFields.length > 0 && (
          <div style={{ flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              placeholder={`Search ${entityName}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '10px 16px',
                width: '100%',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px'
              }}
            />
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Custom Filters */}
          {customFilters.map(filter => (
            <div key={filter.key}>
              {filter.type === 'select' && (
                <select
                  value={filters[filter.key] || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, [filter.key]: e.target.value || filter.defaultValue }))}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white',
                    fontSize: '14px',
                    cursor: 'pointer',
                    color: 'black'
                  }}
                >
                  <option value={filter.defaultValue}>{filter.placeholder}</option>
                  {filter.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
          
          <button
            onClick={fetchData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f7fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              color: 'black'
            }}
          >
            <span>⟳</span> Refresh
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            minWidth: '1000px'
          }}>
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
          </table>
        </div>

        {/* Table Footer */}
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
      </div>

      {/* Floating Action Bar for selected items */}
      {selectedItems.length > 0 && bulkActions.length > 0 && (
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
      )}
    </div>
  );
};

export default DataTableContainer;