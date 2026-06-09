"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Question } from "../lib/types";
import AnswerCard from "./AnswerCard";
import InsightCard from "./InsightCard";

interface QuestionStepProps {
  question: Question;
  selectedAnswer: string | undefined;
  onSelectAnswer: (answerText: string) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function QuestionStep({
  question,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: QuestionStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      {/* Category Tag */}
      <span className="text-[9px] font-bold tracking-widest text-[#c2410c] uppercase bg-stone-100 border border-stone-200/60 px-3 py-1 rounded-md mb-2 sm:mb-6 inline-block">
        Opportunity 0{question.number}
      </span>

      {/* Question Headline */}
      <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-900 leading-snug tracking-tight mb-4 sm:mb-8">
        {question.question}
      </h2>

      {/* Answers List */}
      <div className="space-y-2 sm:space-y-3">
        {question.answers.map((answer) => (
          <AnswerCard
            key={answer.text}
            text={answer.text}
            selected={selectedAnswer === answer.text}
            onClick={() => onSelectAnswer(answer.text)}
          />
        ))}
      </div>

      {/* Insight Display */}
      <AnimatePresence mode="wait">
        {selectedAnswer && <InsightCard key={question.id} insight={question.insight} />}
      </AnimatePresence>

      {/* Step Actions */}
      <div className="flex justify-between items-center mt-4 sm:mt-10 border-t border-stone-200 pt-4 sm:pt-6">
        {/* Back Button */}
        {!isFirst ? (
          <button
            type="button"
            onClick={onPrev}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg border border-stone-200 text-[10px] sm:text-xs font-bold text-stone-500 hover:text-stone-900 hover:border-stone-400 hover:bg-stone-50 transition-all cursor-pointer uppercase tracking-wider"
          >
            &larr; Back
          </button>
        ) : (
          <div /> // Spacer
        )}

        {/* Continue Button */}
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedAnswer}
          className={`inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 font-semibold rounded-lg text-xs sm:text-sm transition-all duration-300 ${
            selectedAnswer
              ? "bg-stone-900 hover:bg-stone-850 text-stone-50 shadow-[0_4px_12px_rgba(28,25,23,0.1)] hover:shadow-[0_4px_20px_rgba(28,25,23,0.2)] cursor-pointer"
              : "bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed"
          }`}
        >
          {isLast ? "Calculate Result" : "Continue"}
          <span className="text-xs">&rarr;</span>
        </button>
      </div>
    </motion.div>
  );
}
