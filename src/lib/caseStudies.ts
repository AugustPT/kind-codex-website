// Single source of truth for the /casestudy deck and detail pages.
// Adding a study = append one CaseStudy object + drop its screenshot in
// public/casestudies/. No route or component changes required.

export type Section =
  | { kind: "prose"; eyebrow: string; body: string[]; pullQuote?: string }
  | { kind: "cards"; eyebrow: string; intro?: string; items: { title: string; desc?: string }[] }
  | { kind: "list"; eyebrow: string; intro?: string; items: string[] }
  | { kind: "steps"; eyebrow: string; intro?: string; items: string[] }
  | { kind: "quote"; eyebrow: string; quote: string };

export interface CaseStudyDetail {
  title: string;
  client: string;
  metaChips: string[];
  liveLinks: { label: string; url: string }[];
  heroImage: string;
  heroAlt: string;
  sections: Section[];
}

export interface CaseStudy {
  slug: string;
  order: number;
  industry: string;
  painNav: string;
  headline: string;
  summary: string;
  liveUrl: string;
  liveLabel: string;
  screenshot: string;
  screenshotAlt: string;
  detail: CaseStudyDetail;
}

const associatedHawaii: CaseStudy = {
  slug: "associated-hawaii",
  order: 1,
  industry: "Real estate",
  painNav: "Trust before the first call",
  headline: "Earning trust before the first phone call",
  summary:
    "How we turned a real-estate listings page into Oʻahu's relocation guide — so off-island buyers arrive already trusting the team.",
  liveUrl: "https://associated-hawaii.vercel.app",
  liveLabel: "associated-hawaii.vercel.app",
  screenshot: "/casestudies/associated-hawaii.png",
  screenshotAlt:
    "The Associated Real Estate Advisors guided website, asking visitors to get clarity before contacting an agent.",
  detail: {
    title: "Turning a real estate website into an Oʻahu relocation guide",
    client: "Associated Real Estate Advisors",
    metaChips: ["Real estate · Oʻahu, HI", "Trust funnel", "Guided website"],
    liveLinks: [{ label: "View the live site", url: "https://associated-hawaii.vercel.app" }],
    heroImage: "/casestudies/associated-hawaii.png",
    heroAlt:
      "The Associated Real Estate Advisors guided website hero: Buying, Selling, or Managing Property in Oʻahu? Start Here.",
    sections: [
      {
        kind: "prose",
        eyebrow: "The problem",
        body: [
          "Associated wanted to reach buyers, sellers, and property-management clients who were off-island or new to the Oʻahu market.",
          "The blocker wasn't visibility — it was trust. Someone coming to Oʻahu doesn't just need an agent. They need context: the island, the neighborhoods, the process, and the questions they should be asking before they decide.",
          "So the real goal wasn't “get more clients.” It was to become the place those clients trusted before the first phone call.",
        ],
        pullQuote: "It wasn't visibility. It was trust.",
      },
      {
        kind: "prose",
        eyebrow: "The strategy",
        body: [
          "We repositioned the project from a basic real estate page into a guided entry point for people trying to understand Oʻahu real estate.",
          "Instead of pushing visitors to “contact an agent,” the page helps them orient themselves first — answering the questions buyers, sellers, and owners already have.",
          "That turns the website from a brochure into a trust-building funnel.",
        ],
      },
      {
        kind: "cards",
        eyebrow: "What we built",
        intro:
          "A guided experience that helps each visitor choose the path that fits them — and hands the business a qualified inquiry instead of a vague message.",
        items: [
          { title: "Buying", desc: "Orient first-time and off-island buyers before they reach out." },
          { title: "Selling", desc: "Set expectations for owners deciding to sell." },
          { title: "Property management", desc: "Reassure owners who can't be on island." },
          { title: "Exclusive developments", desc: "Route serious buyers to the right opportunities." },
          { title: "Learning more", desc: "A low-pressure path for people who aren't ready to talk yet." },
        ],
      },
      {
        kind: "list",
        eyebrow: "Why it matters",
        intro: "Off-island buyers and owners are usually still asking:",
        items: [
          "Where should I look, and which areas fit my goal?",
          "What should I know before buying on Oʻahu?",
          "Can someone manage the property if I'm not on island?",
          "Who can explain this without making me feel lost?",
        ],
      },
      {
        kind: "list",
        eyebrow: "The bigger plan",
        intro: "This page is the first step in a larger system that can expand into:",
        items: [
          "Neighborhood and area guides",
          "Buyer education pages",
          "Seller preparation pages",
          "Property management explainers",
          "Relocation content and email follow-up",
          "Lead routing by client type",
          "Search and AI discovery content",
        ],
      },
      {
        kind: "quote",
        eyebrow: "The result",
        quote: "People looking at Oʻahu real estate don't just need listings. They need a guide.",
      },
    ],
  },
};

const eatonSquare: CaseStudy = {
  slug: "eaton-square",
  order: 2,
  industry: "Shopping center",
  painNav: "Noticed, not walked past",
  headline: "Turning a place you'd walk past into one you stop for",
  summary:
    "We built a field-capture system that turned a hidden shopping center into a clear, living business directory.",
  liveUrl: "https://eatonsquarehi.com",
  liveLabel: "eatonsquarehi.com",
  screenshot: "/casestudies/eaton-square.png",
  screenshotAlt: "The Eaton Square public directory site for Waikīkī.",
  detail: {
    title: "Turning a hidden shopping center into a clear business directory",
    client: "Eaton Square",
    metaChips: ["Shopping center · Waikīkī, HI", "Field-capture system", "Business directory"],
    liveLinks: [
      { label: "The field-capture app", url: "https://eaton-square-field-capture.vercel.app" },
      { label: "The public directory", url: "https://eatonsquarehi.com" },
    ],
    heroImage: "/casestudies/eaton-square-capture.png",
    heroAlt:
      "The Eaton Square Field Capture app: a business record with Call, Map, Record Guided Interview, and Start Photo Guide actions.",
    sections: [
      {
        kind: "prose",
        eyebrow: "The problem",
        body: [
          "Eaton Square has a simple but serious problem: it's easy to walk past. Most people don't know what businesses are inside, what they offer, or why they should stop.",
          "It wasn't really a signage problem — it was a discovery problem. A visitor could be standing right in front of the property and still not understand what was available.",
          "Businesses lose attention, visitors lose clarity, and management loses an easy way to show the full value of the location.",
        ],
        pullQuote: "It wasn't signage. It was discovery.",
      },
      {
        kind: "prose",
        eyebrow: "The strategy",
        body: [
          "We approached it as a discovery problem first. Before building a public directory, every business had to be mapped, documented, and understood.",
          "So the first build wasn't the website. It was the system for collecting the accurate, living information the website would need to actually be useful.",
        ],
      },
      {
        kind: "cards",
        eyebrow: "What we built",
        intro:
          "The Eaton Square Field Capture build — an internal app that guides someone through visiting or calling each business and capturing everything the public directory needs.",
        items: [
          { title: "Guided interview", desc: "A scripted on-site interview, recorded and transcribed into usable text." },
          { title: "Photo guide", desc: "A step-by-step flow for clean, consistent storefront photos." },
          { title: "Call & map", desc: "Reach or route to each business straight from the field." },
          { title: "Report", desc: "Flag issues management should know about, business by business." },
        ],
      },
      {
        kind: "steps",
        eyebrow: "How the capture worked",
        intro: "The app gave the field person one simple, repeatable workflow:",
        items: [
          "Map the business",
          "Call or visit the location",
          "Run the guided interview",
          "Capture photos",
          "Move to the next business",
        ],
      },
      {
        kind: "list",
        eyebrow: "What it captured",
        intro: "Directly from each business — not guessed:",
        items: [
          "Business name, address, phone, and hours",
          "Contact person and email",
          "Social links and photos",
          "Products, services, and specialties",
          "Promotions and the business story",
          "Pain points management should know about",
        ],
      },
      {
        kind: "prose",
        eyebrow: "Why it matters",
        body: [
          "Most directories fail because they're built from stale or incomplete information — wrong hours, missing numbers, no photos, generic descriptions.",
          "This build solved that at the source: a repeatable way to collect real information from every business, captured directly from them.",
          "It also gave management a clearer view of what each business offers, what it needs, and where small issues might be affecting the whole property.",
        ],
        pullQuote: "Built from the source, not from assumptions.",
      },
      {
        kind: "list",
        eyebrow: "Stage two — the directory",
        intro: "Once businesses were captured, the public site brought them into one place so visitors can quickly see:",
        items: [
          "What's inside Eaton Square",
          "Which businesses are there and what each offers",
          "How to contact them and when they're open",
          "What makes each one worth visiting",
        ],
      },
      {
        kind: "list",
        eyebrow: "The bigger plan",
        intro: "The capture system is the foundation for a full visibility layer:",
        items: [
          "A complete, always-current business directory",
          "QR codes around the property",
          "Storefront photo updates and spotlight pages",
          "Event and promotion listings",
          "Visitor guides and management reports",
          "Tenant issue tracking",
          "AI summaries generated from business updates",
        ],
      },
      {
        kind: "quote",
        eyebrow: "The result",
        quote:
          "People can't visit what they don't notice. We turned a hidden collection of businesses into one clear, walk-in-ready path.",
      },
    ],
  },
};

const iremHawaii: CaseStudy = {
  slug: "irem-hawaii-70th",
  order: 3,
  industry: "Events",
  painNav: "Worth showing up for",
  headline: "Making an anniversary feel worth showing up for",
  summary:
    "How we turned a 70-year milestone into a premium event experience — so the night felt important before anyone walked in.",
  liveUrl: "https://irem-hawaii-70th.vercel.app",
  liveLabel: "irem-hawaii-70th.vercel.app",
  screenshot: "/casestudies/irem-hawaii.png",
  screenshotAlt:
    "The IREM Hawaii 70th anniversary event page: a premium dark hero reading “70 Years. One Night.”",
  detail: {
    title: "Turning a 70-year anniversary into a premium event experience",
    client: "IREM Hawaii",
    metaChips: ["Events · Honolulu, HI", "Premium event page", "70th anniversary"],
    liveLinks: [{ label: "View the live site", url: "https://irem-hawaii-70th.vercel.app" }],
    heroImage: "/casestudies/irem-hawaii.png",
    heroAlt:
      "The IREM Hawaii 70th anniversary event page hero: “70 Years. One Night.” with a countdown and Claim Your Seat / Become a Sponsor actions.",
    sections: [
      {
        kind: "prose",
        eyebrow: "The problem",
        body: [
          "IREM Hawaii needed a page for its 70-year anniversary celebration — but it couldn't feel like a basic event page.",
          "A 70-year milestone carries history, credibility, leadership, and legacy. The page had to feel worthy of the moment: elevated enough for attendees, members, leaders, and sponsors to take seriously.",
          "It couldn't read like a flyer, and it couldn't read like a sponsorship ask. It needed to feel like an invitation to an important night in Hawaii real estate.",
        ],
        pullQuote: "It couldn't feel like a flyer.",
      },
      {
        kind: "prose",
        eyebrow: "The strategy",
        body: [
          "We positioned the whole event around one idea: 70 years in one night.",
          "The page needed to feel like an experience before the event even happened — leading with the milestone, the room, the venue, the history, the awards, and the people who would be there.",
          "Sponsorship was included, but as a premium opportunity to be associated with the milestone — not the main story. That keeps it balanced: attendees feel invited, members feel proud, sponsors feel the value.",
        ],
        pullQuote: "70 years in one night.",
      },
      {
        kind: "cards",
        eyebrow: "What we built",
        intro:
          "A premium event page built around two actions — claim your seat, become a sponsor — with the event first and sponsorship supporting it.",
        items: [
          { title: "The legacy", desc: "70 years of Hawaii real estate leadership, front and center." },
          { title: "The night", desc: "The venue, the schedule, and the celebration, made tangible." },
          { title: "The awards", desc: "The recognition and the people shaping the industry." },
          { title: "The leadership stage", desc: "A stronger platform to introduce the incoming president and the next era." },
        ],
      },
      {
        kind: "prose",
        eyebrow: "Why it matters",
        body: [
          "Most event pages only share logistics — date, time, location, register.",
          "A 70-year anniversary needs more than logistics. It needs weight, atmosphere, and a reason to show up.",
          "People don't attend on information alone; they attend when the event feels important. The page was built to make the milestone feel real before anyone walked into the room.",
        ],
        pullQuote: "People attend when the event feels important.",
      },
      {
        kind: "list",
        eyebrow: "The bigger plan",
        intro: "The page is the anniversary's digital home, ready to support:",
        items: [
          "Event registration and sponsor inquiries",
          "The incoming president's introduction",
          "Member announcements and awards promotion",
          "Email campaigns and partner outreach",
          "Social sharing and event reminders",
          "Post-event recap content",
        ],
      },
      {
        kind: "quote",
        eyebrow: "The result",
        quote: "Not just another dinner — 70 years of Hawaii real estate leadership in one night.",
      },
    ],
  },
};

const tlacuaches808: CaseStudy = {
  slug: "tlacuaches-808",
  order: 4,
  industry: "Restaurant",
  painNav: "From craving to checkout",
  headline: "Turning a craving into a completed order",
  summary:
    "How we built a one-page ordering path for a tucked-away restaurant — so a craving turns into checkout without the friction.",
  liveUrl: "https://tlacuaches808.vercel.app",
  liveLabel: "tlacuaches808.vercel.app",
  screenshot: "/casestudies/tlacuaches-808.png",
  screenshotAlt:
    "The Tlacuaches 808 ordering site: a bold hero reading “Mexican street food with island-sized portions” beside a birria tacos photo.",
  detail: {
    title: "Turning restaurant interest into actual orders",
    client: "Tlacuaches 808",
    metaChips: ["Restaurant · Eaton Square, Waikīkī", "One-page ordering", "Conversion funnel"],
    liveLinks: [{ label: "View the live site", url: "https://tlacuaches808.vercel.app" }],
    heroImage: "/casestudies/tlacuaches-808.png",
    heroAlt:
      "The Tlacuaches 808 one-page ordering site hero: “Mexican street food with island-sized portions” beside a birria tacos photo.",
    sections: [
      {
        kind: "prose",
        eyebrow: "The problem",
        body: [
          "Tlacuaches 808 had a common restaurant problem: people could be interested in the food but still not make it to the order.",
          "Most restaurant sites overwhelm with too many choices, too many clicks, too much friction. And this one is tucked inside Eaton Square — easy to miss if you don't already know where you're going.",
          "So a hungry customer is left asking: what do they serve, what should I order, where exactly is it, are they open, how do I order, how long will it take?",
        ],
        pullQuote: "Every unanswered question is a chance for the customer to leave.",
      },
      {
        kind: "prose",
        eyebrow: "The strategy",
        body: [
          "We designed the page around one goal: keep the customer moving toward the order.",
          "It guides someone from interest to action without making them think — explain the food simply, confirm the craving with strong photography, solve the location problem, and keep the menu and ordering on the same page so they never have to jump around.",
          "The strategy wasn't to show everything. It was to remove friction.",
        ],
        pullQuote: "The strategy wasn't to show everything. It was to remove friction.",
      },
      {
        kind: "cards",
        eyebrow: "What we built",
        intro: "A one-page ordering experience that takes the customer from craving to checkout without leaving the page.",
        items: [
          { title: "A clear food promise", desc: "“Mexican street food with island-sized portions.”" },
          { title: "Hero on the signature dish", desc: "Birria tacos with consommé for dipping — an instant reason to care." },
          { title: "Menu built into the page", desc: "Items, prices, and add-to-cart, no jumping around." },
          { title: "Checkout with a pickup window", desc: "A 20–25 min estimate that cuts “is it ready yet?” calls." },
        ],
      },
      {
        kind: "steps",
        eyebrow: "Solving the location problem",
        intro:
          "Tucked inside Eaton Square at 438 Hobron Lane, Unit 115. Alongside the address, hours, and an open-map link, the page walks customers to the counter:",
        items: [
          "Start at the Eaton Square entrance",
          "Follow the courtyard walkway",
          "Arrive at the counter",
        ],
      },
      {
        kind: "prose",
        eyebrow: "Why it matters",
        body: [
          "A restaurant website has one job: turn hunger into action.",
          "If the customer has to search, think, call, or guess too much, the order is at risk. This build removes those small points of friction — helping them understand the food, find the restaurant, and order quickly.",
          "It also saves the owner from answering the same questions about menu, location, hours, and pickup timing all day.",
        ],
        pullQuote: "A restaurant website has one job: turn hunger into action.",
      },
      {
        kind: "list",
        eyebrow: "The bigger plan",
        intro: "The page is the first step in a cleaner ordering system that can expand into:",
        items: [
          "Live online ordering with kitchen notifications",
          "Pickup estimates and menu updates",
          "Daily specials and delivery options",
          "Customer text updates and repeat-customer offers",
          "QR codes from nearby hotels",
          "Google Business and social traffic paths",
        ],
      },
      {
        kind: "quote",
        eyebrow: "The result",
        quote: "People shouldn't have to work hard to order good food. They should see it, crave it, find it, order it.",
      },
    ],
  },
};

export const caseStudies: CaseStudy[] = [associatedHawaii, eatonSquare, iremHawaii, tlacuaches808];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
