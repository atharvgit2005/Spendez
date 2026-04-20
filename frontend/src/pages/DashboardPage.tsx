import React from 'react';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Overview</p>
        <h1 className="text-4xl font-display font-black tracking-tighter text-on-surface">Dashboard</h1>
      </header>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="p-8 rounded-[32px] bg-primary/10 border border-primary/20">
          <p className="text-sm font-medium text-primary/80">Total Balance</p>
          <p className="text-5xl font-display font-black text-on-surface mt-2">₹0.00</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
