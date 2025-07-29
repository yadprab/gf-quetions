import DataTableContainer from "../../components/DataTable/DataTableContainer";
import { SidebarCards } from "../../components/SidebarCards/SidebarCards";
import InvoiceInsight from "./InvoiceInsight";

import '../../styles/invoicepage.css'

export default function InvoicePage(){
    return (
        <>
        <h2 style={{color:"#000",margin:0}}>Collection Dashboard</h2>
        <h4 style={{color:"rgb(101 97 97)",margin:0,fontWeight:400}}>Monitor and manage your accounts receiable in real-time</h4>

        <InvoiceInsight/>

        <div className="invoice">
      <div className="main-panel">
      <DataTableContainer endpoint={'invoice'}  title="Invoice Mangement" columns={undefined}/>
      </div>
      <div className="side-panel">
        <SidebarCards />
      </div>
    </div>
      
        </>
    )
}