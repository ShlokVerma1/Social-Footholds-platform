'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CreatorLayout from '@/components/CreatorLayout';
import { orderAPI } from '@/lib/api';
import { FaCheckCircle, FaClock, FaTimesCircle, FaArrowRight } from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="px-3 py-1 bg-green-500/20 border border-green-500 text-green-300 rounded-full text-sm">Paid</span>;
      case 'failed':
        return <span className="px-3 py-1 bg-red-500/20 border border-red-500 text-red-300 rounded-full text-sm">Failed</span>;
      default:
        return <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500 text-yellow-300 rounded-full text-sm">Pending</span>;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <CreatorLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </CreatorLayout>
    );
  }

  return (
    <CreatorLayout>
      <div data-testid="orders-page">
        <h1 className="text-4xl font-bold text-white mb-8">My Orders</h1>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg transition capitalize ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
              data-testid={`filter-${status}-button`}
            >
              {status} ({orders.filter(o => status === 'all' || o.status === status).length})
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md p-12 rounded-2xl border border-purple-500/20 text-center">
            <p className="text-gray-400 mb-4">No orders found</p>
            <Link href="/dashboard" className="text-purple-400 hover:text-purple-300 inline-flex items-center">
              Browse Services <FaArrowRight className="ml-2" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/50 transition" data-testid={`order-${order.id}`}>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{order.service_name}</h3>
                        <p className="text-gray-400 text-sm">Order #{order.id.substring(0, 8)}</p>
                      </div>
                      {getPaymentStatusBadge(order.payment_status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {Object.entries(order.details).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-gray-500 text-sm capitalize">{key.replace(/_/g, ' ')}</p>
                          <p className="text-gray-300">{typeof value === 'object' ? JSON.stringify(value) : value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <span className={`font-semibold capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-gray-500 text-sm">•</span>
                      <span className="text-gray-400 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-purple-400 mb-2">${order.amount.toFixed(2)}</p>
                    {order.payment_status === 'pending' && (
                      <Link
                        href={`/payment/${order.id}`}
                        className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition"
                        data-testid={`pay-order-${order.id}-button`}
                      >
                        Complete Payment
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CreatorLayout>
  );
};

export default Orders;
