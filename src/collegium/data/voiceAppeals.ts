/**
 * Voice appeal demo records — what Twilio voicemails look like once they
 * land. Each record represents a single voicemail received at the
 * tenant's intake line, auto-transcribed and queued for steward review.
 *
 * In production: the Twilio webhook hits a server endpoint, downloads the
 * recording, runs it through transcription (Whisper or Twilio's built-in),
 * and stores the result here. For demo we seed three realistic examples.
 */

export type VoiceAppealStatus = "new" | "reviewed" | "promoted" | "archived";

export type VoiceAppeal = {
  id: string;
  tenantId: string;
  /** ISO timestamp the voicemail arrived. */
  receivedAt: string;
  /** Caller ID — masked for privacy (last 4 digits only). */
  fromMasked: string;
  /** Detected language code if available. */
  detectedLanguage?: string;
  /** Duration in seconds. */
  durationSec: number;
  /** Auto-transcribed text. May contain artifacts. */
  transcript: string;
  /** Optional translation if transcript was in a non-English language. */
  translation?: string;
  /** First name caller mentioned (extracted by the steward, not auto). */
  callerFirstName?: string;
  /** Status of the voicemail. */
  status: VoiceAppealStatus;
  /** Matter id this was promoted to (when status === "promoted"). */
  promotedToMatterId?: string;
  /** Steward who reviewed it. */
  reviewedBy?: string;
  /** Notes the steward added. */
  notes?: string;
};

export const voiceAppeals: VoiceAppeal[] = [
  {
    id: "va-1",
    tenantId: "t-stm-boston",
    receivedAt: "2026-05-22T09:14:00Z",
    fromMasked: "+1 (***) ***-4172",
    detectedLanguage: "es",
    durationSec: 54,
    transcript:
      "Hola. Mi nombre es Rosa. Me dijo el Padre Ortiz de Saint Anthony que llame a este número. Mi esposo perdió su trabajo en diciembre y ahora nos están diciendo que tenemos que salir del apartamento. Tenemos dos niños en la escuela aquí en Brookline. No sé qué hacer. Por favor, si pueden ayudar, mi teléfono es el que aparece en su pantalla. Gracias. Que Dios los bendiga.",
    translation:
      "Hello. My name is Rosa. Father Ortiz at Saint Anthony told me to call this number. My husband lost his job in December and now they are telling us we have to leave the apartment. We have two children in school here in Brookline. I don't know what to do. Please, if you can help, my phone is the one on your screen. Thank you. May God bless you.",
    callerFirstName: "Rosa",
    status: "new",
  },
  {
    id: "va-2",
    tenantId: "t-stm-boston",
    receivedAt: "2026-05-21T15:32:00Z",
    fromMasked: "+1 (***) ***-8809",
    detectedLanguage: "en",
    durationSec: 38,
    transcript:
      "Hi, this is Marcus. I got your number from the Saturday clinic at the Cathedral. I'm trying to get back into work after I was out for a while and I have a record from years ago that keeps coming up. I heard you can help with sealing that. I'm not in trouble or anything, I just want a fair shot at the apprenticeship. Call me back when you can.",
    callerFirstName: "Marcus",
    status: "reviewed",
    reviewedBy: "Margaret Coyle",
    notes:
      "Sounds like an expungement candidate. Have Daniel Chen reach out — he handled a similar matter last quarter.",
  },
  {
    id: "va-3",
    tenantId: "t-stm-boston",
    receivedAt: "2026-05-19T19:08:00Z",
    fromMasked: "+1 (***) ***-2230",
    detectedLanguage: "en",
    durationSec: 71,
    transcript:
      "Yes hello, this is Anna T calling. The parish secretary at St. Mark's gave me this number. I am seventy-two years old. My husband passed in 2019 and I have been meaning to write a will for years now but I never know who to ask. My daughter is here with me this evening. We just want everything to be in order. If you can call us back I would be very grateful. Thank you.",
    callerFirstName: "Anna",
    status: "promoted",
    promotedToMatterId: "sm-11",
    reviewedBy: "James O'Hara",
    notes: "Promoted to estate-planning matter sm-11. Anna gave consent for the appeal to be shown to advocates.",
  },
];
