// The queue the daily LinkedIn poster (/api/content/cron) walks — one item per HST
// day, in order. GIF #1 (four-quiet-leaks) was already posted manually, so this
// starts at #2. Append new {gif, caption} items here and they auto-post one per day.
// Each gif path is served from the live site's /public/anim.

export interface ScheduledPost {
  gif?: string; // path under the site root; omit for a text-only post
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
// --- 30-day personal-brand month (auto-post days; carousels uploaded manually) ---
  {
    gif: "/anim/brand-d01.png",
    caption: `Every site I ship goes through what I call the 14-Screen Gate.

No client sees a page until it has survived 14 real screens.

The whole gate, free to steal:

1. Render on real engines, never emulation.
The phone preview in desktop DevTools is a resized browser window. iPhones and iPads run real WebKit. Androids run real Chromium. Test on the engines the actual phones use.

2. Start at the smallest screen and work up.
iPhone SE first, desktop last. If a layout survives the smallest screen, the big ones are easy.

3. Flip every size to landscape.
Portrait and landscape, both. The rotation nobody tests is where layouts quietly break.

4. Capture all 14 and look at every single one.
No spot-checks. A folder of screenshots, eyeballed one by one, before the client's link ever goes out.

The gate exists because emulation flatters. A resized desktop window will pass layouts that a real phone engine fails — different fonts, different scrollbars, different rendering math. The page that looks perfect on a monitor is exactly the one that needs the gate most.

Emulation says the page is probably fine. The real engines show what the phone will actually render.

If the work ever gets opened on a phone, run it through the gate. Steal the whole thing.`,
  },
  {
    gif: "/anim/brand-d02.png",
    caption: `I was building a follow-up system this week and hit the point every build hits: it needs a database.

Out of habit, I reached for Postgres.

Then I noticed something in Brevo, the email tool already in the stack. Every contact can hold custom attributes. As many fields as I need.

Stage, last touch, next step — the whole pipeline state can sit right on the contact. Inside the tool that already sends the emails.

So that's the build. No Postgres. No Redis. Zero new infrastructure.

The CRM lives where the emails live.

Note to self: before buying a database, check whether I already own one.`,
  },
  {
    gif: "/anim/brand-d03.png",
    caption: `In the trades, the job goes to whoever answers first.

Most businesses answer tomorrow.

I keep watching it happen here in Hawaii. A homeowner calls a contractor. Voicemail. No message left — they just dial the next name on the list.

By the time anyone checks that voicemail, the job is gone.

The fix I'd build is almost boring.

A catcher on the phone line.
The moment a call gets missed, a text goes back in under a minute: "Sorry we missed you — what do you need?"
That reply holds the lead until a human is free to take over.

The homeowner got answered, so they stop dialing. The business calls back on its own schedule and still wins.

I've built SMS systems like this. Running cost: about $0. One saved job covers years of it.

Plumbers have this leak. Electricians. Painters. Anyone whose hands are too busy to hold a phone.

I'd price it monthly, at less than one lost job costs. Then let it answer for itself.`,
  },
  {
    gif: "/anim/brand-d04.png",
    caption: `"Post consistently" is the most common content advice on this app.

Reasonable advice. It's also only half a machine.

Stripped to first principles: consistency is a delivery schedule. It controls when a post arrives. It says nothing about whether anyone has a reason to come back for the next one.

The unit that compounds is the reason to follow. A spine you're building in public. A tool worth stealing. A way the reader gets smarter each time.

Posting daily compounds only if each post adds one.

A calendar can make me show up. It can't hand anyone a reason to come back.`,
  },
  {
    gif: "/anim/brand-d05.png",
    caption: `My mornings are quiet because I built them that way.

The reminders fire on time. The reports land without me touching them. Systems set up once, doing the same job every day since.

The machine handles the busywork while I sit with one hard problem and nothing else.

I used to fight for that focus. Now the calendar holds the door.

Stillness turned out to be an engineering task.`,
  },
  {
    gif: "/anim/brand-d06.png",
    caption: `I built a machine that turns a marketing idea into a finished animated video.

In one afternoon it rendered 10.

A game-show poll. An LED scoreboard. A split-flap departures board. A thermal receipt. A polaroid. 10 different visual worlds, no two alike.

The pipeline is simple. Each concept gets built as a small web page. The animation is CSS. A headless browser plays it and records the screen.

The hard part was trust. A render can fail silently — a frame that never moves, an animation that ends a beat early. The only way to catch that by hand is watching every second of every video.

So the system watches instead. It steps through its own frames and verifies the motion actually happened. Nothing reaches review until it passes.

The deflating truth: the whole factory is HTML, CSS keyframes, a browser with no window, and ffmpeg. No video AI. No After Effects.

What that buys a business is the afternoon. Ten finished, checked videos to choose from instead of one draft to babysit.

Next: it still can't tell me which of the 10 will land. Taste is still my job.`,
  },
  {
    gif: "/anim/brand-d07.png",
    caption: `A barbershop in Honolulu was running its whole business off one Instagram page.

No prices posted. No hours. Booking meant sending a DM and hoping the owner saw it between cuts.

So the same questions arrived all day. How much for a fade. You open Sundays. Can I get in at 4.

We built him a real site, fast. It has the three things customers actually check: prices, hours, and a book button.

That's the whole build. No chatbot, no blog, no animations.

Now the price question answers itself before anyone walks in, and booking doesn't depend on him catching a message mid-fade.

That's the kind of thing I build at KindCodex — plain pages that do one job all day.

I've shipped fancier features. None of them moved a business like a visible price list.

The time he spent answering DMs went back to the chair, where the money is.`,
  },
  {
    gif: "/anim/brand-d08.png",
    caption: `I read comment sections the way I read stack traces: every reply has a cause.

So I started cataloguing the causes. Almost every comment traces back to one of 10 triggers.

The whole list, free:

1. A side to pick. Two defensible options, no fence to sit on.

2. A score to post. Give a small test and people will report their number.

3. A confession to make. Admit something first. The comments follow.

4. A myth to relitigate. Name advice everyone repeats, then poke one hole in it.

5. A blank to fill. Leave one obvious slot open and readers complete it for you.

6. An ending to argue. Tell the story, stop one beat early.

7. A tactic to save. Useful enough that "commenting to find this later" is a real behavior.

8. A fact worth repeating. People share what makes them look smart at dinner.

9. A moment they recognize. Describe Tuesday at their desk exactly, and they'll say so.

10. A take to push back on. Held honestly. Bait reads as bait.

The pattern under all 10: reach follows reasons to respond, not posting volume.

A post with zero of these is a broadcast. A post with one is a conversation waiting to start.

Take the list. Run your next post against it before you hit publish.`,
  },
  {
    gif: "/anim/brand-d09.png",
    caption: `US carriers quietly tightened the rules for business texting in late June.

Two new required URLs joined the A2P vetting checklist — a privacy policy link and a terms link. No banner, no notice most owners would ever see. A line in a changelog.

A machine reviews every submission. Build the new one from last month's approved record — same fields, same shape — and the rejection lands before a human ever sees it. Then the resubmission queue: days of texts that should be going out, not going out.

The trap is that an old approval feels like proof. It proves the rules as they stood on the day it passed. Carriers keep moving them.

So I run one standing rule before any compliance gate: read the provider's current requirements and the changelog first, every submission. 5 minutes of reading against days in a queue. Easy math.

The approved record shows what the rules were. Only the changelog shows what they are.

The rules moved. Most playbooks haven't.`,
  },
  {
    gif: "/anim/brand-d10.png",
    caption: `I catalogued every distinct way a local business can lose a customer.

The list stopped at 259.

259 separate problems, sorted into 25 categories. Pricing psychology. Follow-up decay. First impressions. Choice architecture. Waiting and uncertainty. Reactivation. Referral mechanics. On it goes.

I started the census because "more customers" kept arriving as one request and never held up as one problem. Underneath it there's always a specific leak with a specific shape — a quote that goes out slow, a price shown in the wrong order, a silence after the first visit that nobody planned.

What surprised me most: the majority of the 25 categories start after someone has already found the business.

Naming the right leak turned out to be most of the fix. Once a problem has a name, the build under it is usually small.

The 3 I see most in the wild:

Follow-up decay — the lead answered once, and nobody wrote back.
Waiting and uncertainty — the customer said yes, then heard nothing.
Reactivation — the past customer who'd come back if anyone asked.

The whole census fits in one spreadsheet. Most businesses only ever need one row.`,
  },
  {
    gif: "/anim/brand-d11.png",
    caption: `"Follow up again" is the standard fix for a lead that went quiet.

Reasonable advice. Persistence does close deals. But look at what most follow-up sequences actually change between attempts.

Strip a follow-up to first principles and it has three parts: the message, the channel, and the timing.

Most sequences only ever vary the timing.

Call Monday. No answer. Call Wednesday. No answer. Call Friday.

Same words. Same channel. Different day.

In engineering terms, that's one experiment run three times with the clock as the only variable.

Two ignored calls already returned a result: this channel doesn't land. Maybe they screen unknown numbers. Maybe their hands are full from 8 to 5. Whatever the reason, the third call re-runs a test that already has an answer.

A switch to text is a new experiment. Different channel, different context, different odds. Plenty of people who never pick up an unknown call will reply to a message, because reading a text costs nothing and a call asks for their full attention on the spot.

Timing is the cheapest variable to change, so it's the one that always gets changed.

Channel was the one failing.`,
  },
  {
    caption: `Every mistake I make gets one line in a file.

Plain text. Dated. I read the whole thing before starting any build.

The lessons moved out of my memory and into the file.

Two things changed. I almost never repeat a mistake anymore. And starts got calmer — nothing to hold in my head, because it's all written down.

The file does the worrying now.`,
  },
  {
    gif: "/anim/brand-d14.png",
    caption: `I gave a plain AI model my messy inbox this afternoon and asked it to do one boring job.

Sort it.

Quote request. Booking. Spam. Needs a human.

Four piles. It finished in seconds, and I watched the labels scroll past like a receipt printing.

So I pushed it one step further: draft a one-line reply for each message.

It did that too. Short, polite, ready to send or toss.

This is clerical work — answering, drafting, sorting. The same stack of tiny decisions a front desk chews through every morning before the real work starts.

The part that got me was the price.

The whole run cost cents. Not dollars. Cents.

A filing clerk that reads everything, never falls behind, and works for pocket change.

Next experiment: a full week of messages instead of one afternoon. I want to find where it gets confused.`,
  },
  {
    gif: "/anim/brand-d16.png",
    caption: `Every double-booking starts the same investigation: who took the second appointment?

Spend the hour on a different question — where do bookings enter the building?

Phone calls land in the book at the front desk.
Walk-ins get penciled into the same book.
The website writes to its own separate calendar.

Three doors in. Two calendars. No wire between them.

At that point a collision stops being an accident. Two lists that never compare notes will eventually claim the same slot — it needs no one's mistake to happen. The setup guarantees it. The only question is which week.

Software people call this two sources of truth. It fails the same way in every system that has it, no matter who's operating it.

Which means the fix is structural, and short: one calendar, and every channel writes to it. Phone, desk, website — one slot map. A taken slot is taken everywhere, the instant it's taken.

No new hires. No reminder taped to the monitor. Nobody to blame, which is the point.

A collision that can't happen beats a collision somebody caught in time.`,
  },
  {
    caption: `Walked my own block in Honolulu last night, counting which shops have outlived everything around them.

A lei stand. A lunch counter. A hardware store older than the strip mall across the street.

At the counter, the owner greeted the man ahead of me by name and asked if his daughter got the job.

He hadn't been in for weeks. She remembered the daughter.

Every survivor on the block runs the same quiet system. You leave knowing the owner's name, and they keep a copy of yours for next time.

I spend my weeks teaching software to remember people.

She does it from memory, and she's been shipping it for decades.`,
  },
  {
    gif: "/anim/brand-d18.png",
    caption: `A money-back guarantee set in a thin script font is believed less than the same sentence in plain type.

Same words. Same promise. Different font.

Researchers call it processing fluency. When a claim is easy to read, the brain quietly treats easy as true. When the eyes have to work, doubt arrives before the meaning does.

Nobody decides this on purpose. It happens in the half-second before reading even feels like reading.

Strange thing to learn about guarantees, because a guarantee is a trust instrument. The typeface is part of the contract.

I read guarantees on a phone now, at the end of a long day, the way a customer actually meets them.

If you mean it, set it in type a tired person can read at arm's length.`,
  },
  {
    gif: "/anim/brand-d20.png",
    caption: `"Roof replacement — $14,200."

Some quotes are one line long.

One line hands the buyer exactly one thing to compare. So that's what they compare. The number lands in a pile with the other bids, and the smallest one usually wins.

Now open the quote up and look at the anatomy.

Tear-off. The old roof actually leaves — it doesn't get buried under the new one.
Underlayment. A layer nobody will ever see, listed anyway.
Inspection. Someone checks the work before it's called done.
Warranty terms. The price buys years, not just shingles.

Each line is a small claim the bare quote never got to make. Together they give the price a body. A buyer can weigh a body. Question it. Respect it.

A lone number can only be bigger or smaller than the number next to it.

An itemized quote is an argument. A bare quote is a bid.`,
  },
  {
    caption: `The most important meeting in any deal happens in a room you never enter.

The budget meeting. The partner call. The kitchen table where a $30k roof gets decided over dinner.

Every real deal gets sold at least twice. Once by you. Once by your champion — the person in that room who wants it to happen.

They don't have your slides. They don't have your polish. They have whatever stuck.

So a proposal has one real job: arm that person.

Three lines they can repeat with the door closed.
What it fixes. What it costs. Why now.

If the champion has to say "let me find the PDF," the room moves on.

Five-minute assignment for today: reread your last proposal and mark every line your champion could say from memory.

The count is the real proposal.`,
  },
  {
    gif: "/anim/brand-d23.png",
    caption: `"Onboarded" is the most generous word in business.

Forms signed. Logins issued. Kickoff call done. Welcome email out.

On paper: complete.

The customer has felt nothing yet.

And in the gap between paying and feeling, something quiet happens. Every day without a result, they are re-deciding whether they were right to buy. Silently. Daily. No one announces it.

Then one morning the phone goes quiet for an hour and nothing is wrong. Or a reminder goes out that nobody typed.

That one moment settles the question the entire welcome sequence couldn't touch.

So I hold every build to a stricter standard now. The paperwork version of onboarding gets crossed out.

Onboarded (adj.): the customer has felt it work once.`,
  },
  {
    caption: `I write tomorrow's first task on paper before I close the laptop.

One line, in pen.

The open loop moves from my head to the page. The 1am "just checking one thing" reopen died on its own.

Mornings start moving in minutes now — the first decision was already made the night before.

The lid closes easier when tomorrow is already on paper.`,
  },
  {
    gif: "/anim/brand-d25.png",
    caption: `Some of the busiest businesses I see look wide open online.

Booked solid for weeks — and the booking page shows none of it. A quiet page reads as "no rush" to a first-time visitor. So they don't rush. They close the tab and mean to come back.

The truth would have moved them today:

"3 of 12 slots left this week."

One line on the booking page, pulled live from the calendar. It updates itself. Cost: about one line of code.

The rule that keeps it clean — if the scarcity is real, showing it is information. If it's invented, it's manipulation. The counter earns its power by being true. And when it's true, hiding it mostly helps people procrastinate.

Detailers have this leak. Med-spas have it. Tattoo artists have it worst — booked out for months while the page reads like anyone can walk in Friday.

Real scarcity does nothing for a business until somebody can see it.

How full is this week for you — and does your booking page say so?`,
  },
  {
    gif: "/anim/brand-d27.png",
    caption: `The sent counter is the only number on an email dashboard that never brings bad news.

It is also the one that knows the least.

Lists age. People switch jobs. Inboxes die. Numbers change hands. Filters quietly route messages into folders nobody opens.

None of that touches the sent counter. It keeps climbing either way.

Which means a business can email everyone on its list and reach half of everyone — and the dashboard looks identical in both cases.

"Sent" describes the server. It confirms the message left the building. Nothing more.

The numbers that talk are further down the page, in smaller gray type: delivered, opened, bounced. Those are statements about humans.

The habit worth keeping is small.

Once a quarter, audit the list for reachability. Prune whatever bounces.

The list gets shorter. The numbers get honest.`,
  },
  {
    caption: `A property-management association in Honolulu turns 70 this year.

Seven decades of one industry meeting in the same town. Members in their 20s sharing a room with members who joined before the internet existed.

They needed an event site with exactly one job: make the RSVP effortless for every single one of them.

So the build discipline was strict.

Big type.
One button.
Nothing clever.

No animations, no account creation, no scavenger hunt for the form. If a feature made the page more impressive and the RSVP less obvious, it got cut.

The test the whole build had to pass: the oldest member and the newest member click the same button.

This is the kind of work I do at KindCodex — restraint as a feature, not a compromise.

The committee used to chase RSVPs by phone, one member at a time.

Now the calls are just to catch up.`,
  },
  {
    gif: "/anim/brand-d30.png",
    caption: `About 1 in 4 people in Hawaii speaks a language other than English at home.

Almost every intake form in the state speaks exactly one.

Nobody chose that. No owner ever stood at the counter and turned a bilingual customer away.

The form does it quietly. A page that takes effort to read gets closed, and the business never sees the person who left. The customer list is filtered before any human gets a say.

What changed recently is the cost of fixing it.

A contact form is maybe 20 short labels. An auto-reply is a few sentences. Translating that used to mean hiring someone. Now it's an afternoon — translate once, have a native speaker check it once, done. Form words don't change weekly the way a menu does.

So the math sits lopsided: the filter costs a business a slice of its own neighborhood, every day, for free. Removing it costs about an afternoon, once.

One extra line on the form — a language choice, written in Tagalog, Ilocano, or Japanese instead of English — and the quiet filter turns off.`,
  },
];
