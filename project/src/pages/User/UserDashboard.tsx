import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import TaskList from '../../components/Tasks/TaskList';
import { Task } from '../../types';
import { 
  ClipboardCheck, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Bell
} from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { getUserTasks, loading } = useTask();
  const { notifications, unreadCount } = useNotification();
  const userTasks = getUserTasks();
  
  // Task statistics
  const pendingTasks = userTasks.filter(task => task.status === 'pending');
  const inProgressTasks = userTasks.filter(task => task.status === 'in-progress');
  const completedTasks = userTasks.filter(task => task.status === 'completed');
  const verifiedTasks = userTasks.filter(task => task.status === 'verified');
  
  // Task priorities
  const urgentTasks = userTasks.filter(task => task.priority === 'urgent');
  
  // Recent tasks
  const recentTasks = [...userTasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {currentUser?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's an overview of your tasks and activities
        </p>
      </header>
      
      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <ClipboardCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
              <p className="text-2xl font-semibold text-gray-900">{userTasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
              <p className="text-2xl font-semibold text-gray-900">{inProgressTasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {completedTasks.length + verifiedTasks.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Urgent</h3>
              <p className="text-2xl font-semibold text-gray-900">{urgentTasks.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h2>
            
            {recentTasks.length === 0 ? (
              <p className="text-gray-500">No tasks assigned yet.</p>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
            
            {userTasks.length > 5 && (
              <div className="mt-4 text-center">
                <a 
                  href="/tasks" 
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View all tasks
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* Notifications */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              {unreadCount > 0 && (
                <span className="flex items-center text-sm text-blue-600">
                  <Bell className="h-4 w-4 mr-1" />
                  {unreadCount} new
                </span>
              )}
            </div>
            
            {notifications.length === 0 ? (
              <p className="text-gray-500">No notifications</p>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-3 rounded-md border ${!notification.isRead ? 'bg-blue-50 border-blue-100' : 'border-gray-200'}`}
                  >
                    <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.createdAt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple task card component for dashboard display
const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const getStatusBadgeClass = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <a 
      href={`/tasks/${task.id}`}
      className="block p-3 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
        <span 
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadgeClass(task.status)}`}
        >
          {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{task.description}</p>
      <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
        <span>Due: {task.dueDate}</span>
        <span className={`font-medium ${
          task.priority === 'urgent' ? 'text-red-600' : 
          task.priority === 'high' ? 'text-orange-600' : 
          'text-gray-600'
        }`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>
    </a>
  );
};

export default UserDashboard;