import React from 'react';
import { useTask } from '../../context/TaskContext';
import { getUsers } from '../../data/mockData';
import { Link } from 'react-router-dom';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Layers, 
  PieChart,
  BarChart,
  TrendingUp
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { tasks, getPendingVerifications } = useTask();
  const allUsers = getUsers().filter(user => user.role !== 'admin');
  const pendingVerifications = getPendingVerifications();
  
  // Task statistics
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed' && !task.verificationRequest);
  const verifiedTasks = tasks.filter(task => task.status === 'verified');
  
  // Get tasks by role
  const tasksByRole = {
    frontend: tasks.filter(task => task.assignedToRole === 'frontend').length,
    backend: tasks.filter(task => task.assignedToRole === 'backend').length,
    designer: tasks.filter(task => task.assignedToRole === 'designer').length,
    testing: tasks.filter(task => task.assignedToRole === 'testing').length,
  };
  
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Monitor task statuses, user performance, and manage verifications
        </p>
      </header>
      
      {/* Quick action buttons */}
      <div className="flex flex-wrap gap-2">
        <Link
          to="/admin/tasks/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
        >
          Create New Task
        </Link>
        <Link
          to="/admin/verification"
          className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-md hover:bg-yellow-700"
        >
          Verification Requests ({pendingVerifications.length})
        </Link>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Layers className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
              <p className="text-2xl font-semibold text-gray-900">{tasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Team Members</h3>
              <p className="text-2xl font-semibold text-gray-900">{allUsers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Verification</h3>
              <p className="text-2xl font-semibold text-gray-900">{pendingVerifications.length}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{verifiedTasks.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task status chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <PieChart className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Task Status Overview</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
              <div className="text-center mb-2">
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{pendingTasks.length}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-600 h-2 rounded-full" 
                  style={{ width: `${pendingTasks.length / tasks.length * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
              <div className="text-center mb-2">
                <p className="text-xs text-gray-500">In Progress</p>
                <p className="text-2xl font-semibold text-blue-900">{inProgressTasks.length}</p>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${inProgressTasks.length / tasks.length * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-center mb-2">
                <p className="text-xs text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-yellow-900">
                  {completedTasks.length + pendingVerifications.length}
                </p>
              </div>
              <div className="w-full bg-yellow-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: `${(completedTasks.length + pendingVerifications.length) / tasks.length * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
              <div className="text-center mb-2">
                <p className="text-xs text-gray-500">Verified</p>
                <p className="text-2xl font-semibold text-green-900">{verifiedTasks.length}</p>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${verifiedTasks.length / tasks.length * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tasks by role */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <BarChart className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Tasks by Role</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Frontend</span>
                <span className="text-sm font-medium text-gray-700">{tasksByRole.frontend}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${tasksByRole.frontend / tasks.length * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Backend</span>
                <span className="text-sm font-medium text-gray-700">{tasksByRole.backend}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${tasksByRole.backend / tasks.length * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Design</span>
                <span className="text-sm font-medium text-gray-700">{tasksByRole.designer}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-pink-600 h-2 rounded-full" 
                  style={{ width: `${tasksByRole.designer / tasks.length * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Testing</span>
                <span className="text-sm font-medium text-gray-700">{tasksByRole.testing}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${tasksByRole.testing / tasks.length * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent verification requests */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Verification Requests</h2>
          
          {pendingVerifications.length === 0 ? (
            <p className="text-gray-500">No pending verification requests.</p>
          ) : (
            <div className="space-y-3">
              {pendingVerifications.slice(0, 5).map((task) => {
                const user = getUsers().find(u => u.id === task.verificationRequest?.userId);
                return (
                  <Link
                    key={task.id}
                    to={`/admin/verify/${task.id}`}
                    className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user?.avatar || "https://source.unsplash.com/100x100/?portrait"}
                        alt={user?.name || "User"}
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">
                        Submitted by {user?.name} on {task.verificationRequest?.createdAt}
                      </p>
                    </div>
                    <div className="ml-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </span>
                    </div>
                  </Link>
                );
              })}
              
              {pendingVerifications.length > 5 && (
                <div className="text-center mt-2">
                  <Link
                    to="/admin/verification"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View all requests
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Team members */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h2>
          
          <div className="space-y-3">
            {allUsers.map((user) => (
              <div key={user.id} className="flex items-center p-3 border border-gray-200 rounded-md">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.avatar || "https://source.unsplash.com/100x100/?portrait"}
                    alt={user.name}
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="ml-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;