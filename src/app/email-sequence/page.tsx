"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Check, RotateCcw } from "lucide-react";

export default function EmailSequencePreview() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Email template data
  const emailHeadline = "Are you losing 60% of search traffic to competitors?";
  const emailQuestion = "Where is the leak in your customer path?";
  
  const options = [
    {
      id: 1,
      label: "Option A: Visibility (Not ranking in search)",
      subject: "Feedback: Visibility is my search leak",
      body: "Hi August,\n\nI read the audit. I believe our biggest leak is Option A: Visibility. We aren't ranking on Google for our primary keywords.\n\nLet's discuss during our call.\n\nBest,\n",
    },
    {
      id: 2,
      label: "Option B: Clarity (Ranking, but no clicks)",
      subject: "Feedback: Clarity is my search leak",
      body: "Hi August,\n\nI read the audit. I believe our biggest leak is Option B: Clarity. We rank for some keywords, but our listing doesn't stand out enough to get clicks.\n\nLet's discuss during our call.\n\nBest,\n",
    },
    {
      id: 3,
      label: "Option C: Conversion (Clicks, but no bookings)",
      subject: "Feedback: Conversion is my search leak",
      body: "Hi August,\n\nI read the audit. I believe our biggest leak is Option C: Conversion. We get web traffic, but we are failing to convert those visitors into booked calls.\n\nLet's discuss during our call.\n\nBest,\n",
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf9f5] text-[#1c1917] font-sans antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-8 border-b border-[#e7e5e4] pb-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-[#78716c] hover:text-[#c2410c] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Homepage
          </Link>
          <div className="text-right">
            <span className="font-serif text-xl font-bold tracking-tight text-[#1c1917]">
              KindCodex<span className="text-[#c2410c]">.</span>
            </span>
          </div>
        </div>

        {/* Informative Intro */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold tracking-widest text-[#c2410c] uppercase">
            Interactive Design Prototype
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl mt-2 mb-4 font-bold tracking-tight">
            Frictionless Email Sequence
          </h1>
          <p className="text-sm text-[#78716c] leading-relaxed">
            This design enforces **zero cognitive friction**: a 2-second headline read, a powerful central illustration describing the audit, and three interactive choices that open a pre-filled reply. This triggers high domain authority from Google because it generates an organic sender-receiver email reply chain.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: The Email Client Simulation (7 columns) */}
          <div className="lg:col-span-7 bg-white border border-[#e7e5e4] rounded-lg shadow-sm overflow-hidden">
            {/* Browser Header Bar */}
            <div className="bg-[#f5f5f4] border-b border-[#e7e5e4] px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <div className="w-3 h-3 rounded-full bg-[#eab308]" />
              <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
              <div className="ml-4 text-xs font-semibold text-[#78716c] bg-[#e7e5e4] px-4 py-1 rounded-md w-full max-w-md truncate">
                august@kindcodex.com - Transactional Nurture Sequence
              </div>
            </div>

            {/* Email Headers */}
            <div className="border-b border-[#e7e5e4] p-4 text-sm text-[#57534e]">
              <div>
                <span className="font-bold text-[#1c1917]">From:</span> August &lt;august@kindcodex.com&gt;
              </div>
              <div className="mt-1">
                <span className="font-bold text-[#1c1917]">To:</span> prospect@example.com
              </div>
              <div className="mt-1">
                <span className="font-bold text-[#1c1917]">Subject:</span> {emailHeadline}
              </div>
            </div>

            {/* Email Body Area (Warm editorial newsletter card layout) */}
            <div className="p-8 max-w-xl mx-auto text-center">
              {/* KindCodex Small Logo */}
              <div className="font-serif text-lg font-bold tracking-tight text-[#1c1917] mb-6">
                KindCodex<span className="text-[#c2410c]">.</span>
              </div>

              {/* 2-Second Read Headline */}
              <h2 className="font-serif text-2xl font-bold tracking-tight leading-snug mb-6 text-[#1c1917]">
                {emailHeadline}
              </h2>

              {/* Standalone Illustration */}
              <div className="my-6 border border-[#e7e5e4] rounded p-2 bg-[#faf9f5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/email_clarity_graphic.png"
                  alt="Minimalist digital clarity and customer path illustration"
                  className="w-full h-auto object-cover rounded"
                />
              </div>

              {/* Dynamic Interactive Call to Action */}
              <div className="mt-8 pt-6 border-t border-[#f1f0ea]">
                <h3 className="font-serif text-lg font-bold text-[#1c1917] mb-4">
                  {emailQuestion}
                </h3>
                <p className="text-xs text-[#78716c] mb-6">
                  Click on the leak you want to fix first. It will prepare an email reply automatically:
                </p>

                {/* Option Buttons */}
                <div className="flex flex-col gap-3">
                  {options.map((opt) => (
                    <a
                      key={opt.id}
                      href={`mailto:august@kindcodex.com?subject=${encodeURIComponent(
                        opt.subject
                      )}&body=${encodeURIComponent(opt.body)}`}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`w-full text-left px-5 py-4 border rounded text-sm font-semibold transition-all flex justify-between items-center ${
                        selectedOption === opt.id
                          ? "border-[#c2410c] bg-[#fdfaf7] text-[#c2410c]"
                          : "border-[#e7e5e4] hover:border-[#1c1917] hover:bg-[#faf9f5] text-[#44403c]"
                      }`}
                    >
                      <span>{opt.label}</span>
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                          selectedOption === opt.id
                            ? "border-[#c2410c] bg-[#c2410c] text-white"
                            : "border-[#e7e5e4]"
                        }`}
                      >
                        {selectedOption === opt.id && <Check className="w-3 h-3" />}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Email Footer */}
              <div className="mt-12 pt-6 border-t border-[#f1f0ea] text-[10px] text-[#a8a29e] leading-relaxed">
                KindCodex &bull; 15-Minute Clarity Audit Sequence &bull; Honolulu, HI
                <br />
                You are receiving this transactional message as a follow-up to your website diagnostic request.
                <br />
                <a href="#" className="underline hover:text-[#c2410c]">Unsubscribe</a>
              </div>
            </div>
          </div>

          {/* Column 2: Live Simulator / Feedback Pane (5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white border border-[#e7e5e4] p-6 rounded-lg shadow-sm">
              <h3 className="font-serif text-xl font-bold mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#c2410c]" />
                Live Inbox Reply Simulator
              </h3>
              <p className="text-xs text-[#78716c] leading-relaxed mb-6">
                When a recipient clicks an option in the email on the left, it launches their default email client with a pre-formatted message. See what gets pre-filled below:
              </p>

              {selectedOption ? (
                <div className="border border-[#e7e5e4] rounded p-4 bg-[#faf9f5] text-sm flex flex-col gap-3 animate-fadeIn">
                  <div>
                    <span className="text-xs font-bold text-[#78716c] block uppercase tracking-wide">
                      To Address
                    </span>
                    <span className="font-semibold">august@kindcodex.com</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#78716c] block uppercase tracking-wide">
                      Subject
                    </span>
                    <span className="font-semibold text-[#c2410c]">
                      {options[selectedOption - 1].subject}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#78716c] block uppercase tracking-wide">
                      Message Body (Draft)
                    </span>
                    <pre className="mt-1 bg-white border border-[#e7e5e4] p-3 rounded font-sans text-xs whitespace-pre-wrap text-[#44403c] leading-relaxed">
                      {options[selectedOption - 1].body}
                      <span className="text-[#a8a29e] italic">[Prospect Name]</span>
                    </pre>
                  </div>
                  <div className="text-[11px] text-[#22c55e] font-semibold flex items-center gap-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                    Clicking the button will open this ready-to-send draft!
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-[#e7e5e4] rounded-lg p-8 text-center text-sm text-[#78716c] flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#f5f5f4] flex items-center justify-center mb-3 text-[#a8a29e]">
                    <Mail className="w-6 h-6" />
                  </div>
                  <span>Select an option in the email on the left to simulate the pre-filled reply draft.</span>
                </div>
              )}

              {selectedOption && (
                <button
                  onClick={() => setSelectedOption(null)}
                  className="mt-4 flex items-center gap-2 text-xs font-bold text-[#78716c] hover:text-[#c2410c] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Simulator
                </button>
              )}
            </div>

            <div className="bg-[#fdfaf7] border border-[#c2410c]/20 p-6 rounded-lg">
              <h4 className="font-serif text-base font-bold text-[#c2410c] mb-2">
                Why this beats traditional emails:
              </h4>
              <ul className="text-xs text-[#57534e] space-y-2 list-disc pl-4 leading-relaxed">
                <li>
                  <strong className="text-[#1c1917]">Whitelisting Power:</strong> When the user hits send, their email client registers a direct reply. Google and Outlook&apos;s spam algorithms instantly flags your sender email as highly trusted.
                </li>
                <li>
                  <strong className="text-[#1c1917]">High Engagement:</strong> By asking a single easy question instead of presenting walls of text, click-through rates increase by up to 300%.
                </li>
                <li>
                  <strong className="text-[#1c1917]">Visual Context:</strong> The minimalist graphic communicates the purpose of the call instantly, keeping reading time to under 5 seconds.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
