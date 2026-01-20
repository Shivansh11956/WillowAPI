import React from 'react';
import { Code, ExternalLink } from 'lucide-react';

export default function Docs() {
  const codeExample = `curl -X POST https://willowapi.onrender.com/api/v1/moderate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Your message to moderate",
    "userId": "user123",
    "conversationId": "conv456"
  }'`;

  const responseExample = `{
  "blocked": false,
  "original": "Hello world",
  "moderated": "Hello world",
  "rewritten": false,
  "model": "gemini"
}`;

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">API Documentation</h1>

      <div className="space-y-8">
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-600 mb-4">
            The Content Moderation API provides AI-powered content filtering with multi-provider fallback.
            All requests require authentication via API key.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">
              <strong>Base URL:</strong> https://willowapi.onrender.com
            </p>
            <p className="text-blue-800 mt-2">
              <strong>Production URL:</strong> https://willowapi.onrender.com
            </p>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
          <p className="text-gray-600 mb-4">
            Include your API key in the Authorization header:
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <code className="text-sm">Authorization: Bearer YOUR_API_KEY</code>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Moderate Content</h2>
          <div className="mb-4">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">POST</span>
            <code className="ml-2 text-gray-600">/api/v1/moderate</code>
          </div>
          
          <h3 className="text-lg font-medium mb-2">Request Example</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
            <pre className="text-sm">{codeExample}</pre>
          </div>

          <h3 className="text-lg font-medium mb-2">Response Example</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 overflow-x-auto">
            <pre className="text-sm">{responseExample}</pre>
          </div>

          <h3 className="text-lg font-medium mb-2">Parameters</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Parameter</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Required</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-900">text</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-red-600">Yes</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Content to moderate</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-900">userId</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">No</td>
                  <td className="px-4 py-2 text-sm text-gray-600">User identifier for logging</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-900">conversationId</td>
                  <td className="px-4 py-2 text-sm text-gray-600">string</td>
                  <td className="px-4 py-2 text-sm text-gray-600">No</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Conversation identifier for logging</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Response Types</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-green-600 mb-2">✅ Safe Content (blocked: false, rewritten: false)</h3>
              <p className="text-gray-600 mb-2">Content passes all moderation checks and is returned unchanged.</p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
                <pre>{`{
  "blocked": false,
  "original": "Hello world",
  "moderated": "Hello world",
  "rewritten": false,
  "model": "gemini"
}`}</pre>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-yellow-600 mb-2">⚠️ Rewritten Content (blocked: false, rewritten: true)</h3>
              <p className="text-gray-600 mb-2">Content is modified to remove inappropriate elements while preserving intent.</p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
                <pre>{`{
  "blocked": false,
  "original": "you are stupid",
  "moderated": "I disagree with you",
  "rewritten": true,
  "model": "gemini"
}`}</pre>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-red-600 mb-2">🚫 Blocked Content (blocked: true)</h3>
              <p className="text-gray-600 mb-2">Content violates guidelines and cannot be safely rewritten.</p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs">
                <pre>{`{
  "blocked": true,
  "reason": "Content violates community guidelines",
  "original": "violent threat message",
  "model": "gemini"
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">AI Models</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900">Gemini (Primary)</h3>
              <p className="text-sm text-gray-600">Advanced AI content analysis with smart rewriting capabilities</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium text-gray-900">Groq (Fallback)</h3>
              <p className="text-sm text-gray-600">Secondary moderation when Gemini is unavailable</p>
            </div>
            <div className="border-l-4 border-gray-500 pl-4">
              <h3 className="font-medium text-gray-900">Rule-based Filter (Final Fallback)</h3>
              <p className="text-sm text-gray-600">Keyword matching for guaranteed availability</p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Rate Limits</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Limit Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Value</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-900">Requests per minute</td>
                  <td className="px-4 py-2 text-sm text-gray-600">60</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Per API key</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-900">Requests per hour</td>
                  <td className="px-4 py-2 text-sm text-gray-600">1,000</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Per API key</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-900">Requests per day</td>
                  <td className="px-4 py-2 text-sm text-gray-600">10,000</td>
                  <td className="px-4 py-2 text-sm text-gray-600">Per API key</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-4">💡 Rate limit headers are included in all responses</p>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Error Codes</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">400</code>
              <div>
                <p className="font-medium text-gray-900">Bad Request</p>
                <p className="text-sm text-gray-600">Invalid input or missing required fields</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">401</code>
              <div>
                <p className="font-medium text-gray-900">Unauthorized</p>
                <p className="text-sm text-gray-600">Invalid or missing API key</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">429</code>
              <div>
                <p className="font-medium text-gray-900">Too Many Requests</p>
                <p className="text-sm text-gray-600">Rate limit exceeded</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">500</code>
              <div>
                <p className="font-medium text-gray-900">Internal Server Error</p>
                <p className="text-sm text-gray-600">Server-side error occurred</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">SDKs & Code Examples</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">JavaScript/Node.js</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs">
                <pre>{`const axios = require('axios');

const response = await axios.post(
  'https://willowapi.onrender.com/api/v1/moderate',
  { text: 'Your message here' },
  { headers: { Authorization: 'Bearer YOUR_API_KEY' } }
);

console.log(response.data);`}</pre>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Python</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs">
                <pre>{`import requests

response = requests.post(
    'https://willowapi.onrender.com/api/v1/moderate',
    json={'text': 'Your message here'},
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)

print(response.json())`}</pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}