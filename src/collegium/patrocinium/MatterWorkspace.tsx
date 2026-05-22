import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Send,
  MessageCircle,
  Paperclip,
  Upload,
  FileText,
  ArrowRight,
  Mail,
  Phone,
  Building,
  X,
  Shield,
  Edit3,
  Trash2,
} from "lucide-react";
import {
  useDemoState,
  demoStore,
  type MatterLifecycleState,
  type MatterMessage,
} from "../lib/demoStore";
import type { PatrociniumCase } from "./data/cases";

const LIFECYCLE_STATES: { value: MatterLifecycleState; label: string; tone: string }[] = [
  { value: "intake-scheduled", label: "Intake scheduled", tone: "text-[hsl(38_55%_28%)]" },
  { value: "intake-complete", label: "Intake complete · letter sent", tone: "text-[hsl(38_55%_28%)]" },
  { value: "active", label: "Active representation", tone: "text-[hsl(var(--c-wine))]" },
  { value: "filing-pending", label: "Filing pending", tone: "text-[hsl(var(--c-wine))]" },
  { value: "client-response-pending", label: "Waiting on client", tone: "text-[hsl(var(--c-slate))]" },
  { value: "closed", label: "Closed", tone: "text-[hsl(145_40%_28%)]" },
];

/**
 * MatterWorkspace — what a lawyer sees after they've accepted a case.
 *
 * Three columns of operational stuff:
 *   1. Lifecycle state — where the matter is in its arc, with one-click
 *      transitions
 *   2. Conversation thread — messages with the client, audit log of state
 *      transitions, plus a send-message form
 *   3. Documents — files attached to the matter; demo-only "upload" stub
 *      that drops a filename + size into the store
 *
 * Plus a sticky closure-summary surface that lives at the bottom; when
 * the lawyer is ready to close the matter, the form here generates the
 * pastoral-care summary that goes back to the referring parish.
 */
export function MatterWorkspace({ case: c }: { case: PatrociniumCase }) {
  const state = useDemoState();
  const matterId = c.matter.id;
  const lifecycleState = state.matterLifecycle[matterId] ?? "intake-scheduled";
  const messages = useMemo(
    () =>
      state.matterMessages
        .filter((m) => m.matterId === matterId)
        .sort((a, b) => a.sentAt.localeCompare(b.sentAt)),
    [state.matterMessages, matterId]
  );
  const documents = useMemo(
    () => state.matterDocuments.filter((d) => d.matterId === matterId),
    [state.matterDocuments, matterId]
  );
  const closure = state.closureSummaries[matterId];

  const [messageDraft, setMessageDraft] = useState("");
  const [messageChannel, setMessageChannel] = useState<
    "platform" | "sms" | "email"
  >("platform");
  const [docName, setDocName] = useState("");
  const [docKind, setDocKind] = useState("Draft");
  const [showClosure, setShowClosure] = useState(false);

  function send() {
    if (!messageDraft.trim()) return;
    demoStore.postMessage({
      matterId,
      from: "lawyer",
      body: messageDraft.trim(),
      channel: messageChannel,
    });
    setMessageDraft("");
  }

  function attach() {
    if (!docName.trim()) return;
    demoStore.addDocument({
      matterId,
      filename: docName.trim(),
      kind: docKind,
      sizeKb: Math.round(Math.random() * 240 + 18),
      uploadedBy: "lawyer",
    });
    setDocName("");
  }

  return (
    <section className="mb-6 sm:mb-8">
      <div className="collegium-card p-5 sm:p-6 border-l-4 border-l-[hsl(var(--c-wine))]">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h2 className="collegium-display text-xl sm:text-2xl leading-tight">
            On your plate · workspace
          </h2>
          <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-wine))] font-semibold">
            Matter {matterId}
          </span>
        </div>
        <p className="text-xs text-[hsl(var(--c-slate-soft))] mb-4">
          Status, messages with {c.matter.appeal?.firstName ?? "the client"},
          and documents tied to this matter. The closure-loop summary lives
          at the bottom — fill it out when you wrap up.
        </p>

        {/* Lifecycle stepper */}
        <LifecycleStepper
          current={lifecycleState}
          onChange={(s) => demoStore.setMatterState(matterId, s)}
        />

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-5 mt-5">
          {/* Conversation */}
          <div className="lg:col-span-2 collegium-card p-4 bg-[hsl(var(--c-cream))]">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle size={14} className="text-[hsl(var(--c-wine))]" />
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[hsl(var(--c-wine))]">
                Conversation · {messages.length} entries
              </span>
            </div>
            <div className="space-y-2 mb-4 max-h-72 overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-xs text-[hsl(var(--c-slate-soft))] italic">
                  No messages yet. Send your first one below.
                </p>
              )}
              {messages.map((m) => (
                <MessageRow key={m.id} message={m} />
              ))}
            </div>
            <div className="pt-3 border-t border-[hsl(var(--c-border))]">
              <div className="flex items-center gap-2 mb-2 text-[11px]">
                <span className="text-[hsl(var(--c-slate-soft))]">Channel:</span>
                <button
                  type="button"
                  onClick={() => setMessageChannel("platform")}
                  className={chip(messageChannel === "platform")}
                >
                  Platform
                </button>
                <button
                  type="button"
                  onClick={() => setMessageChannel("email")}
                  className={chip(messageChannel === "email")}
                >
                  <Mail size={10} className="inline mr-0.5" /> Email
                </button>
                <button
                  type="button"
                  onClick={() => setMessageChannel("sms")}
                  className={chip(messageChannel === "sms")}
                >
                  <Phone size={10} className="inline mr-0.5" /> SMS (Twilio)
                </button>
              </div>
              <textarea
                value={messageDraft}
                onChange={(e) => setMessageDraft(e.target.value)}
                rows={3}
                placeholder={`Write to ${c.matter.appeal?.firstName ?? "the client"}…`}
                className="w-full text-sm p-2.5 rounded border border-[hsl(var(--c-border))] bg-white resize-y leading-relaxed"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-[hsl(var(--c-slate-soft))] italic">
                  {messageChannel === "sms"
                    ? "Twilio routes when configured · falls back to in-platform"
                    : messageChannel === "email"
                    ? "Sent via referring parish if client opted in"
                    : "Visible in the client's portal"}
                </p>
                <button
                  type="button"
                  onClick={send}
                  disabled={!messageDraft.trim()}
                  className="collegium-btn-primary text-xs inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send size={11} /> Send
                </button>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="collegium-card p-4 bg-[hsl(var(--c-cream))]">
            <div className="flex items-center gap-2 mb-3">
              <Paperclip size={14} className="text-[hsl(var(--c-wine))]" />
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[hsl(var(--c-wine))]">
                Documents · {documents.length}
              </span>
            </div>
            {documents.length === 0 ? (
              <p className="text-xs text-[hsl(var(--c-slate-soft))] italic mb-3">
                No documents attached yet.
              </p>
            ) : (
              <div className="space-y-1.5 mb-3 max-h-48 overflow-y-auto">
                {documents.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-start gap-2 text-xs p-1.5 rounded hover:bg-[hsl(var(--c-cream-warm))] group"
                  >
                    <FileText
                      size={13}
                      className="text-[hsl(var(--c-wine))] shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[hsl(var(--c-ink))] truncate">
                        {d.filename}
                      </div>
                      <div className="text-[10px] text-[hsl(var(--c-slate-soft))]">
                        {d.kind} · {d.sizeKb} KB · {d.uploadedBy} ·{" "}
                        {formatDate(d.uploadedAt)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => demoStore.removeDocument(d.id)}
                      className="text-[hsl(var(--c-slate-soft))] hover:text-[hsl(8_55%_42%)] opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-3 border-t border-[hsl(var(--c-border))] space-y-2">
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                placeholder="Filename.pdf"
                className="w-full text-xs py-1.5 px-2 rounded border border-[hsl(var(--c-border))] bg-white"
              />
              <select
                value={docKind}
                onChange={(e) => setDocKind(e.target.value)}
                className="w-full text-xs py-1.5 px-2 rounded border border-[hsl(var(--c-border))] bg-white"
              >
                <option>Draft</option>
                <option>Engagement letter</option>
                <option>Filing</option>
                <option>Court order</option>
                <option>Client document</option>
                <option>Evidence</option>
                <option>Memo</option>
                <option>Correspondence</option>
              </select>
              <button
                type="button"
                onClick={attach}
                disabled={!docName.trim()}
                className="collegium-btn-ghost text-xs w-full inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Upload size={11} /> Attach
              </button>
              <p className="text-[10px] text-[hsl(var(--c-slate-soft))] italic">
                Demo: filenames only. Real uploads land when backend storage
                wires.
              </p>
            </div>
          </div>
        </div>

        {/* Closure */}
        <div className="mt-5 pt-5 border-t border-[hsl(var(--c-border))]">
          {closure ? (
            <ClosureSummaryCard
              closure={closure}
              matter={c}
            />
          ) : (
            <ClosureSummaryForm
              matter={c}
              show={showClosure}
              onToggle={() => setShowClosure((s) => !s)}
              onSubmit={(text, consentVerified) => {
                demoStore.saveClosureSummary({
                  matterId,
                  summary: text,
                  consentVerified,
                  sentToReferrer: consentVerified,
                  signedAt: new Date().toISOString(),
                });
                setShowClosure(false);
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function LifecycleStepper({
  current,
  onChange,
}: {
  current: MatterLifecycleState;
  onChange: (s: MatterLifecycleState) => void;
}) {
  const currentIdx = LIFECYCLE_STATES.findIndex((s) => s.value === current);
  return (
    <div className="flex items-stretch gap-1 overflow-x-auto pb-1">
      {LIFECYCLE_STATES.map((s, i) => {
        const isCurrent = s.value === current;
        const isPast = i < currentIdx;
        return (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(s.value)}
            className={`flex-1 min-w-[7rem] px-2.5 py-2 rounded text-[11px] uppercase tracking-widest font-semibold border transition-all text-left ${
              isCurrent
                ? "bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] border-[hsl(var(--c-wine))]"
                : isPast
                ? "bg-[hsl(145_30%_45%/0.08)] text-[hsl(145_40%_25%)] border-[hsl(145_30%_45%/0.30)]"
                : "bg-white text-[hsl(var(--c-slate))] border-[hsl(var(--c-border))] hover:border-[hsl(var(--c-wine))]"
            }`}
            title={isCurrent ? "Current state" : isPast ? "Past" : "Click to advance"}
          >
            <div className="text-[10px] opacity-70 mb-0.5">Step {i + 1}</div>
            <div className="leading-tight">{s.label}</div>
          </button>
        );
      })}
    </div>
  );
}

function MessageRow({ message }: { message: MatterMessage }) {
  if (message.from === "system") {
    return (
      <div className="text-[11px] text-[hsl(var(--c-slate-soft))] italic px-2 py-1 flex items-center gap-1.5">
        <Shield size={10} className="text-[hsl(var(--c-wine))]" />
        {message.body}
        <span className="text-[10px] ml-auto">{formatDateTime(message.sentAt)}</span>
      </div>
    );
  }
  const isLawyer = message.from === "lawyer";
  return (
    <div className={`flex ${isLawyer ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-lg p-2.5 text-sm leading-snug ${
          isLawyer
            ? "bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))]"
            : "bg-white border border-[hsl(var(--c-border))] text-[hsl(var(--c-ink))]"
        }`}
      >
        <div
          className={`text-[10px] uppercase tracking-widest mb-1 font-semibold ${
            isLawyer ? "opacity-70" : "text-[hsl(var(--c-wine))]"
          }`}
        >
          {message.from} · {message.channel ?? "platform"} ·{" "}
          {formatDateTime(message.sentAt)}
        </div>
        <div className="whitespace-pre-wrap">{message.body}</div>
      </div>
    </div>
  );
}

function ClosureSummaryForm({
  matter,
  show,
  onToggle,
  onSubmit,
}: {
  matter: PatrociniumCase;
  show: boolean;
  onToggle: () => void;
  onSubmit: (text: string, consentVerified: boolean) => void;
}) {
  const [text, setText] = useState("");
  const [consentVerified, setConsentVerified] = useState(
    matter.matter.closureLoopConsent === true
  );

  if (!show) {
    return (
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="collegium-display text-base mb-1">Closure-loop summary</h3>
          <p className="text-xs text-[hsl(var(--c-slate-soft))]">
            When you're ready to close this matter, the pastoral-care summary
            goes back to {matter.matter.referredBy ?? "the referring chapter"}.
          </p>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5 shrink-0"
        >
          <Edit3 size={11} /> Write closure summary
        </button>
      </div>
    );
  }

  return (
    <div className="collegium-card p-4 bg-[hsl(var(--c-cream))]">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="collegium-display text-base">Closure-loop summary</h3>
        <button
          type="button"
          onClick={onToggle}
          className="text-[hsl(var(--c-slate-soft))] hover:text-[hsl(var(--c-ink))]"
        >
          <X size={14} />
        </button>
      </div>
      <div className="bg-[hsl(var(--c-cream-warm))] rounded p-3 text-xs text-[hsl(var(--c-slate))] mb-3 leading-relaxed">
        <strong className="text-[hsl(var(--c-wine))]">Pastoral-care framing.</strong>{" "}
        Write what {matter.matter.referredBy ?? "the parish"} can do for the
        client now — accompaniment, continued prayer, follow-up. Do NOT
        include legal substance, confidential facts, or the matter's outcome.
        The parish is being told how to continue the relationship, not what
        you did.
      </div>
      <label className="block mb-3">
        <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
          Summary (pastoral, not legal)
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Example: Matter resolved with what the client wanted. They are asking about pastoral support during a difficult transition. One of the deacons may want to follow up. The client gave permission for this note."
          className="w-full text-sm p-2.5 rounded border border-[hsl(var(--c-border))] bg-white leading-relaxed resize-y"
          maxLength={800}
        />
        <span className="text-[10px] text-[hsl(var(--c-slate-soft))]">
          {text.length} / 800 characters
        </span>
      </label>
      <label className="flex items-start gap-2 text-xs cursor-pointer mb-4">
        <input
          type="checkbox"
          checked={consentVerified}
          onChange={(e) => setConsentVerified(e.target.checked)}
          className="mt-0.5"
        />
        <span className="text-[hsl(var(--c-slate))]">
          I verified the client's consent to closure-loop sharing at intake
          (or re-confirmed it before submitting this).
        </span>
      </label>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] text-[hsl(var(--c-slate-soft))]">
          Closes the matter on submit. Status transitions to "Closed."
        </p>
        <button
          type="button"
          onClick={() => onSubmit(text, consentVerified)}
          disabled={!text.trim()}
          className="collegium-btn-primary text-xs inline-flex items-center gap-1.5 disabled:opacity-50"
        >
          <CheckCircle2 size={11} /> Send & close
        </button>
      </div>
    </div>
  );
}

function ClosureSummaryCard({
  closure,
  matter,
}: {
  closure: { summary: string; consentVerified: boolean; sentToReferrer: boolean; signedAt: string };
  matter: PatrociniumCase;
}) {
  return (
    <div className="bg-[hsl(145_30%_45%/0.08)] border border-[hsl(145_30%_45%/0.30)] rounded p-4">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle2 size={14} className="text-[hsl(145_40%_28%)]" />
        <span className="text-[11px] uppercase tracking-widest font-semibold text-[hsl(145_40%_28%)]">
          Closure-loop summary submitted
        </span>
      </div>
      <p className="text-sm text-[hsl(var(--c-ink))] leading-relaxed italic mb-3">
        "{closure.summary}"
      </p>
      <div className="text-[11px] text-[hsl(var(--c-slate-soft))] flex flex-wrap items-center gap-2">
        <span>{formatDate(closure.signedAt)}</span>
        {closure.consentVerified ? (
          <span className="inline-flex items-center gap-1 text-[hsl(145_40%_28%)]">
            <CheckCircle2 size={10} /> Consent verified
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[hsl(38_55%_28%)]">
            ⚠ Consent not verified — summary held back
          </span>
        )}
        {closure.sentToReferrer && (
          <span className="inline-flex items-center gap-1 text-[hsl(145_40%_28%)]">
            <Building size={10} /> Returned to {matter.matter.referredBy}
          </span>
        )}
      </div>
    </div>
  );
}

function chip(active: boolean): string {
  return `text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded border ${
    active
      ? "bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] border-[hsl(var(--c-wine))]"
      : "bg-white text-[hsl(var(--c-slate))] border-[hsl(var(--c-border))] hover:border-[hsl(var(--c-wine))]"
  } cursor-pointer`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
