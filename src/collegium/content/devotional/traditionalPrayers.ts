/**
 * The single daily prayer for the whole year — the Collect for St. Ivo
 * of Kermartin, patron saint of lawyers (canonized 1347). The text is
 * the official Roman Missal Collect for his feast (May 19); the Latin
 * is medieval and the English translation here is from a pre-1929
 * missal, all public domain.
 *
 * The Collect's substance is the lawyer's whole vocation in one
 * sentence: defending the cause of the orphan and the widow.
 *
 * Kept as a function (not a constant) so a future revision can re-
 * introduce per-day variation without changing the call sites.
 */

export interface TraditionalPrayer {
  id: string;
  title: string;
  source: string;
  /** Optional medieval Latin original (rendered above the English). */
  latin?: string;
  text: string;
}

const ivoCollect: TraditionalPrayer = {
  id: "ivo-collect",
  title: "Collect for St. Ivo of Kermartin",
  source:
    "Roman Missal, Feast of St. Ivo, 19 May. Latin medieval; traditional English translation, public domain.",
  latin:
    "Deus, qui beato Ivoni Confessori tuo orphanorum et viduarum causas tueri concessisti: praesta, quaesumus; ut, eius intercessione, in miserationis operibus erga proximos indigentes pii inveniamur. Per Dominum nostrum Iesum Christum.",
  text: "O God, Who didst grant to blessed Ivo Thy Confessor to defend the cause of orphans and widows: grant, we beseech Thee, that through his intercession we may be found pious in works of mercy toward our needy neighbours. Through our Lord Jesus Christ, Thy Son, who liveth and reigneth with Thee in the unity of the Holy Ghost, God, world without end. Amen.\n\nSanctus Ivo erat Brito, advocatus et non latro, res miranda populo.\n\n(St. Ivo was a Breton, an advocate and no thief — a thing wonderful to the people.)",
};

export const traditionalPrayers: Record<string, TraditionalPrayer> = {
  "ivo-collect": ivoCollect,
};

export function prayerForDay(_day: number): TraditionalPrayer {
  return ivoCollect;
}
