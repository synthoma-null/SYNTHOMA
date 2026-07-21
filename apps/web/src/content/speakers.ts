import speakerData from './speakers.json';

export type SpeakerSourceBook = 'synthoma-null' | 'konec-podpory';

export interface SpeakerDefinition {
  id: string;
  name: string;
  shortName?: string;
  sourceBook: SpeakerSourceBook;
  cssClass: string;
  color: string;
  secondaryColor?: string;
  defaultTone: string;
  role: string;
  archiveEntryId?: string;
}

export const SPEAKER_REGISTRY = speakerData as SpeakerDefinition[];

const speakersById = new Map(SPEAKER_REGISTRY.map((speaker) => [speaker.id, speaker]));
const speakersByClass = new Map(SPEAKER_REGISTRY.map((speaker) => [speaker.cssClass, speaker]));

export function getSpeaker(id: string | null | undefined): SpeakerDefinition | undefined {
  return id ? speakersById.get(id) : undefined;
}

export function getSpeakerByClasses(classes: Iterable<string>): SpeakerDefinition | undefined {
  const names = [...classes];
  for (const name of names) {
    if (name === 'dialog') continue;
    const speaker = speakersByClass.get(name);
    if (speaker) return speaker;
  }
  return names.includes('dialog') ? speakersByClass.get('dialog') : undefined;
}

export function getSpeakerCssProperties(speaker: SpeakerDefinition): Record<string, string> {
  return {
    '--speaker-color': speaker.color,
    '--speaker-secondary': speaker.secondaryColor ?? speaker.color,
  };
}
