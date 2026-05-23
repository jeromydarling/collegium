/**
 * Real, public-domain Catholic prayers mapped to days where one fits.
 *
 * All sources are pre-1929 and in the public domain. Each entry carries
 * its historical source. The renderer uses prayerForDay(day) to look
 * up a fit; most days have no mapping and render only Scripture + the
 * canon excerpt.
 */

export interface TraditionalPrayer {
  id: string;
  title: string;
  source: string;
  text: string;
}

export const traditionalPrayers: Record<string, TraditionalPrayer> = {
  "more-tower": {
    id: "more-tower",
    title: "Give Me Thy Grace, Good Lord",
    source: "St. Thomas More — Tower writings, 1534–1535",
    text: "Give me thy grace, good Lord, to set the world at naught.\n\nTo set my mind fast upon thee, and not to hang upon the blast of men's mouths.\n\nTo be content to be solitary. Not to long for worldly company. Little and little utterly to cast off the world, and rid my mind of all the business thereof.\n\nNot to long to hear of any worldly things, but that the hearing of worldly fantasies may be to me displeasant.\n\nGladly to be thinking of God, piteously to call for his help. To lean unto the comfort of God. Busily to labour to love him.\n\nTo know mine own vility and wretchedness. To humble and meeken myself under the mighty hand of God. To bewail my sins passed. For the purging of them patiently to suffer adversity.\n\nGladly to bear my purgatory here. To be joyful of tribulations. To walk the narrow way that leadeth to life.\n\nTo bear the cross with Christ. To have the last things in remembrance. To have ever afore mine eye my death that is ever at hand.\n\nTo make death no stranger to me. To foresee and consider the everlasting fire of hell. To pray for pardon before the judge come.\n\nTo have continually in mind the passion that Christ suffered for me. For his benefits incessantly to give him thanks.\n\nTo buy the time again that I before have lost. To abstain from vain confabulations. To eschew light foolish mirth and gladness. Recreations not necessary to cut off.\n\nOf worldly substance, friends, liberty, life, and all, to set the loss at right naught for the winning of Christ.\n\nTo think my most enemies my best friends. For the brethren of Joseph could never have done him so much good with their love and favour as they did him with their malice and hatred.",
  },
  "veni-sancte-spiritus": {
    id: "veni-sancte-spiritus",
    title: "Veni Sancte Spiritus",
    source: "13th-century Latin sequence; English tr. Edward Caswall, 1849 (public domain)",
    text: "Come, Holy Ghost, send down those beams,\nWhich sweetly flow in silent streams\nFrom thy bright throne above.\n\nO come, thou Father of the poor;\nO come, thou source of all our store,\nCome, fill our hearts with love.\n\nO thou, of comforters the best,\nO thou, the soul's delightful guest,\nThe pilgrim's sweet relief.\n\nRest art thou in our toil, most sweet\nRefreshment in the noon-day heat;\nAnd solace in our grief.\n\nO blessed Light of life thou art;\nFill with thy light the inmost heart\nOf those who hope in thee.\n\nWithout thy Godhead nothing can,\nHave any price or worth in man,\nNothing can harmless be.\n\nLord, wash our sinful stains away,\nRefresh from heaven our barren clay,\nOur wounds and bruises heal.\n\nTo thy sweet yoke our stiff necks bow,\nWarm with thy fire our hearts of snow,\nOur wandering feet recall.\n\nGrant to thy faithful, dearest Lord,\nWhose only hope is thy sure word,\nThe sevenfold gifts of grace.\n\nGrant us in life thy grace that we,\nIn peace may die and ever be,\nIn joy before thy face. Amen.",
  },
  "salve-regina": {
    id: "salve-regina",
    title: "Salve Regina",
    source: "11th-century Marian antiphon; traditional English, public domain",
    text: "Hail, holy Queen, Mother of mercy, our life, our sweetness, and our hope.\n\nTo thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears.\n\nTurn then, most gracious advocate, thine eyes of mercy toward us, and after this our exile show unto us the blessed fruit of thy womb, Jesus.\n\nO clement, O loving, O sweet Virgin Mary.\n\nPray for us, O holy Mother of God, that we may be made worthy of the promises of Christ.",
  },
  "sub-tuum": {
    id: "sub-tuum",
    title: "Sub Tuum Praesidium",
    source: "Third-century Greek prayer (the oldest known Marian prayer); traditional English, public domain",
    text: "We fly to thy patronage, O holy Mother of God; despise not our petitions in our necessities, but deliver us always from all dangers, O glorious and blessed Virgin.",
  },
  "memorare": {
    id: "memorare",
    title: "Memorare",
    source: "Attributed to St. Bernard of Clairvaux (12th c.); popularized by Claude Bernard, 1631; traditional English, public domain",
    text: "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thine intercession, was left unaided.\n\nInspired by this confidence, I fly unto thee, O Virgin of virgins, my Mother. To thee do I come, before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen.",
  },
  "anima-christi": {
    id: "anima-christi",
    title: "Anima Christi",
    source: "14th-century Latin prayer; traditional English, public domain",
    text: "Soul of Christ, sanctify me.\nBody of Christ, save me.\nBlood of Christ, inebriate me.\nWater from the side of Christ, wash me.\nPassion of Christ, strengthen me.\n\nO good Jesus, hear me.\nWithin thy wounds hide me.\nSuffer me not to be separated from thee.\nFrom the malignant enemy defend me.\nIn the hour of my death call me,\nAnd bid me come unto thee,\nThat with thy saints I may praise thee\nFor ever and ever. Amen.",
  },
  "suscipe": {
    id: "suscipe",
    title: "Suscipe (Take, Lord, Receive)",
    source: "St. Ignatius of Loyola, Spiritual Exercises §234, 1548; English tr. Elder Mullan, 1914 (public domain)",
    text: "Take, Lord, and receive all my liberty, my memory, my understanding, and my entire will, all I have and call my own.\n\nYou have given all to me. To you, Lord, I return it. Everything is yours; do with it what you will. Give me only your love and your grace. That is enough for me.",
  },
};

/**
 * Day → prayer mapping. Hand-curated. Most days have no mapping —
 * the page renders Scripture + the canon excerpt and that is the day.
 *
 * Convention: only assign when the prayer genuinely fits the day's
 * Scripture / excerpt. Resist filling everything.
 */
export const dayToPrayer: Record<number, string> = {
  // Vocation week — Suscipe at the open (St. Ignatius giving over the year)
  1: "suscipe",
  // The lonely office gets the Salve Regina with its "advocata nostra"
  5: "salve-regina",
  // Conscience week — More's Tower prayer
  22: "more-tower",
  28: "more-tower",
  // The Poor — Sub Tuum (the third-century cry for protection)
  29: "sub-tuum",
  // Counsel week — Veni Sancte Spiritus (traditionally said before
  // any work requiring discernment)
  57: "veni-sancte-spiritus",
  122: "veni-sancte-spiritus",
  // Office week — Suscipe (offering the day's work)
  68: "suscipe",
  // Christ the Advocate — Salve Regina (Mary as advocata nostra)
  89: "salve-regina",
  // Patience — Memorare (Marian recourse in the long wait)
  94: "memorare",
  // Listening — Veni Sancte Spiritus (the Solomon "understanding heart" day)
  121: "veni-sancte-spiritus",
  // Sentencing week — Anima Christi (the prayer before judgment)
  155: "anima-christi",
  // Pardon week — Suscipe and the Memorare
  162: "memorare",
  // Mid-year — Suscipe (renewing the offering)
  181: "suscipe",
};

export function prayerForDay(day: number): TraditionalPrayer | undefined {
  const id = dayToPrayer[day];
  if (!id) return undefined;
  return traditionalPrayers[id];
}
