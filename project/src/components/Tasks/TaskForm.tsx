import React, { useState } from 'react';
import { Task, UserRole } from '../../types';
import { getUsers } from '../../data/mockData';
import { useTask } from '../../context/TaskContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

interface TaskFormProps {
  onSuccess?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSuccess }) => {
  const allUsers = getUsers();
  const { createTask } = useTask();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(format(new Date().setDate(new Date().getDate() + 7), 'yyyy-MM-dd'));
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [assignmentType, setAssignmentType] = useState<'role' | 'users'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole>('frontend');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const handleUserToggle = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createTask({
        title,
        description,
        dueDate,
        status: 'pending',
        priority,
        assignedTo: assignmentType === 'users' ? selectedUsers : null,
        assignedToRole: assignmentType === 'role' ? selectedRole : null
      });
      
      toast.success('Task created successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setDueDate(format(new Date().setDate(new Date().getDate() + 7), 'yyyy-MM-dd'));
      setPriority('medium');
      setAssignmentType('role');
      setSelectedRole('frontend');
      setSelectedUsers([]);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      toast.error('Failed to create task');
      console.error(err);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Task</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              required
            />
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Task['priority'])}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assignment Type
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="role"
                checked={assignmentType === 'role'}
                onChange={() => setAssignmentType('role')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Assign to Role</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="users"
                checked={assignmentType === 'users'}
                onChange={() => setAssignmentType('users')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Assign to Users</span>
            </label>
          </div>
        </div>
        
        {assignmentType === 'role' ? (
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Select Role
            </label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="designer">Designer</option>
              <option value="testing">Testing</option>
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Users
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
              {allUsers
                .filter(user => user.role !== 'admin')
                .map(user => (
                  <label key={user.id} className="flex items-center py-2 px-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserToggle(user.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 flex items-center">
                      <img 
                        src={user.avatar || "https://source.unsplash.com/100x100/?portrait"} 
                        alt={user.name}
                        className="h-6 w-6 rounded-full mr-2"
                      />
                      <span className="text-sm text-gray-700">{user.name}</span>
                      <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize">
                        {user.role}
                      </span>
                    </span>
                  </label>
                ))}
            </div>
            {selectedUsers.length === 0 && assignmentType === 'users' && (
              <p className="text-xs text-red-500 mt-1">Please select at least one user</p>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <button
          type="submit"
          disabled={assignmentType === 'users' && selectedUsers.length === 0}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Create Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;