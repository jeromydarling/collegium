/**
 * Catholic Social Teaching — the seven foundational principles, with
 * representative magisterial citations. Many of the cited documents
 * (e.g., Rerum Novarum, Quadragesimo Anno) are in the public domain;
 * later documents are referenced under brief quotation / educational fair use.
 */

export type CstPrinciple = {
  key: string;
  title: string;
  latin: string;
  summary: string;
  for_lawyers: string;
  citation: string;
};

export const cstPrinciples: CstPrinciple[] = [
  {
    key: "dignity",
    title: "Dignity of the human person",
    latin: "Dignitas humanae personae",
    summary:
      "Every human being is created in the image of God and possesses an inviolable dignity that the law must protect, never merely instrumentalize.",
    for_lawyers:
      "Client files are not commodities. Every intake, every referral, every bar-association directory entry begins from this premise.",
    citation: "Gaudium et Spes, §27; Catechism of the Catholic Church, §§1700–1715",
  },
  {
    key: "common-good",
    title: "The common good",
    latin: "Bonum commune",
    summary:
      "The sum of social conditions which allow people, either as groups or as individuals, to reach their fulfillment more fully and more easily.",
    for_lawyers:
      "A just legal order is ordered to the flourishing of the whole community, not merely the protection of private interest.",
    citation: "Gaudium et Spes, §26; Aquinas, ST I-II, q.90, a.2",
  },
  {
    key: "subsidiarity",
    title: "Subsidiarity",
    latin: "Subsidiaritas",
    summary:
      "A higher community must not deprive a lower community of its proper functions, but rather support it in case of need.",
    for_lawyers:
      "Diocesan tribunals, local guilds, and chapter officers each have their own competence. The platform serves them; it does not replace them.",
    citation: "Pius XI, Quadragesimo Anno, §79 (1931, public domain)",
  },
  {
    key: "solidarity",
    title: "Solidarity",
    latin: "Solidaritas",
    summary:
      "A firm and persevering determination to commit oneself to the common good — to the good of all and of each individual, because we are all really responsible for all.",
    for_lawyers:
      "Mentorship, pro bono service, and chapter hospitality are concrete acts of solidarity, not extracurricular kindness.",
    citation: "John Paul II, Sollicitudo Rei Socialis, §38",
  },
  {
    key: "preferential",
    title: "Preferential option for the poor and vulnerable",
    latin: "Optio præferentialis pro pauperibus",
    summary:
      "The needs of the poor and vulnerable take priority in moral and legal reasoning, because the measure of a community is how it treats its least powerful members.",
    for_lawyers:
      "Legal aid, immigration assistance, and parish-level advocacy are not peripheral — they sit at the center of legal vocation.",
    citation: "John Paul II, Centesimus Annus, §57",
  },
  {
    key: "labor",
    title: "Dignity of work and rights of workers",
    latin: "Dignitas operis",
    summary:
      "Work is more than a way of making a living; it is a vocation, a participation in God's creative activity, and it generates rights — to a just wage, to organize, to safe conditions, to rest.",
    for_lawyers:
      "Labor and employment work — for clients and within firms — is a privileged site of Christian witness.",
    citation: "Leo XIII, Rerum Novarum (1891, public domain); John Paul II, Laborem Exercens",
  },
  {
    key: "stewardship",
    title: "Care for creation",
    latin: "Cura creationis",
    summary:
      "The goods of the earth are entrusted to the whole human family. Stewardship binds law to ecology, to future generations, to the integrity of creation.",
    for_lawyers:
      "Environmental, land-use, and indigenous-rights work participate in this stewardship.",
    citation: "Francis, Laudato Si', §§66–69",
  },
];

export const cstPrincipleByKey = (key: string): CstPrinciple | undefined =>
  cstPrinciples.find((p) => p.key === key);
