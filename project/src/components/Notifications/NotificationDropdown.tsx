import React from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { format } from 'date-fns';

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { notifications, markAsRead } = useNotification();

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 top-10">
      <div className="px-4 py-2 text-lg font-semibold border-b border-gray-200">
        Notifications
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <Link
              key={notification.id}
              to={notification.link || '#'}
              className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleNotificationClick(notification.id)}
            >
              <div className="flex justify-between">
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(notification.createdAt), 'MMM d')}
                </p>
              </div>
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              {!notification.isRead && (
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full ml-1"></span>
              )}
            </Link>
          ))
        )}
      </div>
      <div className="border-t border-gray-200 px-4 py-2">
        <Link
          to="/notifications"
          className="block text-sm text-blue-600 hover:text-blue-800"
          onClick={onClose}
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;