import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timezone = searchParams.get("timezone") || "Pacific/Honolulu";

    let rangeStart: string;
    let tz = timezone;

    // Resolve date boundary in the target timezone
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const parts = formatter.formatToParts(new Date());
      const year = parts.find(p => p.type === 'year')?.value;
      const month = parts.find(p => p.type === 'month')?.value;
      const day = parts.find(p => p.type === 'day')?.value;
      rangeStart = `${year}-${month}-${day}`;
    } catch (e) {
      tz = "Pacific/Honolulu";
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const parts = formatter.formatToParts(new Date());
      const year = parts.find(p => p.type === 'year')?.value;
      const month = parts.find(p => p.type === 'month')?.value;
      const day = parts.find(p => p.type === 'day')?.value;
      rangeStart = `${year}-${month}-${day}`;
    }

    // Calculate end date (30 days in the future to capture sufficient availability)
    const startDateObj = new Date(rangeStart + "T00:00:00");
    const endDateObj = new Date(startDateObj.getTime() + 30 * 24 * 60 * 60 * 1000);
    const endYear = endDateObj.getFullYear();
    const endMonth = String(endDateObj.getMonth() + 1).padStart(2, '0');
    const endDay = String(endDateObj.getDate()).padStart(2, '0');
    const rangeEnd = `${endYear}-${endMonth}-${endDay}`;

    const calendlyUrl = `https://calendly.com/api/booking/event_types/4df04d9b-728d-4c4c-b2cb-a539dc50a779/calendar/range?timezone=${encodeURIComponent(tz)}&diagnostics=false&range_start=${rangeStart}&range_end=${rangeEnd}`;

    console.log(`Proxying slots lookup to Calendly URL: ${calendlyUrl}`);

    const res = await fetch(calendlyUrl, {
      headers: {
        'accept': 'application/json',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36'
      },
      next: { revalidate: 60 } // cache for 1 minute
    });

    if (!res.ok) {
      throw new Error(`Calendly API responded with status ${res.status}`);
    }

    const data = await res.json();
    
    // Filter days that have available time slots
    const availableDays = data.days.filter((d: any) => d.status === 'available' && d.spots && d.spots.length > 0);
    
    // Limit selection to the next 3 available business/calendar days to increase conversion urgency
    const firstThreeDays = availableDays.slice(0, 3);

    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const formattedDays = firstThreeDays.map((day: any) => {
      const dateParts = day.date.split('-');
      const dateObj = new Date(Date.UTC(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2])));
      
      const dayOfWeek = weekdays[dateObj.getUTCDay()];
      const monthName = months[dateObj.getUTCMonth()];
      const dayNum = dateObj.getUTCDate();
      const yearNum = dateObj.getUTCFullYear();

      // Formulate custom dateString matching client toDateString() layout
      const dateString = `${dayOfWeek} ${monthName} ${dayNum} ${yearNum}`;
      const displayDate = `${monthName} ${dayNum}`;

      const spots = day.spots
        .filter((spot: any) => spot.status === 'available')
        .map((spot: any) => {
          const spotDate = new Date(spot.start_time);
          
          // Format time segment
          const timeStr = spotDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
            timeZone: tz
          });

          return {
            time: timeStr,
            value: spot.start_time
          };
        });

      return {
        dateString,
        displayDate,
        dayOfWeek,
        spots
      };
    });

    return NextResponse.json({ days: formattedDays });
  } catch (err) {
    console.error("Error fetching slot ranges from Calendly:", err);
    return NextResponse.json(
      { error: "Failed to fetch available time slots" },
      { status: 500 }
    );
  }
}
