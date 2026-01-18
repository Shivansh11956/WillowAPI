import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function Test() {
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [latency, setLatency] = useState(null);

  const handleTest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setLatency(null);

    const startTime = Date.now();
    try {
      const response = await axios.post('/api/v1/moderate', 
        { text: message },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );
      const endTime = Date.now();
      setLatency(endTime - startTime);
      setResult(response.data);
    } catch (err) {
      const endTime = Date.now();
      setLatency(endTime - startTime);
      setError(err.response?.data?.error || err.response?.data?.reason || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Test API</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <form onSubmit={handleTest} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="mk_..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message to Moderate</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message to test moderation..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Testing...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Test Moderation</span>
              </>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className={`border rounded-lg p-4 ${
            result.blocked ? 'bg-red-50 border-red-200' : 
            result.rewritten ? 'bg-yellow-50 border-yellow-200' : 
            'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className={`h-5 w-5 ${
                  result.blocked ? 'text-red-600' : 
                  result.rewritten ? 'text-yellow-600' : 
                  'text-green-600'
                }`} />
                <h3 className="text-lg font-semibold text-gray-900">
                  {result.blocked ? 'Content Blocked' : result.rewritten ? 'Content Rewritten' : 'Content Allowed'}
                </h3>
              </div>
              {latency && (
                <span className="text-sm text-gray-600">
                  {latency}ms
                </span>
              )}
            </div>
          </div>

          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">JSON Response</h3>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                  alert('JSON copied!');
                }}
                className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800"
              >
                Copy JSON
              </button>
            </div>
            <pre className="text-xs overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      )}

      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Examples</h2>
        <div className="space-y-2 text-sm">
          <button
            onClick={() => setMessage('Hello world')}
            className="block w-full text-left px-3 py-2 bg-white rounded hover:bg-gray-100"
          >
            Safe: "Hello world"
          </button>
          <button
            onClick={() => setMessage('you are stupid')}
            className="block w-full text-left px-3 py-2 bg-white rounded hover:bg-gray-100"
          >
            Rewrite: "you are stupid"
          </button>
          <button
            onClick={() => setMessage('I will kill you')}
            className="block w-full text-left px-3 py-2 bg-white rounded hover:bg-gray-100"
          >
            Block: "I will kill you"
          </button>
        </div>
      </div>
    </div>
  );
}