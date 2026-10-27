/**
 * FAQs for the Hikvision CCTV landing. Their own file, like security-faqs.ts,
 * because faqs.ts is imported by /install-quote.
 *
 * Ordered by how often camera buyers and owners asked, from the 261 threads
 * re-read for cameras (hikvision-research/superchat-cctv-insights.md, 27
 * October 2026): cost and monthly fees first, then phones and recordings,
 * then the questions almost no competitor answers (wired versus a recorder,
 * existing systems, neighbours, whether Hikvision is safe).
 *
 * 27 October, from all 138 camera chats read in full
 * (hikvision-research/conversaciones-decision.md): "Why wired" moved into the
 * wired card on the page; added audio (10 threads), cameras the customer
 * bought (8), cover my area (7, 2 lost for no engineer), Wi-Fi (6), the
 * screen (5, merged with the recorder), "Can InstallPros see my cameras?"
 * (15 threads about logins and admin accounts) and what happens later.
 *
 * Cut from 22 to 11 the same day (Gus: too many). Out went every question a
 * section above already answers: phone viewing (the app section), Wi-Fi and
 * wired (the wired section), the recorder and the screen (the kit), night
 * colour and cats (the night section), existing systems and logins
 * (Already have cameras?), businesses (their own section), who sees the
 * cameras (the app section) and who fits it (the trust bar). What happens
 * later folded into the warranty answer. What stays is what the chats asked
 * and the page does not otherwise answer, roughly in order of how often.
 *
 * DRAFT. "[Jordan Qn]" marks an answer that waits on that question
 * (hikvision-research/preguntas-jordan-will.md); the text after it is the
 * draft's best guess. FaqSectionAlt takes plain strings, so the marks are
 * text here, not the amber Gap.
 *
 * Kept off on purpose: prices, accreditation, "approved/certified installer",
 * monitoring, finance, face or number plate recognition, and any claim that
 * the UK government approved Hikvision or that it "can't see your footage".
 * The safety answer traces clause by clause to the sources in
 * hikvision-research/uk-installers.md, section 2.
 */
export const HIKVISION_FAQS: { q: string; a: string }[] = [
  {
    q: "How much does Hikvision CCTV cost?",
    a: "It depends on how many cameras you want and how far the cables run. You get your price the same day: one upfront figure for the cameras, the recorder and the fitting. Nothing is ordered until you say yes, and there is nothing to pay us monthly after that.",
  },
  {
    q: "Is there a monthly fee?",
    a: "[Jordan Q2] No. You pay once and the system is yours. The Hik-Connect app is free, and the recordings are kept on the recorder in your home, so there is no subscription.",
  },
  {
    q: "How long are the recordings kept?",
    a: "[Jordan Q2] We size the hard drive for how many days you want to keep, usually [X] days of recording around the clock.",
  },
  {
    q: "Do the cameras have audio?",
    a: "[Jordan Q2] Some cameras record sound, and some let you talk through them. Tell us if you want either and we will tell you which cameras do it before you decide.",
  },
  {
    q: "Do you need to visit first?",
    a: "[Jordan Q7] Most homes we quote from photos. Some need a visit, and we will tell you when we call.",
  },
  {
    q: "Can you fit cameras I have already bought?",
    a: "[Jordan, not asked yet] Tell us the make and model, and we will tell you whether they work with a wired system before anyone comes out.",
  },
  {
    q: "Do you cover my area?",
    a: "[Jordan Q11] Put your postcode in the form and we will confirm it when we call, along with the earliest date we can fit.",
  },
  {
    q: "Can my cameras look at the street or next door?",
    a: "Your cameras can cover your own property. If one also picks up the street or a neighbour's garden, data protection rules apply to you: put up a sign, keep the footage secure and only for as long as you need it. We aim every camera at what is yours, and can mask out a neighbour's windows or garden in the camera's settings.",
  },
  {
    q: "Can you fit an alarm as well?",
    a: "[Jordan Q3] Yes. We fit Ajax alarms, and with an alarm we use Ajax cameras so everything is in one app.",
  },
  {
    q: "What warranty do I get?",
    a: "[Jordan Q4, Q5] Every camera and recorder carries the manufacturer's warranty, and our workmanship warranty covers the fitting for [X] years. If something stops working later, message us on WhatsApp: a new router, a new phone or an app that logs you out can usually be sorted remotely.",
  },
  {
    q: "Is Hikvision safe to use?",
    a: "[Jordan Q9] Yes, you can have Hikvision at home. In 2022 the UK government told its own departments to stop putting cameras from Chinese manufacturers on sensitive government sites, and it has said that does not apply to private individuals or businesses. There is no UK ban on using Hikvision at home. Whatever the brand, the real risks are weak passwords, old firmware and cameras left open to the internet, so we set every system up with its own strong passwords and current firmware, with no open ports on your router, and your recordings stay on the recorder in your home.",
  },
];
