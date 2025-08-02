import DataTableContainer from "../DataTable/DataTableContainer.jsx"

const InvoiceManagement = () => {
  return (
    <div><DataTableContainer endpoint={`http://localhost:3001/invoices`} initialPageSize={5} /></div>
  )
}

export default InvoiceManagement

