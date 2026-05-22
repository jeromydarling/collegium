import { Mail, Github } from "lucide-react";

export function Contact() {
  return (
    <div className="collegium-theme">
      <section className="collegium-illuminated border-b border-[hsl(var(--c-border))]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <div className="collegium-latin text-sm mb-2">Salutatio</div>
          <h1 className="collegium-display-xl text-4xl sm:text-5xl mb-5 sm:mb-6">Get in touch</h1>
          <p className="text-lg sm:text-xl text-[hsl(var(--c-slate))] leading-relaxed">
            We are looking for pilot partners. If you steward a chapter, guild,
            or clinic that resonates with what we are building, write to us.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="grid sm:grid-cols-2 gap-5">
            <a
              href="mailto:hello@collegium.app"
              className="collegium-card p-6 hover:shadow-md transition-shadow block"
            >
              <Mail className="text-[hsl(var(--c-wine))] mb-3" size={22} />
              <h3 className="collegium-display text-xl mb-1">Write to us</h3>
              <p className="text-sm text-[hsl(var(--c-slate-soft))]">
                hello@collegium.app
              </p>
            </a>
            <a
              href="https://github.com/jeromydarling/collegium"
              target="_blank"
              rel="noopener"
              className="collegium-card p-6 hover:shadow-md transition-shadow block"
            >
              <Github className="text-[hsl(var(--c-wine))] mb-3" size={22} />
              <h3 className="collegium-display text-xl mb-1">Source</h3>
              <p className="text-sm text-[hsl(var(--c-slate-soft))]">
                github.com/jeromydarling/collegium
              </p>
            </a>
          </div>

          <hr className="collegium-gold-rule my-12" />

          <div className="collegium-prose">
            <h2 className="collegium-display text-xl sm:text-2xl">
              What helps us most in a first conversation
            </h2>
            <ul>
              <li>
                <strong>Who you serve.</strong> A St. Thomas More society of 200
                attorneys is a different conversation from a 1L fellowship of 35
                students. Both are welcome; the framing helps us listen.
              </li>
              <li>
                <strong>What is breaking.</strong> Officer turnover, mentor
                drift, parish-governance referrals piling up, formation that
                doesn't stick — name the friction. We don't need a polished
                problem statement.
              </li>
              <li>
                <strong>What you've already tried.</strong> Many guilds have
                tried email lists, group chats, Google Workspaces, and
                association-management platforms. Knowing what didn't fit is at
                least as useful as knowing what you want.
              </li>
              <li>
                <strong>Your tradition.</strong> Catholic, Protestant, Orthodox,
                ecumenical — all real, and the right tone of the platform
                depends on getting that right.
              </li>
            </ul>
            <p>
              We will write back. Probably not the same day. Likely the same
              week.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
