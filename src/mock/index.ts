import type { Invoice } from "../types";
import { GRADIENT_COLORS } from "../widgets/gradient_chip/constants";

export const CARD_MOCK_DATA = [
  {
    id: 1,
    label: "Total Outstanding",
    value: "$486,250",
    change: "+12.5%",
    changeType: "positive",
    icon: "RiMoneyDollarCircleLine",
    iconBgColor: GRADIENT_COLORS.RED,
    iconColor: "text-red-600",
  },
  {
    id: 2,
    label: "Collections Rate",
    value: "87.3%",
    change: "++5.2%",
    changeType: "positive",
    icon: "RiLineChartLine",
    iconBgColor: GRADIENT_COLORS.GREEN,
    iconColor: "text-green-600",
  },
  {
    id: 3,
    label: "Active Customers",
    value: "1,247",
    change: "++8.1%",
    changeType: "positive",
    icon: "RiUser3Line",
    iconBgColor: GRADIENT_COLORS.BLUE,
    iconColor: "text-blue-600",
  },
  {
    id: 4,
    label: "Avg. Days to Pay",
    value: "32 days",
    change: "+-3 days",
    changeType: "positive",
    icon: "RiTimeLine",
    iconBgColor: GRADIENT_COLORS.PURPLE,
    iconColor: "text-purple-600",
  },
];

const moreInvoiceData: Invoice[] = Array.from({ length: 100 }, (_, i) => {
  const id = 5 + i;
  const statusOptions = ["Paid", "Pending", "Overdue", "Disputed"];
  const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 60) - 30);

  return {
    id: `INV-0${id < 10 ? '0' + id : id}`,
    customer: {
      name: `Customer ${id}`,
    },
    amount: Math.floor(Math.random() * 50000) + 1000,
    dueDate: dueDate.toISOString().split('T')[0],
    daysOverdue: status === "Overdue" ? Math.floor(Math.random() * 30) + 1 : null,
    status: status as "Paid" | "Pending" | "Overdue" | "Disputed",
    comments: Math.floor(Math.random() * 10),
  };
});

export const INVOICE_MANAGEMENT_MOCK_DATA: { data: Invoice[] } = {
  data: [
    {
      id: "INV-001",
      customer: {
        name: "Acme Corp",
      },
      amount: 15000,
      dueDate: "2025-03-15",
      daysOverdue: 30,
      status: "Overdue",
      comments: 3,
    },
    {
      id: "INV-002",
      customer: {
        name: "TechFlow Ltd",
      },
      amount: 8500,
      dueDate: "2025-05-20",
      daysOverdue: null,
      status: "Pending",
      comments: 1,
    },
    {
      id: "INV-003",
      customer: {
        name: "Global Systems",
      },
      amount: 22000,
      dueDate: "2025-09-10",
      daysOverdue: 45,
      status: "Disputed",
      comments: 5,
    },
    {
      id: "INV-004",
      customer: {
        name: "DataSync Inc",
      },
      amount: 12000,
      dueDate: "2025-11-25",
      daysOverdue: null,
      status: "Paid",
      comments: 0,
    },
    {
      id: "INV-005",
      customer: {
        name: "CloudBridge",
      },
      amount: 18500,
      dueDate: "2025-01-18",
      daysOverdue: 25,
      status: "Overdue",
      comments: 2,
    },
    ...moreInvoiceData,
  ],
};

export const RECENT_ACTIVITY_MOCK_DATA = [
  {
    id: "act-1",
    type: "payment_received",
    title: "Payment received",
    details: "Acme Corp",
    amount: 15000,
    timestamp: "2 min ago",
  },
  {
    id: "act-2",
    type: "invoice_disputed",
    title: "Invoice disputed",
    details: "TechFlow Ltd",
    amount: 8500,
    timestamp: "15 min ago",
  },
  {
    id: "act-3",
    type: "follow_up_sent",
    title: "Follow-up sent",
    details: "DataSync Inc",
    amount: 12000,
    timestamp: "1 hour ago",
  },
  {
    id: "act-4",
    type: "status_updated",
    title: "Status updated",
    details: "CloudBridge",
    amount: 18500,
    timestamp: "2 hours ago",
  },
];

export const PRIORITY_ACTION_MOCK_DATA = [
  {
    id: "pa-1",
    title: "Follow up on overdue invoices",
    subtitle: "8 invoices",
    indicatorColor: "error",
  },
  {
    id: "pa-2",
    title: "Process dispute resolutions",
    subtitle: "3 cases",
    indicatorColor: "warning",
  },
  {
    id: "pa-3",
    title: "Send payment reminders",
    subtitle: "15 customers",
    indicatorColor: "success",
  },
];
