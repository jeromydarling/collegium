import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCollegiumAuth } from "../../lib/auth/CollegiumAuthContext";

/**
 * OAuth landing page. Supabase parses the URL hash in the background
 * when the page mounts and resolves the session. We watch the session
 * state and route the user into the app once authenticated.
 *
 * For password recovery emails, the same supabase auth listener fires
 * a PASSWORD_RECOVERY event and the user is forwarded to the
 * /auth/reset-password page automatically — handled here so the user
 * doesn't have to deal with raw hash params.
 */
export function AuthCallback() {
  const { session, isLoading } = useCollegiumAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (session) {
      // If the URL fragment looks like a recovery link, route to the
      // reset-password page so the user sets a new password.
      if (window.location.hash.includes("type=recovery")) {
        navigate("/auth/reset-password", { replace: true });
        return;
      }
      navigate("/app", { replace: true });
    } else {
      // No session resolved — send them to sign-in with a small note.
      navigate("/auth/sign-in?error=callback", { replace: true });
    }
  }, [isLoading, session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--c-cream))]">
      <div className="text-center">
        <div className="collegium-display text-2xl text-[hsl(var(--c-wine))] mb-2">
          Signing you in…
        </div>
        <div className="text-sm text-[hsl(var(--c-slate-soft))]">
          One moment.
        </div>
      </div>
    </div>
  );
}
