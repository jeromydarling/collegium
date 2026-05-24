/**
 * Read.ai integration — webhook payload types and mapper.
 *
 * When a Read.ai bot joins a pair's video call and produces a meeting
 * report, Read.ai POSTs the report to our webhook (set up at the
 * Read.ai workspace level). The handler validates the signature,
 * resolves which pair / meeting the report belongs to, and calls
 * `mapReadAiToSummary` to convert the incoming shape into our
 * portable `MeetingSummary` type.
 *
 * The mapper is the seam between Read.ai's API surface (which can
 * change) and our internal data model (which we control). Tests live
 * in readAi.test.ts.
 *
 * Production wiring (Phase 3):
 *   1. Create a Read.ai webhook on the workspace pointing at
 *      https://<our-backend>/webhooks/read-ai
 *   2. Validate the X-Read-Signature header against the workspace's
 *      shared secret.
 *   3. Look up the meeting by Read.ai meeting id → external metadata
 *      we stored at scheduling time (when Zoom OAuth created the
 *      meeting, we tagged it with our PairMeeting.id).
 *   4. Call mapReadAiToSummary(payload, mentorId, menteeId) and write
 *      the result into PairMeeting.summary.
 *   5. Surface action items in the in-app inbox.
 *
 * The current demo does NOT receive real webhooks — the seed data
 * shows what the summaries look like once wired.
 */

import type { MeetingSummary, ActionItem } from "../../data/demo";

/**
 * Read.ai's outgoing webhook payload shape, as of the public docs
 * (subject to change — keep this file as the single point of contact).
 *
 * Source: https://support.read.ai/hc/en-us/articles/16352415827469
 */
export interface ReadAiWebhookPayload {
  /** Event kind. We only handle "meeting_report" currently. */
  event_type: "meeting_report" | "transcript_ready" | string;
  /** Read.ai's stable meeting id. */
  meeting_id: string;
  /** ISO timestamp. */
  occurred_at: string;
  /** Meeting title set in the calendar invite. */
  title: string;
  /** Duration in seconds. */
  duration_seconds: number;
  /** Participant list as Read.ai resolved them. */
  participants: {
    name: string;
    email?: string;
    /** 0-100 share of speaking time. */
    speaking_percentage?: number;
    /** -1 to +1. */
    sentiment_score?: number;
  }[];
  /** AI-generated summary — usually 1-2 sentences. */
  summary?: string;
  /** Extracted topics. */
  topics?: { name: string }[];
  /** Extracted action items. */
  action_items?: {
    text: string;
    /** Email of the assignee, if Read.ai detected one. */
    assignee_email?: string;
    /** ISO date if Read.ai detected a due date in the text. */
    due_date?: string;
  }[];
  /** Read.ai's public transcript URL. */
  transcript_url?: string;
  /** Recording URL if available (separate per-meeting; not workspace-wide). */
  recording_url?: string;
}

/**
 * Map a Read.ai meeting-report payload into our portable summary shape.
 *
 * @param payload The incoming Read.ai webhook body.
 * @param mentor The pair's mentor record (needed to resolve action-item
 *   assignees by email match).
 * @param mentee The pair's mentee record (same).
 *
 * Note: the function is intentionally pure — no I/O, no time-of-day
 * defaults beyond what the payload provides. The caller is responsible
 * for persisting the result.
 */
export function mapReadAiToSummary(
  payload: ReadAiWebhookPayload,
  mentor: { id: string; name: string; email?: string },
  mentee: { id: string; name: string; email?: string }
): MeetingSummary {
  const mentorEmail = (mentor.email ?? "").toLowerCase();
  const menteeEmail = (mentee.email ?? "").toLowerCase();
  const mentorNameTokens = nameTokens(mentor.name);
  const menteeNameTokens = nameTokens(mentee.name);

  const actionItems: ActionItem[] = (payload.action_items ?? []).map(
    (ai, idx) => ({
      id: `ai-${payload.meeting_id}-${idx + 1}`,
      text: ai.text,
      assigneeId: resolveAssignee(
        ai.text,
        ai.assignee_email,
        mentorEmail,
        menteeEmail,
        mentorNameTokens,
        menteeNameTokens,
        mentor.id,
        mentee.id
      ),
      status: "open",
      dueOn: ai.due_date,
    })
  );

  const mentorPct = findParticipantPct(payload.participants, mentor, mentorEmail);
  const menteePct = findParticipantPct(payload.participants, mentee, menteeEmail);
  const balance = classifyBalance(mentorPct, menteePct);
  const sentiment = averageSentiment(payload.participants);

  return {
    source: "read-ai",
    summary: payload.summary ?? "",
    topics: (payload.topics ?? []).map((t) => t.name).filter(Boolean),
    actionItems,
    engagement:
      mentorPct !== undefined ||
      menteePct !== undefined ||
      sentiment !== undefined
        ? {
            mentorSpeakingPercent: mentorPct,
            menteeSpeakingPercent: menteePct,
            balance,
            sentiment,
          }
        : undefined,
    transcriptUrl: payload.transcript_url,
    generatedAt: payload.occurred_at,
  };
}

/**
 * Resolve an action-item assignee by:
 *   1. exact email match against mentor/mentee emails
 *   2. name token presence in the action-item text ("Daniel — ...")
 *
 * Returns the person id or undefined.
 */
function resolveAssignee(
  text: string,
  assigneeEmail: string | undefined,
  mentorEmail: string,
  menteeEmail: string,
  mentorTokens: string[],
  menteeTokens: string[],
  mentorId: string,
  menteeId: string
): string | undefined {
  if (assigneeEmail) {
    const e = assigneeEmail.toLowerCase();
    if (e === mentorEmail) return mentorId;
    if (e === menteeEmail) return menteeId;
  }
  const t = text.toLowerCase();
  // Token match: the action item starts with "Daniel —" or contains
  // "Daniel will ..."; first-name presence is the strongest signal.
  if (mentorTokens.some((tok) => t.includes(tok))) return mentorId;
  if (menteeTokens.some((tok) => t.includes(tok))) return menteeId;
  return undefined;
}

function nameTokens(fullName: string): string[] {
  // First name + last name, lowercased.
  const parts = fullName.split(/\s+/).filter(Boolean);
  return parts.map((p) => p.toLowerCase());
}

function findParticipantPct(
  participants: ReadAiWebhookPayload["participants"],
  person: { name: string; email?: string },
  email: string
): number | undefined {
  // Match by email first, then by name fuzzy
  const byEmail = email
    ? participants.find((p) => p.email?.toLowerCase() === email)
    : undefined;
  if (byEmail?.speaking_percentage !== undefined) {
    return byEmail.speaking_percentage;
  }
  const personTokens = nameTokens(person.name);
  const byName = participants.find((p) =>
    personTokens.some((t) => p.name.toLowerCase().includes(t))
  );
  return byName?.speaking_percentage;
}

function classifyBalance(
  mentorPct: number | undefined,
  menteePct: number | undefined
): "balanced" | "mentor-heavy" | "mentee-heavy" | undefined {
  if (mentorPct === undefined || menteePct === undefined) return undefined;
  const diff = mentorPct - menteePct;
  if (Math.abs(diff) <= 15) return "balanced";
  return diff > 0 ? "mentor-heavy" : "mentee-heavy";
}

function averageSentiment(
  participants: ReadAiWebhookPayload["participants"]
): number | undefined {
  const scores = participants
    .map((p) => p.sentiment_score)
    .filter((s): s is number => typeof s === "number");
  if (scores.length === 0) return undefined;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}
