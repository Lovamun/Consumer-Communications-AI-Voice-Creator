
export class AudioEngine {
  private context: AudioContext;
  private masterGain: GainNode;
  private analyzer: AnalyserNode;
  private tracks: Map<string, { 
    gain: GainNode, 
    panner: StereoPannerNode,
    lowFilter: BiquadFilterNode,
    midFilter: BiquadFilterNode,
    highFilter: BiquadFilterNode
  }> = new Map();
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];

  constructor() {
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.context.createGain();
    this.analyzer = this.context.createAnalyser();
    
    this.masterGain.connect(this.analyzer);
    this.analyzer.connect(this.context.destination);
    
    this.masterGain.gain.value = 0.8;
  }

  public getContext() { return this.context; }
  public getAnalyzer() { return this.analyzer; }

  public createTrackNodes(trackId: string) {
    const gainNode = this.context.createGain();
    const pannerNode = this.context.createStereoPanner();
    
    // EQ Filters
    const lowFilter = this.context.createBiquadFilter();
    lowFilter.type = 'lowshelf';
    lowFilter.frequency.value = 320;

    const midFilter = this.context.createBiquadFilter();
    midFilter.type = 'peaking';
    midFilter.frequency.value = 1000;
    midFilter.Q.value = 1;

    const highFilter = this.context.createBiquadFilter();
    highFilter.type = 'highshelf';
    highFilter.frequency.value = 3200;

    // Chain: Source -> Low -> Mid -> High -> Pan -> Gain -> Master
    lowFilter.connect(midFilter);
    midFilter.connect(highFilter);
    highFilter.connect(pannerNode);
    pannerNode.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    this.tracks.set(trackId, { gain: gainNode, panner: pannerNode, lowFilter, midFilter, highFilter });
    return { gainNode, pannerNode, lowFilter, midFilter, highFilter };
  }

  public updateEq(trackId: string, range: 'low' | 'mid' | 'high', value: number) {
    const nodes = this.tracks.get(trackId);
    if (!nodes) return;
    const filter = range === 'low' ? nodes.lowFilter : range === 'mid' ? nodes.midFilter : nodes.highFilter;
    filter.gain.setTargetAtTime(value, this.context.currentTime, 0.1);
  }

  public setTrackVolume(trackId: string, volume: number) {
    const nodes = this.tracks.get(trackId);
    if (nodes) nodes.gain.gain.setTargetAtTime(volume, this.context.currentTime, 0.1);
  }

  public setTrackPan(trackId: string, pan: number) {
    const nodes = this.tracks.get(trackId);
    if (nodes) nodes.panner.pan.setTargetAtTime(pan, this.context.currentTime, 0.1);
  }

  public async startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.recorder = new MediaRecorder(stream);
    this.chunks = [];
    this.recorder.ondataavailable = (e) => this.chunks.push(e.data);
    this.recorder.start();
  }

  public async stopRecording(): Promise<string> {
    return new Promise((resolve) => {
      if (!this.recorder) return resolve("");
      this.recorder.onstop = async () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      };
      this.recorder.stop();
      this.recorder.stream.getTracks().forEach(t => t.stop());
    });
  }

  public async decodeAudio(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
    return await this.context.decodeAudioData(arrayBuffer);
  }
}

export const audioEngine = new AudioEngine();
