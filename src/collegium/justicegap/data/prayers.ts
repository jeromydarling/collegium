/**
 * Meditation blocks — Justice Gap.
 *
 * Following the fostercrisis kickoff: every prayer/meditation body is
 * VERBATIM from a real published source. No AI synthesis of sacred or
 * historical text. We display the eyebrow + title + body. We do NOT
 * display source attributions or external URLs — they alienate readers
 * who don't share the source tradition.
 *
 * Single-newline in a body string preserves a verse-style line break
 * within a paragraph; double-newline starts a new paragraph.
 *
 * The biblical excerpts here are taken from public-domain English
 * translations: the King James Version (1611, public domain) and the
 * American Standard Version (1901, public domain).
 *
 * MLK's *Letter from Birmingham Jail* (1963) is widely available
 * and quoted under fair use as historical text.
 *
 * The Sixth Amendment text is the U.S. Constitution itself, public
 * domain.
 */

export type Meditation = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
};

export const meditations: Meditation[] = [
  {
    id: "amos-5",
    eyebrow: "Hebrew prophets · Amos",
    title: "Let justice roll down",
    body:
      "I hate, I despise your feasts,\nand I will take no delight in your solemn assemblies.\n\n" +
      "Yea, though ye offer me your burnt-offerings and meal-offerings,\nI will not accept them;\n" +
      "neither will I regard the peace-offerings of your fat beasts.\n\n" +
      "Take thou away from me the noise of thy songs;\nfor I will not hear the melody of thy viols.\n\n" +
      "But let justice roll down as waters,\nand righteousness as a mighty stream.",
  },
  {
    id: "micah-6",
    eyebrow: "Hebrew prophets · Micah",
    title: "What does the Lord require",
    body:
      "He hath showed thee, O man, what is good;\n" +
      "and what doth the Lord require of thee,\n" +
      "but to do justly, and to love mercy,\n" +
      "and to walk humbly with thy God?",
  },
  {
    id: "isaiah-1",
    eyebrow: "Hebrew prophets · Isaiah",
    title: "Seek justice",
    body:
      "Wash you, make you clean;\nput away the evil of your doings from before mine eyes;\ncease to do evil;\n" +
      "learn to do well;\nseek justice, relieve the oppressed,\njudge the fatherless, plead for the widow.",
  },
  {
    id: "matthew-25",
    eyebrow: "Gospel of Matthew",
    title: "The least of these",
    body:
      "Then shall the King say unto them on his right hand,\n" +
      "Come, ye blessed of my Father, inherit the kingdom prepared for you from the foundation of the world:\n\n" +
      "For I was an hungered, and ye gave me meat:\nI was thirsty, and ye gave me drink:\n" +
      "I was a stranger, and ye took me in:\nNaked, and ye clothed me:\n" +
      "I was sick, and ye visited me:\nI was in prison, and ye came unto me.\n\n" +
      "Then shall the righteous answer him, saying, Lord, when saw we thee an hungered, and fed thee?\nOr thirsty, and gave thee drink?\nWhen saw we thee a stranger, and took thee in?\nOr naked, and clothed thee?\nOr when saw we thee sick, or in prison, and came unto thee?\n\n" +
      "And the King shall answer and say unto them, Verily I say unto you,\n" +
      "Inasmuch as ye have done it unto one of the least of these my brethren,\nye have done it unto me.",
  },
  {
    id: "sixth-amendment",
    eyebrow: "Constitution of the United States",
    title: "The Sixth Amendment",
    body:
      "In all criminal prosecutions, the accused shall enjoy the right to a speedy and public trial, by an impartial jury of the State and district wherein the crime shall have been committed, which district shall have been previously ascertained by law, and to be informed of the nature and cause of the accusation; to be confronted with the witnesses against him; to have compulsory process for obtaining witnesses in his favor,\n\n" +
      "and to have the Assistance of Counsel for his defence.",
  },
  {
    id: "mlk-letter",
    eyebrow: "Martin Luther King Jr. · Letter from Birmingham Jail, 1963",
    title: "Justice too long delayed",
    body:
      "We know through painful experience that freedom is never voluntarily given by the oppressor; it must be demanded by the oppressed.\n\n" +
      "For years now I have heard the word \"Wait!\" It rings in the ear of every Negro with piercing familiarity. This \"Wait\" has almost always meant \"Never.\" We must come to see, with one of our distinguished jurists, that \"justice too long delayed is justice denied.\"",
  },
  {
    id: "gideon-decision",
    eyebrow: "Justice Hugo Black · Gideon v. Wainwright, 1963",
    title: "Reason and reflection",
    body:
      "Reason and reflection require us to recognize that in our adversary system of criminal justice, any person haled into court, who is too poor to hire a lawyer, cannot be assured a fair trial unless counsel is provided for him.\n\n" +
      "This seems to us to be an obvious truth.",
  },
  {
    id: "psalm-82",
    eyebrow: "Psalms",
    title: "Defend the poor and fatherless",
    body:
      "Defend the poor and fatherless:\ndo justice to the afflicted and needy.\n\n" +
      "Deliver the poor and needy:\nrid them out of the hand of the wicked.",
  },
  {
    id: "proverbs-22-gate",
    eyebrow: "Proverbs",
    title: "Oppress not the afflicted in the gate",
    body:
      "Rob not the poor, because he is poor:\n" +
      "neither oppress the afflicted in the gate:\n\n" +
      "For the LORD will plead their cause,\n" +
      "and spoil the soul of those that spoiled them.",
  },
  {
    id: "isaiah-61-liberty",
    eyebrow: "Hebrew prophets · Isaiah",
    title: "Liberty to the captives",
    body:
      "The Spirit of the Lord GOD is upon me;\n" +
      "because the LORD hath anointed me to preach good tidings unto the meek;\n\n" +
      "he hath sent me to bind up the brokenhearted,\n" +
      "to proclaim liberty to the captives,\n" +
      "and the opening of the prison to them that are bound.",
  },
];

export function meditationById(id: string): Meditation | undefined {
  return meditations.find((m) => m.id === id);
}
