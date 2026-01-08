
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Timeline from './components/Timeline';
import Mixer from './components/Mixer';
import HelpBox from './components/HelpBox';
import { Track, AudioTrackType, VoiceProfile, ProjectSettings } from './types';
import { UI_ICONS, COLORS, HELP_SECTIONS } from './constants';
import { generateTTS, analyzeAudio, cleanAudio } from './services/geminiService';
import { audioEngine } from './services/audioEngine';

const App: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [voices, setVoices] = useState<VoiceProfile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTtsModal, setShowTtsModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [cueTime, setCueTime] = useState(0);
  
  // TTS & Help Audio
  const [ttsText, setTtsText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState<any>(null);
  const [ttsLang, setTtsLang] = useState("English (US)");
  const [ttsAccent, setTtsAccent] = useState("Neutral Studio");
  const [currentHelpId, setCurrentHelpId] = useState<string | null>(null);

  // Recording & Clone Upload States
  const [isRecording, setIsRecording] = useState(false);
  const [recordedData, setRecordedData] = useState<string | null>(null);
  const [cloneName, setCloneName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Playback Loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleCue = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentTime(cueTime);
    } else {
      setCueTime(currentTime);
    }
  };

  const handleSeek = (seconds: number) => {
    setCurrentTime(prev => Math.max(0, Math.min(duration, prev + seconds)));
  };

  const startNewRecording = async () => {
    setIsRecording(true);
    setRecordedData(null);
    try {
      await audioEngine.startRecording();
    } catch (e) {
      console.error("Mic access denied");
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    const data = await audioEngine.stopRecording();
    setRecordedData(data);
    setIsRecording(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRecordedData(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const finalizeClone = async () => {
    if (!recordedData || !cloneName) return;
    setIsGenerating(true);
    
    const base64Data = recordedData.split(',')[1];
    await analyzeAudio(base64Data);
    const cleaned = await cleanAudio(base64Data);

    const newVoice: VoiceProfile = {
      id: Math.random().toString(36).substr(2, 9),
      name: cloneName,
      type: 'cloned',
      base64Data: cleaned,
      language: 'English',
      accent: 'Neutral'
    };

    setVoices(prev => [...prev, newVoice]);
    setIsGenerating(false);
    setShowCloneModal(false);
    setCloneName("");
    setRecordedData(null);
  };

  const addTrack = (type: AudioTrackType, asset: any) => {
    if (type === 'VOICE') {
      setSelectedVoice(asset);
      setShowTtsModal(true);
      return;
    }

    const newTrack: Track = {
      id: Math.random().toString(36).substr(2, 9),
      name: asset.name,
      type,
      volume: 0.8,
      muted: false,
      solo: false,
      pan: 0,
      pitch: 1.0,
      speed: 1.0,
      eq: { low: 0, mid: 0, high: 0 },
      regions: [{
        id: Math.random().toString(36).substr(2, 9),
        startTime: currentTime,
        duration: asset.duration || 5,
        name: asset.name
      }]
    };
    setTracks(prev => [...prev, newTrack]);
    audioEngine.createTrackNodes(newTrack.id);
  };

  const handleTtsGenerate = async () => {
    if (!ttsText.trim() || !selectedVoice) return;
    setIsGenerating(true);
    const mood = "Professional";
    const base64 = await generateTTS(ttsText, selectedVoice.name, mood);
    setIsGenerating(false);

    if (base64) {
      const newTrack: Track = {
        id: Math.random().toString(36).substr(2, 9),
        name: `${selectedVoice.name} Content`,
        type: AudioTrackType.VOICE,
        volume: 0.9,
        muted: false,
        solo: false,
        pan: 0,
        pitch: 1.0,
        speed: 1.0,
        eq: { low: 0, mid: 0, high: 0 },
        regions: [{
          id: Math.random().toString(36).substr(2, 9),
          startTime: currentTime,
          duration: Math.max(ttsText.length / 10, 3),
          name: ttsText.substring(0, 15) + "..."
        }]
      };
      setTracks(prev => [...prev, newTrack]);
      audioEngine.createTrackNodes(newTrack.id);
      setShowTtsModal(false);
      setTtsText("");
    }
  };

  const handleHelpAudio = async (text: string) => {
    const section = HELP_SECTIONS.find(s => s.audioText === text);
    if (section) setCurrentHelpId(section.id);
    
    // Simulate audio help via TTS generator
    const base64 = await generateTTS(text, "Adam", "Professional");
    if (base64) {
      const audio = new Audio(`data:audio/mp3;base64,${base64}`);
      audio.onended = () => setCurrentHelpId(null);
      audio.play();
    }
  };

  const updateTrack = (id: string, updates: Partial<Track>) => {
    setTracks(prev => prev.map(t => {
      if (t.id === id) {
        if (updates.volume !== undefined) audioEngine.setTrackVolume(id, updates.volume);
        if (updates.pan !== undefined) audioEngine.setTrackPan(id, updates.pan);
        if (updates.eq !== undefined) {
           if (updates.eq.low !== undefined) audioEngine.updateEq(id, 'low', updates.eq.low);
           if (updates.eq.mid !== undefined) audioEngine.updateEq(id, 'mid', updates.eq.mid);
           if (updates.eq.high !== undefined) audioEngine.updateEq(id, 'high', updates.eq.high);
        }
        return { ...t, ...updates };
      }
      return t;
    }));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-200">
      <Sidebar 
        onAddTrack={addTrack} 
        voices={voices} 
        onStartClone={() => setShowCloneModal(true)} 
      />

      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 text-blue-500 font-black text-xl italic group cursor-default">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-1.5 rounded-lg shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-110">
                   {UI_ICONS.Waves}
                </div>
                <span className="hidden xl:inline uppercase tracking-tighter">AI VOICE CREATOR</span>
             </div>
             
             <div className="flex bg-slate-800/50 rounded-xl p-1.5 border border-slate-700 gap-1 shadow-inner">
                <button onClick={() => handleSeek(-5)} className="p-2 text-slate-500 hover:text-white transition-colors">{UI_ICONS.GoBack}</button>
                <button onClick={handleCue} className="p-2 text-slate-500 hover:text-blue-400 transition-colors">{UI_ICONS.Cue}</button>
                <button onClick={handleStop} className="p-2 text-slate-500 hover:text-red-500 transition-colors">{UI_ICONS.Stop}</button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${isPlaying ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'}`}
                >
                  {isPlaying ? UI_ICONS.Pause : UI_ICONS.Play}
                  <span className="text-[10px] font-black uppercase tracking-widest">{isPlaying ? 'ON AIR' : 'START'}</span>
                </button>
                <button onClick={() => handleSeek(5)} className="p-2 text-slate-500 hover:text-white transition-colors">{UI_ICONS.GoForward}</button>
             </div>

             <div className="flex items-center bg-black/80 border border-slate-800 rounded-xl px-5 py-2 text-orange-500 font-mono text-sm shadow-inner">
                {Math.floor(currentTime / 60).toString().padStart(2, '0')}:
                {(currentTime % 60).toFixed(2).padStart(5, '0')}
             </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={() => setShowHelp(!showHelp)}
               className={`p-2.5 rounded-2xl border transition-all hover:scale-110 ${showHelp ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_blue]' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}
               title="Help & Instructions"
             >
                {UI_ICONS.Help}
             </button>
             <button className="flex items-center gap-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase transition-all shadow-2xl shadow-orange-900/40 border border-orange-400/20 active:scale-95">
                {UI_ICONS.Download} EXPORT MASTER
             </button>
             <button onClick={() => setShowSettings(true)} className="p-2.5 text-slate-400 hover:text-white bg-slate-800 rounded-2xl border border-slate-700 transition-all hover:rotate-90">
                {UI_ICONS.Settings}
             </button>
          </div>
        </header>

        {/* Studio Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <Timeline 
            tracks={tracks} 
            currentTime={currentTime} 
            duration={duration} 
            onTimeChange={setCurrentTime}
          />
          <Mixer tracks={tracks} onUpdateTrack={updateTrack} />
        </main>

        {/* Help Overlay Box */}
        {showHelp && (
          <HelpBox 
            onClose={() => setShowHelp(false)}
            onPlayAudio={handleHelpAudio}
            onStopAudio={() => setCurrentHelpId(null)}
            currentPlayingId={currentHelpId}
          />
        )}
      </div>

      {/* Clone Modal with Upload/Import */}
      {showCloneModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
             <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-2xl font-black flex items-center gap-4 italic uppercase tracking-tighter">
                  <div className="bg-orange-600 text-white p-2.5 rounded-2xl shadow-lg">{UI_ICONS.Mic}</div>
                  VOICE CLONER PRO
                </h3>
                <button onClick={() => setShowCloneModal(false)} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white transition-colors">&times;</button>
             </div>
             
             <div className="p-10 space-y-10 text-center">
                {!recordedData ? (
                  <div className="grid grid-cols-2 gap-6">
                    {/* Record Option */}
                    <div 
                      onMouseDown={startNewRecording}
                      onMouseUp={stopRecording}
                      className={`group p-8 rounded-[30px] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${isRecording ? 'bg-red-600/20 border-red-500 animate-pulse' : 'bg-slate-800/40 border-slate-700 hover:border-orange-500 hover:bg-slate-800'}`}
                    >
                       <div className={`p-4 rounded-full bg-slate-800 shadow-xl text-white transition-transform ${isRecording ? 'scale-125' : 'group-hover:scale-110'}`}>
                          {UI_ICONS.Mic}
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                         {isRecording ? "Capturing..." : "Hold to Record"}
                       </span>
                    </div>

                    {/* Import Option */}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="group p-8 rounded-[30px] border-2 border-dashed border-slate-700 bg-slate-800/40 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-blue-500 hover:bg-slate-800 transition-all"
                    >
                       <div className="p-4 rounded-full bg-slate-800 shadow-xl text-blue-400 group-hover:scale-110 transition-transform">
                          {UI_ICONS.Upload}
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Import File</span>
                       <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" className="hidden" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-black/60 p-6 rounded-[30px] border border-slate-800 shadow-inner">
                       <div className="flex items-center justify-center gap-3 text-orange-500 mb-4">
                          <div className="animate-pulse">{UI_ICONS.Waves}</div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Sample Synchronized</span>
                       </div>
                       <audio src={recordedData} controls className="w-full h-10 opacity-60" />
                    </div>
                    <div className="text-left space-y-4">
                       <div>
                          <label className="text-[9px] font-black text-slate-500 uppercase block mb-2 px-1 tracking-widest">Profile Name (e.g. Host Voice)</label>
                          <input 
                            value={cloneName}
                            onChange={(e) => setCloneName(e.target.value)}
                            className="w-full bg-black/50 border border-slate-800 rounded-2xl p-4 text-sm font-bold focus:border-orange-500/50 outline-none transition-all shadow-inner"
                            placeholder="Enter Name..."
                          />
                       </div>
                    </div>
                  </div>
                )}
                
                <p className="text-[9px] text-slate-600 uppercase tracking-tighter leading-relaxed">
                  Pro-Tip: Use a 15-30s sample with zero background noise for spectral perfection.
                </p>
             </div>

             <div className="p-8 bg-black/40 flex gap-4">
                <button onClick={() => { setRecordedData(null); setShowCloneModal(false); }} className="flex-1 py-4 text-slate-500 font-black text-xs uppercase hover:text-white transition-colors tracking-widest">Discard</button>
                <button 
                  disabled={!recordedData || !cloneName || isGenerating}
                  onClick={finalizeClone}
                  className="flex-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:opacity-30 text-white py-4 px-10 rounded-2xl font-black text-xs uppercase transition-all shadow-2xl tracking-widest flex items-center justify-center gap-3"
                >
                  {isGenerating ? "Processing Spectral Data..." : "Finalize Clone"}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* TTS Modal */}
      {showTtsModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-2xl">
          <div className="bg-slate-900 border border-slate-700 rounded-[50px] w-full max-w-3xl overflow-hidden shadow-2xl">
             <div className="p-8 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-black flex items-center gap-4 italic tracking-tight uppercase">
                  <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg">{UI_ICONS.Type}</div>
                  Synthesize with {selectedVoice?.name}
                </h3>
                <button onClick={() => setShowTtsModal(false)} className="text-slate-500 hover:text-white text-2xl transition-colors">&times;</button>
             </div>
             
             <div className="p-10 grid grid-cols-1 md:grid-cols-5 gap-10">
                <div className="md:col-span-3 space-y-6">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Production Script</label>
                      <span className="text-[9px] text-slate-700 font-mono">{ttsText.length} Chars</span>
                   </div>
                   <textarea 
                     value={ttsText}
                     onChange={(e) => setTtsText(e.target.value)}
                     className="w-full h-64 bg-black/40 border border-slate-800 rounded-3xl p-8 text-sm font-medium focus:border-blue-500/50 outline-none transition-all placeholder:text-slate-800 shadow-inner resize-none"
                     placeholder="Type script here..."
                   />
                </div>

                <div className="md:col-span-2 space-y-8">
                   <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase block mb-3 px-1">Target Language</label>
                      <select 
                        value={ttsLang} 
                        onChange={(e) => setTtsLang(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-xs font-bold text-slate-200 outline-none appearance-none hover:border-blue-500/40 shadow-lg"
                      >
                         <option>English (US)</option>
                         <option>Spanish (ES)</option>
                         <option>French (FR)</option>
                         <option>German (DE)</option>
                         <option>Japanese (JP)</option>
                      </select>
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase block mb-3 px-1">Delivery Vibe</label>
                      <select 
                        value={ttsAccent} 
                        onChange={(e) => setTtsAccent(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-xs font-bold text-slate-200 outline-none appearance-none hover:border-blue-500/40 shadow-lg"
                      >
                         <option>Neutral Pro</option>
                         <option>Cinematic Narrator</option>
                         <option>Radio Host</option>
                         <option>Soft Whisper</option>
                         <option>Social Viral</option>
                      </select>
                   </div>
                </div>
             </div>

             <div className="p-10 bg-black/40 flex gap-6">
                <button onClick={() => setShowTtsModal(false)} className="px-8 py-4 text-slate-500 font-black text-xs uppercase hover:text-white transition-colors tracking-widest">Discard</button>
                <button 
                  onClick={handleTtsGenerate}
                  disabled={isGenerating || !ttsText}
                  className="flex-1 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white py-5 rounded-[25px] font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 disabled:opacity-20 shadow-[0_20px_40px_rgba(37,99,235,0.3)]"
                >
                  {isGenerating ? (
                    <div className="w-6 h-6 border-[3px] border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <> {UI_ICONS.Zap} SYNC MASTER STREAM </>
                  )}
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[70] flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-[450px] bg-slate-900 h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col border-l border-slate-800">
              <div className="p-8 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
                 <h2 className="text-xl font-black uppercase tracking-[0.2em] text-slate-200 italic">Studio Preferences</h2>
                 <button onClick={() => setShowSettings(false)} className="text-slate-500 hover:text-white bg-slate-800 p-2 rounded-xl">{UI_ICONS.Reset}</button>
              </div>
              <div className="flex-1 p-10 space-y-10 overflow-y-auto">
                 <div className="space-y-6">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 block">Output Rendering</label>
                    <div className="grid grid-cols-2 gap-4">
                       <button className="bg-blue-600 text-white p-5 rounded-3xl text-xs font-black uppercase shadow-xl shadow-blue-900/40 border border-blue-400/20">48kHz HQ</button>
                       <button className="bg-slate-800 text-slate-500 p-5 rounded-3xl text-xs font-black uppercase border border-slate-700">44.1kHz MP3</button>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Project BPM</label>
                       <span className="text-orange-500 font-mono font-bold">128.0</span>
                    </div>
                    <input type="range" min="60" max="200" defaultValue={128} className="w-full h-2 bg-slate-950 rounded-full appearance-none accent-orange-500" />
                 </div>
              </div>
              <div className="p-10 border-t border-slate-800 bg-slate-950/40">
                 <button onClick={() => setShowSettings(false)} className="w-full bg-slate-800 hover:bg-slate-700 py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-slate-700 shadow-lg">Save Configuration</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
