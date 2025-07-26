interface Invoice {
  id: string;
  status: string;
  amount: number;
  dueDate: string;
}

export const fetchInvoices = async (): Promise<Invoice[]> => {
  const res = await fetch("/api/invoices");
  if (!res.ok) throw new Error("Failed to fetch invoices");
  return res.json();
};

export const updateInvoiceStatus = async (id: string, status: string): Promise<Invoice> => {
  const res = await fetch(`/api/invoices/${id}`, {
    method: "PATCH",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({status}),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
};