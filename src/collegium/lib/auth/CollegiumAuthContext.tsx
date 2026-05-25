/**
 * Collegium auth context — Supabase Auth wrapper scoped to this app.
 *
 * Separate from the monorepo's shared AuthContext (which is built for a
 * different SaaS product and bridges demo-mode) so Collegium owns its
 * own login flow without inheriting that product's concerns.
 *
 * Surface:
 *   signIn(email, password)
 *   signUp(email, password, displayName?, timezone?)
 *   signInWithGoogle()       — uses Lovable's built-in Google OAuth
 *   signOut()
 *   resetPassword(email)     — sends reset email
 *   updatePassword(newPwd)   — used on the /auth/reset-password page
 *                              after the email link returns the user
 *                              with an active recovery session
 *
 * The session and the user-facing `profile` (from the `profiles`
 * table that the consolidated migration creates) are exposed as
 * reactive context state.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type CollegiumRole = "admin" | "steward" | "member" | "student";

export type VocationStage =
  | "lawyer"
  | "young-lawyer"
  | "canon-lawyer"
  | "judge"
  | "professor"
  | "clergy"
  | "retired"
  | "student";

export interface CollegiumProfile {
  user_id: string;
  display_name: string | null;
  first_name: string | null;
  timezone: string | null;
  vocation_stage: VocationStage | null;
  chapter_id: string | null;
  bio: string | null;
  city: string | null;
  practice_areas: string[] | null;
  is_approved: boolean;
  created_at: string;
}

export interface CollegiumAuthContextValue {
  user: User | null;
  session: Session | null;
  profile: CollegiumProfile | null;
  roles: CollegiumRole[];
  isLoading: boolean;
  /** Convenience flags. */
  isAuthenticated: boolean;
  isApproved: boolean;
  isAdmin: boolean;
  isSteward: boolean;
  hasRole: (role: CollegiumRole) => boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    displayName?: string,
    timezone?: string
  ) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

const CollegiumAuthContext = createContext<CollegiumAuthContextValue | undefined>(
  undefined
);

export function CollegiumAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<CollegiumProfile | null>(null);
  const [roles, setRoles] = useState<CollegiumRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /** Fetch profile + roles for the given user. Tolerates table not
   *  existing yet (during local dev before migrations are applied). */
  async function loadUserData(userId: string) {
    try {
      const [profileRes, rolesRes] = await Promise.all([
        supabase
          .from("profiles" as never)
          .select(
            "user_id, display_name, first_name, timezone, vocation_stage, chapter_id, bio, city, practice_areas, is_approved, created_at"
          )
          .eq("user_id", userId)
          .maybeSingle(),
        supabase
          .from("user_roles" as never)
          .select("role")
          .eq("user_id", userId),
      ]);
      setProfile((profileRes.data as CollegiumProfile | null) ?? null);
      const fetchedRoles = (rolesRes.data ?? []) as { role: CollegiumRole }[];
      setRoles(fetchedRoles.map((r) => r.role));
    } catch {
      setProfile(null);
      setRoles([]);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function init() {
      const {
        data: { session: existing },
      } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(existing);
      setUser(existing?.user ?? null);
      if (existing?.user) {
        await loadUserData(existing.user.id);
      }
      if (mounted) setIsLoading(false);
    }
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      if (nextSession?.user) {
        // defer to avoid blocking the auth callback
        setTimeout(() => {
          if (mounted) loadUserData(nextSession.user.id);
        }, 0);
      } else {
        setProfile(null);
        setRoles([]);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: (error as Error | null) ?? null };
  }

  async function signUp(
    email: string,
    password: string,
    displayName?: string,
    timezone?: string
  ) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          display_name: displayName ?? null,
          timezone:
            timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      },
    });
    return { error: (error as Error | null) ?? null };
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error: (error as Error | null) ?? null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error: (error as Error | null) ?? null };
  }

  async function updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error: (error as Error | null) ?? null };
  }

  const value: CollegiumAuthContextValue = {
    user,
    session,
    profile,
    roles,
    isLoading,
    isAuthenticated: !!user,
    isApproved: profile?.is_approved ?? false,
    isAdmin: roles.includes("admin"),
    isSteward: roles.includes("steward"),
    hasRole: (role) => roles.includes(role),
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword,
  };

  return (
    <CollegiumAuthContext.Provider value={value}>
      {children}
    </CollegiumAuthContext.Provider>
  );
}

export function useCollegiumAuth(): CollegiumAuthContextValue {
  const ctx = useContext(CollegiumAuthContext);
  if (!ctx) {
    throw new Error(
      "useCollegiumAuth must be used inside <CollegiumAuthProvider>"
    );
  }
  return ctx;
}
