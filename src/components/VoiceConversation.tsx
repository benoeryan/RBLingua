import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  RotateCcw, 
  Sparkles, 
  ArrowRightLeft,
  Activity,
  UserCheck,
  PhoneCall,
  Video
} from 'lucide-react';
import { LANGUAGES, getLanguageName } from '../data/languages';
import { AppSettings } from '../types';

interface VoiceConversationProps {
  settings: AppSettings;
}

export interface VoiceMessageLog {
  id: string;
  speaker: 'Person A' | 'Person B';
  langCode: string;
  originalText: string;
  translatedText: string;
  timestamp: string;
}

export const VoiceConversation: React.FC<VoiceConversationProps> = ({ settings }) => {
  const [langA, setLangA] = useState('id'); // Default Bahasa Indonesia
  const [langB, setLangB] = useState('en'); // Default Target Language e.g. English
  
  const [activeMic, setActiveMic] = useState<'A' | 'B' | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlayTTS, setAutoPlayTTS] = useState(true);
  const [callMode, setCallMode] = useState<'normal' | 'phone_call' | 'online_meeting'>('online_meeting');

  const [logs, setLogs] = useState<VoiceMessageLog[]>([
    {
      id: 'v1',
      speaker: 'Person A',
      langCode: 'id',
      originalText: 'Halo pak, saya ingin mengonfirmasi jadwal meeting proyek terjemahan RBLingua.',
      translatedText: 'Hello sir, I would like to confirm the meeting schedule for the RBLingua translation project.',
      timestamp: '10:30 AM',
    },
    {
      id: 'v2',
      speaker: 'Person B',
      langCode: 'en',
      originalText: 'Great! We are ready for the presentation. Everything is set on our end.',
      translatedText: 'Bagus! Kami siap untuk presentasi. Semuanya sudah siap di pihak kami.',
      timestamp: '10:31 AM',
    },
  ]);

  const [simulatedAudioHeight, setSimulatedAudioHeight] = useState([20, 40, 60, 30, 80, 50, 20]);

  // Animated visualizer effect when mic is listening
  useEffect(() => {
    let interval: any;
    if (activeMic) {
      interval = setInterval(() => {
        setSimulatedAudioHeight(
          Array.from({ length: 9 }, () => Math.floor(Math.random() * 70) + 15)
        );
      }, 150);
    } else {
      setSimulatedAudioHeight([15, 15, 15, 15, 15, 15, 15, 15, 15]);
    }
    return () => clearInterval(interval);
  }, [activeMic]);

  // Speech Recognition handler for Mic A or Mic B
  const startSpeechRecognition = (speakerKey: 'A' | 'B') => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Browser tidak mendukung Speech Recognition. Gunakan Google Chrome / Edge.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    const selectedLang = speakerKey === 'A' ? langA : langB;
    recognition.lang = selectedLang === 'auto' ? 'id-ID' : selectedLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setActiveMic(speakerKey);
    
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      const targetLangCode = speakerKey === 'A' ? langB : langA;
      
      // Translate voice transcript
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: transcript,
            sourceLang: selectedLang,
            targetLang: targetLangCode,
            tone: 'formal',
            isOffline: settings.offlineMode,
          }),
        });
        const data = await res.json();

        const newLog: VoiceMessageLog = {
          id: 'v-' + Date.now(),
          speaker: speakerKey === 'A' ? 'Person A' : 'Person B',
          langCode: selectedLang,
          originalText: transcript,
          translatedText: data.translatedText || transcript,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setLogs((prev) => [...prev, newLog]);

        // Auto play TTS response in target language so it gets voiced out
        if (autoPlayTTS) {
          speakText(data.translatedText || transcript, targetLangCode);
        }
      } catch (e) {
        console.error(e);
      }
    };

    recognition.onerror = () => setActiveMic(null);
    recognition.onend = () => setActiveMic(null);

    recognition.start();
  };

  const speakText = (text: string, langCode: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = settings.speechRate || 1.0;
    utterance.pitch = settings.speechPitch || 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const isLight = settings.themeMode === 'light';

  return (
    <div className="space-y-4">
      {/* Top Banner Config */}
      <div className={`border rounded-2xl p-4 shadow-xl space-y-3 transition-colors ${
        isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-neutral-900 border-neutral-800 text-white'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Live Transkrip & Translate Suara (Telepon & Online Meeting)
            </h2>
            <p className={`text-xs font-medium ${isLight ? 'text-slate-700' : 'text-neutral-400'}`}>
              Bicara Bahasa Indonesia → Otomatis Diterjemahkan & Disuarakan (TTS) langsung ke Bahasa Tujuan untuk lawan bicara di Zoom, Google Meet, WhatsApp, atau Panggilan Telepon.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setCallMode('online_meeting')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
                callMode === 'online_meeting'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : isLight ? 'bg-slate-100 text-slate-800 border-slate-300' : 'bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Meeting Online
            </button>

            <button
              onClick={() => setCallMode('phone_call')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
                callMode === 'phone_call'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : isLight ? 'bg-slate-100 text-slate-800 border-slate-300' : 'bg-neutral-800 text-neutral-300 border-neutral-700'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" /> Panggilan Telepon / WA
            </button>

            <button
              onClick={() => setAutoPlayTTS(!autoPlayTTS)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
                autoPlayTTS
                  ? 'bg-purple-600 text-white border-purple-500'
                  : isLight ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-neutral-800 text-neutral-400 border-neutral-700'
              }`}
              title="Putar Otomatis Audio Terjemahan ke Lawan Bicara"
            >
              <Volume2 className="w-3.5 h-3.5" /> {autoPlayTTS ? 'Audio TTS Aktif' : 'Mute TTS'}
            </button>
          </div>
        </div>

        {/* Language Selection Grid */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t ${
          isLight ? 'border-slate-200' : 'border-neutral-800'
        }`}>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-neutral-300'}`}>Anda Bicara:</span>
            <select
              value={langA}
              onChange={(e) => setLangA(e.target.value)}
              className={`text-xs font-bold rounded-xl px-3 py-1.5 border focus:outline-none ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
              }`}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <ArrowRightLeft className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-neutral-300'}`}>Diterjemahkan ke (Lawan Bicara):</span>
            <select
              value={langB}
              onChange={(e) => setLangB(e.target.value)}
              className={`text-xs font-bold rounded-xl px-3 py-1.5 border focus:outline-none ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
              }`}
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Audio Waveform Visualizer */}
      <div className={`border rounded-2xl p-4 flex items-center justify-center gap-1.5 h-20 shadow-inner ${
        isLight ? 'bg-slate-100 border-slate-300' : 'bg-neutral-950 border-neutral-800'
      }`}>
        {simulatedAudioHeight.map((h, idx) => (
          <div
            key={idx}
            style={{ height: `${h}%` }}
            className={`w-2.5 rounded-full transition-all duration-150 ${
              activeMic === 'A'
                ? 'bg-indigo-600'
                : activeMic === 'B'
                ? 'bg-pink-600'
                : isLight ? 'bg-slate-400' : 'bg-neutral-800'
            }`}
          />
        ))}
      </div>

      {/* Conversation Dialog Stream */}
      <div className={`border rounded-2xl p-4 shadow-xl space-y-3 min-h-[260px] max-h-[360px] overflow-y-auto transition-colors ${
        isLight ? 'bg-white border-slate-300' : 'bg-neutral-900 border-neutral-800'
      }`}>
        {logs.map((log) => (
          <div
            key={log.id}
            className={`flex flex-col ${log.speaker === 'Person A' ? 'items-start' : 'items-end'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs space-y-1.5 shadow-md ${
                log.speaker === 'Person A'
                  ? isLight
                    ? 'bg-indigo-50 border border-indigo-200 text-slate-900 rounded-tl-none font-medium'
                    : 'bg-indigo-950/80 border border-indigo-800/80 text-neutral-100 rounded-tl-none'
                  : isLight
                  ? 'bg-purple-50 border border-purple-200 text-slate-900 rounded-tr-none font-medium'
                  : 'bg-purple-950/80 border border-purple-800/80 text-neutral-100 rounded-tr-none'
              }`}
            >
              <div className={`flex items-center justify-between text-[11px] pb-1 border-b ${
                isLight ? 'border-slate-300 text-slate-700 font-bold' : 'border-white/10 opacity-80'
              }`}>
                <span className="font-bold">{log.speaker === 'Person A' ? 'Anda (Indonesia)' : 'Lawan Bicara'}</span>
                <span>{log.timestamp}</span>
              </div>

              <p className={`text-xs font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{log.originalText}</p>
              
              <div className={`pt-1.5 border-t flex items-center justify-between ${
                isLight ? 'border-slate-300' : 'border-white/10'
              }`}>
                <p className="font-bold text-emerald-700 dark:text-emerald-300 text-xs">✨ {log.translatedText}</p>
                <button
                  onClick={() => speakText(log.translatedText, log.speaker === 'Person A' ? langB : langA)}
                  className={`p-1.5 rounded-lg transition ml-2 shrink-0 ${
                    isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-900' : 'bg-black/40 hover:bg-black/60 text-white'
                  }`}
                  title="Putar Audio Terjemahan"
                >
                  <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DUAL MICROPHONE BUTTONS */}
      <div className="grid grid-cols-2 gap-3">
        {/* Mic Person A (Anda) */}
        <button
          onClick={() => startSpeechRecognition('A')}
          className={`py-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition shadow-xl ${
            activeMic === 'A'
              ? 'bg-indigo-600 text-white border-indigo-400 animate-pulse'
              : isLight
              ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border-indigo-300'
              : 'bg-neutral-900 hover:bg-neutral-800 text-indigo-300 border-indigo-500/40'
          }`}
        >
          <Mic className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <div className="text-center">
            <span className="text-xs font-bold block text-slate-900 dark:text-white">Anda Bicara ({getLanguageName(langA)})</span>
            <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-700' : 'text-neutral-400'}`}>Klik untuk Mulai Bicara</span>
          </div>
        </button>

        {/* Mic Person B (Lawan Bicara) */}
        <button
          onClick={() => startSpeechRecognition('B')}
          className={`py-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition shadow-xl ${
            activeMic === 'B'
              ? 'bg-pink-600 text-white border-pink-400 animate-pulse'
              : isLight
              ? 'bg-purple-50 hover:bg-purple-100 text-purple-950 border-purple-300'
              : 'bg-neutral-900 hover:bg-neutral-800 text-pink-300 border-pink-500/40'
          }`}
        >
          <Mic className="w-6 h-6 text-purple-600 dark:text-pink-400" />
          <div className="text-center">
            <span className="text-xs font-bold block text-slate-900 dark:text-white">Lawan Bicara ({getLanguageName(langB)})</span>
            <span className={`text-[11px] font-semibold ${isLight ? 'text-slate-700' : 'text-neutral-400'}`}>Klik untuk Mulai Bicara</span>
          </div>
        </button>
      </div>
    </div>
  );
};

