import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, UserPlus, Vote, Settings, Trophy, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useSystemData } from '../store';

export function BottomNav() {
  const tabs = [
    { to: '/', icon: Home, label: 'Início' },
    { to: '/candidatar', icon: UserPlus, label: 'Candidatar' },
    { to: '/votar', icon: Vote, label: 'Votar' },
    { to: '/ajustes', icon: Settings, label: 'Ajustes' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/60 z-50 shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-20 max-w-2xl mx-auto px-4 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                cn(
                  "relative flex flex-col items-center justify-center w-full h-16 space-y-1 rounded-2xl transition-colors duration-300",
                  isActive
                    ? "text-black"
                    : "text-gray-500 hover:text-gray-900"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-gray-200/50 rounded-2xl shadow-inner -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <motion.div
                    animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -2 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="flex flex-col items-center"
                  >
                    <Icon size={24} className="mb-0.5" />
                    <span className="text-xs font-bold tracking-tight">{tab.label}</span>
                  </motion.div>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [showBanner, setShowBanner] = useState(true);
  const data = useSystemData();
  const isFinalized = data.state.status === 'finished';

  return (
    <div className="min-h-screen pb-20 flex flex-col bg-gray-50 text-gray-900 selection:bg-gray-200">
      <AnimatePresence>
        {isFinalized && showBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-black text-white px-4 py-3 sticky top-0 z-50 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Trophy size={18} className="text-yellow-400 shrink-0" />
                <p className="text-sm font-bold truncate">A eleição foi finalizada! Acesse o início para ver os resultados.</p>
              </div>
              <button onClick={() => setShowBanner(false)} className="text-gray-400 hover:text-white transition-colors shrink-0">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="flex-1 w-full max-w-7xl mx-auto">{children}</main>
      <BottomNav />
    </div>
  );
}
