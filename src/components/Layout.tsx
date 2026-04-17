import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, UserPlus, Vote, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

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
                  "flex flex-col items-center justify-center w-full h-16 space-y-1 rounded-2xl transition-all duration-300",
                  isActive
                    ? "text-black bg-gray-200/50 scale-105 shadow-inner"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                )
              }
            >
              <Icon size={24} className="mb-0.5" />
              <span className="text-xs font-bold tracking-tight">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-20 flex flex-col bg-gray-50 text-gray-900 selection:bg-gray-200">
      <main className="flex-1 w-full max-w-7xl mx-auto">{children}</main>
      <BottomNav />
    </div>
  );
}
