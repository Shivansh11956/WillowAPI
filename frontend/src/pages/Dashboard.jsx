import React, { useState, useEffect } from 'react';
import { Activity, Key, TrendingUp, Shield } from 'lucide-react';
import { analytics } from '../lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    activeKeys: 0,
    successRate: 0,
    blockedContent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await analytics.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Requests',
      value: stats.totalRequests.toLocaleString(),
      icon: Activity,
      color: 'bg-blue-500'
    },
    {
      title: 'Active API Keys',
      value: stats.activeKeys,
      icon: Key,
      color: 'bg-green-500'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Blocked Content',
      value: stats.blockedContent.toLocaleString(),
      icon: Shield,
      color: 'bg-red-500'
    }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-600">Total API requests</span>
            <span className="font-medium">{stats.totalRequests.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-gray-600">Content blocked</span>
            <span className="font-medium">{stats.blockedContent.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600">Active API keys</span>
            <span className="font-medium">{stats.activeKeys}</span>
          </div>
        </div>
      </div>
    </div>
  );
}