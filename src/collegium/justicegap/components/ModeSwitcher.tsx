import { Link, useLocation } from "react-router-dom";
import { Map, FileText, Mic, Newspaper, Compass } from "lucide-react";

const PILLS = [
  { to: "/justicegap", label: "Map", icon: Map, match: /^\/justicegap\/?(map.*)?$/ },
  { to: "/justicegap/essay", label: "Essay", icon: FileText, match: /^\/justicegap\/essay/ },
  { to: "/justicegap/stories", label: "Stories", icon: Mic, match: /^\/justicegap\/stories/ },
  { to: "/justicegap/news", label: "News", icon: Newspaper, match: /^\/justicegap\/news/ },
  { to: "/justicegap/solution", label: "Solution", icon: Compass, match: /^\/justicegap\/solution/ },
];

export function ModeSwitcher() {
  const { pathname } = useLocation();
  return (
    <nav className="sticky top-0 z-40 bg-[hsl(220_30%_8%)] border-b border-[hsl(220_20%_18%)] collegium-safe-top">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none">
          <Link
            to="/"
            className="text-[10px] uppercase tracking-widest text-[hsl(40_20%_55%)] hover:text-[hsl(38_60%_70%)] shrink-0 px-2"
          >
            ←
          </Link>
          {PILLS.map((p) => {
            const active = p.match.test(pathname);
            return (
              <Link
                key={p.to}
                to={p.to}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  active
                    ? "bg-[hsl(38_60%_60%)] text-[hsl(220_30%_10%)]"
                    : "text-[hsl(40_30%_85%)] hover:bg-[hsl(220_20%_18%)]"
                }`}
              >
                <p.icon size={13} />
                <span>{p.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
