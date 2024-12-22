import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-my-custom-header': 'mall-navigator' }
  },
  db: {
    schema: 'public'
  },
  // Add retry configuration
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Create a custom error for Supabase operations
export class SupabaseError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'SupabaseError';
  }
}

// Helper function to handle Supabase errors
export async function handleSupabaseError<T>(
  promise: Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    const { data, error } = await promise;
    if (error) {
      console.error('Supabase error:', error);
      throw new SupabaseError(error.message || 'An error occurred', error);
    }
    if (!data) {
      throw new SupabaseError('No data returned');
    }
    return data;
  } catch (err) {
    if (err instanceof SupabaseError) {
      throw err;
    }
    console.error('Unexpected error:', err);
    throw new SupabaseError('An unexpected error occurred');
  }
}