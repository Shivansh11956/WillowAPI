import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, Shield, Clock, Key } from 'lucide-react';
import { analytics } from '../lib/api';

export default function Analytics() {
  const [usage, setUsage] = useState({
    daily: [],
    models: {},
    actions: {}
  });
  const [loading, setLoading] = useState(true);
  const [selectedKeyId, setSelectedKeyId] = useState('all');

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const response = await analytics.getUsage();
        setUsage(response.data);
      } catch (error) {
        console.error('Failed to fetch usage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsage();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Usage Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold">Daily Requests</h2>
            </div>
            {usage.apiKeys && usage.apiKeys.length > 0 && (
              <select
                value={selectedKeyId}
                onChange={(e) => setSelectedKeyId(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All API Keys</option>
                {usage.apiKeys.map((key) => (
                  <option key={key.keyId} value={key.keyId}>
                    {key.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="space-y-2">
            {usage.daily.slice(-7).map((day, index) => {
              const dayRequests = selectedKeyId === 'all' 
                ? day.requests 
                : (day.byKey && day.byKey[selectedKeyId]) || 0;
              const maxRequests = selectedKeyId === 'all'
                ? Math.max(...usage.daily.map(d => d.requests))
                : Math.max(...usage.daily.map(d => (d.byKey && d.byKey[selectedKeyId]) || 0));
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600">{day.date}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${maxRequests > 0 ? (dayRequests / maxRequests) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="font-medium">{dayRequests}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Key className="h-6 w-6 text-indigo-500 mr-2" />
            <h2 className="text-xl font-semibold">API Key Usage</h2>
          </div>
          <div className="space-y-4">
            {usage.apiKeys && usage.apiKeys.length > 0 ? (
              usage.apiKeys.map((key) => (
                <div key={key.keyId} className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="text-gray-900 font-medium">{key.name}</span>
                    <p className="text-xs text-gray-500">{key.keyId}</p>
                  </div>
                  <span className="font-medium">{key.requestCount} requests</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No API keys found</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Activity className="h-6 w-6 text-green-500 mr-2" />
            <h2 className="text-xl font-semibold">Model Usage</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(usage.models).map(([model, count]) => (
              <div key={model} className="flex items-center justify-between">
                <span className="capitalize text-gray-600">{model}</span>
                <span className="font-medium">{count} requests</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-red-500 mr-2" />
            <h2 className="text-xl font-semibold">Moderation Actions</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(usage.actions).map(([action, count]) => (
              <div key={action} className="flex items-center justify-between">
                <span className="capitalize text-gray-600">{action}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <Clock className="h-6 w-6 text-purple-500 mr-2" />
            <h2 className="text-xl font-semibold">Performance</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Requests</span>
              <span className="font-medium">{usage.daily.reduce((sum, day) => sum + day.requests, 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Models Used</span>
              <span className="font-medium">{Object.keys(usage.models).length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Actions Taken</span>
              <span className="font-medium">{Object.values(usage.actions).reduce((a, b) => a + b, 0)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Usage Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {usage.daily.reduce((sum, day) => sum + day.requests, 0)}
            </div>
            <div className="text-gray-600">Total Requests</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {Object.values(usage.actions).reduce((a, b) => a + b, 0) > 0
                ? Math.round(((usage.actions.allowed || 0) / Object.values(usage.actions).reduce((a, b) => a + b, 0)) * 100)
                : 0}%
            </div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {usage.actions.blocked || 0}
            </div>
            <div className="text-gray-600">Blocked Messages</div>
          </div>
        </div>
      </div>
    </div>
  );
}