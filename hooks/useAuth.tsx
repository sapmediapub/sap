import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole, UserStatus } from '../types';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: 'user-123',
  name: 'Fela Kuti (Admin)',
  email: 'fela.kuti@example.com',
  role: UserRole.ADMIN,
  country: 'Nigeria',
  ipi_cae: '00123456789',
  pro: 'PRS for Music',
  status: UserStatus.ACTIVE,
  payoutDetails: {
    preferredMethod: 'Bank',
    bankName: 'First Bank of Nigeria',
    accountNumber: '1234567890',
    swiftCode: 'FBNINGLA',
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    // In a real app, you'd get user data from an API
    setUser(MOCK_USER);
  };

  const logout = () => {
    setUser(null);
  };
  
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};