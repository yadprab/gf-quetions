import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { useFetchData } from './hooks/useFetchData';
import SearchBar from './components/SearchBar';
import DataTableHeader from './components/DataTableHeader';
import DataTableBody from './components/DataTableBody';
import Pagination from './components/Pagination';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import FloatingActionBar from './components/FloatingActionBar';


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
  tableTitle = ''
}) => {
  // Context and state
  const { user } = useContext(AppContext);
  console.log(user);
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
    return <LoadingState entityName={entityName} />;
  }

  // Render error state
  if (error) {
    return <ErrorState error={error} fetchData={fetchData} />;
  }
      
  // Render the main component
  return (
    <div className={`${className}`}>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        entityName={entityName}
        searchableFields={searchableFields}
        customFilters={customFilters}
        filters={filters}
        setFilters={setFilters}
        fetchData={fetchData}
        tableTitle={tableTitle}
      />

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-full">
            <DataTableHeader
              columns={columns}
              bulkActions={bulkActions}
              selectedItems={selectedItems}
              paginatedData={paginatedData}
              setSelectedItems={setSelectedItems}
              sortConfig={sortConfig}
              handleSort={handleSort}
            />
            <DataTableBody
              paginatedData={paginatedData}
              columns={columns}
              bulkActions={bulkActions}
              selectedItems={selectedItems}
              toggleItemSelection={toggleItemSelection}
              handleFieldUpdate={handleFieldUpdate}
              collaborators={collaborators}
              entityName={entityName}
              getNestedValue={getNestedValue}
            />
          </table>
        </div>

        <Pagination
          selectedItems={selectedItems}
          page={page}
          pageSize={pageSize}
          filteredAndSortedData={filteredAndSortedData}
          entityName={entityName}
          lastUpdated={lastUpdated}
          setPageSize={setPageSize}
          setPage={setPage}
          totalPages={totalPages}
          bulkActions={bulkActions}
          handleBulkAction={handleBulkAction}
        />
      </div>

      <FloatingActionBar
        selectedItems={selectedItems}
        entityName={entityName}
        bulkActions={bulkActions}
        handleBulkAction={handleBulkAction}
        setSelectedItems={setSelectedItems}
      />
    </div>
  );
};

export default DataTableContainer;