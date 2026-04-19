import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, IndianRupee, CreditCard, Banknote, Smartphone, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../api/client';

interface SettleUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onSuccess: () => void;
  initialData?: {
    toUserId: string;
    toUserName: string;
    amount: number;
  };
}

const SettleUpModal: React.FC<SettleUpModalProps> = ({ isOpen, onClose, groupId, onSuccess, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    toUserId: initialData?.toUserId || '',
    amount: initialData?.amount || '',
    method: 'CASH',
    referenceNote: ''
  });

  useEffect(() => {
    if (isOpen && groupId) {
      loadMembers();
    }
    if (initialData) {
        setFormData(prev => ({
            ...prev,
            toUserId: initialData.toUserId,
            amount: initialData.amount
        }));
    }
  }, [isOpen, groupId, initialData]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/groups/${groupId}`);
      // Assuming group has memberIds populated with user objects or we fetch them
      // For now, we'll assume the API returns members
      setMembers(res.data.data.members || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.toUserId || !formData.amount) {
      toast.error('Please select a recipient and amount');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/payments', {
        ...formData,
        groupId,
        amount: Number(formData.amount),
        status: 'COMPLETED' // For simplicity in settle up
      });
      toast.success('Settlement recorded!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Failed to record settlement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0e0e0e]/90 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-surface-container-high rounded-[48px] overflow-hidden border border-white/5 shadow-2xl"
          >
            {/* Header */}
            <div className="px-8 pt-10 pb-6 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Settlement Window</span>
                </div>
                <h2 className="font-display text-4xl font-extrabold tracking-tighter text-on-surface leading-none">Record Payment</h2>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-on-surface-variant hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-8">
              {/* Recipient Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">Pay To</label>
                <div className="grid grid-cols-1 gap-2">
                   {initialData ? (
                       <div className="flex items-center gap-4 p-4 rounded-[24px] bg-primary/10 border border-primary/20">
                           <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold">
                               {initialData.toUserName[0]}
                           </div>
                           <span className="font-bold text-on-surface">{initialData.toUserName}</span>
                       </div>
                   ) : (
                       <select 
                        value={formData.toUserId}
                        onChange={(e) => setFormData({...formData, toUserId: e.target.value})}
                        className="w-full bg-surface-container rounded-[24px] border-white/5 text-on-surface p-4 focus:ring-primary focus:border-primary transition-all font-bold"
                       >
                         <option value="">Select a member</option>
                         {members.map(m => (
                           <option key={m.id} value={m.id}>{m.name}</option>
                         ))}
                       </select>
                   )}
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">Amount (INR)</label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary">
                    <IndianRupee size={24} />
                  </div>
                  <input 
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                    className="w-full bg-surface-container rounded-[32px] border-white/5 text-on-surface py-6 pl-16 pr-8 text-3xl font-display font-black focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'CASH', icon: Banknote, label: 'Cash' },
                    { id: 'UPI', icon: Smartphone, label: 'UPI' },
                    { id: 'CARD', icon: CreditCard, label: 'Card' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData({...formData, method: m.id})}
                      className={`flex flex-col items-center gap-2 p-4 rounded-[28px] border transition-all ${
                        formData.method === m.id 
                          ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20' 
                          : 'bg-surface-container border-white/5 text-on-surface-variant hover:bg-surface-container-highest'
                      }`}
                    >
                      <m.icon size={20} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-2">Note (Optional)</label>
                <input 
                  type="text"
                  value={formData.referenceNote}
                  onChange={(e) => setFormData({...formData, referenceNote: e.target.value})}
                  placeholder="What is this for?"
                  className="w-full bg-surface-container rounded-[24px] border-white/5 text-on-surface p-4 focus:ring-primary focus:border-primary transition-all text-sm font-medium"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-on-primary py-6 rounded-[32px] font-display font-black text-lg uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Complete Settlement
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettleUpModal;
