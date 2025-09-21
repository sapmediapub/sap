import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (role: UserRole) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto">
      <Card title="Select a Role to Login">
        <div className="p-6 text-center">
            <p className="text-gray-400 mb-6">For demonstration purposes, please select a user role to log in as.</p>
            <div className="space-y-4">
                <Button 
                    onClick={() => handleLogin(UserRole.ADMIN)} 
                    className="w-full"
                    variant="primary"
                >
                    Login as Admin
                </Button>
                <Button 
                    onClick={() => handleLogin(UserRole.ARTIST)} 
                    className="w-full"
                    variant="secondary"
                >
                    Login as Artist
                </Button>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;