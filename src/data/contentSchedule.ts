// The queue the daily LinkedIn poster (/api/content/cron) walks — one item per HST
// day, in order. GIF #1 (four-quiet-leaks) was already posted manually, so this
// starts at #2. Append new {gif, caption} items here and they auto-post one per day.
// Each gif path is served from the live site's /public/anim.

export interface ScheduledPost {
  gif: string; // path under the site root
  caption: string;
}

export const CONTENT_SCHEDULE: ScheduledPost[] = [
  {
    gif: "/anim/kindcodex-anim-2-flip-the-price-list.gif",
    caption: `Read any menu top to bottom. Notice where your eye lands first.

Most price lists open with the cheapest option. It feels generous — the low number greets everyone at the door. But the first figure a buyer sees becomes the anchor every other option is measured against. Start them at the floor, and the floor is where most people settle.

Flip it. Lead with the premium tier, and the middle option stops reading like a splurge and starts reading like the sensible choice. Same three options, same customer — a different first number, a different landing spot.

The order of a price list isn't decoration. It's a quiet instruction telling people how high to reach.

Flip the list. They buy up.`,
  },
  {
    gif: "/anim/kindcodex-anim-3-customers-you-have.gif",
    caption: `Watch any customer base for a month and you'll notice something quieter than a bad review: the people who simply stop coming back. No complaint. No cancellation. They just fade toward the edges and are gone.

Almost every business budgets for acquisition — the ads, the outreach, the cost of a stranger's first yes. Far fewer budget for the second yes. Yet the person who already trusted you once is the least expensive sale you'll ever make. The hard part, earning them, is already done.

A returning customer rarely needs convincing. They need remembering — a reason to come back before they quietly forget you exist. That's not a campaign. It's a small system running in the background: the check-in, the reminder, the note that lands at the right moment without anyone lifting a finger.

Retention is easy to miss because it never shows up as a dramatic win. It's the sale that didn't slip away. The cheapest customer is one you already earned.`,
  },
  {
    gif: "/anim/kindcodex-anim-4-11pm-bottleneck.gif",
    caption: `There's a quiet moment most owners recognize. It's late, the shop is closed, and you're still at the desk — returning the missed call, sending the invoice, moving tomorrow's appointment, answering the review, replying to the message that came in at 4.

None of it is the work you're actually good at. It's the work that lands on you because there's no one else, and no system, to catch it. So it stacks up on your shoulders until the only time left to clear it is after everyone has gone home.

The fix isn't working later. It's a layer underneath the business that catches those tasks as they arrive — routes the call, sends the invoice, books the slot, asks for the review — before they ever reach your desk. The tasks still get done. They just stop getting done by you.

That's the difference between owning the business and being its front desk. You became the highest-paid admin in the building. It was never supposed to be the job.`,
  },
  {
    gif: "/anim/kindcodex-anim-5-50ms-verdict.gif",
    caption: `A visitor decides how they feel about your business before they read a single word.

Psychologists call it thin-slicing: the brain forms a durable impression of a page almost instantly — the layout, the spacing, whether it looks cared-for — long before anyone reads the copy or reaches for the "Contact" button.

So by the time someone is weighing whether to call, the verdict is already in. The polished competitor didn't win because they replied faster or priced lower. They won in the first glance, on a page the visitor barely remembers looking at.

Most businesses pour their energy into what happens after the call. The quieter advantage is everything that happens before it — the version of you a stranger meets in the first second.

That first second isn't luck. It's built.`,
  },
];
