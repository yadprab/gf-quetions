import type { Invoice, InvoiceStatus } from "../types/invoice";


let invoices: Invoice[] = Array.from({ length: 120 }).map((_, i) => ({
  id: `INV-${1000 + i}`,
  customer: `Customer ${i + 1}`,
  amount: Math.floor(Math.random() * 10000),
  dueDate: new Date(Date.now() - Math.random() * 10_000_000_000).toISOString(),
  status: ["PAID", "UNPAID", "OVERDUE"][Math.floor(Math.random() * 3)] as InvoiceStatus,
  comments: [],
}));

export const invoicesApi = {
  fetch: async (): Promise<Invoice[]> => {
    await new Promise((res) => setTimeout(res, 500));
    return invoices;
  },
  updateStatus: async (id: string, status: InvoiceStatus, comment?: string) => {
    invoices = invoices.map((inv) =>
      inv.id === id
        ? { ...inv, status, comments: comment ? [...inv.comments!, comment] : inv.comments }
        : inv
    );
    return invoices.find((i) => i.id === id)!;
  },
  subscribe: (callback: (data: Invoice[]) => void) => {
    // Mock "real-time" updates
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * invoices.length);
      invoices[randomIndex].status = "OVERDUE";
      callback([...invoices]);
    }, 10000);
    return () => clearInterval(interval);
  },
};
