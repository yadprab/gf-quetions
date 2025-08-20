
export type InvoiceStatus = "PAID" | "UNPAID" | "OVERDUE";

export interface Invoice {
  id: string;
  customer: string;
  amount: number;
  dueDate: string; // ISO string
  status: InvoiceStatus;
  comments?: string[];
}
