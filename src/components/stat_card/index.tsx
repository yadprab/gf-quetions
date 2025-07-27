import React from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBgColor: string;
  percentageChange?: string;
  percentageColor?: "success" | "error";
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  iconBgColor,
  percentageChange,
  percentageColor,
}) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${iconBgColor}`}
        >
          {icon}
        </div>
        {percentageChange && (
          <span
            className={`text-sm font-medium ${
              percentageColor === "success" ? "text-success" : "text-error"
            }`}
          >
            {percentageChange}
          </span>
        )}
      </div>
      <span className="text-sm text-secondary">{label}</span>
      <span className="text-4xl font-bold text-foreground">{value}</span>
    </div>
  );
};

export default StatCard;
