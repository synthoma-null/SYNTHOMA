import React from 'react';
import { render, screen, within } from '@testing-library/react';
import DecisionTimeline, { type RecentDecision } from './DecisionTimeline';

const decision: RecentDecision = {
  id: 'choice-1',
  collection: 'synthoma',
  chapterId: '0-0-null',
  chapterTitle: 'Prázdná archivní stránka',
  choiceId: 'sign',
  choiceText: 'Podepsat se',
  nextBlockId: 'next',
  functionDelta: { ti: 4, fe: -2 },
  emotionDelta: null,
  tone: 'tender',
  createdAt: '2026-07-12T08:20:00.000Z',
};

describe('DecisionTimeline', () => {
  it('renders a concise choice trace without injecting HTML', () => {
    render(<DecisionTimeline decisions={[{ ...decision, choiceText: '<strong>Podepsat se</strong>' }]} />);

    const item = screen.getByRole('listitem');
    expect(within(item).getByText('<strong>Podepsat se</strong>')).toBeInTheDocument();
    expect(item.querySelector('strong strong')).not.toBeInTheDocument();
    expect(within(item).getByText('TI +4 / FE -2')).toBeInTheDocument();
    expect(within(item).getByRole('time')).toHaveAttribute('dateTime', decision.createdAt);
  });

  it('renders a clear empty state', () => {
    render(<DecisionTimeline decisions={[]} />);
    expect(screen.getByText(/Žádná rozhodnutí/)).toBeInTheDocument();
  });
});
