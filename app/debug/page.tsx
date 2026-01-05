'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function DebugPage() {
  const [results, setResults] = useState<any[]>([]);
  const [testing, setTesting] = useState(false);

  const testEndpoints = async () => {
    setTesting(true);
    setResults([]);
    
    const endpoints = [
      { name: 'Root', url: 'https://kashi-learning-server.onrender.com/', method: 'GET' },
      { name: 'Health', url: 'https://kashi-learning-server.onrender.com/health', method: 'GET' },
      { name: 'Test', url: 'https://kashi-learning-server.onrender.com/api/v1/test', method: 'GET' },
      { name: 'Me', url: 'https://kashi-learning-server.onrender.com/api/v1/me', method: 'GET' },
      { name: 'Update Avatar', url: 'https://kashi-learning-server.onrender.com/api/v1/update-user-avatar', method: 'PUT' },
    ];

    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await fetch(endpoint.url, {
          method: endpoint.method,
          credentials: 'include',
          headers: endpoint.method === 'PUT' ? { 'Content-Type': 'application/json' } : {},
          body: endpoint.method === 'PUT' ? JSON.stringify({ avatar: 'test' }) : undefined,
        });
        const endTime = Date.now();
        
        let data;
        try {
          data = await response.text();
          try {
            data = JSON.parse(data);
          } catch {
            // keep as text
          }
        } catch {
          data = 'No response body';
        }
        
        setResults(prev => [...prev, {
          name: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          status: response.status,
          statusText: response.statusText,
          time: endTime - startTime,
          headers: Object.fromEntries([...response.headers.entries()]),
          data,
          ok: response.ok,
        }]);
        
      } catch (error: any) {
        setResults(prev => [...prev, {
          name: endpoint.name,
          url: endpoint.url,
          method: endpoint.method,
          error: error.message,
          ok: false,
        }]);
      }
    }
    
    setTesting(false);
    toast.success('Testing complete!');
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Endpoint Debugger</h1>
        
        <div className="mb-8 space-x-4">
          <button
            onClick={testEndpoints}
            disabled={testing}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Test All Endpoints'}
          </button>
          
          <button
            onClick={clearResults}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Clear Results
          </button>
        </div>
        
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.ok
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">
                      {result.name} ({result.method})
                    </h3>
                    <p className="text-sm text-gray-600">{result.url}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.ok
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {result.status || 'Error'} {result.statusText || ''}
                    {result.time && ` (${result.time}ms)`}
                  </span>
                </div>
                
                {result.error ? (
                  <pre className="text-red-600 text-sm bg-red-100 p-2 rounded mt-2">
                    Error: {result.error}
                  </pre>
                ) : (
                  <>
                    {result.headers && (
                      <div className="mt-2">
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Headers:</h4>
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(result.headers, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {result.data && (
                      <div className="mt-2">
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Response:</h4>
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                          {typeof result.data === 'string'
                            ? result.data
                            : JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Common Issues:</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="text-red-500 mr-2">✗</span>
              <span><strong>404</strong> - Endpoint doesn't exist on server</span>
            </li>
            <li className="flex items-center">
              <span className="text-red-500 mr-2">✗</span>
              <span><strong>CORS Error</strong> - Check server CORS configuration</span>
            </li>
            <li className="flex items-center">
              <span className="text-red-500 mr-2">✗</span>
              <span><strong>Network Error</strong> - Server might be down or URL incorrect</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              <span><strong>200 OK</strong> - Endpoint is working correctly</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}