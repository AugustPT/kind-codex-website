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
  {
    gif: "/anim/kindcodex-wave-6-the-labor-illusion.gif",
    caption: `Harvard researchers found something that shouldn't be true: people rated a travel site higher when it made them wait — as long as they could watch it 'searching each airline, one by one.' The instant version, returning identical results, scored worse.

It's called the labor illusion. We don't just want the outcome; we want proof that effort happened. A progress bar that narrates its work reads as care. Instant can read as cheap.

Restaurants figured this out with open kitchens decades ago. Your booking page, your quote, your treatment plan — anywhere a customer waits is a place they could be watching you work instead.

The effort was always there. Most businesses just spend it where nobody can see. Name a business you've seen show its work well — open kitchen, mechanic's inspection video, anything. I collect these.`,
  },
  {
    gif: "/anim/kindcodex-wave-8-golf-scorecard-booking-par.gif",
    caption: `Golfers know their handicap to the decimal. Almost no gym owner knows their booking score.

Here's the game: open an incognito tab, Google your own gym, and count every single tap between 'found you' and 'class actually booked.' Account creation counts. Email verification counts. The waiver counts double if it wants an emergency contact before anyone has lifted anything.

Par is four — Google, book, pick a time, pay. The best studios in the country play at par. Most shoot a 9: an account, an app download, and a PDF from 2019 standing between a motivated stranger and their first class.

I watched someone card a 14 last month. The 14 had a seven-figure buildout and a smoothie bar.

Post your number below. Sandbaggers welcome.`,
  },
  {
    gif: "/anim/kindcodex-wave-3-loyalty-delayed-departures-b.gif",
    caption: `Somewhere along the way, 'loyal' and 'employed at the same place a long time' became synonyms. They aren't.

The person who's held four roles in ten years has negotiated their worth four times, learned four systems, survived four first weeks. The person who stayed often did the growing too — but got priced at their day-one number, plus polite raises, the whole way up.

Employers noticed this decades ago; it's why the best offer most people ever receive is the one that requires leaving. Employees are just catching up to the arithmetic.

Staying can absolutely be the right call — for the work, the people, the life around it. But it's a choice with a price tag, and it deserves honest accounting on both sides. Disagree freely. HR isn't reading this.`,
  },
  {
    gif: "/anim/kindcodex-wave-7-polaroid-nobody-noshows-a-fa.gif",
    caption: `A med-spa I like cut their no-shows with one photograph.

Old confirmation text: 'Reminder: appt Thurs 2pm. Reply C to confirm.' Reads like a parking ticket. Very easy to ghost.

New one: 'Hi Maya! Dana here — I'll be doing your consult Thursday at 2. That's me in the photo so you know who to look for. Can't wait to meet you.' Attached: Dana, mid-laugh, thumbs up.

Canceling on a business feels like clicking a button. Canceling on Dana feels like standing up a person who's already looking forward to it — so people either show, or they reschedule like adults instead of vanishing.

Steal the format: first name, real photo, one warm sentence, zero barcode energy.

Tag the teammate whose face is about to be famous.`,
  },
  {
    gif: "/anim/kindcodex-wave-1-discount-verdict-gameshow.gif",
    caption: `Two med-spa owners walk into the same slow February.

Owner A runs a flash sale. Fills the book, meets forty new faces, bets that a great first visit turns a coupon-hunter into a regular. Owner B would rather sit quiet — says a $200 treatment sold at $99 whispers that it was never worth $200, and the clients who came for the deal leave for the next one.

Both have receipts. A points to the lifetime value of a filled chair. B points to every brand that taught its customers to wait for the sale.

We've built systems for both camps and watched both win — in different businesses.

Comment A or B, with your best one-line defense. We'll be in there taking sides.`,
  },
  {
    gif: "/anim/kindcodex-wave-4-the-unsent-invoice.gif",
    caption: `The work is done. The client said 'this is great.' The invoice has been sitting in your drafts since Tuesday.

You've reread it four times. The number is fair — you checked it against three other quotes and your own math twice. Somehow it still feels like you're asking for a favor instead of getting paid for a thing that already happened.

Here's the strange part: the client isn't agonizing. They budgeted for you months ago. To them, your invoice is a Tuesday. To you, it's a referendum.

Send it before lunch. Then tell me the longest an invoice has ever sat in your drafts — no judgment here. Mine involved an entire calendar month and a fake 'accounting system migration.'`,
  },
  {
    gif: "/anim/kindcodex-wave-2-hire-slow-daily-rate.gif",
    caption: `'Hire slow, fire fast' gets repeated like it's carved in stone. Here's the part the poster leaves off: while you're being slow, the chair is still open.

An unfilled hygienist position doesn't wait politely. Every week it sits empty, the schedule tightens, recalls push out, and the rest of the team quietly absorbs the load — the exact conditions that make the next resignation more likely.

A mediocre hire is a visible, fixable problem. A three-month search is an invisible one that compounds daily.

So, the take: past a certain point, 'being selective' is an expensive word for stalled. Plenty of practice owners will disagree — the comments are open for the counter-math.`,
  },
  {
    gif: "/anim/kindcodex-wave-9-sticky-wall-really-the-owner.gif",
    caption: `There's a moment nobody puts in the business plan. Somewhere between the LLC paperwork and today, it arrives.

For a bakery owner I know, it was plunging a toilet at 5:40am in her good coat. For a contractor, it was signing his first payroll and realizing four families were now his weather. For a salon owner, it was a walk-in calling her 'the receptionist' — and answering the phone anyway, because it was ringing.

The day the title stopped being a word on a bank form and started being a feeling in your chest. That's the one I'm collecting.

I knew I was really the owner the day ______.

Your turn. Bonus points if it involves a toilet, a tarp, or a folding table.`,
  },
  {
    gif: "/anim/kindcodex-wave-5-the-go-away-price.gif",
    caption: `Every contractor knows the go-away price. The job smells like trouble — the timeline is fantasy, the last guy 'disappeared,' the scope has scope — so you quote a number designed to end the conversation politely.

And then they say yes.

Now you're standing in a driveway you priced yourself out of wanting, contractually committed to a job you tried to dodge, at a margin so good you can't even be mad about it. Roofers know this feeling. HVAC knows it. Wedding photographers know it in their bones.

The confession booth is open. What's the go-away price that came back and said yes?`,
  },
  {
    gif: "/anim/kindcodex-wave-10-blueprint-plainer-venue.gif",
    caption: `A bride toured two wedding venues in the same weekend.

Venue A had the chandeliers, the bridge, the drone footage. Venue B was a barn with good bones and an owner who walked three steps behind the tour, saying almost nothing. But he noticed she stopped at the northeast corner of the garden — twice — and stayed there while her mother talked about parking.

The next morning his follow-up arrived. No brochure, no discount. One photo of that exact corner at 6pm in golden light, and one line: 'This is the spot you kept coming back to. In October, it looks like this.'

She booked the barn that afternoon.

Half the people I tell this story to say genius. The other half say creepy. The bride says it's the best email she's ever gotten.`,
  },
  {
    gif: "/anim/kindcodex-pilot-1-ikea-effect.gif",
    caption: `There's a name for it: the IKEA Effect. Psychologists found people place a higher value on things they helped make — even wobbly flat-pack shelves — than on nicer things they bought finished.

The sweat is the attachment. A little of your own labor quietly turns 'a thing I own' into 'a thing that's mine.'

Worth remembering for anyone who sells anything: the small effort you ask of a customer isn't always friction to strip away. Handled right, it's the glue that makes them stay — the reason they defend the choice they made instead of quietly shopping around.

Not everything valuable should be effortless. Sometimes the effort is the value.`,
  },
  {
    gif: "/anim/kindcodex-pilot-2-memorable.gif",
    caption: `Everyone wants to be memorable. But memorable is a coin flip — maybe you cross their mind when they need you, maybe you don't.

The businesses that never lose customers aren't chasing memorable. They're building un-leaveable: the quiet pile-up of history, convenience, and habit that makes starting over somewhere else feel like a chore nobody wants to do.

Memorable is marketing — you rent attention and hope it sticks. Un-leaveable is architecture — you build something a customer would have to actively dismantle to walk away from.

One of them you chase every quarter. The other one compounds while you sleep.`,
  },
  {
    gif: "/anim/kindcodex-pilot-3-nine-word-text.gif",
    caption: `Every business is sitting on a graveyard of 'not right now' leads — people who were interested once and never got a reason to come back. Most never get touched again.

Here's a message that restarts the conversation with zero pitch:

'Hi [name] — are you still thinking about [the thing]?'

That's the whole play. No link. No paragraph. No 'just following up!' It works because it reads exactly like a text a real person would send, and it hands the next move gently back to them — a yes-or-no they can answer in one thumb tap.

Pick ten cold leads. Send it this week, one at a time, by hand. Some of the deals you wrote off already said yes once.`,
  },
];
