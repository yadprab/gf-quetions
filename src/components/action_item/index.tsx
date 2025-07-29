import React from "react";
import { tv } from "tailwind-variants";

interface ActionItemProps {
  title: string;
  subtitle: string;
  statusColor: "success" | "warning" | "error";
}

const indicatorClass = tv({
  base: "w-2.5 h-full flex items-center rounded-full text-4xl",
  variants: {
    color: {
      success: "text-green-500",
      warning: "text-yellow-500",
      error: "text-red-500",
    },
  },
  defaultVariants: {
    color: "success",
  },
});

const ActionItem: React.FC<ActionItemProps> = ({
  title,
  subtitle,
  statusColor,
}) => {
  return (
    <div className="bg-card rounded-lg p-4 flex justify-between items-center">
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{title}</span>
        <span className="text-sm text-secondary">{subtitle}</span>
      </div>
      <div
        className={indicatorClass({
          color: statusColor,
        })}
      >
        •
      </div>
    </div>
  );
};

export default ActionItem;
