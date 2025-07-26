import React, { createContext, useContext, ReactNode } from 'react';
import useInvoiceStore from '../store/useInvoiceStore';

interface InvoiceContextType {
  invoices: any[];
  updateInvoice: (id: string, updates: any) => void;
  setInvoices: (invoices: any[]) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const invoices = useInvoiceStore((state) => state.invoices);
  const updateInvoice = useInvoiceStore((state) => state.updateInvoice);
  const setInvoices = useInvoiceStore((state) => state.setInvoices);

  return (
    <InvoiceContext.Provider value={{ invoices, updateInvoice, setInvoices }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoiceContext = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoiceContext must be used within InvoiceProvider');
  }
  return context;
};

export default InvoiceProvider;