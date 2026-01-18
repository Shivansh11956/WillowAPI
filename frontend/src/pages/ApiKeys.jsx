import React, { useState, useEffect } from 'react';
import { Plus, Copy, Trash2, Key, Eye, EyeOff } from 'lucide-react';
import { apiKeys } from '../lib/api';

export default function ApiKeys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newlyCreatedKey, setNewlyCreatedKey] = useState(null);
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [visibleKeys, setVisibleKeys] = useState({});

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const response = await apiKeys.list();
      setKeys(response.data);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    try {
      const response = await apiKeys.create(newKeyName);
      setNewlyCreatedKey(response.data);
      setNewKeyName('');
      setShowCreateForm(false);
      fetchKeys();
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const handleDeleteKey = async (keyId) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      try {
        await apiKeys.delete(keyId);
        fetchKeys();
      } catch (error) {
        console.error('Failed to delete API key:', error);
      }
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = (text, keyId) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };



  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow h-20"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Key</span>
        </button>
      </div>

      {newlyCreatedKey && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-900 mb-2">✅ API Key Created!</h2>
          <p className="text-sm text-green-700 mb-4">Save this key now - you won't be able to see it again!</p>
          <div className="flex items-center space-x-2">
            <code className="flex-1 bg-white px-3 py-2 rounded text-sm border border-green-300">
              {newlyCreatedKey.key}
            </code>
            <button
              onClick={() => copyToClipboard(newlyCreatedKey.key, 'new')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-1"
            >
              <Copy className="h-4 w-4" />
              <span>{copiedKeyId === 'new' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          <button
            onClick={() => setNewlyCreatedKey(null)}
            className="mt-4 text-sm text-green-700 hover:text-green-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New API Key</h2>
          <form onSubmit={handleCreateKey} className="flex space-x-4">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key name (e.g., Production App)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {keys.map((key) => (
          <div key={key.keyId} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{key.name}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {visibleKeys[key.keyId] && key.fullKey ? key.fullKey : `mk_${'*'.repeat(32)}`}
                  </code>
                  <button
                    onClick={() => toggleKeyVisibility(key.keyId)}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title={visibleKeys[key.keyId] ? 'Hide' : 'Show'}
                  >
                    {visibleKeys[key.keyId] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(key.fullKey || key.keyId, key.keyId)}
                    className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1 rounded hover:bg-gray-100"
                  >
                    {copiedKeyId === key.keyId ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                {!key.fullKey && (
                  <p className="text-xs text-gray-500 mt-1">⚠️ Full API key was shown only once at creation</p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Requests: {key.requestCount}</span>
                  <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                  {key.lastUsed && (
                    <span>Last used: {new Date(key.lastUsed).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteKey(key.keyId)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}

        {keys.length === 0 && (
          <div className="text-center py-12">
            <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys yet</h3>
            <p className="text-gray-500 mb-4">Create your first API key to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create API Key
            </button>
          </div>
        )}
      </div>
    </div>
  );
}