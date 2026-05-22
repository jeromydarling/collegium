/**
 * AI client for the Auxilium intake interview.
 *
 * Posture: this client talks to the user *the way a calm civil legal-aid
 * lawyer would* during a first intake — one open-ended question at a
 * time, never legal advice, plain English, willing to acknowledge what
 * the person just said before moving on.
 *
 * Today this module ships a fully-mocked implementation that behaves
 * conversationally — the user sees a real chat, real follow-ups, and a
 * personalized matter file at the end. The mock is good enough to demo
 * the entire experience without a backend.
 *
 * In production, two paths:
 *   1. Lovable AI (Gemini) — when this codebase is re-imported into
 *      Lovable, the connector exposes a model-call endpoint that the
 *      `callModel` function below can drop into. The system prompt is
 *      defined here so it travels with the abstraction.
 *   2. Cloudflare Worker — a 40-line proxy holding the Gemini API key
 *      that forwards generateContent requests to v1beta/models/gemini-2.5-flash.
 *
 * Either path: the rest of the app is unchanged. Flip
 * `VITE_AI_PROXY_URL` and the abstraction switches.
 */

import {
  evictionInterview,
  type InterviewScript,
  type InterviewQuestion,
  type ExtractedFacts,
} from "../data/interview";

const MOCK = !import.meta.env.VITE_AI_PROXY_URL;

/** A single message in the interview transcript. */
export type ChatMessage = {
  role: "ai" | "user";
  text: string;
  /** Echoes which interview step generated this — for the mock state machine. */
  stepId?: string;
};

/**
 * Pick the next question. In the mock, this is a deterministic walk
 * through the script with light branching based on extracted facts.
 * In production, this would be a single model call with the full
 * transcript + system prompt, returning the AI's next message.
 */
export async function nextQuestion(args: {
  transcript: ChatMessage[];
  facts: ExtractedFacts;
  matterType: string;
}): Promise<{ message: ChatMessage; done: boolean }> {
  if (MOCK) return mockNextQuestion(args);
  return realNextQuestion(args);
}

/**
 * Extract structured facts from the most recent user reply. Mock
 * implementation does keyword detection; production uses Gemini with
 * a JSON-mode prompt that returns a typed ExtractedFacts diff.
 */
export async function extractFacts(args: {
  question: InterviewQuestion;
  userReply: string;
  current: ExtractedFacts;
}): Promise<ExtractedFacts> {
  if (MOCK) return mockExtractFacts(args);
  return realExtractFacts(args);
}

/**
 * Synthesize the matter file once the interview is complete.
 * Mock returns a hand-shaped file using the gathered facts;
 * production calls Gemini with the full transcript + extraction +
 * a system prompt that produces a JSON matter file.
 */
export async function synthesizeMatterFile(args: {
  transcript: ChatMessage[];
  facts: ExtractedFacts;
  matterType: string;
}): Promise<MatterFile> {
  if (MOCK) return mockSynthesizeMatterFile(args);
  return realSynthesizeMatterFile(args);
}

// ── Types the rest of the app uses ─────────────────────────────────

export type MatterFile = {
  matterType: string;
  createdAt: string;
  jurisdiction: { city?: string; state?: string };
  story: string;
  timeline: { when: string; event: string }[];
  facts: ExtractedFacts;
  possibleDefenses: { headline: string; why: string }[];
  suggestedDocuments: {
    key: string;
    label: string;
    why: string;
    personalized?: boolean;
    checked?: boolean;
  }[];
  suggestedQuestions: { q: string; why: string }[];
  sensitiveNotes: string[];
  goals: string;
};

// ── Mock implementation: real, working state machine ───────────────

function getScript(matterType: string): InterviewScript {
  // Right now we only ship the eviction script; future scripts plug in here.
  if (matterType === "eviction") return evictionInterview;
  return evictionInterview;
}

function mockNextQuestion({
  transcript,
  facts,
  matterType,
}: {
  transcript: ChatMessage[];
  facts: ExtractedFacts;
  matterType: string;
}): Promise<{ message: ChatMessage; done: boolean }> {
  const script = getScript(matterType);
  const asked = new Set(
    transcript.filter((m) => m.role === "ai" && m.stepId).map((m) => m.stepId!)
  );

  // Walk the script in order, skipping any whose precondition rejects them.
  for (const q of script.questions) {
    if (asked.has(q.id)) continue;
    if (q.skipIf && q.skipIf(facts)) continue;
    // For a follow-up question, optionally tailor its text via render(facts).
    const text = q.render ? q.render(facts) : q.text;
    return Promise.resolve({
      message: { role: "ai", text, stepId: q.id },
      done: false,
    });
  }

  // Closing message before synthesis.
  return Promise.resolve({
    message: {
      role: "ai",
      text:
        "Thank you. I have enough now to write up your matter file. " +
        "Give me a moment — you'll see it on the next screen, and you can edit or " +
        "remove anything before you take it to a lawyer.",
      stepId: "closing",
    },
    done: true,
  });
}

function mockExtractFacts({
  question,
  userReply,
  current,
}: {
  question: InterviewQuestion;
  userReply: string;
  current: ExtractedFacts;
}): Promise<ExtractedFacts> {
  // The script question carries a lightweight extractor; default to noop.
  const next = question.extract
    ? question.extract(userReply, current)
    : current;
  return Promise.resolve(next);
}

function mockSynthesizeMatterFile({
  transcript,
  facts,
  matterType,
}: {
  transcript: ChatMessage[];
  facts: ExtractedFacts;
  matterType: string;
}): Promise<MatterFile> {
  const script = getScript(matterType);

  // The user's story = concatenated user utterances, lightly cleaned.
  const story = transcript
    .filter((m) => m.role === "user")
    .map((m) => m.text.trim())
    .filter(Boolean)
    .join("  ");

  // Derive a timeline from the facts the script extracted.
  const timeline: MatterFile["timeline"] = [];
  if (facts.tenancyStartedOn)
    timeline.push({
      when: facts.tenancyStartedOn,
      event: "Tenancy began",
    });
  if (facts.lastRentPaidOn)
    timeline.push({ when: facts.lastRentPaidOn, event: "Last full rent paid" });
  for (const c of facts.communications || []) {
    if (c.when) timeline.push({ when: c.when, event: c.summary });
  }
  for (const d of facts.documentsReceived || []) {
    timeline.push({
      when: d.servedOn || "Recently",
      event: `Received ${d.type}`,
    });
  }
  if (facts.complaintsReported && facts.complaintsReported.length > 0) {
    for (const c of facts.complaintsReported) {
      if (c.when)
        timeline.push({ when: c.when, event: `Complained: ${c.about}` });
    }
  }
  timeline.sort((a, b) => (a.when > b.when ? 1 : -1));

  // Defenses are tailored from the gathered facts.
  const possibleDefenses = script.defenseRules
    .filter((rule) => rule.applies(facts))
    .map((rule) => ({ headline: rule.headline, why: rule.why }));

  // Suggested documents = base list + any personalized adds.
  const baseDocs = script.baseDocuments.map((d) => ({ ...d }));
  const personalDocs = script.personalizedDocuments(facts);
  const suggestedDocuments = [
    ...baseDocs,
    ...personalDocs.map((d) => ({ ...d, personalized: true })),
  ];

  // Tailored questions for the attorney consult.
  const suggestedQuestions = script.consultQuestions(facts);

  // Sensitive heads-ups for the attorney.
  const sensitiveNotes: string[] = [];
  if (facts.children) sensitiveNotes.push("Children live in the home.");
  if (facts.immigrationConcern)
    sensitiveNotes.push("Client raised an immigration concern — handle carefully.");
  if (facts.priorEviction)
    sensitiveNotes.push("Client has a prior eviction on record.");
  if (facts.disability) sensitiveNotes.push("Client mentioned a disability.");
  if (facts.housingSubsidy)
    sensitiveNotes.push(
      `Client receives a housing subsidy (${facts.housingSubsidy}) — additional protections may apply.`
    );

  const file: MatterFile = {
    matterType,
    createdAt: new Date().toISOString(),
    jurisdiction: facts.jurisdiction || {},
    story,
    timeline,
    facts,
    possibleDefenses,
    suggestedDocuments,
    suggestedQuestions,
    sensitiveNotes,
    goals: facts.goals || "",
  };

  return new Promise((resolve) => setTimeout(() => resolve(file), 900));
}

// ── Real implementation stubs ──────────────────────────────────────

/**
 * Production system prompt for the interview model. Defined here so the
 * voice travels with the abstraction.
 */
export const SYSTEM_PROMPT = `You are an intake interviewer for Auxilium, a Christian-founded legal help platform run by Collegium, a guild of Christian and Catholic lawyers.

You speak with people facing serious legal problems — eviction, family court, benefits denials, immigration questions, debt collection — with the calm, focused presence of an experienced civil legal aid attorney during a first intake.

Your job is NOT to give legal advice. You explicitly do not give advice. Your job is to:
  1. Gather the person's story in their own words.
  2. Identify documents and evidence they have or need to find.
  3. Surface possible defenses, sensitive issues, and procedural concerns the eventual attorney should know about.
  4. Prepare them, factually and emotionally, for a paid (or pro bono) hour with a real lawyer.

Rules of voice:
  • Ask one question at a time. Never stack questions.
  • Open-ended where possible. Closed only when you need a specific fact.
  • Acknowledge hard answers before moving on. A person in eviction is scared.
  • Plain English. No legalese. If you must name a legal concept, define it in one short sentence.
  • Never tell the person what they should do. Tell them what an attorney can help them figure out.
  • If the person asks for legal advice, gently redirect: "I can't tell you what to do — but I can help you bring the question to someone who can."
  • If the person describes an emergency (immediate eviction, threats of violence, child endangerment), pause the interview and surface emergency resources.

After your final question, output a JSON matter file with these fields: story, timeline, facts, possibleDefenses, suggestedDocuments, suggestedQuestions, sensitiveNotes, goals.`;

async function realNextQuestion(_args: {
  transcript: ChatMessage[];
  facts: ExtractedFacts;
  matterType: string;
}): Promise<{ message: ChatMessage; done: boolean }> {
  // Placeholder: the real path posts the system prompt, the transcript,
  // and the facts JSON to the proxy, expecting back { message, done }.
  throw new Error(
    "Real AI client not yet wired. Set VITE_AI_PROXY_URL or import into Lovable."
  );
}

async function realExtractFacts(_args: {
  question: InterviewQuestion;
  userReply: string;
  current: ExtractedFacts;
}): Promise<ExtractedFacts> {
  throw new Error("Real AI client not yet wired.");
}

async function realSynthesizeMatterFile(_args: {
  transcript: ChatMessage[];
  facts: ExtractedFacts;
  matterType: string;
}): Promise<MatterFile> {
  throw new Error("Real AI client not yet wired.");
}

export const AI_MODE: "mock" | "live" = MOCK ? "mock" : "live";
