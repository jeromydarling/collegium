import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  Clock,
  MapPin,
  CheckCircle2,
  Bookmark,
  Plus,
  Heart,
  Award,
  Calendar,
} from "lucide-react";
import { allCases, ENGAGEMENT_LABEL } from "./data/cases";
import { useDemoState, demoStore } from "../lib/demoStore";

export function MyProBono() {
  const state = useDemoState();
  const cases = useMemo(() => allCases(), []);

  const accepted = cases.filter((c) => state.acceptedCases.includes(c.matter.id));
  const saved = cases.filter(
    (c) =>
      state.savedCases.includes(c.matter.id) &&
      !state.acceptedCases.includes(c.matter.id)
  );

  const hoursThisYear = state.loggedHours.reduce((s, h) => s + h.hours, 0);
  const estimatedHoursOnPlate = accepted.reduce(
    (s, c) => s + c.meta.hoursEstimate,
    0
  );

  return (
    <div className="collegium-theme min-h-screen bg-[hsl(var(--c-cream))]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <Link
          to="/patrocinium"
          className="text-xs collegium-link mb-3 inline-flex items-center gap-1"
        >
          <ChevronLeft size={12} /> Patrocinium
        </Link>

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
            <Heart size={14} />
            <span className="collegium-latin text-sm">Officium meum</span>
          </div>
          <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
            My pro bono
          </h1>
          <p className="text-sm text-[hsl(var(--c-slate-soft))] mt-1">
            Hours logged, matters in flight, and the closure-loop on what's done.
          </p>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
          <KPI
            icon={<Clock size={14} />}
            label="Hours logged"
            value={hoursThisYear}
            sub="this year"
          />
          <KPI
            icon={<CheckCircle2 size={14} />}
            label="On your plate"
            value={accepted.length}
            sub={`~${estimatedHoursOnPlate} hr estimated`}
          />
          <KPI
            icon={<Bookmark size={14} />}
            label="Saved"
            value={saved.length}
            sub="to review later"
          />
          <KPI
            icon={<Award size={14} />}
            label="Closed"
            value={state.loggedHours.filter((h) => h.note?.includes("closed")).length}
            sub="matters resolved"
          />
        </div>

        {/* Accepted */}
        <section className="mb-8 sm:mb-10">
          <h2 className="collegium-display text-xl sm:text-2xl mb-3 leading-tight">
            On your plate
          </h2>
          {accepted.length === 0 ? (
            <div className="collegium-card p-8 text-center">
              <p className="text-sm text-[hsl(var(--c-slate-soft))] mb-3">
                No matters accepted yet.
              </p>
              <Link
                to="/patrocinium/cases"
                className="collegium-btn-primary inline-flex items-center gap-1.5 text-sm"
              >
                Browse open cases <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {accepted.map((c) => (
                <AcceptedCard
                  key={c.matter.id}
                  c={c}
                  hoursLogged={state.loggedHours
                    .filter((h) => h.matterId === c.matter.id)
                    .reduce((s, h) => s + h.hours, 0)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Saved */}
        {saved.length > 0 && (
          <section className="mb-8 sm:mb-10">
            <h2 className="collegium-display text-xl sm:text-2xl mb-3 leading-tight">
              Saved for later
            </h2>
            <div className="space-y-3">
              {saved.map((c) => (
                <Link
                  key={c.matter.id}
                  to={`/patrocinium/cases/${c.matter.id}`}
                  className="collegium-card p-4 sm:p-5 hover:shadow-sm transition-shadow block flex items-start gap-3"
                >
                  <Bookmark
                    size={14}
                    className="text-[hsl(38_55%_28%)] mt-0.5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs mb-1">
                      <span className="collegium-tag-soft">
                        {c.matter.category.replace(/-/g, " ")}
                      </span>
                      <span className="text-[hsl(var(--c-slate-soft))]">
                        {c.matter.region} · ~{c.meta.hoursEstimate} hr
                      </span>
                    </div>
                    <div className="text-sm text-[hsl(var(--c-ink))] leading-snug truncate">
                      {c.meta.goal}
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-[hsl(var(--c-slate-soft))] mt-1 shrink-0"
                  />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent activity */}
        {state.loggedHours.length > 0 && (
          <section className="mb-8 sm:mb-10">
            <h2 className="collegium-display text-xl sm:text-2xl mb-3 leading-tight">
              Recent activity
            </h2>
            <div className="space-y-2.5">
              {[...state.loggedHours]
                .reverse()
                .slice(0, 8)
                .map((h, i) => {
                  const c = cases.find((c) => c.matter.id === h.matterId);
                  return (
                    <div
                      key={i}
                      className="collegium-card p-3 sm:p-4 flex items-center gap-3"
                    >
                      <Calendar
                        size={13}
                        className="text-[hsl(var(--c-slate-soft))] shrink-0"
                      />
                      <div className="flex-1 min-w-0 text-sm">
                        <span className="text-[hsl(var(--c-ink))] font-medium">
                          {h.hours} hour{h.hours === 1 ? "" : "s"}
                        </span>{" "}
                        <span className="text-[hsl(var(--c-slate-soft))]">
                          on {c ? truncate(c.meta.goal, 60) : h.matterId}
                        </span>
                      </div>
                      <div className="text-xs text-[hsl(var(--c-slate-soft))] shrink-0">
                        {formatDate(h.date)}
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        <section className="text-xs text-[hsl(var(--c-slate-soft))] leading-relaxed border-t border-[hsl(var(--c-border))] pt-5 mt-8 collegium-safe-bottom">
          Hours and matters tracked here are visible only to you. The
          referring chapter sees the closure-loop summary when you close a
          matter (if the client consented at intake). Bar-association
          reporting export coming in a later session.
        </section>
      </div>
    </div>
  );
}

function KPI({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <div className="collegium-card p-4">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1">
        {icon} {label}
      </div>
      <div className="collegium-display text-3xl text-[hsl(var(--c-ink))] leading-none">
        {value}
      </div>
      <div className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-1">{sub}</div>
    </div>
  );
}

function AcceptedCard({
  c,
  hoursLogged,
}: {
  c: ReturnType<typeof allCases>[number];
  hoursLogged: number;
}) {
  const { matter, meta } = c;
  const [showLog, setShowLog] = useState(false);
  const [hours, setHours] = useState("");
  const [note, setNote] = useState("");
  const pctComplete = meta.hoursEstimate
    ? Math.min(100, Math.round((hoursLogged / meta.hoursEstimate) * 100))
    : 0;

  function logEntry(e: React.FormEvent) {
    e.preventDefault();
    const h = Number(hours);
    if (!h || h <= 0) return;
    demoStore.logHours({
      matterId: matter.id,
      hours: h,
      date: new Date().toISOString().slice(0, 10),
      note: note || undefined,
    });
    setHours("");
    setNote("");
    setShowLog(false);
  }

  return (
    <div className="collegium-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs mb-1.5">
            <span className="collegium-tag-soft">
              {matter.category.replace(/-/g, " ")}
            </span>
            <span className="text-[hsl(var(--c-slate-soft))]">
              {ENGAGEMENT_LABEL[meta.engagementType]}
            </span>
            <span className="text-[hsl(var(--c-slate-soft))] inline-flex items-center gap-1">
              <MapPin size={11} /> {matter.region}
            </span>
          </div>
          <Link
            to={`/patrocinium/cases/${matter.id}`}
            className="collegium-display text-base sm:text-lg leading-snug hover:text-[hsl(var(--c-wine))] transition-colors block"
          >
            {meta.goal}
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setShowLog((s) => !s)}
          className="collegium-btn-ghost text-xs inline-flex items-center gap-1 shrink-0"
        >
          <Plus size={11} /> Log hours
        </button>
      </div>

      <div className="flex items-center gap-3 mt-3">
        <div className="flex-1">
          <div className="h-1.5 bg-[hsl(var(--c-cream-warm))] rounded-full overflow-hidden">
            <div
              className="h-full bg-[hsl(var(--c-wine))]"
              style={{ width: `${pctComplete}%` }}
            />
          </div>
        </div>
        <div className="text-xs text-[hsl(var(--c-slate-soft))] shrink-0">
          {hoursLogged} / ~{meta.hoursEstimate} hr
        </div>
      </div>

      {showLog && (
        <form
          onSubmit={logEntry}
          className="mt-3 pt-3 border-t border-[hsl(var(--c-border))] grid sm:grid-cols-[7rem_1fr_auto] gap-2 items-end"
        >
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
              Hours
            </span>
            <input
              type="number"
              step="0.25"
              min="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full text-sm py-1.5 px-2 rounded border border-[hsl(var(--c-border))] bg-white"
              autoFocus
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
              What did you do? (optional)
            </span>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Intake call, draft answer, etc."
              className="w-full text-sm py-1.5 px-2 rounded border border-[hsl(var(--c-border))] bg-white"
            />
          </label>
          <button type="submit" className="collegium-btn-primary text-xs">
            Log
          </button>
        </form>
      )}
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}
