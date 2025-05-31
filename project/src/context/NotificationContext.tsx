import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '../types';
import { getNotificationsByUserId, markNotificationAsRead } from '../data/mockData';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  markAsRead: () => {},
  refreshNotifications: () => {}
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchNotifications = () => {
    if (!currentUser) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    
    try {
      const userNotifications = getNotificationsByUserId(currentUser.id);
      setNotifications(userNotifications);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  const refreshNotifications = () => {
    setLoading(true);
    fetchNotifications();
  };

  const markAsRead = (notificationId: string) => {
    try {
      markNotificationAsRead(notificationId);
      refreshNotifications();
    } catch (err) {
      setError('Failed to mark notification as read');
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider 
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        refreshNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};