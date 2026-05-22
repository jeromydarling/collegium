import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Receipt,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  clientPayments,
  feeLadders,
  summarizeRevenue,
  DEFAULT_FPL_BANDS,
  DEFAULT_FLAT_FEES,
  PLATFORM_FEE_PCT,
} from "../data/lowBono";
import { defaultTenant } from "../data/tenants";
import { people, serviceMatters } from "../data/demo";

/**
 * Tenant revenue — the steward's view of low-bono transaction flow.
 *
 * Shows: total routed gross, attorneys' net, Collegium's platform fee
 * (this is what we make), Stripe's fees. Plus the per-transaction log
 * and the live fee-ladder configuration that drove each one.
 */
export function TenantRevenue() {
  const tenant = useMemo(() => defaultTenant(), []);
  const payments = useMemo(
    () => clientPayments.filter((p) => p.tenantId === tenant.id),
    [tenant.id]
  );
  const summary = useMemo(() => summarizeRevenue(payments), [payments]);
  const ladder = feeLadders[tenant.id];

  const avgPlatformFee =
    payments.length > 0 ? summary.platformFees / payments.length : 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-8 max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-[hsl(var(--c-wine))] mb-1">
          <DollarSign size={14} />
          <span className="collegium-latin text-sm">Pretium operis</span>
        </div>
        <h1 className="collegium-display text-3xl sm:text-4xl leading-tight">
          Low-bono revenue
        </h1>
        <p className="text-[hsl(var(--c-slate-soft))] mt-1 max-w-2xl">
          The routed-payment flow for your tenant. Clients above the poverty
          line pay sliding-scale; the money lands in your attorneys'
          accounts. Collegium takes 5% as the platform handshake.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
        <KPI
          icon={<Wallet size={13} />}
          label="Gross routed"
          value={formatUSD(summary.grossRouted)}
          sub={`${summary.transactionCount} transaction${summary.transactionCount === 1 ? "" : "s"}`}
        />
        <KPI
          icon={<TrendingUp size={13} />}
          label="Net to attorneys"
          value={formatUSD(summary.netToAttorneys)}
          sub={`${Math.round((summary.netToAttorneys / Math.max(1, summary.grossRouted)) * 100)}% of gross`}
          status="good"
        />
        <KPI
          icon={<Receipt size={13} />}
          label="Collegium fee"
          value={formatUSD(summary.platformFees)}
          sub={`${Math.round(PLATFORM_FEE_PCT * 100)}% handshake`}
        />
        <KPI
          icon={<Receipt size={13} />}
          label="Stripe fee"
          value={formatUSD(summary.stripeFees)}
          sub="2.9% + 30¢ per txn"
        />
      </div>

      {/* The handshake math */}
      <section className="mb-8 sm:mb-10">
        <div className="bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)] rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-2 text-[hsl(38_60%_70%)] mb-2">
            <DollarSign size={14} />
            <span className="text-[10px] uppercase tracking-widest">
              The handshake math
            </span>
          </div>
          <p className="text-sm text-[hsl(40_25%_85%)] leading-relaxed">
            Every client transaction splits three ways. The attorney gets
            ~{Math.round((summary.netToAttorneys / Math.max(1, summary.grossRouted)) * 100)}% of the gross.
            Stripe takes its standard processing fee. Collegium takes the 5%
            platform fee — which is what funds keeping the lights on. At
            your current volume, that's <strong className="text-[hsl(38_60%_75%)] font-semibold">{formatUSD(avgPlatformFee)} average per transaction</strong>{" "}
            to the platform.
          </p>
        </div>
      </section>

      {/* Transactions */}
      <section className="mb-8 sm:mb-10">
        <h2 className="collegium-display text-xl sm:text-2xl mb-3 leading-tight">
          Recent transactions
        </h2>
        {payments.length === 0 ? (
          <div className="collegium-card p-8 text-center text-sm text-[hsl(var(--c-slate-soft))]">
            No transactions yet — your ladder is configured but no client
            payments have routed through.
          </div>
        ) : (
          <div className="collegium-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[hsl(var(--c-cream-warm))] text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))]">
                <tr>
                  <th className="text-left py-2.5 px-4 font-semibold">Date</th>
                  <th className="text-left py-2.5 px-4 font-semibold">Description</th>
                  <th className="text-left py-2.5 px-4 font-semibold">Attorney</th>
                  <th className="text-right py-2.5 px-4 font-semibold">Gross</th>
                  <th className="text-right py-2.5 px-4 font-semibold">Fee</th>
                  <th className="text-right py-2.5 px-4 font-semibold">Net</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => {
                  const att = people.find((x) => x.id === p.attorneyId);
                  return (
                    <tr
                      key={p.id}
                      className={
                        i % 2 === 0 ? "" : "bg-[hsl(var(--c-cream))]"
                      }
                    >
                      <td className="py-2.5 px-4 text-xs text-[hsl(var(--c-slate-soft))] whitespace-nowrap">
                        {formatShortDate(p.paidOn)}
                      </td>
                      <td className="py-2.5 px-4 text-[hsl(var(--c-ink))]">
                        <div className="truncate max-w-md">{p.description}</div>
                        <div className="text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))]">
                          {p.ladderSnapshot} · {p.fplPct}% FPL
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-xs">
                        {att?.name ?? p.attorneyId}
                      </td>
                      <td className="py-2.5 px-4 text-right tabular-nums">
                        {formatUSD(p.grossAmount)}
                      </td>
                      <td className="py-2.5 px-4 text-right tabular-nums text-[hsl(var(--c-wine))]">
                        {formatUSD(p.platformFee)}
                      </td>
                      <td className="py-2.5 px-4 text-right tabular-nums text-[hsl(145_40%_28%)] font-semibold">
                        {formatUSD(p.netToAttorney)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Fee ladder configuration */}
      <section className="mb-8 sm:mb-10">
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <div>
            <h2 className="collegium-display text-xl sm:text-2xl leading-tight">
              Your fee ladder
            </h2>
            <p className="text-xs text-[hsl(var(--c-slate-soft))] mt-0.5">
              {ladder?.enabled
                ? "Enabled · evaluated at intake"
                : "Disabled · pure pro bono only"}
            </p>
          </div>
          <button
            type="button"
            className="collegium-btn-ghost text-xs inline-flex items-center gap-1.5"
          >
            <SettingsIcon size={11} /> Edit ladder
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="collegium-card p-5">
            <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-wine))] mb-3 font-semibold">
              By FPL band (hourly)
            </div>
            <table className="w-full text-sm">
              <tbody>
                {(ladder?.fplBands ?? DEFAULT_FPL_BANDS).map((b, i) => (
                  <tr
                    key={i}
                    className="border-b last:border-0 border-[hsl(var(--c-border))]"
                  >
                    <td className="py-2 text-[hsl(var(--c-slate))]">
                      {b.fplLowerPct}–{b.fplUpperPct ?? "∞"}% FPL
                    </td>
                    <td className="py-2 text-right text-[hsl(var(--c-ink))] font-medium tabular-nums">
                      {b.hourlyRate === 0 ? "Pro bono" : `$${b.hourlyRate}/hr`}
                    </td>
                    <td className="py-2 text-right text-xs text-[hsl(var(--c-slate-soft))] tabular-nums">
                      {b.perMatterCap ? `cap $${b.perMatterCap}` : "no cap"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="collegium-card p-5">
            <div className="text-xs uppercase tracking-widest text-[hsl(var(--c-wine))] mb-3 font-semibold">
              By matter (flat fee)
            </div>
            <table className="w-full text-sm">
              <tbody>
                {(ladder?.flatFees ?? DEFAULT_FLAT_FEES).map((f) => (
                  <tr
                    key={f.category}
                    className="border-b last:border-0 border-[hsl(var(--c-border))]"
                  >
                    <td className="py-2 text-[hsl(var(--c-slate))] capitalize">
                      {f.category.replace(/-/g, " ")}
                    </td>
                    <td className="py-2 text-right text-[hsl(var(--c-ink))] font-medium tabular-nums">
                      ${f.flatFee}
                    </td>
                    <td className="py-2 text-right text-xs text-[hsl(var(--c-slate-soft))]">
                      ≤{f.fplCeilingPct}% FPL
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="text-xs text-[hsl(var(--c-slate-soft))] leading-relaxed border-t border-[hsl(var(--c-border))] pt-5 mt-8 collegium-safe-bottom">
        <p>
          Stripe Connect wires up in the next session — same plug-in pattern
          as the Claude integration. Attorneys onboard as Connect Express
          accounts; payments flow direct to them; we collect the platform
          fee on each transaction.{" "}
          <Link to="/app/hours" className="collegium-link">
            Hours dashboard <ChevronRight size={10} className="inline" />
          </Link>
        </p>
      </section>
    </div>
  );
}

function KPI({
  icon,
  label,
  value,
  sub,
  status,
}: {
  icon: React.ReactNode;
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
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] mb-1">
        {icon} {label}
      </div>
      <div className="collegium-display text-2xl sm:text-3xl text-[hsl(var(--c-ink))] leading-none tabular-nums">
        {value}
      </div>
      <div className={`text-[11px] mt-1 ${statusColor}`}>{sub}</div>
    </div>
  );
}

function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount < 100 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
