import { describe, it, expect } from "vitest";
import { mapReadAiToSummary, type ReadAiWebhookPayload } from "./readAi";

// NOTE: emails are built at runtime via concatenation because the dev
// environment's safety filter rewrites email-pattern strings in source
// code to the Cloudflare "[email protected]" placeholder. The production
// code path receives unmodified payloads from real webhooks.
const mEmail = "mcoyle" + "@" + "nijc.org";
const dEmail = "dchen" + "@" + "nijc.org";

const mentor = { id: "p-coyle", name: "Margaret Coyle", email: mEmail };
const mentee = { id: "p-chen", name: "Daniel Chen", email: dEmail };

function baselinePayload(): ReadAiWebhookPayload {
  return {
    event_type: "meeting_report",
    meeting_id: "rd-meet-abc123",
    occurred_at: "2026-04-22T19:35:00Z",
    title: "Pair check-in — Coyle & Chen",
    duration_seconds: 3600,
    participants: [
      {
        name: "Margaret Coyle",
        email: mEmail,
        speaking_percentage: 38,
        sentiment_score: 0.55,
      },
      {
        name: "Daniel Chen",
        email: dEmail,
        speaking_percentage: 62,
        sentiment_score: 0.69,
      },
    ],
    summary:
      "Daniel ran the direct exam twice. Margaret pushed on pace and foundation.",
    topics: [
      { name: "Direct examination cadence" },
      { name: "Country-conditions exhibit" },
    ],
    action_items: [
      {
        text: "Daniel — re-record the direct Friday and send for review.",
        assignee_email: dEmail,
      },
      {
        text: "Margaret — send the three-question opening checklist.",
      },
      {
        text: "Confirm interpreter scheduling 48 hours out.",
        due_date: "2026-06-01",
      },
    ],
    transcript_url: "https://app.read.ai/transcripts/abc123",
  };
}

describe("mapReadAiToSummary", () => {
  it("maps basic fields straight through", () => {
    const s = mapReadAiToSummary(baselinePayload(), mentor, mentee);
    expect(s.source).toBe("read-ai");
    expect(s.summary).toMatch(/Daniel ran the direct/);
    expect(s.transcriptUrl).toBe("https://app.read.ai/transcripts/abc123");
    expect(s.generatedAt).toBe("2026-04-22T19:35:00Z");
  });

  it("extracts topic names", () => {
    const s = mapReadAiToSummary(baselinePayload(), mentor, mentee);
    expect(s.topics).toEqual([
      "Direct examination cadence",
      "Country-conditions exhibit",
    ]);
  });

  it("resolves action-item assignees by email when present", () => {
    const s = mapReadAiToSummary(baselinePayload(), mentor, mentee);
    expect(s.actionItems[0].assigneeId).toBe("p-chen");
  });

  it("falls back to name-token matching when email is missing", () => {
    const s = mapReadAiToSummary(baselinePayload(), mentor, mentee);
    expect(s.actionItems[1].assigneeId).toBe("p-coyle");
  });

  it("leaves assignee undefined when no signal matches", () => {
    const s = mapReadAiToSummary(baselinePayload(), mentor, mentee);
    expect(s.actionItems[2].assigneeId).toBeUndefined();
  });

  it("preserves due dates from the payload", () => {
    const s = mapReadAiToSummary(baselinePayload(), mentor, mentee);
    expect(s.actionItems[2].dueOn).toBe("2026-06-01");
  });

  it("computes speaking-time balance — balanced when within 15%", () => {
    const p = baselinePayload();
    p.participants = [
      { name: "Margaret Coyle", email: mEmail, speaking_percentage: 48 },
      { name: "Daniel Chen", email: dEmail, speaking_percentage: 52 },
    ];
    const s = mapReadAiToSummary(p, mentor, mentee);
    expect(s.engagement?.balance).toBe("balanced");
  });

  it("classifies mentee-heavy when mentee speaks far more", () => {
    const s = mapReadAiToSummary(baselinePayload(), mentor, mentee);
    expect(s.engagement?.balance).toBe("mentee-heavy");
    expect(s.engagement?.mentorSpeakingPercent).toBe(38);
    expect(s.engagement?.menteeSpeakingPercent).toBe(62);
  });

  it("averages sentiment scores across participants", () => {
    const s = mapReadAiToSummary(baselinePayload(), mentor, mentee);
    expect(s.engagement?.sentiment).toBeCloseTo(0.62, 2);
  });

  it("returns engagement undefined when no engagement data present", () => {
    const p = baselinePayload();
    p.participants = [
      { name: "Margaret Coyle", email: mEmail },
      { name: "Daniel Chen", email: dEmail },
    ];
    const s = mapReadAiToSummary(p, mentor, mentee);
    expect(s.engagement).toBeUndefined();
  });

  it("emits stable action-item ids derived from the meeting id", () => {
    const s = mapReadAiToSummary(baselinePayload(), mentor, mentee);
    expect(s.actionItems.map((a) => a.id)).toEqual([
      "ai-rd-meet-abc123-1",
      "ai-rd-meet-abc123-2",
      "ai-rd-meet-abc123-3",
    ]);
  });

  it("handles empty topics and action items", () => {
    const p = baselinePayload();
    p.topics = undefined;
    p.action_items = undefined;
    const s = mapReadAiToSummary(p, mentor, mentee);
    expect(s.topics).toEqual([]);
    expect(s.actionItems).toEqual([]);
  });

  it("matches assignee email case-insensitively", () => {
    const p = baselinePayload();
    p.action_items = [
      {
        text: "Action.",
        assignee_email: mEmail.toUpperCase(),
      },
    ];
    const s = mapReadAiToSummary(p, mentor, mentee);
    expect(s.actionItems[0].assigneeId).toBe("p-coyle");
  });
});
