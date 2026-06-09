"use client";

import React, { useState } from "react";
import { generateEmailHtml } from "@/lib/emailTemplate";

export default function EmailPreviewPage() {
  const [mockName, setMockName] = useState("Jane Doe");
  const [mockBusiness, setMockBusiness] = useState("KindCodex Cafe");
  const [mockWebsite, setMockWebsite] = useState("kindcodexcafe.com");
  const [mockEmail, setMockEmail] = useState("jane@kindcodexcafe.com");
  const [mockPhone, setMockPhone] = useState("(555) 019-2834");
  const [mockHelpText, setMockHelpText] = useState("We need to make it easier for our local customers to find us online and book sessions.");

  const mockDiagnostics = {
    resultHeadline: "Visibility & Search Optimization Opportunity",
    resultCategory: "visibility",
    recommendedFocus: [
      "Claim and verify your Google Business Profile with updated local hours and categories",
      "Inject geographic search terms into page headings to capture local intent",
      "Audit citation directories to ensure matching Name, Address, and Phone details"
    ],
    answers: {
      findability: "Somewhat - We get search results but not calls",
      clarity: "Yes - The header copy is clean",
      trust: "No - We lack recent reviews or customer badges",
      conversion: "Not really - No book call button is visible",
      followup: "Nothing - Visitors bounce and never hear from us",
      salespath: "No - We only sell one-off services"
    },
    appointmentDate: new Date(Date.now() + 86400000 * 2).toDateString(), // 2 days from now
    appointmentTime: "10:30 AM"
  };

  const emailHtml = generateEmailHtml({
    name: mockName,
    businessName: mockBusiness,
    website: mockWebsite,
    email: mockEmail,
    phone: mockPhone,
    helpText: mockHelpText,
    ...mockDiagnostics
  });

  return (
    <div className="min-h-screen bg-stone-100 text-[#1c1917] p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Mock Data Controls & Merge Tag Glossary */}
        <div className="lg:col-span-4 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div>
            <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight mb-2">
              Email Template Preview
            </h1>
            <p className="text-xs text-stone-500 leading-relaxed">
              Design and preview the transactional email sent to visitors upon booking. This view is accessible at <span className="font-semibold text-stone-800">/email</span>.
            </p>
          </div>

          <hr className="border-stone-150" />

          {/* Form Fields to test pre-population */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#c2410c]">
              Interactive Preview Data
            </h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={mockName}
                onChange={(e) => setMockName(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-900 outline-none focus:border-[#c2410c] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Company Name</label>
              <input
                type="text"
                value={mockBusiness}
                onChange={(e) => setMockBusiness(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-900 outline-none focus:border-[#c2410c] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Website</label>
              <input
                type="text"
                value={mockWebsite}
                onChange={(e) => setMockWebsite(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-900 outline-none focus:border-[#c2410c] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={mockEmail}
                onChange={(e) => setMockEmail(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-900 outline-none focus:border-[#c2410c] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Phone</label>
              <input
                type="text"
                value={mockPhone}
                onChange={(e) => setMockPhone(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-900 outline-none focus:border-[#c2410c] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Help Request Description</label>
              <textarea
                value={mockHelpText}
                onChange={(e) => setMockHelpText(e.target.value)}
                rows={3}
                className="bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-900 outline-none resize-none focus:border-[#c2410c] transition-all"
              />
            </div>
          </div>

          <hr className="border-stone-150" />

          {/* Placeholders Table */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
              Template Merge Tags
            </h2>
            <div className="overflow-hidden border border-stone-150 rounded-xl bg-stone-50 text-[10px]">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-150 text-stone-500 font-bold">
                    <th className="p-2.5">Tag</th>
                    <th className="p-2.5">Value Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150 text-stone-700 font-medium">
                  <tr>
                    <td className="p-2.5 font-mono text-[#c2410c]">{`\${name}`}</td>
                    <td className="p-2.5">Visitor Full Name</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-[#c2410c]">{`\${businessName}`}</td>
                    <td className="p-2.5">Company or Brand Name</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-[#c2410c]">{`\${website}`}</td>
                    <td className="p-2.5">Website Domain URL</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-[#c2410c]">{`\${email}`}</td>
                    <td className="p-2.5">Visitor Contact Email</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-[#c2410c]">{`\${phone}`}</td>
                    <td className="p-2.5">Visitor Phone Number</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-[#c2410c]">{`\${helpText}`}</td>
                    <td className="p-2.5">Custom Help Request Text</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-[#c2410c]">{`\${resultHeadline}`}</td>
                    <td className="p-2.5">Highest Opportunity Headline</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-[#c2410c]">{`\${appointmentDate}`}</td>
                    <td className="p-2.5">Formatted Weekday, Date</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-[#c2410c]">{`\${appointmentTime}`}</td>
                    <td className="p-2.5">Selected Time Slot</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-mono text-[#c2410c]">{`\${answers}`}</td>
                    <td className="p-2.5">Tally of 6 Audit Selections</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: High Fidelity Email Client Simulation */}
        <div className="lg:col-span-8 flex flex-col">
          {/* Mock Email Client Header */}
          <div className="bg-stone-800 text-stone-200 border-t border-x border-stone-700 rounded-t-2xl p-4 flex flex-col gap-2.5 text-xs">
            <div className="flex gap-2">
              <span className="text-stone-400 font-bold w-12">From:</span>
              <span className="font-semibold text-white">KindCodex &lt;noreply@kindcodex.com&gt;</span>
            </div>
            <div className="flex gap-2">
              <span className="text-stone-400 font-bold w-12">To:</span>
              <span className="font-semibold text-stone-100">{mockEmail}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-stone-400 font-bold w-12">Subject:</span>
              <span className="font-bold text-white">Confirmed: 15-Minute Clarity Call & Opportunity Audit Report</span>
            </div>
          </div>

          {/* Email HTML Output Render Frame */}
          <div className="bg-[#faf9f5] border border-stone-200 rounded-b-2xl shadow-md overflow-hidden min-h-[600px] flex justify-center">
            <iframe
              srcDoc={emailHtml}
              className="w-full min-h-[700px] border-0"
              title="Email HTML Preview"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
