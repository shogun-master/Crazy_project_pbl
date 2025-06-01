import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';
import RegisterForm from '../../components/Auth/RegisterForm';
import { useAuth } from '../../context/AuthContext';
import { ClipboardCheck } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, currentUser } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to={currentUser?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} />;
  }
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex flex-col justify-center items-center h-full text-white p-8">
          <ClipboardCheck className="h-24 w-24 mb-6" />
          <h1 className="text-4xl font-bold mb-3">TaskAssign</h1>
          <p className="text-xl mb-6 max-w-md text-center">Streamline your team's workflow with efficient task management and verification</p>
          <div className="grid grid-cols-2 gap-6 mt-10">
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Role-Based Assignment</h3>
              <p className="text-sm">Assign tasks to specific roles or team members</p>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Verification Workflow</h3>
              <p className="text-sm">Track task progress with built-in verification</p>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Task Comments</h3>
              <p className="text-sm">Communicate directly within each task</p>
            </div>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Real-time Updates</h3>
              <p className="text-sm">Stay informed with notifications</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center lg:hidden mb-8">
            <ClipboardCheck className="h-12 w-12 text-blue-600 mx-auto mb-2" />
            <h1 className="text-2xl font-bold text-gray-900 mb-1">TaskAssign</h1>
            <p className="text-gray-600">Streamline your team's workflow</p>
          </div>
          
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="font-medium text-blue-600 hover:text-blue-500"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
          
          <div className="mt-8">
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;