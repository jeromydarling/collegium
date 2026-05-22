import type { TemplateDefinition, TemplateAnswers } from "./TemplateRunner";
import type { PatrociniumCase } from "../data/cases";

export const ssiReconsiderationTemplate: TemplateDefinition = {
  slug: "ssi-reconsideration",
  title: "SSI request for reconsideration",
  description:
    "Seven questions to draft an SSA Form HA-501-style request for reconsideration on an SSI/SSDI denial. The reconsideration window is 60 days from notice — file this packet to preserve appeal rights.",
  jurisdictionNote:
    "Federal SSA reconsideration. The form itself is SSA-561 (also titled 'Request for Reconsideration'). This generates the supporting written statement; attach to the form.",
  latin: "Reconsideratio",
  requiredIds: ["denialBasis", "claimType"],
  defaults: { requestDIB: false, attachNewEvidence: true },
  questions: [
    {
      id: "claimType",
      type: "radio",
      prompt: "Claim type denied?",
      hint: "SSI is needs-based (Title XVI); SSDI is work-history-based (Title II). Different denial bases apply.",
      options: [
        { value: "ssi", label: "SSI (Title XVI)" },
        { value: "ssdi", label: "SSDI (Title II)" },
        { value: "concurrent", label: "Both (concurrent)" },
      ],
    },
    {
      id: "denialBasis",
      type: "radio",
      prompt: "Stated basis for denial?",
      hint: "From the denial notice. Different bases call for different evidence.",
      options: [
        { value: "medical-not-disabled", label: "Not disabled (medical)" },
        { value: "duration-insufficient", label: "Duration insufficient" },
        { value: "rfc-light-work", label: "RFC says can do light work" },
        { value: "income-resources", label: "Income/resources over (SSI)" },
      ],
    },
    {
      id: "treatingPhysicianLetter",
      type: "toggle",
      prompt: "Treating physician medical-source letter in hand?",
      hint: "A treating-physician opinion on functional limitations is the strongest evidence at reconsideration.",
    },
    {
      id: "newMedicalRecords",
      type: "toggle",
      prompt: "New medical records to submit (post-application)?",
      hint: "SSA will consider new records up through reconsideration without a new application.",
    },
    {
      id: "consultativeExamDispute",
      type: "toggle",
      prompt: "Dispute SSA's consultative exam (CE) findings?",
      hint: "If the denial relied heavily on a CE, the request can challenge the CE and request reweighting against treating-source evidence.",
    },
    {
      id: "attachNewEvidence",
      type: "toggle",
      prompt: "Attach an evidence appendix with the request?",
    },
    {
      id: "requestDIB",
      type: "toggle",
      prompt: "Request a Disability Interview by Phone (DIB)?",
      hint: "Optional. Some claimants benefit from the chance to clarify functional limits orally.",
    },
  ],
  buildDraft,
};

function buildDraft(a: TemplateAnswers, c: PatrociniumCase): string {
  const claimant = c.matter.requester;
  const claimType = (a.claimType as string) || "ssi";
  const denialBasis = (a.denialBasis as string) || "medical-not-disabled";

  const lines: string[] = [];
  lines.push(`SOCIAL SECURITY ADMINISTRATION`);
  lines.push(`OFFICE OF DISABILITY ADJUDICATION AND REVIEW`);
  lines.push(``);
  lines.push(`REQUEST FOR RECONSIDERATION — SUPPORTING STATEMENT`);
  lines.push(`(Attach to SSA-561)`);
  lines.push(``);
  lines.push(`Claimant: ${claimant.toUpperCase()}`);
  lines.push(`SSN: XXX-XX-____`);
  lines.push(`Claim type: ${claimDescription(claimType)}`);
  lines.push(`Initial determination date: [DATE OF DENIAL]`);
  lines.push(`Date of this request: ${today()}`);
  lines.push(``);
  lines.push(
    `Pursuant to 20 C.F.R. § 416.1407 (SSI) and/or § 404.907 (Title II), Claimant respectfully requests reconsideration of the Initial Determination dated above, on the grounds set out below.`
  );
  lines.push(``);

  lines.push(`I. ISSUES PRESENTED`);
  lines.push(``);
  lines.push(
    `1. Whether Claimant is disabled within the meaning of the Social Security Act and applicable regulations as of the alleged onset date.`
  );
  if (denialBasis === "rfc-light-work") {
    lines.push(
      `2. Whether SSA's Residual Functional Capacity (RFC) determination accurately reflects Claimant's functional limitations as supported by the longitudinal medical record.`
    );
  }
  if (denialBasis === "duration-insufficient") {
    lines.push(
      `2. Whether the durational requirement of 20 C.F.R. § 404.1509 is met, given the longitudinal record and the medical opinion(s) attached.`
    );
  }
  if (denialBasis === "income-resources" && claimType !== "ssdi") {
    lines.push(
      `2. Whether SSA correctly applied SSI income and resource rules under 20 C.F.R. § 416.1201 et seq.`
    );
  }
  lines.push(``);

  lines.push(`II. GROUNDS FOR RECONSIDERATION`);
  lines.push(``);

  if (denialBasis === "medical-not-disabled") {
    lines.push(
      `A. The Initial Determination did not give controlling weight to the opinion(s) of Claimant's treating sources, as required by the longstanding SSA framework for medical opinion evaluation. The treating sources have observed Claimant longitudinally and are best positioned to opine on functional capacity.`
    );
    lines.push(``);
  }

  if (denialBasis === "rfc-light-work") {
    lines.push(
      `A. SSA's RFC of "light work" is not supported by substantial evidence in the longitudinal medical record. Claimant's documented limitations in standing, walking, lifting, and concentration are inconsistent with sustained competitive employment at the light exertional level.`
    );
    lines.push(``);
  }

  if (denialBasis === "duration-insufficient") {
    lines.push(
      `A. The durational element of 20 C.F.R. § 404.1509 is met. Claimant's impairment has lasted, and is expected to continue to last, for a continuous period of at least 12 months as documented by the medical record submitted herewith.`
    );
    lines.push(``);
  }

  if (denialBasis === "income-resources") {
    lines.push(
      `A. The income/resources determination is incorrect. Specific corrections to the income calculation and/or resource valuation are detailed in the appendix.`
    );
    lines.push(``);
  }

  if (a.treatingPhysicianLetter) {
    lines.push(
      `B. New treating-source medical opinion. Attached is a medical-source statement from Claimant's treating physician addressing functional limitations and prognosis. This opinion bears directly on the issues above and should be given the weight afforded under SSA policy.`
    );
    lines.push(``);
  }

  if (a.newMedicalRecords) {
    lines.push(
      `C. New medical records. Records dated after the initial application date are submitted with this request. These records were not before the initial reviewer and document the continued severity of the impairment(s).`
    );
    lines.push(``);
  }

  if (a.consultativeExamDispute) {
    lines.push(
      `D. The SSA Consultative Exam (CE) findings cannot bear the weight placed on them by the Initial Determination. The CE was a single point-in-time evaluation that does not reflect the longitudinal record. To the extent the CE conflicts with treating-source evidence, the treating-source evidence should prevail.`
    );
    lines.push(``);
  }

  lines.push(`III. RELIEF REQUESTED`);
  lines.push(``);
  lines.push(`WHEREFORE, Claimant respectfully requests that SSA:`);
  lines.push(``);
  lines.push(
    `  (a) Reverse the Initial Determination and find Claimant disabled as of the alleged onset date;`
  );
  lines.push(`  (b) Order payment of past-due benefits to which Claimant is entitled; and`);
  if (a.requestDIB) {
    lines.push(
      `  (c) Schedule a Disability Interview by Phone (DIB) prior to issuing the Reconsidered Determination.`
    );
  }
  lines.push(``);

  lines.push(`Respectfully submitted,`);
  lines.push(``);
  lines.push(`_______________________________`);
  lines.push(`${claimant.toUpperCase()}, Claimant`);
  lines.push(`Date: ${today()}`);
  lines.push(``);
  lines.push(`Counsel of Record:`);
  lines.push(`[ATTORNEY / ADVOCATE NAME]`);
  lines.push(`[BAR NUMBER / SSA Representative ID]`);
  lines.push(`[FIRM / CLINIC]`);
  lines.push(`[ADDRESS] · [PHONE] · [EMAIL]`);
  lines.push(``);

  if (a.attachNewEvidence) {
    lines.push(`APPENDIX OF EVIDENCE (attached):`);
    lines.push(`  · Treating-physician medical-source statement`);
    lines.push(`  · Medical records since application date`);
    lines.push(`  · SSA-1696 (Appointment of Representative)`);
    lines.push(`  · Self-addressed stamped envelope for acknowledgment`);
  }

  return lines.join("\n");
}

function claimDescription(c: string): string {
  if (c === "ssdi") return "SSDI (Title II — Disability Insurance Benefits)";
  if (c === "concurrent") return "Concurrent SSI/SSDI claim";
  return "SSI (Title XVI — Supplemental Security Income)";
}

function today(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
