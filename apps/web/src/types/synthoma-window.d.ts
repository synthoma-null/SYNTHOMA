export {};

declare global {
  interface Window {
    __synthomaAudio?: HTMLAudioElement;
    audioPanelPlay?: (file?: string) => void;
    audioPanelEnsurePlaying?: () => void;
  }
}
