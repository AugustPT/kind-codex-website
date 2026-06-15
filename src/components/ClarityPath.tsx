"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Question, DiagnosticResult } from "../lib/types";
import { clarityQuestions } from "../lib/clarityQuestions";
import { calculateResult as defaultCalculateResult } from "../lib/resultLogic";
import ProgressPath from "./ProgressPath";
import QuestionStep from "./QuestionStep";

interface ClarityPathProps {
  onComplete: (result: DiagnosticResult, answers: Record<string, string>) => void;
  // Optional overrides so outcome-specific pages reuse this exact UI
  // with their own questions and scoring. Defaults = the homepage audit.
  questions?: Question[];
  onCalculate?: (answers: Record<string, string>) => DiagnosticResult;
}

export default function ClarityPath({
  onComplete,
  questions = clarityQuestions,
  onCalculate = defaultCalculateResult,
}: ClarityPathProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion: Question = questions[step - 1];

  const handleSelectAnswer = (answerText: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerText,
    }));
  };

  const handleNext = () => {
    if (step < questions.length) {
      setStep((prev) => prev + 1);
    } else {
      // Completed! Calculate result
      const finalResult = onCalculate(answers);
      onComplete(finalResult, answers);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <section
      id="clarity-path"
      className="w-full py-8 sm:py-20 bg-[#faf9f5] border-b border-stone-200 overflow-hidden relative"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Progress Navigation Line */}
        <ProgressPath currentStep={step} totalSteps={questions.length} />

        {/* Step Transition Animation Wrapper */}
        <div className="min-h-[300px] sm:min-h-[420px] flex items-center justify-center mt-2 sm:mt-6">
          <AnimatePresence mode="wait">
            <QuestionStep
              key={currentQuestion.id}
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id]}
              onSelectAnswer={handleSelectAnswer}
              onNext={handleNext}
              onPrev={handlePrev}
              isFirst={step === 1}
              isLast={step === questions.length}
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
