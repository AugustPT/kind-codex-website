// Short cold follow-up nudges (touches #2 and #3). Kept deliberately brief and
// low-pressure. The first touch is the personalized email from outreach-queue.json;
// these are the automated follow-ups that fire only if there's been no reply.

function firstName(name: string): string {
  const n = (name || "").trim();
  if (n && !/team|group|realty|properties|management|office|llc|inc/i.test(n)) {
    return n.split(/\s+/)[0];
  }
  return ""; // fall back to a team greeting
}

function greeting(name: string, company: string): string {
  const f = firstName(name);
  return f ? `Hi ${f},` : `Hi ${company} team,`;
}

const LINE: Record<string, string> = {
  "never-miss-a-lead": "catching every inbound lead the second it lands",
  "sort-my-leads": "auto-sorting your leads so the best ones surface first",
};

export interface FollowupLead {
  name: string;
  company: string;
  funnel: string;
  subject: string;
}

// step is the touch number being SENT (2 or 3).
export function followupEmail(step: number, lead: FollowupLead): { subject: string; body: string } {
  const g = greeting(lead.name, lead.company);
  const value = LINE[lead.funnel] || "catching every lead before it goes cold";
  const subject = `Re: ${lead.subject}`;

  if (step <= 2) {
    return {
      subject,
      body: `${g}

Quick one, genuinely useful and no pitch: how fast do you actually reply to a brand-new lead? It's the single biggest thing that decides who wins the buyer, and most agents are slower than they'd guess.

I built a free 60-second check that times your real response speed and gives you a tip to improve it. Want yours? Just reply "SCORE" and I'll send it right over.

- August, KindCodex (Honolulu)`,
    };
  }

  // step 3 — confident takeaway, not an apology
  return {
    subject,
    body: `${g}

I'll take the quiet as a "not right now" and close out your file so I'm not cluttering your inbox.

If you're at all curious how your lead response speed stacks up, reply "SCORE" and I'll send you the free 60-second check plus one tip to improve it. No pitch either way. This is my last note.

- August, KindCodex (Honolulu)`,
  };
}
