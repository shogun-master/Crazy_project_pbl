import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import NotificationDropdown from '../Notifications/NotificationDropdown';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { unreadCount } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">TaskAssign</Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              {currentUser?.role === 'admin' && (
                <Link to="/admin/dashboard" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                  Admin Dashboard
                </Link>
              )}
              <Link to="/tasks" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                My Tasks
              </Link>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <NotificationDropdown onClose={() => setShowNotifications(false)} />
              )}
              <div className="ml-3 relative">
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-700">{currentUser?.name}</span>
                    <span className="text-xs text-gray-500 capitalize">{currentUser?.role}</span>
                  </div>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={currentUser?.avatar || "https://source.unsplash.com/100x100/?portrait"}
                    alt={currentUser?.name || "User"}
                  />
                  <button
                    onClick={handleLogout}
                    className="ml-2 px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {currentUser?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setShowMobileMenu(false)}
              >
                Admin Dashboard
              </Link>
            )}
            <Link
              to="/tasks"
              className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              onClick={() => setShowMobileMenu(false)}
            >
              My Tasks
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;