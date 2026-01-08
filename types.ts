
export enum AudioTrackType {
  VOICE = 'VOICE',
  MUSIC = 'MUSIC',
  SFX = 'SFX',
  BEAT = 'BEAT'
}

export interface VoiceProfile {
  id: string;
  name: string;
  sourceUrl?: string;
  base64Data?: string;
  type: 'built-in' | 'cloned';
  mood?: string;
  language?: string;
  accent?: string;
}

export interface AudioRegion {
  id: string;
  startTime: number; // in seconds
  duration: number; // in seconds
  buffer?: AudioBuffer;
  sourceUrl?: string;
  name: string;
}

export interface EqSettings {
  low: number; // -12 to 12 dB
  mid: number;
  high: number;
}

export interface Track {
  id: string;
  name: string;
  type: AudioTrackType;
  volume: number;
  muted: boolean;
  solo: boolean;
  regions: AudioRegion[];
  pan: number; // -1 to 1
  pitch: number; // 0.5 to 2.0
  speed: number; // 0.5 to 2.0
  eq: EqSettings;
}

export interface ProjectSettings {
  sampleRate: number;
  format: 'wav' | 'mp3';
  quality: 'low' | 'medium' | 'high';
  liveModeEnabled: boolean;
  bpm: number;
}
