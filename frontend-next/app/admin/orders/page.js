'use client'

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { orderAPI } from '@/lib/api';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally { setLoading(false); }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheckCircle className="text-green-400" />;
      case 'processing': return <FaClock className="text-yellow-400" />;
      case 'cancelled': return <FaTimesCircle className="text-red-400" />;
      default: return <FaClock className="text-gray-400" />;
    }
  };

  const filteredOrders = orders.filter(order => filter === 'all' || order.status === filter);

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div data-testid="admin-orders-page">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Order Management</h1>
          <div className="text-gray-400">Total Orders: <span className="text-white font-bold">{orders.length}</span></div>
        </div>
        <div className="flex gap-4 mb-6 flex-wrap">
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
            <button key={status} onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg transition capitalize ${filter === status ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
              data-testid={`filter-${status}-button`}>
              {status} ({orders.filter(o => status === 'all' || o.status === status).length})
            </button>
          ))}
        </div>
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-md p-12 rounded-2xl border border-purple-500/20 text-center text-gray-400">No orders found</div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-purple-500/20" data-testid={`order-${order.id}`}>
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{order.service_name}</h3>
                        <p className="text-gray-400 text-sm mb-2">Order #{order.id.substring(0, 8)} • User ID: {order.user_id.substring(0, 8)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-purple-400 mb-1">${order.amount.toFixed(2)}</p>
                        <span className={`px-3 py-1 rounded-full text-xs ${order.payment_status === 'paid' ? 'bg-green-500/20 border border-green-500 text-green-300' : 'bg-yellow-500/20 border border-yellow-500 text-yellow-300'}`}>
                          {order.payment_status}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {Object.entries(order.details).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-gray-500 text-sm capitalize">{key.replace(/_/g, ' ')}</p>
                          <p className="text-gray-300 text-sm break-all">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-400 text-sm">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div className="lg:border-l lg:border-purple-500/20 lg:pl-6">
                    <label className="block text-gray-300 mb-2 text-sm font-semibold">Update Status</label>
                    <select value={order.status} onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="bg-white/10 border border-purple-500/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-purple-500 mb-3"
                      data-testid={`status-select-${order.id}`}>
                      <option value="pending" className="bg-gray-900">Pending</option>
                      <option value="processing" className="bg-gray-900">Processing</option>
                      <option value="completed" className="bg-gray-900">Completed</option>
                      <option value="cancelled" className="bg-gray-900">Cancelled</option>
                    </select>
                    <div className="flex items-center gap-2 text-gray-300">
                      {getStatusIcon(order.status)}<span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
