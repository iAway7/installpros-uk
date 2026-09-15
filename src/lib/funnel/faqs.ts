/**
 * Master FAQ list. Compiled from AnswerThePublic + competitor research + the
 * live InstallPros FAQ, answered for the UK.
 *
 * Each FAQ is tagged with a `category` (used for the tabs on the landing FAQ
 * section) and a `service` (used for the tabs on the standalone /faqs hub).
 * Right now every FAQ is for Starlink; other services can be added over time.
 */
export const FAQ_CATEGORIES = ["Pricing", "Installation", "Coverage & WiFi", "Support"] as const;
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
 * Commercial landing FAQ.
 *
 * Reordered and rewritten on 9 September 2026 from the Superchat commercial
 * corpus (about eighty conversations). The old order opened with failover,
 * because Will called it "the primary use case". Nobody in those eighty
 * conversations asks about failover or backup even once. What they ask is
 * whether the thing will run the equipment they already own: tills, card
 * terminals, phones, gates, cameras, a VPN, eight people at the same time.
 *
 * So the capability questions come first now and failover drops to eleventh.
 * It stays on the list because nobody asks for a thing they do not know
 * exists, and Will sells it, but it is not what the visitor arrives with.
 *
 * Four went to make room. "Where do you cover?" duplicated the hero postcode
 * check and the coverage map section. "What is included?" duplicated the
 * equipment section three blocks above it and said nothing specific. The two
 * timing questions and the out-of-hours one were three answers to one worry
 * and are now a single entry.
 *
 * Three of the new answers touch things only Will can confirm: whether a
 * customer VPN works over a static IP, whether a given number can be ported,
 * and the real limits of a point to point link. Each is written so that it is
 * true without the unconfirmed part, and defers the specific to the survey
 * rather than promising it here. If Will confirms the specifics they can be
 * tightened; nothing needs correcting if he does not.
 *
 * Answered by Will on 8 Sep 2026: failover yes, out of hours yes, multi-site
 * yes, account terms yes, lead time "within days" with emergency set-up for a
 * business suddenly offline. VAT was never in doubt: we are VAT registered
 * (GB456635174, in the footer).
 *
 * There is deliberately no finance FAQ here. Super/Abound credit is an FCA
 * regulated financial promotion, and business lending is not the same product
 * as the consumer credit in the footer. That copy has to come from Super or
 * Abound, not from us.
 */
export const COMMERCIAL_FAQS: { q: string; a: string }[] = [
  {
    // "Is this a business package rather than residential? Or does it not make
    // any difference?" This is the question that decides the plan, and it was
    // not answered anywhere on the site.
    q: "Is this a business package or a residential one?",
    a: "It makes a difference and we set up either. Starlink's business plans give your traffic priority on the network, which matters when the area is busy, and they come with a business account and VAT invoicing. The residential plans cost less and are fine for a small unit with a handful of people. We tell you which one your site actually needs at survey instead of putting every business on the same plan.",
  },
  {
    // "So we can connect payment devices", "to be able to offer WiFi to
    // customers as well as connecting our till systems".
    q: "Will it run our tills and card machines?",
    a: "Yes. Card terminals, cloud tills, cameras and customer WiFi all run over it the same as any other connection. Tell us what you use at survey and we will set the network up around it, including keeping the WiFi you give customers separate from the equipment that takes payments.",
  },
  {
    // "how would you run a phone off this and could I keep my buisness phone
    // number". Portability depends on the number and the current provider, so
    // the answer commits to checking rather than to the outcome.
    q: "Can we run our phones off this and keep our number?",
    a: "Yes, phones can run over the connection, and we can supply the handsets and the service if you need them. Keeping your existing number usually works, but it depends on the number and who currently holds it, so we check that before you commit rather than after.",
  },
  {
    // "Will this take 8 users ?" and "What speed can you guarantee" and "In a
    // commercial environment?". The old answer to this one said "we configure
    // the system for the number of people on site", which does not answer
    // either half. Nobody can guarantee a speed on a shared network, and
    // saying so is worth more than a number we would have to walk back.
    q: "How many users will it take, and what speed can you guarantee?",
    a: "A unit with eight or ten people is well within what one dish handles, and we size it against what you actually run rather than a head count. On speed, nobody can guarantee a figure on Starlink and anyone who does is guessing, because it is a shared network and the number moves. What we can do is test the connection under load before we leave, so what you see is your real speed rather than a brochure one.",
  },
  {
    // "apparently they said this would not work with Starlink, looking at what
    // the workaround is". The blocker is CGNAT, described here in plain words.
    // Whether a specific VPN works over a static IP is a survey question, not
    // a promise for a landing page.
    q: "Will our VPN work over Starlink?",
    a: "Usually, and where it does not the fix is known. The standard service puts you behind shared addressing, which is what breaks inbound connections and some VPNs. A static IP address solves that and is available with the managed service. Tell us which VPN you run at survey and we will tell you which of the two you need before you order anything.",
  },
  {
    // "Would the one satellite give internet coverage for the properties
    // surrounding our building ?", "what would be the costs for installing
    // starlink to six properties".
    q: "Can one dish cover several buildings on the same site?",
    a: "Often, yes. We link outbuildings and neighbouring units back to the main dish with a point to point wireless link, which usually costs less than a second subscription. Sometimes a second dish is the better answer and we will say so. Distance, line of sight and what sits in between decide it, which is what the survey is for.",
  },
  {
    // Was three separate entries: lead time, duration, and out of hours. They
    // are three answers to one worry, which is whether this fits around the
    // business.
    q: "How soon can you start, and how long does it take?",
    a: "Within days of the survey in most cases, and if a business is suddenly without internet we can arrange an emergency set-up rather than book you into the normal queue. Most installs are done in a single day, typically three to five hours on site. We can work evenings or weekends where the site cannot stop trading. Larger or multi-building sites take longer, and we tell you that at survey rather than on the day.",
  },
  {
    q: "Do I need to buy the Starlink kit first?",
    a: "No. We can supply the kit as part of the job, or install one you already own.",
  },
  {
    // Will's own answer, tightened. This objection was not addressed anywhere on
    // the site and it is the one a burned customer arrives with. The chat log
    // backs it: "We are using 4g and converting it to WiFi, speed is in and
    // out, best speeds of 60mbps but currently on 2".
    q: "We tried a 4G router and it was not reliable. Why is this different?",
    a: "A 4G router on its own will not keep a business running. A combined system will. We design the connection so there is more than one way out of the building, and we manage it, so you keep operating even when your main source of internet is down.",
  },
  {
    q: "Can you do multiple sites?",
    a: "Yes. We install and manage multi-site estates, with the same setup and the same point of contact across all of them.",
  },
  {
    // Eleventh, not first. Will calls this the primary use case and it may well
    // be where his margin is, but no commercial visitor in the corpus arrives
    // asking for it.
    q: "Can Starlink back up our existing line rather than replace it?",
    a: "Yes, and for a lot of our commercial customers that is the point. You keep the line you already have, whether that is fibre or a leased line, and we add Starlink alongside it with 5G as a further fallback. If one link goes down the site keeps working. We set the changeover up during the installation and test it before we leave.",
  },
  {
    q: "Do you invoice with VAT and can we pay on account?",
    a: "Yes to both. Every commercial job is invoiced with VAT and we can open an account for you, and we will provide a formal written quote your finance team can raise a purchase order against.",
  },
];

/**
 * The concise, curated FAQ shown on the landing pages (no tabs). Kept separate
 * from the full ALL_FAQS list (which still powers the /faqs hub). Also used for
 * each landing page's FAQPage structured data so schema matches what's visible.
 */
export const LANDING_FAQS: { q: string; a: string }[] = [
  {
    q: "How much does Starlink installation cost in the UK?",
    a: "Every job is quoted upfront and fixed before we arrive. No hidden fees, no surprises on the day. Complete supply-and-install and installation-only packages available.",
  },
  {
    q: "What's included in a standard installation?",
    a: "Everything: a site survey and obstruction scan, all-metal mounting to wall, roof or pole, discreet weatherproofed cable routing, router setup, mesh configuration where needed, and a full speed test before we leave. We also make sure every device in your home is connected before we go. We don't just turn up, install and run away.",
  },
  {
    q: "Do I need to buy mounts or accessories from Starlink first?",
    a: "No. We supply durable, all-metal mounts and every accessory required. Already have your Starlink kit? We'll install it. Don't have it yet? We can supply the complete system.",
  },
  {
    q: "How quickly can you install?",
    a: "Typically within 7 days of your quote, same-week in most areas. We're usually on site for a minimum of 3 hours, and your system reaches optimal performance within about 12 hours.",
  },
  {
    q: "Do you cover my area?",
    a: "Almost certainly. Our engineers cover all four nations: 225+ towns and cities covered, from the Highlands to Cornwall. Request a quote and we'll confirm your postcode straight away.",
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
    a: "We're usually on site for a minimum of 3 hours, depending on the mount and cable run. After setup it can take up to 12 hours for Starlink to fully optimise with the satellites, which is completely normal, and we'll explain everything before we go.",
  },
  {
    category: "Pricing",
    service: "Starlink Installation",
    q: "How much does Starlink installation cost in the UK?",
    a: "Our professional installation covers secure mounting, weatherproof cabling and full router setup by an accredited UK engineer. Complete supply-and-install and installation-only packages are available. The Starlink kit and monthly plan are purchased separately from Starlink. You'll get a fixed, all-in price for your property before you book, with no surprises on the day.",
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
    category: "Coverage & WiFi",
    service: "Starlink Installation",
    q: "Does Starlink come with a router, and will the WiFi reach the whole house?",
    a: "Yes, the Starlink kit includes a WiFi router and everything needed to get online. For larger or multi-storey homes where the signal won't reach every room, we offer mesh WiFi and can calibrate coverage so it works throughout the property.",
  },
  {
    category: "Coverage & WiFi",
    service: "Starlink Installation",
    q: "Will my Starlink be up and running before the engineer leaves?",
    a: "In most cases, yes. We align the dish, connect the router and test your speeds before we leave, so you're online the same visit. Occasionally Starlink needs a few hours to fully optimise with the satellites after setup. If so, we'll confirm it's working and explain exactly what to expect.",
  },
  {
    category: "Coverage & WiFi",
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

/**
 * Vehicle landing FAQ: motorhomes, campervans, cars, private hire and boats.
 *
 * Written on 10 September 2026 from the 36 vehicle and boat conversations in
 * the Superchat corpus and from the two WordPress pages that already exist for
 * cars and campervans. The questions are the ones customers typed, tidied but
 * not reordered by what we would rather talk about: how it mounts, whether it
 * has to come off, where the work happens, what power it needs, which plan,
 * and only then what it costs.
 *
 * Nothing here names a workshop town or a call-out charge. Both were said
 * differently by different people in the chat, and one version cost a job
 * ("No good to me it's a 4.5hr drive. Advertised as Cheltenham"). Until Will
 * fixes them the answers say what is true either way and leave the specific to
 * the quote.
 *
 * No finance line, for the same reason as the commercial list: regulated
 * financial promotions are not ours to write. A 50% deposit with the balance
 * after the fitting is what the team already offers in the chat, so that is
 * what is said.
 */
export const VEHICLE_FAQS: { q: string; a: string }[] = [
  // Seven entries that between them cover all sixteen questions the vehicle
  // conversations actually ask (superchat-analysis/vehicle-top-15-questions.md),
  // grouped so that nobody reaches the bottom of the page with one of the
  // sixteen unanswered. Ordered by how often each comes up. Some of it repeats
  // a section above; that is deliberate, people who scroll straight to the
  // FAQ still get the answer. Every quote in the comments is a customer's.
  {
    // 8 of 30 ask where, 4 ask how long, 3 have not got the vehicle yet.
    // "When I'm going to do it where will I bring the motorhome to get it
    // installed", "How long would the installation take?", "I've not got the
    // motorhome yet". Hours from the campervan page on installpros.co.uk.
    q: "Where does it happen, and how long does it take?",
    a: "Either at an installation facility, where you bring the vehicle in and drive off with it working, or at your location: your drive, the storage yard or the depot. Tell us the postcode and we confirm which, and any travel charge, with the quote and before you book anything. Most fittings take two to five hours, and the connection settles to full performance within about twelve hours. Not got the vehicle yet? Send the make and model and we book the fitting for the week you collect it.",
  },
  {
    // 7 of 30. "Do you need to drill a hole in the ceiling or will it be done
    // by suction?", "we do not have roof rails but would like it fixed", "as
    // few holes in roof as possible Magnetic?", "Its aluminium mate", "Should
    // be like that inside on front windscreem above my dashbord", and the leak
    // question from the WordPress page.
    q: "How does it fix on? Drilling, suction cups, roof rails, leaks",
    a: "Heavy-duty magnets on a steel roof, clamps on rails or seams, and a bonded plate where there is nothing to grip. Roof rails help but are not needed, and we do not fit suction mounts. The cable comes in through an existing grommet, vent or the boot seal, sealed and weatherproof, so nothing leaks. Where a hole is genuinely the right answer we seal it properly and tell you before we start. It goes on the roof, not behind the windscreen: glass takes away most of the signal.",
  },
  {
    // 3 of 30. "We would rather not add to the height of the van if we can
    // help it", "Is there anything we can do to account for the car being
    // black whilst the Starlink mini is white?", "a bit more secure and
    // discrete". Dimensions to be confirmed against Starlink's spec sheet.
    q: "Will it look right on my vehicle? Height, and a white dish on a black car",
    a: "The Starlink Mini is a flat panel about the size of a laptop and the mount sits close to the roof, so you add a few centimetres, not a box. If height matters for a barrier or a garage, tell us and we place it accordingly. On a dark vehicle we use black mounting hardware and put the dish where it shows least. The panel itself stays white, which is Starlink's choice rather than ours.",
  },
  {
    // 7 of 30 on permanent or removable, 4 on driving. "I'm thinking a
    // permanent installation", "Removable", "We are looking for a fixed not
    // magnetic unit.", "Can it be retractable when driving?"
    q: "Permanent or removable, and does it have to come off to drive?",
    a: "We recommend permanent. The mount is the easy part; the wiring is what makes it just work when you pull up, and a permanent feed is what gives you that. It stays on the roof and keeps working while you drive on a Roam plan, so there is nothing to take down. If you need the dish to come off the vehicle regularly, say so and we will tell you whether a magnetic mount suits your roof.",
  },
  {
    // 6 of 30 raise it, 11 once asked. "The most important thing is
    // converting from 230V to the car's system.", "We will be on EHU unless
    // travelling to another site, what would you suggest?", "Yeah 12v
    // cigarette light point."
    q: "What power does it need? I only have a 12 V socket.",
    a: "The Mini runs on 12 to 48 V DC, so no conversion is needed. We fit a fused, protected feed from your leisure battery or the vehicle's 12 V system, and on a campsite the 240 V hook-up charges that same battery, so it works off grid and on site without you doing anything. A 12 V socket will run it, but a permanent feed does not get knocked out and does not flatten the starter battery.",
  },
  {
    // 5 of 30 on their own kit, 1 festival. "I do have everything... I just
    // need the instalation", "do you provide the equipment or will I need to
    // buy this?", "This is for a camping festival".
    q: "Do you supply the Mini, fit the one I have, or rent one out?",
    a: "Both of the first two. If you have nothing yet, we supply the Mini with the fitting. If you already own one, the quote drops by the price of the kit and covers the mount, the cabling, the power feed and the set-up; tell us what came in your box and we work from that. We do not rent. For a one-off festival or weekend, Starlink sells the Mini directly and it can run on a battery pack.",
  },
  {
    // 4 of 30. "Hi I want starlink for my motorhome to travel to Europe how
    // much does it cost", "I'm wanting a roaming skylink", "who/how we pay for
    // subscriptions etc please". Prices are Starlink's, from the text the team
    // sends in the chat; check starlink.com before touching them.
    q: "Which plan for touring, does it work abroad, and can I pause it?",
    a: "Starlink Roam. It works on the move, across the UK and for up to two months at a time abroad, and it renews every 30 days with no minimum term. Starlink's current UK pricing is £50 a month for 50 GB or £96 a month unlimited, and you can pause it from the app for any month you are not touring and restart it when you are. You pay Starlink for the plan; you pay us once for the fitting.",
  },
];
