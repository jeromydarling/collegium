import type { TemplateDefinition, TemplateAnswers } from "./TemplateRunner";
import type { PatrociniumCase } from "../data/cases";

/**
 * Padilla advisal — immigration consequences memo for criminal defense.
 *
 * Padilla v. Kentucky, 559 U.S. 356 (2010) requires defense counsel to
 * advise non-citizen clients of immigration consequences of guilty pleas.
 * This template produces the advisal memo a defender shares with their
 * client before the plea — what the conviction means for status, and
 * what alternative charges might be safer.
 */
export const padillaAdvisalTemplate: TemplateDefinition = {
  slug: "padilla-advisal",
  title: "Padilla immigration-consequences advisal",
  description:
    "Eight questions to draft the client-facing advisal memo required by Padilla v. Kentucky for non-citizen criminal defendants. Translates a proposed plea into immigration-consequence plain English.",
  jurisdictionNote:
    "Padilla applies in every U.S. jurisdiction. Use this advisal before any plea where the client is not a U.S. citizen. When immigration consequences are unclear, consult a crimmigration specialist before advising.",
  latin: "Monitio",
  requiredIds: ["statusCategory", "chargeCategory"],
  defaults: { writtenAdvisal: true },
  questions: [
    {
      id: "statusCategory",
      type: "radio",
      prompt: "Client's current immigration status?",
      hint: "Different statuses face different exposure. If unknown, advise conservatively and refer for status verification.",
      options: [
        { value: "lpr", label: "LPR (green card)" },
        { value: "tps-daca", label: "TPS or DACA" },
        { value: "asylum-pending", label: "Asylum pending" },
        { value: "undocumented", label: "No status" },
        { value: "visa", label: "Nonimmigrant visa" },
        { value: "naturalizing", label: "Pending naturalization" },
      ],
    },
    {
      id: "chargeCategory",
      type: "radio",
      prompt: "Charge category in the proposed plea?",
      hint: "Aggravated felony triggers mandatory deportation. CIMT triggers inadmissibility. Controlled substance and domestic violence have their own statutory triggers.",
      options: [
        { value: "aggravated-felony", label: "Aggravated felony (8 USC § 1101(a)(43))" },
        { value: "cimt", label: "Crime involving moral turpitude (CIMT)" },
        { value: "controlled-substance", label: "Controlled substance" },
        { value: "domestic-violence", label: "Domestic violence" },
        { value: "firearm", label: "Firearm offense" },
        { value: "petty-non-cimt", label: "Petty / non-CIMT misdemeanor" },
      ],
    },
    {
      id: "willPlead",
      type: "toggle",
      prompt: "Is the client currently inclined to accept the plea?",
      hint: "Shapes the tone of the memo — \"these are the consequences if you accept\" vs. \"these are the consequences to weigh.\"",
    },
    {
      id: "alternativesExist",
      type: "toggle",
      prompt: "Are there immigration-safer alternative charges on the table?",
      hint: "Many DAs will accept a swap (e.g. assault to disorderly persons) if asked. The memo names what's been offered.",
    },
    {
      id: "willEnterFamilyHere",
      type: "toggle",
      prompt: "Does the client have a U.S. citizen spouse or child likely to petition?",
      hint: "Future relief through family petition is materially affected by certain pleas — the memo names that explicitly.",
    },
    {
      id: "prior",
      type: "toggle",
      prompt: "Does the client have prior convictions or removal proceedings?",
      hint: "Compounds significantly. A second CIMT, even minor, triggers deportability.",
    },
    {
      id: "writtenAdvisal",
      type: "toggle",
      prompt: "Provide written advisal to client (recommended)?",
      hint: "Padilla compliance is strongest with a signed written advisal in the client's file.",
    },
    {
      id: "deferToCrimmig",
      type: "toggle",
      prompt: "Refer to crimmigration specialist for confirmation?",
      hint: "When in doubt, refer. Costs the defender nothing; protects the client.",
    },
  ],
  buildDraft,
};

function buildDraft(a: TemplateAnswers, c: PatrociniumCase): string {
  const client = c.matter.requester;
  const status = (a.statusCategory as string) || "lpr";
  const charge = (a.chargeCategory as string) || "cimt";

  const lines: string[] = [];
  lines.push(`PADILLA ADVISAL — IMMIGRATION CONSEQUENCES OF PROPOSED PLEA`);
  lines.push(`(Confidential · For Client File · Padilla v. Kentucky, 559 U.S. 356)`);
  lines.push(``);
  lines.push(`Client: ${client}`);
  lines.push(`Date: ${today()}`);
  lines.push(`Counsel: [ATTORNEY NAME], BBO # _______`);
  lines.push(`Proposed plea: [STATUTE / OFFENSE]`);
  lines.push(``);

  lines.push(`I. SUMMARY OF YOUR CURRENT STATUS`);
  lines.push(``);
  lines.push(`${statusSummary(status)}`);
  lines.push(``);

  lines.push(`II. IMMIGRATION CONSEQUENCE OF THE PROPOSED PLEA`);
  lines.push(``);
  lines.push(`${chargeConsequence(status, charge)}`);
  lines.push(``);

  if (a.willEnterFamilyHere) {
    lines.push(
      `Because you have or expect to have a U.S. citizen family member who may petition for you, this conviction may also affect your eligibility for future status through that petition. Some pleas bar adjustment of status entirely; others require waivers that may or may not be available.`
    );
    lines.push(``);
  }

  if (a.prior) {
    lines.push(
      `You have prior convictions and/or prior removal proceedings. This compounds the consequences described above significantly. A second CIMT — even a minor one — generally renders an LPR deportable. Please discuss your prior record in detail with counsel before pleading.`
    );
    lines.push(``);
  }

  lines.push(`III. WHAT THIS MEANS IN PLAIN ENGLISH`);
  lines.push(``);
  lines.push(`${plainEnglish(status, charge)}`);
  lines.push(``);

  if (a.alternativesExist) {
    lines.push(`IV. SAFER ALTERNATIVE CHARGES`);
    lines.push(``);
    lines.push(
      `The prosecution has offered (or may be willing to consider) one or more alternative charges that carry materially less immigration risk. Your defense counsel will pursue those before any plea is entered. Possible alternatives discussed:`
    );
    lines.push(``);
    lines.push(`  [LIST ALTERNATIVES PROPOSED, e.g. disorderly persons, simple assault without DV designation]`);
    lines.push(``);
  }

  lines.push(`V. YOUR RIGHT TO DECLINE`);
  lines.push(``);
  lines.push(
    `You have the right to reject this plea offer and take the case to trial. You also have the right to a trial-vs-plea consultation with an immigration specialist before deciding. Pleading is YOUR decision, not your lawyer's. Take the time you need.`
  );
  lines.push(``);

  if (a.deferToCrimmig) {
    lines.push(`VI. SPECIALIST REFERRAL`);
    lines.push(``);
    lines.push(
      `Counsel will, before any plea is entered, consult a crimmigration specialist for written confirmation of the consequences described above. Please do not authorize the plea before that consultation is complete.`
    );
    lines.push(``);
  }

  lines.push(`CLIENT ACKNOWLEDGMENT`);
  lines.push(``);
  lines.push(
    `I have read (or had read to me) this advisal. My defense counsel has discussed it with me. I understand that the proposed plea may have the consequences described above, and I am proceeding (or not proceeding) with full awareness of those consequences.`
  );
  lines.push(``);
  lines.push(`_______________________________      _________________`);
  lines.push(`${client}                              Date`);
  lines.push(``);
  lines.push(`_______________________________      _________________`);
  lines.push(`Defense counsel                       Date`);

  if (a.writtenAdvisal === false) {
    lines.push(``);
    lines.push(
      `[DRAFTING NOTE: Written advisal not selected. Padilla compliance is strongest with a signed written advisal in the client file. Reconsider before proceeding.]`
    );
  }

  return lines.join("\n");
}

function statusSummary(status: string): string {
  const map: Record<string, string> = {
    lpr: "You are a Lawful Permanent Resident (LPR / green card holder). Certain convictions can make you deportable or inadmissible upon re-entry, and can block naturalization. You are NOT immune from removal simply because you have a green card.",
    "tps-daca":
      "You have Temporary Protected Status or DACA. These are administrative protections, not permanent status. Many convictions can render you ineligible to renew. Some convictions trigger removal proceedings immediately upon program revocation.",
    "asylum-pending":
      "You have a pending asylum application. Certain convictions render you inadmissible for adjustment to LPR if your asylum is granted, and others bar asylum entirely.",
    undocumented:
      "You do not currently have lawful status. A conviction can be the trigger for removal proceedings that would otherwise not be initiated. It can also bar you from future relief such as cancellation of removal.",
    visa:
      "You hold a nonimmigrant visa. A conviction may render you inadmissible upon re-entry, may cause visa revocation, and may bar future changes of status.",
    naturalizing:
      "You have a pending naturalization application. Certain convictions during the statutory good-moral-character period (typically five years) will result in denial. Some convictions are also grounds for deportation.",
  };
  return map[status] ?? map.lpr;
}

function chargeConsequence(status: string, charge: string): string {
  if (charge === "aggravated-felony") {
    return `The proposed plea is or includes an AGGRAVATED FELONY under 8 USC § 1101(a)(43). This is the most serious category. For nearly every status, an aggravated-felony conviction results in mandatory removal with extremely limited relief. Most waivers are unavailable. ${status === "lpr" ? "Even as an LPR, you would lose your status and be deported." : ""}`;
  }
  if (charge === "cimt") {
    return `The proposed plea is a Crime Involving Moral Turpitude (CIMT). A single CIMT within 5 years of admission with a possible sentence of one year or more renders an LPR deportable. Two CIMTs at any time render any non-citizen deportable. For visa holders, even one CIMT can trigger inadmissibility on re-entry.`;
  }
  if (charge === "controlled-substance") {
    return `The proposed plea involves a controlled substance. Almost any controlled-substance conviction (other than a single offense of simple possession of 30 grams or less of marijuana) renders a non-citizen deportable AND inadmissible. There is no good-moral-character waiver for this.`;
  }
  if (charge === "domestic-violence") {
    return `The proposed plea is a domestic-violence offense. Under 8 USC § 1227(a)(2)(E), a domestic violence conviction (or violation of a DV protective order) renders any non-citizen deportable. The statutory definition is broader than the criminal DV statute — even non-felony pleas can trigger this.`;
  }
  if (charge === "firearm") {
    return `The proposed plea involves a firearm offense. Under 8 USC § 1227(a)(2)(C), any firearm conviction renders a non-citizen deportable. There is no minimum sentence threshold.`;
  }
  if (charge === "petty-non-cimt") {
    return `The proposed plea is a petty, non-CIMT misdemeanor. This category generally does not trigger removability standing alone, but combined with other factors (prior record, status type) may still affect future immigration relief. Confirm in writing before pleading.`;
  }
  return `The immigration consequence of this plea requires individualized analysis. Counsel will obtain written advice from a crimmigration specialist before any plea is entered.`;
}

function plainEnglish(status: string, charge: string): string {
  if (charge === "aggravated-felony") {
    return `If you accept this plea, you will almost certainly be deported. No amount of time in the country, no family ties, no good behavior since, can override an aggravated-felony conviction. Do not plead until you have spoken with a crimmigration specialist.`;
  }
  if (charge === "controlled-substance") {
    return `If you accept this plea, you can be detained by ICE the moment you leave the courtroom. There is almost no way to avoid removal once a controlled-substance conviction is on your record (with very narrow exceptions for small marijuana possession).`;
  }
  if (charge === "domestic-violence") {
    return `If you accept this plea, you become deportable. Even if you are currently free, ICE can begin proceedings at any point. This is true even if you are an LPR.`;
  }
  if (charge === "cimt" && status === "lpr") {
    return `If you accept this plea, you may be deportable, depending on (a) how long you have been here, (b) what your sentence is, and (c) whether you have any prior convictions. Talk to your lawyer about which exact statute the plea is to, and ask for the immigration consequence in writing.`;
  }
  return `If you accept this plea, your immigration status may be affected. Please do not plead until your lawyer has explained the specific consequences in writing.`;
}

function today(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
