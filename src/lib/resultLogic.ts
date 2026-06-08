import { DiagnosticResult, ResultCategory } from './types';
import { clarityQuestions } from './clarityQuestions';

export const RESULTS: Record<ResultCategory, DiagnosticResult> = {
  visibility: {
    category: 'visibility',
    headline: 'Your biggest opportunity is visibility.',
    summary: 'People may not be seeing your business where they are already searching.',
    recommendedFocus: [
      'Google Business Profile',
      'Better photos',
      'Clearer business description',
      'Local search presence',
      'Review trust',
    ],
    cta: 'Book a 15-minute clarity call',
  },
  clarity: {
    category: 'clarity',
    headline: 'Your biggest opportunity is clarity.',
    summary: 'People may be landing on your business but not instantly understanding why they should choose you.',
    recommendedFocus: [
      'Better homepage message',
      'Clear service explanation',
      'Stronger visual proof',
      'Simpler call-to-action',
      'Cleaner website structure',
    ],
    cta: 'Book a 15-minute clarity call',
  },
  trust: {
    category: 'trust',
    headline: 'Your biggest opportunity is trust.',
    summary: 'People may be checking your business but not seeing enough proof to feel confident.',
    recommendedFocus: [
      'Stronger photos',
      'Clearer reviews',
      'Better business presentation',
      'Visible proof',
      'More active online presence',
    ],
    cta: 'Book a 15-minute clarity call',
  },
  conversion: {
    category: 'conversion',
    headline: 'Your biggest opportunity is conversion.',
    summary: 'People may be interested, but the path from interest to action is not clear enough.',
    recommendedFocus: [
      'Better call-to-action',
      'Lead qualification flow',
      'Service selection path',
      'Quote request process',
      'Contact flow',
    ],
    cta: 'Book a 15-minute clarity call',
  },
  followUp: {
    category: 'followUp',
    headline: 'Your biggest opportunity is follow-up.',
    summary: 'People may be looking, leaving, and forgetting. Your business needs a clearer way to stay connected and guide them back.',
    recommendedFocus: [
      'Follow-up system',
      'Retargeting-ready structure',
      'Customer reminders',
      'Better offer path',
      'Higher-value service journey',
    ],
    cta: 'Book a 15-minute clarity call',
  },
  salesPath: {
    category: 'salesPath',
    headline: 'Your biggest opportunity is sales path.', // Keep it direct or use salesPath
    summary: 'Growth is not only more customers. It is a clearer path for the right customers.',
    recommendedFocus: [
      'Follow-up system',
      'Retargeting-ready structure',
      'Customer reminders',
      'Better offer path',
      'Higher-value service journey',
    ],
    cta: 'Book a 15-minute clarity call',
  },
  fullPath: {
    category: 'fullPath',
    headline: 'Your business needs a clearer customer path.',
    summary: 'The issue is not one single thing. People need an easier way to find you, understand you, trust you, contact you, and buy from you.',
    recommendedFocus: [
      'Website clarity',
      'Google visibility',
      'Trust signals',
      'Better lead path',
      'Follow-up system',
    ],
    cta: 'Book a 15-minute clarity call',
  },
};

// Prioritized order of the categories (funnel order) for resolving ties
const CATEGORY_PRIORITY: Exclude<ResultCategory, 'fullPath'>[] = [
  'visibility',
  'clarity',
  'trust',
  'conversion',
  'followUp',
  'salesPath',
];

export function calculateResult(answers: Record<string, string>): DiagnosticResult {
  // Initialize scores
  const scores: Record<Exclude<ResultCategory, 'fullPath'>, number> = {
    visibility: 0,
    clarity: 0,
    trust: 0,
    conversion: 0,
    followUp: 0,
    salesPath: 0,
  };

  // Tally scores based on selected answers
  clarityQuestions.forEach((q) => {
    const selectedAnswerText = answers[q.id];
    if (!selectedAnswerText) return;

    const answerOption = q.answers.find((a) => a.text === selectedAnswerText);
    if (!answerOption) return;

    // Add weights to categories
    const weights = answerOption.weights;
    Object.keys(weights).forEach((cat) => {
      const category = cat as Exclude<ResultCategory, 'fullPath'>;
      scores[category] += weights[category] || 0;
    });
  });

  // Determine weak categories (score >= 1)
  const weakCategories = Object.keys(scores).filter(
    (cat) => scores[cat as Exclude<ResultCategory, 'fullPath'>] >= 1
  );

  // If three or more categories are weak, return full customer path result
  if (weakCategories.length >= 3) {
    return RESULTS.fullPath;
  }

  // Find the highest score
  let highestScore = -1;
  let selectedCategory: Exclude<ResultCategory, 'fullPath'> = 'visibility';

  CATEGORY_PRIORITY.forEach((category) => {
    const score = scores[category];
    if (score > highestScore) {
      highestScore = score;
      selectedCategory = category;
    }
  });

  // If no category has any urgency (all scores 0), fall back to full path or visibility
  if (highestScore === 0) {
    return RESULTS.visibility;
  }

  return RESULTS[selectedCategory];
}
