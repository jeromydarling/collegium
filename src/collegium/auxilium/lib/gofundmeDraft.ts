/**
 * GoFundMe draft generator.
 *
 * Takes the user's matter file + dollar amount + first name, and
 * produces a ready-to-paste GoFundMe (or Facebook share, or generic
 * crowdfunding) draft. PII is stripped to first name + county +
 * need-category. The user is in full control — they can edit before
 * publishing, or skip entirely.
 *
 * The redactor is deliberately conservative: anything that looks like
 * a surname, street address, employer, or court case number gets
 * removed.
 */

import type { MatterFile } from "./aiClient";

export type GoFundMeDraft = {
  title: string;
  shortBlurb: string;
  story: string;
  goalDollars: number;
  category: string;
};

/** Strip likely PII from a free-text narrative. */
export function redactPii(text: string): string {
  let out = text;

  // Email addresses
  out = out.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[email]");
  // Phone numbers
  out = out.replace(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, "[phone]");
  // Street numbers + names — "123 Main St", "45 Oak Ave"
  out = out.replace(
    /\b\d{1,5}\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Ln|Lane|Way|Pl|Place|Ct|Court|Dr|Drive)\b/g,
    "[address]"
  );
  // ZIP codes
  out = out.replace(/\b\d{5}(?:-\d{4})?\b/g, "[zip]");
  // SSNs
  out = out.replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[ssn]");
  // Court case numbers — heuristic
  out = out.replace(/\b\d{2,4}-[A-Z]{0,4}-?\d{2,6}\b/g, "[case#]");

  return out;
}

/** Build a draft from the matter file + user-supplied targets. */
export function buildGoFundMeDraft(args: {
  matter: MatterFile;
  firstName: string;
  goalDollars: number;
  county?: string;
  // What the dollars are specifically for (filing fees, transit, etc.).
  needSummary: string;
}): GoFundMeDraft {
  const { matter, firstName, goalDollars, county, needSummary } = args;

  const matterLabel: Record<string, string> = {
    eviction: "an eviction case",
    debt: "a debt collection lawsuit",
    family: "a family court matter",
    "public-benefits": "a denied benefits appeal",
    expungement: "a record-sealing petition",
    immigration: "an immigration case",
    estate: "estate-planning documents",
    annulment: "a marriage tribunal",
  };
  const matterPhrase = matterLabel[matter.matterType] ?? "a legal matter";

  // Title — concrete, first-name only.
  const title = `Help ${firstName} face ${matterPhrase}`;

  const where = county ? ` in ${county}` : "";

  const shortBlurb =
    `${firstName}${where} is facing ${matterPhrase}. ` +
    `They have done the preparation — gathered documents, written down questions, ` +
    `built a matter file — but they need $${goalDollars} to actually walk into help.`;

  // Story — built from the matter file with PII redacted, in their voice.
  const cleanedStory = redactPii(matter.story).trim();
  const cleanedGoals = matter.goals ? redactPii(matter.goals).trim() : "";

  const storyLines: string[] = [];
  storyLines.push(
    `Hi — my name is ${firstName}. I'm asking for help with ${matterPhrase}${where}.`
  );
  storyLines.push("");
  storyLines.push("Here's what's happening:");
  storyLines.push("");
  storyLines.push(cleanedStory);
  if (cleanedGoals) {
    storyLines.push("");
    storyLines.push(`What I'm hoping for: ${cleanedGoals}`);
  }
  storyLines.push("");
  storyLines.push("What the $" + goalDollars + " will pay for:");
  storyLines.push(needSummary);
  storyLines.push("");
  storyLines.push(
    "I prepared all of this with Auxilium, a free intake tool for people who can't afford lawyers. " +
      "Anything left over after my case is over, I will donate forward to the next person on the list."
  );
  storyLines.push("");
  storyLines.push("Thank you for reading. Anything helps.");

  return {
    title,
    shortBlurb,
    story: storyLines.join("\n"),
    goalDollars,
    category: "Family",
  };
}

/** Build the "send by email" body for SVdP / KofC packets. */
export function buildReferralEmailBody(args: {
  matter: MatterFile;
  firstName: string;
  county?: string;
  state?: string;
  goalDollars: number;
  needSummary: string;
  kind: "svdp" | "kofc";
}): { subject: string; body: string } {
  const { matter, firstName, county, state, goalDollars, needSummary, kind } = args;

  const matterLabel: Record<string, string> = {
    eviction: "eviction defense",
    debt: "consumer debt-collection defense",
    family: "family court matter",
    "public-benefits": "denied benefits appeal",
    expungement: "record-sealing petition",
    immigration: "immigration intake",
    estate: "estate-planning documents",
    annulment: "marriage tribunal",
  };
  const matterPhrase = matterLabel[matter.matterType] ?? "civil legal matter";
  const where = [county, state].filter(Boolean).join(", ");

  const subject =
    kind === "svdp"
      ? `SVdP referral request — ${firstName} (${matterPhrase}${where ? `, ${where}` : ""})`
      : `Knights of Columbus referral request — ${firstName} (${matterPhrase}${where ? `, ${where}` : ""})`;

  const cleaned = redactPii(matter.story).trim();

  const greeting =
    kind === "svdp"
      ? "Dear Vincentians,"
      : "Dear Grand Knight,";

  const program =
    kind === "svdp"
      ? "your conference's emergency-assistance / Friends of the Poor program"
      : "your council's Faith-in-Action or Helping-Hands fund";

  const body = [
    greeting,
    "",
    `${firstName}${where ? `, in ${where}` : ""}, is facing a ${matterPhrase}. ` +
      `They have completed an intake with Auxilium — a free, AI-driven intake tool for ` +
      `people in legal crisis — and have a verified matter file ready to bring to a lawyer.`,
    "",
    `They are requesting $${goalDollars} from ${program} to cover the following ` +
      `documented needs:`,
    "",
    needSummary,
    "",
    "Their situation, in their own words (personally identifying information redacted):",
    "",
    cleaned,
    "",
    "Auxilium has redacted likely PII from this referral. The full matter file — " +
      "documents, deadlines, defenses to ask about, the lawyer-consult packet — is " +
      "available directly from " +
      firstName +
      " on request.",
    "",
    "Auxilium is the public-facing surface of Collegium, a federation of Christian and " +
      "Catholic legal communities. We are not a 501(c)(3); we hand this referral to your " +
      "conference for verification and disbursement per your established intake procedure. " +
      "We never touch the funds.",
    "",
    "If you'd like to confirm anything about this referral, please reach out to " +
      firstName +
      " directly at the contact information they will provide separately.",
    "",
    "Thank you for the work your " + (kind === "svdp" ? "conference" : "council") + " does.",
    "",
    "— Sent on behalf of " + firstName + " with Auxilium (auxilium.collegium.app)",
  ].join("\n");

  return { subject, body };
}
