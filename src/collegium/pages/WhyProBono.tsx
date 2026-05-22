import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProBonoCalculator } from "./components/ProBonoCalculator";

/**
 * "Why pro bono?" — the homepage homily for Christian lawyers.
 *
 * Voice: serious homily. Math-first defense, anchored on Luke 10:2.
 * Closing thesis: 5 Auxilium-prepped cases / year, which works out to
 * 15–25 attorney hours total, after Auxilium has done intake. Defended
 * arithmetically and theologically, neither alone.
 *
 * Sources cited at the foot of the article — every claim is anchored.
 */
export function WhyProBono() {
  return (
    <div className="collegium-theme bg-[hsl(40_30%_96%)] min-h-screen">
      <article className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <header className="mb-10 sm:mb-14 text-center">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[hsl(354_55%_28%)] mb-3">
            Collegium · Cur pro bono?
          </p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl text-[hsl(220_30%_14%)] leading-[1.05] mb-6"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
          >
            Why pro bono?
          </h1>
          <p
            className="text-base sm:text-lg text-[hsl(220_25%_30%)] italic max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            "The harvest truly is great, but the labourers are few."
            <br />
            Luke 10:2
          </p>
        </header>

        <Section number="I" title="The harvest and the workers">
          <P>
            When the seventy-two were sent out, our Lord did not begin
            with strategy. He began with arithmetic.{" "}
            <em>
              "The harvest truly is great, but the labourers are few. Pray
              ye therefore the Lord of the harvest, that he would send
              forth labourers into his harvest."
            </em>{" "}
            The image is rural and exact: a field ripe past patience, a
            crop that will be lost if no one bends to it, and a workforce
            too thin for the acreage. The first thing Christ asks of those
            he is about to send is that they pray for more like
            themselves.
          </P>
          <P>
            What strikes is that this is not a complaint about the size
            of the harvest. The harvest is praised: it is great, plenteous,
            ready. The deficiency is not in the world's need; the world's
            need is sufficient and abundant. The deficiency is in the
            workers. The shepherdless multitude of Matthew and the
            seventy-two sent in Luke are the same scene viewed from two
            ends: a people undefended, and the few who must be sent to
            defend them.
          </P>
          <P>
            For the lawyer who hears these words in 2026, the parallel is
            uncomfortably tight. The American legal system admits over
            1.32 million attorneys to practice. The population who cannot
            afford one of them is many multiples of that. The Legal
            Services Corporation has reported, year over year, that{" "}
            <strong>more than ninety percent of the substantial civil
            legal needs of low-income Americans go unmet or under-met.</strong>{" "}
            The harvest is plenteous. The labourers are few.
          </P>
        </Section>

        <Section number="II" title="The arithmetic, on the record.">
          <P>
            The American Bar Association's Model Rule 6.1 says every
            attorney "should aspire" to render fifty hours of pro bono per
            year. If every U.S. lawyer met it, that would be{" "}
            <strong>66 million hours</strong> of free legal work annually —
            roughly enough, at five hours per case, for 13 million matters.
            The unmet civil legal need in America for that same year was
            an order of magnitude larger.
          </P>
          <P>
            The actual numbers: the ABA's 2025 Supporting Justice V report
            found just over half of surveyed attorneys did any pro bono in
            2022; only about <strong>twenty percent</strong> hit the
            fifty-hour aspirational floor. The average lawyer logged 37
            hours. Nearly half logged zero.
          </P>
          <P>
            Meanwhile the demand. Clio's 2024 Legal Trends Report —
            sympathetic to its lawyer audience — measured the average U.S.
            lawyer billing{" "}
            <strong>2.9 hours of an 8-hour day</strong>. That is 37%
            utilization. The other 5.1 hours go to admin, intake, email,
            and meetings.{" "}
            <em>
              Five hours a month of pro bono does not displace billable
              hours. It displaces hours already lost.
            </em>
          </P>
          <P>
            Now the offsets. New York gives one CLE credit for every two
            pro bono hours, capped at ten per cycle. Florida, since
            December 2024, allows one-for-one CLE credit, capped at five.
            Most legal-aid referrals come with the referring nonprofit's
            primary malpractice coverage; a standalone pro-bono-only
            policy runs under five hundred dollars per year. The federal
            Volunteer Protection Act of 1997, plus every state's Good
            Samaritan statute, immunizes ordinary-negligence acts by
            volunteer attorneys for qualified nonprofits. Claims arising
            from pro bono work are described by carriers as "very rare."
          </P>
          <P>
            The financial argument against pro bono dissolves on close
            reading. The argument that remains is about will.
          </P>
        </Section>

        <Section number="III" title="The Hebrew prophets and the lawyer's mouth.">
          <P>
            The scriptural case did not begin in the Gospels. Long before
            there was a profession of law, there was a profession of
            justice, and the prophets handed it down with plainness.
          </P>
          <P>
            Micah pressed the question into the smallest compass:{" "}
            <em>
              "What doth the LORD require of thee, but to do justly, and
              to love mercy, and to walk humbly with thy God?"
            </em>{" "}
            The three verbs are not three options. They are one yoke. The
            lawyer who can offer both — the technical instrument of
            justice in the hand of a heart trained in mercy — is the
            precise instrument Micah is calling for.
          </P>
          <P>
            Isaiah named it as job description:{" "}
            <em>
              "Learn to do well; seek judgment, relieve the oppressed,
              judge the fatherless, plead for the widow."
            </em>{" "}
            The four verbs are courtroom verbs. To plead for the widow is
            to act as her advocate. The profession exists in Scripture
            before it exists in statute.
          </P>
          <P>
            And most directly, the mother of King Lemuel to her son:{" "}
            <em>
              "Open thy mouth for the dumb in the cause of all such as
              are appointed to destruction. Open thy mouth, judge
              righteously, and plead the cause of the poor and needy."
            </em>{" "}
            "Appointed to destruction" is the language of the indigent
            defendant in a capital case, the asylum-seeker before
            deportation, the tenant on the morning of eviction. They have
            a mouth; they have no voice. The lawyer is, in the most
            literal Hebrew sense, the mouth opened for them.
          </P>
        </Section>

        <Section number="IV" title="The Gospels' radicalization.">
          <P>
            The Gospels do not abolish the prophetic tradition. They
            radicalize it.
          </P>
          <P>
            The judgment scene in Matthew 25 does not divide humanity by
            creed or competence but by a single forensic standard:{" "}
            <em>
              "I was in prison, and ye came unto me… Inasmuch as ye have
              done it unto one of the least of these my brethren, ye have
              done it unto me."
            </em>{" "}
            For the lawyer, the prisoner in that catalogue is not a
            metaphor. He is across the table from us at the county jail.
            The judgment scene tells us whom we have actually been
            representing.
          </P>
          <P>
            Paul gave the principle its briefest form:{" "}
            <em>"Bear ye one another's burdens, and so fulfil the law of
            Christ."</em>{" "}
            The "law of Christ," singular, is to carry what another cannot
            carry alone. The pro bono case is the burden the client by
            definition cannot lift.
          </P>
          <P>
            And James, who has no patience for severable faith, names two
            consequences for the household of God. First the call:{" "}
            <em>"Pure religion and undefiled before God and the Father is
            this, To visit the fatherless and widows in their affliction."</em>{" "}
            Then the rebuke that should be pinned over every intake desk:{" "}
            <em>
              "My brethren, have not the faith of our Lord Jesus Christ,
              the Lord of glory, with respect of persons."
            </em>{" "}
            To do good work for the well-paying and lesser work for the
            desperate is, in James's diagnosis, not bad business ethics.
            It is apostasy.
          </P>
        </Section>

        <Section number="V" title="The saints of legal vocation.">
          <P>
            The Church has produced jurists who lived this teaching.
          </P>
          <P>
            <strong>Saint Yves of Brittany</strong> (1253–1303), the
            patron of lawyers, was called in his lifetime{" "}
            <em>advocatus pauperum</em> — advocate of the poor. He required
            of every applicant for his help an oath that the cause was
            just, and then said: <em>Pro Deo te adjuvabo</em> — "for God's
            sake, I will help you."
          </P>
          <P>
            <strong>Saint Raymond of Penyafort</strong> (c. 1175–1275),
            the Dominican who first codified the Decretals and so gave the
            Church its working canon law, was remembered as a man who
            taught law without fee and who joined his learning to the care
            of the poor.
          </P>
          <P>
            <strong>Saint Thomas More</strong> (1478–1535), before he was
            Lord Chancellor of England, was delegated to sit as judge in
            the "poor man's cases" — under-court work most senior lawyers
            refused. As Chancellor he cleared in months a docket that had
            aged a decade, holding open his hall at Chelsea so litigants
            could "more boldly come to his presence."
          </P>
          <P>
            The tradition is not history. Bryan Stevenson founded the
            Equal Justice Initiative on Micah 6:8 and named his memoir,{" "}
            <em>Just Mercy</em>, from the same verse. Mary Ann Glendon
            began her career representing civil-rights workers in
            Mississippi during Freedom Summer. Cardinal Bernardin's
            "consistent ethic of life" forbids us to plead for the unborn
            in the morning and abandon the condemned man in the afternoon:
            it is one garment.
          </P>
        </Section>

        <Section number="VI" title="The realistic ask.">
          <P>
            What follows is the thought experiment, then the ask.
          </P>
          <P>
            There are roughly 1.32 million U.S. lawyers. Pew puts the
            adult U.S. population at 62% Christian. Take a conservative
            third of the profession as practicing Christians — about{" "}
            <strong>396,000 lawyers</strong>. Five cases per year is{" "}
            <strong>nearly two million matters annually</strong>. Plotted
            against LSC's 92% justice-gap rate, that is the difference
            between a problem and a manageable one.
          </P>
          <P>
            Auxilium changes the math. The Pro Bono Institute's signatory
            firms hit 3.71% of billable hours in 2024 — but only by
            sinking enormous administrative cost into intake, conflicts,
            matching, and document collection. Paladin and Pro Bono Net's
            tools exist because the attorney hour is not the bottleneck;
            the intake-and-routing hour is. A typical eviction defense,
            family motion, or debt-collection answer — fully intaked by
            the client through Auxilium with timeline, documents, defenses
            surfaced, and questions written down — is the difference
            between a ten-hour case and a{" "}
            <strong>three-to-five-hour case</strong>. That is the Auxilium
            thesis stated arithmetically.
          </P>
          <P>
            The realistic ask is not the ABA's fifty hours. It is not the
            Christian Legal Society's four hours a month at a card-table
            clinic. It is{" "}
            <strong>
              five Auxilium-prepped cases per year — roughly fifteen to
              twenty-five attorney hours total
            </strong>
            , after the client has done the interview and uploaded the
            documents.
          </P>
          <P>
            Five cases because: the marginal opportunity cost is below the
            utilization gap every lawyer already has; the malpractice
            exposure is covered by the referring organization; the CLE
            credit recoups most of a state cycle; it matches the CLS
            clinic ask scaled by Auxilium's intake-savings factor; and it
            is defensible from a pulpit. Fifty hours was the ABA's
            aspiration in a world without intake software. Five prepared
            cases is the same gift, delivered in the world we actually
            live in.
          </P>
        </Section>

        <ProBonoCalculator />

        <Section number="VII" title="The thread.">
          <P>
            The gifts of the Christian lawyer — the years of training, the
            bar license, the cultivated mind, the standing to be heard in
            a court — are not your own. They are talents in the Gospel
            sense, given on trust, to be returned with increase to the
            master of the harvest.
          </P>
          <P>
            The harvest is the world's need for justice rightly done. The
            workers are those few to whom the instruments of justice have
            actually been entrusted. A profession is not a possession; it
            is a stewardship. To hold the keys to the courthouse and use
            them only for those who can pay the toll is to bury the talent
            in the ground.
          </P>
          <P
            className="italic mt-6"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Pray therefore the Lord of the harvest. And while we pray, let
            us go.
          </P>
        </Section>

        <div className="mt-12 sm:mt-16 pt-8 border-t border-[hsl(220_15%_75%)] flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
          <Link
            to="/auxilium"
            className="inline-flex items-center justify-center gap-2 bg-[hsl(354_55%_26%)] text-white px-5 py-3 rounded-full text-sm font-medium hover:bg-[hsl(354_55%_18%)] transition-colors"
          >
            See what Auxilium does for the client <ArrowRight size={14} />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 border border-[hsl(354_55%_26%)] text-[hsl(354_55%_26%)] px-5 py-3 rounded-full text-sm font-medium hover:bg-[hsl(354_55%_26%/0.04)] transition-colors"
          >
            Take five cases this year
          </Link>
        </div>

        <footer className="mt-14 pt-8 border-t border-[hsl(220_15%_80%)] text-xs text-[hsl(220_15%_45%)] leading-relaxed space-y-2">
          <p className="font-semibold text-[hsl(220_25%_30%)]">Sources</p>
          <p>
            Scripture: King James Version (public domain). Luke 10:1–2,
            Matthew 9:36–38, Micah 6:8, Isaiah 1:17, Proverbs 31:8–9,
            Matthew 25:35–40, Galatians 6:2, James 1:27, James 2:1.
          </p>
          <p>
            Pro bono economics: ABA Model Rule 6.1 (americanbar.org);
            ABA Supporting Justice V (January 2025); ABA National Lawyer
            Population Survey (2024); LSC 2022 Justice Gap Report
            (justicegap.lsc.gov); Clio 2024 Legal Trends Report
            (clio.com); Pro Bono Institute Law Firm Challenge Reports
            (probonoinst.org); New York Courts pro bono CLE rules
            (nycourts.gov); The Florida Bar pro bono CLE (Dec 2024);
            North Carolina Pro Bono Resource Center on malpractice
            coverage; Pro Bono Partnership state liability survey; FindLaw
            on pro bono tax deductions; Pew Religious Landscape Study
            (2023–24).
          </p>
          <p>
            Catholic Social Teaching: Pacem in Terris (1963), Gaudium et
            Spes (1965), Sollicitudo Rei Socialis (1987), Caritas in
            Veritate (2009), Fratelli Tutti (2020), and Pope Francis's
            2014 Address to the International Association of Penal Law,
            all from the Vatican archive.
          </p>
          <p>
            Modern Christian legal thinkers: Joseph Allegretti,{" "}
            <em>The Lawyer's Calling</em> (Paulist Press, 1996); Thomas
            Shaffer, <em>On Being a Christian and a Lawyer</em> (BYU Press,
            1981); Bryan Stevenson, <em>Just Mercy</em> (2014); Cardinal
            Joseph Bernardin, "A Consistent Ethic of Life" (Fordham, 1983).
          </p>
        </footer>
      </article>
    </div>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12 sm:mb-14">
      <div className="flex items-baseline gap-4 mb-5">
        <span
          className="text-2xl sm:text-3xl text-[hsl(354_55%_26%)]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
        >
          {number}.
        </span>
        <h2
          className="text-2xl sm:text-3xl text-[hsl(220_30%_14%)] leading-tight"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function P({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <p
      className={`text-base sm:text-lg leading-relaxed text-[hsl(220_25%_22%)] mb-4 ${className}`}
      style={{ fontFamily: "'Source Serif 4', Georgia, serif", ...style }}
    >
      {children}
    </p>
  );
}
