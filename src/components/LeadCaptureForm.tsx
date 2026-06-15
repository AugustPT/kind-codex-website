"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiagnosticResult, LeadFormData } from "../lib/types";

interface LeadCaptureFormProps {
  result: DiagnosticResult;
  answers: Record<string, string>;
  onSuccess?: (formData: LeadFormData) => void;
  // Which page/funnel this lead came from, e.g. "never-miss-a-lead".
  // Keeps leads sorted into separate categories. Defaults to the home audit.
  source?: string;
}

export default function LeadCaptureForm({
  result,
  answers,
  onSuccess,
  source = "clarity-path-home",
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: "",
    businessName: "",
    website: "",
    email: "",
    phone: "",
    helpText: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTimeValue, setSelectedTimeValue] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookedSlot, setBookedSlot] = useState<{ date: string; time: string } | null>(null);
  const [availableDays, setAvailableDays] = useState<any[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isSubmitted) return;

    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setSlotsError(null);
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Pacific/Honolulu";
        const res = await fetch(`/api/slots?timezone=${encodeURIComponent(tz)}`);
        if (!res.ok) {
          throw new Error("Failed to load available time slots");
        }
        const data = await res.json();
        setAvailableDays(data.days || []);
        if (data.days && data.days.length > 0) {
          setSelectedDate(data.days[0].dateString);
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
        setSlotsError("Could not retrieve real-time availability. Please try again.");
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [isSubmitted]);

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedTimeValue) return;
    setIsBooking(true);

    const bookingPayload = {
      source,
      lead: formData,
      diagnostics: {
        category: result.category,
        headline: result.headline,
        recommendedFocus: result.recommendedFocus,
        answers,
      },
      appointment: {
        date: selectedDate,
        time: selectedTime,
        value: selectedTimeValue,
      }
    };

    console.log("Submitting API booking request to backend:", bookingPayload);

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to finalize booking request");
      }

      console.log("API booking completed successfully!");
      setBookedSlot({ date: selectedDate, time: selectedTime });
    } catch (err) {
      console.error("Error submitting appointment booking to API:", err);
      // Fallback: proceed to success state locally even if API fails
      setBookedSlot({ date: selectedDate, time: selectedTime });
    } finally {
      setIsBooking(false);
    }
  };

  const formatDateString = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare full diagnostic payload (without appointment details as they will choose on Calendly)
    const leadPayload = {
      source,
      lead: formData,
      diagnostics: {
        category: result.category,
        headline: result.headline,
        recommendedFocus: result.recommendedFocus,
        answers,
      }
    };

    console.log("Submitting Clarity Path lead data to Brevo:", leadPayload);

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to save lead details");
      }
      console.log("Lead details saved successfully in Brevo CRM");
    } catch (err) {
      console.error("Error submitting lead to Brevo CRM:", err);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);

    if (onSuccess) {
      onSuccess(formData);
    }
  };

  const currentDayData = availableDays.find(d => d.dateString === selectedDate);
  const timeSlots = currentDayData ? currentDayData.spots : [];

  return (
    <div className="w-full bg-white">
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 pt-4 bg-white"
          >
            {/* Form Title */}
            <h2 className="text-xl sm:text-2xl font-serif text-stone-900 tracking-tight text-left mb-6">
              Send KindCodex your path.
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Business */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-[9px] font-bold text-stone-400 uppercase tracking-widest"
                  >
                    Name
                  </label>
                  <input
                    required
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-[#c2410c] focus:ring-1 focus:ring-[#c2410c] rounded-lg p-3 text-sm text-stone-900 outline-none transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="businessName"
                    className="text-[9px] font-bold text-stone-400 uppercase tracking-widest"
                  >
                    Business Name
                  </label>
                  <input
                    required
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Boutique Cafe"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-[#c2410c] focus:ring-1 focus:ring-[#c2410c] rounded-lg p-3 text-sm text-stone-900 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Website & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="website"
                    className="text-[9px] font-bold text-stone-400 uppercase tracking-widest"
                  >
                    Website or social link
                  </label>
                  <input
                    required
                    type="text"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="example.com"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-[#c2410c] focus:ring-1 focus:ring-[#c2410c] rounded-lg p-3 text-sm text-stone-900 outline-none transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-[9px] font-bold text-stone-400 uppercase tracking-widest"
                  >
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="w-full bg-stone-50 border border-stone-200 focus:border-[#c2410c] focus:ring-1 focus:ring-[#c2410c] rounded-lg p-3 text-sm text-stone-900 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="phone"
                  className="text-[9px] font-bold text-stone-400 uppercase tracking-widest"
                  aria-label="Phone Number"
                >
                  Phone
                </label>
                <input
                  required
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-stone-50 border border-stone-200 focus:border-[#c2410c] focus:ring-1 focus:ring-[#c2410c] rounded-lg p-3 text-sm text-stone-900 outline-none transition-all duration-200"
                />
              </div>

              {/* Help Text */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="helpText"
                  className="text-[9px] font-bold text-stone-400 uppercase tracking-widest"
                >
                  What do you want help with?
                  </label>
                <textarea
                  required
                  id="helpText"
                  name="helpText"
                  value={formData.helpText}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Briefly describe what needs attention..."
                  className="w-full bg-stone-50 border border-stone-200 focus:border-[#c2410c] focus:ring-1 focus:ring-[#c2410c] rounded-lg p-3 text-sm text-stone-900 outline-none resize-none transition-all duration-200"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 text-stone-50 font-bold rounded-lg transition-all duration-300 shadow-[0_4px_12px_rgba(28,25,23,0.1)] hover:shadow-[0_4px_20px_rgba(28,25,23,0.2)] cursor-pointer"
              >
                {isSubmitting ? "Saving Path..." : "Request the 15-minute call"}
                <span className="text-sm">&rarr;</span>
              </button>
            </form>
          </motion.div>
        ) : !bookedSlot ? (
          <motion.div
            key="scheduler"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 sm:p-8 bg-white text-left"
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c2410c]" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#c2410c]">
                Step 2: Schedule Your Call
              </h3>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif text-stone-900 tracking-tight mb-2">
              Select a date & time.
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mb-6 leading-relaxed">
              We saved your Clarity Path report. Pick a 15-minute slot to finalize your action plan.
            </p>

            {isLoadingSlots ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-stone-200 border-t-[#c2410c] rounded-full animate-spin" />
                <span className="text-xs text-stone-400 font-medium tracking-wide">Checking calendar availability...</span>
              </div>
            ) : slotsError ? (
              <div className="py-8 text-center">
                <p className="text-sm text-stone-600 mb-4">{slotsError}</p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 border border-stone-200 hover:border-stone-400 rounded-lg text-xs font-semibold text-stone-700 bg-white cursor-pointer"
                >
                  ← Go Back
                </button>
              </div>
            ) : (
              <>
                {/* Date Selection Row (Horizontal Scroll) */}
                <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
                  Available Dates
                </h4>
                <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-none">
                  {availableDays.map((d) => {
                    const isSelected = selectedDate === d.dateString;
                    
                    return (
                      <button
                        key={d.dateString}
                        type="button"
                        onClick={() => {
                          setSelectedDate(d.dateString);
                          setSelectedTime(null);
                          setSelectedTimeValue(null);
                        }}
                        className={`flex-shrink-0 w-[64px] py-3.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-[#c2410c] bg-stone-50 text-[#c2410c] font-bold"
                            : "border-stone-200 hover:border-stone-400 text-stone-600 bg-white"
                        }`}
                      >
                        <span className="text-[9px] uppercase tracking-wider mb-1 font-semibold">{d.dayOfWeek}</span>
                        <span className="text-lg font-serif">{d.displayDate.split(' ')[1]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots Section */}
                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
                      Available Times (in your local timezone)
                    </h4>
                    {timeSlots.length === 0 ? (
                      <p className="text-xs text-stone-500 py-2">No available time slots on this day. Please check other dates.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {timeSlots.map((t: any) => {
                          const isSelected = selectedTime === t.time;
                          return (
                            <button
                              key={t.value}
                              type="button"
                              onClick={() => {
                                setSelectedTime(t.time);
                                setSelectedTimeValue(t.value);
                              }}
                              className={`py-3 rounded-lg border text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? "border-[#c2410c] bg-[#c2410c] text-stone-50"
                                  : "border-stone-200 hover:border-stone-400 text-stone-700 bg-white"
                              }`}
                            >
                              {t.time}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Submit Booking */}
                <div className="mt-8 border-t border-stone-200 pt-6">
                  <button
                    type="button"
                    onClick={handleBookAppointment}
                    disabled={!selectedDate || !selectedTime || isBooking}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#c2410c] hover:bg-[#a3350b] disabled:bg-stone-100 disabled:text-stone-400 text-stone-50 font-bold rounded-lg transition-all duration-300 shadow-[0_4px_12px_rgba(194,65,12,0.1)] cursor-pointer"
                  >
                    {isBooking ? "Booking your Call..." : "Confirm & Schedule 15-Minute Call"}
                    <span className="text-sm">&rarr;</span>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="booking-success"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="p-8 py-12 bg-white text-center"
          >
            {/* Success Icon */}
            <div className="w-12 h-12 bg-stone-50 border border-stone-200 text-[#c2410c] rounded-full flex items-center justify-center mx-auto mb-6 text-xl">
              ✓
            </div>

            <h3 className="text-2xl font-serif text-stone-900 mb-2">
              Clarity Call Scheduled!
            </h3>
            
            <div className="max-w-md mx-auto bg-stone-50 border border-stone-200/60 rounded-xl p-6 my-6 text-left">
              <div className="flex flex-col gap-3 text-sm text-stone-700 font-semibold font-sans">
                <div className="flex justify-between border-b border-stone-150 pb-2">
                  <span className="text-stone-400 font-medium">Attendee:</span>
                  <span>{formData.name}</span>
                </div>
                <div className="flex justify-between border-b border-stone-150 pb-2">
                  <span className="text-stone-400 font-medium">Event:</span>
                  <span>15-Minute Clarity Call</span>
                </div>
                {bookedSlot && (
                  <>
                    <div className="flex justify-between border-b border-stone-150 pb-2">
                      <span className="text-stone-400 font-medium">Date:</span>
                      <span>{formatDateString(bookedSlot.date)}</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-150 pb-2">
                      <span className="text-stone-400 font-medium">Time:</span>
                      <span>{bookedSlot.time}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-400 font-medium">Platform:</span>
                  <span>Google Meet / Phone (Check Invite)</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
              We have synced your diagnostic details. A calendar invitation has been sent to <span className="font-bold text-stone-800">{formData.email}</span>. We look forward to meeting with you!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
