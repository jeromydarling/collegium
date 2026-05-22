import { useState } from "react";
import { CalendarPlus, Download, Bell, Info } from "lucide-react";

/**
 * Court Date Reminder card.
 *
 * The single highest-leverage non-lawyer intervention ever measured in
 * an RCT: Uptrust / Santa Clara showed SMS reminders cut failure-to-
 * appear by 20–30% and reduced incarceration-for-missed-court from
 * 6.2% to 4.8%.
 *
 * Today this is a calendar-export affordance (.ics file the user can
 * import into Google Calendar / iOS Calendar / Outlook). When we wire a
 * backend, the same surface gets an SMS opt-in.
 */
export function CourtDateReminder({
  matterType,
  jurisdiction,
}: {
  matterType: string;
  jurisdiction: { city?: string; state?: string };
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [location, setLocation] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  function downloadIcs() {
    if (!date) return;
    const dt = new Date(`${date}T${time}:00`);
    // Reminders: 1 day before, morning of, 2 hours before.
    const ics = buildIcs({
      summary: titleFor(matterType),
      description: bodyFor(matterType, jurisdiction),
      start: dt,
      location,
    });
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "auxilium-court-date.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  }

  return (
    <article className="collegium-card p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[hsl(var(--c-wine)/0.08)] flex items-center justify-center text-[hsl(var(--c-wine))] shrink-0">
          <Bell size={18} />
        </div>
        <div>
          <div className="collegium-latin text-xs text-[hsl(var(--c-wine))]">
            Memento diei
          </div>
          <h3 className="collegium-display text-xl leading-tight">
            Set a court-date reminder
          </h3>
          <p className="text-xs text-[hsl(var(--c-slate-soft))] mt-0.5">
            People who get a reminder show up 20–30% more often. Showing
            up is most of the win.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <label className="flex flex-col gap-1 text-xs text-[hsl(var(--c-slate-soft))]">
          Court date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2.5 rounded-md border border-[hsl(var(--c-border))] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--c-wine)/0.3)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-[hsl(var(--c-slate-soft))]">
          Time
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="px-3 py-2.5 rounded-md border border-[hsl(var(--c-border))] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--c-wine)/0.3)]"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-xs text-[hsl(var(--c-slate-soft))] mb-4">
        Courtroom or location (optional)
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Boston Housing Court, Rm 4B"
          className="px-3 py-2.5 rounded-md border border-[hsl(var(--c-border))] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--c-wine)/0.3)]"
        />
      </label>

      <button
        onClick={downloadIcs}
        disabled={!date}
        className="collegium-btn-primary text-sm inline-flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloaded ? (
          <>
            <Download size={14} /> Saved to your downloads
          </>
        ) : (
          <>
            <CalendarPlus size={14} /> Add to my calendar
          </>
        )}
      </button>

      <p className="text-[10px] text-[hsl(var(--c-slate-soft))] mt-3 leading-relaxed">
        Downloads a calendar file with reminders the day before, the
        morning of, and 2 hours before your hearing. Works with Google
        Calendar, Apple Calendar, and Outlook.
      </p>
    </article>
  );
}

function titleFor(matterType: string): string {
  switch (matterType) {
    case "eviction":
      return "Court hearing — eviction case";
    case "debt":
      return "Court hearing — debt collection";
    case "family":
      return "Court hearing — family matter";
    default:
      return "Court hearing";
  }
}

function bodyFor(
  matterType: string,
  jurisdiction: { city?: string; state?: string }
): string {
  const loc =
    jurisdiction.city && jurisdiction.state
      ? `${jurisdiction.city}, ${jurisdiction.state}`
      : jurisdiction.state ?? "";
  return [
    "Prepared with Auxilium.",
    loc ? `Location: ${loc}` : "",
    "",
    "Bring your matter file, your documents, and a photo ID. Arrive 30 minutes early. If you can't make it, call the court clerk immediately.",
  ]
    .filter(Boolean)
    .join("\\n");
}

function buildIcs({
  summary,
  description,
  start,
  location,
}: {
  summary: string;
  description: string;
  start: Date;
  location: string;
}): string {
  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  const end = new Date(start.getTime() + 90 * 60 * 1000); // 90-minute block
  const uid = `auxilium-${Date.now()}@collegium`;
  // Three nested alarms.
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Auxilium//Court Date Reminder//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    location ? `LOCATION:${location}` : "",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Court tomorrow — gather your documents tonight.",
    "TRIGGER:-P1D",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Court today. Bring matter file, documents, photo ID.",
    "TRIGGER:-PT4H",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Court in 2 hours. Leave now if you haven't already.",
    "TRIGGER:-PT2H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}
