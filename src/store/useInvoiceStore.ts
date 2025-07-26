import { create } from 'zustand';

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  daysOverdue: number;
}

interface InvoiceStore {
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
}

const useInvoiceStore = create<InvoiceStore>((set) => ({
  invoices: [],
  setInvoices: (invoices) => set({ invoices }),
  updateInvoice: (id, updates) =>
    set((state) => ({
      invoices: state.invoices.map((invoice) =>
        invoice.id === id ? { ...invoice, ...updates } : invoice
      ),
    })),
}));

export default useInvoiceStore;