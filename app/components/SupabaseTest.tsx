'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SupabaseTest() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [apiResult, setApiResult] = useState<any>(null);
  const [apiLoading, setApiLoading] = useState(true);

  useEffect(() => {
    const testSupabase = async () => {
      try {
        // Add a delay to ensure environment variables are loaded
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase.from('airports').select('count');
        
        setTestResult({ success: !error, data, error });
      } catch (e) {
        console.error('Test error:', e);
        setTestResult({ success: false, error: e });
      } finally {
        setLoading(false);
      }
    };

    const testServerApi = async () => {
      try {
        const response = await fetch('/api/test-db');
        const result = await response.json();
        setApiResult(result);
      } catch (e) {
        console.error('API test error:', e);
        setApiResult({ success: false, error: e });
      } finally {
        setApiLoading(false);
      }
    };

    testSupabase();
    testServerApi();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Supabase Connection Test</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Client-side Test</h3>
        {loading ? (
          <p>Testing connection...</p>
        ) : (
          <div>
            <p>Status: {testResult.success ? '✅ Connected' : '❌ Failed'}</p>
            {testResult.error && (
              <pre className="bg-red-50 p-3 rounded text-sm overflow-auto max-h-40 mt-2">
                {JSON.stringify(testResult.error, null, 2)}
              </pre>
            )}
            {testResult.data && (
              <pre className="bg-green-50 p-3 rounded text-sm overflow-auto max-h-40 mt-2">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Server-side Test</h3>
        {apiLoading ? (
          <p>Testing API connection...</p>
        ) : (
          <div>
            <p>Status: {apiResult.success ? '✅ Connected' : '❌ Failed'}</p>
            {apiResult.error && (
              <pre className="bg-red-50 p-3 rounded text-sm overflow-auto max-h-40 mt-2">
                {JSON.stringify(apiResult.error, null, 2)}
              </pre>
            )}
            {apiResult.data && (
              <pre className="bg-green-50 p-3 rounded text-sm overflow-auto max-h-40 mt-2">
                {JSON.stringify(apiResult.data, null, 2)}
              </pre>
            )}
            {apiResult.serverUrl && (
              <p className="mt-2">Server URL: {apiResult.serverUrl}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 