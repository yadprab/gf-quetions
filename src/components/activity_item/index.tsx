import React from "react";

interface ActivityItemProps {
  title: string;
  subtitle: string;
  timestamp: string;
  titleColorClass?: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  title,
  subtitle,
  timestamp,
  titleColorClass = "text-foreground",
}) => {
  return (
    <div className="flex justify-between items-start">
      <div className="flex flex-col">
        <span className={`font-medium ${titleColorClass}`}>{title}</span>
        <span className="text-sm text-secondary">{subtitle}</span>
      </div>
      <span className="text-sm text-secondary">{timestamp}</span>
    </div>
  );
};

export default ActivityItem;
