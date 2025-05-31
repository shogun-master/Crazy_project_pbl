import { User, Task, Notification, UserRole, UserStatus } from '../types';
import { format } from 'date-fns';

// Mock Users with default admin and sample users
export const users: User[] = [
  {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
    status: 'approved',
    avatar: 'https://source.unsplash.com/100x100/?portrait,1'
  },
  // Frontend Developers
  {
    id: 'frontend1',
    name: 'Sarah Johnson',
    email: 'sarah.j@gmail.com',
    password: 'frontend123',
    role: 'frontend',
    status: 'approved',
    avatar: 'https://source.unsplash.com/100x100/?portrait,2'
  },
  {
    id: 'frontend2',
    name: 'Michael Chen',
    email: 'michael.c@gmail.com',
    password: 'frontend123',
    role: 'frontend',
    status: 'approved',
    avatar: 'https://source.unsplash.com/100x100/?portrait,3'
  },
  // Backend Developers
  {
    id: 'backend1',
    name: 'David Smith',
    email: 'david.s@gmail.com',
    password: 'backend123',
    role: 'backend',
    status: 'approved',
    avatar: 'https://source.unsplash.com/100x100/?portrait,4'
  },
  {
    id: 'backend2',
    name: 'Emily Brown',
    email: 'emily.b@gmail.com',
    password: 'backend123',
    role: 'backend',
    status: 'approved',
    avatar: 'https://source.unsplash.com/100x100/?portrait,5'
  },
  // Designers
  {
    id: 'designer1',
    name: 'Sophie Turner',
    email: 'sophie.t@gmail.com',
    password: 'design123',
    role: 'designer',
    status: 'approved',
    avatar: 'https://source.unsplash.com/100x100/?portrait,6'
  },
  {
    id: 'designer2',
    name: 'Alex Rivera',
    email: 'alex.r@gmail.com',
    password: 'design123',
    role: 'designer',
    status: 'approved',
    avatar: 'https://source.unsplash.com/100x100/?portrait,7'
  },
  // QA Testers
  {
    id: 'testing1',
    name: 'James Wilson',
    email: 'james.w@gmail.com',
    password: 'testing123',
    role: 'testing',
    status: 'approved',
    avatar: 'https://source.unsplash.com/100x100/?portrait,8'
  },
  {
    id: 'testing2',
    name: 'Lisa Anderson',
    email: 'lisa.a@gmail.com',
    password: 'testing123',
    role: 'testing',
    status: 'approved',
    avatar: 'https://source.unsplash.com/100x100/?portrait,9'
  }
];

// Empty initial tasks
export const tasks: Task[] = [];

// Empty initial notifications
export const notifications: Notification[] = [];

// Mock get functions
export const getUsers = () => {
  return [...users];
};

export const getPendingUsers = () => {
  return users.filter(user => user.status === 'pending');
};

export const getUserById = (id: string) => {
  return users.find(user => user.id === id) || null;
};

export const getUserByEmail = (email: string) => {
  return users.find(user => user.email === email) || null;
};

export const validateCredentials = (email: string, password: string) => {
  const user = users.find(u => u.email === email && u.password === password && u.status === 'approved');
  return user || null;
};

export const approveUser = (userId: string) => {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].status = 'approved';
    addNotification({
      userId,
      title: 'Account Approved',
      message: 'Your account has been approved by the admin. You can now log in.',
      link: '/login'
    });
    return users[userIndex];
  }
  return null;
};

export const rejectUser = (userId: string) => {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].status = 'rejected';
    addNotification({
      userId,
      title: 'Account Rejected',
      message: 'Your account registration has been rejected by the admin.',
      link: '/login'
    });
    // Remove the user from the array after rejection
    users.splice(userIndex, 1);
    return true;
  }
  return false;
};

export const getTasks = () => {
  return [...tasks];
};

export const getTaskById = (id: string) => {
  return tasks.find(task => task.id === id) || null;
};

export const getTasksByUserId = (userId: string) => {
  return tasks.filter(task => task.assignedTo?.includes(userId));
};

export const getTasksByRole = (role: UserRole) => {
  return tasks.filter(task => task.assignedToRole === role);
};

export const getTasksByDateRange = (startDate: Date, endDate: Date) => {
  return tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    return taskDate >= startDate && taskDate <= endDate;
  });
};

export const getNotificationsByUserId = (userId: string) => {
  return notifications.filter(notif => notif.userId === userId);
};

export const getVerificationRequests = () => {
  return tasks
    .filter(task => task.verificationRequest && !task.verificationRequest.approved)
    .map(task => ({
      task,
      verificationRequest: task.verificationRequest!
    }));
};

// Mock update functions
export const addUser = (userData: Omit<User, 'id' | 'status'>) => {
  const newUser = {
    ...userData,
    id: `user${users.length + 1}`,
    status: 'pending' as UserStatus
  };
  users.push(newUser);
  
  // Notify admin about new user registration
  addNotification({
    userId: 'admin',
    title: 'New User Registration',
    message: `${newUser.name} has registered as a ${newUser.role}. Please review their account.`,
    link: '/admin/users'
  });
  
  return newUser;
};

export const addTask = (task: Omit<Task, 'id' | 'comments' | 'verificationRequest' | 'createdAt'>) => {
  const newTask: Task = {
    ...task,
    id: `task${tasks.length + 1}`,
    comments: [],
    verificationRequest: null,
    createdAt: format(new Date(), 'yyyy-MM-dd')
  };
  tasks.push(newTask);
  
  if (newTask.assignedTo) {
    newTask.assignedTo.forEach(userId => {
      addNotification({
        userId,
        title: 'New Task Assigned',
        message: `You have been assigned to "${newTask.title}"`,
        link: `/tasks/${newTask.id}`
      });
    });
  }
  
  return newTask;
};

export const updateTaskStatus = (taskId: string, status: TaskStatus) => {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].status = status;
    return tasks[taskIndex];
  }
  return null;
};

export const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
  const newComment = {
    ...comment,
    id: `comment${Math.random().toString(36).slice(2, 9)}`,
    createdAt: format(new Date(), 'yyyy-MM-dd')
  };
  
  const taskIndex = tasks.findIndex(t => t.id === comment.taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].comments.push(newComment);
    return newComment;
  }
  return null;
};

export const requestVerification = (verificationData: Omit<VerificationRequest, 'id' | 'createdAt' | 'approved' | 'approvedAt' | 'approvalComment'>) => {
  const verificationRequest = {
    ...verificationData,
    id: `vr${Math.random().toString(36).slice(2, 9)}`,
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    approved: false
  };
  
  const taskIndex = tasks.findIndex(t => t.id === verificationData.taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex].verificationRequest = verificationRequest;
    tasks[taskIndex].status = 'completed';
    
    // Notify admin
    addNotification({
      userId: 'admin',
      title: 'Verification Requested',
      message: `A verification has been requested for "${tasks[taskIndex].title}"`,
      link: `/admin/verify/${tasks[taskIndex].id}`
    });
    
    return verificationRequest;
  }
  return null;
};


export const approveVerification = (taskId: string, approvalComment: string) => {
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1 && tasks[taskIndex].verificationRequest) {
    tasks[taskIndex].verificationRequest!.approved = true;
    tasks[taskIndex].verificationRequest!.approvedAt = format(new Date(), 'yyyy-MM-dd');
    tasks[taskIndex].verificationRequest!.approvalComment = approvalComment;
    tasks[taskIndex].status = 'verified';
    
    // Notify the user who requested verification
    const userId = tasks[taskIndex].verificationRequest!.userId;
    addNotification({
      userId,
      title: 'Task Verified',
      message: `Your task "${tasks[taskIndex].title}" has been verified`,
      link: `/tasks/${taskId}`
    });
    
    return tasks[taskIndex];
  }
  return null;
};

export const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
  const newNotification: Notification = {
    ...notificationData,
    id: `notif${Math.random().toString(36).slice(2, 9)}`,
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    isRead: false
  };
  notifications.push(newNotification);
  return newNotification;
};

export const markNotificationAsRead = (notificationId: string) => {
  const notifIndex = notifications.findIndex(n => n.id === notificationId);
  if (notifIndex !== -1) {
    notifications[notifIndex].isRead = true;
    return notifications[notifIndex];
  }
  return null;
};