/**
 * FAQs for the digital landline page. Their own file, like hikvision-faqs.ts,
 * because faqs.ts is imported by /install-quote.
 *
 * From what VoIP buyers and askers asked in the chats (voip-research, section
 * 1), in the plan of voip-research/estructura-y-borrador.md. Some repeat a
 * section on purpose (old phones, power cuts): those were the questions staff
 * answered inconsistently, and a FAQ is where people look for them.
 *
 * Assumes Will's answers until he gives them (voip-research/
 * supuestos-para-will.md): fitting on the Starlink day (question 6), old
 * phones (3), every handset (4), the backup (5), the contract (8), calls (9).
 *
 * Kept off on purpose: prices, a transfer time, "plug and play", "works in a
 * power cut", any uptime figure, "24/7".
 */
export const VOIP_FAQS: { q: string; a: string }[] = [
  {
    q: "Do I need Starlink?",
    a: "No, it works on any broadband. Most of our customers have Starlink, and it works on every Starlink plan.",
  },
  {
    q: "Can you fit it when you install my Starlink?",
    a: "Yes. Our engineer can set the phone up on the same visit.",
  },
  {
    q: "Will my old phones work?",
    a: "Often, with a small adapter. Send us the model and we'll check, free.",
  },
  {
    q: "Can every handset make calls?",
    a: "Tell us who needs to call out and we'll set it up that way.",
  },
  {
    q: "What happens in a power cut?",
    a: "The phone needs power, like your router and your Starlink. If you rely on your landline, we'll add a battery backup and send calls to your mobile.",
  },
  {
    q: "Does 999 work?",
    a: "Yes, while you have power and internet. We register your address with the service, so emergency services know where you are.",
  },
  {
    q: "I have a careline or burglar alarm on my line.",
    a: "Tell us before you switch. We check it with your alarm provider first.",
  },
  {
    q: "How long does moving my number take?",
    a: "It depends on your old provider. Your new phone works from day one, and your old line keeps working until the number moves.",
  },
  {
    q: "I've already cancelled my old line.",
    a: "Message us today. A cancelled number can sometimes be recovered, but only for about a month.",
  },
  {
    q: "Is there a contract?",
    a: "Monthly rolling, cancel any time.",
  },
  {
    q: "Which calls are included?",
    a: "Calls to UK landlines and mobiles. Calls abroad and to premium numbers aren't.",
  },
  {
    q: "Isn't WiFi calling on my mobile enough?",
    a: "It's a good backup, but it needs your mobile, it doesn't give you a landline number, and it doesn't work with home phones.",
  },
];
