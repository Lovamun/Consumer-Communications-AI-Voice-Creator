
import React from 'react';
import { 
  Mic, 
  Music, 
  Waves, 
  Settings, 
  Download, 
  Play, 
  Pause, 
  Volume2, 
  RotateCcw,
  Plus,
  Trash2,
  Sliders,
  Type,
  Languages,
  Zap,
  Disc,
  Activity,
  Filter,
  VolumeX,
  Volume1,
  Square,
  SkipBack,
  SkipForward,
  FastForward,
  Rewind,
  Piano,
  Speaker,
  HelpCircle,
  Search,
  BookOpen,
  Upload
} from 'lucide-react';

export const COLORS = {
  primary: '#3b82f6', // Blue
  secondary: '#f97316', // Orange
  bg: '#0f172a',
  surface: '#1e293b',
  border: '#334155',
  text: '#f8fafc',
  accent: '#fb923c'
};

export const BUILT_IN_VOICES = [
  { id: 'v1', name: 'Adam', type: 'built-in', mood: 'Neutral', language: 'English', accent: 'American' },
  { id: 'v2', name: 'Bella', type: 'built-in', mood: 'Calm', language: 'English', accent: 'British' },
  { id: 'v3', name: 'Charlie', type: 'built-in', mood: 'Energetic', language: 'English', accent: 'Australian' },
  { id: 'v4', name: 'Dana', type: 'built-in', mood: 'Serious', language: 'German', accent: 'German' },
  { id: 'v5', name: 'Elena', type: 'built-in', mood: 'Elegant', language: 'Spanish', accent: 'Castilian' }
];

export const SFX_LIBRARY = [
  { id: 'sfx1', name: 'Cinematic Riser', category: 'Transitions' },
  { id: 'sfx2', name: 'Fast Whoosh', category: 'Impacts' },
  { id: 'sfx3', name: 'Soft Chime', category: 'Ui' },
  { id: 'sfx4', name: 'Social Alert', category: 'Ui' },
  { id: 'sfx5', name: 'Impact Hit', category: 'Impacts' },
  { id: 'sfx6', name: 'Glitch Sweep', category: 'Transitions' },
  { id: 'sfx7', name: 'Sub Drop', category: 'Impacts' },
  { id: 'sfx8', name: 'Digital Blip', category: 'Ui' },
  { id: 'sfx9', name: 'Magic Swoosh', category: 'Transitions' },
  { id: 'sfx10', name: 'Retro Zap', category: 'Impacts' }
];

export const BEAT_LIBRARY = [
  { id: 'b1', name: 'Lo-Fi Chill', bpm: 85, type: 'Drum' },
  { id: 'b2', name: 'Heavy Trap', bpm: 140, type: 'Drum' },
  { id: 'b3', name: '80s Retro', bpm: 110, type: 'Synth' },
  { id: 'b4', name: 'Grand Piano', bpm: 95, type: 'Piano' },
  { id: 'b5', name: 'Sub Bass', bpm: 124, type: 'Bass' },
  { id: 'b6', name: 'Cloud Pads', bpm: 70, type: 'Synth' },
  { id: 'b7', name: 'Jazz Guitar', bpm: 105, type: 'Instrument' },
  { id: 'b8', name: 'Techno Pulse', bpm: 128, type: 'Drum' },
  { id: 'b9', name: 'Vinyl Crackle', bpm: 0, type: 'Atmosphere' }
];

export const HELP_SECTIONS = [
  {
    id: 'start',
    title: 'Getting Started',
    content: 'Welcome to the Consumer Communication AI Voice Creator. This app is a professional-grade studio for creating voice clones, high-fidelity TTS, and mixing tracks for social media. Start by either recording a new voice or importing an audio file into your asset library.',
    audioText: 'Welcome to the studio. To begin, use the sidebar to import or record your first asset. Use the transport bar at the top to control playback.'
  },
  {
    id: 'cloning',
    title: 'Voice Cloning (Record/Import)',
    content: 'To clone a voice, click "Start Voice Cloning". You can either hold the microphone button to record live or click the "Import File" option. For best results, we recommend a clear recording between 15 and 30 seconds long. Ensure there is minimal background noise.',
    audioText: 'Cloning requires a sample. We recommend fifteen to thirty seconds of clear speech. You can upload a WAV or MP3, or record directly via your browser microphone.'
  },
  {
    id: 'workflow',
    title: 'Production Workflow',
    content: '1. Create a Clone Profile (Record or Import). 2. Add the Clone to your Timeline. 3. Enter your Script in the TTS Modal. 4. Mix with Music and SFX. 5. Apply EQ and Effects. 6. Export your Masterpiece.',
    audioText: 'The standard workflow is: Capture a voice, generate your speech content, layer in background beats and effects, then mix and export.'
  },
  {
    id: 'dj-tools',
    title: 'DJ Mixing & Turntables',
    content: 'Our mixer features dual turntable decks (Deck A and B). Use the Crossfader to transition between sources. Each track has independent 3-Band EQ (Low, Mid, High), Pitch Shifting, and Speed control. Click the Sliders icon on any track to expand its pro controls.',
    audioText: 'Use the dual turntables to manage your master vibe. The crossfader blends between your audio groups, while individual channel EQ allows for precision sculpting.'
  }
];

export const UI_ICONS = {
  Mic: <Mic className="w-5 h-5" />,
  Music: <Music className="w-5 h-5" />,
  Waves: <Waves className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
  Download: <Download className="w-5 h-5" />,
  Play: <Play className="w-5 h-5" />,
  Pause: <Pause className="w-5 h-5" />,
  Stop: <Square className="w-5 h-5" />,
  Cue: <SkipBack className="w-5 h-5" />,
  GoBack: <Rewind className="w-5 h-5" />,
  GoForward: <FastForward className="w-5 h-5" />,
  Volume: <Volume2 className="w-5 h-5" />,
  VolumeMuted: <VolumeX className="w-5 h-5" />,
  VolumeLow: <Volume1 className="w-5 h-5" />,
  Reset: <RotateCcw className="w-5 h-5" />,
  Plus: <Plus className="w-5 h-5" />,
  Trash: <Trash2 className="w-5 h-5" />,
  Sliders: <Sliders className="w-5 h-5" />,
  Type: <Type className="w-5 h-5" />,
  Globe: <Languages className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Disc: <Disc className="w-5 h-5" />,
  EQ: <Activity className="w-5 h-5" />,
  Filter: <Filter className="w-5 h-5" />,
  Instrument: <Piano className="w-5 h-5" />,
  Help: <HelpCircle className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  Book: <BookOpen className="w-5 h-5" />,
  Upload: <Upload className="w-5 h-5" />
};
