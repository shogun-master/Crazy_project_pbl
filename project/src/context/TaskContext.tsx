import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Comment, VerificationRequest, UserRole } from '../types';
import { 
  getTasks, 
  getTaskById, 
  getTasksByUserId, 
  getTasksByRole,
  addTask,
  updateTaskStatus,
  addComment,
  requestVerification,
  approveVerification
} from '../data/mockData';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  getUserTasks: () => Task[];
  getTaskDetails: (id: string) => Task | null;
  createTask: (task: Omit<Task, 'id' | 'comments' | 'verificationRequest' | 'createdAt'>) => Promise<Task | null>;
  updateStatus: (taskId: string, status: Task['status']) => Promise<Task | null>;
  addTaskComment: (taskId: string, text: string) => Promise<Comment | null>;
  submitForVerification: (taskId: string, comment: string) => Promise<VerificationRequest | null>;
  verifyTask: (taskId: string, approvalComment: string) => Promise<Task | null>;
  getPendingVerifications: () => Task[];
  refreshTasks: () => void;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  loading: false,
  error: null,
  getUserTasks: () => [],
  getTaskDetails: () => null,
  createTask: async () => null,
  updateStatus: async () => null,
  addTaskComment: async () => null,
  submitForVerification: async () => null,
  verifyTask: async () => null,
  getPendingVerifications: () => [],
  refreshTasks: () => {}
});

export const useTask = () => useContext(TaskContext);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const fetchTasks = () => {
    try {
      const allTasks = getTasks();
      setTasks(allTasks);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const refreshTasks = () => {
    setLoading(true);
    fetchTasks();
  };

  const getUserTasks = () => {
    if (!currentUser) return [];
    
    if (currentUser.role === 'admin') {
      return tasks;
    }
    
    // Get tasks assigned directly to the user
    const userTasks = getTasksByUserId(currentUser.id);
    
    // Get tasks assigned to the user's role
    const roleTasks = getTasksByRole(currentUser.role);
    
    // Combine and deduplicate
    const combinedTasks = [...userTasks];
    
    roleTasks.forEach(roleTask => {
      if (!combinedTasks.some(task => task.id === roleTask.id)) {
        combinedTasks.push(roleTask);
      }
    });
    
    return combinedTasks;
  };

  const getTaskDetails = (id: string) => {
    return getTaskById(id);
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'comments' | 'verificationRequest' | 'createdAt'>) => {
    try {
      const newTask = addTask(taskData);
      refreshTasks();
      return newTask;
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
      return null;
    }
  };

  const updateStatus = async (taskId: string, status: Task['status']) => {
    try {
      const updatedTask = updateTaskStatus(taskId, status);
      refreshTasks();
      return updatedTask;
    } catch (err) {
      setError('Failed to update task status');
      console.error(err);
      return null;
    }
  };

  const addTaskComment = async (taskId: string, text: string) => {
    try {
      if (!currentUser) throw new Error('User not authenticated');
      
      const comment = addComment({
        taskId,
        userId: currentUser.id,
        text
      });
      
      refreshTasks();
      return comment;
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
      return null;
    }
  };

  const submitForVerification = async (taskId: string, comment: string) => {
    try {
      if (!currentUser) throw new Error('User not authenticated');
      
      const verificationRequest = requestVerification({
        taskId,
        userId: currentUser.id,
        comment
      });
      
      refreshTasks();
      return verificationRequest;
    } catch (err) {
      setError('Failed to submit for verification');
      console.error(err);
      return null;
    }
  };

  const verifyTask = async (taskId: string, approvalComment: string) => {
    try {
      const updatedTask = approveVerification(taskId, approvalComment);
      refreshTasks();
      return updatedTask;
    } catch (err) {
      setError('Failed to verify task');
      console.error(err);
      return null;
    }
  };

  const getPendingVerifications = () => {
    return tasks.filter(task => 
      task.verificationRequest && 
      !task.verificationRequest.approved
    );
  };

  return (
    <TaskContext.Provider 
      value={{
        tasks,
        loading,
        error,
        getUserTasks,
        getTaskDetails,
        createTask,
        updateStatus,
        addTaskComment,
        submitForVerification,
        verifyTask,
        getPendingVerifications,
        refreshTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};