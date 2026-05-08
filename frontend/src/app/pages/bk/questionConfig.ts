import { DASS21_QUESTIONS, ANSWER_OPTIONS } from './dass21Questions';

const QUESTION_CONFIG_VERSION = 'mixed-scoring-v1';
const QUESTION_CONFIG_VERSION_KEY = 'questionConfigsVersion';

export interface AnswerConfig { label: string; weight: number; }
export interface ConfigurableQuestion {
  id: number; text: string; subscale: 'depression' | 'anxiety' | 'stress';
  answers: AnswerConfig[]; reverseScored?: boolean;
}

const cloneConfigs = (configs: ConfigurableQuestion[]) => JSON.parse(JSON.stringify(configs));

const buildAnswers = (reverseScored?: boolean) =>
  ANSWER_OPTIONS.map((answer) => ({
    label: answer.label,
    weight: reverseScored ? 3 - answer.value : answer.value
  }));

export const DEFAULT_QUESTION_CONFIGS: ConfigurableQuestion[] = DASS21_QUESTIONS.map(q => ({
  id: q.id, 
  text: q.text, 
  subscale: q.subscale as any,
  reverseScored: Boolean(q.reverseScored),
  answers: buildAnswers(Boolean(q.reverseScored))
}));

const normalizeQuestionConfigs = (configs: ConfigurableQuestion[]): ConfigurableQuestion[] =>
  configs
    .map((question) => {
      const defaultQuestion = DEFAULT_QUESTION_CONFIGS.find((item) => item.id === question.id);

      return {
        id: question.id,
        text: question.text || defaultQuestion?.text || '',
        subscale: question.subscale || defaultQuestion?.subscale || 'depression',
        reverseScored: defaultQuestion?.reverseScored || false,
        answers: defaultQuestion?.answers || buildAnswers(false)
      };
    })
    .sort((a, b) => a.id - b.id);

export const loadQuestionConfigs = (): ConfigurableQuestion[] => {
  const saved = localStorage.getItem('questionConfigs');
  const savedVersion = localStorage.getItem(QUESTION_CONFIG_VERSION_KEY);

  if (!saved || savedVersion !== QUESTION_CONFIG_VERSION) {
    saveQuestionConfigs(DEFAULT_QUESTION_CONFIGS);
    return cloneConfigs(DEFAULT_QUESTION_CONFIGS);
  }

  return normalizeQuestionConfigs(JSON.parse(saved));
};

export const saveQuestionConfigs = (configs: ConfigurableQuestion[]) => {
  localStorage.setItem('questionConfigs', JSON.stringify(normalizeQuestionConfigs(configs)));
  localStorage.setItem(QUESTION_CONFIG_VERSION_KEY, QUESTION_CONFIG_VERSION);
};
