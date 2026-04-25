import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client';
import toast from 'react-hot-toast';

interface Group {
  _id: string;
  name: string;
  description?: string;
  currency: string;
  members: any[];
}

const GroupsPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const fetchGroups = async () => {
    try {
      const { data } = await api.get('/groups');
      setGroups(data.data || []);
    } catch (error) {
      toast.error('Failed to load groups');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    try {
      const { data } = await api.post('/groups', {
        name: newGroupName,
        description: newGroupDesc,
        currency: 'USD'
      });
      setGroups([...groups, data.data]);
      setShowCreateModal(false);
      setNewGroupName('');
      setNewGroupDesc('');
      toast.success('Group created successfully!');
    } catch (error) {
      toast.error('Failed to create group');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Your Networks</p>
          <h1 className="text-4xl font-display font-black tracking-tighter text-on-surface">Groups</h1>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-primary text-on-primary w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-surface-container-high animate-pulse rounded-[32px]"></div>
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-20 bg-surface-container rounded-[32px] border border-white/5">
          <span className="material-symbols-outlined text-6xl text-white/10 mb-4">group_off</span>
          <h3 className="text-xl font-bold text-white/50">No groups yet</h3>
          <p className="text-white/30 text-sm mt-2">Create a group to start sharing expenses!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={group._id} 
              className="p-6 rounded-[32px] bg-[#1A1A1A] border border-white/5 hover:border-primary/30 transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {group.name.charAt(0).toUpperCase()}
                </div>
                <span className="material-symbols-outlined text-white/20 group-hover:text-primary transition-colors">chevron_right</span>
              </div>
              <h3 className="text-xl font-bold text-white">{group.name}</h3>
              {group.description && <p className="text-sm text-white/40 mt-1 line-clamp-1">{group.description}</p>}
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#1A1A1A] rounded-[32px] p-6 shadow-2xl border border-white/10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">New Group</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-white/50 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-white/50 uppercase pl-1">Group Name</label>
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-[#2A2A2A] text-white rounded-2xl py-3 px-4 mt-1 outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Goa Trip"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-white/50 uppercase pl-1">Description (Optional)</label>
                <textarea
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full bg-[#2A2A2A] text-white rounded-2xl py-3 px-4 mt-1 outline-none focus:ring-2 focus:ring-primary/50 resize-none h-24"
                  placeholder="What's this group for?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-on-primary font-bold rounded-2xl py-4 mt-4 hover:bg-primary/90 active:scale-[0.98] transition-transform"
              >
                Create Group
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;