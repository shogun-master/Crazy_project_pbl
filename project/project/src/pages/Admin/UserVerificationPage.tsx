import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, approveUser, rejectUser } from '../../data/mockData';
import { toast } from 'react-toastify';
import { CheckCircle2, X, UserX, ArrowLeft } from 'lucide-react';

const UserVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const pendingUsers = getUsers().filter(user => user.status === 'pending');

  const handleApprove = (userId: string) => {
    try {
      approveUser(userId);
      toast.success('User approved successfully');
    } catch (error) {
      toast.error('Failed to approve user');
    }
  };

  const handleReject = (userId: string) => {
    try {
      rejectUser(userId);
      toast.success('User rejected');
    } catch (error) {
      toast.error('Failed to reject user');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Pending User Verifications
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Review and approve new user registrations
          </p>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="p-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No pending verifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              All user registrations have been processed
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {pendingUsers.map(user => (
              <li key={user.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.avatar || "https://source.unsplash.com/100x100/?portrait"}
                      alt={user.name}
                    />
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize mt-1">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReject(user.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Approve
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserVerificationPage;