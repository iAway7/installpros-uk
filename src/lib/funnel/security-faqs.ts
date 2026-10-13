/**
 * FAQs for the Ajax alarm and CCTV landing.
 *
 * In their own file, not in faqs.ts, because faqs.ts is imported by
 * /install-quote and is not edited for another page.
 *
 * Rewritten on Will's answers of 13 October 2026. Residential only: he does
 * not hold the accreditations for commercial alarms at scale, so the business
 * question is gone. No monitoring and quote only, so the cost answers say one
 * upfront price and nothing monthly. Usually no survey and fitted in a day.
 * The rest answer his five buyer questions where the sections above do not
 * already: false alarms, the difference from a standard alarm company,
 * temporary access, the panic button, what happens after the install.
 *
 * PENDING before paid traffic:
 *   - Power cut: assumes the hubs fitted carry a SIM. True of current Ajax hubs;
 *     confirm which one Will fits.
 *   - After the install: no warranty length or service is named, because Will
 *     has not given one.
 *   - Insurance and grading are not answered. Ajax kit is graded, but whether
 *     an install satisfies an insurer depends on the installer's own
 *     accreditation, which Will says they do not fully hold yet.
 */
export const SECURITY_FAQS: { q: string; a: string }[] = [
  {
    q: "How much does an Ajax system cost?",
    a: "It depends on your home: how many doors, windows and floors, and whether you want cameras. You get one upfront price for the kit and the fitting before anything is ordered, and nothing to pay monthly after that.",
  },
  {
    q: "Is there a monthly fee?",
    a: "No. You pay once, upfront, and the system is yours. The Ajax app is free, and the alerts come straight to your phone without a subscription or a contract.",
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
    q: "Do you need to survey my home first?",
    a: "Usually not. We quote from a call about your doors, windows, floors and pets, then fit everything in one visit, usually within 7 days.",
  },
  {
    q: "Can I give someone temporary access?",
    a: "Yes. Add a cleaner, a dog walker or a builder as a user with their own access, and remove them when the job is done. The app shows you when they came and went.",
  },
  {
    q: "Is there a panic button?",
    a: "Yes. A panic button on a key fob, or one kept by the bed, sets off the alarm and alerts the family's phones with one press.",
  },
  {
    q: "What happens in a power cut, or if the broadband goes down?",
    a: "The hub has a backup battery and keeps the system running through a power cut. If the broadband drops, the hub can still send alerts over a mobile SIM.",
  },
  {
    q: "Can you add cameras?",
    a: "Yes. Ajax cameras show up in the same app as the alarm, so when an alert comes in you can look straight away. We fit and cable them as part of the same job, or add them later.",
  },
  {
    q: "What do I get after the installation?",
    a: "We set the app up on every phone in the house, add each person as a user and show you how to arm it. After that the same team is on the phone if you need us, and adding a detector or a camera later is a short visit, not a rewire.",
  },
];
