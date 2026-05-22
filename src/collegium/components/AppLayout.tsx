import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { useDemoState, roleLabel } from "../lib/demoStore";

const items = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/chapters", label: "Chapters", icon: Users },
  { to: "/app/mentorship", label: "Mentorship", icon: Compass },
  { to: "/app/service", label: "Service", icon: Scale },
  { to: "/app/formation", label: "Formation", icon: Library },
  { to: "/app/advancement", label: "Advancement", icon: TrendingUp },
  { to: "/app/pulse", label: "NRI Pulse", icon: Activity },
  { to: "/app/office", label: "Daily Office", icon: Sun },
  { to: "/app/calendar", label: "Calendar", icon: CalendarDays },
];

export function AppLayout() {
  const state = useDemoState();
  const location = useLocation();

  return (
    <div className="collegium-theme min-h-screen flex">
      <aside className="w-64 shrink-0 bg-[hsl(220_30%_12%)] text-[hsl(40_30%_92%)] flex flex-col">
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
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 bg-[hsl(354_55%_26%)] text-[hsl(40_35%_94%)] flex items-center justify-center text-xs font-medium tracking-wide">
          You are exploring the Collegium demo · all data is illustrative · nothing you do is saved beyond your browser
        </div>
        <main className="flex-1 overflow-y-auto bg-[hsl(var(--c-cream))]" key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
