
import { useState } from 'react';
import { useBudget } from '@/context/BudgetContext';
import Navbar from '@/components/layout/Navbar';
import AddTransactionForm from '@/components/transactions/AddTransactionForm';
import { formatCurrency, formatDate } from '@/lib/data';
import { ArrowUpRight, ArrowDownRight, Search, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Transactions = () => {
  const { 
    transactions, 
    categories, 
    getCategoryById,
    deleteTransaction
  } = useBudget();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Filter transactions
  const filteredTransactions = transactions
    .filter(transaction => 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(transaction => 
      categoryFilter === 'all' || transaction.categoryId === categoryFilter
    )
    .filter(transaction => 
      typeFilter === 'all' || transaction.type === typeFilter
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
      toast.success('Transaction deleted successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-20 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="mt-4 sm:mt-0 bg-primary hover:bg-primary/90 text-white shadow-sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
        
        {/* Add Transaction Form */}
        {showAddForm && (
          <div className="mb-8 animate-slide-down">
            <AddTransactionForm 
              onSuccess={() => setShowAddForm(false)}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}
        
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Description</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => {
                    const category = getCategoryById(transaction.categoryId);
                    const isIncome = transaction.type === 'income';
                    
                    return (
                      <tr 
                        key={transaction.id} 
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                isIncome ? "bg-green-100" : "bg-red-100"
                              )}
                            >
                              {isIncome ? (
                                <ArrowUpRight className="text-income w-4 h-4" />
                              ) : (
                                <ArrowDownRight className="text-expense w-4 h-4" />
                              )}
                            </div>
                            <span className="font-medium">{transaction.description}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="category-badge bg-gray-100 text-gray-800">
                            {category?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <span 
                            className={cn(
                              "font-medium",
                              isIncome ? "text-income" : "text-expense"
                            )}
                          >
                            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Transactions;
