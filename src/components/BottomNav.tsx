import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlaySquare, Trophy, Wallet, User } from 'lucide-react';
import { clsx } from 'clsx';

const BottomNav: React.FC = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/watch', icon: PlaySquare, label: 'Watch' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaders' },
    { path: '/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="absolute bottom-0 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center h-16 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            clsx(
              "flex flex-col items-center justify-center w-full h-full transition-colors",
              isActive ? "text-red-600 dark:text-red-500" : "text-gray-500 dark:text-gray-400 hover:text-red-500"
            )
          }
        >
          <item.icon className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
