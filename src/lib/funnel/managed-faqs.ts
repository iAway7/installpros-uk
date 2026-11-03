/**
 * FAQs for the managed service page. Their own file, like voip-faqs.ts.
 *
 * From what managed buyers and askers asked in the chats (managed-research,
 * section 1), in the plan of managed-research/estructura.md. Assumes Will's
 * answers until he gives them: the fixed IP (question 16), the account and
 * billing (15), what's included and the move (11).
 *
 * Kept off on purpose: prices, any uptime figure, "24/7", "guaranteed",
 * "subscription included", "authorised installer", "unlimited relocations".
 */
export const MANAGED_FAQS: { q: string; a: string }[] = [
  {
    q: "Do I need a fixed IP for my CCTV?",
    a: "Not always. It depends on how your cameras reach the monitoring company, and many systems work without one. Tell us the make of your recorder and who monitors it, and we'll check.",
  },
  {
    q: "Can Starlink give me a static IP?",
    a: "No. Starlink doesn't provide static addresses, and the public address on its business plans can change. We fit our own router, which gives your systems a fixed one.",
  },
  {
    q: "What happens if Starlink goes down?",
    a: "If your site has a 4G/5G backup, it switches over automatically. Either way, call us and we'll find out what's wrong.",
  },
  {
    q: "Is there an uptime guarantee?",
    a: "No one can promise Starlink never drops. What we promise is what happens when it does: you call one number and we sort it out.",
  },
  {
    q: "Is the Starlink account in my name?",
    a: "Yes. You stay the Starlink customer, and we look after the kit and the set-up.",
  },
  {
    q: "Can you work with my IT company or alarm company?",
    a: "Yes. We speak to them directly and check everything gets through.",
  },
  {
    q: "What if we move?",
    a: "One move in the UK is included. We take the dish down, fit it at the new site and set it up again.",
  },
  {
    q: "Can I keep my BT email address?",
    a: "Ask BT before you cancel. Your email account is with BT, not with the line, so BT is who keeps it open.",
  },
];
