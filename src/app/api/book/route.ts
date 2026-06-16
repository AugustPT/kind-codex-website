import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateEmailHtml, EmailTemplateData } from "@/lib/emailTemplate";
import { upsertLead, updateLead, sendEmail as sendBrevoEmail } from "@/lib/brevo";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { source = "clarity-path-home", ref = "", lead, diagnostics, appointment } = body;

    if (!lead || !diagnostics) {
      return NextResponse.json(
        { error: "Missing required lead details" },
        { status: 400 }
      );
    }

    console.log("Processing lead booking transaction:", {
      name: lead.name,
      email: lead.email,
      businessName: lead.businessName,
      date: appointment?.date,
      time: appointment?.time,
    });

    // Compile email HTML template data
    const emailData: EmailTemplateData = {
      name: lead.name,
      businessName: lead.businessName,
      website: lead.website,
      email: lead.email,
      phone: lead.phone,
      helpText: lead.helpText,
      resultHeadline: diagnostics.headline,
      resultCategory: diagnostics.category,
      recommendedFocus: diagnostics.recommendedFocus,
      answers: diagnostics.answers,
      appointmentDate: appointment?.date ?? "",
      appointmentTime: appointment?.time ?? "",
    };

    const emailHtml = generateEmailHtml(emailData);

    // Read SMTP settings from environment variables
    const {
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      SMTP_PASS,
      SMTP_FROM = "KindCodex <noreply@kindcodex.com>",
    } = process.env;

    const hasSmtpConfig = SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS;

    if (hasSmtpConfig) {
      console.log(`Configuring SMTP transport connection to ${SMTP_HOST}:${SMTP_PORT}...`);
      
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT || "587"),
        secure: parseInt(SMTP_PORT || "587") === 465, // Use SSL for port 465
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        },
      });

      console.log(`Sending transactional clarity report email to ${lead.email}...`);
      await transporter.sendMail({
        from: SMTP_FROM,
        to: lead.email,
        subject: "Confirmed: 15-Minute Clarity Call & Opportunity Audit Report",
        html: emailHtml,
      });
      console.log("Email dispatch completed successfully!");

      // Internal, source-tagged notification so YOU get every lead sorted by
      // which page it came from (the subject prefix makes inbox filtering easy).
      const notifyTo = process.env.LEAD_NOTIFY_EMAIL || SMTP_USER;
      if (notifyTo) {
        const apptLine = appointment?.date
          ? `Call slot requested: ${appointment.date} ${appointment.time}`
          : "No call slot selected yet";
        const answersList = diagnostics.answers
          ? Object.entries(diagnostics.answers)
              .map(([q, a]) => `<li><strong>${q}:</strong> ${a}</li>`)
              .join("")
          : "";
        await transporter.sendMail({
          from: SMTP_FROM,
          to: notifyTo,
          replyTo: lead.email,
          subject: `[${source}] New lead: ${lead.name}${
            lead.businessName ? ` (${lead.businessName})` : ""
          }`,
          html: `<h2 style="font-family:sans-serif">New lead — source: ${source}</h2>
<p style="font-family:sans-serif;line-height:1.6">
<strong>Name:</strong> ${lead.name}<br/>
<strong>Business:</strong> ${lead.businessName || "-"}<br/>
<strong>Email:</strong> ${lead.email}<br/>
<strong>Phone:</strong> ${lead.phone || "-"}<br/>
<strong>Website / social:</strong> ${lead.website || "-"}<br/>
<strong>Wants help with:</strong> ${lead.helpText || "-"}<br/>
<strong>Diagnostic:</strong> ${diagnostics.headline} (${diagnostics.category})<br/>
<strong>${apptLine}</strong></p>
<ul style="font-family:sans-serif">${answersList}</ul>`,
        });
        console.log(`Internal lead notification sent to ${notifyTo} [${source}]`);
      }
    } else {
      console.warn(
        "WARNING: SMTP environment variables are not configured. Transactional email sending was simulated."
      );
      console.log("Simulated Email Payload:\n", {
        to: lead.email,
        subject: "Confirmed: 15-Minute Clarity Call & Opportunity Audit Report",
        textLength: emailHtml.length,
      });
    }

    // ---- Brevo: nurture enrollment + notifications (reliable via API) ----
    const firstName = (lead.name || "there").split(" ")[0];
    const notifyTo = process.env.LEAD_NOTIFY_EMAIL || "august@kindcodex.com";

    if (appointment?.date) {
      // They booked a call — pull them out of nurture, confirm to THEM, notify August.
      await updateLead(lead.email, { BOOKED: true });
      await sendBrevoEmail({
        to: lead.email,
        toName: lead.name,
        subject: "You're booked — your 15-minute KindCodex call",
        html: `<div style="font-family:-apple-system,Segoe UI,Arial,sans-serif;max-width:520px;color:#1c1917;line-height:1.6;font-size:15px">
<p>Hi ${firstName},</p>
<p>You're all set — your 15-minute call is confirmed for <strong>${appointment.date} at ${appointment.time}</strong>.</p>
<p>On the call we'll walk through what your audit surfaced and exactly how we'd fix it. Talk soon.</p>
<p>— August, KindCodex</p></div>`,
      });
      await sendBrevoEmail({
        to: notifyTo,
        replyTo: lead.email,
        subject: `[${source}] CALL BOOKED: ${lead.name}${lead.businessName ? ` (${lead.businessName})` : ""}`,
        html: `<p><strong>${lead.name}</strong> booked a call.</p>
<p>When: ${appointment.date} ${appointment.time}<br/>
Email: ${lead.email}<br/>Phone: ${lead.phone || "-"}<br/>Source: ${source}</p>`,
      });
    } else {
      // New lead — enroll in nurture, fire the first email now, notify August.
      const nowIso = new Date().toISOString();
      await upsertLead(lead.email, {
        FIRSTNAME: firstName,
        BUSINESS: lead.businessName || "",
        SOURCE: source,
        SIGNUP_TS: nowIso,
        AUDIT_RESULT: diagnostics.headline || "",
        NURTURE_STAGE: 0,
        BOOKED: false,
        PIPELINE: "inbound",
        FUNNEL: source,
        COMPANY: lead.businessName || "",
        REF: ref || "",
      });
      // No email to the lead here — the on-page flow already shows their result
      // and the booking step. The nurture cron sends the first follow-up LATER,
      // and ONLY if they don't book — so bookers never get a redundant "book" email.
      await sendBrevoEmail({
        to: notifyTo,
        replyTo: lead.email,
        subject: `[${source}] New lead: ${lead.name}${lead.businessName ? ` (${lead.businessName})` : ""}`,
        html: `<p>New lead from <strong>${source}</strong> — enrolled in nurture.</p>
<p>Name: ${lead.name}<br/>Business: ${lead.businessName || "-"}<br/>
Email: ${lead.email}<br/>Phone: ${lead.phone || "-"}<br/>Result: ${diagnostics.headline}</p>`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Clarity call successfully booked",
      booking: {
        attendee: lead.name,
        date: appointment?.date ?? null,
        time: appointment?.time ?? null,
      },
    });
  } catch (err: any) {
    console.error("Critical error during booking execution:", err);
    return NextResponse.json(
      { error: "Internal server error occurred while processing booking" },
      { status: 500 }
    );
  }
}
