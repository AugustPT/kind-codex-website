"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiagnosticResult, LeadFormData } from "../lib/types";

interface LeadCaptureFormProps {
  result: DiagnosticResult;
  answers: Record<string, string>;
  onSuccess?: (formData: LeadFormData) => void;
}

export default function LeadCaptureForm({
  result,
  answers,
  onSuccess,
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
  const [isBooking, setIsBooking] = useState(false);
  const [bookedSlot, setBookedSlot] = useState<{ date: string; time: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call / save to local store
    console.log("Submitting Clarity Path lead data:", {
      formData,
      resultType: result.category,
      resultHeadline: result.headline,
      recommendedFocus: result.recommendedFocus,
      answers,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);

    if (onSuccess) {
      onSuccess(formData);
    }
  };

  // Generate next 3 business days
  const getAvailableDates = () => {
    const dates: Date[] = [];
    const current = new Date();
    // Start tomorrow
    current.setDate(current.getDate() + 1);
    
    while (dates.length < 3) {
      const day = current.getDay();
      // Skip Saturday (6) and Sunday (0)
      if (day !== 0 && day !== 6) {
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const availableDates = getAvailableDates();
  const timeSlots = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"];

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) return;
    setIsBooking(true);

    // Prepare full diagnostic + scheduling payload
    const bookingPayload = {
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
      }
    };

    console.log("Submitting API booking request to backend:", bookingPayload);

    // Simulate API network call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsBooking(false);
    setBookedSlot({ date: selectedDate, time: selectedTime });
  };

  const formatDateString = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

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

            {/* Date Selection Row (Horizontal Scroll) */}
            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
              Available Dates
            </h4>
            <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-none">
              {availableDates.map((d) => {
                const formattedDay = d.toLocaleDateString("en-US", { weekday: "short" });
                const formattedNum = d.toLocaleDateString("en-US", { day: "numeric" });
                const isSelected = selectedDate === d.toDateString();
                
                return (
                  <button
                    key={d.toDateString()}
                    type="button"
                    onClick={() => setSelectedDate(d.toDateString())}
                    className={`flex-shrink-0 w-[64px] py-3.5 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-[#c2410c] bg-stone-50 text-[#c2410c] font-bold"
                        : "border-stone-200 hover:border-stone-400 text-stone-600 bg-white"
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider mb-1 font-semibold">{formattedDay}</span>
                    <span className="text-lg font-serif">{formattedNum}</span>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {timeSlots.map((t) => {
                    const isSelected = selectedTime === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSelectedTime(t)}
                        className={`py-3 rounded-lg border text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-[#c2410c] bg-[#c2410c] text-stone-50"
                            : "border-stone-200 hover:border-stone-400 text-stone-700 bg-white"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Submit Booking */}
            <div className="mt-8 border-t border-stone-200 pt-6">
              <button
                type="button"
                onClick={handleBookAppointment}
                disabled={!selectedDate || !selectedTime || isBooking}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#c2410c] hover:bg-[#a3350b] disabled:bg-stone-100 disabled:text-stone-400 text-stone-50 font-bold rounded-lg transition-all duration-300 shadow-[0_4px_12px_rgba(194,65,12,0.1)] cursor-pointer animate-pulse-subtle"
              >
                {isBooking ? "Booking your Call..." : "Confirm & Schedule 15-Minute Call"}
                <span className="text-sm">&rarr;</span>
              </button>
            </div>
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
                <div className="flex justify-between border-b border-stone-150 pb-2">
                  <span className="text-stone-400 font-medium">Date:</span>
                  <span>{formatDateString(bookedSlot.date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400 font-medium">Time:</span>
                  <span>{bookedSlot.time}</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
              We have sent a calendar invite and your diagnostic details to <span className="font-bold text-stone-800">{formData.email}</span>. We look forward to meeting with you!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
