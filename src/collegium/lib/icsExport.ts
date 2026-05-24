/**
 * ICS (iCalendar) export — converts a list of pair meetings to a .ics
 * file that Google Calendar, Apple Calendar, Outlook, and Fastmail
 * can either import once or subscribe to as a live feed.
 *
 * RFC 5545 compliant for the basic VEVENT shape. Each event includes:
 *   UID (stable across edits — derived from meeting id)
 *   DTSTAMP, DTSTART, DTEND (in UTC, formatted as YYYYMMDDTHHMMSSZ)
 *   SUMMARY (the agenda or a default "Mentor pair check-in")
 *   DESCRIPTION (mentor + mentee names; video link if present)
 *   URL (the video link)
 *   STATUS (CONFIRMED for scheduled, CANCELLED for cancelled/missed)
 *
 * No third-party dep — jsPDF / autotable not needed for this.
 */

import type { PairMeeting, MentorPair, Person } from "../data/demo";

const PROD_ID = "-//Collegium//Mentor Pair Schedule//EN";

export function buildIcsForPair(
  pair: MentorPair,
  meetings: PairMeeting[],
  mentor: Person,
  mentee: Person
): string {
  const now = formatIcsDate(new Date());
  const events = meetings
    .filter((m) => m.status !== "cancelled" && m.status !== "missed")
    .map((m) => buildVEvent(m, pair, mentor, mentee, now))
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PROD_ID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:Mentor pair — ${shortName(mentor)} & ${shortName(mentee)}`,
    `X-WR-CALDESC:Collegium mentor-pair meetings for ${shortName(mentor)} and ${shortName(mentee)}.`,
    events,
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

function buildVEvent(
  m: PairMeeting,
  pair: MentorPair,
  mentor: Person,
  mentee: Person,
  dtstamp: string
): string {
  const start = new Date(m.scheduledFor);
  const end = new Date(start.getTime() + m.durationMinutes * 60_000);
  const link = m.videoLink ?? pair.videoLink;
  const summary = m.agenda
    ? `${shortName(mentor)} & ${shortName(mentee)} — ${m.agenda}`
    : `${shortName(mentor)} & ${shortName(mentee)} — mentor pair check-in`;

  const descLines: string[] = [
    `Mentor: ${mentor.name}`,
    `Mentee: ${mentee.name}`,
    `Cadence: ${pair.cadence}`,
  ];
  if (m.agenda) descLines.push(`Agenda: ${m.agenda}`);
  if (link) descLines.push(`Video room: ${link}`);
  if (m.notes) descLines.push(`Notes: ${m.notes}`);

  return [
    "BEGIN:VEVENT",
    `UID:${m.id}@collegium`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcs(summary)}`,
    `DESCRIPTION:${escapeIcs(descLines.join("\\n"))}`,
    link ? `URL:${escapeIcs(link)}` : "",
    `STATUS:${m.status === "scheduled" ? "CONFIRMED" : "CONFIRMED"}`,
    `LAST-MODIFIED:${dtstamp}`,
    "END:VEVENT",
  ]
    .filter(Boolean)
    .join("\r\n");
}

/** YYYYMMDDTHHMMSSZ — UTC, no separators. */
function formatIcsDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

/** Escape special ICS chars: backslash, comma, semicolon, newline. */
function escapeIcs(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;")
    .replace(/\n/g, "\\n");
}

function shortName(p: Person): string {
  return p.name.split(" ").slice(-1)[0];
}

/** Browser convenience: trigger download. */
export function downloadIcsForPair(
  pair: MentorPair,
  meetings: PairMeeting[],
  mentor: Person,
  mentee: Person
): void {
  const ics = buildIcsForPair(pair, meetings, mentor, mentee);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mentor-pair-${pair.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
