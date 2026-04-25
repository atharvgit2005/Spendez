import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalOwed: 0, totalOwes: 0, totalBalance: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Assume analytics endpoint handles user dashboard stats
        const { data } = await api.get('/analytics/dashboard');
        // fallback in case api not perfectly mapped
        setStats({
          totalOwed: data.data?.totalOwed || 0,
          totalOwes: data.data?.totalOwes || 0,
          totalBalance: (data.data?.totalOwed || 0) - (data.data?.totalOwes || 0)
        });
      } catch (error) {
        // Graceful fallback for demo
        setStats({ totalOwed: 0, totalOwes: 0, totalBalance: 0 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-8 pb-20">
      <header className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Welcome back</p>
        <h1 className="text-4xl font-display font-black tracking-tighter text-on-surface">
          {user?.name?.split(' ')[0] || 'Dashboard'}
        </h1>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[32px] bg-primary/10 border border-primary/20 relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl"></div>
          <p className="text-sm font-medium text-primary/80 relative z-10">Total Balance</p>
          <p className={`text-5xl font-display font-black mt-2 relative z-10 ${stats.totalBalance >= 0 ? 'text-on-surface' : 'text-red-400'}`}>
            {stats.totalBalance >= 0 ? '+' : '-'}₹{Math.abs(stats.totalBalance).toFixed(2)}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-[32px] bg-[#1A1A1A] border border-white/5"
        >
          <p className="text-xs text-white/50 uppercase tracking-widest font-semibold">You owe</p>
          <p className="text-2xl font-bold text-red-400 mt-2">₹{stats.totalOwes.toFixed(2)}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-[32px] bg-[#1A1A1A] border border-white/5"
        >
          <p className="text-xs text-white/50 uppercase tracking-widest font-semibold">You are owed</p>
          <p className="text-2xl font-bold text-green-400 mt-2">₹{stats.totalOwed.toFixed(2)}</p>
        </motion.div>
      </div>
      
      <div className="pt-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="text-center py-10 bg-surface-container rounded-[32px] border border-white/5">
          <span className="material-symbols-outlined text-4xl text-white/10 mb-2">history</span>
          <p className="text-white/30 text-sm">No recent activity</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
