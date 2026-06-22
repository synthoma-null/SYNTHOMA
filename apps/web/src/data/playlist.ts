export interface Track {
  title: string;
  src: string;
  mood?: string;
}

export const tracks: Track[] = [
  { title: "SynthBachmoff", src: "/audio/SynthBachmoff.mp3", mood: "intro" },
  { title: "Comet", src: "/audio/Comet.mp3", mood: "ambient" },
  { title: "Discontinuum", src: "/audio/Discontinuum.mp3", mood: "tension" },
  { title: "Nuova", src: "/audio/Nuova.mp3", mood: "run" },
  { title: "Orgie", src: "/audio/Orgie.mp3", mood: "chaos" },
  { title: "Run", src: "/audio/Run.mp3", mood: "action" },
  { title: "Searching", src: "/audio/Searching.mp3", mood: "searching" },
  { title: "Sector", src: "/audio/Sector.mp3", mood: "exploration" },
  { title: "SoulSynth", src: "/audio/SoulSynth.mp3", mood: "emotional" },
  { title: "SynthAm", src: "/audio/SynthAm.mp3", mood: "melancholy" },
  { title: "SynthJazzoko", src: "/audio/SynthJazzoko.mp3", mood: "jazz" },
  { title: "SYNTHOMA1", src: "/audio/SYNTHOMA1.mp3", mood: "main" },
  { title: "Touha", src: "/audio/Touha.mp3", mood: "desire" },
];
