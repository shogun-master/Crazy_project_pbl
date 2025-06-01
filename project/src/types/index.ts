export type UserRole = 'admin' | 'frontend' | 'backend' | 'designer' | 'testing';
export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'verified';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'half-yearly' | 'yearly';

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string[] | null;
  assignedToRole: UserRole | null;
  comments: Comment[];
  verificationRequest: VerificationRequest | null;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface VerificationRequest {
  id: string;
  taskId: string;
  userId: string;
  comment: string;
  createdAt: string;
  approved: boolean;
  approvedAt?: string;
  approvalComment?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface Report {
  period: ReportPeriod;
  startDate: Date;
  endDate: Date;
  tasks: Task[];
  totalTasks: number;
  completedTasks: number;
  verifiedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
}