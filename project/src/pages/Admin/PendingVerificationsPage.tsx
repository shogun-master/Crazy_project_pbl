import React from 'react';
import { useTask } from '../../context/TaskContext';
import { Link } from 'react-router-dom';
import { getUserById } from '../../data/mockData';
import { format } from 'date-fns';
import { Clock, Check, X, AlertTriangle } from 'lucide-react';

const PendingVerificationsPage: React.FC = () => {
  const { getPendingVerifications, loading } = useTask();
  const pendingVerifications = getPendingVerifications();
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading verifications...</div>;
  }
  
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Verifications</h1>
        <p className="text-gray-600 mt-1">
          Review and verify completed tasks
        </p>
      </header>
      
      {pendingVerifications.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <Check className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">All caught up!</h3>
          <p className="text-gray-600">There are no pending verification requests.</p>
          <Link
            to="/admin/tasks"
            className="inline-flex items-center px-4 py-2 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            View All Tasks
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Verification Requests ({pendingVerifications.length})
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Tasks awaiting your verification
            </p>
          </div>
          
          <ul className="divide-y divide-gray-200">
            {pendingVerifications.map((task) => {
              const user = getUserById(task.verificationRequest?.userId || '');
              return (
                <li key={task.id}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user?.avatar || "https://source.unsplash.com/100x100/?portrait"}
                            alt={user?.name || "User"}
                          />
                        </div>
                        <div className="ml-4">
                          <Link
                            to={`/admin/verify/${task.id}`}
                            className="text-base font-medium text-blue-600 hover:text-blue-800"
                          >
                            {task.title}
                          </Link>
                          <div className="flex items-center mt-1">
                            <p className="text-sm text-gray-500 capitalize">
                              Submitted by <span className="font-medium">{user?.name}</span> ({user?.role})
                            </p>
                            <span className="mx-2 text-gray-300">•</span>
                            <p className="text-sm text-gray-500">
                              {format(new Date(task.verificationRequest?.createdAt || ''), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.priority === 'urgent' ? 'bg-red-100 text-red-800' : 
                          task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.priority === 'urgent' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        <Link
                          to={`/admin/verify/${task.id}`}
                          className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Review
                        </Link>
                      </div>
                    </div>
                    {task.verificationRequest?.comment && (
                      <div className="mt-2 ml-14">
                        <p className="text-sm text-gray-600 line-clamp-1">
                          <span className="font-medium">Comment:</span> {task.verificationRequest.comment}
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PendingVerificationsPage;