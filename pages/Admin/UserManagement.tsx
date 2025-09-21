
import React, { useState, useMemo } from 'react';
import { User, UserRole, UserStatus } from '../../types';
import { MOCK_USERS } from '../../mockData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import EditUserModal from '../../components/Admin/EditUserModal';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import ViewPayoutsModal from '../../components/Admin/ViewPayoutsModal';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [filterRole, setFilterRole] = useState<UserRole | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingPayoutsUser, setViewingPayoutsUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesRole = filterRole === 'ALL' || user.role === filterRole;

      const lowercasedQuery = searchQuery.toLowerCase().trim();
      const matchesSearch = lowercasedQuery === '' ||
        user.name.toLowerCase().includes(lowercasedQuery) ||
        user.email.toLowerCase().includes(lowercasedQuery);
      
      return matchesRole && matchesSearch;
    });
  }, [users, filterRole, searchQuery]);

  // Pagination logic
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE }
        : user
    ));
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setEditingUser(null);
  };

  return (
    <>
      {editingUser && (
        <EditUserModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          onSave={handleSaveUser}
        />
      )}
      {viewingPayoutsUser && (
        <ViewPayoutsModal
            isOpen={!!viewingPayoutsUser}
            onClose={() => setViewingPayoutsUser(null)}
            user={viewingPayoutsUser}
        />
      )}
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <Input
                label="Search by Name or Email"
                id="user-search"
                placeholder="e.g., Burna Boy or tems@example.com"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
            <div>
              <Select
                label="Filter by Role"
                id="role-filter"
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value as UserRole | 'ALL');
                  setCurrentPage(1); // Reset to first page on filter change
                }}
              >
                <option value="ALL">All Roles</option>
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {paginatedUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === UserStatus.ACTIVE ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button variant="secondary" size="sm" onClick={() => setEditingUser(user)}>Edit</Button>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => setViewingPayoutsUser(user)}
                        disabled={!user.payoutDetails?.preferredMethod}
                        title={!user.payoutDetails?.preferredMethod ? 'User has not set up payout details' : 'View payout details'}
                      >
                        View Payouts
                      </Button>
                      <Button 
                        variant={user.status === UserStatus.ACTIVE ? 'danger' : 'primary'} 
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.status === UserStatus.ACTIVE ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Card>
      </div>
    </>
  );
};

export default UserManagement;
