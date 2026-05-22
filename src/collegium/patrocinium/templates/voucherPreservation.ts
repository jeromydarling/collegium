import type { TemplateDefinition, TemplateAnswers } from "./TemplateRunner";
import type { PatrociniumCase } from "../data/cases";

export const voucherPreservationTemplate: TemplateDefinition = {
  slug: "voucher-preservation-letter",
  title: "Section-8 voucher preservation letter",
  description:
    "Five questions to draft a letter to the Public Housing Authority (PHA) preserving a Section-8 Housing Choice Voucher during a portability transfer, lease emergency, or threatened lockout. Goal: keep the voucher alive while you litigate the underlying issue.",
  jurisdictionNote:
    "Federal HUD framework, applied through state and local PHAs. Cite local PHA policy where known. The letter is administrative — addressed to the issuing or receiving PHA — and should be sent same-day when possible.",
  latin: "Servatio",
  requiredIds: ["situation", "phaStatus"],
  questions: [
    {
      id: "situation",
      type: "radio",
      prompt: "Why is the voucher at risk?",
      options: [
        { value: "portability-stalled", label: "Portability transfer stalled" },
        { value: "termination-threatened", label: "PHA threatened termination" },
        { value: "lease-emergency", label: "Lease emergency (notice to quit)" },
        { value: "missed-recert", label: "Missed annual recertification" },
      ],
    },
    {
      id: "phaStatus",
      type: "radio",
      prompt: "Which PHA does this letter address?",
      hint: "Portability has an issuing PHA (where voucher started) and a receiving PHA (destination).",
      options: [
        { value: "issuing", label: "Issuing PHA (original)" },
        { value: "receiving", label: "Receiving PHA (destination)" },
        { value: "single-pha", label: "Single PHA (no portability)" },
      ],
    },
    {
      id: "homelessRisk",
      type: "toggle",
      prompt: "Imminent risk of homelessness?",
      hint: "Triggers PHA emergency-response framework under 24 C.F.R. § 982.354.",
    },
    {
      id: "childrenAffected",
      type: "toggle",
      prompt: "Children under 18 in the household?",
      hint: "Strengthens the case for emergency continuation and adds Title I/HUD homeless-child protections.",
    },
    {
      id: "requestExpedited",
      type: "toggle",
      prompt: "Request an expedited Informal Hearing under 24 C.F.R. § 982.555?",
    },
  ],
  buildDraft,
};

function buildDraft(a: TemplateAnswers, c: PatrociniumCase): string {
  const tenant = c.matter.requester;
  const region = c.matter.region;
  const situation = (a.situation as string) || "portability-stalled";
  const phaStatus = (a.phaStatus as string) || "issuing";

  const subjectLine: Record<string, string> = {
    "portability-stalled":
      "URGENT — Section-8 Housing Choice Voucher Portability — Request to Preserve and Process",
    "termination-threatened":
      "URGENT — Section-8 Housing Choice Voucher — Response to Termination Notice and Request to Preserve",
    "lease-emergency":
      "URGENT — Section-8 Housing Choice Voucher — Lease Emergency / Request to Preserve",
    "missed-recert":
      "URGENT — Section-8 Housing Choice Voucher — Late Recertification / Good-Cause Request",
  };

  const lines: string[] = [];
  lines.push(`[FIRM / CLINIC LETTERHEAD]`);
  lines.push(``);
  lines.push(today());
  lines.push(``);
  lines.push(`VIA EMAIL AND FIRST-CLASS MAIL`);
  lines.push(``);
  lines.push(`${humanPHA(phaStatus, region).toUpperCase()}`);
  lines.push(`[ADDRESS]`);
  lines.push(``);
  lines.push(`Re: ${subjectLine[situation]}`);
  lines.push(`    Voucher Holder: ${tenant}`);
  lines.push(`    Voucher #: [VOUCHER NUMBER]`);
  lines.push(`    Address: [CURRENT UNIT OR DESTINATION ADDRESS]`);
  lines.push(``);
  lines.push(`To Whom It May Concern:`);
  lines.push(``);
  lines.push(
    `This office represents ${tenant} in connection with the above-referenced Section-8 Housing Choice Voucher. We write to preserve all rights under 24 C.F.R. Part 982 and applicable PHA Administrative Plan provisions and to request immediate action as described below.`
  );
  lines.push(``);

  lines.push(`I. FACTS`);
  lines.push(``);

  if (situation === "portability-stalled") {
    lines.push(
      `1. The voucher holder has properly initiated portability under 24 C.F.R. § 982.353. The issuing PHA timely issued the porting documentation; intake processing at the receiving PHA has stalled.`
    );
    lines.push(
      `2. The voucher holder is currently without unit, or facing the loss of a unit, while administrative processing continues. Each additional day of delay risks the loss of the voucher and homelessness for the household.`
    );
    lines.push(``);
  } else if (situation === "termination-threatened") {
    lines.push(
      `1. The PHA issued a notice of intent to terminate the voucher on [DATE OF NOTICE].`
    );
    lines.push(
      `2. The voucher holder denies the factual or legal basis for the proposed termination and intends to exercise the Informal Hearing right preserved by 24 C.F.R. § 982.555.`
    );
    lines.push(``);
  } else if (situation === "lease-emergency") {
    lines.push(
      `1. The voucher holder was served a notice to quit by the landlord on [DATE]. The notice is in the process of being defended in [HOUSING COURT / FORUM].`
    );
    lines.push(
      `2. To avoid losing the voucher tied to a tenancy that is being legitimately contested, the voucher holder requests that the PHA hold the voucher in active status pending resolution of the underlying housing-court matter.`
    );
    lines.push(``);
  } else if (situation === "missed-recert") {
    lines.push(
      `1. The voucher holder failed to complete annual recertification by [DATE] due to circumstances outside their control — [BRIEF FACTUAL EXPLANATION].`
    );
    lines.push(
      `2. The voucher holder is now prepared to complete recertification in full. Good cause exists for the late submission.`
    );
    lines.push(``);
  }

  if (a.homelessRisk) {
    lines.push(
      `3. The voucher holder faces imminent risk of homelessness. The PHA's emergency-response framework under 24 C.F.R. § 982.354 should be activated.`
    );
    lines.push(``);
  }

  if (a.childrenAffected) {
    lines.push(
      `${a.homelessRisk ? "4" : "3"}. The household includes minor children. Loss of the voucher in these circumstances implicates federal homeless-child protections and the PHA's obligations to protect housing stability for children.`
    );
    lines.push(``);
  }

  lines.push(`II. RELIEF REQUESTED`);
  lines.push(``);
  lines.push(`The voucher holder respectfully requests that the PHA:`);
  lines.push(``);

  let n = 1;
  if (situation === "portability-stalled") {
    lines.push(
      `  ${nextLetter(n++)}. Complete portability processing within 14 days, including issuance of a fresh voucher with extended search time;`
    );
  }
  if (situation === "termination-threatened") {
    lines.push(
      `  ${nextLetter(n++)}. Hold the voucher in active status pending the Informal Hearing requested below;`
    );
  }
  if (situation === "lease-emergency") {
    lines.push(
      `  ${nextLetter(n++)}. Hold the voucher in active status pending resolution of the housing-court matter, and notify undersigned counsel before any termination action;`
    );
  }
  if (situation === "missed-recert") {
    lines.push(
      `  ${nextLetter(n++)}. Accept the late recertification packet for good cause and reinstate the voucher to active status;`
    );
  }

  if (a.requestExpedited) {
    lines.push(
      `  ${nextLetter(n++)}. Schedule an Informal Hearing under 24 C.F.R. § 982.555 on an expedited basis (within 30 days);`
    );
  }

  lines.push(
    `  ${nextLetter(n++)}. Provide all documentation in the voucher holder's file under 24 C.F.R. § 982.555(e) and applicable PHA Administrative Plan disclosure provisions;`
  );
  lines.push(
    `  ${nextLetter(n++)}. Communicate with undersigned counsel on all further matters relating to this voucher.`
  );
  lines.push(``);

  lines.push(
    `Counsel is available immediately to coordinate on any of the items above. Please confirm receipt of this letter by return email.`
  );
  lines.push(``);
  lines.push(`Respectfully,`);
  lines.push(``);
  lines.push(`_______________________________`);
  lines.push(`[ATTORNEY NAME]`);
  lines.push(`[FIRM / CLINIC]`);
  lines.push(`[PHONE] · [EMAIL]`);
  lines.push(``);
  lines.push(`cc:  Client file`);
  lines.push(`     [CO-COUNSEL / SUPERVISING ATTORNEY]`);

  return lines.join("\n");
}

function humanPHA(status: string, region: string): string {
  if (status === "issuing") return `Housing Authority — Issuing PHA (${region})`;
  if (status === "receiving") return `Housing Authority — Receiving PHA (${region})`;
  return `Housing Authority (${region})`;
}

function nextLetter(n: number): string {
  return `(${String.fromCharCode(96 + n)})`;
}

function today(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
