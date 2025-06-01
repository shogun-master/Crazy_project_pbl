import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { validateCredentials, addUser } from '../data/mockData';
import { toast } from 'react-toastify';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Failed to parse saved user', err);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = validateCredentials(email, password);
      
      if (!user) {
        throw new Error('Invalid credentials or account not approved');
      }
      
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast.success('Login successful!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newUser = addUser({
        name,
        email,
        password,
        role,
        avatar: `https://source.unsplash.com/100x100/?portrait,${Math.random()}`
      });
      
      toast.success('Registration successful! Please wait for admin approval.');
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        isLoading, 
        error, 
        login, 
        register, 
        logout,
        isAuthenticated: !!currentUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};