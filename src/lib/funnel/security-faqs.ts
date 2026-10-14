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
 * PENDING before paid traffic:
 *   - Power cut: assumes the hub fitted carries a SIM. True of current Ajax
 *     hubs; confirm which one Will fits.
 *   - Cameras: Ajax cameras are quoted on request, Hikvision is standard.
 *   - Insurance and accreditation are not answered until Will confirms what
 *     is true. Staff have told customers both things.
 */
export const SECURITY_FAQS: { q: string; a: string }[] = [
  {
    q: "How much does an Ajax system cost?",
    a: "It depends on your home: how many doors, windows and floors, and whether you want cameras. You get one upfront price for the kit and the fitting before anything is ordered, and nothing to pay us monthly after that.",
  },
  {
    q: "Is there a monthly fee?",
    a: "No. You pay once, upfront, and the system is yours. The Ajax app is free, and the alerts come straight to your phone without a subscription or a contract.",
  },
  {
    q: "Who responds when the alarm goes off?",
    a: "The sirens sound and every phone you choose gets an alert, with a photo where a detector has a camera. You decide what happens next: check the photo, call a neighbour, or call 999. Without a monitoring contract the police are not called automatically. If you want a monitoring centre to watch it, that can be added on request.",
  },
  {
    q: "Can I fit it myself?",
    a: "You can buy Ajax kit online and fit it yourself. What we add is choosing the right devices for your home, placing and setting them so they cover the ways in without false alarms, setting up the app for everyone, testing every device, and being on the phone afterwards.",
  },
  {
    q: "Do you need to survey my home first?",
    a: "Usually not. We quote from a call about your doors, windows, floors and pets, then fit everything in one visit, usually within 7 days. If you would rather someone came to look first, tell us when we call.",
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
    a: "Yes, cameras can be part of the same job, fitted and cabled with the alarm. Ajax cameras sit in the same app as the alarm, so you can look the moment an alert comes in. Tell us which cameras you want when we call.",
  },
  {
    q: "Can I give someone temporary access?",
    a: "Yes. Add a cleaner, a dog walker or a builder as a user with their own access, and remove them when the job is done. The app shows you when they came and went.",
  },
  {
    q: "What happens in a power cut, or if the broadband goes down?",
    a: "The hub has a backup battery and keeps the system running through a power cut. If the broadband drops, the hub can still send alerts over a mobile SIM.",
  },
  {
    q: "What do I get after the installation?",
    a: "We set the app up on every phone in the house, add each person as a user and show you how to arm it. After that the same team is on the phone if you need us, and adding a detector or a camera later is a short visit, not a rewire.",
  },
];
