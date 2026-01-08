
import React, { useRef, useEffect } from 'react';
import { Track } from '../types';
import { UI_ICONS } from '../constants';

interface TimelineProps {
  tracks: Track[];
  currentTime: number;
  duration: number;
  onTimeChange: (time: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ tracks, currentTime, duration, onTimeChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const pixelsPerSecond = 50;
  const totalWidth = Math.max(duration * pixelsPerSecond, 1000);

  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + containerRef.current.scrollLeft;
    const newTime = x / pixelsPerSecond;
    onTimeChange(Math.min(newTime, duration));
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-hidden flex flex-col relative">
      {/* Time Header */}
      <div className="h-8 bg-slate-900 border-b border-slate-800 flex sticky top-0 z-10">
        <div className="w-48 border-r border-slate-700 flex items-center px-4 bg-slate-900">
           <span className="text-[10px] text-slate-500 font-mono">00:00:00</span>
        </div>
        <div 
          ref={containerRef}
          onClick={handleTimelineClick}
          className="flex-1 overflow-x-auto overflow-y-hidden cursor-crosshair relative"
        >
          <div style={{ width: totalWidth }} className="h-full relative">
             {/* Ruler Ticks */}
             {Array.from({ length: Math.ceil(duration) + 1 }).map((_, i) => (
               <div key={i} className="absolute bottom-0 border-l border-slate-800 h-3" style={{ left: i * pixelsPerSecond }}>
                  {i % 5 === 0 && <span className="absolute bottom-4 left-1 text-[8px] text-slate-600">{i}s</span>}
               </div>
             ))}
             {/* Playhead */}
             <div 
               className="absolute top-0 bottom-0 w-px bg-orange-500 z-20 pointer-events-none"
               style={{ left: currentTime * pixelsPerSecond }}
             >
                <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-orange-500 rotate-45"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Tracks Area */}
      <div className="flex-1 overflow-y-auto">
        {tracks.map(track => (
          <div key={track.id} className="h-24 flex border-b border-slate-800/50 hover:bg-white/5 transition-colors">
            {/* Track Info */}
            <div className="w-48 border-r border-slate-700 p-3 bg-slate-900/50 flex flex-col justify-between shrink-0">
               <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300 truncate">{track.name}</span>
                  <div className={`w-2 h-2 rounded-full ${track.type === 'VOICE' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
               </div>
               <div className="flex gap-2">
                  <button className="text-slate-500 hover:text-white transition-colors">{UI_ICONS.Volume}</button>
                  <button className="text-slate-500 hover:text-white transition-colors">{UI_ICONS.Sliders}</button>
                  <button className="text-slate-500 hover:text-red-500 transition-colors">{UI_ICONS.Trash}</button>
               </div>
            </div>

            {/* Track Content */}
            <div className="flex-1 overflow-x-hidden relative bg-slate-950/30">
               <div style={{ width: totalWidth }} className="h-full relative">
                  {track.regions.map(region => (
                    <div 
                      key={region.id}
                      className={`absolute top-2 bottom-2 rounded-md border-2 p-2 overflow-hidden flex flex-col justify-center cursor-move transition-shadow hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]
                        ${track.type === 'VOICE' ? 'bg-blue-900/40 border-blue-500/50' : 'bg-orange-900/40 border-orange-500/50'}`}
                      style={{ 
                        left: region.startTime * pixelsPerSecond, 
                        width: region.duration * pixelsPerSecond 
                      }}
                    >
                      <span className="text-[10px] font-bold text-white truncate">{region.name}</span>
                      {/* Simple Waveform Visualizer simulation */}
                      <div className="mt-1 h-8 flex items-center gap-0.5">
                        {Array.from({ length: 20 }).map((_, i) => (
                           <div 
                             key={i} 
                             className={`w-0.5 rounded-full ${track.type === 'VOICE' ? 'bg-blue-400/60' : 'bg-orange-400/60'}`}
                             style={{ height: `${Math.random() * 100}%` }}
                           ></div>
                        ))}
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        ))}
        {tracks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-700 h-64">
             <div className="p-4 bg-slate-900 rounded-full mb-4">
                {UI_ICONS.Waves}
             </div>
             <p className="text-sm">Drag assets here to build your timeline</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
