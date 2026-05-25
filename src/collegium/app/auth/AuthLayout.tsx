import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { CollegiumLogo } from "../../components/Logo";

/**
 * Shared shell for the four auth pages — Sign in, Sign up, Forgot
 * password, Reset password. Wine + cream + gold palette consistent
 * with the rest of the app.
 *
 * Left rail (≥sm): wine-deep panel with the logo and a brief framing
 * line, plus a public-domain tagline. Right column: the actual form.
 *
 * On small screens the rail collapses; the form sits centered.
 */

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[hsl(var(--c-cream))] grid grid-cols-1 sm:grid-cols-[1fr_1.2fr]">
      {/* Left rail */}
      <aside className="hidden sm:flex flex-col justify-between bg-[hsl(var(--c-wine-deep))] text-[hsl(var(--c-cream))] p-10 lg:p-14">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <CollegiumLogo className="text-[hsl(var(--c-gold))] w-9 h-9" />
          <div>
            <div className="collegium-display text-2xl tracking-wide group-hover:text-[hsl(var(--c-gold))] transition-colors">
              Collegium
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-gold))]">
              Annus Advocati
            </div>
          </div>
        </Link>

        <div>
          <div className="w-16 h-[2px] bg-[hsl(var(--c-gold))] mb-6" />
          <p className="collegium-display text-2xl lg:text-3xl leading-snug">
            A guild for Christian lawyers — for the work that isn't being
            done.
          </p>
          <p className="text-sm text-[hsl(40_25%_82%)] mt-4 italic max-w-md">
            "Defend the cause of orphans and widows." — Collect for St. Ivo
            of Kermartin, patron of lawyers.
          </p>
        </div>

        <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-gold))]/70">
          Iustitia tenax · since 1347
        </div>
      </aside>

      {/* Right column — the form */}
      <main className="flex flex-col items-center justify-center px-5 sm:px-10 lg:px-16 py-10">
        <div className="w-full max-w-md">
          {/* Mobile-only logo (left rail is hidden) */}
          <Link
            to="/"
            className="sm:hidden inline-flex items-center gap-2 mb-8 text-[hsl(var(--c-wine))]"
          >
            <CollegiumLogo className="w-7 h-7" />
            <span className="collegium-display text-xl">Collegium</span>
          </Link>

          <h1 className="collegium-display text-3xl sm:text-4xl text-[hsl(var(--c-ink))] mb-1">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-8">
              {subtitle}
            </p>
          )}

          {children}

          {footer && (
            <div className="mt-8 pt-6 border-t border-[hsl(var(--c-border))] text-sm text-[hsl(var(--c-slate-soft))] text-center">
              {footer}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/** Google-branded sign-in button — matches Google's brand guidelines. */
export function GoogleSignInButton({
  onClick,
  busy,
  mode = "in",
}: {
  onClick: () => void;
  busy?: boolean;
  mode?: "in" | "up";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="w-full inline-flex items-center justify-center gap-3 rounded-md border border-[hsl(var(--c-border))] bg-white text-[hsl(var(--c-ink))] py-2.5 text-sm font-medium hover:bg-[hsl(var(--c-cream-warm))] transition-colors disabled:opacity-50"
    >
      <GoogleG />
      <span>
        {busy
          ? "Redirecting…"
          : mode === "up"
            ? "Sign up with Google"
            : "Sign in with Google"}
      </span>
    </button>
  );
}

function GoogleG() {
  // Google brand "G" mark. Inline SVG, four-color.
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A10.99 10.99 0 001 12c0 1.77.43 3.45 1.18 4.93l3.66-2.83z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

/** Divider with "or" centered — used between Google button and form. */
export function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-[hsl(var(--c-border))]" />
      <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))]">
        or
      </span>
      <div className="flex-1 h-px bg-[hsl(var(--c-border))]" />
    </div>
  );
}

export function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  helperText,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  helperText?: string;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-xs uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1.5">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-md border border-[hsl(var(--c-border))] bg-white text-sm py-2.5 px-3 focus:outline-none focus:border-[hsl(var(--c-wine))] focus:ring-1 focus:ring-[hsl(var(--c-wine))]"
      />
      {helperText && (
        <span className="block text-[11px] text-[hsl(var(--c-slate-soft))] mt-1">
          {helperText}
        </span>
      )}
    </label>
  );
}

export function SubmitButton({
  children,
  busy,
  disabled,
}: {
  children: ReactNode;
  busy?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={busy || disabled}
      className="w-full rounded-md bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] text-sm font-medium py-2.5 hover:bg-[hsl(var(--c-wine-deep))] transition-colors disabled:opacity-50"
    >
      {busy ? "…" : children}
    </button>
  );
}

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="rounded-md border border-[hsl(0_50%_60%)] bg-[hsl(0_60%_97%)] text-[hsl(0_60%_35%)] text-sm px-3 py-2 mb-4">
      {message}
    </div>
  );
}

export function SuccessBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="rounded-md border border-[hsl(145_40%_50%)] bg-[hsl(145_50%_97%)] text-[hsl(145_45%_25%)] text-sm px-3 py-2 mb-4">
      {message}
    </div>
  );
}
