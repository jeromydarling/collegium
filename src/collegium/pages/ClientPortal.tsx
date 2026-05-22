import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ShieldCheck,
  Check,
  ChevronLeft,
  Quote,
  Edit3,
  Trash2,
  HandHeart,
  AlertCircle,
  Clock,
  Mail,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { serviceMatters, type ServiceMatter, type ClientAppeal } from "../data/demo";

/**
 * Client-facing portal — accessed via one-time magic link sent to the
 * client by email or SMS. Shows the matter the client is part of, plus
 * editable controls for their personal appeal (text, consents, removal).
 *
 * Demo mapping: tokens map to matter ids via a small lookup table. In
 * production, tokens are signed JWTs (or DB-issued one-time tokens) that
 * resolve to a matter + a short expiry window. Same UI shape either way.
 */

const DEMO_TOKEN_MAP: Record<string, string> = {
  "esperanza-allston": "sm-8",
  "anna-dorchester": "sm-11",
  "maria-pilsen": "sm-2",
  "john-arlington": "sm-6",
};

const STATUS_LABEL: Record<ServiceMatter["status"], { label: string; color: string }> = {
  new: { label: "Recently received", color: "text-[hsl(38_55%_28%)]" },
  triaged: { label: "Reviewed by intake", color: "text-[hsl(var(--c-wine))]" },
  assigned: {
    label: "Assigned to an advocate",
    color: "text-[hsl(145_40%_28%)]",
  },
  "follow-up": {
    label: "Active — follow-up scheduled",
    color: "text-[hsl(var(--c-wine))]",
  },
  closed: { label: "Closed", color: "text-[hsl(145_40%_28%)]" },
};

export function ClientPortal() {
  const { token } = useParams<{ token: string }>();
  const matterId = token ? DEMO_TOKEN_MAP[token] : null;
  const matter = useMemo(
    () => (matterId ? serviceMatters.find((m) => m.id === matterId) : null),
    [matterId]
  );

  if (!matter || !matter.appeal) {
    return (
      <div className="collegium-theme min-h-screen bg-[hsl(var(--c-cream))]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <AlertCircle
            size={28}
            className="text-[hsl(var(--c-slate-soft))] mx-auto mb-3"
          />
          <h1 className="collegium-display text-2xl mb-2">Link not found</h1>
          <p className="text-sm text-[hsl(var(--c-slate))] mb-4">
            This link may have expired, or it was already used. Your
            referring parish can send you a fresh one.
          </p>
          <Link to="/auxilium" className="collegium-link text-sm">
            Visit Auxilium for general help
          </Link>
        </div>
      </div>
    );
  }

  return <ClientPortalDetail matter={matter} />;
}

function ClientPortalDetail({ matter }: { matter: ServiceMatter }) {
  const initial = matter.appeal!;
  const [storyText, setStoryText] = useState(initial.storyText);
  const [showToAdvocates, setShowToAdvocates] = useState(
    initial.consents.showToAdvocates
  );
  const [shareCommunio, setShareCommunio] = useState(initial.consents.shareCommunio);
  const [publicAdvocacy, setPublicAdvocacy] = useState(
    initial.consents.publicAdvocacy
  );
  const [saved, setSaved] = useState(false);
  const [revoked, setRevoked] = useState(false);
  const status = STATUS_LABEL[matter.status];

  function save() {
    // Demo only — in production this writes back through a token-validated
    // endpoint to the tenant's appeal store, with audit trail.
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function revokeAll() {
    if (
      !confirm(
        "Remove your story completely? You can write a new one any time by asking the parish that helped you."
      )
    ) {
      return;
    }
    setStoryText("");
    setShowToAdvocates(false);
    setShareCommunio(false);
    setPublicAdvocacy(false);
    setRevoked(true);
  }

  if (revoked) {
    return (
      <div className="collegium-theme min-h-screen bg-[hsl(var(--c-cream))]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <Check size={28} className="text-[hsl(145_40%_28%)] mx-auto mb-3" />
          <h1 className="collegium-display text-2xl mb-2">Removed</h1>
          <p className="text-sm text-[hsl(var(--c-slate))] mb-4">
            Your story has been taken down. The matter itself is still being
            handled — only the personal story is removed.
          </p>
          <Link to="/auxilium" className="collegium-link text-sm">
            Return to Auxilium
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="collegium-theme min-h-screen bg-[hsl(var(--c-cream))]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link to="/auxilium" className="text-xs collegium-link inline-flex items-center gap-1 mb-4">
          <ChevronLeft size={12} /> Back to Auxilium
        </Link>

        <div className="mb-6">
          <div className="collegium-latin text-sm text-[hsl(var(--c-wine))] mb-1">
            Portus
          </div>
          <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
            Welcome back, {initial.firstName}
          </h1>
          <p className="text-sm text-[hsl(var(--c-slate-soft))] mt-1">
            This is your private page. The link in your email or text is the
            only way to reach it. You can update your story, change who can
            read it, or remove it at any time.
          </p>
        </div>

        {/* Matter status */}
        <section className="collegium-card p-5 sm:p-6 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-[hsl(var(--c-wine))]" />
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[hsl(var(--c-wine))]">
              Where your matter is
            </span>
          </div>
          <div className={`text-lg font-medium ${status.color}`}>{status.label}</div>
          <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mt-2">
            {plainStatusText(matter.status)}
          </p>
          <div className="mt-4 pt-4 border-t border-[hsl(var(--c-border))] flex items-start gap-2 text-xs text-[hsl(var(--c-slate-soft))]">
            <ShieldCheck size={12} className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0" />
            <span>
              Your full name, address, and contact details never appear on
              any case-list a lawyer browses. Only your first name and your
              story are shared, and only with the people you allow below.
            </span>
          </div>
        </section>

        {/* Story edit */}
        <section className="collegium-card p-5 sm:p-6 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Quote size={14} className="text-[hsl(var(--c-gold))]" />
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[hsl(var(--c-wine))]">
              Your story, in your own words
            </span>
          </div>
          <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed mb-3">
            Write the way you'd talk to a friend. What is happening, what
            you've already tried, what you're hoping for. A few sentences is
            enough.
          </p>
          <textarea
            value={storyText}
            onChange={(e) => setStoryText(e.target.value)}
            rows={6}
            maxLength={1000}
            className="w-full text-sm sm:text-base p-3 rounded border border-[hsl(var(--c-border))] bg-white text-[hsl(var(--c-ink))] resize-y leading-relaxed focus:outline-none focus:border-[hsl(var(--c-wine))]"
          />
          <div className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-1">
            {storyText.length} / 1000 characters
          </div>
        </section>

        {/* Consents */}
        <section className="collegium-card p-5 sm:p-6 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={14} className="text-[hsl(var(--c-wine))]" />
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[hsl(var(--c-wine))]">
              Who can read your story
            </span>
          </div>
          <div className="space-y-3">
            <Consent
              checked={showToAdvocates}
              onChange={setShowToAdvocates}
              label="Lawyers reading my case"
              detail="Only lawyers who are considering taking your matter will see this. They will not see your last name or contact information."
            />
            <Consent
              checked={shareCommunio}
              onChange={setShareCommunio}
              label="Lawyers at other partner guilds (if my case is referred)"
              detail="If your matter has to be sent to another city or partner organization, your story can go with it. Personal details are automatically removed first."
            />
            <Consent
              checked={publicAdvocacy}
              onChange={setPublicAdvocacy}
              label="An anonymous version on the public Justice Gap page"
              detail="Your story may be used (with your first name changed and no specifics) to help others understand why this work matters. You can opt back out any time."
            />
          </div>
        </section>

        {/* Save / remove */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={save}
            className="collegium-btn-primary text-sm inline-flex items-center justify-center gap-1.5"
          >
            {saved ? <CheckCircle2 size={14} /> : <Edit3 size={14} />}
            {saved ? "Saved" : "Save changes"}
          </button>
          <button
            type="button"
            onClick={revokeAll}
            className="text-sm text-[hsl(8_55%_42%)] hover:underline inline-flex items-center justify-center gap-1.5"
          >
            <Trash2 size={13} /> Remove my story completely
          </button>
        </div>

        {/* Contact intake */}
        <section className="bg-[hsl(var(--c-cream-warm))] border border-[hsl(var(--c-border))] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <HandHeart size={14} className="text-[hsl(var(--c-wine))]" />
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[hsl(var(--c-wine))]">
              Need to reach us
            </span>
          </div>
          <p className="text-sm text-[hsl(var(--c-slate))] mb-3">
            If something has changed, or you want to ask a question, contact
            the parish or clinic that helped you with intake:
          </p>
          <div className="space-y-1.5 text-sm text-[hsl(var(--c-ink))]">
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-[hsl(var(--c-slate-soft))]" />
              <span className="font-medium">{matter.referredBy}</span>
            </div>
            {/* Phone is intentionally a parish line, not a direct number */}
            <div className="flex items-center gap-2 text-[hsl(var(--c-slate-soft))]">
              <Phone size={13} />
              <span>Call the parish office for the intake line</span>
            </div>
          </div>
        </section>

        <p className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-6 leading-relaxed italic text-center">
          This link expires 30 days after it was sent and can only be used
          from this device. If you need a new link, the parish that helped
          you can issue one.
        </p>
      </div>
    </div>
  );
}

function Consent({
  checked,
  onChange,
  label,
  detail,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  detail: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 shrink-0 cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm text-[hsl(var(--c-ink))] font-medium">{label}</div>
        <div className="text-xs text-[hsl(var(--c-slate))] leading-relaxed mt-0.5">
          {detail}
        </div>
      </div>
    </label>
  );
}

function plainStatusText(status: ServiceMatter["status"]): string {
  switch (status) {
    case "new":
      return "Your matter is in the intake queue and will be reviewed by a steward in the next two business days.";
    case "triaged":
      return "A steward has looked at your matter and is finding the right lawyer or clinic. You will hear from someone within a week.";
    case "assigned":
      return "A volunteer attorney has been matched to your matter. They will reach out directly to set up a first conversation.";
    case "follow-up":
      return "Your matter is active. Your attorney has been in touch and is working through the next steps with you.";
    case "closed":
      return "Your matter is closed. If anything new comes up — even months from now — let the parish know and they can re-open intake.";
    default:
      return "Your matter is being worked on. The parish that helped you can give you the most current update.";
  }
}
