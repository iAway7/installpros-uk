/**
 * FAQs for the 4G/5G and fibre page. Their own file, like voip-faqs.ts,
 * because faqs.ts is imported by /install-quote.
 *
 * From what the chats asked and what competitors' FAQs repeat
 * (4g-5g-fibre-research, sections 1 and 4), in the plan of
 * 4g-5g-fibre-research/estructura-y-borrador.md. Some repeat a section on
 * purpose (no signal, boosters, fibre later): a FAQ is where people look.
 *
 * Assumes Will's answers until he gives them (preguntas-will.md): fibre
 * lines (4), the switch time (5), the battery (7), fibre later (10).
 *
 * Kept off on purpose: prices, speeds, "up to", "unlimited", uptime,
 * "booster", "Ofcom approved", "no planning permission needed", "we can get
 * you fibre", vouchers.
 */
export const CONNECTIVITY_FAQS: { q: string; a: string }[] = [
  {
    q: "Do I need Starlink?",
    a: "Not always. If a mast reaches you, a 4G/5G antenna may be enough. We tell you which after the check.",
  },
  {
    q: "Will a 4G/5G antenna work at my house?",
    a: "Only if a mast reaches you outside. We check which networks do before we quote. If none do, Starlink is the answer.",
  },
  {
    q: "Is the antenna a signal booster?",
    a: "No. It connects to your router, not your phone. We don't sell outdoor boosters; some sold online are illegal in the UK.",
  },
  {
    q: "Can you get me fibre?",
    a: "We can't build fibre: Openreach and other networks decide where it goes. We check what's planned for your postcode and connect it when it comes.",
  },
  {
    q: "What if fibre comes after I get Starlink?",
    a: "Keep Starlink as your backup, or stop the plan. Your router takes the fibre too.",
  },
  {
    q: "How fast will it be?",
    a: "It depends on your address. We check before we recommend, and we don't promise a figure.",
  },
  {
    q: "Will the backup keep a call going?",
    a: "It switches on its own within seconds. A call or download in progress may drop.",
  },
  {
    q: "Can I check my cameras or use a VPN on 4G/5G?",
    a: "Tell us first. Many mobile plans block remote access.",
  },
  {
    q: "What about a power cut?",
    a: "Your dish and routers need power. Ask us about a battery backup.",
  },
];
