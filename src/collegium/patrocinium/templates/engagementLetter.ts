import type { TemplateDefinition, TemplateAnswers } from "./TemplateRunner";
import type { PatrociniumCase } from "../data/cases";

/**
 * Limited-scope engagement letter.
 *
 * Required by every state when an attorney accepts a Patrocinium matter
 * — scopes what's in, what's out, fees (typically zero or sliding-scale),
 * end-date, and termination rights. The letter is signed by both attorney
 * and client; we generate the lawyer-side draft.
 */
export const engagementLetterTemplate: TemplateDefinition = {
  slug: "engagement-letter",
  title: "Engagement letter — limited scope",
  description:
    "Six questions to draft a model limited-scope engagement letter at the moment a Patrocinium matter is accepted. Pulls the scope, deadline, opposing party, and fee structure from the case brief automatically.",
  jurisdictionNote:
    "Model language drafted for MA Rule 1.2(c) limited-scope; analogous rules exist in every U.S. jurisdiction (CA Rule 1.2(b), NY 1.2(c), etc.). Confirm local form requirements (some jurisdictions require limited-appearance notices) before relying on this for filed matters.",
  latin: "Conventio",
  requiredIds: ["scopeStatement", "feeArrangement"],
  defaults: { withdrawalRights: true, fileTransfer: true },
  questions: [
    {
      id: "scopeStatement",
      type: "radio",
      prompt: "What's the scope you're taking on?",
      hint: "The most important field in any limited-scope letter — what you'll do and what you explicitly won't.",
      options: [
        { value: "advice-call", label: "One-time advice call" },
        { value: "document-review", label: "Document review + memo" },
        { value: "single-filing", label: "Single filing or hearing" },
        { value: "full-representation", label: "Full representation (one matter)" },
        { value: "clinic-shift", label: "Clinic shift (one session)" },
      ],
    },
    {
      id: "feeArrangement",
      type: "radio",
      prompt: "Fee structure?",
      hint: "Most Patrocinium engagements are pro bono. Low-bono flat or sliding-scale fees flow through Stripe Connect.",
      options: [
        { value: "pro-bono", label: "Pro bono (no fee)" },
        { value: "flat-fee", label: "Flat fee (paid through Patrocinium)" },
        { value: "sliding-scale", label: "Sliding-scale hourly (paid through Patrocinium)" },
      ],
    },
    {
      id: "courtAppearance",
      type: "toggle",
      prompt: "Will you make a court appearance?",
      hint: "If yes, adds the Limited Appearance notice paragraph required in most jurisdictions.",
    },
    {
      id: "interpreterNeeded",
      type: "toggle",
      prompt: "Client needs an interpreter for ongoing communication?",
      hint: "Adds the interpreter-coordination paragraph and names who covers the cost (Patrocinium does, for in-network matters).",
    },
    {
      id: "withdrawalRights",
      type: "toggle",
      prompt: "Include client's right to terminate?",
      hint: "Standard inclusion — protects the client and you. Strongly recommended.",
    },
    {
      id: "fileTransfer",
      type: "toggle",
      prompt: "Include file-transfer clause at engagement end?",
      hint: "On completion, all your work product goes to the client. They control whether to share it with the next lawyer.",
    },
  ],
  buildDraft,
};

function buildDraft(a: TemplateAnswers, c: PatrociniumCase): string {
  const client = c.matter.requester.split(" (")[0]; // strip parenthetical
  const scope = (a.scopeStatement as string) || "single-filing";
  const fee = (a.feeArrangement as string) || "pro-bono";

  const lines: string[] = [];
  lines.push(`[FIRM / CLINIC LETTERHEAD]`);
  lines.push(``);
  lines.push(today());
  lines.push(``);
  lines.push(client);
  lines.push(`[CLIENT ADDRESS or "Via parish — St. Procopius / St. Anthony / etc."]`);
  lines.push(``);
  lines.push(`Re: Engagement for limited-scope legal representation`);
  lines.push(`    Matter: ${c.meta.goal}`);
  lines.push(``);
  lines.push(`Dear ${client.split(" ")[0]},`);
  lines.push(``);
  lines.push(
    `Thank you for trusting our practice and the Collegium Patrocinium network with your matter. This letter sets out the terms under which I am willing to represent you. Please read it carefully and let me know if anything is unclear before signing.`
  );
  lines.push(``);

  lines.push(`1. SCOPE OF REPRESENTATION`);
  lines.push(``);
  lines.push(`${scopeText(scope, c)}`);
  lines.push(``);
  lines.push(
    `This is a LIMITED-SCOPE engagement under Massachusetts Rule of Professional Conduct 1.2(c) (or the analogous rule in your jurisdiction). I am not representing you for any other matter, and I am not your lawyer for general purposes. If a related issue arises that falls outside the scope above, we will discuss whether to amend this engagement before I take any action on it.`
  );
  lines.push(``);

  if (a.courtAppearance) {
    lines.push(`2. LIMITED APPEARANCE`);
    lines.push(``);
    lines.push(
      `I will file a Notice of Limited Appearance with the court identifying the scope of my representation. When the scope is complete, I will file a Notice of Withdrawal of Limited Appearance. Opposing counsel and the court will be on notice of the scope from the outset.`
    );
    lines.push(``);
  }

  lines.push(`${a.courtAppearance ? "3" : "2"}. FEES`);
  lines.push(``);
  lines.push(`${feeText(fee, c)}`);
  lines.push(``);

  if (a.interpreterNeeded) {
    lines.push(`${a.courtAppearance ? "4" : "3"}. INTERPRETATION`);
    lines.push(``);
    lines.push(
      `I understand that you are most comfortable communicating in a language other than English. The Patrocinium network coordinates a qualified interpreter at no cost to you for any meeting we hold and for any court hearing requiring one. I will arrange interpretation in advance for each meeting.`
    );
    lines.push(``);
  }

  const section = (n: number, label: string) => {
    lines.push(`${n}. ${label}`);
    lines.push(``);
  };

  let n = a.courtAppearance ? 4 : 3;
  if (a.interpreterNeeded) n++;

  section(n++, "CONFIDENTIALITY");
  lines.push(
    `Everything you tell me about your matter is confidential and protected by the attorney-client privilege. I will not share information with anyone outside the limited circle of people working on your case — and only as needed to serve you.`
  );
  lines.push(``);

  section(n++, "REFERRING CHAPTER & CLOSURE-LOOP");
  lines.push(
    `Your matter was referred to me through ${c.matter.referredBy ?? "the Patrocinium network"}. With your separate, written consent, I may share with the referring parish a SHORT pastoral-care summary at the end of representation. This summary will NEVER contain confidential legal substance — only what the parish can offer in continued accompaniment. Your consent for this is separately documented and you may withdraw it at any time.`
  );
  lines.push(``);

  section(n++, "DURATION AND COMPLETION");
  if (c.meta.deadlineDate) {
    lines.push(
      `This engagement is expected to conclude on or about ${formatDate(c.meta.deadlineDate)}, when the scope above is complete. If unforeseen complications arise, we will discuss whether to extend the engagement in writing.`
    );
  } else {
    lines.push(
      `This engagement concludes when the scope above is complete. If unforeseen complications arise, we will discuss whether to extend the engagement in writing.`
    );
  }
  lines.push(``);

  if (a.withdrawalRights) {
    section(n++, "YOUR RIGHT TO TERMINATE");
    lines.push(
      `You have the right to end this engagement at any time, for any reason. If you do, you owe nothing further. I will return your file to you within seven days. I will not stop representing you mid-matter without giving you written notice and reasonable time to find replacement counsel.`
    );
    lines.push(``);
  }

  if (a.fileTransfer) {
    section(n++, "FILE AT COMPLETION");
    lines.push(
      `When this engagement is complete (or if you terminate it earlier), I will provide you with a copy of all materials I have generated for your matter — drafts, filings, correspondence, and notes. The originals are yours. You decide whether to share them with any future lawyer.`
    );
    lines.push(``);
  }

  section(n++, "WHAT TO DO NEXT");
  lines.push(
    `If you agree to the terms above, please sign and date the bottom of this letter and return it to me. I will counter-sign and send you a copy. Once both signatures are in place, our engagement begins.`
  );
  lines.push(``);
  lines.push(
    `If anything is unclear, please call or write — I would much rather take a few extra minutes to explain than have you sign something you don't fully understand.`
  );
  lines.push(``);
  lines.push(`Sincerely,`);
  lines.push(``);
  lines.push(`_______________________________`);
  lines.push(`[ATTORNEY NAME], BBO # _______`);
  lines.push(`[FIRM / CLINIC]`);
  lines.push(`[PHONE] · [EMAIL]`);
  lines.push(``);
  lines.push(`----------------------------------------------------------------`);
  lines.push(``);
  lines.push(`CLIENT ACKNOWLEDGMENT AND CONSENT`);
  lines.push(``);
  lines.push(
    `I have read this letter. I understand the scope and limits of representation described above. I agree to the terms.`
  );
  lines.push(``);
  lines.push(`_______________________________      _________________`);
  lines.push(`${client}                              Date`);
  lines.push(``);
  lines.push(`Witnessed by:`);
  lines.push(``);
  lines.push(`_______________________________      _________________`);
  lines.push(`[INTERPRETER / WITNESS]              Date`);

  return lines.join("\n");
}

function scopeText(scope: string, c: PatrociniumCase): string {
  switch (scope) {
    case "advice-call":
      return `I will provide ONE consultation of up to 60 minutes regarding ${c.meta.goal}. I will answer your questions, explain the law as it applies to your situation, and identify next steps. I will NOT file anything on your behalf, appear in court, or contact third parties. After the consultation, you decide what to do with the information.`;
    case "document-review":
      return `I will review the documents you provide regarding ${c.meta.goal} and provide a written one-page memo identifying issues, risks, and recommended next steps. I will not negotiate with opposing parties, draft new documents on your behalf, or appear in court.`;
    case "single-filing":
      return `I will represent you for the limited purpose of ${c.meta.goal}. Specifically, I will prepare and file [SPECIFIC FILING — e.g., the Answer to the eviction complaint], and appear at any related hearing necessary to that filing. I will NOT represent you beyond that filing or any subsequent matter that may arise.`;
    case "full-representation":
      return `I will represent you for the full duration of the following matter: ${c.meta.goal}. My representation includes intake, research, drafting, filings, court appearances, and final resolution of this single matter. I will NOT represent you for any other legal matter you may have now or in the future.`;
    case "clinic-shift":
      return `I will meet with you during a single clinic session on [DATE] regarding ${c.meta.goal}. I will provide advice and may complete one short document if appropriate, but I will not undertake any continuing representation after the session ends.`;
    default:
      return `I will represent you for: ${c.meta.goal}.`;
  }
}

function feeText(fee: string, c: PatrociniumCase): string {
  switch (fee) {
    case "pro-bono":
      return `My representation is PRO BONO. There is no fee for my services and no expectation of payment of any kind. I will not bill you, and you owe me nothing for the time I spend on your matter. Actual costs (e.g., filing fees, copying) will either be covered by the network or, where unavailable, waived through the fee-waiver process.`;
    case "flat-fee":
      return `My fee is a FLAT FEE of $[AMOUNT], payable to the Patrocinium network at engagement. The full amount is what you pay; there are no additional charges. The Patrocinium network handles the payment processing; my account receives the funds directly. You will receive a receipt. If for any reason I cannot complete the work, the fee is refundable in proportion to the work remaining.`;
    case "sliding-scale":
      return `My fee is a SLIDING-SCALE hourly rate of $[RATE]/hour, set based on the federal poverty level (FPL) tier appropriate to your household income. Total fees are capped at $[CAP]. Payment is collected through the Patrocinium network — you will receive an invoice and can pay by card or bank transfer; no payment goes to me personally. If your circumstances change during representation, we will revisit the rate.`;
    default:
      return `Fee arrangement: [DESCRIBE].`;
  }
}

function today(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
