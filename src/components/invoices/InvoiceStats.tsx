import React from 'react';
import { formatMoney } from '../../utils/formatting';

interface Stats {
  total: number;
  paid: number;
  overdue: number;
  pending: number;
  totalAmount: number;
  overdueAmount: number;
  paidPercentage: number;
}

interface InvoiceStatsProps {
  stats: Stats;
}

export const InvoiceStats: React.FC<InvoiceStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Invoices',
      value: stats.total,
      color: 'bg-blue-500',
      icon: '📄'
    },
    {
      title: 'Paid',
      value: stats.paid,
      percentage: stats.paidPercentage,
      color: 'bg-green-500',
      icon: '✅'
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      amount: stats.overdueAmount,
      color: 'bg-red-500',
      icon: '⚠️'
    },
    {
      title: 'Pending',
      value: stats.pending,
      color: 'bg-yellow-500',
      icon: '⏳'
    },
    {
      title: 'Total Amount',
      value: formatMoney(stats.totalAmount),
      color: 'bg-purple-500',
      icon: '💰'
    }
  ];

  return (
    <div className="invoice-stats mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} text-white rounded-lg p-4 shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{card.title}</p>
                <p className="text-2xl font-bold">
                  {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                </p>
                {card.percentage !== undefined && (
                  <p className="text-sm opacity-90">
                    {card.percentage.toFixed(1)}% of total
                  </p>
                )}
                {card.amount !== undefined && (
                  <p className="text-sm opacity-90">
                    {formatMoney(card.amount)} overdue
                  </p>
                )}
              </div>
              <div className="text-3xl">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 