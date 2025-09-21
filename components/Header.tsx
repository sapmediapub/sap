
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';
import { UserRole } from '../types';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const linkStyle = "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeLinkStyle = "bg-gray-900 text-white";

  return (
    <header className="bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-400">
              Sap Media
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink to="/sync-catalog" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Sync Catalog</NavLink>
                {user && (
                  <>
                    <NavLink to="/dashboard" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Dashboard</NavLink>
                    <NavLink to="/profile" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Profile</NavLink>
                    
                    {/* These links are for non-admin users only */}
                    {user.role !== UserRole.ADMIN && (
                      <>
                        <NavLink to="/songs/new" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Register Song</NavLink>
                        <NavLink to="/earnings" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Earnings</NavLink>
                        <NavLink to="/payouts" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Payouts</NavLink>
                      </>
                    )}
                  </>
                )}
                {user && user.role === UserRole.ADMIN && (
                  <>
                    <span className="text-gray-600 font-light">|</span>
                    <NavLink to="/admin/users" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Users</NavLink>
                    <NavLink to="/admin/songs/approvals" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Approvals</NavLink>
                    <NavLink to="/admin/earnings" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Earnings</NavLink>
                    <NavLink to="/admin/payouts" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Payout Manager</NavLink>
                    <NavLink to="/admin/contract" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>Contract</NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Welcome, {user.name}</span>
                <Button onClick={logout} variant="secondary" size="sm">Logout</Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
