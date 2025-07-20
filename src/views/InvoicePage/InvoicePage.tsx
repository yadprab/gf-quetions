import React from 'react'
import  InvoiceContainer  from '../../components/DataTable/InvoiceContainer.tsx';
import DataTableContainer from '../../components/DataTable/DataTableContainer';

type InvoicePageProps = {
  invoiceId: string;
};

const InvoicePage = (props: InvoicePageProps) => {
  
  return (
    <div>
      <InvoiceContainer />
    </div>
  );
};


export default InvoicePage;