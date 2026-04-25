import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Settings</p>
        <h1 className="text-4xl font-display font-black tracking-tighter text-on-surface">Profile</h1>
      </header>

      <div className="bg-[#1A1A1A] rounded-[32px] p-8 border border-white/5 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-primary/20 blur-3xl rounded-t-[32px]"></div>
        
        <div className="w-24 h-24 bg-surface-container-high rounded-full mx-auto relative z-10 border-4 border-[#131313] flex items-center justify-center shadow-xl">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-4xl text-primary">person</span>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-white mt-4 relative z-10">{user?.name || 'User'}</h2>
        <p className="text-white/50 text-sm relative z-10">{user?.email || 'user@example.com'}</p>
        <div className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full relative z-10">
          {user?.role || 'MEMBER'}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest px-4 mb-4">Account Options</h3>
        
        <button className="w-full p-4 rounded-[24px] bg-[#1A1A1A] border border-white/5 flex items-center justify-between hover:bg-surface-container transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-sm">notifications</span>
            </div>
            <span className="font-medium text-white">Notifications</span>
          </div>
          <span className="material-symbols-outlined text-white/20">chevron_right</span>
        </button>

        <button className="w-full p-4 rounded-[24px] bg-[#1A1A1A] border border-white/5 flex items-center justify-between hover:bg-surface-container transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-sm">security</span>
            </div>
            <span className="font-medium text-white">Security & Privacy</span>
          </div>
          <span className="material-symbols-outlined text-white/20">chevron_right</span>
        </button>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full p-4 rounded-[24px] border border-red-500/20 bg-red-500/5 text-red-400 font-bold flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors"
      >
        <span className="material-symbols-outlined">logout</span>
        Sign Out
      </button>
    </div>
  );
};

export default ProfilePage;