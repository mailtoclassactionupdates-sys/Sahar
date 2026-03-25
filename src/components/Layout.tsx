import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout: React.FC = () => {
  const location = useLocation();
  const hideNavPaths = ['/login', '/signup', '/deposit', '/withdraw', '/create-team'];
  const shouldHideNav = hideNavPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="flex justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl relative flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto pb-16">
          <Outlet />
        </main>
        {!shouldHideNav && <BottomNav />}
      </div>
    </div>
  );
};

export default Layout;
