
import { useBudget } from '@/context/BudgetContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useId } from 'react';

type ExpenseChartProps = {
  className?: string;
};

const ExpenseChart = ({ className }: ExpenseChartProps) => {
  const { getTransactionsByCategory, getCategoryById } = useBudget();
  const chartId = useId();

  const transactionsByCategory = getTransactionsByCategory();
  const data = Object.entries(transactionsByCategory).map(([categoryId, amount]) => {
    const category = getCategoryById(categoryId);
    return {
      name: category?.name || 'Unknown',
      value: amount,
      color: category?.color || 'gray',
    };
  }).sort((a, b) => b.value - a.value);

  const getColorClass = (colorName: string) => {
    const colorMap: Record<string, string> = {
      food: '#A1E887',
      transport: '#87CEFA',
      housing: '#D3A1E8',
      utilities: '#E8D3A1',
      entertainment: '#FFB347',
      expense: '#FF6B6B',
      income: '#4ECB71',
      savings: '#4EADCB',
      investment: '#9B87F5',
      primary: '#3B82F6',
    };
    return colorMap[colorName] || colorMap.primary;
  };

  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-100">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-primary font-semibold">{formatTooltipValue(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const totalExpenses = Object.values(transactionsByCategory).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border border-gray-100 ${className}`}>
      <h3 className="text-lg font-medium mb-6">Expense Breakdown</h3>
      
      {data.length > 0 ? (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={50}
                paddingAngle={2}
                dataKey="value"
                id={chartId}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColorClass(entry.color)} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                iconType="circle"
                formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[300px] w-full flex items-center justify-center flex-col">
          <p className="text-gray-400 text-center">No expense data available</p>
          <p className="text-gray-400 text-sm text-center mt-2">Add expenses to see your spending breakdown</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseChart;
