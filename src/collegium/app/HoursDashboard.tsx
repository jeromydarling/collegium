import { useMemo, useState } from "react";
import {
  Clock,
  Download,
  Copy,
  Check,
  ChevronLeft,
  Award,
  FileText,
  Users,
  ChevronRight,
} from "lucide-react";
import { hoursEntries, matterGoal } from "../lib/hours/demoEntries";
import {
  generateBarReport,
  generateFirmRollup,
} from "../lib/hours/barExport";
import {
  SUPPORTED_JURISDICTIONS,
  type JurisdictionCode,
  ACTIVITY_LABEL,
} from "../lib/hours/types";
import { tenants, defaultTenant } from "../data/tenants";
import { people } from "../data/demo";
import { Link } from "react-router-dom";

/**
 * Hours dashboard — the killer-feature surface.
 *
 * Two modes:
 *   1. Personal view — what an individual attorney has logged this year,
 *      with one-click bar export for whichever state(s) they report in.
 *   2. Firm/tenant rollup — for tenants whose plan includes firm-wide
 *      reporting (chapter+ tiers). Aggregates all members.
 *
 * The bar-export pane lives in both modes. Pick jurisdiction + year, see
 * the formatted text on the right, copy or download.
 */
export function HoursDashboard() {
  const [mode, setMode] = useState<"personal" | "firm">("personal");
  const [attorneyId, setAttorneyId] = useState("p-coyle");
  const [jurisdiction, setJurisdiction] = useState<JurisdictionCode>("US-MA");
  const [year, setYear] = useState(new Date().getFullYear());
  const [copied, setCopied] = useState(false);

  const tenant = useMemo(() => defaultTenant(), []);
  const attorney = useMemo(
    () => people.find((p) => p.id === attorneyId),
    [attorneyId]
  );

  const personalReport = useMemo(() => {
    if (!attorney) return null;
    return generateBarReport({
      jurisdiction,
      attorney: {
        name: attorney.name,
        barNumber: `BBO-${attorneyId.slice(-4).toUpperCase()}-2024`,
        firmOrClinic: tenant.branding.displayName,
      },
      reportingYear: year,
      entries: hoursEntries,
    });
  }, [attorney, attorneyId, jurisdiction, year, tenant.branding.displayName]);

  const firmRollup = useMemo(() => {
    const attorneyMap = new Map(
      tenant.memberIds
        .map((id) => {
          const p = people.find((x) => x.id === id);
          if (!p) return null;
          return [id, { name: p.name, barNumber: `BBO-${id.slice(-4).toUpperCase()}-2024` }] as const;
        })
        .filter((x): x is [string, { name: string; barNumber: string }] => !!x)
    );
    return generateFirmRollup({
      jurisdiction,
      reportingYear: year,
      firmName: tenant.branding.displayName,
      attorneys: attorneyMap,
      entries: hoursEntries,
    });
  }, [tenant, jurisdiction, year]);

  const reportText =
    mode === "personal" ? personalReport?.text ?? "" : firmRollup.text;

  function handleCopy() {
    navigator.clipboard?.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function handleDownload() {
    const filename =
      mode === "personal"
        ? `pro-bono-${jurisdiction}-${year}-${attorney?.name.split(" ").pop()}.txt`
        : `firm-pro-bono-${jurisdiction}-${year}-${tenant.branding.subdomain}.txt`;
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const recentEntries = [...hoursEntries]
    .filter((e) => mode === "personal" ? e.attorneyId === attorneyId : true)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-6xl mx-auto">
      <Link
        to="/patrocinium/me"
        className="text-xs collegium-link inline-flex items-center gap-1 mb-3"
      >
        <ChevronLeft size={12} /> Personal dashboard
      </Link>

      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <Award size={14} />
          <span className="collegium-latin text-sm">Horae operis pro bono</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          Pro bono hours
        </h1>
        <p className="text-sm text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          One-click bar-format reports for every reporting jurisdiction, plus
          firm-wide rollups for tenant administrators. The thing your
          coordinator is currently doing in a spreadsheet.
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex items-center gap-2 mb-6">
        <ModeButton active={mode === "personal"} onClick={() => setMode("personal")}>
          <Clock size={13} /> My hours
        </ModeButton>
        <ModeButton active={mode === "firm"} onClick={() => setMode("firm")}>
          <Users size={13} /> Firm / tenant rollup
        </ModeButton>
      </div>

      {/* Controls */}
      <div className="collegium-card p-4 sm:p-5 mb-5 bg-[hsl(var(--c-cream-warm))]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {mode === "personal" && (
            <FieldSelect
              label="Attorney"
              value={attorneyId}
              onChange={(v) => setAttorneyId(v)}
              options={tenant.memberIds
                .map((id) => {
                  const p = people.find((x) => x.id === id);
                  return p ? { value: id, label: p.name } : null;
                })
                .filter((x): x is { value: string; label: string } => !!x)}
            />
          )}
          <FieldSelect
            label="Jurisdiction"
            value={jurisdiction}
            onChange={(v) => setJurisdiction(v as JurisdictionCode)}
            options={SUPPORTED_JURISDICTIONS.map((j) => ({
              value: j.code,
              label: j.mandatory ? `${j.name} (mandatory)` : j.name,
            }))}
          />
          <FieldSelect
            label="Reporting year"
            value={year.toString()}
            onChange={(v) => setYear(Number(v))}
            options={[2026, 2025, 2024].map((y) => ({
              value: y.toString(),
              label: y.toString(),
            }))}
          />
          {mode === "firm" && (
            <div className="text-xs text-[hsl(var(--c-slate-soft))] self-end pb-1.5">
              Tenant:{" "}
              <span className="font-semibold text-[hsl(var(--c-ink))]">
                {tenant.branding.displayName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* KPI strip */}
      {mode === "personal" && personalReport && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
          <KPI
            label="Hours this year"
            value={personalReport.summary.totalHours.toFixed(1)}
            sub={`in ${personalReport.summary.jurisdictionName}`}
          />
          <KPI
            label="Matters worked"
            value={personalReport.summary.matters.length.toString()}
            sub={`${personalReport.summary.matters.filter((m) => m.closed).length} closed`}
          />
          <KPI
            label="Bar threshold"
            value={
              personalReport.summary.threshold > 0
                ? `${personalReport.summary.threshold} hr`
                : "—"
            }
            sub={
              personalReport.summary.threshold > 0
                ? personalReport.summary.meetsThreshold
                  ? "Met"
                  : "Below"
                : "Voluntary"
            }
            status={
              personalReport.summary.threshold > 0
                ? personalReport.summary.meetsThreshold
                  ? "good"
                  : "warn"
                : undefined
            }
          />
          <KPI
            label="Categories"
            value={personalReport.summary.byCategory.length.toString()}
            sub="distinct types of work"
          />
        </div>
      )}

      {mode === "firm" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
          <KPI label="Total hours" value={firmRollup.totalHours.toFixed(1)} sub={`firm-wide in ${firmRollup.jurisdictionName}`} />
          <KPI label="Reporting attorneys" value={firmRollup.rows.length.toString()} sub="logged hours this year" />
          <KPI label="Unique matters" value={firmRollup.totalMatters.toString()} sub="distinct cases worked" />
          <KPI
            label="Threshold"
            value={`${firmRollup.meetsThresholdCount} / ${firmRollup.rows.length}`}
            sub="attorneys meeting threshold"
            status={
              firmRollup.meetsThresholdCount === firmRollup.rows.length
                ? "good"
                : firmRollup.meetsThresholdCount > 0
                ? "warn"
                : undefined
            }
          />
        </div>
      )}

      {/* Body: report on right, recent activity on left */}
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
        <div>
          <h2 className="collegium-display text-lg mb-3">
            {mode === "personal" ? "Recent activity" : "Per-attorney totals"}
          </h2>

          {mode === "personal" && (
            <div className="collegium-card p-4 sm:p-5">
              {recentEntries.length === 0 ? (
                <p className="text-sm text-[hsl(var(--c-slate-soft))] italic">
                  No hours logged yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {recentEntries.map((e) => (
                    <div
                      key={e.id}
                      className="flex items-start gap-3 py-1.5 border-b last:border-0 border-[hsl(var(--c-border))]"
                    >
                      <div className="text-[11px] text-[hsl(var(--c-slate-soft))] font-mono shrink-0 w-16 pt-0.5">
                        {formatShortDate(e.date)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-[hsl(var(--c-ink))] leading-snug">
                          {ACTIVITY_LABEL[e.activity]}
                          <span className="text-[hsl(var(--c-wine))] font-medium ml-1.5">
                            · {e.hours.toFixed(2)} hr
                          </span>
                        </div>
                        <div className="text-[11px] text-[hsl(var(--c-slate-soft))] truncate">
                          {e.description ?? matterGoal(e.matterId)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {mode === "firm" && (
            <div className="collegium-card p-4 sm:p-5">
              {firmRollup.rows.length === 0 ? (
                <p className="text-sm text-[hsl(var(--c-slate-soft))] italic">
                  No attorneys reporting in {firmRollup.jurisdictionName} for {firmRollup.reportingYear}.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {firmRollup.rows.map((r) => (
                    <div
                      key={r.attorneyId}
                      className="flex items-center gap-3 py-1.5 border-b last:border-0 border-[hsl(var(--c-border))]"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-[hsl(var(--c-ink))] font-medium truncate">
                          {r.attorneyName}
                        </div>
                        <div className="text-[11px] text-[hsl(var(--c-slate-soft))]">
                          {r.barNumber ?? "—"} · {r.matterCount} matter{r.matterCount === 1 ? "" : "s"}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm text-[hsl(var(--c-wine))] font-semibold tabular-nums">
                          {r.totalHours.toFixed(1)} hr
                        </div>
                        <div className="text-[10px] uppercase tracking-widest font-semibold text-[hsl(var(--c-slate-soft))]">
                          {r.meetsThreshold ? (
                            <span className="text-[hsl(145_40%_28%)]">Met</span>
                          ) : r.threshold > 0 ? (
                            <span className="text-[hsl(38_55%_28%)]">Below</span>
                          ) : (
                            <span>Voluntary</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bar export */}
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-3">
            <h2 className="collegium-display text-lg flex items-center gap-1.5">
              <FileText size={14} className="text-[hsl(var(--c-wine))]" />
              Bar-format export
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!reportText}
                className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!reportText}
                className="collegium-btn-primary text-xs inline-flex items-center gap-1.5"
              >
                <Download size={12} /> Download
              </button>
            </div>
          </div>
          <pre className="text-[11px] sm:text-xs text-[hsl(var(--c-slate))] leading-relaxed whitespace-pre-wrap font-mono bg-white border border-[hsl(var(--c-border))] rounded p-4 overflow-x-auto max-h-[70vh] overflow-y-auto">
            {reportText || "Select an attorney to generate the report."}
          </pre>
          <p className="text-[11px] text-[hsl(var(--c-slate-soft))] mt-3 leading-relaxed">
            Generated locally in this browser. Print, attach to your state's
            form, or paste into bar-portal submission flow. PDF rendering
            queued for a follow-up session.
          </p>
        </div>
      </div>

      <section className="text-xs text-[hsl(var(--c-slate-soft))] leading-relaxed border-t border-[hsl(var(--c-border))] pt-5 mt-8 collegium-safe-bottom">
        <strong className="text-[hsl(var(--c-wine))]">Eight jurisdictions supported:</strong>{" "}
        NY (mandatory 50-hour bar admission affidavit), MA (Rule 6.1 25-hour),
        CA (§ 6073 50-hour aspirational), NJ (Madden equivalency), IL, MD, FL,
        TX. Each renders the state's specific format. More jurisdictions
        land per-tenant request.
      </section>
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm px-3 py-1.5 rounded border inline-flex items-center gap-1.5 transition-colors ${
        active
          ? "bg-[hsl(var(--c-wine))] text-[hsl(var(--c-cream))] border-[hsl(var(--c-wine))]"
          : "bg-white border-[hsl(var(--c-border))] text-[hsl(var(--c-slate))] hover:border-[hsl(var(--c-wine))]"
      }`}
    >
      {children}
    </button>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] block mb-1">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm py-1.5 px-2.5 rounded border border-[hsl(var(--c-border))] bg-white text-[hsl(var(--c-ink))] focus:outline-none focus:border-[hsl(var(--c-wine))]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function KPI({
  label,
  value,
  sub,
  status,
}: {
  label: string;
  value: string;
  sub: string;
  status?: "good" | "warn";
}) {
  const statusColor =
    status === "good"
      ? "text-[hsl(145_40%_28%)]"
      : status === "warn"
      ? "text-[hsl(38_55%_28%)]"
      : "text-[hsl(var(--c-slate-soft))]";
  return (
    <div className="collegium-card p-4">
      <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1">
        {label}
      </div>
      <div className="collegium-display text-3xl text-[hsl(var(--c-ink))] leading-none">
        {value}
      </div>
      <div className={`text-[11px] mt-1 ${statusColor}`}>{sub}</div>
    </div>
  );
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
