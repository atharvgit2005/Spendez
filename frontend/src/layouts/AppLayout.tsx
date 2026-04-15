import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/', icon: 'home', label: 'Home' },
    { to: '/expenses', icon: 'account_balance_wallet', label: 'Expenses' },
    { to: '/ocr', icon: 'barcode_scanner', label: 'Scan' },
    { to: '/ai-chat', icon: 'auto_awesome', label: 'AI Chat' },
    { to: '/groups', icon: 'group', label: 'Groups' },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high ring-2 ring-primary/20">
            {user?.avatarUrl ? (
              <img className="w-full h-full object-cover" src={user.avatarUrl} alt="Profile" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary">
                <span className="material-symbols-outlined">person</span>
              </div>
            )}
          </div>
          <span className="text-xl font-bold tracking-tighter text-on-surface font-display">Spendez</span>
        </div>
        <button className="text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        {children}
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-[#131313]/90 backdrop-blur-2xl rounded-t-[32px] shadow-[0_-24px_48px_rgba(0,0,0,0.4)]">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center transition-all active:scale-90 duration-300 ${
                link.label === 'Scan' 
                  ? 'bg-primary text-on-primary rounded-full w-14 h-14 -mt-12 shadow-xl shadow-primary/40'
                  : isActive 
                    ? 'text-primary' 
                    : 'text-on-surface-variant opacity-60 hover:text-primary'
              }`
            }
          >
            <span className={`material-symbols-outlined ${location.pathname === link.to ? 'fill-1' : ''}`} style={{ fontVariationSettings: location.pathname === link.to ? "'FILL' 1" : "'FILL' 0" }}>
              {link.icon}
            </span>
            {link.label !== 'Scan' && (
              <span className="text-[10px] font-medium uppercase tracking-widest mt-1 font-sans">
                {link.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;
