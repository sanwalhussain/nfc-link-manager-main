// utils/auth.ts
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export async function checkUserSession(): Promise<User | null> {
  const { user } = await supabase.auth.session();
  return user;
}

export async function signIn(email: string, password: string) {
  const { user, error } = await supabase.auth.signIn({ email, password });
  if (error) {
    throw error;
  }
  return user;
}

export async function signOut() {
  await supabase.auth.signOut();
}
