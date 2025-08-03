// @ts-ignore
import DataTableContainer from "../../components/DataTable/DataTableContainer.jsx";
// @ts-ignore
import {
  invoiceColumns,
  invoiceSearchableFields,
  invoiceCustomFilters,
  invoiceDefaultSort,
  invoiceBulkActions,
  invoiceDataProcessor
} from "../../components/DataTable/configurations/invoiceTableConfig.jsx";

const InvoiceManagement = () => {
  return (
    <div>
      
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

