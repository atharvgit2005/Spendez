import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client';
import toast from 'react-hot-toast';

interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  expenseDate: string;
}

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const { data } = await api.get('/expenses/me'); // Or whatever the user endpoint is
        setExpenses(data.data || []);
      } catch (error) {
        // Fallback for demo
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">History</p>
          <h1 className="text-4xl font-display font-black tracking-tighter text-on-surface">Expenses</h1>
        </div>
        <button className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary/20 transition-transform active:scale-95">
          <span className="material-symbols-outlined">filter_list</span>
        </button>
      </header>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-surface-container-high animate-pulse rounded-[24px]"></div>
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <div className="text-center py-20 bg-surface-container rounded-[32px] border border-white/5">
          <span className="material-symbols-outlined text-6xl text-white/10 mb-4">receipt_long</span>
          <h3 className="text-xl font-bold text-white/50">No expenses yet</h3>
          <p className="text-white/30 text-sm mt-2">Add an expense to start tracking.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              key={expense._id}
              className="p-4 rounded-[24px] bg-[#1A1A1A] border border-white/5 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-white/50">
                <span className="material-symbols-outlined">
                  {expense.category === 'FOOD' ? 'restaurant' : 
                   expense.category === 'TRAVEL' ? 'flight' : 'receipt'}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white">{expense.title}</h4>
                <p className="text-xs text-white/40">{new Date(expense.expenseDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-on-surface">₹{expense.amount.toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;