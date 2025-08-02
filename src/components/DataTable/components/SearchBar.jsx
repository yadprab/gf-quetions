import React from 'react';

export const SearchBar = ({
  searchTerm,
  setSearchTerm,
  entityName,
  searchableFields,
  customFilters,
  filters,
  setFilters,
  fetchData
}) => {
  return (
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
  );
};

export default SearchBar;