import type { TemplateDefinition, TemplateAnswers } from "./TemplateRunner";
import type { PatrociniumCase } from "../data/cases";

export const sealingPetitionTemplate: TemplateDefinition = {
  slug: "sealing-petition-100a",
  title: "Record sealing petition — c. 276 § 100A",
  description:
    "Six questions to draft a CORI record-sealing petition under M.G.L. c. 276 § 100A. The 100A pathway is administrative — no hearing — so a clean petition packet does the work.",
  jurisdictionNote:
    "Template designed for Massachusetts CORI sealing under § 100A (time-based, no court hearing). Confirm the waiting period has run before filing; misdemeanors are 3 years, felonies 7 years.",
  latin: "Signaculum",
  requiredIds: ["chargeType", "dispositionType", "waitingPeriodMet"],
  questions: [
    {
      id: "chargeType",
      type: "radio",
      prompt: "Charge category to be sealed?",
      hint: "Different waiting periods apply: misdemeanor (3 years), felony (7 years).",
      options: [
        { value: "misdemeanor", label: "Misdemeanor" },
        { value: "felony", label: "Felony" },
        { value: "mixed", label: "Mixed (both)" },
      ],
    },
    {
      id: "dispositionType",
      type: "radio",
      prompt: "How did the case end?",
      hint: "Convictions, CWOFs, and probation completions can all qualify if the waiting period has run.",
      options: [
        { value: "conviction", label: "Conviction (incarceration or fine)" },
        { value: "cwof", label: "CWOF (continued without finding)" },
        { value: "probation-completion", label: "Probation completed" },
      ],
    },
    {
      id: "waitingPeriodMet",
      type: "radio",
      prompt: "Has the waiting period run?",
      hint: "Measured from the latest disposition date (incarceration end, fine paid, probation closed) on ANY case on the record.",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No — wait" },
      ],
    },
    {
      id: "openCases",
      type: "toggle",
      prompt: "Any open criminal cases anywhere?",
      hint: "Open cases — even on unrelated matters in other jurisdictions — disqualify a § 100A sealing. Wait for resolution.",
    },
    {
      id: "soraRequired",
      type: "toggle",
      prompt: "Is the petitioner required to register as a sex offender?",
      hint: "SORA registrants cannot use § 100A for the registrable offense.",
    },
    {
      id: "additionalReliefSought",
      type: "toggle",
      prompt: "Also request that probation seal the docket entry?",
      hint: "Standard belt-and-suspenders ask. § 100A reaches CORI, but probation files persist unless requested.",
    },
  ],
  buildDraft,
};

function buildDraft(a: TemplateAnswers, c: PatrociniumCase): string {
  const tenant = c.matter.requester;
  const chargeType = (a.chargeType as string) || "misdemeanor";
  const dispositionType = (a.dispositionType as string) || "conviction";
  const waitingPeriod = chargeType === "felony" ? "seven (7) years" : "three (3) years";
  const eligible =
    a.waitingPeriodMet === "yes" && !a.openCases && !a.soraRequired;

  const lines: string[] = [];
  lines.push(`COMMONWEALTH OF MASSACHUSETTS`);
  lines.push(`COMMISSIONER OF PROBATION — CRIMINAL RECORD SEALING`);
  lines.push(``);
  lines.push(`PETITION FOR SEALING OF CRIMINAL RECORD`);
  lines.push(`UNDER M.G.L. c. 276 § 100A`);
  lines.push(``);
  lines.push(`Petitioner: ${tenant.toUpperCase()}`);
  lines.push(`Date of Birth: [DOB]`);
  lines.push(`Last Four of SSN: ____-____-____`);
  lines.push(`Current Address: [ADDRESS]`);
  lines.push(``);
  lines.push(`Court(s) involved: [COURT NAMES + DOCKET NUMBERS]`);
  lines.push(`Offense(s): [CHARGE DESCRIPTIONS]`);
  lines.push(`Disposition: ${humanDisposition(dispositionType)}`);
  lines.push(`Date of Final Disposition: [DATE]`);
  lines.push(``);

  lines.push(`1. STATEMENT OF ELIGIBILITY`);
  lines.push(``);
  lines.push(
    `Petitioner respectfully requests that the criminal record above be sealed pursuant to M.G.L. c. 276 § 100A. Petitioner certifies the following:`
  );
  lines.push(``);
  lines.push(
    `  (a) The conviction or disposition is a ${chargeType === "mixed" ? "set of misdemeanor and felony" : chargeType} offense and the statutory waiting period of ${waitingPeriod} from final disposition has fully elapsed.`
  );
  lines.push(``);
  lines.push(
    `  (b) Petitioner has not been convicted of any criminal offense in the Commonwealth or in any other jurisdiction since the disposition date.`
  );
  lines.push(``);
  lines.push(
    `  (c) Petitioner has no open or pending criminal matters in the Commonwealth or in any other jurisdiction.`
  );
  lines.push(``);
  lines.push(
    `  (d) Petitioner is not currently required to register as a sex offender under M.G.L. c. 6 § 178C-178P for any offense for which sealing is sought.`
  );
  lines.push(``);

  if (!eligible) {
    lines.push(
      `  [DRAFTING NOTE: ONE OR MORE ELIGIBILITY CRITERIA IS NOT MET BASED ON ANSWERS — REVIEW BEFORE FILING.]`
    );
    lines.push(``);
    if (a.waitingPeriodMet !== "yes") {
      lines.push(
        `  → The statutory waiting period has not run. Do not file under § 100A. Consider waiting or evaluating § 100C or § 100K alternatives.`
      );
      lines.push(``);
    }
    if (a.openCases) {
      lines.push(
        `  → An open case is reported. Wait for resolution before refiling.`
      );
      lines.push(``);
    }
    if (a.soraRequired) {
      lines.push(
        `  → SORA registration applies. § 100A cannot seal the registrable offense.`
      );
      lines.push(``);
    }
  }

  lines.push(`2. RELIEF REQUESTED`);
  lines.push(``);
  lines.push(
    `WHEREFORE, Petitioner respectfully requests that the Commissioner of Probation:`
  );
  lines.push(``);
  lines.push(
    `  (a) Seal the above-referenced record(s) such that the existence of these criminal records is not disclosed on a CORI report and is treated as sealed for all civil purposes, including employment and housing applications, as authorized by M.G.L. c. 276 § 100A;`
  );
  lines.push(``);

  if (a.additionalReliefSought) {
    lines.push(
      `  (b) Direct the relevant Probation Department(s) to seal corresponding probation files and case-summary entries; and`
    );
    lines.push(``);
    lines.push(
      `  (c) Grant such other and further relief as is appropriate.`
    );
  } else {
    lines.push(`  (b) Grant such other and further relief as is appropriate.`);
  }
  lines.push(``);

  lines.push(`Signed under the pains and penalties of perjury,`);
  lines.push(``);
  lines.push(`_______________________________`);
  lines.push(`${tenant.toUpperCase()}, Petitioner`);
  lines.push(`Date: ${today()}`);
  lines.push(``);
  lines.push(`Prepared with the assistance of counsel:`);
  lines.push(`[ATTORNEY NAME], BBO #_______`);
  lines.push(`[FIRM / CLINIC] · [PHONE] · [EMAIL]`);
  lines.push(``);
  lines.push(`ENCLOSURES:`);
  lines.push(`  · Certified copies of case dispositions`);
  lines.push(`  · Current self-CORI request results`);
  lines.push(`  · Photo ID copy`);
  lines.push(`  · Self-addressed stamped envelope`);

  return lines.join("\n");
}

function humanDisposition(d: string): string {
  switch (d) {
    case "cwof":
      return "Continued without finding (CWOF)";
    case "probation-completion":
      return "Probation completed";
    case "conviction":
    default:
      return "Conviction";
  }
}

function today(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
