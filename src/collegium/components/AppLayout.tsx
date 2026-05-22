import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { CollegiumLogo } from "./Logo";
import {
  Users,
  Compass,
  Scale,
  Library,
  TrendingUp,
  Activity,
  Sun,
  LayoutDashboard,
  CalendarDays,
  ChevronLeft,
  Menu,
  X,
  Inbox,
  Globe,
  BarChart3,
  MessageCircleQuestion,
  Sparkles,
  Award,
  DollarSign,
  PhoneIncoming,
  Quote,
} from "lucide-react";
import { useDemoState, roleLabel } from "../lib/demoStore";

const items = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/chapters", label: "Chapters", icon: Users },
  { to: "/app/mentorship", label: "Mentorship", icon: Compass },
  { to: "/app/service", label: "Service", icon: Scale },
  { to: "/app/service/inbox", label: "Network Inbox", icon: Inbox },
  { to: "/app/communio", label: "Communio", icon: Globe },
  { to: "/app/formation", label: "Formation", icon: Library },
  { to: "/app/advancement", label: "Advancement", icon: TrendingUp },
  { to: "/app/pulse", label: "NRI Pulse", icon: Activity },
  { to: "/app/hours", label: "Pro Bono Hours", icon: Award },
  { to: "/app/revenue", label: "Low-Bono Revenue", icon: DollarSign },
  { to: "/app/insights", label: "Justice Gap", icon: BarChart3 },
  { to: "/app/practice", label: "Practice Hub", icon: MessageCircleQuestion },
  { to: "/app/intake-triage", label: "Intake Triage", icon: Inbox },
  { to: "/app/voice-intake", label: "Voice Intake", icon: PhoneIncoming },
  { to: "/app/appeals", label: "Appeals", icon: Quote },
  { to: "/app/intake-assist", label: "Intake Assist", icon: Sparkles },
  { to: "/app/office", label: "Daily Office", icon: Sun },
  { to: "/app/calendar", label: "Calendar", icon: CalendarDays },
];

export function AppLayout() {
  const state = useDemoState();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on navigation and scroll the page to the top — page
  // scroll (not an inner container) so the address bar can collapse on iOS.
  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  const sidebar = (
    <>
      <Link to="/" className="flex items-center gap-2.5 px-5 h-16 border-b border-[hsl(220_20%_22%)]">
        <CollegiumLogo size={28} />
        <div className="leading-none">
          <div className="collegium-display text-lg text-[hsl(40_40%_94%)]">Collegium</div>
          <div className="text-[10px] text-[hsl(40_20%_70%)] uppercase tracking-widest">Demo</div>
        </div>
      </Link>

      <div className="px-5 py-4 border-b border-[hsl(220_20%_22%)]">
        <div className="text-[10px] uppercase tracking-widest text-[hsl(40_20%_60%)]">
          Currently as
        </div>
        <div className="text-sm font-medium text-[hsl(40_30%_92%)] mt-1">
          {state.identityName}
        </div>
        <div className="text-xs text-[hsl(40_20%_70%)]">
          {roleLabel[state.role].label}
        </div>
        <Link
          to="/demo"
          className="text-xs text-[hsl(38_60%_70%)] hover:underline mt-2 inline-block"
        >
          Switch role →
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-[hsl(354_40%_28%)] text-[hsl(40_40%_94%)]"
                  : "text-[hsl(40_20%_75%)] hover:text-[hsl(40_40%_94%)] hover:bg-[hsl(220_20%_18%)]"
              }`
            }
          >
            <it.icon size={16} className="shrink-0" />
            <span>{it.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-[hsl(220_20%_22%)]">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs text-[hsl(40_20%_70%)] hover:text-[hsl(40_40%_94%)]"
        >
          <ChevronLeft size={12} /> Back to marketing
        </Link>
      </div>
    </>
  );

  return (
    <div className="collegium-theme min-h-screen md:flex">
      {/* Desktop sidebar — sticky to viewport so it stays visible while the
       * right pane scrolls naturally. */}
      <aside className="hidden md:flex md:sticky md:top-0 md:h-screen w-64 shrink-0 bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)] flex-col">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[hsl(220_30%_12%)] text-[hsl(40_35%_92%)] flex flex-col shadow-2xl collegium-safe-top">
            {sidebar}
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky top group — demo banner + (on mobile) header with hamburger. */}
        <div className="sticky top-0 z-30 collegium-safe-top">
          <div className="bg-[hsl(354_55%_26%)] text-[hsl(40_35%_94%)] px-4 py-2 text-[11px] sm:text-xs font-medium tracking-wide text-center leading-tight">
            <span className="hidden sm:inline">You are exploring the Collegium demo · all data is illustrative · nothing is saved beyond your browser</span>
            <span className="sm:hidden">Collegium demo · illustrative data only</span>
          </div>
          <div className="md:hidden flex items-center justify-between px-2 h-14 border-b border-[hsl(var(--c-border))] bg-[hsl(var(--c-cream))]">
            <button
              onClick={() => setMobileOpen(true)}
              className="w-12 h-12 inline-flex items-center justify-center text-[hsl(var(--c-wine))] rounded-md hover:bg-[hsl(var(--c-wine)/0.05)]"
              aria-label="Open navigation"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <CollegiumLogo size={22} className="shrink-0" />
              <div className="leading-none min-w-0">
                <div className="collegium-display text-base">Collegium</div>
                <div className="text-[9px] uppercase tracking-widest text-[hsl(var(--c-slate-soft))] truncate">
                  {state.identityName}
                </div>
              </div>
            </div>
            <div className="w-12" />
          </div>
        </div>
        <main className="flex-1 bg-[hsl(var(--c-cream))]" key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
