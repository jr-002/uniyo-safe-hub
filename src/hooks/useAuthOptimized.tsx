
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

export const useAuthOptimized = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  });

  const updateAuthState = useCallback((session: Session | null, error: AuthError | null = null) => {
    setAuthState({
      user: session?.user ?? null,
      session,
      loading: false,
      error
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, {
          user: session?.user?.email,
          confirmed: session?.user?.email_confirmed_at,
          expires: session?.expires_at
        });
        
        updateAuthState(session);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      console.log('Initial session check:', {
        user: session?.user?.email,
        confirmed: session?.user?.email_confirmed_at,
        expires: session?.expires_at
      });
      
      updateAuthState(session, error);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [updateAuthState]);

  const signUp = useCallback(async (email: string, password: string, fullName: string, department: string) => {
    console.log('Starting fresh signup for:', email);
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
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
    
    if (error) {
      setAuthState(prev => ({ ...prev, error, loading: false }));
    }
    
    return { data, error };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
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
    
    if (error) {
      setAuthState(prev => ({ ...prev, error, loading: false }));
    }
    
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    console.log('Signing out user:', authState.user?.email);
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error.message);
      setAuthState(prev => ({ ...prev, error }));
    } else {
      console.log('Successfully signed out');
    }
    
    return { error };
  }, [authState.user?.email]);

  const resendConfirmation = useCallback(async (email: string) => {
    console.log('Resending confirmation email to:', email);
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      console.error('Resend confirmation error:', error.message);
      setAuthState(prev => ({ ...prev, error }));
    } else {
      console.log('Resend confirmation email initiated:', data);
    }
    return { data, error };
  }, []);

  const authMethods = useMemo(() => ({
    signUp,
    signIn,
    signOut,
    resendConfirmation
  }), [signUp, signIn, signOut, resendConfirmation]);

  return {
    ...authState,
    ...authMethods,
    isAuthenticated: !!authState.session && !!authState.user,
    isEmailConfirmed: !!authState.user?.email_confirmed_at
  };
};
