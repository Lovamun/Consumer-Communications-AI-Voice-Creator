
import React, { useState } from 'react';
import { Track } from '../types';
import { UI_ICONS, COLORS } from '../constants';

interface MixerProps {
  tracks: Track[];
  onUpdateTrack: (id: string, updates: Partial<Track>) => void;
}

const Mixer: React.FC<MixerProps> = ({ tracks, onUpdateTrack }) => {
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>(null);
  const [crossfade, setCrossfade] = useState(0.5); // 0 = Left (A), 1 = Right (B)

  return (
    <div className="h-80 bg-slate-900 border-t border-slate-800 flex p-4 overflow-x-auto gap-4 custom-scrollbar">
      
      {/* Dual Turntable Section */}
      <div className="flex gap-4 items-stretch shrink-0">
        {/* Deck A */}
        <div className="flex flex-col items-center bg-slate-800/80 rounded-2xl p-4 border-2 border-blue-500/30 w-40 shadow-2xl relative">
          <div className="text-[9px] font-black text-blue-400 mb-3 uppercase tracking-widest">Deck A</div>
          <div className="w-20 h-20 rounded-full bg-black border-[6px] border-slate-700 flex items-center justify-center animate-[spin_4s_linear_infinite] shadow-xl">
            <div className="w-6 h-6 rounded-full bg-blue-500 shadow-[0_0_15px_blue]"></div>
          </div>
          <div className="mt-4 flex gap-2 w-full">
            <div className="flex-1 h-12 bg-black/40 rounded-lg flex flex-col items-center justify-center">
              <span className="text-[7px] text-slate-500 font-bold uppercase">Pitch</span>
              <span className="text-[10px] text-blue-400 font-mono">0.0%</span>
            </div>
          </div>
        </div>

        {/* Master Crossfader Column */}
        <div className="flex flex-col items-center justify-center w-24 gap-4 px-2 bg-slate-950/40 rounded-2xl border border-slate-800">
          <div className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Master Fader</div>
          <div className="h-24 w-4 bg-slate-900 rounded-full relative overflow-hidden">
            <div className="absolute bottom-0 w-full bg-orange-500 h-[80%]"></div>
          </div>
          <div className="w-full space-y-2">
            <div className="flex justify-between text-[7px] text-slate-600 font-bold uppercase">
              <span>A</span>
              <span>B</span>
            </div>
            <input 
              type="range"
              min="0" max="1" step="0.01"
              value={crossfade}
              onChange={(e) => setCrossfade(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-full appearance-none accent-orange-500"
            />
          </div>
        </div>

        {/* Deck B */}
        <div className="flex flex-col items-center bg-slate-800/80 rounded-2xl p-4 border-2 border-orange-500/30 w-40 shadow-2xl relative">
          <div className="text-[9px] font-black text-orange-400 mb-3 uppercase tracking-widest">Deck B</div>
          <div className="w-20 h-20 rounded-full bg-black border-[6px] border-slate-700 flex items-center justify-center animate-[spin_3s_linear_infinite] shadow-xl">
            <div className="w-6 h-6 rounded-full bg-orange-500 shadow-[0_0_15px_orange]"></div>
          </div>
          <div className="mt-4 flex gap-2 w-full">
            <div className="flex-1 h-12 bg-black/40 rounded-lg flex flex-col items-center justify-center">
              <span className="text-[7px] text-slate-500 font-bold uppercase">Pitch</span>
              <span className="text-[10px] text-orange-400 font-mono">+1.2%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-r border-slate-800 my-4 mx-2"></div>

      {/* Track Strips */}
      <div className="flex gap-4">
        {tracks.map(track => (
          <div key={track.id} className={`flex flex-col bg-slate-800/30 rounded-2xl border border-slate-800 transition-all ${expandedTrackId === track.id ? 'w-72' : 'w-28'} shrink-0 overflow-hidden shadow-xl`}>
            {/* Track Header */}
            <div 
              className={`p-2 border-b border-slate-700 flex justify-between items-center cursor-pointer transition-colors ${expandedTrackId === track.id ? 'bg-slate-700/40' : 'hover:bg-slate-700/20'}`}
              onClick={() => setExpandedTrackId(expandedTrackId === track.id ? null : track.id)}
            >
               <div className="flex items-center gap-2">
                 <div className={`w-1.5 h-6 rounded-full ${track.type === 'VOICE' ? 'bg-blue-500 shadow-[0_0_8px_blue]' : 'bg-orange-500 shadow-[0_0_8px_orange]'}`}></div>
                 <span className="text-[10px] font-black text-slate-200 uppercase truncate max-w-[80px]">{track.name}</span>
               </div>
               <div className="text-slate-500">{expandedTrackId === track.id ? UI_ICONS.Sliders : UI_ICONS.Plus}</div>
            </div>

            <div className="flex-1 flex gap-4 p-4">
               {/* Fader */}
               <div className="flex flex-col items-center gap-2 w-10">
                  <div className="h-36 w-3 bg-black/60 rounded-xl relative overflow-hidden border border-slate-800">
                     <input 
                       type="range"
                       min="0" max="1" step="0.01"
                       value={track.volume}
                       onChange={(e) => onUpdateTrack(track.id, { volume: parseFloat(e.target.value) })}
                       className="absolute inset-0 opacity-0 cursor-pointer h-full w-full vertical-range"
                       style={{ WebkitAppearance: 'slider-vertical' } as any}
                     />
                     <div 
                        className={`absolute bottom-0 w-full rounded-t-lg transition-all pointer-events-none ${track.type === 'VOICE' ? 'bg-blue-600 shadow-[0_-5px_15px_blue]' : 'bg-orange-600 shadow-[0_-5px_15px_orange]'}`} 
                        style={{ height: `${track.volume * 100}%` }}
                     ></div>
                  </div>
                  <div className="text-[7px] font-black text-slate-500 uppercase">VOL</div>
               </div>

               {expandedTrackId === track.id && (
                 <div className="flex-1 grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="space-y-4">
                       <div className="text-[8px] font-black text-slate-400 uppercase flex items-center gap-2 bg-black/40 p-1.5 rounded-lg border border-slate-700">
                          {UI_ICONS.EQ} EQ STACK
                       </div>
                       {(['high', 'mid', 'low'] as const).map(band => (
                         <div key={band} className="space-y-1">
                            <div className="flex justify-between text-[7px] text-slate-500 font-bold uppercase">
                               <span>{band}</span>
                               <span className={track.eq[band] > 0 ? 'text-blue-400' : 'text-slate-600'}>{track.eq[band]}</span>
                            </div>
                            <input 
                              type="range"
                              min="-12" max="12" step="0.5"
                              value={track.eq[band]}
                              onChange={(e) => onUpdateTrack(track.id, { eq: { ...track.eq, [band]: parseFloat(e.target.value) } })}
                              className="w-full h-1 bg-slate-900 rounded-full appearance-none accent-blue-500"
                            />
                         </div>
                       ))}
                    </div>

                    <div className="space-y-4">
                       <div className="text-[8px] font-black text-slate-400 uppercase flex items-center gap-2 bg-black/40 p-1.5 rounded-lg border border-slate-700">
                          {UI_ICONS.Zap} TOOLS
                       </div>
                       <div className="space-y-4">
                          <div className="space-y-1">
                             <div className="flex justify-between text-[7px] text-slate-500 font-bold uppercase">
                                <span>Pitch</span>
                             </div>
                             <input 
                                type="range"
                                min="0.5" max="2.0" step="0.1"
                                value={track.pitch}
                                onChange={(e) => onUpdateTrack(track.id, { pitch: parseFloat(e.target.value) })}
                                className="w-full h-1 bg-slate-900 rounded-full appearance-none accent-orange-500"
                             />
                          </div>
                          <div className="flex gap-2">
                             <button className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-[7px] font-bold text-slate-500 hover:text-white uppercase transition-colors">Clean</button>
                             <button className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-[7px] font-bold text-slate-500 hover:text-white uppercase transition-colors">Boost</button>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>

            <div className="p-3 bg-black/40 border-t border-slate-800 flex gap-1">
               <button 
                 onClick={() => onUpdateTrack(track.id, { muted: !track.muted })}
                 className={`flex-1 py-1.5 rounded text-[8px] font-black uppercase transition-all border ${track.muted ? 'bg-red-500/20 text-red-500 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
               >
                 MUTE
               </button>
               <button 
                 onClick={() => onUpdateTrack(track.id, { solo: !track.solo })}
                 className={`flex-1 py-1.5 rounded text-[8px] font-black uppercase transition-all border ${track.solo ? 'bg-blue-500/20 text-blue-500 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
               >
                 SOLO
               </button>
            </div>
          </div>
        ))}
      </div>

      {tracks.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-700 bg-slate-800/5 rounded-3xl border-2 border-dashed border-slate-800/40">
           <div className="p-4 bg-slate-900 rounded-full mb-3 text-slate-800">
              {UI_ICONS.Disc}
           </div>
           <p className="text-[9px] uppercase tracking-widest font-black text-slate-700">Production Deck Ready</p>
        </div>
      )}
    </div>
  );
};

export default Mixer;
