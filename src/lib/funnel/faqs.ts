/**
 * Master FAQ list. Compiled from AnswerThePublic + competitor research + the
 * live InstallPros FAQ, answered for the UK (installation from £899).
 *
 * Each FAQ is tagged with a `category` (used for the tabs on the landing FAQ
 * section) and a `service` (used for the tabs on the standalone /faqs hub).
 * Right now every FAQ is for Starlink; other services can be added over time.
 */
export const FAQ_CATEGORIES = ["Pricing", "Installation", "Coverage & Wi-Fi", "Support"] as const;
export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

/** Services offered — the /faqs hub shows one tab per service. */
export const FAQ_SERVICES = [
  "Starlink Installation",
  "Home Network",
  "Home Security",
  "Home Automation",
  "Gaming Simulators",
  "VoIP",
  "Digital Signage",
  "Business Security",
] as const;
export type FaqService = (typeof FAQ_SERVICES)[number];

export interface Faq {
  q: string;
  a: string;
  category: FaqCategory;
  service: FaqService;
}

/**
 * The concise, curated FAQ shown on the landing pages (no tabs). Kept separate
 * from the full ALL_FAQS list (which still powers the /faqs hub). Also used for
 * each landing page's FAQPage structured data so schema matches what's visible.
 */
export const LANDING_FAQS: { q: string; a: string }[] = [
  {
    q: "How much does Starlink installation cost in the UK?",
    a: "Every job is quoted upfront and fixed before we arrive. No hidden fees, no surprises on the day. Complete supply-and-install packages start at £899, and installation-only options are available if you already own your kit.",
  },
  {
    q: "What's included in a standard installation?",
    a: "Everything: a site survey and obstruction scan, all-metal mounting on any roof type, discreet weatherproofed cable routing, router setup, mesh configuration where needed, and a full speed test before we leave.",
  },
  {
    q: "Do I need to buy mounts or accessories from Starlink first?",
    a: "No. We supply durable, all-metal mounts and every accessory required. Already have your Starlink kit? We'll install it. Don't have it yet? We can supply the complete system.",
  },
  {
    q: "How quickly can you install?",
    a: "Typically within 7 days of your quote, same-week in most areas. Installation takes 1–3 hours on site, and your system reaches optimal performance within about 12 hours.",
  },
  {
    q: "Do you cover my area?",
    a: "Almost certainly. Our engineers cover all four nations: 175+ towns and cities served so far, from the Highlands to Cornwall. Request a quote and we'll confirm your postcode straight away.",
  },
];

export const ALL_FAQS: Faq[] = [
  {
    category: "Installation",
    service: "Starlink Installation",
    q: "Do you install on roofs, barns and poles, and can you avoid drilling holes?",
    a: "Yes to all: pitched and flat roofs, metal barns, chimneys, walls and custom poles. Where possible we route cables through existing entry points to avoid drilling, and when a new entry is needed we seal it fully weatherproof. Tell us your setup and we'll recommend the best mount.",
  },
  {
    category: "Installation",
    service: "Starlink Installation",
    q: "How long does the installation take?",
    a: "Most residential installs take 1–3 hours, depending on the mount and cable run. After setup it can take up to 12 hours for Starlink to fully optimise with the satellites, which is completely normal, and we'll explain everything before we go.",
  },
  {
    category: "Pricing",
    service: "Starlink Installation",
    q: "How much does Starlink installation cost in the UK?",
    a: "Our professional installation starts from £899, covering secure mounting, weatherproof cabling and full router setup by an accredited UK engineer. The Starlink kit and monthly plan are purchased separately from Starlink. You'll get a fixed, all-in price for your property before you book, with no surprises on the day.",
  },
  {
    category: "Pricing",
    service: "Starlink Installation",
    q: "What's included in a standard installation?",
    a: "A standard install covers mounting your dish in the best spot for a clear sky view, tidy weatherproofed cable routing into your home, connecting and testing the router, and a quick walkthrough of the Starlink app before we leave. Complex mounts, long cable runs or extra networking are quoted upfront.",
  },
  {
    category: "Pricing",
    service: "Starlink Installation",
    q: "Do I need to buy mounts or accessories from Starlink first?",
    a: "No, you don't need to order extra mounts or accessories in advance. We bring professional-grade, all-metal mounting hardware suited to your property and include it in your quote. Just have your Starlink kit ready, or we can advise on ordering one.",
  },
  {
    category: "Pricing",
    service: "Starlink Installation",
    q: "What are the downsides of Starlink, and can I get it for free?",
    a: "Starlink needs a clear view of the sky, so heavy obstructions or a poor mounting position can reduce performance, which is exactly why professional placement matters. It isn't generally free: the kit is a one-off purchase from Starlink with a monthly plan, and we handle getting it professionally installed.",
  },
  {
    category: "Installation",
    service: "Starlink Installation",
    q: "Can I install Starlink myself, or should I use a professional?",
    a: "A basic kit can be self-installed if you're comfortable using a drill and working safely at height. Professional installation gets your dish mounted securely in the optimal position, which is what really determines your speed and reliability, and gives you the peace of mind that it's done properly by an accredited, insured engineer.",
  },
  {
    category: "Installation",
    service: "Starlink Installation",
    q: "Do I need an electrician to install Starlink?",
    a: "No. Starlink is low-voltage and powers from a standard mains socket, so no electrician and no mains electrical work is required. Our engineers handle the mounting, cabling and router setup from start to finish. If you'd like a dedicated outdoor socket or advanced home networking, we can arrange that too.",
  },
  {
    category: "Installation",
    service: "Starlink Installation",
    q: "How do you decide where to install the dish?",
    a: "The dish needs a clear, unobstructed view of the sky, so we assess your roof lines, trees and nearby obstructions to find the spot with the best line of sight and the tidiest cable route. Getting placement right is the single biggest factor in your speed and reliability.",
  },
  {
    category: "Installation",
    service: "Starlink Installation",
    q: "What colour and how big is the Starlink dish?",
    a: "The current Standard Starlink dish is white and rectangular, roughly 30 × 50 cm, about the size of a large baking tray, on a slim stand or a wall/roof mount. Installed professionally, it sits discreetly and out of the way.",
  },
  {
    category: "Coverage & Wi-Fi",
    service: "Starlink Installation",
    q: "Does Starlink come with a router, and will the Wi-Fi reach the whole house?",
    a: "Yes, the Starlink kit includes a Wi-Fi router and everything needed to get online. For larger or multi-storey homes where the signal won't reach every room, we offer mesh Wi-Fi and can calibrate coverage so it works throughout the property.",
  },
  {
    category: "Coverage & Wi-Fi",
    service: "Starlink Installation",
    q: "Will my Starlink be up and running before the engineer leaves?",
    a: "In most cases, yes. We align the dish, connect the router and test your speeds before we leave, so you're online the same visit. Occasionally Starlink needs a few hours to fully optimise with the satellites after setup. If so, we'll confirm it's working and explain exactly what to expect.",
  },
  {
    category: "Coverage & Wi-Fi",
    service: "Starlink Installation",
    q: "What happens if there's no clear line of sight at my property?",
    a: "Starlink needs a clear view of the sky to perform well. Before you book, our postcode checker confirms you're in a serviced area, and on the day our engineer finds the position that best clears trees, chimneys and other obstructions. If a standard mount can't get a clear view, we'll recommend a taller pole or alternative location so you still get a reliable signal.",
  },
  {
    category: "Support",
    service: "Starlink Installation",
    q: "My Starlink kit hasn't arrived yet. Can I still book?",
    a: "Absolutely. You can book now and we'll schedule around your kit's arrival, or help you order one if you haven't yet. Many customers line up the install so we can fit it within days of the kit landing.",
  },
  {
    category: "Support",
    service: "Starlink Installation",
    q: "Who is an authorised Starlink installer, and are you accredited?",
    a: "Starlink is sold as a self-install product, so it doesn't appoint official fitters. Installers are independent professionals. InstallPros is an accredited, fully-insured UK installation company with thousands of completed installs and a 12-month workmanship guarantee. We operate independently of Starlink and SpaceX.",
  },
  {
    category: "Support",
    service: "Starlink Installation",
    q: "What happens if there's bad weather on installation day?",
    a: "For safety we may reschedule roof work during high winds or storms, at no extra cost, and agree a new slot that suits you. Once installed, a properly aligned dish keeps you online through normal British rain and wind.",
  },
  {
    category: "Support",
    service: "Starlink Installation",
    q: "How do I reschedule or cancel, and what happens after installation?",
    a: "Just message us and we'll move your slot, because we know plans change. We confirm every appointment beforehand and stay reachable by phone, WhatsApp and SMS. After installation, your workmanship is covered by our 12-month guarantee and we're on hand for any support you need.",
  },
  {
    category: "Support",
    service: "Starlink Installation",
    q: "What is the Starlink 2-month rule?",
    a: "The “two-month rule” applies to Starlink's Roam (mobile) plan, not to a fixed home install. On Roam you can use your dish outside your registered country or region for up to around 60 consecutive days; after that, Starlink may ask you to update your registered service address to your current location, or transfer the account, to avoid restrictions. For a standard UK home installation on a Residential plan it doesn't apply. Check starlink.com for the latest Roam terms.",
  },
];
