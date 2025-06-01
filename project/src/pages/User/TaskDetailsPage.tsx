import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { getUserById } from '../../data/mockData';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-toastify';

const TaskDetailsPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { getTaskDetails, addTaskComment, updateStatus, submitForVerification } = useTask();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(taskId ? getTaskDetails(taskId) : null);
  const [comment, setComment] = useState('');
  const [verificationComment, setVerificationComment] = useState('');
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  
  useEffect(() => {
    if (taskId) {
      const taskDetails = getTaskDetails(taskId);
      if (!taskDetails) {
        navigate('/tasks');
        toast.error('Task not found');
      }
      setTask(taskDetails);
    }
  }, [taskId, getTaskDetails, navigate]);
  
  if (!task) {
    return <div>Loading task details...</div>;
  }
  
  const handleStatusChange = async (newStatus: string) => {
    if (!taskId) return;
    
    try {
      await updateStatus(taskId, newStatus as any);
      setTask(getTaskDetails(taskId));
      toast.success('Task status updated');
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };
  
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId || !comment.trim()) return;
    
    try {
      await addTaskComment(taskId, comment);
      setComment('');
      setTask(getTaskDetails(taskId));
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };
  
  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskId || !verificationComment.trim()) return;
    
    try {
      await submitForVerification(taskId, verificationComment);
      setVerificationComment('');
      setShowVerificationForm(false);
      setTask(getTaskDetails(taskId));
      toast.success('Task submitted for verification');
    } catch (error) {
      toast.error('Failed to submit for verification');
    }
  };
  
  const getStatusClass = (status: string) => {
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
  
  const getPriorityClass = (priority: string) => {
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
        {/* Task header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
              <div className="mt-1 flex flex-wrap gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(task.status)}`}>
                  {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityClass(task.priority)}`}>
                  {task.priority === 'urgent' && <AlertTriangle className="inline h-3 w-3 mr-1" />}
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </span>
              </div>
            </div>
            
            {/* Status change buttons (if not verified) */}
            {task.status !== 'verified' && task.verificationRequest?.approved !== true && (
              <div className="flex gap-2">
                {task.status !== 'in-progress' && (
                  <button
                    onClick={() => handleStatusChange('in-progress')}
                    className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Start Working
                  </button>
                )}
                
                {(task.status === 'in-progress' || task.status === 'pending') && (
                  <button
                    onClick={() => setShowVerificationForm(true)}
                    className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    Complete & Verify
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Task details */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
            
            {/* Verification section */}
            {task.verificationRequest && (
              <div className={`mt-6 p-4 rounded-md ${
                task.verificationRequest.approved 
                  ? 'bg-green-50 border border-green-100' 
                  : 'bg-yellow-50 border border-yellow-100'
              }`}>
                <h3 className={`text-base font-medium ${
                  task.verificationRequest.approved ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {task.verificationRequest.approved ? (
                    <span className="flex items-center">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Verification Approved
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Pending Verification
                    </span>
                  )}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-700">
                    <strong>Completion Comment:</strong> {task.verificationRequest.comment}
                  </p>
                  {task.verificationRequest.approved && (
                    <p className="text-sm text-gray-700 mt-2">
                      <strong>Approval Comment:</strong> {task.verificationRequest.approvalComment}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Submitted: {format(new Date(task.verificationRequest.createdAt), 'MMM d, yyyy')}
                    {task.verificationRequest.approvedAt && (
                      <span> • Approved: {format(new Date(task.verificationRequest.approvedAt), 'MMM d, yyyy')}</span>
                    )}
                  </p>
                </div>
              </div>
            )}
            
            {/* Verification form */}
            {showVerificationForm && !task.verificationRequest && (
              <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
                <h3 className="text-base font-medium text-blue-800">Submit for Verification</h3>
                <p className="text-sm text-blue-600 mt-1">
                  Add a comment describing what you've completed before submitting for verification.
                </p>
                <form onSubmit={handleVerificationSubmit} className="mt-3">
                  <textarea
                    value={verificationComment}
                    onChange={(e) => setVerificationComment(e.target.value)}
                    placeholder="Describe the work you've completed..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows={3}
                    required
                  />
                  <div className="mt-3 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowVerificationForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Submit for Verification
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          
          <div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-base font-medium text-gray-900 mb-3">Task Details</h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Created On</p>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {format(new Date(task.createdAt), 'MMMM d, yyyy')}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Due Date</p>
                  <p className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {format(new Date(task.dueDate), 'MMMM d, yyyy')}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Assigned To</p>
                  {task.assignedTo && task.assignedTo.length > 0 ? (
                    <div className="mt-1 flex flex-col space-y-2">
                      {task.assignedTo.map(userId => {
                        const user = getUserById(userId);
                        return user ? (
                          <div key={user.id} className="flex items-center">
                            <img 
                              src={user.avatar || "https://source.unsplash.com/100x100/?portrait"} 
                              alt={user.name} 
                              className="h-6 w-6 rounded-full mr-2"
                            />
                            <span className="text-sm">{user.name}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-900 capitalize">
                      {task.assignedToRole} Team
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Comments section */}
        <div className="px-6 py-4 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-gray-400" />
            Comments ({task.comments.length})
          </h2>
          
          <div className="space-y-4 mb-6">
            {task.comments.length === 0 ? (
              <p className="text-gray-500 text-sm">No comments yet.</p>
            ) : (
              task.comments.map((comment) => {
                const user = getUserById(comment.userId);
                return (
                  <div key={comment.id} className="flex space-x-3">
                    <img 
                      src={user?.avatar || "https://source.unsplash.com/100x100/?portrait"} 
                      alt={user?.name || "User"} 
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-gray-900">{user?.name || "User"}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {/* Add comment form */}
          <form onSubmit={handleCommentSubmit} className="flex items-start space-x-3">
            <img 
              src={currentUser?.avatar || "https://source.unsplash.com/100x100/?portrait"} 
              alt={currentUser?.name || "User"} 
              className="h-8 w-8 rounded-full"
            />
            <div className="flex-1 relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                rows={2}
              />
              <button
                type="submit"
                disabled={!comment.trim()}
                className="absolute right-2 bottom-2 p-1 text-blue-600 hover:text-blue-800 disabled:text-gray-400"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;