
import React, { useState } from 'react';
import { UI_ICONS, BUILT_IN_VOICES, SFX_LIBRARY, BEAT_LIBRARY } from '../constants';

interface SidebarProps {
  onAddTrack: (type: any, asset: any) => void;
  onStartClone: () => void;
  voices: any[];
}

const Sidebar: React.FC<SidebarProps> = ({ onAddTrack, onStartClone, voices }) => {
  const [activeTab, setActiveTab] = useState<'voices' | 'sfx' | 'music' | 'beats'>('voices');

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-700 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700">
        <h2 className="text-xl font-bold flex items-center gap-2 text-orange-400">
          {UI_ICONS.Waves} Studio Assets
        </h2>
      </div>

      <div className="flex bg-slate-800 p-1 m-4 rounded-lg overflow-x-auto">
        {(['voices', 'sfx', 'music', 'beats'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 px-3 text-[10px] font-bold uppercase rounded-md transition-all whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {activeTab === 'voices' && (
          <>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
              <span>Cloned Profiles</span>
              <span className="text-blue-500 animate-pulse">Live</span>
            </div>
            {voices.length === 0 && <div className="text-xs text-slate-600 italic px-2">No clones created.</div>}
            {voices.map(v => (
              <div key={v.id} className="group bg-slate-800/50 p-3 rounded-lg border border-slate-700 hover:border-orange-500 cursor-pointer flex justify-between items-center transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400">
                    {UI_ICONS.Mic}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{v.name}</div>
                    <div className="text-[9px] text-slate-400 uppercase">{v.language} • {v.accent}</div>
                  </div>
                </div>
                <button 
                  onClick={() => onAddTrack('VOICE', v)}
                  className="hidden group-hover:flex bg-orange-500 p-1.5 rounded-full text-white"
                >
                  {UI_ICONS.Plus}
                </button>
              </div>
            ))}
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-6 mb-2">Pro Library</div>
            {BUILT_IN_VOICES.map(v => (
              <div key={v.id} className="group bg-slate-800/50 p-3 rounded-lg border border-slate-700 hover:border-blue-500 cursor-pointer flex justify-between items-center transition-colors">
                <div>
                  <div className="text-sm font-medium">{v.name}</div>
                  <div className="text-[9px] text-slate-400 uppercase">{v.mood} • {v.accent}</div>
                </div>
                <button 
                  onClick={() => onAddTrack('VOICE', v)}
                  className="hidden group-hover:flex bg-blue-500 p-1.5 rounded-full text-white"
                >
                  {UI_ICONS.Plus}
                </button>
              </div>
            ))}
          </>
        )}

        {activeTab === 'sfx' && (
          <>
            {SFX_LIBRARY.map(sfx => (
              <div key={sfx.id} className="group bg-slate-800/50 p-3 rounded-lg border border-slate-700 hover:border-blue-500 cursor-pointer flex justify-between items-center transition-colors">
                <div>
                  <div className="text-sm font-medium">{sfx.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase">{sfx.category}</div>
                </div>
                <button 
                  onClick={() => onAddTrack('SFX', sfx)}
                  className="hidden group-hover:flex bg-blue-500 p-1.5 rounded-full text-white"
                >
                  {UI_ICONS.Plus}
                </button>
              </div>
            ))}
          </>
        )}

        {activeTab === 'beats' && (
          <>
            {BEAT_LIBRARY.map(beat => (
              <div key={beat.id} className="group bg-slate-800/50 p-3 rounded-lg border border-slate-700 hover:border-orange-500 cursor-pointer flex justify-between items-center transition-colors">
                <div className="flex items-center gap-3">
                   <div className="text-orange-500/50">{UI_ICONS.Disc}</div>
                   <div>
                     <div className="text-sm font-medium">{beat.name}</div>
                     <div className="text-[10px] text-slate-400">{beat.bpm} BPM</div>
                   </div>
                </div>
                <button 
                  onClick={() => onAddTrack('BEAT', beat)}
                  className="hidden group-hover:flex bg-orange-500 p-1.5 rounded-full text-white"
                >
                  {UI_ICONS.Plus}
                </button>
              </div>
            ))}
          </>
        )}

        {activeTab === 'music' && (
          <div className="space-y-3">
             <div className="p-8 border-2 border-dashed border-slate-700 rounded-xl text-center hover:border-blue-500 transition-colors cursor-pointer group">
                <div className="text-slate-500 mb-2 group-hover:text-blue-400 transition-colors">{UI_ICONS.Music}</div>
                <div className="text-xs text-slate-400 group-hover:text-slate-200">Import Audio File</div>
             </div>
             <div className="text-[10px] text-slate-500 text-center uppercase tracking-tighter">MP3 / WAV / AAC / FLAC</div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-900">
        <button 
          onClick={onStartClone}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all border border-blue-400/20 shadow-lg shadow-blue-900/40"
        >
          {UI_ICONS.Mic} Start Voice Cloning
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
