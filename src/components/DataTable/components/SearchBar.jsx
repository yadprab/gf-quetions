import { IoIosArrowDown, IoIosSearch } from "react-icons/io";


export const SearchBar = ({
  searchTerm,
  setSearchTerm,
  entityName,
  searchableFields,
  customFilters,
  filters,
  setFilters,
  fetchData,
  tableTitle
}) => {
  return (
    <div className="mb-6 flex justify-between items-center gap-4 px-6 pt-4">
      <div className="text-xl font-semibold">{tableTitle}</div>
      <div className="flex gap-3 items-center">
      {searchableFields.length > 0 && (
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IoIosSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={`Search ${entityName}s...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}
      
      <div className="flex gap-3 items-center">
        {customFilters.map(filter => (
          <div key={filter.key}>
            {filter.type === 'select' && (
              <div className="relative">
                <select
                  value={filters[filter.key] || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, [filter.key]: e.target.value || filter.defaultValue }))}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 text-gray-700 leading-tight focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value={filter.defaultValue}>{filter.placeholder}</option>
                  {filter.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <IoIosArrowDown className="h-4 w-4" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default SearchBar;