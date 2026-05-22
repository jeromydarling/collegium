import type { TemplateDefinition, TemplateAnswers } from "./TemplateRunner";
import type { PatrociniumCase } from "../data/cases";

export const evictionAnswerTemplate: TemplateDefinition = {
  slug: "eviction-answer",
  title: "Eviction answer — guided draft",
  description:
    "Eight questions, a working draft on the right. Reviewed in 20 minutes instead of two hours. The output is a starting point — your judgment finishes it.",
  jurisdictionNote:
    "Template designed for MA Housing Court summary-process answers. Validate against jurisdiction-specific local rules and forms before filing.",
  latin: "Responsio expulsionis",
  requiredIds: ["tenancyType", "noticeType", "voucherType"],
  defaults: { demandJury: true, demandDiscovery: true },
  questions: [
    {
      id: "tenancyType",
      type: "radio",
      prompt: "What kind of tenancy is this?",
      hint: "Term tenancies have a fixed end date in the lease. At-will tenancies do not.",
      options: [
        { value: "at-will", label: "At-will" },
        { value: "term", label: "Term (fixed end date)" },
      ],
    },
    {
      id: "noticeType",
      type: "radio",
      prompt: "What kind of notice did the landlord serve?",
      hint: "The notice type drives which defenses apply.",
      options: [
        { value: "14-day-nonpayment", label: "14-day nonpayment" },
        { value: "30-day-at-will", label: "30-day at-will termination" },
        { value: "no-fault", label: "No-fault (term expiry)" },
        { value: "cause", label: "For-cause (lease violation)" },
      ],
    },
    {
      id: "conditionsIssues",
      type: "toggle",
      prompt: "Are there habitability issues?",
      hint: "Lead, leaks, heat, pests, code violations. Triggers warranty-of-habitability defense.",
    },
    {
      id: "retaliation",
      type: "toggle",
      prompt: "Any retaliation indicators?",
      hint: "Notice within 6 months of a complaint, code report, or organizing activity creates a presumption of retaliation under c. 239 § 2A.",
    },
    {
      id: "securityDeposit",
      type: "toggle",
      prompt: "Outstanding security-deposit issues?",
      hint: "Missing interest, not in separate account, no statement of conditions — counterclaim under c. 186 § 15B.",
    },
    {
      id: "voucherType",
      type: "radio",
      prompt: "Voucher / subsidy status?",
      hint: "Section-8 portability and RAFT pending change the landlord's lockout calculus.",
      options: [
        { value: "section-8", label: "Section-8 (HCV)" },
        { value: "rafn", label: "RAFT/HomeBASE pending" },
        { value: "none", label: "No subsidy" },
      ],
    },
    {
      id: "demandJury",
      type: "toggle",
      prompt: "Demand a jury trial?",
    },
    {
      id: "demandDiscovery",
      type: "toggle",
      prompt: "Serve standard discovery?",
      hint: "Interrogatories and document requests under Uniform Summary Process Rule 7.",
    },
  ],
  buildDraft,
};

function buildDraft(a: TemplateAnswers, c: PatrociniumCase): string {
  const tenancyType = (a.tenancyType as string) || "at-will";
  const noticeType = (a.noticeType as string) || "14-day-nonpayment";
  const voucherType = (a.voucherType as string) || "none";

  const noticeDescription: Record<string, string> = {
    "14-day-nonpayment":
      "a 14-day notice to quit for nonpayment of rent under M.G.L. c. 186 § 11",
    "30-day-at-will":
      "a 30-day notice to quit the tenancy at will under M.G.L. c. 186 § 12",
    "no-fault": "a no-fault notice based on expiration of the term",
    cause: "a notice to quit for alleged lease violation",
  };

  const tenancyDescription =
    tenancyType === "term" ? "a tenancy for a term" : "a tenancy at will";

  const lines: string[] = [];
  const tenant = c.matter.requester;
  const landlord = c.meta.opposingParty ?? "(landlord name)";
  const forum = c.meta.forum ?? "Housing Court (Eastern Division)";

  lines.push(`COMMONWEALTH OF MASSACHUSETTS`);
  lines.push(forum.toUpperCase());
  lines.push(``);
  lines.push(`${landlord.toUpperCase()},`);
  lines.push(`    Plaintiff,`);
  lines.push(``);
  lines.push(`    v.`);
  lines.push(``);
  lines.push(`${tenant.toUpperCase()},`);
  lines.push(`    Defendant.`);
  lines.push(``);
  lines.push(`Civil Action No. _____________`);
  lines.push(``);
  lines.push(`DEFENDANT'S ANSWER, AFFIRMATIVE DEFENSES, AND COUNTERCLAIMS`);
  lines.push(``);
  lines.push(
    `Defendant ${tenant}, by and through undersigned counsel, answers the Complaint and asserts the following affirmative defenses and counterclaims:`
  );
  lines.push(``);

  lines.push(`I. RESPONSES TO COMPLAINT`);
  lines.push(``);
  lines.push(
    `1. Admitted that Defendant is the lawful occupant of the premises pursuant to ${tenancyDescription}.`
  );
  lines.push(
    `2. Admitted that Plaintiff served ${noticeDescription[noticeType]} on or about [DATE OF NOTICE].`
  );
  lines.push(
    `3. Denied that Defendant is in default of any obligation that would justify possession by the Plaintiff.`
  );
  lines.push(
    `4. Denied all other allegations of the Complaint not expressly admitted herein.`
  );
  lines.push(``);

  lines.push(`II. AFFIRMATIVE DEFENSES`);
  lines.push(``);
  let n = 1;
  lines.push(`${n++}. Insufficient process and service of process.`);
  lines.push(``);

  if (noticeType === "14-day-nonpayment") {
    lines.push(
      `${n++}. Cure under M.G.L. c. 186 § 11. Defendant tendered or stands ready to tender all rent claimed within the statutory cure period and is entitled to retain the tenancy.`
    );
    lines.push(``);
  }

  if (a.conditionsIssues) {
    lines.push(
      `${n++}. Breach of warranty of habitability. The premises suffered conditions in violation of the State Sanitary Code (105 C.M.R. § 410.000 et seq.) and the implied warranty of habitability recognized in Boston Housing Auth. v. Hemingway, 363 Mass. 184 (1973). The reasonable rental value of the premises during the period of breach was substantially diminished, partially or wholly offsetting any rent claimed.`
    );
    lines.push(``);
    lines.push(
      `${n++}. Quiet enjoyment under M.G.L. c. 186 § 14. The conditions described above constituted an interference with Defendant's quiet enjoyment of the premises.`
    );
    lines.push(``);
  }

  if (a.retaliation) {
    lines.push(
      `${n++}. Retaliatory eviction under M.G.L. c. 239 § 2A and c. 186 § 18. The notice was served within six months of Defendant's protected activity (complaint, code-enforcement contact, or organizing). A presumption of retaliation applies and is not rebutted by clear and convincing evidence.`
    );
    lines.push(``);
  }

  if (voucherType === "section-8") {
    lines.push(
      `${n++}. Section-8 Housing Choice Voucher protections. Defendant participates in the federal Housing Choice Voucher program; the lease and applicable HUD regulations (24 C.F.R. § 982 et seq.) and the Massachusetts source-of-income protections under M.G.L. c. 151B § 4(10) modify the grounds and procedure for termination.`
    );
    lines.push(``);
  } else if (voucherType === "rafn") {
    lines.push(
      `${n++}. Pending emergency rental assistance. Defendant has a pending application for RAFT/HomeBASE emergency rental assistance under EOHLC guidelines. Pursuant to standing practice, the Court should continue the matter to permit disposition of that application before entering judgment.`
    );
    lines.push(``);
  }

  lines.push(`${n++}. Unclean hands.`);
  lines.push(``);
  lines.push(
    `${n++}. Failure to comply with M.G.L. c. 239 § 1 and applicable Uniform Summary Process Rules.`
  );
  lines.push(``);
  lines.push(
    `${n++}. Defendant reserves the right to assert additional affirmative defenses as discovery proceeds.`
  );
  lines.push(``);

  lines.push(`III. COUNTERCLAIMS`);
  lines.push(``);
  let counterNum = 1;

  if (a.conditionsIssues) {
    lines.push(
      `Counterclaim ${counterNum++}. Breach of warranty of habitability — damages for diminished rental value, attorneys' fees as the prevailing party under M.G.L. c. 93A and c. 239 § 8A.`
    );
    lines.push(``);
    lines.push(
      `Counterclaim ${counterNum++}. M.G.L. c. 93A unfair and deceptive acts and practices — attempting to collect rent on uninhabitable premises constitutes a c. 93A violation. Multiple damages and attorneys' fees sought.`
    );
    lines.push(``);
  }

  if (a.securityDeposit) {
    lines.push(
      `Counterclaim ${counterNum++}. Security-deposit violations under M.G.L. c. 186 § 15B — failure to maintain in segregated interest-bearing account, failure to pay interest, and/or failure to provide statement of conditions. Treble damages, interest, costs, and attorneys' fees.`
    );
    lines.push(``);
  }

  if (a.retaliation) {
    lines.push(
      `Counterclaim ${counterNum++}. Retaliation under M.G.L. c. 186 § 18 — damages of one to three months' rent, costs, and attorneys' fees.`
    );
    lines.push(``);
  }

  if (counterNum === 1) {
    lines.push(
      `Defendant reserves the right to assert counterclaims as discovery proceeds.`
    );
    lines.push(``);
  }

  lines.push(`IV. JURY DEMAND`);
  lines.push(``);
  lines.push(
    a.demandJury
      ? `Defendant demands a trial by jury on all issues so triable.`
      : `Defendant requests a bench trial.`
  );
  lines.push(``);

  if (a.demandDiscovery) {
    lines.push(`V. DISCOVERY`);
    lines.push(``);
    lines.push(
      `Pursuant to Uniform Summary Process Rule 7 and Mass. R. Civ. P. 33–34, Defendant serves contemporaneously herewith standard interrogatories and requests for production of documents.`
    );
    lines.push(``);
  }

  lines.push(`WHEREFORE, Defendant respectfully requests that the Court:`);
  lines.push(`    (a) Enter judgment for Defendant on the Complaint;`);
  lines.push(`    (b) Award damages on the counterclaims pleaded above;`);
  lines.push(`    (c) Award attorneys' fees and costs as authorized by statute; and`);
  lines.push(`    (d) Grant such other and further relief as the Court deems just and proper.`);
  lines.push(``);
  lines.push(`Respectfully submitted,`);
  lines.push(``);
  lines.push(`${tenant.toUpperCase()},`);
  lines.push(`By their attorney,`);
  lines.push(``);
  lines.push(`_______________________________`);
  lines.push(`[ATTORNEY NAME], BBO #_______`);
  lines.push(`[FIRM / CLINIC]`);
  lines.push(`[ADDRESS]`);
  lines.push(`[PHONE] · [EMAIL]`);
  lines.push(``);
  lines.push(
    `Dated: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
  );

  return lines.join("\n");
}
