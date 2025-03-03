
import { useBudget } from '@/context/BudgetContext';
import { formatCurrency, formatDate } from '@/lib/data';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type RecentTransactionsProps = {
  limit?: number;
  className?: string;
  showViewAll?: boolean;
}

const RecentTransactions = ({ limit = 5, className, showViewAll = true }: RecentTransactionsProps) => {
  const { getRecentTransactions, getCategoryById } = useBudget();
  const transactions = getRecentTransactions(limit);

  return (
    <div className={cn("bg-white rounded-xl shadow-sm p-6 border border-gray-100", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
        {showViewAll && (
          <a href="/transactions" className="text-sm text-primary hover:text-primary/80 transition-colors">
            View All
          </a>
        )}
      </div>
      
      <div className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((transaction) => {
            const category = getCategoryById(transaction.categoryId);
            const isIncome = transaction.type === 'income';
            
            return (
              <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      isIncome ? "bg-green-100" : `bg-${category?.color}-100`,
                      `bg-${category?.color}`
                    )}
                    style={{ backgroundColor: isIncome ? 'rgba(78, 203, 113, 0.1)' : `rgba(var(--${category?.color}), 0.1)` }}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="text-income w-5 h-5" />
                    ) : (
                      <ArrowDownRight className="text-expense w-5 h-5" />
                    )}
                  </div>
                  
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.date)} • {category?.name || 'Uncategorized'}
                    </p>
                  </div>
                </div>
                
                <span 
                  className={cn(
                    "font-semibold",
                    isIncome ? "text-income" : "text-expense"
                  )}
                >
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-400">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
