import React from "react";

import { GradientChip } from "../../widgets/gradient_chip";

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
        <GradientChip from={iconBgColor} to={iconBgColor}>
          {icon}
        </GradientChip>
        {percentageChange && (
          <span
            className={`text-sm font-medium ${
              percentageColor === "success"
                ? "text-green-400"
                : "text-shadow-red-400"
            }`}
          >
            {percentageChange}
          </span>
        )}
      </div>
      <span className="text-sm text-secondary">{label}</span>
      <span className="text-2xl font-bold text-foreground">{value}</span>
    </div>
  );
};

export default StatCard;
