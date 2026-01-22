'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function runTests() {
      const logs: string[] = [];
      
      logs.push('🧪 [BUDDY-TEST] Starting Supabase Tests...');
      logs.push('');

      // Test 1: Basic Connection
      try {
        const { error } = await supabase.from('profiles').select('*').limit(0);
        if (error) throw error;
        logs.push('✅ PASS: Basic Connection - Connected to Supabase!');
      } catch (error) {
        logs.push(`❌ FAIL: Basic Connection - ${(error as Error).message}`);
      }

      // Test 2: Check Tables
      const tables = ['profiles', 'learning_progress', 'chat_sessions', 'chat_messages'];
      
      for (const table of tables) {
        try {
          const { error } = await supabase.from(table).select('*').limit(0);
          if (error) throw error;
          logs.push(`✅ PASS: Table "${table}" exists`);
        } catch (error) {
          logs.push(`❌ FAIL: Table "${table}" - ${(error as Error).message}`);
        }
      }

      // Test 3: Auth Service
      try {
        const { data } = await supabase.auth.getSession();
        logs.push(`✅ PASS: Auth Service - ${data.session ? 'User logged in' : 'No session (OK)'}`);
      } catch (error) {
        logs.push(`❌ FAIL: Auth Service - ${(error as Error).message}`);
      }

      logs.push('');
      logs.push('📊 Tests completed!');
      setResults(logs);
      setLoading(false);
    }

    runTests();
  }, []);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 Supabase Connection Test</h1>
      
      {loading ? (
        <div className="text-lg">⏳ Running tests...</div>
      ) : (
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
          {results.map((line, i) => (
            <div key={i} className={line.includes('❌') ? 'text-red-400' : ''}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}