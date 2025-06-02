import React from 'react';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../../components/Tasks/TaskForm';
import { ArrowLeft } from 'lucide-react';

const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleTaskCreated = () => {
    navigate('/admin/tasks');
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
      </div>
      
      <TaskForm onSuccess={handleTaskCreated} />
    </div>
  );
};

export default CreateTaskPage;