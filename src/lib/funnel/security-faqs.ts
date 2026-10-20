/**
 * FAQs for the Ajax alarm and CCTV landing.
 *
 * In their own file, not in faqs.ts, because faqs.ts is imported by
 * /install-quote and is not edited for another page.
 *
 * Ordered by how often buyers asked, from the 125 security purchase chats in
 * Superchat (ajax-research/superchat-security-insights.md, 14 October 2026):
 * cost first (35), then monthly fees and monitoring (17), then the questions
 * nobody else's page answers. Will's answers of 13 October set the facts:
 * residential, no monitoring from us, quote only, usually no survey, fitted
 * in a day.
 *
 * Three answers exist because the research said so:
 *   - "Who responds when the alarm goes off?" A self-monitored alarm gets no
 *     automatic police response (NPCC rules for unmonitored systems). No
 *     competitor page says so; 8 chats asked about monitoring. The quotes
 *     InstallPros sends already say monitoring "can be added on request".
 *   - "Can I fit it myself?" 7 asked, 10 raised a DIY kit, 7 objected to the
 *     installation line.
 *   - "Can someone visit first?" 8 asked. No price here: the £95+VAT visit is
 *     in the questions sent to Will.
 *
 * The panic button answer was dropped: 1 of 16 bot answers wanted one, and
 * it stays in the app section.
 *
 * Jordan's answers of 15 October 2026 set the rest:
 *   - Monitoring: not offered until the SSAIB accreditation, so the "can be
 *     added on request" line the quotes carry is gone from here.
 *   - Accreditation: not SSAIB accredited yet. The page claims none.
 *   - Price: the same day, always, with the alarm and the cameras priced
 *     separately when someone wants both.
 *   - Cameras: Ajax with an Ajax alarm, so it is all one app. Hikvision is
 *     fitted too, but it has its own page on installpros.co.uk and this is
 *     the Ajax page, so it is not named here (Gus, 15 October).
 *   - Hub 2 as standard: backup battery, and a SIM slot. Whether a SIM card
 *     comes with the install is not known, so the answer says "with a SIM".
 *   - Warranty: the manufacturer's on the kit, 2 or 5 years on the
 *     workmanship.
 *   - Engineers DBS checked and insured.
 *   - Finance is left out on purpose: Jordan wants it handled carefully, and a
 *     finance line on a UK page is a regulated promotion. It waits for the
 *     wording their finance provider approves.
 */
export const SECURITY_FAQS: { q: string; a: string }[] = [
  {
    q: "How much does an Ajax system cost?",
    a: "It depends on your home: how many doors, windows and floors, and whether you want cameras. You get your price the same day: one upfront figure for the kit and the fitting, with the alarm and the cameras priced separately if you want both. Nothing is ordered until you say yes, and there is nothing to pay us monthly after that.",
  },
  {
    q: "Is there a monthly fee?",
    a: "No. You pay once, upfront, and the system is yours. The Ajax app is free, and the alerts come straight to your phone without a subscription or a contract.",
  },
  {
    q: "Who responds when the alarm goes off?",
    a: "The sirens sound and every phone you choose gets an alert, with a photo where a detector has a camera. You decide what happens next: check the photo, call a neighbour, or call 999. Without a monitoring contract the police are not called automatically.",
  },
  {
    q: "Can I fit it myself?",
    a: "You can buy Ajax kit online and fit it yourself. What we add is choosing the right devices for your home, placing and setting them so they cover the ways in without false alarms, setting up the app for everyone, testing every device, and being on the phone afterwards.",
  },
  {
    q: "Do you need to survey my home first?",
    a: "Most homes we survey by video call: your doors, windows, floors and pets. Some need a visit first, and we will tell you when we call. Fitting is usually within 7 days.",
  },
  {
    q: "Who comes to fit it?",
    a: "One of our engineers, DBS checked and insured. They fit and test every device, set up the app on your phones and show everyone in the house how to use it.",
  },
  {
    q: "How is this different from a standard alarm company?",
    a: "A standard alarm either just rings, or is watched by a call centre on a monthly contract. An Ajax system tells you directly: an alert, and a photo where there is a camera, on your phone wherever you are, with no contract.",
  },
  {
    q: "How do you stop false alarms?",
    a: "Motion detectors are set to ignore pets, so the dog or the cat will not set it off. A detector with a camera sends a photo with the alert, so you can see what triggered it before you do anything.",
  },
  {
    q: "Can you add cameras?",
    a: "Yes. Ajax cameras sit in the same app as the alarm, so you can look the moment an alert comes in. They can go in on the same visit, and they are priced separately so you can see what each costs.",
  },
  {
    q: "Can I give someone temporary access?",
    a: "Yes. Add a cleaner, a dog walker or a builder as a user with their own access, and remove them when the job is done. The app shows you when they came and went.",
  },
  {
    q: "What happens in a power cut, or if the broadband goes down?",
    a: "The Ajax Hub 2 we fit as standard has a backup battery that keeps the system running through a power cut. With a SIM card in the hub, alerts still go out if the broadband drops.",
  },
  {
    q: "What warranty do I get?",
    a: "Every device carries the manufacturer's warranty. On top of that, our workmanship warranty covers the fitting for 2 or 5 years, depending on the option you choose.",
  },
  {
    q: "What do I get after the installation?",
    a: "We set the app up on every phone in the house, add each person as a user and show you how to arm it. After that the same team is on the phone if you need us, and adding a detector or a camera later is a short visit, not a rewire.",
  },
];
