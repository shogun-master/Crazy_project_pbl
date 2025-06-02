import React from 'react';
import { Task } from '../../types';
import { Link } from 'react-router-dom';
import { Clock, AlertTriangle, CheckCircle, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { getUserById } from '../../data/mockData';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getStatusClass = (status: Task['status']) => {
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

  const getPriorityClass = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const renderAssignedUsers = () => {
    if (!task.assignedTo || task.assignedTo.length === 0) {
      return (
        <div className="flex items-center text-sm text-gray-500">
          <User className="h-4 w-4 mr-1" />
          <span>Assigned to role: {task.assignedToRole}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center text-sm text-gray-500">
        <User className="h-4 w-4 mr-1" />
        <span>
          {task.assignedTo.length > 1 
            ? `${task.assignedTo.length} users assigned` 
            : getUserById(task.assignedTo[0])?.name}
        </span>
      </div>
    );
  };

  return (
    <Link
      to={`/tasks/${task.id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{task.title}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(task.status)}`}>
            {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
          </div>
          
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityClass(task.priority)}`}>
            {getPriorityIcon(task.priority)}
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          {renderAssignedUsers()}
          
          <div className="flex items-center text-sm text-gray-500">
            {task.verificationRequest ? (
              task.verificationRequest.approved ? (
                <span className="inline-flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center text-yellow-600">
                  <Clock className="h-4 w-4 mr-1" />
                  Pending Verification
                </span>
              )
            ) : (
              <span className="text-gray-500">
                {task.comments.length} {task.comments.length === 1 ? 'comment' : 'comments'}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TaskCard;