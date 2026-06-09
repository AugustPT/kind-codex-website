import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateEmailHtml, EmailTemplateData } from "@/lib/emailTemplate";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lead, diagnostics, appointment } = body;

    if (!lead || !diagnostics || !appointment) {
      return NextResponse.json(
        { error: "Missing required booking details" },
        { status: 400 }
      );
    }

    console.log("Processing lead booking transaction:", {
      name: lead.name,
      email: lead.email,
      businessName: lead.businessName,
      date: appointment.date,
      time: appointment.time,
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
      appointmentDate: appointment.date,
      appointmentTime: appointment.time,
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

    return NextResponse.json({
      success: true,
      message: "Clarity call successfully booked",
      booking: {
        attendee: lead.name,
        date: appointment.date,
        time: appointment.time,
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
