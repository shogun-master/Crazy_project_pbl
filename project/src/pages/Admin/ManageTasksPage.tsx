import React from 'react';
import { useTask } from '../../context/TaskContext';
import TaskList from '../../components/Tasks/TaskList';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';

const ManageTasksPage: React.FC = () => {
  const { tasks, loading } = useTask();
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading tasks...</div>;
  }
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Tasks</h1>
        <Link
          to="/admin/tasks/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Task
        </Link>
      </div>
      
      <TaskList tasks={tasks} title="All Tasks" />
    </div>
  );
};

export default ManageTasksPage;