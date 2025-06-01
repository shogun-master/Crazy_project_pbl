import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTask } from '../../context/TaskContext';
import { getUserById } from '../../data/mockData';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { 
  CheckCircle, 
  X, 
  ArrowLeft,
  Calendar,
  CheckCircle2
} from 'lucide-react';

const TaskVerificationPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { getTaskDetails, verifyTask } = useTask();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(taskId ? getTaskDetails(taskId) : null);
  const [approvalComment, setApprovalComment] = useState('');
  
  useEffect(() => {
    if (taskId) {
      const taskDetails = getTaskDetails(taskId);
      if (!taskDetails || !taskDetails.verificationRequest) {
        navigate('/admin/verification');
        toast.error('Task not found or no verification request');
      }
      setTask(taskDetails);
    }
  }, [taskId, getTaskDetails, navigate]);
  
  if (!task || !task.verificationRequest) {
    return <div>Loading verification details...</div>;
  }
  
  const submittedBy = getUserById(task.verificationRequest.userId);
  
  const handleVerify = async () => {
    if (!taskId || !approvalComment.trim()) {
      toast.error('Please provide an approval comment');
      return;
    }
    
    try {
      await verifyTask(taskId, approvalComment);
      toast.success('Task has been verified successfully');
      navigate('/admin/verification');
    } catch (error) {
      toast.error('Failed to verify task');
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
      
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Verification Request</h1>
          <p className="text-gray-600 mt-1">
            Review the task completion and provide verification.
          </p>
        </div>
        
        <div className="p-6">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-2">{task.title}</h2>
            <p className="text-gray-700 mb-4">{task.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Due: {format(new Date(task.dueDate), 'MMMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  task.priority === 'urgent' ? 'bg-red-100 text-red-800' : 
                  task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                  task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </span>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-2">Verification Request Details</h3>
            
            <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mb-4">
              <div className="flex items-start">
                {submittedBy && (
                  <img
                    src={submittedBy.avatar || "https://source.unsplash.com/100x100/?portrait"}
                    alt={submittedBy.name}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {submittedBy?.name || 'User'} - <span className="text-gray-600 capitalize">{submittedBy?.role}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Submitted: {format(new Date(task.verificationRequest.createdAt), 'MMMM d, yyyy')}
                  </p>
                  <div className="mt-2 text-sm text-gray-700">
                    <p className="font-medium">Completion Comment:</p>
                    <p className="mt-1">{task.verificationRequest.comment}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="approvalComment" className="block text-sm font-medium text-gray-700 mb-1">
                  Approval Comment
                </label>
                <textarea
                  id="approvalComment"
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Provide feedback on the completed task..."
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={!approvalComment.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskVerificationPage;