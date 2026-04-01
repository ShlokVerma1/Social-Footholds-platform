'use client'

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { adminAPI } from '@/lib/api';
import { FaEnvelope, FaCalendar } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally { setLoading(false); }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div data-testid="admin-users-page">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">User Management</h1>
          <div className="text-gray-400">Total Users: <span className="text-white font-bold">{users.length}</span></div>
        </div>
        <div className="mb-6">
          <input type="text" placeholder="Search by name or email..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 bg-white/10 border border-purple-500/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-purple-500"
            data-testid="search-users-input" />
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-purple-600/20 border-b border-purple-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">User</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Registered</th>
                  <th className="px-6 py-4 text-left text-gray-300 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400">No users found</td></tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-purple-500/10 hover:bg-white/5 transition" data-testid={`user-row-${user.id}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-300">
                          <FaEnvelope className="text-gray-500" />{user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-300">
                          <FaCalendar className="text-gray-500" />{new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-500/20 border border-green-500 text-green-300 rounded-full text-sm">Active</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
