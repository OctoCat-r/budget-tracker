
import { useState } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type AddTransactionFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
};

const AddTransactionForm = ({ 
  onSuccess, 
  onCancel, 
  className,
  isOpen,
  setIsOpen
}: AddTransactionFormProps) => {
  const { addTransaction, categories } = useBudget();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!categoryId) {
      toast.error('Please select a category');
      return;
    }
    
    addTransaction({
      description,
      amount: amountValue,
      categoryId,
      type,
    });
    
    // Reset form
    setDescription('');
    setAmount('');
    setCategoryId('');
    
    toast.success('Transaction added successfully');
    
    if (onSuccess) {
      onSuccess();
    }
    
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setDescription('');
    setAmount('');
    setCategoryId('');
    
    if (onCancel) {
      onCancel();
    }
    
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("bg-white p-6 rounded-xl shadow-sm", className)}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Add Transaction</h3>
        {onCancel && (
          <button 
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Enter transaction description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="transaction-type">Transaction Type</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={type === 'expense' ? 'default' : 'outline'}
              className={cn(
                type === 'expense' ? 'bg-expense text-white' : 'bg-white text-gray-700',
                "transition-all duration-200"
              )}
              onClick={() => setType('expense')}
            >
              Expense
            </Button>
            <Button
              type="button"
              variant={type === 'income' ? 'default' : 'outline'}
              className={cn(
                type === 'income' ? 'bg-income text-white' : 'bg-white text-gray-700',
                "transition-all duration-200"
              )}
              onClick={() => setType('income')}
            >
              Income
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={categoryId}
            onValueChange={setCategoryId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter(category => 
                  (type === 'income' && 
                   ['salary', 'investments', 'other_income'].includes(category.id)) ||
                  (type === 'expense' && 
                   !['salary', 'investments', 'other_income'].includes(category.id))
                )
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </form>
    </div>
  );
};

export default AddTransactionForm;
