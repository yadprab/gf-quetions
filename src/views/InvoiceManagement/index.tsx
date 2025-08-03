import DataTableContainer from "../../components/DataTable/DataTableContainer.jsx";
import {
  invoiceColumns,
  invoiceSearchableFields,
  invoiceCustomFilters,
  invoiceDefaultSort,
  invoiceBulkActions,
  invoiceDataProcessor
} from "../../components/DataTable/configurations/invoiceTableConfig.jsx";
import InvoiceMetrics from "./invoiceMetrics";
import RecentActivity from "./recentActivity";
import PriorityActions from "./priorityActions.tsx";


const InvoiceManagement = () => {
  return (
    <div>
      <div>
        <p className="text-2xl font-bold">Collections Dashboard</p>
        <p className="text-gray-500">Monitor and manage your accounts receivable in real-time</p>
      </div>

      <div>
        <InvoiceMetrics />
      </div>

      <div className="flex gap-4">
        <div className="w-3/4">
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
            tableTitle="Invoice Management"
            className="mt-5 bg-white rounded-xl border border-gray-200 overflow-hidden"
          />
        </div>
        <div className="mt-5 w-1/4 space-y-4">
          <RecentActivity />
          <PriorityActions />
        </div>
      </div>
    </div>
  )
}

export default InvoiceManagement

