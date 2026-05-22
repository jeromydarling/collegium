import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  Check,
  Building,
  Palette,
  Users,
  Scale,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  PLAN_LABEL,
  type PlanTier,
  type TenantType,
} from "../data/tenants";
import { SUPPORTED_JURISDICTIONS } from "../lib/hours/types";
import { DEFAULT_FPL_BANDS, DEFAULT_FLAT_FEES } from "../data/lowBono";

const STORAGE_KEY = "collegium.onboarding.draft.v1";

interface OnboardingState {
  // Step 1: Tenant identity
  displayName: string;
  tenantType: TenantType;
  region: string;
  jurisdictions: string[];

  // Step 2: Branding
  subdomain: string;
  accentHue: number;

  // Step 3: Members
  members: { name: string; email: string; role: string }[];

  // Step 4: Fee ladder
  feeLadderEnabled: boolean;
  usingDefaultLadder: boolean;
}

const DEFAULT_STATE: OnboardingState = {
  displayName: "",
  tenantType: "diocese",
  region: "",
  jurisdictions: [],
  subdomain: "",
  accentHue: 350,
  members: [{ name: "", email: "", role: "Steward" }],
  feeLadderEnabled: true,
  usingDefaultLadder: true,
};

function loadDraft(): OnboardingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveDraft(state: OnboardingState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* silent */
  }
}

/**
 * Onboarding wizard — runs after Stripe payment redirects back with the
 * subscription confirmed. Five steps; state persists in localStorage so a
 * user can resume if they refresh.
 *
 * Demo behavior: state stays in localStorage; in production the final
 * step POSTs to the backend that creates the tenant + provisions the
 * subdomain. Same wizard either way.
 */
export function Onboarding() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const plan = (searchParams.get("plan") as PlanTier) || "network";
  const [step, setStep] = useState(1);
  const [state, setState] = useState<OnboardingState>(loadDraft);

  function update<K extends keyof OnboardingState>(
    key: K,
    value: OnboardingState[K]
  ) {
    const next = { ...state, [key]: value };
    setState(next);
    saveDraft(next);
  }

  const totalSteps = 5;

  return (
    <div className="collegium-theme min-h-screen bg-[hsl(var(--c-cream))]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="text-xs collegium-link inline-flex items-center gap-1 mb-4"
          >
            <ChevronLeft size={12} /> Back
          </button>
        )}

        <div className="mb-6">
          <div className="collegium-latin text-sm text-[hsl(var(--c-wine))] mb-1">
            Initium
          </div>
          <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
            Set up your tenant
          </h1>
          <p className="text-sm text-[hsl(var(--c-slate-soft))] mt-1">
            Subscribed to <strong>{PLAN_LABEL[plan]}</strong>. Five quick
            steps and your network is live.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-[hsl(var(--c-slate-soft))] mb-2">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-[hsl(var(--c-cream-warm))] rounded-full overflow-hidden">
            <div
              className="h-full bg-[hsl(var(--c-wine))] transition-all"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {step === 1 && (
          <IdentityStep state={state} update={update} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <BrandingStep
            state={state}
            update={update}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <MembersStep
            state={state}
            update={update}
            onNext={() => setStep(4)}
          />
        )}
        {step === 4 && (
          <FeeLadderStep
            state={state}
            update={update}
            onNext={() => setStep(5)}
          />
        )}
        {step === 5 && (
          <DoneStep
            state={state}
            plan={plan}
            onEnter={() => {
              localStorage.removeItem(STORAGE_KEY);
              navigate("/app");
            }}
          />
        )}
      </div>
    </div>
  );
}

function IdentityStep({
  state,
  update,
  onNext,
}: {
  state: OnboardingState;
  update: <K extends keyof OnboardingState>(k: K, v: OnboardingState[K]) => void;
  onNext: () => void;
}) {
  const canAdvance = state.displayName.trim().length > 2;

  function toggleJur(code: string) {
    const next = state.jurisdictions.includes(code)
      ? state.jurisdictions.filter((c) => c !== code)
      : [...state.jurisdictions, code];
    update("jurisdictions", next);
  }

  return (
    <div className="collegium-card p-5 sm:p-6">
      <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-3">
        <Building size={14} />
        <span className="text-xs uppercase tracking-widest font-semibold">
          Identity
        </span>
      </div>

      <label className="block mb-4">
        <span className="text-[11px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
          Display name
        </span>
        <input
          type="text"
          value={state.displayName}
          onChange={(e) => update("displayName", e.target.value)}
          placeholder="St. Thomas More Society of Boston"
          className="w-full text-sm py-2 px-3 rounded border border-[hsl(var(--c-border))] bg-white"
        />
      </label>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <label className="block">
          <span className="text-[11px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
            Tenant type
          </span>
          <select
            value={state.tenantType}
            onChange={(e) => update("tenantType", e.target.value as TenantType)}
            className="w-full text-sm py-2 px-3 rounded border border-[hsl(var(--c-border))] bg-white"
          >
            <option value="individual">Individual attorney</option>
            <option value="chapter">Chapter / guild</option>
            <option value="diocese">Diocese</option>
            <option value="law-firm">Law firm</option>
            <option value="catholic-charities">Catholic Charities affiliate</option>
            <option value="law-school">Law school clinic</option>
            <option value="national-affiliate">National affiliate</option>
            <option value="foundation">Foundation</option>
          </select>
        </label>

        <label className="block">
          <span className="text-[11px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
            Primary region
          </span>
          <input
            type="text"
            value={state.region}
            onChange={(e) => update("region", e.target.value)}
            placeholder="Boston, MA"
            className="w-full text-sm py-2 px-3 rounded border border-[hsl(var(--c-border))] bg-white"
          />
        </label>
      </div>

      <div className="mb-5">
        <span className="text-[11px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-2">
          Bar jurisdictions you'll report in
        </span>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_JURISDICTIONS.map((j) => (
            <button
              key={j.code}
              type="button"
              onClick={() => toggleJur(j.code)}
              className={`text-xs px-2.5 py-1.5 rounded border transition-colors ${
                state.jurisdictions.includes(j.code)
                  ? "bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] border-[hsl(var(--c-wine))]"
                  : "bg-white border-[hsl(var(--c-border))] text-[hsl(var(--c-slate))] hover:border-[hsl(var(--c-wine))]"
              }`}
            >
              {j.name}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-2">
          We'll generate bar-format pro bono exports for each one you check.
          Add more later in tenant settings.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!canAdvance}
          className="collegium-btn-primary text-sm inline-flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: branding <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

function BrandingStep({
  state,
  update,
  onNext,
}: {
  state: OnboardingState;
  update: <K extends keyof OnboardingState>(k: K, v: OnboardingState[K]) => void;
  onNext: () => void;
}) {
  const suggestion = state.displayName
    .toLowerCase()
    .replace(/society|of|the|guild|catholic|christian/g, "")
    .replace(/[^a-z]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 28);
  const subdomain = state.subdomain || suggestion;

  return (
    <div className="collegium-card p-5 sm:p-6">
      <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-3">
        <Palette size={14} />
        <span className="text-xs uppercase tracking-widest font-semibold">
          Branding
        </span>
      </div>

      <label className="block mb-4">
        <span className="text-[11px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
          Subdomain
        </span>
        <div className="flex items-center gap-1.5 text-sm">
          <input
            type="text"
            value={subdomain}
            onChange={(e) => update("subdomain", e.target.value.toLowerCase())}
            placeholder="stm-boston"
            className="flex-1 py-2 px-3 rounded border border-[hsl(var(--c-border))] bg-white font-mono"
          />
          <span className="text-[hsl(var(--c-slate-soft))] font-mono">
            .collegium.network
          </span>
        </div>
        <p className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-1.5">
          Your tenant's URL. Members will see this on every page.
        </p>
      </label>

      <label className="block mb-4">
        <span className="text-[11px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-2">
          Accent hue
        </span>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={360}
            value={state.accentHue}
            onChange={(e) => update("accentHue", Number(e.target.value))}
            className="flex-1"
          />
          <div
            className="w-12 h-12 rounded-lg border border-[hsl(var(--c-border))]"
            style={{
              backgroundColor: `hsl(${state.accentHue} 55% 35%)`,
            }}
          />
          <code className="text-xs text-[hsl(var(--c-slate-soft))]">
            {state.accentHue}°
          </code>
        </div>
        <p className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-1.5">
          Default 350° is wine. 220° = blue. 35° = gold. Drag to taste.
        </p>
      </label>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (!state.subdomain) update("subdomain", suggestion);
            onNext();
          }}
          className="collegium-btn-primary text-sm inline-flex items-center gap-1.5"
        >
          Next: invite members <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

function MembersStep({
  state,
  update,
  onNext,
}: {
  state: OnboardingState;
  update: <K extends keyof OnboardingState>(k: K, v: OnboardingState[K]) => void;
  onNext: () => void;
}) {
  function setMember(i: number, field: keyof OnboardingState["members"][number], value: string) {
    const next = [...state.members];
    next[i] = { ...next[i], [field]: value };
    update("members", next);
  }
  function addRow() {
    update("members", [...state.members, { name: "", email: "", role: "Member" }]);
  }
  function removeRow(i: number) {
    update("members", state.members.filter((_, idx) => idx !== i));
  }

  return (
    <div className="collegium-card p-5 sm:p-6">
      <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-3">
        <Users size={14} />
        <span className="text-xs uppercase tracking-widest font-semibold">
          Members
        </span>
      </div>
      <p className="text-sm text-[hsl(var(--c-slate))] mb-4">
        Invite your founding members. They'll get an email with a magic-link
        sign-in. You can add more from the tenant admin after launch.
      </p>

      <div className="space-y-2">
        {state.members.map((m, i) => (
          <div
            key={i}
            className="grid sm:grid-cols-[1fr_1.2fr_8rem_2rem] gap-2 items-start"
          >
            <input
              type="text"
              value={m.name}
              onChange={(e) => setMember(i, "name", e.target.value)}
              placeholder="Full name"
              className="text-sm py-1.5 px-2 rounded border border-[hsl(var(--c-border))] bg-white"
            />
            <input
              type="email"
              value={m.email}
              onChange={(e) => setMember(i, "email", e.target.value)}
              placeholder="email@diocese.org"
              className="text-sm py-1.5 px-2 rounded border border-[hsl(var(--c-border))] bg-white"
            />
            <select
              value={m.role}
              onChange={(e) => setMember(i, "role", e.target.value)}
              className="text-sm py-1.5 px-2 rounded border border-[hsl(var(--c-border))] bg-white"
            >
              <option value="Steward">Steward</option>
              <option value="Mentor">Mentor</option>
              <option value="Member">Member</option>
              <option value="Student">Student</option>
            </select>
            {state.members.length > 1 && (
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="text-[hsl(var(--c-slate-soft))] hover:text-[hsl(8_55%_42%)] text-sm"
                aria-label="Remove"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="text-xs collegium-link mt-3 inline-flex items-center gap-1"
      >
        + Add another member
      </button>

      <div className="flex justify-end mt-5">
        <button
          type="button"
          onClick={onNext}
          className="collegium-btn-primary text-sm inline-flex items-center gap-1.5"
        >
          Next: fee ladder <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

function FeeLadderStep({
  state,
  update,
  onNext,
}: {
  state: OnboardingState;
  update: <K extends keyof OnboardingState>(k: K, v: OnboardingState[K]) => void;
  onNext: () => void;
}) {
  return (
    <div className="collegium-card p-5 sm:p-6">
      <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-3">
        <Scale size={14} />
        <span className="text-xs uppercase tracking-widest font-semibold">
          Fee ladder (low-bono)
        </span>
      </div>
      <p className="text-sm text-[hsl(var(--c-slate))] mb-4 leading-relaxed">
        Will your tenant offer sliding-scale fees for clients above the
        poverty line? Pure pro bono stays free either way — this only kicks
        in for clients who can pay a little. Collegium handles the payment
        via Stripe Connect; we take a 5% platform fee on each transaction.
      </p>

      <label className="flex items-center gap-2 cursor-pointer mb-4">
        <input
          type="checkbox"
          checked={state.feeLadderEnabled}
          onChange={(e) => update("feeLadderEnabled", e.target.checked)}
        />
        <span className="text-sm font-medium">Enable low-bono fee ladder</span>
      </label>

      {state.feeLadderEnabled && (
        <div className="bg-[hsl(var(--c-cream-warm))] rounded p-4 text-xs text-[hsl(var(--c-slate))] leading-relaxed">
          <div className="font-semibold text-[hsl(var(--c-wine))] mb-2 text-[10px] uppercase tracking-widest">
            Default ladder
          </div>
          <ul className="space-y-1">
            {DEFAULT_FPL_BANDS.slice(0, 4).map((b, i) => (
              <li key={i}>
                <span className="font-mono">
                  {b.fplLowerPct}–{b.fplUpperPct ?? "∞"}% FPL
                </span>
                <span className="text-[hsl(var(--c-slate-soft))] ml-2">
                  ${b.hourlyRate}/hr
                  {b.perMatterCap ? ` · cap $${b.perMatterCap}` : ""}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 font-semibold text-[hsl(var(--c-wine))] mb-2 text-[10px] uppercase tracking-widest">
            Default flat fees (selected)
          </div>
          <ul className="space-y-1">
            {DEFAULT_FLAT_FEES.slice(0, 3).map((f) => (
              <li key={f.category}>
                <span className="capitalize">{f.category.replace(/-/g, " ")}</span>
                <span className="text-[hsl(var(--c-slate-soft))] ml-2">
                  ${f.flatFee} flat (≤{f.fplCeilingPct}% FPL)
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-3 italic">
            You can edit these from the tenant admin once you're in. The
            defaults are a reasonable Catholic-legal-aid starting point.
          </p>
        </div>
      )}

      <div className="flex justify-end mt-5">
        <button
          type="button"
          onClick={onNext}
          className="collegium-btn-primary text-sm inline-flex items-center gap-1.5"
        >
          Next: confirm <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

function DoneStep({
  state,
  plan,
  onEnter,
}: {
  state: OnboardingState;
  plan: PlanTier;
  onEnter: () => void;
}) {
  return (
    <div className="collegium-card p-6 sm:p-8 text-center">
      <CheckCircle2
        size={32}
        className="text-[hsl(145_40%_28%)] mx-auto mb-3"
      />
      <h2 className="collegium-display text-2xl mb-2 leading-tight">
        {state.displayName} is ready
      </h2>
      <p className="text-sm text-[hsl(var(--c-slate))] mb-5 max-w-md mx-auto">
        Subdomain provisioned. Members will receive their invite emails
        within five minutes. Your fee ladder is{" "}
        {state.feeLadderEnabled ? "live" : "disabled — pure pro bono only"}.
      </p>

      <div className="bg-[hsl(var(--c-cream-warm))] rounded p-4 text-left max-w-md mx-auto text-xs text-[hsl(var(--c-slate))] mb-6">
        <div className="grid grid-cols-2 gap-y-1.5">
          <span className="text-[hsl(var(--c-slate-soft))]">Plan</span>
          <span className="font-medium">{PLAN_LABEL[plan]}</span>
          <span className="text-[hsl(var(--c-slate-soft))]">Subdomain</span>
          <span className="font-mono">
            {state.subdomain}.collegium.network
          </span>
          <span className="text-[hsl(var(--c-slate-soft))]">Members</span>
          <span>{state.members.filter((m) => m.email).length} invited</span>
          <span className="text-[hsl(var(--c-slate-soft))]">Jurisdictions</span>
          <span>{state.jurisdictions.length || "none yet"}</span>
          <span className="text-[hsl(var(--c-slate-soft))]">Fee ladder</span>
          <span>{state.feeLadderEnabled ? "enabled" : "disabled"}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <button
          type="button"
          onClick={onEnter}
          className="collegium-btn-primary text-sm inline-flex items-center justify-center gap-1.5"
        >
          Enter your tenant <ArrowRight size={13} />
        </button>
        <Link
          to="/pricing"
          className="collegium-btn-ghost text-sm inline-flex items-center justify-center gap-1.5"
        >
          <Sparkles size={13} /> View pricing
        </Link>
      </div>

      <p className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-5 italic">
        Demo mode: tenant data is stored locally. In production, this is
        where the backend provisions your subdomain and routes member
        invites via email.
      </p>
    </div>
  );
}
