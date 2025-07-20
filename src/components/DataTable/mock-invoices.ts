
const mockCustomers = [
  { id: "C001", name: "Innovate Inc." },
  { id: "C002", name: "Solutions Corp." },
  { id: "C003", name: "Quantum Dynamics" },
  { id: "C004", name: "Apex Enterprises" },
  { id: "C005", name: "Stellar Industries" },
  { id: "C006", name: "Nexus Group" },
  { id: "C007", name: "Pinnacle Co." },
  { id: "C008", name: "Synergy Systems" },
  { id: "C009", name: "Momentum LLC" },
  { id: "C010", name: "Horizon Ventures" },
  { id: "C011", name: "Zenith Corporation" },
  { id: "C012", name: "Meridian Partners" },
  { id: "C013", name: "Keystone Solutions" },
  { id: "C014", name: "Everest Holdings" },
  { id: "C015", name: "Catalyst Creations" },
];

const generateMockInvoice = (index: number) => {
  const customer =
    mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
  const amount = Math.floor(Math.random() * 5000) + 500;
  const statusOptions = ["paid", "pending", "overdue", "draft"];
  const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - Math.floor(Math.random() * 90));
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + 30);

  return {
    id: `INV-${1000 + index}`,
    customer: {
      id: customer.id,
      name: customer.name,
      email: `${customer.name.toLowerCase().replace(/\s/g, ".")}@example.com`,
    },
    amount: amount,
    status: status,
    issueDate: issueDate.toISOString().split("T")[0],
    dueDate: dueDate.toISOString().split("T")[0],
  };
};

export const mockInvoices = Array.from({ length: 120 }, (_, i) =>
  generateMockInvoice(i + 1)
);