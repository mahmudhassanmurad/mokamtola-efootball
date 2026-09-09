import { supabase } from '../lib/supabaseClient';

async function verifyAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return !!data;
}

export async function signInAdmin(
  email: string,
  password: string
): Promise<void> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    await supabase.auth.signOut();
    throw new Error('Admin authentication failed.');
  }

  try {
    const isAdmin = await verifyAdmin(data.user.id);

    if (!isAdmin) {
      await supabase.auth.signOut();
      throw new Error('This account is not authorized as an administrator.');
    }
  } catch (error) {
    await supabase.auth.signOut();
    throw error;
  }
}

export async function signOutAdmin(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function getCurrentAdmin(): Promise<boolean> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.user) {
    return false;
  }

  try {
    return await verifyAdmin(session.user.id);
  } catch {
    return false;
  }
}

export function onAuthSessionChange(
  callback: (hasSession: boolean) => void
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(!!session?.user);
  });

  return () => {
    subscription.unsubscribe();
  };
}