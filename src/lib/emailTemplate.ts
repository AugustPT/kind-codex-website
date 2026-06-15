export interface EmailTemplateData {
  name: string;
  businessName: string;
  website: string;
  email: string;
  phone: string;
  helpText: string;
  resultHeadline: string;
  resultCategory: string;
  recommendedFocus: string[];
  answers: Record<string, string>;
  appointmentDate?: string;
  appointmentTime?: string;
}

export function generateEmailHtml(data: EmailTemplateData): string {
  const {
    name,
    businessName,
    website,
    email,
    phone,
    helpText,
    resultHeadline,
    recommendedFocus,
    answers,
    appointmentDate = "Pending Date Selection",
    appointmentTime = "Pending Time Selection",
  } = data;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formattedDate = formatDate(appointmentDate);

  // Format list items for recommended focus
  const focusItemsHtml = recommendedFocus
    .map(
      (item) => `
      <li style="margin-bottom: 8px; padding-left: 4px; font-weight: 600; font-size: 14px; color: #1c1917;">
        <span style="color: #c2410c; margin-right: 6px; font-weight: bold;">✓</span>
        ${item}
      </li>
    `
    )
    .join("");

  // Format table rows for answers
  const answerRowsHtml = Object.entries(answers)
    .map(([key, val]) => {
      // Capitalize question ID for display
      const questionLabel = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      return `
      <tr style="border-bottom: 1px solid #e7e5e4;">
        <td style="padding: 10px 0; font-size: 12px; font-weight: bold; color: #78716c; text-transform: uppercase; width: 40%; vertical-align: top;">${questionLabel}</td>
        <td style="padding: 10px 0; font-size: 13px; font-weight: 600; color: #1c1917; width: 60%; vertical-align: top;">${val}</td>
      </tr>
    `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>KindCodex Clarity Call Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #faf9f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; color: #1c1917;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf9f5; padding: 24px 12px;">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e7e5e4; border-top: 3px solid #c2410c; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(28, 25, 23, 0.02); text-align: left;">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 24px 32px; border-bottom: 1px solid #f5f5f4;">
                    <span style="font-size: 18px; font-weight: bold; letter-spacing: -0.5px; color: #1c1917;">
                      KindCodex<span style="color: #c2410c;">.</span>
                    </span>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 32px 32px 24px 32px;">
                    <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: bold; letter-spacing: -0.5px; line-height: 1.2; color: #1c1917;">
                      Your Clarity Call is confirmed.
                    </h1>
                    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #57534e; font-weight: 500;">
                      Hi ${name}, we have successfully scheduled your 15-minute diagnostic walkthrough. We look forward to meeting with you to discuss your custom action plan.
                    </p>

                    <!-- Event Details Box -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf9f5; border: 1px solid #e7e5e4; border-radius: 12px; padding: 20px; margin-bottom: 32px;">
                      <tr>
                        <td style="padding-bottom: 12px; border-bottom: 1px solid #e7e5e4;">
                          <div style="font-size: 11px; font-weight: bold; color: #a8a29e; uppercase; letter-spacing: 0.8px; margin-bottom: 4px;">EVENT</div>
                          <div style="font-size: 15px; font-weight: 700; color: #1c1917;">15-Minute Clarity Call</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px; padding-bottom: 12px; border-bottom: 1px solid #e7e5e4;">
                          <div style="font-size: 11px; font-weight: bold; color: #a8a29e; uppercase; letter-spacing: 0.8px; margin-bottom: 4px;">DATE</div>
                          <div style="font-size: 15px; font-weight: 700; color: #1c1917;">${formattedDate}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 12px;">
                          <div style="font-size: 11px; font-weight: bold; color: #a8a29e; uppercase; letter-spacing: 0.8px; margin-bottom: 4px;">TIME</div>
                          <div style="font-size: 15px; font-weight: 700; color: #1c1917;">${appointmentTime}</div>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <hr style="border: 0; border-top: 1px solid #e7e5e4; margin: 0 0 32px 0;" />

                    <!-- Diagnostics Section -->
                    <h2 style="margin: 0 0 8px 0; font-size: 11px; font-weight: bold; color: #c2410c; text-transform: uppercase; letter-spacing: 1.2px;">
                      OPPORTUNITY REPORT
                    </h2>
                    <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold; color: #1c1917; letter-spacing: -0.3px;">
                      ${resultHeadline}
                    </h3>
                    
                    <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 1.6; color: #57534e; font-weight: 500;">
                      Ahead of our call, our team is analyzing your online profiles. Here are the prioritized recommended focus areas to improve your customer pipeline:
                    </p>

                    <!-- Focus Areas List -->
                    <ul style="margin: 0 0 32px 0; padding: 0; list-style-type: none;">
                      ${focusItemsHtml}
                    </ul>

                    <!-- Questionnaire Answers table -->
                    <h4 style="margin: 0 0 16px 0; font-size: 11px; font-weight: bold; color: #a8a29e; text-transform: uppercase; letter-spacing: 1.2px;">
                      AUDIT SELECTIONS
                    </h4>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px; border-collapse: collapse;">
                      ${answerRowsHtml}
                    </table>

                    <!-- Business Info Box -->
                    <h4 style="margin: 0 0 16px 0; font-size: 11px; font-weight: bold; color: #a8a29e; text-transform: uppercase; letter-spacing: 1.2px;">
                      CONTACT & BUSINESS DETAILS
                    </h4>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf9f5; border: 1px solid #e7e5e4; border-radius: 12px; padding: 16px; font-size: 13px; color: #44403c;">
                      <tr>
                        <td style="padding: 4px 0; font-weight: 600; width: 35%; color: #78716c;">Company:</td>
                        <td style="padding: 4px 0; font-weight: 700; color: #1c1917; width: 65%;">${businessName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; font-weight: 600; color: #78716c;">Website:</td>
                        <td style="padding: 4px 0; font-weight: 700; color: #1c1917;">
                          <a href="${
                            website.startsWith("http") ? website : `https://${website}`
                          }" target="_blank" style="color: #c2410c; text-decoration: none;">${website}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; font-weight: 600; color: #78716c;">Phone:</td>
                        <td style="padding: 4px 0; font-weight: 700; color: #1c1917;">${phone}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; font-weight: 600; color: #78716c;">Email:</td>
                        <td style="padding: 4px 0; font-weight: 700; color: #1c1917;">${email}</td>
                      </tr>
                      ${
                        helpText
                          ? `
                      <tr>
                        <td style="padding: 8px 0 4px 0; font-weight: 600; color: #78716c; vertical-align: top;">Notes:</td>
                        <td style="padding: 8px 0 4px 0; font-weight: 600; color: #44403c; line-height: 1.4;">${helpText}</td>
                      </tr>
                      `
                          : ""
                      }
                    </table>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 24px 32px; background-color: #faf9f5; border-top: 1px solid #e7e5e4; text-align: center;">
                    <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #a8a29e; font-weight: bold;">
                      KindCodex © 2026. All rights reserved.
                    </p>
                    <p style="margin: 4px 0 0 0; font-size: 10px; color: #a8a29e;">
                      This is an automated transactional message sent regarding your diagnostic booking request.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
