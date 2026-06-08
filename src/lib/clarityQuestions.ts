import { Question } from './types';

export const clarityQuestions: Question[] = [
  {
    id: 'findability',
    number: 1,
    category: 'visibility',
    question: 'Can people easily find your business online?',
    answers: [
      { text: 'Yes', weights: { visibility: 0 } },
      { text: 'Somewhat', weights: { visibility: 1 } },
      { text: 'No', weights: { visibility: 2 } },
      { text: 'I’m not sure', weights: { visibility: 1.5 } },
    ],
    insight: 'If people can’t find you, they can’t choose you.',
  },
  {
    id: 'clarity',
    number: 2,
    category: 'clarity',
    question: 'When someone lands on your website, do they instantly understand what you do?',
    answers: [
      { text: 'Yes', weights: { clarity: 0 } },
      { text: 'Somewhat', weights: { clarity: 1 } },
      { text: 'No', weights: { clarity: 2 } },
      { text: 'I don’t have a real website', weights: { clarity: 2 } },
    ],
    insight: 'Confusion makes people leave. Clarity makes them take the next step.',
  },
  {
    id: 'trust',
    number: 3,
    category: 'trust',
    question: 'Does your online presence make your business look active, real, and trustworthy?',
    answers: [
      { text: 'Yes', weights: { trust: 0 } },
      { text: 'Somewhat', weights: { trust: 1 } },
      { text: 'No', weights: { trust: 2 } },
      { text: 'It needs work', weights: { trust: 1.5 } },
    ],
    insight: 'People judge your business before they ever call you.',
  },
  {
    id: 'conversion',
    number: 4,
    category: 'conversion',
    question: 'Do visitors know exactly what to do next?',
    answers: [
      { text: 'Call', weights: { conversion: 0 } },
      { text: 'Book', weights: { conversion: 0 } },
      { text: 'Request a quote', weights: { conversion: 0 } },
      { text: 'Message us', weights: { conversion: 0 } },
      { text: 'Not really', weights: { conversion: 2 } },
    ],
    insight: 'Attention only matters if it has a clear next step.',
  },
  {
    id: 'followup',
    number: 5,
    category: 'followUp',
    question: 'What happens when someone looks at your business but does not buy?',
    answers: [
      { text: 'We follow up', weights: { followUp: 0 } },
      { text: 'Sometimes', weights: { followUp: 1 } },
      { text: 'Nothing', weights: { followUp: 2 } },
      { text: 'I don’t know', weights: { followUp: 1.5 } },
    ],
    insight: 'Most people do not buy the first time. A better system keeps the opportunity alive.',
  },
  {
    id: 'salespath',
    number: 6,
    category: 'salesPath',
    question: 'Do you have a simple way to help customers choose higher-value services or come back again?',
    answers: [
      { text: 'Yes', weights: { salesPath: 0 } },
      { text: 'Somewhat', weights: { salesPath: 1 } },
      { text: 'No', weights: { salesPath: 2 } },
      { text: 'We have not thought about that', weights: { salesPath: 2 } },
    ],
    insight: 'Growth is not only more customers. It is a clearer path for the right customers.',
  },
];
