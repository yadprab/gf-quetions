import { DataTableContainer } from "../DataTable/DataTableContainer"

const InvoiceManagement = () => {
  return (
    <div><DataTableContainer endpoint={`http://localhost:3001/invoices`} initialPageSize={5} /></div>
  )
}

export default InvoiceManagement

