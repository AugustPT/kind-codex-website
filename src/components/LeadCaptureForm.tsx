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

  return (
    <section className="w-full py-16 bg-[#faf9f5] flex flex-col items-center">
      <div className="w-full max-w-xl px-6">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="border border-stone-200 bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(28,25,23,0.02)]"
            >
              {/* Form Title */}
              <h2 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight text-center mb-8">
                Send KindCodex your path.
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                    rows={4}
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
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="border border-stone-200 bg-white p-10 rounded-2xl text-center shadow-[0_4px_24px_rgba(28,25,23,0.02)]"
            >
              {/* Success Badge */}
              <div className="w-12 h-12 bg-stone-100 border border-stone-200 text-[#c2410c] rounded-full flex items-center justify-center mx-auto mb-6 text-xl">
                ✓
              </div>

              {/* Headline */}
              <h3 className="text-2xl font-serif text-stone-900 mb-3">
                Your Clarity Path has been saved.
              </h3>

              {/* Subtitle */}
              <p className="text-sm text-stone-600 leading-relaxed max-w-sm mx-auto font-medium">
                Thank you. We have received your path diagnostics and will prepare your action report ahead of our call.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
