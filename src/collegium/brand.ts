/**
 * Collegium brand constants.
 *
 * Collegium = a guild operating system for Christian and Catholic legal
 * communities. Voice: Aquinas and Catholic Social Teaching — vocation,
 * justice, prudence, mercy, common good, subsidiarity, solidarity.
 */

export const brand = {
  appName: "Collegium",
  tagline: "A guild operating system for Christian and Catholic legal communities.",
  longTagline:
    "Chapters. Mentorship. Service. Formation. Stewardship. A common life for those who practice law as a calling.",
  motto: "Lex caritas est — the law is love made just.",
  attribution: "Built on the moral imagination of Aquinas and Catholic Social Teaching.",
} as const;

export const modules = {
  chapters: {
    slug: "chapters",
    label: "Chapters",
    latin: "Capitula",
    summary:
      "Run the recurring life of a guild, society, or law-school fellowship — members, officers, gatherings, hospitality, continuity.",
    icon: "users",
  },
  mentorship: {
    slug: "mentorship",
    label: "Mentorship",
    latin: "Tirocinium",
    summary:
      "Pair students and young lawyers with seasoned practitioners. Quiet cadences, real conversations, vocational discernment.",
    icon: "compass",
  },
  service: {
    slug: "service",
    label: "Service",
    latin: "Ministerium",
    summary:
      "Legal aid, pro bono routing, parish and church-governance referrals, canon-law overlap — the works of mercy in legal vocation.",
    icon: "scale",
  },
  formation: {
    slug: "formation",
    label: "Formation",
    latin: "Eruditio",
    summary:
      "A curated library of public-domain legal, civic, and theological texts — Aquinas, Augustine, Roman jurists, canon law, Catholic Social Teaching.",
    icon: "library",
  },
  advancement: {
    slug: "advancement",
    label: "Advancement",
    latin: "Provectio",
    summary:
      "Conferences, Red Masses, CLE-quality gatherings, leadership pipelines, chapter launches.",
    icon: "trending-up",
  },
  pulse: {
    slug: "nri",
    label: "NRI Pulse",
    latin: "Concentus",
    summary:
      "Narrative Relational Intelligence — the interpretive layer that helps stewards notice who is drifting, who is rising, where the chapter is being formed.",
    icon: "activity",
  },
} as const;

export const principles = [
  {
    key: "dignity",
    title: "The dignity of the human person",
    latin: "Dignitas humana",
    body:
      "Every member is a person before they are a record. Collegium is built so no one is reduced to a row.",
  },
  {
    key: "common-good",
    title: "The common good",
    latin: "Bonum commune",
    body:
      "Law is ordered to the common good (ST I-II, q.90, a.2). The platform serves the whole community, not the convenience of a few.",
  },
  {
    key: "subsidiarity",
    title: "Subsidiarity",
    latin: "Subsidiaritas",
    body:
      "Decisions belong with the chapter that lives them. The national steward never overrules the local one without cause.",
  },
  {
    key: "solidarity",
    title: "Solidarity",
    latin: "Solidaritas",
    body:
      "A firm and persevering determination to commit oneself to the good of all (Sollicitudo Rei Socialis, §38).",
  },
  {
    key: "preferential",
    title: "Preferential love for the poor",
    latin: "Optio pro pauperibus",
    body:
      "Service tooling routes attention toward the unrepresented first — the migrant, the parish, the family in crisis.",
  },
  {
    key: "participation",
    title: "Participation",
    latin: "Participatio",
    body:
      "Mentors, members, students — each has a voice. The platform widens the table, it does not narrow it.",
  },
] as const;

export const moduleOrder = [
  modules.chapters,
  modules.mentorship,
  modules.service,
  modules.formation,
  modules.advancement,
  modules.pulse,
] as const;
