import { cstPrinciples } from "../content/cst";
import { aquinasQuotes } from "../content/aquinas";

export function Manifesto() {
  return (
    <div className="collegium-theme">
      <section className="collegium-illuminated border-b border-[hsl(var(--c-border))]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="collegium-latin text-sm mb-2">Manifestum</div>
          <h1 className="collegium-display-xl text-4xl sm:text-5xl mb-5 sm:mb-6">
            Law as a calling, not a market.
          </h1>
          <p className="text-lg sm:text-xl text-[hsl(var(--c-slate))] leading-relaxed">
            Collegium begins from a conviction that the practice of law is, at its
            best, a vocation ordered to the common good — and that the
            communities which have sustained that conviction for a thousand years
            deserve software that takes them seriously.
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-[hsl(var(--c-border))]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 collegium-prose">
          <p>
            Thomas Aquinas, writing in the thirteenth century, defined law as{" "}
            <em>an ordinance of reason for the common good, made by him who has
            care of the community, and promulgated</em>. Four marks: reason, the
            common good, competent authority, and public promulgation. Anything
            that fails one of those tests, he wrote elsewhere, is{" "}
            <em>not a law but a perversion of law</em>.
          </p>
          <p>
            That definition — calmly handed down from the Treatise on Law, ST I-II,
            qq. 90–108 — has shaped every Western legal tradition that came after
            it. It has also shaped how Christian and Catholic lawyers understand
            their own work: not as the manipulation of rules, but as the patient
            shaping of a community toward its real good.
          </p>
          <hr className="collegium-gold-rule" />
          <h2 className="collegium-display text-2xl sm:text-3xl">What Collegium is for</h2>
          <p>
            Christian and Catholic legal communities already exist in considerable
            number. The Catholic Bar Association lists dozens of diocesan and
            metropolitan affiliates. The Christian Legal Society has attorney
            chapters and law-student ministries across the country. St. Thomas
            More societies and local guilds run Red Masses, monthly luncheons,
            mentor-match programs, and quiet pro bono networks. Christian Legal
            Fellowship plays a parallel role in Canada.
          </p>
          <p>
            Most of this work runs on email, spreadsheets, and the memory of
            whoever is currently chapter president. Mentor pairs are tracked on
            sticky notes. Service referrals are routed through hallway
            conversations. When the president rotates out, the institutional
            memory leaves with them.
          </p>
          <p>
            Collegium is the platform we wished existed for these communities. One
            shared system for chapters, mentorship, service, formation, and
            stewardship — with a Narrative Relational Intelligence layer that helps
            the steward notice what the spreadsheet was never going to surface.
          </p>
          <hr className="collegium-gold-rule" />
          <h2 className="collegium-display text-2xl sm:text-3xl">The principles that shaped the product</h2>
          <p>
            Catholic Social Teaching is not decorative here. It is the architecture.
            Seven principles, each load-bearing.
          </p>
        </div>
      </section>

      <section className="bg-[hsl(var(--c-cream-warm))] border-b border-[hsl(var(--c-border))]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8 sm:space-y-10">
          {cstPrinciples.map((p, i) => (
            <article key={p.key} className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[3rem_1fr] gap-4 sm:gap-5">
              <div className="collegium-display text-2xl sm:text-3xl text-[hsl(var(--c-gold))]">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="collegium-latin text-sm mb-1">{p.latin}</div>
                <h3 className="collegium-display text-xl sm:text-2xl mb-3 leading-tight">{p.title}</h3>
                <p className="text-[hsl(var(--c-slate))] leading-relaxed mb-3">{p.summary}</p>
                <p className="text-sm text-[hsl(var(--c-slate-soft))] italic mb-2">
                  {p.for_lawyers}
                </p>
                <p className="text-xs text-[hsl(var(--c-slate-soft))]">{p.citation}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white border-b border-[hsl(var(--c-border))]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 collegium-prose">
          <h2 className="collegium-display text-2xl sm:text-3xl">A guild, not a network</h2>
          <p>
            The word <em>collegium</em> in canon law denotes a collection of
            persons united for a common object — older, more particular, and more
            ordered than the modern English word "network." It implies offices,
            obligations, a shared rule of life, and the possibility of a meal at
            the end of a long week.
          </p>
          <p>
            We chose the name because the actual communities we serve already
            understand themselves this way. They are not "networks" of
            transactional members; they are guilds of people who share a calling.
            The platform should reflect that, in language and in design.
          </p>
          <h2 className="collegium-display text-2xl sm:text-3xl">An ecumenical product with Catholic depth</h2>
          <p>
            Most of what we are building works just as well for a Christian Legal
            Society chapter as for a Catholic guild. The shared Christian year,
            the natural-law tradition, the public-domain library of legal and
            civic writing — these are common inheritance. A Protestant 2L and a
            Catholic 3L can sit in the same reading group on Aquinas's Treatise
            on Law without anyone being asked to convert.
          </p>
          <p>
            At the same time, Catholic depth is real and we honor it. Canon
            lawyers have a first-class place. The Red Mass calendar is built in.
            Saint days for lawyers — Thomas More, Yves of Brittany, Raymond of
            Penyafort — appear in the rhythm. None of it is required. All of it
            is available.
          </p>
          <h2 className="collegium-display text-2xl sm:text-3xl">What we will not do</h2>
          <ul>
            <li>We will not turn members into rows in a sales pipeline.</li>
            <li>
              We will not weaponize attention. There is no engagement-maximizing
              feed; there is no notification optimization.
            </li>
            <li>
              We will not centralize what should be local. Chapters keep their
              own data and their own decisions; the national steward sees only
              what they are entitled to see.
            </li>
            <li>
              We will not pretend NRI is omniscient. It surfaces signals; the
              steward discerns.
            </li>
          </ul>
          <hr className="collegium-gold-rule" />
          <blockquote className="collegium-quote my-8">
            "Justice removed, then, what are kingdoms but great robberies?"
            <footer className="text-sm text-[hsl(var(--c-slate-soft))] mt-2 font-sans not-italic">
              Augustine, City of God, Book IV, ch. 4
            </footer>
          </blockquote>
          <p>
            The corollary, which we believe and which shapes everything below the
            surface of this product: a profession deprived of justice is not a
            profession at all. The guild exists, in part, so the profession does
            not lose what it should not lose.
          </p>
          <p className="collegium-latin text-xl text-[hsl(var(--c-wine))] text-center mt-12">
            Lex caritas est.
          </p>
        </div>
      </section>
    </div>
  );
}
