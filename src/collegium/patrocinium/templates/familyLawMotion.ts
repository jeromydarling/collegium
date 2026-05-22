import type { TemplateDefinition, TemplateAnswers } from "./TemplateRunner";
import type { PatrociniumCase } from "../data/cases";

/**
 * Family-law motion — custody or support modification.
 *
 * Generates a working draft of a modification motion that addresses the
 * two most common pro bono family-law matters: custody modification (best
 * interests + material change) and support modification (substantial
 * change in circumstances). Includes the required notice + service block.
 */
export const familyLawMotionTemplate: TemplateDefinition = {
  slug: "family-law-modification",
  title: "Custody / support modification motion",
  description:
    "Nine questions to draft a custody-or-support modification motion. Builds the legal framework (material change in circumstances, best interests of the child) and the relief block. Works for both modification types.",
  jurisdictionNote:
    "Generic family-court framework. Confirm local form requirements (probate court vs. family court, specific captions) before filing. The notice + service block uses standard 14-day notice; jurisdictions vary.",
  latin: "Mutatio",
  requiredIds: ["modificationType", "currentOrderType", "materialChange"],
  defaults: { demandHearing: true, requestFeeWaiver: true },
  questions: [
    {
      id: "modificationType",
      type: "radio",
      prompt: "What kind of modification?",
      options: [
        { value: "custody", label: "Custody / parenting time" },
        { value: "support", label: "Child support" },
        { value: "both", label: "Both" },
      ],
    },
    {
      id: "currentOrderType",
      type: "radio",
      prompt: "Current order type?",
      hint: "Establishes which statutory framework applies.",
      options: [
        { value: "divorce-judgment", label: "Divorce judgment" },
        { value: "separation-agreement", label: "Separation agreement" },
        { value: "paternity-judgment", label: "Paternity / non-marital order" },
        { value: "temporary-order", label: "Temporary order" },
      ],
    },
    {
      id: "materialChange",
      type: "radio",
      prompt: "What is the material change in circumstances?",
      hint: "The threshold for any modification. Pick the most applicable.",
      options: [
        { value: "income-change", label: "Substantial income change" },
        { value: "relocation", label: "Relocation by a parent" },
        { value: "child-need-change", label: "Child's needs changed (medical, school)" },
        { value: "safety", label: "Safety concern" },
        { value: "schedule-conflict", label: "Schedule unworkability" },
      ],
    },
    {
      id: "abuseConcern",
      type: "toggle",
      prompt: "Domestic-violence or abuse concern raised?",
      hint: "Adds the statutory presumption-against-custody framework and a request for expedited hearing.",
    },
    {
      id: "guardianAdLitem",
      type: "toggle",
      prompt: "Request guardian ad litem appointment?",
      hint: "For contested custody, GAL is common. Adds the motion to the relief block.",
    },
    {
      id: "domesticReliefOnly",
      type: "toggle",
      prompt: "Limited to domestic relief (no DCF/CPS overlap)?",
      hint: "When child-welfare agency is involved, joinder and coordination language gets added.",
    },
    {
      id: "demandHearing",
      type: "toggle",
      prompt: "Request hearing?",
      hint: "Yes for all contested; only no if pre-stipulated.",
    },
    {
      id: "requestFeeWaiver",
      type: "toggle",
      prompt: "Request indigent fee waiver?",
      hint: "For pro bono clients, almost always yes. Adds the supporting affidavit reference.",
    },
    {
      id: "interimRelief",
      type: "toggle",
      prompt: "Request interim/temporary order pending hearing?",
      hint: "When the underlying change is urgent — safety, school, missed support payments.",
    },
  ],
  buildDraft,
};

function buildDraft(a: TemplateAnswers, c: PatrociniumCase): string {
  const movant = c.matter.requester;
  const modType = (a.modificationType as string) || "custody";
  const orderType = (a.currentOrderType as string) || "divorce-judgment";
  const change = (a.materialChange as string) || "income-change";

  const lines: string[] = [];
  lines.push(`COMMONWEALTH OF MASSACHUSETTS`);
  lines.push(`PROBATE AND FAMILY COURT`);
  lines.push(`[COUNTY] DIVISION`);
  lines.push(``);
  lines.push(`${movant.toUpperCase()},`);
  lines.push(`    Movant / Plaintiff,`);
  lines.push(``);
  lines.push(`    v.`);
  lines.push(``);
  lines.push(`[OPPOSING PARTY],`);
  lines.push(`    Respondent / Defendant.`);
  lines.push(``);
  lines.push(`Docket No. _____________`);
  lines.push(``);
  lines.push(`MOTION TO MODIFY ${modificationCaption(modType)}`);
  lines.push(``);

  lines.push(
    `Now comes the Movant, ${movant}, by and through undersigned counsel, and respectfully moves this Honorable Court for an Order modifying the ${orderCaption(orderType)} entered on or about [DATE OF ORIGINAL ORDER], on the grounds set out below.`
  );
  lines.push(``);

  lines.push(`I. PROCEDURAL HISTORY`);
  lines.push(``);
  lines.push(`1. The Movant and Respondent are the parents of [CHILD NAME], born [DOB].`);
  lines.push(
    `2. The current ${orderCaption(orderType)} was entered on or about [DATE OF ORIGINAL ORDER] and provides for [SUMMARY OF CURRENT TERMS].`
  );
  lines.push(`3. [ADD ANY INTERVENING MODIFICATIONS OR EVENTS]`);
  lines.push(``);

  lines.push(`II. MATERIAL CHANGE IN CIRCUMSTANCES`);
  lines.push(``);
  lines.push(
    `4. Since the entry of the current Order, a material and substantial change in circumstances has occurred:`
  );
  lines.push(``);
  lines.push(`   ${materialChangeText(change)}`);
  lines.push(``);

  if (a.abuseConcern) {
    lines.push(
      `5. The change includes a safety concern. Under M.G.L. c. 208 § 31A and the analogous best-interests framework, evidence of abuse triggers a rebuttable presumption against awarding sole or shared legal or physical custody to the perpetrator. Movant intends to introduce evidence at hearing supporting this presumption.`
    );
    lines.push(``);
  }

  lines.push(`III. BEST INTERESTS OF THE CHILD`);
  lines.push(``);
  if (modType === "support") {
    lines.push(
      `6. Modification of child support is appropriate because there exists a substantial change in circumstances under M.G.L. c. 208 § 28 and the Massachusetts Child Support Guidelines. The current calculation no longer reflects the parties' incomes or the child's needs.`
    );
  } else {
    lines.push(
      `6. Modification serves the best interests of the child. The child's welfare — physical, emotional, educational, and spiritual — is the polestar of this analysis. The proposed modification advances those interests for the reasons stated above.`
    );
  }
  lines.push(``);

  if (a.guardianAdLitem) {
    lines.push(`IV. REQUEST FOR GUARDIAN AD LITEM`);
    lines.push(``);
    lines.push(
      `Movant respectfully requests appointment of a Guardian ad Litem to assist the Court in evaluating the child's best interests. The factual disputes underlying this motion warrant independent inquiry.`
    );
    lines.push(``);
  }

  if (a.interimRelief) {
    lines.push(`V. INTERIM RELIEF`);
    lines.push(``);
    lines.push(
      `Pending final hearing on this Motion, Movant requests entry of a Temporary Order [SUMMARIZE TEMPORARY RELIEF — e.g., temporary modified parenting schedule pending GAL report; temporary adjustment of support pending recalculation].`
    );
    lines.push(``);
  }

  if (!a.domesticReliefOnly) {
    lines.push(`VI. COORDINATION WITH CHILD-WELFARE AGENCY`);
    lines.push(``);
    lines.push(
      `Movant notes that the Department of Children and Families (or analogous state agency) [HAS / HAS NOT] been involved with this family. Joinder of the agency's findings is requested as appropriate.`
    );
    lines.push(``);
  }

  lines.push(`VII. RELIEF REQUESTED`);
  lines.push(``);
  lines.push(`WHEREFORE, Movant respectfully requests that this Court:`);
  lines.push(``);
  let n = 1;
  if (modType === "custody" || modType === "both") {
    lines.push(
      `  (${letter(n++)}) Modify the existing order to provide for [PROPOSED CUSTODY / PARENTING TIME];`
    );
  }
  if (modType === "support" || modType === "both") {
    lines.push(
      `  (${letter(n++)}) Recalculate child support consistent with the current Massachusetts Child Support Guidelines and order modified payment as appropriate;`
    );
  }
  if (a.guardianAdLitem) {
    lines.push(`  (${letter(n++)}) Appoint a Guardian ad Litem;`);
  }
  if (a.interimRelief) {
    lines.push(`  (${letter(n++)}) Enter the Temporary Order requested in Section V;`);
  }
  if (a.demandHearing) {
    lines.push(`  (${letter(n++)}) Schedule a hearing on this Motion;`);
  }
  if (a.requestFeeWaiver) {
    lines.push(
      `  (${letter(n++)}) Grant Movant's contemporaneously-filed Affidavit of Indigency and Waiver of Filing Fees;`
    );
  }
  lines.push(`  (${letter(n++)}) Grant such other and further relief as the Court deems just and proper.`);
  lines.push(``);

  lines.push(`Respectfully submitted,`);
  lines.push(``);
  lines.push(`${movant.toUpperCase()},`);
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
  lines.push(``);

  lines.push(`CERTIFICATE OF SERVICE`);
  lines.push(``);
  lines.push(
    `I, [ATTORNEY NAME], hereby certify that on the date set forth above I served a true copy of the foregoing Motion on the Respondent [OR Respondent's counsel] by [MAIL / EMAIL / HAND DELIVERY] at [ADDRESS].`
  );
  lines.push(``);
  lines.push(`_______________________________`);
  lines.push(`[ATTORNEY NAME]`);

  return lines.join("\n");
}

function modificationCaption(t: string): string {
  if (t === "support") return "CHILD SUPPORT";
  if (t === "both") return "CUSTODY AND CHILD SUPPORT";
  return "CUSTODY / PARENTING TIME";
}

function orderCaption(t: string): string {
  switch (t) {
    case "separation-agreement":
      return "Separation Agreement";
    case "paternity-judgment":
      return "Paternity / Non-Marital Order";
    case "temporary-order":
      return "Temporary Order";
    case "divorce-judgment":
    default:
      return "Divorce Judgment";
  }
}

function materialChangeText(c: string): string {
  switch (c) {
    case "income-change":
      return "A substantial change in the income of one or both parties has occurred. Movant's [or Respondent's] income has [increased / decreased] from approximately $[PRIOR FIGURE] at the time of the original Order to approximately $[CURRENT FIGURE] today. This results in a Massachusetts Child Support Guidelines presumptive amount that differs from the current order by more than the threshold percentage warranting modification.";
    case "relocation":
      return "[PARENT NAME] has [proposes to] relocate from [PRIOR LOCATION] to [NEW LOCATION], a distance of approximately [MILES] miles. The proposed relocation materially alters the parenting plan currently in effect and requires Court review under the removal framework of Yannas v. Frondistou-Yannas, 395 Mass. 704 (1985).";
    case "child-need-change":
      return "The child's circumstances have materially changed. Specifically, [DESCRIBE: medical diagnosis, change in school placement, developmental need, mental-health need] has emerged since the entry of the prior Order and requires accommodation that the existing Order does not provide.";
    case "safety":
      return "Movant has become aware of a safety concern that did not exist (or was not known) at the time of the prior Order. Specifically, [DESCRIBE CONCERN — domestic violence, substance abuse, neglect — with dates and corroborating documentation as available].";
    case "schedule-conflict":
      return "The parenting schedule provided in the existing Order has become unworkable in practice. [DESCRIBE: work-schedule changes, school changes, transportation realities] necessitate modification of the parenting time to serve the child's stability and best interests.";
    default:
      return "A material change in circumstances has occurred warranting modification of the existing Order. [DESCRIBE WITH PARTICULARITY.]";
  }
}

function letter(n: number): string {
  return String.fromCharCode(96 + n);
}
