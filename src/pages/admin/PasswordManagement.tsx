import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Key, User, Search, Check } from 'lucide-react';

const PasswordManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/users', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setUsers(data.users || []));
  }, []);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePasswordChange = async () => {
    if (!selectedUser) return;
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    const res = await fetch(`http://localhost:5000/api/users/${selectedUser._id}/password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password: newPassword }),
    });
    if (res.ok) {
      setSuccessMessage('Password changed successfully');
      setNewPassword('');
      setConfirmPassword('');
      setSelectedUser(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleOpenModal = (user: any) => {
    setSelectedUser(user);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Management</h1>
          <p className="text-gray-600">Reset and manage user passwords</p>
        </div>
        <div className="mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
            <Check size={20} className="mr-2" />
            {successMessage}
          </div>
        )}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span>
                              {user.name
                                ? user.name
                                    .split(' ')
                                    .map((n: string) => n[0])
                                    .join('')
                                    .toUpperCase()
                                : ''}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">{user.role}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="flex items-center text-blue-600 hover:text-blue-900"
                      >
                        <Key size={16} className="mr-2" />
                        Reset Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <User size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>

        {/* Password Change Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Reset Password for {selectedUser.name}</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PasswordManagement;