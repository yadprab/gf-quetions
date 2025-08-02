// @ts-ignore
import DataTableContainer from "../DataTable/DataTableContainer.jsx";
// @ts-ignore
import {
  invoiceColumns,
  invoiceSearchableFields,
  invoiceCustomFilters,
  invoiceDefaultSort,
  invoiceBulkActions,
  invoiceDataProcessor
// @ts-ignore
} from "../DataTable/configurations/invoiceTableConfig.jsx";

const InvoiceManagement = () => {
  return (
    <div>
      {/* @ts-ignore */}
      <DataTableContainer 
        endpoint="http://localhost:3001/invoices"
        columns={invoiceColumns}
        initialPageSize={10}
        entityName="invoice"
        dataProcessor={invoiceDataProcessor}
        collaboratorSimulation={true}
        searchableFields={invoiceSearchableFields}
        defaultSort={invoiceDefaultSort}
        bulkActions={invoiceBulkActions}
        customFilters={invoiceCustomFilters}
      />
    </div>
  )
}

export default InvoiceManagement

