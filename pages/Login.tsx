
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a mock login. In a real app, you would call your API.
    login({} as any); // Pass mock user data
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto">
      <Card title="Login to your Account">
        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            label="Email Address"
            id="email"
            type="email"
            required
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            id="password"
            type="password"
            required
            placeholder="••••••••"
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
