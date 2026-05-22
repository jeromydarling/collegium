import { Link } from "react-router-dom";
import {
  Users,
  Compass,
  Scale,
  Library,
  TrendingUp,
  Activity,
  ArrowRight,
} from "lucide-react";
import { moduleOrder } from "../brand";

const moduleIcons: Record<string, typeof Users> = {
  chapters: Users,
  mentorship: Compass,
  service: Scale,
  formation: Library,
  advancement: TrendingUp,
  nri: Activity,
};

const detail: Record<string, { headline: string; body: string[]; example: string }> = {
  chapters: {
    headline: "Hold the recurring life of the guild.",
    body: [
      "Chapter and affiliate management for St. Thomas More societies, Catholic Bar diocesan affiliates, Christian Legal Society chapters, and student guilds.",
      "Members, officers, hospitality, events, attendance, and the quiet work of officer handoff. Each chapter keeps its own data and its own decisions.",
      "Health pulse scores across four indices — hospitality, formation, service, and succession — so the steward knows what is thriving and what needs attention.",
    ],
    example:
      "St. Thomas More Society of Boston runs monthly luncheons at the Boston Athenæum and an annual Red Mass at the Cathedral of the Holy Cross. 184 members. Officer terms rotate in May; succession is the weakest index this quarter.",
  },
  mentorship: {
    headline: "Pair students with senior practitioners, then accompany the relationship.",
    body: [
      "Mentor and mentee profiles with matching preferences. Cadence options for weekly, biweekly, or monthly check-ins. Reflection prompts drawn from the formation library.",
      "NRI surfaces the silences. Two missed meetings during bar-exam season are different from two missed meetings in October — and the steward gets that nuance, not a generic alert.",
      "Mentors are not asked to log everything. They are asked to be present. The platform reads the small signals around the relationship and prepares the next conversation.",
    ],
    example:
      "Prof. Hartmann (CUA) and Maria Velasquez (3L) have been a two-year pair. Two missed meetings in April; bar-prep underway. NRI suggests a one-line note from the local steward — not the mentor — leaving the relationship intact.",
  },
  service: {
    headline: "Route legal aid, pro bono, and parish-governance referrals.",
    body: [
      "Intake board for service requests with categories for immigration, family, housing, parish governance, canon-law overlap, indigent defense, and religious liberty.",
      "Volunteer rosters with practice tags. Canon-law-credentialed members are surfaced when a parish-governance question comes in.",
      "Follow-up queue with gentle reminders for matters left unclaimed. The unrepresented stay visible.",
    ],
    example:
      "Three parish-governance referrals in 60 days through the Chicago guild. NRI suggests inviting a canon-law-tagged volunteer; Msgr. Lally identifies a chancery canonist who can take routine parish matters.",
  },
  formation: {
    headline: "A library and rhythm for legal vocation.",
    body: [
      "Curated public-domain corpus: Aquinas's Treatise on Law and Treatise on Justice, Augustine's City of God, the foundational Catholic Social Teaching encyclicals, Blackstone, Newman, Burke, Roman law primers.",
      "Formation tracks — multi-week reading and discussion sequences — for students, young lawyers, canon lawyers, and chapter leaders.",
      "Daily Office: a ten-minute reading, reflection, prayer, and prompt, rotated by weekday theme. Suitable for personal use, for mentor-pair openings, or for chapter meetings.",
    ],
    example:
      "Patrick Owens (2L, CUA) is leading the JP II Guild reading group through ST I-II, q. 96 next month. The discussion guide is built; the chapter assigns the readings; mentors get a parallel set of pair prompts.",
  },
  advancement: {
    headline: "Events, formation days, and the leadership pipeline.",
    body: [
      "Conferences, Red Masses, formation days, CLE-quality gatherings. Registration, attendance, speaker records.",
      "Leadership pipeline: emerging chapter officers, mentor candidates, future spiritual advisors. Identified by NRI from across the modules.",
      "Affiliate growth dashboard for national stewards — chapter membership, formation engagement, service capacity, succession risk by region.",
    ],
    example:
      "Arlington CBA affiliate runs an Annual Formation Day on the Treatise on Law each September. 41 RSVPs so far; capacity 120. Prof. Hartmann and Fr. Cale are the named speakers.",
  },
  nri: {
    headline: "Narrative Relational Intelligence — patent pending.",
    body: [
      "NRI is the interpretive layer that synthesizes events, notes, and silences across the modules into the question a steward should actually be asking.",
      "Person briefings. Chapter briefings. Mentor-pair briefings. Network briefings. Each one a paragraph the steward can act on, not a dashboard they have to interpret.",
      "Outputs are short, named, and reviewable. NRI suggests; the human discerns. The platform makes the steward better at their work — it does not replace them.",
    ],
    example:
      "Toronto CLF: hospitality scores down nine points since the chair began maternity leave. Vice chair carrying double load; student coordinator in exams. NRI suggests identifying two senior members to host the next two roundtables — a humane-capacity intervention, not a competence one.",
  },
};

export function Modules() {
  return (
    <div className="collegium-theme">
      <section className="collegium-illuminated border-b border-[hsl(var(--c-border))]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="collegium-latin text-sm mb-2">Sex officia · Six functions</div>
          <h1 className="collegium-display-xl text-4xl sm:text-5xl mb-5 sm:mb-6">
            One platform. One common life. Six ways in.
          </h1>
          <p className="text-lg sm:text-xl text-[hsl(var(--c-slate))] leading-relaxed">
            Each module is a window onto the same community. A student moves
            through all six over time — newcomer, mentee, member, mentor,
            officer, steward.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-12 sm:space-y-16">
          {moduleOrder.map((m, idx) => {
            const Icon = moduleIcons[m.slug] ?? Users;
            const d = detail[m.slug];
            return (
              <article
                key={m.slug}
                className="grid md:grid-cols-[7rem_1fr] gap-6 md:gap-8 items-start border-b border-[hsl(var(--c-border))] pb-12 sm:pb-16 last:border-0"
              >
                <div className="flex items-center md:block gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[hsl(var(--c-wine)/0.08)] flex items-center justify-center text-[hsl(var(--c-wine))] md:mb-3 shrink-0">
                    <Icon size={26} />
                  </div>
                  <div className="collegium-display text-xl sm:text-2xl text-[hsl(var(--c-gold))]">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                </div>
                <div>
                  <div className="collegium-latin text-sm mb-1">{m.latin}</div>
                  <h2 className="collegium-display text-3xl sm:text-4xl mb-3 sm:mb-4">{m.label}</h2>
                  <p className="text-lg sm:text-xl text-[hsl(var(--c-slate))] mb-5 sm:mb-6 leading-snug">
                    {d.headline}
                  </p>
                  <div className="space-y-3 mb-5 sm:mb-6">
                    {d.body.map((p, i) => (
                      <p key={i} className="text-[hsl(var(--c-slate))] leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                  <div className="collegium-card-warm p-4 sm:p-5">
                    <div className="collegium-latin text-xs mb-2 text-[hsl(var(--c-wine))]">
                      In the demo
                    </div>
                    <p className="text-sm text-[hsl(var(--c-slate))] leading-relaxed">
                      {d.example}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[hsl(var(--c-cream-warm))]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <h3 className="collegium-display text-2xl sm:text-3xl mb-4">
            Walk through it
          </h3>
          <p className="text-[hsl(var(--c-slate-soft))] mb-6 sm:mb-8">
            The demo is fully functional with illustrative seed data across all
            six modules. Pick a role and enter.
          </p>
          <Link to="/demo" className="collegium-btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto max-w-xs mx-auto">
            Enter the demo <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
