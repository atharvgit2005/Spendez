import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Users, Utensils, Plane, Zap, ShoppingBag, Film, Tag, Sparkles } from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses';
import { useGroups } from '../hooks/useGroups';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId?: string;
  onSuccess?: () => void;
}

const CATEGORIES = [
  { id: 'FOOD', label: 'Food', icon: Utensils, color: 'bg-orange-500' },
  { id: 'TRAVEL', label: 'Travel', icon: Plane, color: 'bg-blue-500' },
  { id: 'UTILITIES', label: 'Utilities', icon: Zap, color: 'bg-yellow-500' },
  { id: 'SHOPPING', label: 'Shopping', icon: ShoppingBag, color: 'bg-pink-500' },
  { id: 'ENTERTAINMENT', label: 'Entertainment', icon: Film, color: 'bg-purple-500' },
  { id: 'OTHER', label: 'Other', icon: Tag, color: 'bg-zinc-500' },
];

const SPLIT_TYPES = [
  { id: 'EQUAL', label: 'Equally', description: 'Split evenly among all' },
  { id: 'PERCENTAGE', label: 'Percentage', description: 'Set custom percentages' },
  { id: 'EXACT', label: 'Exact', description: 'Specify exact amounts' },
];

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, groupId: initialGroupId, onSuccess }) => {
  const { user } = useAuth();
  const { groups, selectedGroupId } = useGroups();
  const { createExpense, loading } = useExpenses(selectedGroupId || initialGroupId);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('FOOD');
  const [splitType, setSplitType] = useState('EQUAL');
  const [selectedGroup, setSelectedGroup] = useState(initialGroupId || selectedGroupId || '');

  useEffect(() => {
    if (initialGroupId || selectedGroupId) {
      setSelectedGroup(initialGroupId || selectedGroupId || '');
    }
  }, [initialGroupId, selectedGroupId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !selectedGroup) {
      toast.error('Please fill in all required fields');
      return;
    }

    const data = {
      title,
      amount: parseFloat(amount),
      category,
      splitType,
      groupId: selectedGroup,
      paidBy: user?.id,
      splitConfig: {
        participants: groups.find(g => g.id === selectedGroup)?.memberIds || []
      }
    };

    const result = await createExpense(data);
    if (result) {
      onSuccess?.();
      onClose();
      setTitle('');
      setAmount('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-surface-container-high rounded-t-[32px] sm:rounded-[32px] overflow-hidden pointer-events-auto border border-white/5 shadow-2xl"
            >
              <div className="p-6 sm:p-8 space-y-8 max-h-[90vh] overflow-y-auto no-scrollbar">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-extrabold tracking-tight text-on-surface">Add Expense</h2>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-on-surface-variant hover:bg-white/10 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Amount Input (Hero) */}
                  <div className="text-center space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Amount</p>
                    <div className="relative inline-flex items-center">
                      <span className="text-4xl font-display font-medium text-primary mr-2">₹</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-transparent border-none text-6xl font-display font-black text-on-surface placeholder:text-white/10 focus:ring-0 w-48 text-center"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Title</label>
                      <input
                        type="text"
                        placeholder="What was this for?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-surface-container-highest/50 border border-white/5 rounded-2xl p-4 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    {/* Group Selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Workspace</label>
                      <div className="grid grid-cols-1 gap-2">
                        <select
                          value={selectedGroup}
                          onChange={(e) => setSelectedGroup(e.target.value)}
                          className="w-full bg-surface-container-highest/50 border border-white/5 rounded-2xl p-4 text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                        >
                          <option value="">Select a group</option>
                          {groups.map(g => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant ml-1">Category</label>
                      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl transition-all border ${category === cat.id
                              ? 'bg-primary text-on-primary border-primary'
                              : 'bg-surface-container-highest/50 border-white/5 text-on-surface-variant'
                              }`}
                          >
                            <cat.icon size={18} />
                            <span className="text-sm font-bold">{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Split Strategy */}
                    <div className="p-5 rounded-[32px] bg-primary/5 border border-primary/10 space-y-4">
                      <div className="flex items-center gap-2 text-primary">
                        <Sparkles size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Splitting Intelligence</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {SPLIT_TYPES.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setSplitType(type.id)}
                            className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${splitType === type.id
                              ? 'bg-primary/20 border-primary text-primary'
                              : 'bg-black/20 border-white/5 text-on-surface-variant'
                              }`}
                          >
                            <div className="text-left">
                              <p className="text-sm font-bold">{type.label}</p>
                              <p className="text-[10px] opacity-60 font-medium">{type.description}</p>
                            </div>
                            {splitType === type.id && (
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Plus size={14} className="text-on-primary rotate-45" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-on-primary font-display font-black text-lg py-5 rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-[0_12px_24px_-12px_rgba(185,195,255,0.4)] disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Record Expense'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddExpenseModal;
