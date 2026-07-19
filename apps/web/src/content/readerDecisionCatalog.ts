export interface ReaderDecisionChoiceContract {
  choiceId: string;
  sourceTag: string;
}

export interface ReaderDecisionQuestionContract {
  questionId: string;
  choices: ReaderDecisionChoiceContract[];
}

function question(questionId: string, ...sourceTags: string[]): ReaderDecisionQuestionContract {
  return {
    questionId,
    choices: sourceTags.map((sourceTag) => ({ choiceId: sourceTag.toLowerCase(), sourceTag })),
  };
}

export const READER_DECISION_CATALOG = {
  '0-inf-restart': [
    question('decision-01', 'E', 'I'),
    question('decision-02', 'S', 'N'),
    question('decision-03', 'F', 'T'),
    question('decision-04', 'T', 'F'),
    question('decision-05', 'J', 'P'),
  ],
  '0-0-null': [
    question('decision-01', 'I', 'E'),
    question('decision-02', 'F', 'T'),
    question('decision-03', 'S', 'N'),
    question('decision-04', 'N', 'S'),
    question('decision-05', 'J', 'P'),
    question('decision-06', 'P', 'J'),
  ],
  '0-1-start': [
    question('decision-01', 'I', 'E'),
    question('decision-02', 'T', 'F'),
    question('decision-03', 'J', 'P'),
    question('decision-04', 'N', 'S'),
    question('decision-05', 'J', 'P'),
  ],
  '0-2-run': [
    question('decision-01', 'E', 'I'),
    question('decision-02', 'S', 'N'),
    question('decision-03', 'S', 'N'),
    question('decision-04', 'T', 'F'),
    question('decision-05', 'J', 'P'),
    question('decision-06', 'J', 'P'),
    question('decision-07', 'E', 'I'),
  ],
  '0-3-discontinuum': [
    question('decision-01', 'S', 'N'),
    question('decision-02', 'F', 'T'),
    question('decision-03', 'T', 'F'),
    question('decision-04', 'J', 'P'),
    question('decision-05', 'S', 'N'),
  ],
  '0-4-defragmentation': [
    question('decision-01', 'T', 'F'),
    question('decision-02', 'S', 'N'),
    question('decision-03', 'F', 'T'),
    question('decision-04', 'T', 'F'),
  ],
  '0-5-pause': [
    question('decision-01', 'T', 'F'),
    question('decision-02', 'S', 'N'),
    question('decision-03', 'J', 'P'),
    question('decision-04', 'J', 'P'),
  ],
  '0-6-searching': [
    question('decision-01', 'E', 'I'),
    question('decision-02', 'S', 'N'),
    question('decision-03', 'S', 'N'),
    question('decision-04', 'T', 'F'),
    question('decision-05', 'T', 'F'),
  ],
  '0-7-ruins': [
    question('decision-01', 'T', 'F'),
    question('decision-02', 'N', 'S'),
    question('decision-03', 'J', 'P'),
    question('decision-04', 'S', 'N'),
  ],
  '0-8-reziduum': [
    question('decision-01', 'E', 'I'),
    question('decision-02', 'S', 'N'),
    question('decision-03', 'T', 'F'),
    question('decision-04', 'E', 'I'),
  ],
  '0-9-sector': [
    question('decision-01', 'F', 'T'),
    question('decision-02', 'J', 'P'),
    question('decision-03', 'N', 'S'),
    question('decision-04', 'J', 'P'),
  ],
  '0-10-rest': [
    question('decision-01', 'I', 'E'),
    question('decision-02', 'T', 'F'),
    question('decision-03', 'J', 'P'),
    question('decision-04', 'J', 'P'),
    question('decision-05', 'T', 'F'),
  ],
  '0-11-orgie': [
    question('decision-01', 'F', 'T'),
    question('decision-02', 'F', 'T'),
    question('decision-03', 'J', 'P'),
  ],
} satisfies Record<string, ReaderDecisionQuestionContract[]>;

export function getReaderDecisionContract(chapterId: string): ReaderDecisionQuestionContract[] {
  return READER_DECISION_CATALOG[chapterId as keyof typeof READER_DECISION_CATALOG] ?? [];
}
