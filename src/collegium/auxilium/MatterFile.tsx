import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  FileText,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  Copy,
  Check,
  Clock,
  AlertCircle,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";
import type { MatterFile as MatterFileT } from "./lib/aiClient";
import {
  JurisdictionPicker,
  useJurisdiction,
} from "./components/JurisdictionPicker";
import { LocalInfoPanel } from "./components/LocalInfoPanel";
import { evictionGuide } from "./data/eviction";

const SESSION_KEY = "auxilium_interview_session";

function loadMatterFile(): MatterFileT | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session.matterFile || null;
  } catch {
    return null;
  }
}

function saveCheckedDocs(checked: Set<string>) {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return;
    const session = JSON.parse(raw);
    if (!session.matterFile) return;
    session.matterFile.suggestedDocuments = session.matterFile.suggestedDocuments.map(
      (d: { key: string }) => ({ ...d, checked: checked.has(d.key) })
    );
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

export function MatterFile() {
  const navigate = useNavigate();
  const [file, setFile] = useState<MatterFileT | null>(loadMatterFile);
  const { jurisdiction, setJurisdiction } = useJurisdiction();

  useEffect(() => {
    if (!file) navigate("/auxilium");
  }, [file, navigate]);

  if (!file) return null;

  const checkedDocs = new Set<string>(
    file.suggestedDocuments.filter((d) => d.checked).map((d) => d.key)
  );

  function toggleDoc(key: string) {
    const next = new Set(checkedDocs);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    saveCheckedDocs(next);
    // Mutate-in-place clone so re-render picks it up.
    setFile((f) =>
      f
        ? {
            ...f,
            suggestedDocuments: f.suggestedDocuments.map((d) =>
              d.key === key ? { ...d, checked: next.has(key) } : d
            ),
          }
        : f
    );
  }

  const docsGot = file.suggestedDocuments.filter((d) => d.checked);
  const docsMissing = file.suggestedDocuments.filter((d) => !d.checked);

  return (
    <div className="collegium-theme bg-[hsl(var(--c-cream))]">
      <div className="bg-gradient-to-b from-[hsl(var(--c-cream))] to-[hsl(var(--c-cream-warm))] border-b border-[hsl(var(--c-border))]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-8 sm:pb-10">
          <Link
            to="/auxilium"
            className="text-xs collegium-link mb-4 inline-flex items-center gap-1"
          >
            <ChevronLeft size={12} /> Auxilium home
          </Link>
          <p className="collegium-latin text-sm text-[hsl(var(--c-wine))] mb-1">
            Sarcina · Your matter file
          </p>
          <h1 className="collegium-display text-3xl sm:text-4xl leading-tight mb-2">
            Here's what we have for you.
          </h1>
          <p className="text-[hsl(var(--c-slate))] leading-relaxed max-w-2xl">
            Built from what you told us. Review, correct anything that's off,
            and bring this with you to a lawyer. You'll get more out of the
            hour.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10 sm:space-y-12 collegium-safe-bottom">
        {/* Jurisdiction — drives the live look-ups below. */}
        <JurisdictionPicker value={jurisdiction} onChange={setJurisdiction} />

        {/* Your story */}
        <Section title="Your story" icon={FileText} latin="Narratio">
          <p className="text-[hsl(var(--c-slate))] leading-relaxed whitespace-pre-line">
            {file.story}
          </p>
        </Section>

        {/* Timeline */}
        {file.timeline.length > 0 && (
          <Section title="Timeline so far" icon={Clock} latin="Tempus">
            <ol className="space-y-3 border-l-2 border-[hsl(var(--c-gold))] pl-5 ml-1">
              {file.timeline.map((t, i) => (
                <li key={i} className="-ml-7 pl-2">
                  <div className="flex items-baseline gap-3">
                    <div className="w-3 h-3 rounded-full bg-[hsl(var(--c-wine))] border-2 border-[hsl(var(--c-cream))] shrink-0 -ml-[7px] mt-1.5" />
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--c-wine))]">
                        {t.when}
                      </div>
                      <div className="text-sm text-[hsl(var(--c-slate))]">
                        {t.event}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {/* Possible defenses */}
        {file.possibleDefenses.length > 0 && (
          <Section
            title="Defenses worth exploring with a lawyer"
            icon={ShieldCheck}
            latin="Defensiones"
          >
            <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-4">
              These are not promises. They're starting points the attorney can
              evaluate against your jurisdiction's law.
            </p>
            <ul className="space-y-3">
              {file.possibleDefenses.map((d, i) => (
                <li
                  key={i}
                  className="collegium-card p-4 sm:p-5 border-l-2 border-l-[hsl(var(--c-gold))]"
                >
                  <h4 className="font-medium text-[hsl(var(--c-ink))] mb-1 leading-snug">
                    {d.headline}
                  </h4>
                  <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">
                    {d.why}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Sensitive notes — visible to user, marked clearly */}
        {file.sensitiveNotes.length > 0 && (
          <aside className="bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)] rounded-xl p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={18}
                className="text-[hsl(38_60%_70%)] mt-0.5 shrink-0"
              />
              <div>
                <h3 className="collegium-display text-lg text-[hsl(40_40%_94%)] mb-2">
                  For the attorney's ears
                </h3>
                <p className="text-sm text-[hsl(40_20%_82%)] leading-relaxed mb-3">
                  Things you mentioned that the lawyer should know about up
                  front. These travel with your packet so you don't have to
                  re-tell them.
                </p>
                <ul className="space-y-1.5 text-sm text-[hsl(40_30%_88%)]">
                  {file.sensitiveNotes.map((n, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[hsl(38_60%_70%)] mt-1">·</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        )}

        {/* Documents to gather */}
        <Section
          title="What to gather before your consult"
          icon={FileText}
          latin="Documenta"
        >
          <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-4">
            {docsGot.length} of {file.suggestedDocuments.length} gathered.
            Tap a row when you have it in hand.
          </p>
          <ul className="space-y-2">
            {file.suggestedDocuments.map((d) => {
              const isChecked = !!d.checked;
              return (
                <li key={d.key}>
                  <button
                    onClick={() => toggleDoc(d.key)}
                    className={`w-full text-left collegium-card p-4 hover:shadow-md transition-all flex items-start gap-3 ${
                      isChecked ? "bg-[hsl(145_30%_42%/0.04)]" : ""
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        isChecked
                          ? "bg-[hsl(145_30%_42%)] border-[hsl(145_30%_42%)] text-white"
                          : "border-[hsl(var(--c-border))] bg-white"
                      }`}
                    >
                      {isChecked && <Check size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span
                          className={`font-medium text-[hsl(var(--c-ink))] leading-snug ${
                            isChecked ? "line-through opacity-60" : ""
                          }`}
                        >
                          {d.label}
                        </span>
                        {d.personalized && (
                          <span className="text-[9px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold">
                            from your interview
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[hsl(var(--c-slate-soft))] leading-snug">
                        {d.why}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </Section>

        {/* Local info — the same Perplexity-backed panels, but now driven by
            the matter file's jurisdiction. */}
        <Section
          title="What's true in your area today"
          icon={Search}
          latin="Hic et nunc"
        >
          <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-4">
            Live look-ups against current public sources, with citations you
            can verify. Information, not advice.
          </p>
          <div className="space-y-4">
            {evictionGuide.perplexityQueries.map((q) => (
              <LocalInfoPanel
                key={q.key}
                queryKey={q.key}
                promptTemplate={q.prompt}
                jurisdiction={jurisdiction}
              />
            ))}
          </div>
        </Section>

        {/* Questions tailored for the consult */}
        <Section
          title="Questions to ask the lawyer"
          icon={HelpCircle}
          latin="Interrogationes"
        >
          <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-4">
            These are tailored to what you told us. They're the questions that
            make your hour count.
          </p>
          <ol className="space-y-4">
            {file.suggestedQuestions.map((q, i) => (
              <li
                key={i}
                className="grid grid-cols-[1.5rem_1fr] gap-3 sm:gap-4"
              >
                <div className="collegium-display text-base text-[hsl(var(--c-gold))]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <p className="font-medium text-[hsl(var(--c-ink))] mb-1 leading-snug">
                    {q.q}
                  </p>
                  <p className="text-sm text-[hsl(var(--c-slate-soft))] leading-snug">
                    {q.why}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* Consult packet — a single text block to copy */}
        <Section title="Your consult packet" icon={Sparkles} latin="Sarcina">
          <ConsultPacket file={file} jurisdiction={jurisdiction} />
        </Section>

        {/* Goals + next step */}
        {file.goals && (
          <aside className="bg-[hsl(var(--c-cream-warm))] border-l-2 border-[hsl(var(--c-gold))] rounded-r-md p-5 sm:p-6">
            <h3 className="collegium-display text-lg mb-2">
              What you said you want
            </h3>
            <p className="text-[hsl(var(--c-slate))] leading-relaxed italic">
              "{file.goals}"
            </p>
          </aside>
        )}

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/auxilium/find-help"
            className="collegium-btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <MapPin size={16} /> Find someone to walk in with
          </Link>
          <button
            onClick={() => {
              if (
                !confirm(
                  "Start a new interview? Your current matter file will be deleted."
                )
              )
                return;
              localStorage.removeItem(SESSION_KEY);
              navigate("/auxilium/begin");
            }}
            className="collegium-btn-ghost inline-flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <RefreshCw size={14} /> Start a new matter
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  latin,
  icon: Icon,
  children,
}: {
  title: string;
  latin?: string;
  icon: typeof FileText;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline gap-3 mb-3 sm:mb-4">
        <div className="w-8 h-8 rounded-full bg-[hsl(var(--c-wine)/0.08)] flex items-center justify-center text-[hsl(var(--c-wine))] shrink-0">
          <Icon size={15} />
        </div>
        <div>
          {latin && (
            <div className="collegium-latin text-xs text-[hsl(var(--c-wine))]">
              {latin}
            </div>
          )}
          <h2 className="collegium-display text-2xl sm:text-3xl leading-tight">
            {title}
          </h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function ConsultPacket({
  file,
  jurisdiction,
}: {
  file: MatterFileT;
  jurisdiction: { city?: string; state?: string };
}) {
  const [copied, setCopied] = useState(false);
  const packet = buildPacket(file, jurisdiction);

  function copy() {
    navigator.clipboard.writeText(packet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div>
      <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-4">
        Hand this to a volunteer attorney at the start of the consult — or
        text it to them ahead of time. It's everything you told us, organized.
      </p>
      <div className="collegium-card overflow-hidden">
        <header className="px-4 sm:px-5 py-3 border-b border-[hsl(var(--c-border))] flex items-center justify-between bg-[hsl(var(--c-cream-warm))]">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[hsl(var(--c-gold))]" />
            <h4 className="font-medium text-sm text-[hsl(var(--c-ink))]">
              Your consult packet
            </h4>
          </div>
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--c-wine))] hover:text-[hsl(var(--c-wine-deep))]"
          >
            {copied ? (
              <>
                <Check size={12} /> Copied
              </>
            ) : (
              <>
                <Copy size={12} /> Copy
              </>
            )}
          </button>
        </header>
        <pre className="p-4 sm:p-5 text-[13px] leading-relaxed whitespace-pre-wrap text-[hsl(var(--c-slate))] font-mono overflow-x-auto">
{packet}
        </pre>
      </div>
    </div>
  );
}

function buildPacket(
  file: MatterFileT,
  jurisdiction: { city?: string; state?: string }
): string {
  const loc =
    jurisdiction.city && jurisdiction.state
      ? `${jurisdiction.city}, ${jurisdiction.state}`
      : jurisdiction.state ||
        (file.jurisdiction.state ?? "[location not set]");

  const lines: string[] = [];
  lines.push(`MATTER FILE — ${file.matterType.toUpperCase()}`);
  lines.push(`LOCATION: ${loc}`);
  lines.push(`PREPARED: ${new Date(file.createdAt).toLocaleDateString()}`);
  lines.push("");
  lines.push("THE STORY (in client's words):");
  for (const line of file.story.split(/(?<=[.!?])\s+/)) {
    if (line.trim()) lines.push("  " + line.trim());
  }
  if (file.timeline.length) {
    lines.push("");
    lines.push("TIMELINE:");
    for (const t of file.timeline) lines.push(`  • ${t.when} — ${t.event}`);
  }
  if (file.possibleDefenses.length) {
    lines.push("");
    lines.push("DEFENSES WORTH EXPLORING:");
    for (const d of file.possibleDefenses) lines.push(`  • ${d.headline}`);
  }
  if (file.sensitiveNotes.length) {
    lines.push("");
    lines.push("FOR THE ATTORNEY:");
    for (const n of file.sensitiveNotes) lines.push(`  • ${n}`);
  }
  const docsGot = file.suggestedDocuments.filter((d) => d.checked);
  const docsMissing = file.suggestedDocuments.filter((d) => !d.checked);
  if (docsGot.length) {
    lines.push("");
    lines.push("DOCUMENTS GATHERED:");
    for (const d of docsGot) lines.push(`  • ${d.label}`);
  }
  if (docsMissing.length) {
    lines.push("");
    lines.push("STILL GATHERING:");
    for (const d of docsMissing) lines.push(`  • ${d.label}`);
  }
  lines.push("");
  lines.push("QUESTIONS I WANT TO ASK:");
  file.suggestedQuestions.forEach((q, i) => {
    lines.push(`  ${i + 1}. ${q.q}`);
  });
  if (file.goals) {
    lines.push("");
    lines.push(`GOAL: ${file.goals}`);
  }
  lines.push("");
  lines.push(
    "Prepared with Auxilium · auxilium provides information, not legal advice."
  );
  return lines.join("\n");
}
