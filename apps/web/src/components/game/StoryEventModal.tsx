'use client';

import type { StoryEventInstance } from '../../game/types';

interface Props {
  event: StoryEventInstance;
  onResolve: (choiceId?: string) => void;
}

export function StoryEventModal({ event, onResolve }: Props) {
  const { event: ev } = event;

  return (
    <div className="event-modal-overlay">
      <div className="event-modal">
        <div className="event-modal-log">{ev.logLabel}</div>
        <h2 className="event-modal-title">{ev.title}</h2>
        <p className="event-modal-text">{ev.text}</p>

        {ev.tags && ev.tags.length > 0 && (
          <div className="event-modal-tags">
            {ev.tags.map((tag) => (
              <span key={tag} className="event-tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="event-modal-actions">
          {ev.choices && ev.choices.length > 0 ? (
            ev.choices.map((choice) => (
              <button
                key={choice.id}
                className="btn-event-choice"
                onClick={() => onResolve(choice.id)}
                type="button"
              >
                <span className="choice-label">{choice.label}</span>
                <span className="choice-text">{choice.text}</span>
              </button>
            ))
          ) : (
            <button
              className="btn-event-confirm"
              onClick={() => onResolve()}
              type="button"
            >
              Potvrdit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
