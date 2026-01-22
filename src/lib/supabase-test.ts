// src/lib/supabase-test.ts
// 🧪 Supabase Connection Test Script for Oracle AI Buddy

import { supabase } from './supabase';

interface TestResult {
  name: string;
  status: '✅ PASS' | '❌ FAIL';
  message: string;
}

export async function runSupabaseTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  console.log('\n🧪 [BUDDY-TEST] Starting Supabase Connection Tests...\n');

  // Test 1: Basic Connection
  try {
    const { error } = await supabase.from('profiles').select('*').limit(0);
    if (error) throw error;
    results.push({
      name: 'Basic Connection',
      status: '✅ PASS',
      message: 'Successfully connected to Supabase!'
    });
  } catch (error) {
    results.push({
      name: 'Basic Connection',
      status: '❌ FAIL',
      message: `Connection failed: ${(error as Error).message}`
    });
  }

  // Test 2: Check All Tables
  const tables = ['profiles', 'learning_progress', 'chat_sessions', 'chat_messages'];
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(0);
      if (error) throw error;
      results.push({
        name: `Table: ${table}`,
        status: '✅ PASS',
        message: `Table "${table}" exists and accessible`
      });
    } catch (error) {
      results.push({
        name: `Table: ${table}`,
        status: '❌ FAIL',
        message: `Table "${table}" error: ${(error as Error).message}`
      });
    }
  }

  // Test 3: Auth Service
  try {
    const { data } = await supabase.auth.getSession();
    results.push({
      name: 'Auth Service',
      status: '✅ PASS',
      message: data.session ? 'Auth working (user logged in)' : 'Auth working (no session)'
    });
  } catch (error) {
    results.push({
      name: 'Auth Service',
      status: '❌ FAIL',
      message: `Auth error: ${(error as Error).message}`
    });
  }

  // Print Results
  console.log('📊 [BUDDY-TEST] Results:\n' + '='.repeat(50));
  
  let passCount = 0;
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.status} ${r.name}`);
    console.log(`   └─ ${r.message}`);
    if (r.status === '✅ PASS') passCount++;
  });

  console.log('='.repeat(50));
  console.log(`\n📈 Summary: ${passCount}/${results.length} passed`);
  console.log(`🎯 Success Rate: ${((passCount / results.length) * 100).toFixed(0)}%\n`);

  return results;
}

// Quick test for browser console
export async function quickTest() {
  console.log('🚀 Quick Supabase Test...');
  const { error } = await supabase.from('profiles').select('*').limit(0);
  
  if (error) {
    console.error('❌ FAILED:', error.message);
    return false;
  }
  console.log('✅ SUCCESS! Supabase connected.');
  return true;
}