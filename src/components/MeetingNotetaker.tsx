import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Play, 
  Square, 
  Sparkles, 
  Users, 
  CheckSquare, 
  Copy, 
  Check, 
  Download, 
  Volume2, 
  MessageSquare,
  Clock,
  Plus,
  Video,
  Monitor,
  Mic,
  VolumeX,
  Maximize2,
  Minimize2,
  Sliders,
  X,
  ExternalLink,
  ShieldAlert,
  Layers,
  Radio
} from 'lucide-react';
import { LANGUAGES, getLanguageName } from '../data/languages';
import { AppSettings, MeetingSpeakerLog, MeetingSummary } from '../types';
import { executeTranslation, executeMeetingSummary } from '../services/aiService';

interface MeetingNotetakerProps {
  settings: AppSettings;
}

export const MeetingNotetaker: React.FC<MeetingNotetakerProps> = ({ settings }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Meeting Integration Selection
  const [selectedPlatform, setSelectedPlatform] = useState<'google_meet' | 'zoom' | 'teams' | 'webex' | 'discord' | 'universal'>('google_meet');
  const [audioSource, setAudioSource] = useState<'mic' | 'system' | 'dual'>('dual');
  const [targetTranslateLang, setTargetTranslateLang] = useState('en');

  // Floating Subtitle Overlay State
  const [showLiveSubtitleOverlay, setShowLiveSubtitleOverlay] = useState(false);
  const [subtitleFontSize, setSubtitleFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [subtitleOpacity, setSubtitleOpacity] = useState(0.9);
  const [latestSubtitle, setLatestSubtitle] = useState<{ speaker: string; original: string; translated: string } | null>({
    speaker: 'Siti Rahma (Klien)',
    original: 'Halo rekan-rekan, mohon konfirmasi untuk progres integrasi API terjemahan real-time.',
    translated: 'Hello colleagues, please confirm progress on the real-time translation API integration.',
  });

  // Default transcript logs
  const [logs, setLogs] = useState<MeetingSpeakerLog[]>([
    {
      id: 'm1',
      speaker: 'Budi (Manager)',
      timestamp: '14:00',
      originalText: 'Selamat siang tim, hari ini kita perlu menuntaskan fitur auto translate offline dan notulensi rapat otomatis.',
      translatedText: 'Good afternoon team, today we need to complete the offline auto translate feature and automated meeting minutes.',
    },
    {
      id: 'm2',
      speaker: 'Sari (Lead Dev)',
      timestamp: '14:02',
      originalText: 'Siap Pak, untuk model AI Gemini 3.6 Flash sudah terintegrasi server-side. Respon terjemahan untuk bahasa slang dan daerah sangat cepat.',
      translatedText: 'Understood Sir, Gemini 3.6 Flash AI model is integrated server-side. Translation response for slang and local dialects is very fast.',
    },
    {
      id: 'm3',
      speaker: 'Rian (Product Owner)',
      timestamp: '14:05',
      originalText: 'Pastikan juga floating overlay widget untuk WhatsApp berjalan mulus, plus enkripsi end-to-end agar kerahasiaan data pengguna terjaga.',
      translatedText: 'Also ensure the floating overlay widget for WhatsApp runs smoothly, plus end-to-end encryption to protect user data privacy.',
    },
    {
      id: 'm4',
      speaker: 'Budi (Manager)',
      timestamp: '14:08',
      originalText: 'Bagus. Tolong Sari siapkan pengujian mode offline, dan Rian selesaikan laporan eksekutif sebelum sore ini.',
      translatedText: 'Great. Sari please prepare offline mode testing, and Rian complete executive report before this afternoon.',
    },
  ]);

  const [newSpeaker, setNewSpeaker] = useState('Anggota Rapat');
  const [newSpeech, setNewSpeech] = useState('');

  const [summary, setSummary] = useState<MeetingSummary | null>({
    id: 'sum-1',
    title: 'Rapat Pengembangan Fitur Auto Translate & Live Meeting Subtitle',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    durationMinutes: 25,
    originalLang: 'id',
    targetLang: 'en',
    executiveSummary: 'Rapat mendiskusikan integrasi fitur Notulensi Live Meeting untuk platform online (Google Meet, Zoom, Teams, Webex) dengan subtitel melayang real-time, model AI Gemini 3.6 Flash, serta penyesuaian kontras warna mode terang.',
    keyPoints: [
      'Peluncuran Subtitel Melayang Live Overlays untuk Google Meet, Zoom, Teams, & Webex.',
      'Integrasi perekaman audio dual-channel (Mikrofon + Speaker Sistem).',
      'Ekspor hasil notulensi ke format SRT Subtitle & Laporan Markdown.',
    ],
    actionItems: [
      { task: 'Menyiapkan pengujian live transcript di Google Meet & Zoom', assignee: 'Sari (Lead Dev)', priority: 'high' },
      { task: 'Verifikasi kontras warna mode terang pada seluruh font', assignee: 'Rian (Product Owner)', priority: 'medium' },
      { task: 'Finalisasi keamanan enkripsi E2EE pada log rapat', assignee: 'Budi (Manager)', priority: 'high' },
    ],
    transcripts: logs,
    topics: ['AI Translate', 'Notulensi Rapat', 'Live Meeting Overlay', 'Subtitel Multi-Platform'],
  });

  // Web Speech API Continuous Recognition Ref
  const recognitionRef = useRef<any>(null);

  // Toggle live recording simulation / Web Speech API
  const handleToggleRecord = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
      }
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setShowLiveSubtitleOverlay(true);
      
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'id-ID';

        recognition.onresult = async (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          if (event.results[current].isFinal) {
            // Translate live transcript
            try {
              const transResult = await executeTranslation({
                text: transcript,
                sourceLang: 'auto',
                targetLang: targetTranslateLang,
                tone: 'formal',
                isOffline: settings.offlineMode,
              });
              const speakerName = `Pembicara ${Math.floor(Math.random() * 2) + 1}`;
              
              const newLog: MeetingSpeakerLog = {
                id: 'm-' + Date.now(),
                speaker: speakerName,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                originalText: transcript,
                translatedText: transResult.translatedText || transcript,
              };

              setLogs((prev) => [...prev, newLog]);
              setLatestSubtitle({
                speaker: speakerName,
                original: transcript,
                translated: transResult.translatedText || transcript,
              });
            } catch (e) {
              console.error(e);
            }
          }
        };

        recognition.onerror = () => {};
        recognition.onend = () => {
          if (isRecording) {
            try { recognition.start(); } catch(e){}
          }
        };

        try {
          recognition.start();
          recognitionRef.current = recognition;
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const handleAddSpeech = () => {
    if (!newSpeech.trim()) return;
    const newLog: MeetingSpeakerLog = {
      id: 'm-' + Date.now(),
      speaker: newSpeaker,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      originalText: newSpeech,
      translatedText: newSpeech,
    };
    setLogs((prev) => [...prev, newLog]);
    setLatestSubtitle({
      speaker: newSpeaker,
      original: newSpeech,
      translated: newSpeech,
    });
    setNewSpeech('');
  };

  // Generate Automated Meeting Summary via Gemini
  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    try {
      const data = await executeMeetingSummary(logs, 'id', 'id');

      setSummary({
        id: 'sum-' + Date.now(),
        title: 'Notulensi Rapat Otomatis AI',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        durationMinutes: logs.length * 5,
        originalLang: 'id',
        targetLang: 'id',
        executiveSummary: data.executiveSummary || 'Ringkasan berhasil dibuat.',
        keyPoints: data.keyPoints || [],
        actionItems: data.actionItems || [],
        transcripts: logs,
        topics: data.topics || ['Notulensi Rapat'],
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!summary) return;
    const md = `# ${summary.title} (${summary.date})

## Ringkasan Eksekutif
${summary.executiveSummary}

## Poin-Poin Utama Diskusi
${summary.keyPoints.map((k) => `- ${k}`).join('\n')}

## Action Items & Penanggung Jawab
${summary.actionItems.map((a) => `- [ ] ${a.task} (${a.assignee || 'Unassigned'}) - Prioritas: ${a.priority || 'medium'}`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download SRT Subtitle File
  const handleDownloadSRT = () => {
    let srtContent = '';
    logs.forEach((log, idx) => {
      srtContent += `${idx + 1}\n00:0${idx}:00,000 --> 00:0${idx}:05,000\n[${log.speaker}]: ${log.originalText}\n[Terjemahan]: ${log.translatedText || log.originalText}\n\n`;
    });
    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting_subtitles_${Date.now()}.srt`;
    a.click();
  };

  const isLight = settings.themeMode === 'light';

  const platforms = [
    { id: 'google_meet', name: 'Google Meet', color: 'bg-emerald-600', icon: Video },
    { id: 'zoom', name: 'Zoom Meeting', color: 'bg-blue-600', icon: Monitor },
    { id: 'teams', name: 'MS Teams', color: 'bg-purple-600', icon: Layers },
    { id: 'webex', name: 'Cisco Webex', color: 'bg-red-600', icon: Radio },
    { id: 'discord', name: 'Discord / WA Call', color: 'bg-indigo-600', icon: MessageSquare },
    { id: 'universal', name: 'Aplikasi Lain / Universal', color: 'bg-slate-700', icon: ExternalLink },
  ];

  return (
    <div className="space-y-4">
      {/* Platform Selector Banner for Online Meetings */}
      <div className={`border rounded-2xl p-4 shadow-xl space-y-3 transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-neutral-900 border-neutral-800 text-white'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Video className="w-5 h-5 text-indigo-500" />
              Integrasi Live Transkrip & Subtitel Rapat Online
            </h2>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              Dapat dihubungkan dengan aplikasi meeting apa saja (Google Meet, Zoom, Teams, Webex) dengan Tampilan Subtitel Melayang (Live Subtitle Overlay).
            </p>
          </div>

          <button
            onClick={() => setShowLiveSubtitleOverlay(!showLiveSubtitleOverlay)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
              showLiveSubtitleOverlay
                ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                : isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{showLiveSubtitleOverlay ? 'Tutup Subtitel Overlay' : 'Buka Subtitel Melayang'}</span>
          </button>
        </div>

        {/* Platform Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
          {platforms.map((p) => {
            const Icon = p.icon;
            const isSelected = selectedPlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id as any)}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition ${
                  isSelected
                    ? `${p.color} text-white border-transparent shadow-lg scale-105`
                    : isLight
                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    : 'bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px] text-center leading-tight">{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Audio Input Pipeline & Target Language Selection */}
        <div className={`pt-2 border-t flex flex-col md:flex-row items-center justify-between gap-3 ${
          isLight ? 'border-slate-200' : 'border-neutral-800'
        }`}>
          <div className="flex items-center gap-2 text-xs font-semibold w-full md:w-auto">
            <span className={isLight ? 'text-slate-700' : 'text-neutral-400'}>Sumber Audio:</span>
            <div className={`p-1 rounded-xl border flex items-center gap-1 ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-neutral-950 border-neutral-800'}`}>
              <button
                onClick={() => setAudioSource('mic')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                  audioSource === 'mic' ? 'bg-indigo-600 text-white' : isLight ? 'text-slate-700' : 'text-neutral-400'
                }`}
              >
                <Mic className="w-3 h-3" /> Mikrofon
              </button>
              <button
                onClick={() => setAudioSource('system')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                  audioSource === 'system' ? 'bg-indigo-600 text-white' : isLight ? 'text-slate-700' : 'text-neutral-400'
                }`}
              >
                <Volume2 className="w-3 h-3" /> Audio Meeting
              </button>
              <button
                onClick={() => setAudioSource('dual')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                  audioSource === 'dual' ? 'bg-indigo-600 text-white' : isLight ? 'text-slate-700' : 'text-neutral-400'
                }`}
              >
                🎧 Dual Channel
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold w-full md:w-auto justify-end">
            <span className={isLight ? 'text-slate-700' : 'text-neutral-400'}>Terjemahkan Subtitel ke:</span>
            <select
              value={targetTranslateLang}
              onChange={(e) => setTargetTranslateLang(e.target.value)}
              className={`border rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none ${
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

      {/* Control Banner */}
      <div className={`border rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-neutral-900 border-neutral-800 text-white'
      }`}>
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Perekaman Live & Notulensi Rapat Otomatis
          </h2>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
            Transkripsikan percakapan rapat secara otomatis, lengkap dengan ringkasan eksekutif dan poin tugas (action items).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={handleToggleRecord}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
            }`}
          >
            {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRecording ? 'Hentikan Live Record' : 'Mulai Transkrip Live'}</span>
          </button>

          <button
            onClick={handleGenerateSummary}
            disabled={loadingSummary}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-purple-600/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loadingSummary ? 'Memproses AI...' : 'Buat Ringkasan AI'}</span>
          </button>

          <button
            onClick={handleDownloadSRT}
            className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
            }`}
            title="Download Subtitel Format SRT"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>SRT Subtitel</span>
          </button>
        </div>
      </div>

      {/* FLOATING SUBTITLE OVERLAY BAR FOR ONLINE MEETINGS */}
      {showLiveSubtitleOverlay && (
        <div
          style={{ opacity: subtitleOpacity }}
          className={`border-2 rounded-2xl p-4 shadow-2xl relative space-y-2 backdrop-blur-xl transition-all ${
            isLight
              ? 'bg-slate-900/95 border-indigo-500 text-white'
              : 'bg-black/95 border-indigo-500/80 text-white'
          }`}
        >
          {/* Subtitle Header Controls */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
              <span className="font-bold text-indigo-400 flex items-center gap-1">
                <Video className="w-3.5 h-3.5" /> Subtitel Melayang Live Meeting ({platforms.find(p => p.id === selectedPlatform)?.name})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Font Size Adjuster */}
              <div className="flex items-center gap-1 bg-neutral-800 px-2 py-0.5 rounded-lg text-[10px]">
                <span>Ukuran:</span>
                {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSubtitleFontSize(sz)}
                    className={`px-1.5 py-0.5 rounded font-bold uppercase ${
                      subtitleFontSize === sz ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowLiveSubtitleOverlay(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subtitle Spoken Content Lines */}
          {latestSubtitle ? (
            <div className="space-y-1.5 py-1">
              <div className="flex items-center gap-2 text-[11px] font-bold text-amber-400">
                <span>👤 {latestSubtitle.speaker}:</span>
                <span className="text-neutral-300 font-normal italic">"{latestSubtitle.original}"</span>
              </div>
              <div className={`font-bold text-emerald-400 leading-relaxed ${
                subtitleFontSize === 'sm' ? 'text-xs' : subtitleFontSize === 'md' ? 'text-sm' : subtitleFontSize === 'lg' ? 'text-base' : 'text-lg'
              }`}>
                ✨ [{getLanguageName(targetTranslateLang)}]: {latestSubtitle.translated}
              </div>
            </div>
          ) : (
            <div className="text-xs text-neutral-400 italic py-2">
              Mendengarkan percakapan rapat secara live... Subtitel akan muncul otomatis di sini.
            </div>
          )}
        </div>
      )}

      {/* Manual Input / Recording Log Area */}
      <div className={`border rounded-2xl p-4 shadow-xl space-y-3 transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
      }`}>
        <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-neutral-300'}`}>
          <MessageSquare className="w-4 h-4 text-indigo-500" /> Log Transkrip Percakapan Rapat ({logs.length} Ucapan)
        </h3>

        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div key={log.id} className={`p-3 rounded-xl border space-y-1.5 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
            }`}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
                  <Users className="w-3 h-3" /> {log.speaker}
                </span>
                <span className={`font-mono text-[10px] ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>{log.timestamp}</span>
              </div>
              <p className={`text-xs font-medium ${isLight ? 'text-slate-900' : 'text-neutral-200'}`}>{log.originalText}</p>
              {log.translatedText && (
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 pt-1 border-t border-slate-200 dark:border-neutral-800">
                  ✨ {log.translatedText}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Add Speech Input */}
        <div className={`pt-2 border-t flex gap-2 ${isLight ? 'border-slate-200' : 'border-neutral-800'}`}>
          <input
            type="text"
            value={newSpeaker}
            onChange={(e) => setNewSpeaker(e.target.value)}
            placeholder="Nama Pembicara"
            className={`w-36 border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none ${
              isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500' : 'bg-neutral-950 border-neutral-800 text-white'
            }`}
          />
          <input
            type="text"
            value={newSpeech}
            onChange={(e) => setNewSpeech(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSpeech()}
            placeholder="Ketik ucapan pembicara..."
            className={`flex-1 border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none ${
              isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500' : 'bg-neutral-950 border-neutral-800 text-white'
            }`}
          />
          <button
            onClick={handleAddSpeech}
            className={`p-2 rounded-xl transition ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* GENERATED MEETING SUMMARY DISPLAY */}
      {summary && (
        <div className={`border rounded-2xl p-5 shadow-2xl space-y-4 animate-fadeIn transition-colors ${
          isLight
            ? 'bg-white border-indigo-200 text-slate-900'
            : 'bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border-indigo-500/30 text-white'
        }`}>
          {/* Summary Header */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 ${
            isLight ? 'border-slate-200' : 'border-neutral-800'
          }`}>
            <div>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                Laporan Notulensi Resmi AI
              </span>
              <h3 className="text-base font-bold mt-1 text-slate-900 dark:text-white">{summary.title}</h3>
              <p className={`text-xs flex items-center gap-2 ${isLight ? 'text-slate-600 font-medium' : 'text-neutral-400'}`}>
                <span>{summary.date}</span> • <span>Durasi: {summary.durationMinutes} Menit</span>
              </p>
            </div>

            <button
              onClick={handleCopyMarkdown}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition self-start sm:self-auto ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin' : 'Salin Laporan'}</span>
            </button>
          </div>

          {/* Executive Summary */}
          <div className={`border rounded-xl p-3.5 space-y-1 ${
            isLight ? 'bg-indigo-50/70 border-indigo-200' : 'bg-neutral-950/80 border-neutral-800'
          }`}>
            <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Ringkasan Eksekutif
            </h4>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-900 font-medium' : 'text-neutral-200'}`}>{summary.executiveSummary}</p>
          </div>

          {/* Key Discussion Points */}
          <div className="space-y-2">
            <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-neutral-300'}`}>
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" /> Poin-Poin Utama Diskusi
            </h4>
            <ul className="space-y-1.5">
              {summary.keyPoints.map((point, idx) => (
                <li key={idx} className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900 font-medium' : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Items */}
          <div className="space-y-2">
            <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-neutral-300'}`}>
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" /> Action Items & Penanggung Jawab
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {summary.actionItems.map((item, idx) => (
                <div key={idx} className={`p-3 rounded-xl border flex flex-col justify-between text-xs space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900 font-medium' : 'bg-neutral-950 border-neutral-800'
                }`}>
                  <span className="font-semibold">{item.task}</span>
                  <div className={`flex items-center justify-between text-[10px] pt-1 border-t ${
                    isLight ? 'text-slate-600 border-slate-200' : 'text-neutral-400 border-neutral-800/60'
                  }`}>
                    <span>👤 {item.assignee || 'Tim'}</span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                      item.priority === 'high'
                        ? 'bg-red-500/20 text-red-700 dark:text-red-300'
                        : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                    }`}>
                      {item.priority || 'medium'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

