import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const AccessDenied: React.FC = () => {
  return (
    <div className="max-w-lg mx-auto text-center">
      <Card>
        <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-6">
          You do not have the necessary permissions to view this page.
        </p>
        <Link to="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </Card>
    </div>
  );
};

export default AccessDenied;