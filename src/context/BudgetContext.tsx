
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Budget, Category, mockTransactions, mockBudgets, mockCategories } from '@/lib/data';

type BudgetContextType = {
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (categoryId: string, amount: number) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getNetBalance: () => number;
  getCategoryTotal: (categoryId: string) => number;
  getBudgetStatus: (categoryId: string) => { total: number; budget: number; percentage: number };
  getRecentTransactions: (limit?: number) => Transaction[];
  getTransactionsByCategory: () => Record<string, number>;
  getCategoryById: (id: string) => Category | undefined;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Initialize with mock data
  useEffect(() => {
    setTransactions(mockTransactions);
    setBudgets(mockBudgets);
    setCategories(mockCategories);
  }, []);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 11),
      date: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...transaction } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateBudget = (categoryId: string, amount: number) => {
    setBudgets((prev) => {
      const existingBudgetIndex = prev.findIndex((b) => b.categoryId === categoryId);
      if (existingBudgetIndex >= 0) {
        const updatedBudgets = [...prev];
        updatedBudgets[existingBudgetIndex] = {
          ...updatedBudgets[existingBudgetIndex],
          amount,
        };
        return updatedBudgets;
      } else {
        return [...prev, { categoryId, amount }];
      }
    });
  };

  const getTotalIncome = () => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getNetBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getCategoryTotal = (categoryId: string) => {
    return transactions
      .filter((t) => t.categoryId === categoryId)
      .reduce((sum, t) => {
        if (t.type === 'expense') {
          return sum + t.amount;
        }
        return sum;
      }, 0);
  };

  const getBudgetStatus = (categoryId: string) => {
    const total = getCategoryTotal(categoryId);
    const budget = budgets.find((b) => b.categoryId === categoryId)?.amount || 0;
    const percentage = budget > 0 ? (total / budget) * 100 : 0;
    return { total, budget, percentage };
  };

  const getRecentTransactions = (limit = 5) => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  const getTransactionsByCategory = () => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, transaction) => {
        const { categoryId, amount } = transaction;
        acc[categoryId] = (acc[categoryId] || 0) + amount;
        return acc;
      }, {} as Record<string, number>);
  };

  const getCategoryById = (id: string) => {
    return categories.find((c) => c.id === id);
  };

  const value = {
    transactions,
    budgets,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateBudget,
    getTotalIncome,
    getTotalExpenses,
    getNetBalance,
    getCategoryTotal,
    getBudgetStatus,
    getRecentTransactions,
    getTransactionsByCategory,
    getCategoryById,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
