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
import InvoiceMetrics from "./invoiceMetrics";


const InvoiceManagement = () => {
  return (
    <div>
      <div>
        <p className="text-2xl font-bold">Collections Dashboard</p>
        <p className="text-gray-500">Monitor and manage your accounts receivable in real-time</p>
      </div>

      <div>
        <InvoiceMetrics  />
      </div>
      
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

