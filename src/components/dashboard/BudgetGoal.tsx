
import React from 'react';
import { useBudget } from '@/context/BudgetContext';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/data';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

type BudgetGoalProps = {
  categoryId: string;
  onEdit?: () => void;
  className?: string;
}

const BudgetGoal: React.FC<BudgetGoalProps> = ({ categoryId, onEdit, className }) => {
  const { getBudgetStatus, getCategoryById } = useBudget();
  const { total, budget, percentage } = getBudgetStatus(categoryId);
  const category = getCategoryById(categoryId);

  const getStatusColor = (percent: number) => {
    if (percent < 50) return 'bg-green-500';
    if (percent < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!category) return null;

  return (
    <div className={cn("rounded-lg bg-white shadow-sm p-4 border border-gray-100", className)}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full bg-${category.color}`} 
               style={{ backgroundColor: `var(--${category.color}, #9B87F5)` }} />
          <h3 className="text-sm font-medium text-gray-700">{category.name}</h3>
        </div>
        
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Pencil size={14} />
          </button>
        )}
      </div>
      
      <div className="mt-1 mb-3">
        <Progress 
          value={Math.min(percentage, 100)} 
          className="h-2" 
          indicatorClassName={getStatusColor(percentage)}
        />
      </div>
      
      <div className="flex justify-between text-xs">
        <span className="text-gray-500">
          Spent: <span className="font-medium text-gray-700">{formatCurrency(total)}</span>
        </span>
        <span className="text-gray-500">
          Budget: <span className="font-medium text-gray-700">{formatCurrency(budget)}</span>
        </span>
        <span 
          className={cn(
            "font-medium",
            percentage > 100 ? "text-red-600" : "text-gray-700"
          )}
        >
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

export default BudgetGoal;
