/**
 * FAQs for the Ajax alarm and CCTV landing.
 *
 * In their own file, not in faqs.ts, because faqs.ts is imported by
 * /install-quote and is not edited for another page.
 *
 * Six of these are the old Ajax page's FAQs rewritten plainly (what it is, why
 * Ajax, the phone, homes and businesses, UK-wide, pets). The other four are
 * the questions anyone buying an alarm asks first and the old page did not
 * answer: price, a monthly fee, a power cut, cameras. Each answer claims only
 * what the old page already claims or what is true of every Ajax system.
 *
 * PENDING before paid traffic:
 *   - Cost: "quoted per property" until Will says whether there is a figure.
 *   - Monthly fee: says the app is free and alerts need no subscription, which
 *     is true of Ajax. If Will sells monitored contracts, add them here.
 *   - Power cut: assumes the hubs fitted carry a SIM. True of current Ajax hubs;
 *     confirm which one Will fits.
 *   - Insurance and grading are not answered. Ajax kit is graded, but whether
 *     an install satisfies an insurer depends on the installer's own
 *     accreditation, which nobody has confirmed.
 */
export const SECURITY_FAQS: { q: string; a: string }[] = [
  {
    q: "How much does an Ajax system cost?",
    a: "It depends on the property: how many doors, rooms and floors, and whether you want cameras. We quote the kit and the fitting together before anything is ordered, so you know the full figure up front.",
  },
  {
    q: "Is there a monthly fee?",
    a: "The Ajax app is free, and the alerts come straight to your phone without a subscription.",
  },
  {
    q: "What is an Ajax alarm?",
    a: "A wireless alarm system. A hub, detectors for doors, windows and rooms, a keypad and a siren, all talking to each other by radio. Smoke and leak detectors and cameras join the same system, and you run all of it from the Ajax app.",
  },
  {
    q: "Why Ajax rather than a wired alarm?",
    a: "There are no cables between the detectors, so there is no channelling walls or lifting floors. Adding a detector later is a visit, not a rewire. The batteries last years, and the app tells you well before one runs low.",
  },
  {
    q: "Can I control it from my phone?",
    a: "Yes. Arm and disarm, see who did it and when, get alerts and add or remove users, all from the free Ajax app. A keypad or a key fob is there for anyone who would rather not use a phone.",
  },
  {
    q: "Will my dog or cat set it off?",
    a: "Not if the detectors are set for them. Ajax motion detectors can ignore pets up to a set size, and we place and set them with your pets in mind. Tell us what you have when we quote.",
  },
  {
    q: "What happens in a power cut, or if the broadband goes down?",
    a: "The hub has a backup battery and keeps the system running through a power cut. If the broadband drops, the hub can still send alerts over a mobile SIM.",
  },
  {
    q: "Can you add cameras?",
    a: "Yes. Ajax cameras show up in the same app as the alarm, so when an alert comes in you can look straight away. We fit and cable them as part of the same job.",
  },
  {
    q: "Is it suitable for a business?",
    a: "Yes, from a single shop to a warehouse. Staff get their own codes and access, you can see who armed and disarmed and when, and several sites can sit in one app.",
  },
  {
    q: "Do you install across the UK?",
    a: "Yes. Our engineers supply, fit, configure and test the system, then set it up on your phone before they leave. Most installs happen within 7 days.",
  },
];
