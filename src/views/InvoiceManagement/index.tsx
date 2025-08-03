import DataTableContainer from "../../components/DataTable/DataTableContainer";
import {
  invoiceColumns,
  invoiceSearchableFields,
  invoiceCustomFilters,
  invoiceDefaultSort,
  invoiceBulkActions,
  invoiceDataProcessor
} from "./invoiceTableConfig.jsx";
import InvoiceMetrics from "./invoiceMetrics";
import RecentActivity from "./recentActivity";
import PriorityActions from "./priorityActions";


const InvoiceManagement = () => {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <p className="text-xl md:text-2xl font-bold">Collections Dashboard</p>
        <p className="text-gray-500 text-sm md:text-base">Monitor and manage your accounts receivable in real-time</p>
      </div>

      <div className="mb-6">
        <InvoiceMetrics />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        <div className="w-full lg:w-3/4">
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
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          />
        </div>
        <div className="w-full lg:w-1/4 space-y-4">
          <RecentActivity />
          <PriorityActions />
        </div>
      </div>
    </div>
  )
}

export default InvoiceManagement

