
import React, { useState } from 'react';
import { HELP_SECTIONS, UI_ICONS } from '../constants';

interface HelpBoxProps {
  onClose: () => void;
  onPlayAudio: (text: string) => void;
  onStopAudio: () => void;
  currentPlayingId: string | null;
}

const HelpBox: React.FC<HelpBoxProps> = ({ onClose, onPlayAudio, onStopAudio, currentPlayingId }) => {
  const [search, setSearch] = useState("");
  
  const filteredSections = HELP_SECTIONS.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed top-20 right-6 z-50 w-96 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col h-[600px] animate-in slide-in-from-right-8 duration-300">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-3xl">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-900/40">
            {UI_ICONS.Book}
          </div>
          <h3 className="text-lg font-black uppercase tracking-widest text-slate-100">Studio Help</h3>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors bg-slate-800 p-1.5 rounded-full">&times;</button>
      </div>

      <div className="p-4 border-b border-slate-800 bg-slate-950/50">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {UI_ICONS.Search}
          </div>
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search instructions..."
            className="w-full bg-black/40 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:border-blue-500/50 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {filteredSections.map(section => (
          <div key={section.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest">{section.title}</h4>
              <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
                {currentPlayingId === section.id ? (
                  <button onClick={onStopAudio} className="p-1 text-orange-400 hover:text-orange-300">
                    {UI_ICONS.Stop}
                  </button>
                ) : (
                  <button onClick={() => onPlayAudio(section.audioText)} className="p-1 text-blue-400 hover:text-blue-300">
                    {UI_ICONS.Play}
                  </button>
                )}
                <button onClick={onStopAudio} className="p-1 text-slate-600 hover:text-slate-400">
                  {UI_ICONS.Pause}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/30 p-4 rounded-2xl border border-slate-800 shadow-inner italic">
              {section.content}
            </p>
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div className="text-center py-12 text-slate-600">
             <div className="mb-2 opacity-20">{UI_ICONS.Search}</div>
             <p className="text-[10px] uppercase font-bold tracking-widest">No results found</p>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-800 bg-slate-950/40 rounded-b-3xl">
        <div className="text-[9px] font-black text-slate-600 uppercase tracking-tighter text-center">
          Pro-Tip: Listen to instructions while you build!
        </div>
      </div>
    </div>
  );
};

export default HelpBox;
