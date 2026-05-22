/**
 * Twilio integration credentials (browser-side localStorage).
 *
 * Same plug-in pattern as Claude and Stripe: paste credentials → features
 * turn on. In production these move to a server-side proxy; the call surface
 * stays identical so swapping is a one-line endpoint change.
 *
 * What Twilio enables once configured:
 *   - SMS-first intake (client texts a number, lands as a structured matter)
 *   - Voicemail appeals (client calls a number, leaves a 60-second story,
 *     auto-transcribed and queued for steward review)
 *   - Appointment reminders + status updates by SMS
 *   - One-time access links via SMS instead of email (for clients without
 *     reliable email)
 */

const KEYS = {
  accountSid: "collegium.integration.twilio_sid.v1",
  authToken: "collegium.integration.twilio_token.v1",
  fromNumber: "collegium.integration.twilio_from.v1",
  voiceNumber: "collegium.integration.twilio_voice.v1",
} as const;

export interface TwilioCredentials {
  accountSid: string;
  authToken: string;
  fromNumber: string;
  voiceNumber: string;
}

export function getTwilioCreds(): Partial<TwilioCredentials> {
  try {
    return {
      accountSid: localStorage.getItem(KEYS.accountSid) ?? undefined,
      authToken: localStorage.getItem(KEYS.authToken) ?? undefined,
      fromNumber: localStorage.getItem(KEYS.fromNumber) ?? undefined,
      voiceNumber: localStorage.getItem(KEYS.voiceNumber) ?? undefined,
    };
  } catch {
    return {};
  }
}

export function setTwilioCreds(creds: Partial<TwilioCredentials>): void {
  try {
    const map: Array<[keyof typeof KEYS, string | undefined]> = [
      ["accountSid", creds.accountSid],
      ["authToken", creds.authToken],
      ["fromNumber", creds.fromNumber],
      ["voiceNumber", creds.voiceNumber],
    ];
    for (const [field, value] of map) {
      if (value === undefined) continue;
      if (value.trim() === "") {
        localStorage.removeItem(KEYS[field]);
      } else {
        localStorage.setItem(KEYS[field], value.trim());
      }
    }
  } catch {
    /* silent */
  }
}

export function clearTwilioCreds(): void {
  try {
    for (const key of Object.values(KEYS)) localStorage.removeItem(key);
  } catch {
    /* silent */
  }
}

export function hasTwilioConfigured(): boolean {
  const c = getTwilioCreds();
  return !!(c.accountSid && c.authToken && c.fromNumber);
}

export function maskedTwilioSid(): string {
  const sid = getTwilioCreds().accountSid;
  if (!sid) return "";
  if (sid.length <= 12) return "•".repeat(sid.length);
  return sid.slice(0, 6) + "…" + sid.slice(-4);
}
