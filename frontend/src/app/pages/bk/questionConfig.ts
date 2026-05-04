import { DASS21_QUESTIONS, ANSWER_OPTIONS } from './dass21Questions';

export interface AnswerConfig { label: string; weight: number; }
export interface ConfigurableQuestion {
  id: number; text: string; subscale: 'depression' | 'anxiety' | 'stress';
  answers: AnswerConfig[]; randomizeWeights?: boolean;
}

export const DEFAULT_QUESTION_CONFIGS: ConfigurableQuestion[] = DASS21_QUESTIONS.map(q => ({
  id: q.id, 
  text: q.text, 
  subscale: q.subscale as any,
  answers: ANSWER_OPTIONS.map(a => ({ label: a.label, weight: a.value }))
}));

export const loadQuestionConfigs = (): ConfigurableQuestion[] => {
  const saved = localStorage.getItem('questionConfigs');
  return saved ? JSON.parse(saved) : DEFAULT_QUESTION_CONFIGS;
};

export const saveQuestionConfigs = (configs: ConfigurableQuestion[]) => {
  localStorage.setItem('questionConfigs', JSON.stringify(configs));
};