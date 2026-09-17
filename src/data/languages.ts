import { LanguageOption, SupportedLanguage } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en-US',
    name: 'English',
    nativeName: 'English (US/UK)',
    flag: '🇺🇸',
    wakeWords: ['Robin', 'Jarvis', 'Nova', 'Computer'],
    sampleCommands: [
      { text: 'Open Chrome and search for AI news', translation: 'Launch web browser and perform search' },
      { text: 'What is my current CPU and RAM usage?', translation: 'Read real-time telemetry diagnostics' },
      { text: 'Create a new folder named Projects in Documents', translation: 'Create directory' },
      { text: 'Take a screenshot of the active window', translation: 'Capture screen buffer' },
      { text: 'Close spotify and mute system volume', translation: 'App termination and audio control' },
    ],
  },
  {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी (Hindi)',
    flag: '🇮🇳',
    wakeWords: ['Robin', 'Jarvis', 'रोबिन', 'जार्विस'],
    sampleCommands: [
      { text: 'Chrome खोलो और मौसम की जानकारी खोजो', translation: 'Open Chrome and search for weather' },
      { text: 'कंप्यूटर का CPU और RAM स्टेटस बताओ', translation: 'Tell me CPU and RAM status' },
      { text: 'Documents में Projects नाम का नया फोल्डर बनाओ', translation: 'Create folder Projects in Documents' },
      { text: 'स्क्रीनशॉट लो और सेव करो', translation: 'Take a screenshot and save' },
      { text: 'Spotify बंद करो और आवाज कम करो', translation: 'Close Spotify and lower volume' },
      { text: 'सिस्टम का हाल बताओ', translation: 'Check system health status' },
    ],
  },
  {
    code: 'ur-PK',
    name: 'Urdu',
    nativeName: 'اردو (Urdu)',
    flag: '🇵🇰',
    wakeWords: ['Robin', 'Jarvis', 'روبن', 'جاروس'],
    sampleCommands: [
      { text: 'کروم کھولیں اور تازہ ترین خبریں تلاش کریں', translation: 'Open Chrome and search latest news' },
      { text: 'میرے کمپیوٹر کا CPU اور ریم کا سٹیٹس بتائیں', translation: 'Tell me CPU and RAM status' },
      { text: 'Documents میں نیا فولڈر بنائیں', translation: 'Create a new folder in Documents' },
      { text: 'سکرین شاٹ لیں', translation: 'Take a screenshot' },
      { text: 'سپوٹیفائی بند کریں اور آواز دھیمی کریں', translation: 'Close Spotify and lower volume' },
      { text: 'سسٹم کی مکمل تفصیلات دکھائیں', translation: 'Show complete system details' },
    ],
  },
  {
    code: 'skr-PK',
    name: 'Saraiki',
    nativeName: 'سرائیکی (Saraiki)',
    flag: '🇵🇰',
    wakeWords: ['Robin', 'Jarvis', 'روبن', 'جاروس', 'سرائیکی'],
    sampleCommands: [
      { text: 'کروم کھولو تے تازہ خبراں گول کرو', translation: 'Open Chrome and search latest news' },
      { text: 'کمپیوٹر دا CPU تے ریم دا حال ڈیکھاؤ', translation: 'Show CPU and RAM status' },
      { text: 'Documents وچ نیا فولڈر بناؤ', translation: 'Create new folder in Documents' },
      { text: 'سکرین شاٹ گھنو تے محفوظ کرو', translation: 'Take screenshot and save' },
      { text: 'Spotify بند کرو تے اواز گھٹ کرو', translation: 'Close Spotify and reduce volume' },
      { text: 'سسٹم دی بیٹری تے ڈسک دی تفصیل ڈیکھاؤ', translation: 'Show system battery and disk details' },
    ],
  },
];

export const getLanguageConfig = (code: SupportedLanguage): LanguageOption => {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
};
