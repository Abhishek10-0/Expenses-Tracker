import React from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Expense {
  id: number;
  amount: number;
  description: string;
  category: string;
  created_at: string;
}

export function ExpenseList({ 
  expenses,
  onExpenseDeleted 
}: { 
  expenses: Expense[];
  onExpenseDeleted: () => void;
}) {
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      onExpenseDeleted();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Expenses</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {expenses.map((expense) => (
            <li key={expense.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {expense.description}
                  </p>
                  <div className="mt-1">
                    <p className="text-sm text-gray-500">
                      {expense.category} • {format(new Date(expense.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {expenses.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500">
              No expenses recorded yet
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}