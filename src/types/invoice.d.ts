export interface Invoice {
  id: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  status: "Paid" | "Pending" | "Overdue";
  comments: string[];
}