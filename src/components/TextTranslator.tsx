import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  Volume2, 
  Copy, 
  Check, 
  Star, 
  Sparkles, 
  WifiOff, 
  Info, 
  Share2, 
  Mic, 
  MicOff,
  Zap,
  BookOpen
} from 'lucide-react';
import { LANGUAGES, getLanguageName } from '../data/languages';
import { AppSettings, RegisterTone, TranslationResult } from '../types';
import { searchOfflineDictionary } from '../data/offlineDictionary';

interface TextTranslatorProps {
  settings: AppSettings;
  onSaveHistory: (result: TranslationResult) => void;
}

export const TextTranslator: React.FC<TextTranslatorProps> = ({ settings, onSaveHistory }) => {
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [inputText, setInputText] = useState('');
  const [tone, setTone] = useState<RegisterTone>('casual');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Quick sample prompts
  const quickSamples = [
    { label: 'Indonesian Slang', text: 'Jujurly ini gimmick banget sih, tapi tetep gercep mabar bareng temen.' },
    { label: 'Sundanese', text: 'Kumaha damang teteh? Wilujeng sumping ka Bandung.' },
    { label: 'Javanese', text: 'Sugeng enjing, piye kabare? Oja lali mangan ya.' },
    { label: 'Minang', text: 'Baa kaba? Nasi padang di siko sabana lamak pulo.' },
    { label: 'English Business', text: 'We need to streamline the workflow and ensure seamless offline synchronization.' },
  ];

  const handleSwap = () => {
    if (sourceLang === 'auto') {
      setSourceLang(targetLang);
      setTargetLang('id');
    } else {
      const temp = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(temp);
    }
  };

  const handleTranslate = async (textToTranslate?: string) => {
    const text = textToTranslate || inputText;
    if (!text.trim()) return;

    setLoading(true);
    setCopied(false);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLang,
          targetLang,
          tone,
          isOffline: settings.offlineMode,
        }),
      });

      const data = await response.json();
      
      const resObj: TranslationResult = {
        id: 'tr-' + Date.now(),
        sourceText: text,
        translatedText: data.translatedText || text,
        sourceLang: data.sourceLang || sourceLang,
        targetLang: data.targetLang || targetLang,
        tone: data.tone || tone,
        transliteration: data.transliteration,
        contextExplanation: data.contextExplanation,
        slangNuances: data.slangNuances || [],
        synonyms: data.synonyms || [],
        timestamp: Date.now(),
        isOffline: data.isOffline || settings.offlineMode,
        isFavorite: false,
      };

      setResult(resObj);
      onSaveHistory(resObj);
    } catch (err) {
      console.error('Translation server error, falling back to local engine:', err);
      const offlineMatch = searchOfflineDictionary(text, sourceLang, targetLang);
      const fallbackResult: TranslationResult = {
        id: 'tr-' + Date.now(),
        sourceText: text,
        translatedText: offlineMatch?.translation || `[Terjemahan Offline] ${text}`,
        sourceLang,
        targetLang,
        tone,
        transliteration: offlineMatch?.transliteration || '',
        contextExplanation: offlineMatch?.notes || 'Mode Offline Lokal (Server Backend Tidak Terjangkau)',
        slangNuances: ['Processed via client-side offline dictionary'],
        synonyms: [],
        timestamp: Date.now(),
        isOffline: true,
        isFavorite: false,
      };
      setResult(fallbackResult);
      onSaveHistory(fallbackResult);
    } finally {
      setLoading(false);
    }
  };

  // Web Speech API for voice input
  const handleStartListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Fitur Speech Recognition tidak didukung di browser ini. Gunakan Chrome/Edge.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = sourceLang === 'auto' ? 'id-ID' : sourceLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleTranslate(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSpeak = (text: string, langCode: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode === 'auto' ? 'id-ID' : langCode;
    utterance.rate = settings.speechRate || 1.0;
    utterance.pitch = settings.speechPitch || 1.0;
    
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLight = settings.themeMode === 'light';

  return (
    <div className="space-y-4">
      {/* Language Selector Bar */}
      <div className={`border rounded-2xl p-3 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-2 transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-neutral-900 border-neutral-800 text-white'
      }`}>
        {/* Source Language */}
        <div className="flex-1">
          <label className={`text-[10px] uppercase font-bold tracking-wider block mb-1 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
            Bahasa Asal
          </label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className={`w-full border rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition cursor-pointer ${
              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-800 border-neutral-700 text-white'
            }`}
          >
            <option value="auto">✨ Otomatis Deteksi Language</option>
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name} {lang.isLocal ? `(${lang.region})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className={`self-center p-2.5 rounded-xl border transition hover:scale-105 active:scale-95 ${
            isLight ? 'bg-slate-100 hover:bg-slate-200 text-indigo-600 border-slate-300' : 'bg-neutral-800 hover:bg-neutral-700 text-indigo-400 border-neutral-700'
          }`}
          title="Tukar Bahasa"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>

        {/* Target Language */}
        <div className="flex-1">
          <label className={`text-[10px] uppercase font-bold tracking-wider block mb-1 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
            Bahasa Tujuan
          </label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className={`w-full border rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none transition cursor-pointer ${
              isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-800 border-neutral-700 text-white'
            }`}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name} {lang.isLocal ? `(${lang.region})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Register Tone Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className={`text-xs font-medium shrink-0 mr-1 flex items-center gap-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
          <Zap className="w-3.5 h-3.5 text-amber-500" /> Tone:
        </span>
        {[
          { id: 'casual', label: 'Santai & Slang' },
          { id: 'formal', label: 'Formal / Resmi' },
          { id: 'business', label: 'Bisnis / Korporat' },
          { id: 'slang', label: 'Kental Gaul/Daerah' },
          { id: 'poetic', label: 'Puitis / Sastra' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTone(t.id as RegisterTone)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition shrink-0 ${
              tone === t.id
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : isLight ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Input Box */}
      <div className={`border rounded-2xl p-4 shadow-xl space-y-3 transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
      }`}>
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tulis atau tempel teks di sini (contoh slang, bahasa daerah, atau kalimat rumit)..."
            rows={4}
            className={`w-full rounded-xl p-3.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none border ${
              isLight
                ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400'
                : 'bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-500'
            }`}
          />

          {/* Input Action Controls */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              {/* Mic Speech Button */}
              <button
                onClick={handleStartListening}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : isLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-indigo-500" />}
                <span>{isListening ? 'Mendengarkan...' : 'Suara'}</span>
              </button>

              {inputText && (
                <button
                  onClick={() => handleSpeak(inputText, sourceLang)}
                  className={`p-2 rounded-xl transition ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                  }`}
                  title="Dengarkan Suara Asal"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className={`text-xs transition px-2 py-1 ${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  Hapus
                </button>
              )}

              <button
                onClick={() => handleTranslate()}
                disabled={loading || !inputText.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Menerjemahkan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Terjemahkan Instan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Samples */}
        <div className={`pt-2 border-t ${isLight ? 'border-slate-200' : 'border-neutral-800/60'}`}>
          <span className={`text-[11px] font-bold block mb-1.5 ${isLight ? 'text-slate-700' : 'text-neutral-400'}`}>
            Coba Contoh Kalimat Slang & Daerah:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickSamples.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(sample.text);
                  handleTranslate(sample.text);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300 font-medium'
                    : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border-neutral-700/60'
                }`}
              >
                <span className="text-indigo-700 dark:text-indigo-400 font-bold mr-1">[{sample.label}]</span>
                <span>{sample.text.substring(0, 32)}...</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Translation Result Output */}
      {result && (
        <div className={`border rounded-2xl p-4.5 shadow-2xl space-y-3.5 animate-fadeIn transition-colors ${
          isLight
            ? 'bg-white border-slate-300 text-slate-900'
            : 'bg-gradient-to-b from-neutral-900 to-neutral-900/90 border-neutral-800 text-white'
        }`}>
          <div className={`flex items-center justify-between border-b pb-2.5 ${isLight ? 'border-slate-200' : 'border-neutral-800/80'}`}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                {getLanguageName(result.targetLang)}
              </span>
              {result.isOffline ? (
                <span className="text-[10px] bg-amber-100 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1 font-bold">
                  <WifiOff className="w-3 h-3 text-amber-700" /> Offline 0ms
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 font-bold">
                  <Sparkles className="w-3 h-3 text-emerald-700" /> Gemini AI High Accuracy
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSpeak(result.translatedText, result.targetLang)}
                className={`p-2 rounded-xl transition ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                }`}
                title="Dengarkan Pengucapan"
              >
                <Volume2 className="w-4 h-4 text-indigo-500" />
              </button>

              <button
                onClick={() => handleCopy(result.translatedText)}
                className={`p-2 rounded-xl transition ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                }`}
                title="Salin Teks"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Main Translated Text */}
          <div className={`border rounded-xl p-4 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950/80 border-neutral-800'
          }`}>
            <p className="text-base md:text-lg font-medium leading-relaxed select-all">
              {result.translatedText}
            </p>

            {/* Transliteration Phonetic Guide */}
            {result.transliteration && (
              <p className={`text-xs italic mt-2 border-t pt-1.5 flex items-center gap-1 ${
                isLight ? 'text-indigo-700 border-slate-200' : 'text-indigo-300/80 border-neutral-800/60'
              }`}>
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>Cara baca / Fonetik: {result.transliteration}</span>
              </p>
            )}
          </div>

          {/* Slang / Context Explanation Card */}
          {result.contextExplanation && (
            <div className={`border rounded-xl p-3 flex gap-2.5 items-start ${
              isLight ? 'bg-indigo-50/70 border-indigo-200' : 'bg-neutral-950/40 border-neutral-800/80'
            }`}>
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className={`text-xs font-bold ${isLight ? 'text-indigo-900' : 'text-neutral-300'}`}>Penjelasan Konteks & Slang Nuansa:</h4>
                <p className={`text-xs leading-normal ${isLight ? 'text-slate-700' : 'text-neutral-400'}`}>{result.contextExplanation}</p>
                {result.slangNuances && result.slangNuances.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {result.slangNuances.map((nuance, idx) => (
                      <span key={idx} className="text-[10px] bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-md border border-purple-500/20 font-medium">
                        {nuance}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Synonyms / Alternative Translations */}
          {result.synonyms && result.synonyms.length > 0 && (
            <div className="pt-1">
              <span className={`text-[11px] font-semibold block mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                Opsi Terjemahan Alternatif:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.synonyms.map((syn, idx) => (
                  <span key={idx} className={`text-xs px-2.5 py-1 rounded-lg border ${
                    isLight ? 'bg-slate-100 text-slate-800 border-slate-300' : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                  }`}>
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
