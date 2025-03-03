
import { useState } from 'react';
import { useBudget } from '@/context/BudgetContext';
import Navbar from '@/components/layout/Navbar';
import DashboardCard from '@/components/dashboard/DashboardCard';
import ExpenseChart from '@/components/dashboard/ExpenseChart';
import BudgetGoal from '@/components/dashboard/BudgetGoal';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import AddTransactionForm from '@/components/transactions/AddTransactionForm';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatCurrency } from '@/lib/data';
import { ArrowUpCircle, ArrowDownCircle, PiggyBank, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { 
    getTotalIncome, 
    getTotalExpenses, 
    getNetBalance,
    budgets,
  } = useBudget();
  
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const netBalance = getNetBalance();
  
  // Sort budgets to show most used categories first
  const sortedBudgetCategories = budgets
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4)
    .map(budget => budget.categoryId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          
          <Button 
            onClick={() => setIsAddingTransaction(true)}
            className="mt-4 sm:mt-0 bg-primary hover:bg-primary/90 text-white shadow-sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
          <DashboardCard
            title="Total Income"
            value={formatCurrency(totalIncome)}
            icon={<ArrowUpCircle className="h-6 w-6 text-income" />}
            colorClass="bg-green-100"
          />
          
          <DashboardCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            icon={<ArrowDownCircle className="h-6 w-6 text-expense" />}
            colorClass="bg-red-100"
          />
          
          <DashboardCard
            title="Net Balance"
            value={formatCurrency(netBalance)}
            icon={<PiggyBank className="h-6 w-6 text-primary" />}
            colorClass="bg-blue-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Budget goals */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Budget Goals</h2>
            
            {sortedBudgetCategories.map((categoryId) => (
              <BudgetGoal 
                key={categoryId} 
                categoryId={categoryId} 
              />
            ))}
            
            <a 
              href="/budget" 
              className="text-sm text-center text-primary hover:text-primary/80 transition-colors block mt-2"
            >
              View all budgets
            </a>
          </div>
          
          {/* Middle column - Chart */}
          <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <ExpenseChart />
          </div>
        </div>
        
        <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <RecentTransactions />
        </div>
      </main>
      
      {/* Add Transaction Dialog */}
      <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
        <DialogContent className="sm:max-w-[425px]">
          <AddTransactionForm
            setIsOpen={setIsAddingTransaction}
            className="p-0 shadow-none"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
