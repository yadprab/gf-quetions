import React from "react";
import { tv } from "tailwind-variants";
import { formatCurrency } from "../../utils/formatting";

export type ActivityType =
  | "payment_received"
  | "invoice_disputed"
  | "follow_up_sent"
  | "status_updated";

interface ActivityItemProps {
  title: string;
  subtitle: string;
  timestamp: string;
  amount: number;
  activityType: ActivityType;
}

const activityTypeColorClass = tv({
  base: "font-medium",
  variants: {
    type: {
      payment_received: "text-green-500",
      invoice_disputed: "text-red-500",
      follow_up_sent: "text-blue-500",
      status_updated: "text-yellow-500",
    },
  },
  defaultVariants: {
    type: "payment_received",
  },
});

const ActivityItem: React.FC<ActivityItemProps> = ({
  title,
  subtitle,
  timestamp,
  amount,
  activityType = "payment_received",
}) => {
  return (
    <div className="flex justify-between items-start bg-card rounded-lg p-4">
      <div className="flex flex-col">
        <span className={activityTypeColorClass({ type: activityType })}>
          {title}
        </span>
        <span className="text-sm text-secondary">
          {subtitle} • {formatCurrency(amount)}
        </span>
      </div>
      <span className="text-sm text-gray-500">{timestamp}</span>
    </div>
  );
};

export default ActivityItem;
