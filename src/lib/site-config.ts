import type { InstallType } from "@/lib/analytics/events";

export const siteConfig = {
  name: "InstallPros",
  domain: "get.installpros.co.uk",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://get.installpros.co.uk",
  tagline: "Accredited Starlink installation across the UK",
  description:
    "Professional Starlink installation across the UK. Fast, fully-fitted satellite internet for homes, businesses and rural properties. Free quote in 60 seconds — check your coverage now.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "447000000000",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+441234567890",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@installpros.co.uk",
} as const;

export function whatsappLink(message = "Hi InstallPros, I'd like a quote for Starlink installation.") {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const installTypes: { value: InstallType; label: string; blurb: string; icon: string }[] = [
  { value: "residential", label: "Home", blurb: "Standard residential roof or wall mount", icon: "Home" },
  { value: "rural", label: "Rural / Off-grid", blurb: "Properties with no usable broadband", icon: "Trees" },
  { value: "business", label: "Business", blurb: "Offices, sites and failover connectivity", icon: "Building2" },
  { value: "marine", label: "Marine / Mobile", blurb: "Boats, motorhomes and vehicles", icon: "Ship" },
  { value: "events", label: "Events / Temporary", blurb: "Pop-ups, festivals and short-term sites", icon: "Tent" },
];

export const trustStats = [
  { value: "2,400+", label: "Installations completed" },
  { value: "4.9/5", label: "Average review score" },
  { value: "Full UK", label: "Mainland coverage" },
  { value: "12-month", label: "Workmanship guarantee" },
];

export const benefits = [
  {
    icon: "Gauge",
    title: "Speeds up to 250 Mbps",
    body: "Stream, video-call and work from anywhere with low-latency satellite broadband that rivals fibre — no cabinet or phone line required.",
  },
  {
    icon: "ShieldCheck",
    title: "Reliable in bad weather",
    body: "Professionally aligned dishes with clear sky-view placement keep you online through rain and wind, backed by our 12-month workmanship guarantee.",
  },
  {
    icon: "Trees",
    title: "Built for rural UK",
    body: "If you're stuck on 2 Mbps ADSL or have no broadband at all, Starlink reaches where fibre and 4G can't. Most rural homes are online the same day.",
  },
  {
    icon: "Briefcase",
    title: "Business-grade failover",
    body: "Keep tills, CCTV and teams connected with a dedicated or backup connection. Priority data plans and SLAs available for commercial sites.",
  },
];

export const processSteps = [
  {
    step: 1,
    title: "Check your coverage",
    body: "Enter your postcode for an instant, real availability check — we confirm your exact location, not a generic 'available' message.",
  },
  {
    step: 2,
    title: "Get your fixed quote",
    body: "Tell us your property type and we send a transparent, all-in price — hardware, mounting and labour. No surprises on the day.",
  },
  {
    step: 3,
    title: "Book your install",
    body: "Pick a slot that suits you. Our accredited engineers handle mounting, cabling and weatherproofing to a professional standard.",
  },
  {
    step: 4,
    title: "Get online — same day",
    body: "We align the dish, test your speeds and walk you through the app before we leave. You're connected before we pack up.",
  },
];

export const faqs = [
  {
    q: "How much does Starlink installation cost in the UK?",
    a: "Hardware starts around £299 with a monthly plan from £75. Our professional installation is quoted per property based on mount type and cable run — you get a fixed, all-in price before you book, with no hidden extras.",
  },
  {
    q: "Will Starlink work at my address?",
    a: "Starlink covers all of UK mainland and most islands. Use the coverage checker above for an instant confirmation of your specific postcode, including any short waitlist in high-demand cells.",
  },
  {
    q: "How fast is Starlink?",
    a: "Most UK customers see 100–250 Mbps download and 10–25 Mbps upload, with latency of 25–50 ms — fast enough for 4K streaming, video calls and online gaming.",
  },
  {
    q: "How long does installation take?",
    a: "A standard residential install takes 2–3 hours. Complex mounts, long cable runs or commercial sites may take longer — we confirm timing when we quote.",
  },
  {
    q: "Do you install for businesses and rural sites?",
    a: "Yes. We handle homes, farms, off-grid properties, offices, construction sites, boats and motorhomes. Tell us your property type in the quote form and we'll tailor the solution.",
  },
  {
    q: "Is the installation guaranteed?",
    a: "Every installation comes with a 12-month workmanship guarantee. Our engineers are fully insured and weatherproof every mount and cable entry to a professional standard.",
  },
];
