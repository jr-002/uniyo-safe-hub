
import { useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, {
          user: session?.user?.email,
          confirmed: session?.user?.email_confirmed_at,
          expires: session?.expires_at
        });
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', {
        user: session?.user?.email,
        confirmed: session?.user?.email_confirmed_at,
        expires: session?.expires_at
      });
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string, department: string) => {
    console.log('Starting fresh signup for:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          department: department,
        },
      },
    });
    
    console.log('Sign up result:', { 
      data: {
        user: data?.user?.email,
        session: !!data?.session,
        needsConfirmation: !data?.session && !!data?.user
      }, 
      error: error?.message 
    });
    
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Sign in result:', { 
      data: {
        user: data?.user?.email,
        session: !!data?.session,
        confirmed: data?.user?.email_confirmed_at
      }, 
      error: error?.message 
    });
    
    return { data, error };
  };

  const signOut = async () => {
    console.log('Signing out user:', user?.email);
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error.message);
    } else {
      console.log('Successfully signed out');
    }
    
    return { error };
  };

  const resendConfirmation = async (email: string) => {
    console.log('Resending confirmation email to:', email);
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      console.error('Resend confirmation error:', error.message);
    } else {
      console.log('Resend confirmation email initiated:', data);
    }
    return { data, error };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resendConfirmation, // Added resendConfirmation
  };
};
