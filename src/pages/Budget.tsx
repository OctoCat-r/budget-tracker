import { useState } from 'react';
import { useBudget } from '@/context/BudgetContext';
import Navbar from '@/components/layout/Navbar';
import { formatCurrency } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Edit2, DollarSign } from 'lucide-react';

const Budget = () => {
  const { 
    categories, 
    budgets, 
    updateBudget, 
    getBudgetStatus, 
    getTotalExpenses 
  } = useBudget();
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [budgetAmount, setBudgetAmount] = useState('');
  
  const filteredCategories = categories.filter(
    category => !['salary', 'investments', 'other_income'].includes(category.id)
  );
  
  const totalExpenses = getTotalExpenses();
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalBudgetPercentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
  
  const handleOpenEdit = (categoryId: string) => {
    const existingBudget = budgets.find(b => b.categoryId === categoryId);
    setBudgetAmount(existingBudget ? existingBudget.amount.toString() : '');
    setSelectedCategory(categoryId);
    setIsEditing(true);
  };
  
  const handleSaveBudget = () => {
    if (!selectedCategory) return;
    
    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    updateBudget(selectedCategory, amount);
    toast.success('Budget updated successfully');
    setIsEditing(false);
  };

  const getStatusColor = (percent: number) => {
    if (percent < 50) return 'bg-green-500';
    if (percent < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Budget Planning</h1>
        
        {/* Overall Budget Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8 animate-fade-in">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Overall Budget</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
            <div>
              <span className="text-sm text-gray-500 block mb-1">Total Expenses</span>
              <span className="text-2xl font-bold">{formatCurrency(totalExpenses)}</span>
            </div>
            
            <div>
              <span className="text-sm text-gray-500 block mb-1">Total Budget</span>
              <span className="text-2xl font-bold">{formatCurrency(totalBudget)}</span>
            </div>
          </div>
          
          <div className="mt-4 mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Budget Usage</span>
              <span 
                className={cn(
                  "font-medium",
                  totalBudgetPercentage > 100 ? "text-red-600" : "text-gray-700"
                )}
              >
                {totalBudgetPercentage.toFixed(0)}%
              </span>
            </div>
            <Progress 
              value={Math.min(totalBudgetPercentage, 100)} 
              className="h-2.5" 
              indicatorClassName={getStatusColor(totalBudgetPercentage)}
            />
          </div>
        </div>
        
        {/* Category Budgets */}
        <h2 className="text-lg font-medium text-gray-900 mb-4">Category Budgets</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredCategories.map((category) => {
            const { total, budget, percentage } = getBudgetStatus(category.id);
            
            return (
              <div 
                key={category.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-scale-in"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center bg-${category.color}`}
                      style={{ backgroundColor: `var(--${category.color}, #9B87F5)` }}
                    >
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-medium">{category.name}</h3>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenEdit(category.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Spent: <span className="font-medium text-gray-700">{formatCurrency(total)}</span>
                    </span>
                    <span className="text-gray-500">
                      Budget: <span className="font-medium text-gray-700">{formatCurrency(budget)}</span>
                    </span>
                  </div>
                  
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2" 
                    indicatorClassName={getStatusColor(percentage)}
                  />
                  
                  <div className="flex justify-end">
                    <span 
                      className={cn(
                        "text-sm font-medium",
                        percentage > 100 ? "text-red-600" : "text-gray-700"
                      )}
                    >
                      {percentage.toFixed(0)}% used
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      
      {/* Edit Budget Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Category
              </label>
              <div className="font-medium">
                {selectedCategory && categories.find(c => c.id === selectedCategory)?.name}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Budget Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBudget}>
              Save Budget
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Budget;
