
export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  categoryId: string;
  type: 'income' | 'expense';
};

export type Budget = {
  categoryId: string;
  amount: number;
};

export const mockCategories: Category[] = [
  { id: 'food', name: 'Food & Dining', color: 'food', icon: 'utensils' },
  { id: 'transport', name: 'Transportation', color: 'transport', icon: 'car' },
  { id: 'housing', name: 'Housing', color: 'housing', icon: 'home' },
  { id: 'utilities', name: 'Utilities', color: 'utilities', icon: 'zap' },
  { id: 'entertainment', name: 'Entertainment', color: 'entertainment', icon: 'film' },
  { id: 'shopping', name: 'Shopping', color: 'expense', icon: 'shopping-bag' },
  { id: 'health', name: 'Health & Fitness', color: 'investment', icon: 'activity' },
  { id: 'personal', name: 'Personal Care', color: 'savings', icon: 'user' },
  { id: 'education', name: 'Education', color: 'primary', icon: 'book-open' },
  { id: 'gifts', name: 'Gifts & Donations', color: 'income', icon: 'gift' },
  { id: 'salary', name: 'Salary', color: 'income', icon: 'dollar-sign' },
  { id: 'investments', name: 'Investments', color: 'investment', icon: 'trending-up' },
  { id: 'other_income', name: 'Other Income', color: 'income', icon: 'plus-circle' },
];

export const mockBudgets: Budget[] = [
  { categoryId: 'food', amount: 500 },
  { categoryId: 'transport', amount: 300 },
  { categoryId: 'housing', amount: 1200 },
  { categoryId: 'utilities', amount: 200 },
  { categoryId: 'entertainment', amount: 150 },
  { categoryId: 'shopping', amount: 200 },
  { categoryId: 'health', amount: 100 },
  { categoryId: 'personal', amount: 50 },
  { categoryId: 'education', amount: 100 },
  { categoryId: 'gifts', amount: 50 },
];

// Generate dates for the past month
const generateRecentDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const mockTransactions: Transaction[] = [
  // Income transactions
  {
    id: 't1',
    date: generateRecentDate(29),
    description: 'Monthly Salary',
    amount: 5000,
    categoryId: 'salary',
    type: 'income',
  },
  {
    id: 't2',
    date: generateRecentDate(22),
    description: 'Freelance Work',
    amount: 650,
    categoryId: 'other_income',
    type: 'income',
  },
  {
    id: 't3',
    date: generateRecentDate(15),
    description: 'Dividend Payment',
    amount: 120,
    categoryId: 'investments',
    type: 'income',
  },
  
  // Expense transactions
  {
    id: 't4',
    date: generateRecentDate(28),
    description: 'Rent Payment',
    amount: 1200,
    categoryId: 'housing',
    type: 'expense',
  },
  {
    id: 't5',
    date: generateRecentDate(27),
    description: 'Grocery Shopping',
    amount: 85.75,
    categoryId: 'food',
    type: 'expense',
  },
  {
    id: 't6',
    date: generateRecentDate(26),
    description: 'Electric Bill',
    amount: 65.42,
    categoryId: 'utilities',
    type: 'expense',
  },
  {
    id: 't7',
    date: generateRecentDate(23),
    description: 'Gas Station',
    amount: 45.50,
    categoryId: 'transport',
    type: 'expense',
  },
  {
    id: 't8',
    date: generateRecentDate(21),
    description: 'Movies Night',
    amount: 32.99,
    categoryId: 'entertainment',
    type: 'expense',
  },
  {
    id: 't9',
    date: generateRecentDate(20),
    description: 'New Shoes',
    amount: 79.99,
    categoryId: 'shopping',
    type: 'expense',
  },
  {
    id: 't10',
    date: generateRecentDate(18),
    description: 'Gym Membership',
    amount: 50,
    categoryId: 'health',
    type: 'expense',
  },
  {
    id: 't11',
    date: generateRecentDate(16),
    description: 'Hair Cut',
    amount: 35,
    categoryId: 'personal',
    type: 'expense',
  },
  {
    id: 't12',
    date: generateRecentDate(14),
    description: 'Online Course',
    amount: 79.99,
    categoryId: 'education',
    type: 'expense',
  },
  {
    id: 't13',
    date: generateRecentDate(12),
    description: 'Birthday Gift',
    amount: 50,
    categoryId: 'gifts',
    type: 'expense',
  },
  {
    id: 't14',
    date: generateRecentDate(10),
    description: 'Restaurant Dinner',
    amount: 68.50,
    categoryId: 'food',
    type: 'expense',
  },
  {
    id: 't15',
    date: generateRecentDate(8),
    description: 'Subway Pass',
    amount: 30,
    categoryId: 'transport',
    type: 'expense',
  },
  {
    id: 't16',
    date: generateRecentDate(7),
    description: 'Water Bill',
    amount: 32.50,
    categoryId: 'utilities',
    type: 'expense',
  },
  {
    id: 't17',
    date: generateRecentDate(5),
    description: 'Coffee Shop',
    amount: 4.75,
    categoryId: 'food',
    type: 'expense',
  },
  {
    id: 't18',
    date: generateRecentDate(3),
    description: 'Spotify Subscription',
    amount: 9.99,
    categoryId: 'entertainment',
    type: 'expense',
  },
  {
    id: 't19',
    date: generateRecentDate(2),
    description: 'Pharmacy',
    amount: 22.45,
    categoryId: 'health',
    type: 'expense',
  },
  {
    id: 't20',
    date: generateRecentDate(1),
    description: 'Phone Bill',
    amount: 45,
    categoryId: 'utilities',
    type: 'expense',
  },
  {
    id: 't21',
    date: generateRecentDate(0),
    description: 'Fast Food',
    amount: 12.99,
    categoryId: 'food',
    type: 'expense',
  },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
