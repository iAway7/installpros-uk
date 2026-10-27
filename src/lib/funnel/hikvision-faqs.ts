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
    q: "Can I watch the cameras on my phone?",
    a: "Yes, live or played back, from anywhere with signal, on every phone you choose. We set the app up before we leave.",
  },
  {
    q: "How long are the recordings kept?",
    a: "[Jordan Q2] We size the hard drive for how many days you want to keep, usually [X] days of recording around the clock.",
  },
  {
    q: "Do the cameras need Wi-Fi?",
    a: "No. Each camera records to the recorder in your home down its own cable, with or without the internet. To watch them on your phone when you are out, the recorder needs your broadband.",
  },
  {
    q: "Do I need a recorder, or a screen?",
    a: "You need the recorder: it records every camera at once to a hard drive in your home, so nothing depends on a cloud subscription or a memory card in each camera. You don't need a screen. The app on your phone is the screen, and a monitor is optional.",
  },
  {
    q: "Do the cameras have audio?",
    a: "[Jordan Q2] Some cameras record sound, and some let you talk through them. Tell us if you want either and we will tell you which cameras do it before you decide.",
  },
  {
    q: "Will it see clearly at night?",
    a: "[Jordan Q2] ColorVu cameras keep the picture in colour after dark, with a soft warm light, so you see the colour of a car or a coat.",
  },
  {
    q: "Will it alert me every time a cat walks past?",
    a: "[Jordan Q2] AcuSense cameras tell a person or a vehicle from an animal or a moving tree, so the alerts that reach your phone are the ones that matter. We set the zones with you.",
  },
  {
    q: "I already have a Hikvision system. Can you add cameras or fix it?",
    a: "[Jordan Q4] Usually, yes. Send us a photo of the recorder's label and of the cameras, and we will tell you what can be added or fixed before anyone comes out.",
  },
  {
    q: "Can you fit cameras I have already bought?",
    a: "[Jordan, not asked yet] Tell us the make and model, and we will tell you whether they work with a wired system before anyone comes out.",
  },
  {
    q: "I moved in and there are no logins. Can you help?",
    a: "[Jordan Q4, Q6] Yes. We reset the system, set it up in your name and give you the admin account, so nobody else has access to it.",
  },
  {
    q: "Can InstallPros see my cameras?",
    a: "[Jordan Q6] No. The system is registered to you, and nobody can view it without your permission. If you ever want our help remotely, you approve it in the app for as long as you choose, and you can switch it off.",
  },
  {
    q: "Can my cameras look at the street or next door?",
    a: "Your cameras can cover your own property. If one also picks up the street or a neighbour's garden, data protection rules apply to you: put up a sign, keep the footage secure and only for as long as you need it. We aim every camera at what is yours, and can mask out a neighbour's windows or garden in the camera's settings.",
  },
  {
    q: "Do you need to visit first?",
    a: "[Jordan Q7] Most homes we quote from photos. Some need a visit, and we will tell you when we call.",
  },
  {
    q: "Do you cover my area?",
    a: "[Jordan Q11] Put your postcode in the form and we will confirm it when we call, along with the earliest date we can fit.",
  },
  {
    q: "Who comes to fit it?",
    a: "One of our engineers, DBS checked and insured. They fit and test every camera, set up the app on your phones and show you how to play recordings back.",
  },
  {
    q: "What warranty do I get?",
    a: "[Jordan Q5] Every camera and recorder carries the manufacturer's warranty, and our workmanship warranty covers the fitting for [X] years.",
  },
  {
    q: "What if something stops working later?",
    a: "[Jordan Q4, Q5] Message us on WhatsApp. A new router, a new phone or an app that logs you out can usually be sorted remotely, and the fitting is under our warranty for [X] years.",
  },
  {
    q: "Can you fit an alarm as well?",
    a: "[Jordan Q3] Yes. We fit Ajax alarms, and with an alarm we use Ajax cameras so everything is in one app.",
  },
  {
    q: "Do you fit CCTV for businesses?",
    a: "[Jordan Q1]",
  },
  {
    q: "Is Hikvision safe to use?",
    a: "[Jordan Q9] Yes, you can have Hikvision at home. In 2022 the UK government told its own departments to stop putting cameras from Chinese manufacturers on sensitive government sites, and it has said that does not apply to private individuals or businesses. There is no UK ban on using Hikvision at home. Whatever the brand, the real risks are weak passwords, old firmware and cameras left open to the internet, so we set every system up with its own strong passwords and current firmware, with no open ports on your router, and your recordings stay on the recorder in your home.",
  },
];
