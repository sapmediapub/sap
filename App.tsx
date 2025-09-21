
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NewSong from './pages/NewSong';
import SyncCatalog from './pages/SyncCatalog';
import Payouts from './pages/Payouts';
import Earnings from './pages/Earnings';
import Footer from './components/Footer';
import UserManagement from './pages/Admin/UserManagement';
import SongApprovals from './pages/Admin/SongApprovals';
import ManageEarnings from './pages/Admin/ManageEarnings';
import SongDetails from './pages/SongDetails';
import { ContractProvider } from './contexts/ContractContext';
import ContractManagement from './pages/Admin/ContractManagement';
import { SongProvider } from './contexts/SongContext';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types';
import AccessDenied from './pages/AccessDenied';
import Profile from './pages/Profile';
import { PayoutProvider } from './contexts/PayoutContext';
import PayoutManager from './pages/Admin/PayoutRequests';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SongProvider>
        <ContractProvider>
          <PayoutProvider>
            <HashRouter>
              <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 font-sans">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<SyncCatalog />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/sync-catalog" element={<SyncCatalog />} />
                    <Route path="/access-denied" element={<AccessDenied />} />
                    
                    {/* Authenticated User Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/songs/new" element={<ProtectedRoute><NewSong /></ProtectedRoute>} />
                    <Route path="/songs/:songId" element={<ProtectedRoute><SongDetails /></ProtectedRoute>} />
                    <Route path="/earnings" element={<ProtectedRoute><Earnings /></ProtectedRoute>} />
                    <Route path="/payouts" element={<ProtectedRoute><Payouts /></ProtectedRoute>} />
                    
                    {/* Admin Only Routes */}
                    <Route path="/admin/users" element={<ProtectedRoute roles={[UserRole.ADMIN]}><UserManagement /></ProtectedRoute>} />
                    <Route path="/admin/songs/approvals" element={<ProtectedRoute roles={[UserRole.ADMIN]}><SongApprovals /></ProtectedRoute>} />
                    <Route path="/admin/earnings" element={<ProtectedRoute roles={[UserRole.ADMIN]}><ManageEarnings /></ProtectedRoute>} />
                    <Route path="/admin/payouts" element={<ProtectedRoute roles={[UserRole.ADMIN]}><PayoutManager /></ProtectedRoute>} />
                    <Route path="/admin/contract" element={<ProtectedRoute roles={[UserRole.ADMIN]}><ContractManagement /></ProtectedRoute>} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </HashRouter>
          </PayoutProvider>
        </ContractProvider>
      </SongProvider>
    </AuthProvider>
  );
};

export default App;