import { useState, useCallback } from 'react';
import api from '../api/client';
import { toast } from 'react-hot-toast';

export const useExpenses = (groupId?: string) => {
  const [loading, setLoading] = useState(false);

  const createExpense = useCallback(async (expenseData: any) => {
    if (!groupId) return null;
    
    setLoading(true);
    try {
      const { data } = await api.post(`/groups/${groupId}/expenses`, expenseData);
      toast.success('Expense added successfully!');
      return data.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add expense');
      return null;
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  return { createExpense, loading };
};
