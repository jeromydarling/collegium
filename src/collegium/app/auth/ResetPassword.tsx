import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCollegiumAuth } from "../../lib/auth/CollegiumAuthContext";
import {
  AuthLayout,
  FormField,
  SubmitButton,
  ErrorBanner,
  SuccessBanner,
} from "./AuthLayout";

/**
 * Landed here from the password-reset email. By the time the page
 * mounts, Supabase has parsed the URL fragment and given us an active
 * recovery session — at which point updateUser({ password }) sets the
 * new password.
 *
 * If the user opens this page WITHOUT a recovery session (e.g. they
 * bookmarked it), we redirect them to the forgot-password page.
 */
export function ResetPassword() {
  const { session, updatePassword, isLoading } = useCollegiumAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Once auth has loaded, if there's no session, send the user back
  // to start the reset flow.
  useEffect(() => {
    if (!isLoading && !session) {
      const t = setTimeout(() => navigate("/auth/forgot-password"), 1200);
      return () => clearTimeout(t);
    }
  }, [isLoading, session, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await updatePassword(password);
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate("/app"), 900);
  }

  return (
    <AuthLayout
      title="Set a new password"
      subtitle="Pick something you'll actually remember."
      footer={
        <>
          Changed your mind?{" "}
          <Link to="/auth/sign-in" className="collegium-link">
            Back to sign in
          </Link>
        </>
      }
    >
      <ErrorBanner message={error} />
      {done && <SuccessBanner message="Password updated. Redirecting…" />}

      {!isLoading && !session && (
        <p className="text-sm text-[hsl(var(--c-slate-soft))]">
          This reset link is no longer active. Redirecting you back to start
          over…
        </p>
      )}

      {session && !done && (
        <form onSubmit={onSubmit} noValidate>
          <FormField
            label="New password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            required
            helperText="At least 8 characters."
          />
          <FormField
            label="Confirm password"
            type="password"
            value={confirm}
            onChange={setConfirm}
            autoComplete="new-password"
            required
          />
          <SubmitButton
            busy={busy}
            disabled={password.length < 8 || password !== confirm}
          >
            Update password
          </SubmitButton>
        </form>
      )}
    </AuthLayout>
  );
}
