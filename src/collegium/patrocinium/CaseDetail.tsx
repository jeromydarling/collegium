import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronLeft,
  Clock,
  MapPin,
  Languages,
  ShieldCheck,
  CheckCircle2,
  Bookmark,
  X,
  FileText,
  Gavel,
  Target,
  Building,
  Users,
  CalendarClock,
  Sparkles,
  Quote,
  Mic,
  Pencil,
  HandHeart,
} from "lucide-react";
import { getCase, ENGAGEMENT_LABEL } from "./data/cases";
import { isGuidedTemplate } from "./templates";
import { useDemoState, demoStore } from "../lib/demoStore";
import { chapters, people } from "../data/demo";

const LANG_NAME: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  fa: "Farsi",
  ti: "Tigrinya",
  ln: "Lingala",
  ht: "Haitian Creole",
  vi: "Vietnamese",
  zh: "Chinese",
};

const TEMPLATE_LABEL: Record<string, string> = {
  "eviction-answer": "Answer to notice-to-quit",
  "voucher-preservation-letter": "Section-8 voucher preservation letter",
  "sealing-petition-100a": "M.G.L. c. 276 § 100A sealing petition",
  "sponsorship-document-checklist": "Family-sponsorship document checklist",
  "simple-will": "Simple will draft",
  "hcp-form-mass": "MA health-care proxy form",
  "ssi-reconsideration": "SSI request-for-reconsideration",
  "medical-records-request": "Medical-records release",
  "parish-bylaws-checklist": "Parish bylaws-review checklist",
  "juridic-person-property-memo": "Juridic-person / property-tax memo",
  "irb-witness-statement": "IRB witness-statement template",
  "country-conditions-binder": "Country-conditions evidence binder",
};

export function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const state = useDemoState();
  const c = id ? getCase(id) : null;

  if (!c) {
    return (
      <div className="collegium-theme min-h-screen bg-[hsl(var(--c-cream))]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <Link
            to="/patrocinium/cases"
            className="text-xs collegium-link inline-flex items-center gap-1"
          >
            <ChevronLeft size={12} /> Back to cases
          </Link>
          <p className="mt-6 text-[hsl(var(--c-slate-soft))]">
            Case not found. It may have been accepted by another advocate.
          </p>
        </div>
      </div>
    );
  }

  const { matter, meta } = c;
  const accepted = state.acceptedCases.includes(matter.id);
  const saved = state.savedCases.includes(matter.id);
  const referringChapter = matter.referringChapterId
    ? chapters.find((ch) => ch.id === matter.referringChapterId)
    : null;
  const assigned = matter.assignedTo
    ? people.find((p) => p.id === matter.assignedTo)
    : null;

  const deadlineUrgency = meta.deadlineDate ? deadlineFlag(meta.deadlineDate) : null;

  function handleAccept() {
    demoStore.acceptCase(matter.id);
  }

  function handleDecline() {
    demoStore.declineCase(matter.id);
    navigate("/patrocinium/cases");
  }

  function handleSave() {
    demoStore.toggleSavedCase(matter.id);
  }

  const guidedTemplates =
    meta.templatesAvailable?.filter((t) => isGuidedTemplate(t)) ?? [];
  const hasAnyGuided = guidedTemplates.length > 0;

  return (
    <div className="collegium-theme min-h-screen bg-[hsl(var(--c-cream))]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <Link
          to="/patrocinium/cases"
          className="text-xs collegium-link inline-flex items-center gap-1 mb-4"
        >
          <ChevronLeft size={12} /> All cases
        </Link>

        <div className="mb-5 sm:mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
            <span className="collegium-tag-soft">
              {matter.category.replace(/-/g, " ")}
            </span>
            <UrgencyChip urgency={matter.urgency} />
            <span className="text-[hsl(var(--c-slate-soft))]">·</span>
            <span className="text-[hsl(var(--c-slate-soft))]">
              {ENGAGEMENT_LABEL[meta.engagementType]}
            </span>
            {accepted && (
              <span className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold">
                <CheckCircle2 size={11} /> On your plate
              </span>
            )}
          </div>

          <h1 className="collegium-display text-2xl sm:text-3xl md:text-4xl leading-tight mb-3">
            {meta.goal}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[hsl(var(--c-slate-soft))]">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} /> {matter.region}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} /> ~{meta.hoursEstimate} hours estimated
            </span>
            {matter.languages && matter.languages.some((l) => l !== "en") && (
              <span className="inline-flex items-center gap-1.5">
                <Languages size={13} />
                {matter.languages
                  .filter((l) => l !== "en")
                  .map((l) => LANG_NAME[l] ?? l)
                  .join(", ")}
              </span>
            )}
            {meta.remoteOk && (
              <span className="text-[hsl(145_40%_30%)]">Remote-OK</span>
            )}
            {meta.deadlineDate && (
              <span className={`inline-flex items-center gap-1.5 ${deadlineUrgency?.color ?? ""}`}>
                <CalendarClock size={13} />
                Deadline {formatDate(meta.deadlineDate)}
                {deadlineUrgency?.label && (
                  <span className="text-[10px] uppercase tracking-widest font-semibold">
                    · {deadlineUrgency.label}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div className="collegium-card p-4 sm:p-5 mb-6 sm:mb-8 bg-[hsl(var(--c-cream-warm))]">
          {accepted ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-0.5">
                  <CheckCircle2 size={14} />
                  <span className="text-[11px] uppercase tracking-widest font-semibold">
                    Accepted
                  </span>
                </div>
                <p className="text-sm text-[hsl(var(--c-slate))]">
                  This matter is on your plate. The referring chapter has been
                  notified. Log hours and close the loop from{" "}
                  <Link to="/patrocinium/me" className="collegium-link">
                    My pro bono
                  </Link>
                  .
                </p>
              </div>
              <button
                type="button"
                onClick={handleDecline}
                className="collegium-btn-ghost text-sm inline-flex items-center gap-1.5 shrink-0"
              >
                <X size={13} /> Release back to the pool
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 text-sm text-[hsl(var(--c-slate))]">
                Conflicts cleared, malpractice covered. Accepting confirms
                you'll send an engagement letter (template available below) to
                the client within 48 hours.
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSave}
                  className="collegium-btn-ghost text-sm inline-flex items-center gap-1.5"
                >
                  <Bookmark size={13} />
                  {saved ? "Saved" : "Save for later"}
                </button>
                <button
                  type="button"
                  onClick={handleAccept}
                  className="collegium-btn-primary text-sm inline-flex items-center gap-1.5"
                >
                  Accept this case <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* In their words — the personal appeal, if the client shared one. */}
        {matter.appeal && matter.appeal.consents.showToAdvocates && (
          <ClientAppealCard appeal={matter.appeal} />
        )}

        {/* The brief */}
        <section className="mb-6 sm:mb-8">
          <h2 className="collegium-display text-xl sm:text-2xl mb-3 leading-tight">
            The brief
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            <BriefField icon={<Target size={13} />} label="Goal">
              {meta.goal}
            </BriefField>
            {meta.forum && (
              <BriefField icon={<Gavel size={13} />} label="Forum">
                {meta.forum}
              </BriefField>
            )}
            {meta.opposingParty && (
              <BriefField icon={<Users size={13} />} label="Opposing party">
                {meta.opposingParty}
              </BriefField>
            )}
            {meta.deadlineDate && (
              <BriefField icon={<CalendarClock size={13} />} label="Deadline">
                {formatDate(meta.deadlineDate)}
                {deadlineUrgency?.label && (
                  <span className={`text-xs uppercase tracking-widest ml-1.5 ${deadlineUrgency.color}`}>
                    · {deadlineUrgency.label}
                  </span>
                )}
              </BriefField>
            )}
            <BriefField icon={<Clock size={13} />} label="Hours estimate">
              ~{meta.hoursEstimate} hour{meta.hoursEstimate === 1 ? "" : "s"} ·{" "}
              {ENGAGEMENT_LABEL[meta.engagementType]}
            </BriefField>
            {referringChapter && (
              <BriefField icon={<Building size={13} />} label="Referring chapter">
                <Link
                  to={`/app/chapters/${referringChapter.slug}`}
                  className="collegium-link"
                >
                  {referringChapter.name.split("—")[0].trim()}
                </Link>
                {matter.referredBy && (
                  <span className="text-[hsl(var(--c-slate-soft))]"> · via {matter.referredBy}</span>
                )}
              </BriefField>
            )}
          </div>

          {meta.postureNotes && (
            <div className="mt-5 collegium-card p-4 sm:p-5">
              <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] mb-2">
                Posture & notes
              </div>
              <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">
                {meta.postureNotes}
              </p>
            </div>
          )}

          {matter.fplPercent !== undefined && (
            <div className="mt-3 text-xs text-[hsl(var(--c-slate-soft))]">
              Client at {matter.fplPercent}% of federal poverty level · eligibility verified at intake
            </div>
          )}
        </section>

        {/* Safety net */}
        <section className="mb-6 sm:mb-8">
          <h2 className="collegium-display text-xl sm:text-2xl mb-3 leading-tight">
            Safety net
          </h2>
          <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
            <SafetyTile
              icon={<ShieldCheck size={14} />}
              label="Malpractice"
              status={meta.malpracticeCovered ? "Covered" : "Not yet"}
              detail={
                meta.malpracticeCovered
                  ? "Network policy in force for the duration of this engagement."
                  : "Coverage pending — accept after the steward confirms."
              }
            />
            <SafetyTile
              icon={<CheckCircle2 size={14} />}
              label="Conflicts"
              status={
                meta.conflicts === "auto-cleared"
                  ? "Auto-cleared"
                  : meta.conflicts === "cleared"
                  ? "Cleared"
                  : "Pending"
              }
              detail={
                meta.conflicts === "pending"
                  ? "Steward will confirm before assignment."
                  : "Hash-only ledger checked against the network. Confirm one box on accept."
              }
            />
            {assigned ? (
              <SafetyTile
                icon={<Users size={14} />}
                label="Supervision"
                status="Available"
                detail={`Quick-question sanity checks available from ${assigned.name.split(" ").slice(-1)[0]} and the chapter senior bench.`}
              />
            ) : (
              <SafetyTile
                icon={<Users size={14} />}
                label="Supervision"
                status="Available"
                detail="Senior-advocate sanity-check Q&A via the chapter — no formal mentorship overhead."
              />
            )}
          </div>
        </section>

        {/* Templates */}
        {meta.templatesAvailable && meta.templatesAvailable.length > 0 && (
          <section className="mb-6 sm:mb-8">
            <h2 className="collegium-display text-xl sm:text-2xl mb-3 leading-tight">
              Templates ready
            </h2>
            <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-3">
              Practice-area templates attached to this matter. You can preview
              before accepting.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {meta.templatesAvailable.map((t) => (
                <TemplateRow key={t} slug={t} matterId={matter.id} />
              ))}
            </div>
            {hasAnyGuided && (
              <div className="mt-3 text-xs text-[hsl(var(--c-slate-soft))] flex items-start gap-1.5">
                <Sparkles size={11} className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0" />
                <span>
                  Guided templates run a short structured intake and assemble
                  a working draft on the right. Static templates are reference
                  forms — open in a new tab to copy in.
                </span>
              </div>
            )}
          </section>
        )}

        <section className="text-xs text-[hsl(var(--c-slate-soft))] leading-relaxed border-t border-[hsl(var(--c-border))] pt-5 mt-8">
          Patrocinium publishes pre-vetted matters from the Collegium network.
          The referring chapter retains the client relationship and the
          closure-loop summary; lawyers retain attorney-client privilege with
          the client they accept. Information shared in the public pool is
          sanitized — names and identifying details stay with the referring
          chapter until you accept.
        </section>
      </div>
    </div>
  );
}

function ClientAppealCard({
  appeal,
}: {
  appeal: NonNullable<ReturnType<typeof getCase>>["matter"]["appeal"];
}) {
  if (!appeal) return null;

  const authorBadge = {
    client: { icon: <Pencil size={11} />, label: "In their words" },
    steward: { icon: <HandHeart size={11} />, label: "Transcribed by intake steward" },
    "third-party": {
      icon: <HandHeart size={11} />,
      label: "Captured on their behalf",
    },
    "voice-transcribed": {
      icon: <Mic size={11} />,
      label: "Transcribed from voicemail",
    },
  }[appeal.storyAuthor];

  return (
    <section className="mb-6 sm:mb-8">
      <div className="collegium-card p-5 sm:p-6 bg-gradient-to-br from-[hsl(var(--c-cream))] to-[hsl(var(--c-cream-warm))] border-l-4 border-l-[hsl(var(--c-gold))]">
        <div className="flex items-start gap-3">
          <Quote
            size={28}
            className="text-[hsl(var(--c-gold))] shrink-0 mt-0.5"
            strokeWidth={1.5}
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold inline-flex items-center gap-1">
                {authorBadge.icon} {authorBadge.label}
              </span>
              {appeal.originalLanguage && appeal.originalLanguage !== "en" && (
                <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))]">
                  · Originally in{" "}
                  {(
                    {
                      es: "Spanish",
                      fr: "French",
                      fa: "Farsi",
                      ti: "Tigrinya",
                      ln: "Lingala",
                      ht: "Haitian Creole",
                      vi: "Vietnamese",
                      zh: "Chinese",
                    } as Record<string, string>
                  )[appeal.originalLanguage] ?? appeal.originalLanguage}
                </span>
              )}
            </div>
            <p className="text-base sm:text-lg text-[hsl(var(--c-ink))] leading-relaxed italic">
              "{appeal.storyText}"
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-[hsl(var(--c-slate-soft))]">
              <span className="font-medium text-[hsl(var(--c-wine))] not-italic">
                — {appeal.firstName}
              </span>
              {appeal.translatedBy && (
                <span>Translated by {appeal.translatedBy}</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-[hsl(var(--c-border))] flex items-start gap-1.5 text-[11px] text-[hsl(var(--c-slate-soft))] leading-relaxed">
          <ShieldCheck size={11} className="text-[hsl(var(--c-wine))] mt-0.5 shrink-0" />
          <span>
            {appeal.firstName} consented to share this story with advocates
            considering the case. {appeal.consents.shareCommunio ? "Cross-guild sharing enabled (sanitized via Communio). " : ""}
            {appeal.consents.publicAdvocacy ? "Anonymized version may appear in Justice Gap stories. " : ""}
            Last names, addresses, and contact details never leave the
            referring chapter.
          </span>
        </div>
      </div>
    </section>
  );
}

function BriefField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1">
        {icon} {label}
      </div>
      <div className="text-sm text-[hsl(var(--c-ink))] leading-snug">
        {children}
      </div>
    </div>
  );
}

function SafetyTile({
  icon,
  label,
  status,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  status: string;
  detail: string;
}) {
  const positive = status !== "Pending" && status !== "Not yet";
  return (
    <div className="collegium-card p-4">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1.5">
        {icon} {label}
      </div>
      <div
        className={`text-sm font-semibold mb-1 ${
          positive ? "text-[hsl(145_40%_28%)]" : "text-[hsl(38_55%_28%)]"
        }`}
      >
        {status}
      </div>
      <p className="text-xs text-[hsl(var(--c-slate))] leading-relaxed">{detail}</p>
    </div>
  );
}

function TemplateRow({ slug, matterId }: { slug: string; matterId: string }) {
  const label = TEMPLATE_LABEL[slug] ?? slug;
  const guided = isGuidedTemplate(slug);
  const to = guided ? `/patrocinium/cases/${matterId}/template/${slug}` : "#";
  return guided ? (
    <Link
      to={to}
      className="bg-white border border-[hsl(var(--c-border))] rounded-lg p-3 flex items-center gap-3 hover:shadow-sm transition-shadow group"
    >
      <FileText size={16} className="text-[hsl(var(--c-wine))] shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[hsl(var(--c-ink))] truncate">
          {label}
        </div>
        <div className="text-[11px] text-[hsl(var(--c-wine))] inline-flex items-center gap-0.5">
          Guided draft <ArrowRight size={10} />
        </div>
      </div>
    </Link>
  ) : (
    <div className="bg-white border border-[hsl(var(--c-border))] rounded-lg p-3 flex items-center gap-3 opacity-80">
      <FileText size={16} className="text-[hsl(var(--c-slate-soft))] shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[hsl(var(--c-ink))] truncate">
          {label}
        </div>
        <div className="text-[11px] text-[hsl(var(--c-slate-soft))]">Static template</div>
      </div>
    </div>
  );
}

function UrgencyChip({ urgency }: { urgency: string }) {
  const tone =
    urgency === "urgent"
      ? "bg-[hsl(8_55%_52%/0.14)] text-[hsl(8_55%_38%)]"
      : urgency === "soon"
      ? "bg-[hsl(38_55%_50%/0.14)] text-[hsl(38_55%_28%)]"
      : "bg-[hsl(145_30%_45%/0.14)] text-[hsl(145_40%_25%)]";
  return (
    <span
      className={`text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded ${tone}`}
    >
      {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
    </span>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function deadlineFlag(iso: string): { label?: string; color?: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return {};
  const days = Math.round((d.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
  if (days <= 7) return { label: "This week", color: "text-[hsl(8_55%_42%)]" };
  if (days <= 21) return { label: "Within 3 weeks", color: "text-[hsl(38_55%_28%)]" };
  return {};
}
