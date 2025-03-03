
import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  value: string | React.ReactNode;
  icon?: React.ReactNode;
  colorClass?: string;
  className?: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  colorClass,
  className,
  change,
  onClick,
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm p-6 card-hover transition-all duration-300 border border-gray-100",
        className,
        onClick && "cursor-pointer hover:border-gray-200"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <div className="text-2xl font-bold text-gray-900 transition-all">{value}</div>
          
          {change && (
            <div className="mt-2 flex items-center">
              <span 
                className={cn(
                  "text-xs font-medium",
                  change.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {change.isPositive ? '↑' : '↓'} {Math.abs(change.value).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div 
            className={cn(
              "flex items-center justify-center h-12 w-12 rounded-full",
              colorClass || "bg-blue-100"
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
