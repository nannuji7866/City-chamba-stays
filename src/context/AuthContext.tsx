import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AuthStep =
  | 'idle'          // main auth screen
  | 'email-otp'     // email entered, awaiting OTP
  | 'loading'       // any in-flight async operation
  | 'error';        // last operation failed

export interface AuthContextValue {
  /** Current Supabase session — null if unauthenticated */
  session: Session | null;
  /** Convenience shortcut for session?.user */
  user: User | null;
  /** True while the initial session is being resolved from storage */
  loading: boolean;

  // ── Auth actions ──────────────────────────────────────────────────────────
  /** Sign in with Google OAuth (redirects and returns) */
  signInWithGoogle: () => Promise<void>;
  /** Send OTP to email; resolves to { error } */
  sendEmailOtp: (email: string) => Promise<{ error: string | null }>;
  /** Verify the OTP the user typed; resolves to { error } */
  verifyEmailOtp: (email: string, otp: string) => Promise<{ error: string | null }>;
  /** Sign out the current user */
  signOut: () => Promise<void>;

  // ── Redirect helpers ──────────────────────────────────────────────────────
  /**
   * The route the user originally wanted to visit before being redirected
   * to auth. Set this BEFORE navigating to #/auth so that after sign-in
   * the app can bounce the user to the right place.
   */
  intendedRoute: string | null;
  setIntendedRoute: (route: string | null) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [intendedRoute, setIntendedRoute] = useState<string | null>(null);

  // ── Initialise session from storage and subscribe to auth state changes ──
  useEffect(() => {
    // getSession resolves the persisted session synchronously when available.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setLoading(false);
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Google OAuth ──────────────────────────────────────────────────────────
  const signInWithGoogle = useCallback(async () => {
    // redirectTo must be an allowed redirect URL in your Supabase project.
    // For local dev this is typically http://localhost:5173.
    // In production set it to your deployed origin.
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    // The page will navigate away; nothing more to do here.
  }, []);

  // ── Email OTP — step 1: send ───────────────────────────────────────────
  const sendEmailOtp = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // shouldCreateUser: true creates the account on first sign-in.
        shouldCreateUser: true,
      },
    });
    return { error: error?.message ?? null };
  }, []);

  // ── Email OTP — step 2: verify ────────────────────────────────────────
  const verifyEmailOtp = useCallback(async (email: string, otp: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });
    return { error: error?.message ?? null };
  }, []);

  // ── Sign out ──────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  // ── Value ─────────────────────────────────────────────────────────────────
  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    loading,
    signInWithGoogle,
    sendEmailOtp,
    verifyEmailOtp,
    signOut,
    intendedRoute,
    setIntendedRoute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}

