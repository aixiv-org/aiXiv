import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Upload, Bell, User } from 'lucide-react';

const MobileNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Search, label: 'Explore' },
    { path: '/submit', icon: Upload, label: 'Submit' },
    { path: '/notifications', icon: Bell, label: 'Inbox' },
    { path: '/workspace', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center space-y-1 flex-1 h-full transition-colors duration-200 ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary-600 dark:bg-primary-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
