import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCollegiumAuth } from "../../lib/auth/CollegiumAuthContext";
import {
  AuthLayout,
  FormField,
  GoogleSignInButton,
  OrDivider,
  SubmitButton,
  ErrorBanner,
} from "./AuthLayout";

export function SignIn() {
  const { signIn, signInWithGoogle } = useCollegiumAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") ?? "/app";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await signIn(email, password);
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate(redirect);
  }

  async function onGoogle() {
    setGoogleBusy(true);
    setError(null);
    const { error: err } = await signInWithGoogle();
    if (err) {
      setError(err.message);
      setGoogleBusy(false);
    }
    // On success Supabase redirects the browser away — no further work here.
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back. Return to your chapter, your pair, your year."
      footer={
        <>
          New to Collegium?{" "}
          <Link to="/auth/sign-up" className="collegium-link">
            Create an account
          </Link>
        </>
      }
    >
      <ErrorBanner message={error} />

      <GoogleSignInButton onClick={onGoogle} busy={googleBusy} />
      <OrDivider />

      <form onSubmit={onSubmit} noValidate>
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
          autoComplete="current-password"
          required
        />
        <div className="flex justify-end mb-4">
          <Link
            to="/auth/forgot-password"
            className="text-xs text-[hsl(var(--c-wine))] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <SubmitButton busy={busy} disabled={!email || !password}>
          Sign in
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
