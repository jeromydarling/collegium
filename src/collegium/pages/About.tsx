export function About() {
  return (
    <div className="collegium-theme">
      <section className="collegium-illuminated border-b border-[hsl(var(--c-border))]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="collegium-latin text-sm mb-2">De nobis</div>
          <h1 className="collegium-display-xl text-4xl sm:text-5xl mb-5 sm:mb-6">About Collegium</h1>
          <p className="text-lg sm:text-xl text-[hsl(var(--c-slate))] leading-relaxed">
            Software for Christian and Catholic legal communities, built with
            reverence for what those communities already are.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 collegium-prose">
          <h2 className="collegium-display text-2xl sm:text-3xl">Who we are</h2>
          <p>
            Collegium is part of a small federation of mission-driven platforms
            built around Narrative Relational Intelligence — a patent-pending
            approach to organizational software that treats relationships, not
            transactions, as the primary unit of value.
          </p>
          <p>
            We don't build for the lawyer in isolation. We build for the
            <em> chapter president</em> wondering who hasn't shown up in three
            months. The <em>mentor</em> looking for the right word to send a
            silent mentee. The <em>diocesan canonist</em> trying to keep parish
            governance referrals from falling off the edge of a spreadsheet.
            The <em>1L</em> wondering if there is anyone in the building who
            understands what they are weighing.
          </p>
          <h2 className="collegium-display text-2xl sm:text-3xl">Why now</h2>
          <p>
            The Catholic Bar Association formed in 2015 because more than sixty
            local Catholic lawyer groups already existed without a unifying
            national body. The Christian Legal Society sustains hundreds of
            attorney chapters and law-student ministries. Faith-based legal aid
            clinics dot the country, often invisible to formal directories.
          </p>
          <p>
            These communities have grown, but the tools that serve them have not.
            Most are running on combinations of email, group chat, spreadsheets,
            and memory. Officer turnover quietly erodes institutional memory
            every two or three years.
          </p>
          <p>
            Collegium is our attempt to give these communities one shared system
            — built by people who believe the work matters and who take Catholic
            Social Teaching, Aquinas, and the natural-law tradition not as
            decoration but as the actual architecture.
          </p>
          <h2 className="collegium-display text-2xl sm:text-3xl">Our voice</h2>
          <p>
            We write in plain English and we cite our sources. When Aquinas
            appears in this product — and he does often — the citation is real
            and verifiable. The Catholic Social Teaching principles you read here
            are quoted from the actual encyclicals, not summarized to suit a
            marketing point.
          </p>
          <p>
            We trust the reader. The lawyer in front of this page is more than
            capable of holding a Latin phrase, a thirteenth-century distinction,
            and a 21st-century product flow in their mind at once. We will not
            condescend.
          </p>
          <h2 className="collegium-display text-2xl sm:text-3xl">Build status</h2>
          <p>
            This site is a live demo. The five modules — Chapters, Mentorship,
            Service, Formation, Advancement — and the NRI Pulse surface are all
            functional with illustrative seed data. Visit{" "}
            <a href="/demo" className="collegium-link">the demo</a> to walk
            through the experience as a chapter president, a mentor, or a
            national steward.
          </p>
          <p>
            We are looking for pilot partners — local guilds, St. Thomas More
            societies, Catholic Bar affiliates, Christian Legal Society chapters,
            and faith-based legal aid programs. If you are stewarding one of
            those communities and the demo resonates,{" "}
            <a href="/contact" className="collegium-link">write to us</a>.
          </p>
          <hr className="collegium-gold-rule" />
          <p className="collegium-latin text-center text-xl text-[hsl(var(--c-wine))]">
            Soli Deo gloria. Soli iustitiae causa.
          </p>
        </div>
      </section>
    </div>
  );
}
