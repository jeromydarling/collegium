import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { CollegiumLogo } from "./Logo";
import { brand } from "../brand";
import { Menu, X } from "lucide-react";

const nav = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/modules", label: "Modules" },
  { to: "/formation", label: "Formation" },
  { to: "/manifesto", label: "Manifesto" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export function PublicLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="collegium-theme min-h-screen flex flex-col">
      <ScrollToTopOnRouteChange />
      <header className="sticky top-0 z-40 bg-[hsl(40_35%_96%/0.92)] backdrop-blur border-b border-[hsl(var(--c-border))] collegium-safe-top">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <CollegiumLogo size={36} className="shrink-0" />
            <div className="flex flex-col leading-none min-w-0">
              <span className="collegium-display text-lg sm:text-xl text-[hsl(var(--c-ink))] truncate">
                {brand.appName}
              </span>
              <span className="collegium-latin text-[10px] sm:text-[11px] text-[hsl(var(--c-wine))] truncate">
                A guild for legal vocation
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `collegium-nav-link ${isActive ? "active" : ""}`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Link to="/demo" className="collegium-btn-primary text-sm">
              Try the demo
            </Link>
          </nav>

          <button
            className="md:hidden -mr-2 w-12 h-12 inline-flex items-center justify-center text-[hsl(var(--c-wine))] rounded-md hover:bg-[hsl(var(--c-wine)/0.05)]"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-[hsl(var(--c-border))] bg-[hsl(var(--c-cream))] collegium-safe-bottom">
            <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `collegium-nav-link py-3 px-1 border-b border-[hsl(var(--c-border)/0.6)] last:border-0 text-base ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              <Link
                to="/demo"
                onClick={() => setOpen(false)}
                className="collegium-btn-primary text-sm mt-3 mb-2 w-full"
              >
                Try the demo
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[hsl(var(--c-border))] bg-[hsl(var(--c-cream-warm))] collegium-safe-bottom">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            <div className="sm:col-span-2 md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <CollegiumLogo size={28} />
                <span className="collegium-display text-lg">{brand.appName}</span>
              </div>
              <p className="text-sm text-[hsl(var(--c-slate-soft))] max-w-md leading-relaxed">
                {brand.attribution}
              </p>
              <p className="collegium-latin text-sm mt-3">{brand.motto}</p>
            </div>
            <div>
              <div className="font-semibold text-sm mb-3 ui-sans text-[hsl(var(--c-ink))]">
                Platform
              </div>
              <ul className="space-y-2 text-sm">
                <li><Link to="/modules" className="collegium-link">Modules</Link></li>
                <li><Link to="/formation" className="collegium-link">Formation</Link></li>
                <li><Link to="/pricing" className="collegium-link">Pricing</Link></li>
                <li><Link to="/demo" className="collegium-link">Demo</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-sm mb-3 ui-sans text-[hsl(var(--c-ink))]">
                Tradition
              </div>
              <ul className="space-y-2 text-sm">
                <li><Link to="/manifesto" className="collegium-link">Manifesto</Link></li>
                <li><Link to="/about" className="collegium-link">About</Link></li>
                <li><Link to="/contact" className="collegium-link">Contact</Link></li>
              </ul>
            </div>
          </div>
          <hr className="collegium-gold-rule mt-10" />
          <p className="text-xs text-[hsl(var(--c-slate-soft))] text-center leading-relaxed px-2">
            © {new Date().getFullYear()} Collegium. Built with reverence for those who practice law as a calling.
          </p>
        </div>
      </footer>
    </div>
  );
}
