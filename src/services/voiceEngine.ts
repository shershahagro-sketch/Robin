// Speech Recognition & Speech Synthesis Voice Engine for ROBIN JARVIS
export class VoiceEngine {
  private recognition: any = null;
  private isListeningActive: boolean = false;
  private isSpeakingActive: boolean = false;
  private onTranscriptCallback: ((text: string, isFinal: boolean) => void) | null = null;
  private onListeningStatusCallback: ((listening: boolean) => void) | null = null;
  private onSpeakingStatusCallback: ((speaking: boolean) => void) | null = null;

  public wakeWord: string = 'robin';
  public wakeWordEnabled: boolean = true;
  public continuousMode: boolean = true;
  public voiceRate: number = 1.0;
  public voicePitch: number = 1.0;
  public voiceVolume: number = 1.0;
  public selectedVoiceName: string = '';
  public language: string = 'en-US';

  public setLanguage(lang: string) {
    this.language = lang;
    if (this.recognition) {
      // Browser SpeechRecognition: try skr-PK, if browser throws, fallback to ur-PK
      try {
        this.recognition.lang = lang;
      } catch {
        this.recognition.lang = lang === 'skr-PK' ? 'ur-PK' : lang;
      }
    }
  }

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = this.language;

        this.recognition.onstart = () => {
          this.isListeningActive = true;
          this.onListeningStatusCallback?.(true);
        };

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const rawText = (finalTranscript || interimTranscript).trim();
          if (!rawText) return;

          // Check wake word if enabled
          if (this.wakeWordEnabled) {
            const lower = rawText.toLowerCase();
            const wake = this.wakeWord.toLowerCase();
            if (lower.includes(wake)) {
              // Strip wake word prefix if applicable
              const cleaned = rawText.replace(new RegExp(`^(hey\\s+)?${wake}[,\\s]*`, 'i'), '').trim();
              this.onTranscriptCallback?.(cleaned || rawText, !!finalTranscript);
            } else {
              // Also pass interim if already recognized in current turn
              this.onTranscriptCallback?.(rawText, !!finalTranscript);
            }
          } else {
            this.onTranscriptCallback?.(rawText, !!finalTranscript);
          }
        };

        this.recognition.onerror = (event: any) => {
          console.warn('[ROBIN Voice] Recognition error:', event.error);
          if (event.error === 'not-allowed') {
            this.isListeningActive = false;
            this.onListeningStatusCallback?.(false);
          }
        };

        this.recognition.onend = () => {
          // If continuous listening is enabled and user hasn't explicitly stopped, restart
          if (this.isListeningActive && this.continuousMode) {
            try {
              this.recognition.start();
            } catch {
              this.isListeningActive = false;
              this.onListeningStatusCallback?.(false);
            }
          } else {
            this.isListeningActive = false;
            this.onListeningStatusCallback?.(false);
          }
        };
      } catch (err) {
        console.warn('[ROBIN Voice] Failed to setup SpeechRecognition:', err);
      }
    }
  }

  public setCallbacks(
    onTranscript: (text: string, isFinal: boolean) => void,
    onListening: (listening: boolean) => void,
    onSpeaking: (speaking: boolean) => void
  ) {
    this.onTranscriptCallback = onTranscript;
    this.onListeningStatusCallback = onListening;
    this.onSpeakingStatusCallback = onSpeaking;
  }

  public isRecognitionSupported(): boolean {
    return !!this.recognition;
  }

  public startListening(
    onTranscript?: (text: string, isFinal: boolean) => void,
    onWakeWord?: () => void,
    onError?: (error: any) => void
  ) {
    if (onTranscript) this.onTranscriptCallback = onTranscript;
    if (!this.recognition) {
      onError?.(new Error('SpeechRecognition not supported in this browser environment'));
      return;
    }
    try {
      this.isListeningActive = true;
      this.recognition.lang = this.language;
      this.recognition.start();
    } catch {
      // Already running
    }
  }

  public stopListening() {
    if (!this.recognition) return;
    this.isListeningActive = false;
    try {
      this.recognition.stop();
    } catch {}
    this.onListeningStatusCallback?.(false);
  }

  public toggleListening(): boolean {
    if (this.isListeningActive) {
      this.stopListening();
      return false;
    } else {
      this.startListening();
      return true;
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !window.speechSynthesis) return [];
    return window.speechSynthesis.getVoices();
  }

  public speak(
    text: string,
    personality?: string | (() => void),
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    let actualEnd = onEnd;
    if (typeof personality === 'function') {
      actualEnd = personality;
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      actualEnd?.();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    if (!text.trim()) {
      actualEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.voiceRate;
    utterance.pitch = this.voicePitch;
    utterance.volume = this.voiceVolume;
    utterance.lang = this.language;

    const voices = window.speechSynthesis.getVoices();
    if (this.selectedVoiceName) {
      const matched = voices.find((v) => v.name === this.selectedVoiceName);
      if (matched) utterance.voice = matched;
    } else {
      // Find voices matching the current target language (e.g. 'skr', 'hi', 'ur', 'en')
      const targetLangPrefix = (this.language || 'en').split('-')[0].toLowerCase();
      const languageSpecificVoice = voices.find((v) => {
        const vLang = (v.lang || '').toLowerCase();
        if (targetLangPrefix === 'skr') {
          return vLang.startsWith('skr') || vLang.startsWith('ur') || vLang.startsWith('pa');
        }
        return vLang.startsWith(targetLangPrefix);
      });

      if (languageSpecificVoice) {
        utterance.voice = languageSpecificVoice;
      } else {
        // Fallback to high quality natural voice
        const preferred = voices.find(
          (v) =>
            v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('David') ||
            v.name.includes('Zira') ||
            v.name.includes('Samantha') ||
            v.name.includes('Daniel')
        );
        if (preferred) utterance.voice = preferred;
      }
    }

    utterance.onstart = () => {
      this.isSpeakingActive = true;
      this.onSpeakingStatusCallback?.(true);
    };

    utterance.onend = () => {
      this.isSpeakingActive = false;
      this.onSpeakingStatusCallback?.(false);
      actualEnd?.();
    };

    utterance.onerror = (err) => {
      this.isSpeakingActive = false;
      this.onSpeakingStatusCallback?.(false);
      onError?.(err);
      actualEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.isSpeakingActive = false;
      this.onSpeakingStatusCallback?.(false);
    }
  }
}

export const voiceEngine = new VoiceEngine();
