import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCollegiumAuth } from "../../lib/auth/CollegiumAuthContext";
import {
  AuthLayout,
  FormField,
  GoogleSignInButton,
  OrDivider,
  SubmitButton,
  ErrorBanner,
  SuccessBanner,
} from "./AuthLayout";

export function SignUp() {
  const { signUp, signInWithGoogle } = useCollegiumAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: err } = await signUp(email, password, displayName);
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    // Supabase by default requires email confirmation. If the project
    // has "auto-confirm new users" enabled the user is already
    // authenticated and we can route into the app; otherwise we show
    // the "check your inbox" state.
    setConfirmEmailSent(true);
    setTimeout(() => navigate("/app"), 600);
  }

  async function onGoogle() {
    setGoogleBusy(true);
    setError(null);
    const { error: err } = await signInWithGoogle();
    if (err) {
      setError(err.message);
      setGoogleBusy(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join a chapter. Carry the work of the bar with company."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/auth/sign-in" className="collegium-link">
            Sign in
          </Link>
        </>
      }
    >
      <ErrorBanner message={error} />
      {confirmEmailSent && (
        <SuccessBanner message="Check your inbox to confirm your email. Redirecting…" />
      )}

      <GoogleSignInButton onClick={onGoogle} busy={googleBusy} mode="up" />
      <OrDivider />

      <form onSubmit={onSubmit} noValidate>
        <FormField
          label="Display name"
          value={displayName}
          onChange={setDisplayName}
          placeholder="e.g. Margaret Coyle"
          autoComplete="name"
          required
        />
        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          required
        />
        <FormField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
          helperText="At least 8 characters."
        />
        <SubmitButton
          busy={busy}
          disabled={!displayName || !email || password.length < 8}
        >
          Create account
        </SubmitButton>
      </form>
      <p className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-4 text-center">
        By signing up you accept that new accounts may require steward
        approval before unlocking the full app.
      </p>
    </AuthLayout>
  );
}
