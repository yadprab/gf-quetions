import React from "react";

interface ActionItemProps {
  title: string;
  subtitle: string;
  statusColor: "success" | "warning" | "error";
}

const ActionItem: React.FC<ActionItemProps> = ({
  title,
  subtitle,
  statusColor,
}) => {
  const colorClass = {
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
  }[statusColor];

  return (
    <div className="bg-gray-100 rounded-lg p-4 flex justify-between items-center">
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{title}</span>
        <span className="text-sm text-secondary">{subtitle}</span>
      </div>
      <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`}></div>
    </div>
  );
};

export default ActionItem;
