import React, { useState } from 'react';
import { 
  MessageSquare, 
  Globe, 
  Send, 
  Sparkles, 
  X, 
  Move, 
  Zap, 
  Copy, 
  Check, 
  ArrowRightLeft,
  Smartphone,
  ExternalLink,
  Bot,
  Minimize2,
  Maximize2,
  EyeOff,
  Sliders,
  Sun,
  Moon
} from 'lucide-react';
import { MOCK_WHATSAPP_MESSAGES, MOCK_WEB_ARTICLE } from '../data/mockApps';
import { LANGUAGES, getLanguageName } from '../data/languages';
import { AppSettings } from '../types';

interface FloatingOverlayProps {
  settings: AppSettings;
  updateSettings?: (newSettings: Partial<AppSettings>) => void;
}

export const FloatingOverlay: React.FC<FloatingOverlayProps> = ({ settings, updateSettings }) => {
  const [activeApp, setActiveApp] = useState<'whatsapp' | 'browser' | 'notes'>('whatsapp');
  
  // WhatsApp State
  const [messages, setMessages] = useState(MOCK_WHATSAPP_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  
  // Floating Bubble Controls State
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHiddenCompletely, setIsHiddenCompletely] = useState(false);
  const [opacityValue, setOpacityValue] = useState(settings.overlayOpacity || 0.95);
  const [showOpacitySlider, setShowOpacitySlider] = useState(false);

  const [bubblePosition, setBubblePosition] = useState({ x: 20, y: 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Floating Mini Translator State
  const [floatingInput, setFloatingInput] = useState('');
  const [floatingTargetLang, setFloatingTargetLang] = useState('en');
  const [floatingResult, setFloatingResult] = useState('');
  const [floatingLoading, setFloatingLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const isLight = settings.themeMode === 'light';

  // Dragging handler
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - bubblePosition.x, y: e.clientY - bubblePosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setBubblePosition({
      x: Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragStart.x)),
      y: Math.max(0, Math.min(window.innerHeight - 400, e.clientY - dragStart.y)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Instant inline translate for WhatsApp message
  const handleTranslateMessage = async (msgId: string, text: string) => {
    setSelectedMsgId(msgId);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLang: 'auto',
          targetLang: 'id',
          tone: 'casual',
          isOffline: settings.offlineMode,
        }),
      });
      const data = await res.json();
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? { ...m, translatedText: data.translatedText || 'Gagal menerjemahkan' }
            : m
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Floating widget translate
  const handleFloatingTranslate = async () => {
    if (!floatingInput.trim()) return;
    setFloatingLoading(true);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: floatingInput,
          sourceLang: 'auto',
          targetLang: floatingTargetLang,
          tone: 'casual',
          isOffline: settings.offlineMode,
        }),
      });
      const data = await res.json();
      setFloatingResult(data.translatedText || floatingInput);
    } catch (e) {
      console.error(e);
    } finally {
      setFloatingLoading(false);
    }
  };

  // Inject translated result into WhatsApp message box!
  const handleInjectToChat = () => {
    if (floatingResult) {
      setInputText(floatingResult);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: 'wa-' + Date.now(),
      sender: 'You',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText,
      isMe: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div 
      className="relative space-y-4 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Intro Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
        isLight
          ? 'bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border-pink-200 text-slate-900'
          : 'bg-gradient-to-r from-pink-900/40 via-purple-900/40 to-indigo-900/40 border-pink-500/30 text-white'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-500 border border-pink-500/30 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              Jendela Mengambang & Overlay Perpesanan Real-Time
              <span className="text-[10px] bg-pink-100 text-pink-950 px-2 py-0.5 rounded-full border border-pink-300 font-bold">
                Fitur Transparansi & Minimize Active
              </span>
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-800 font-medium' : 'text-neutral-300'}`}>
              Widget melayang ini menempel di atas WhatsApp/Web. Anda dapat mengatur tingkat transparansi dan menyembunyikannya kapan saja.
            </p>
          </div>
        </div>

        {/* Global Control Button for Overlay */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsHiddenCompletely(!isHiddenCompletely)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
              isHiddenCompletely
                ? isLight ? 'bg-amber-100 text-amber-950 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-indigo-600 text-white border-indigo-500'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>{isHiddenCompletely ? 'Tampilkan Overlay' : 'Sembunyikan Overlay'}</span>
          </button>
        </div>
      </div>

      {/* Simulated Mobile Device Display containing WhatsApp / Web */}
      <div className={`border rounded-3xl overflow-hidden shadow-2xl relative min-h-[500px] flex flex-col transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
      }`}>
        {/* App Switcher Tabs Header */}
        <div className={`px-4 py-2 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveApp('whatsapp')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                activeApp === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : isLight ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Chat
            </button>
            <button
              onClick={() => setActiveApp('browser')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                activeApp === 'browser'
                  ? 'bg-blue-600 text-white shadow-md'
                  : isLight ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Web News Reader
            </button>
          </div>

          <span className={`text-[11px] font-mono hidden sm:inline ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
            Aplikasi Latar Belakang Terkoneksi
          </span>
        </div>

        {/* ACTIVE APP CONTENT AREA */}
        <div className={`flex-1 p-4 overflow-y-auto ${isLight ? 'bg-slate-50' : 'bg-neutral-950/60'}`}>
          {activeApp === 'whatsapp' ? (
            /* WhatsApp Interactive Screen */
            <div className={`max-w-md mx-auto border rounded-2xl overflow-hidden shadow-xl flex flex-col h-[420px] ${
              isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
            }`}>
              {/* WhatsApp Header */}
              <div className="bg-emerald-800 border-b border-emerald-700 px-3.5 py-2.5 flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border border-emerald-300"
                    />
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full absolute bottom-0 right-0 border border-emerald-950" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Siti Rahma (Klien Proyek)</h4>
                    <span className="text-[10px] text-emerald-100">Online • Bahasa Sunda & Indonesia</span>
                  </div>
                </div>

                <span className="text-[10px] bg-emerald-950/60 text-emerald-200 px-2 py-0.5 rounded border border-emerald-600">
                  WA Overlay Active
                </span>
              </div>

              {/* Chat Thread */}
              <div className={`flex-1 p-3 space-y-3 overflow-y-auto ${
                isLight
                  ? 'bg-slate-100/80 [background-size:16px_16px]'
                  : 'bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]'
              }`}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-md relative group ${
                        msg.isMe
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : isLight
                          ? 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                          : 'bg-neutral-800 text-neutral-100 rounded-bl-none border border-neutral-700'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Translated Overlay tooltip */}
                      {msg.translatedText && (
                        <div className={`mt-2 pt-2 border-t p-2 rounded-lg text-[11px] flex items-start gap-1.5 animate-fadeIn ${
                          isLight
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                            : 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
                        }`}>
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[10px] text-emerald-600 dark:text-emerald-300 block">Terjemahan Instant:</span>
                            <span>{msg.translatedText}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-1 text-[9px] opacity-75">
                        <span>{msg.time}</span>
                        {!msg.isMe && (
                          <button
                            onClick={() => handleTranslateMessage(msg.id, msg.text)}
                            className="ml-2 text-indigo-600 dark:text-indigo-300 font-bold hover:underline flex items-center gap-1"
                          >
                            <Zap className="w-3 h-3 text-amber-500" /> Terjemahkan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input Bar */}
              <div className={`p-2.5 border-t flex items-center gap-2 ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-neutral-950 border-neutral-800'
              }`}>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ketik pesan WhatsApp atau gunakan widget..."
                  className={`flex-1 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    isLight ? 'bg-white border border-slate-300 text-slate-900' : 'bg-neutral-900 border border-neutral-800 text-white'
                  }`}
                />

                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition shadow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Web Browser Screen */
            <div className={`max-w-xl mx-auto border rounded-2xl p-4 shadow-xl space-y-3 ${
              isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <div className={`px-3 py-1.5 rounded-xl border flex items-center justify-between text-xs ${
                isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
              }`}>
                <span className="truncate">https://tech-news.global/article/mobile-ai-translation-2026</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </div>

              <h2 className="text-base font-bold">{MOCK_WEB_ARTICLE.title}</h2>
              <p className={`text-xs leading-relaxed p-3 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-neutral-950/60 border-neutral-800 text-neutral-300'
              }`}>
                {MOCK_WEB_ARTICLE.content}
              </p>

              <div className={`border p-2.5 rounded-xl text-xs flex items-center justify-between ${
                isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-900' : 'bg-indigo-950/40 border-indigo-800/60 text-indigo-300'
              }`}>
                <span>Sorot teks di atas untuk menerjemahkan via Widget Mengambang!</span>
                <button
                  onClick={() => {
                    setFloatingInput(MOCK_WEB_ARTICLE.content);
                    handleFloatingTranslate();
                  }}
                  className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg font-bold text-[11px] hover:bg-indigo-500 transition shadow"
                >
                  Salin ke Widget
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FLOATING BUBBLE WIDGET ("Jendela Mengambang") */}
      {!isHiddenCompletely && (
        bubbleOpen && !isMinimized ? (
          /* FULL EXPANDED FLOATING WIDGET */
          <div
            style={{ 
              top: `${bubblePosition.y}px`, 
              left: `${bubblePosition.x}px`,
              opacity: opacityValue 
            }}
            className={`fixed z-50 w-80 border-2 rounded-2xl shadow-2xl backdrop-blur-xl transition-opacity duration-150 overflow-hidden ${
              isLight
                ? 'bg-white/95 border-indigo-500 shadow-indigo-500/20 text-slate-900'
                : 'bg-neutral-900/95 border-indigo-500/80 shadow-black/80 text-white'
            }`}
          >
            {/* Header Draggable Bar */}
            <div
              onMouseDown={handleMouseDown}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-3 py-2 flex items-center justify-between cursor-move text-white"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <Move className="w-3.5 h-3.5 text-indigo-200" />
                <span>RBLingua Floating Overlay</span>
              </div>

              {/* Controls: Opacity Slider Toggle, Minimize, Close */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowOpacitySlider(!showOpacitySlider)}
                  className="p-1 hover:bg-white/20 rounded-lg transition"
                  title="Atur Transparansi Jendela"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 hover:bg-white/20 rounded-lg transition"
                  title="Kecilkan Jendela (Minimize)"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setBubbleOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition"
                  title="Tutup Widget"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Transparency Slider Drawer */}
            {showOpacitySlider && (
              <div className={`p-2.5 border-b text-xs space-y-1 ${
                isLight ? 'bg-slate-100 border-slate-200' : 'bg-neutral-950 border-neutral-800'
              }`}>
                <div className="flex items-center justify-between font-bold text-[11px]">
                  <span>Transparansi Jendela:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    {Math.round(opacityValue * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={opacityValue}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setOpacityValue(val);
                    if (updateSettings) updateSettings({ overlayOpacity: val });
                  }}
                  className="w-full accent-indigo-600 h-1.5 cursor-pointer"
                />
              </div>
            )}

            {/* Widget Body */}
            <div className="p-3 space-y-2.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                    Target Bahasa:
                  </label>
                  <select
                    value={floatingTargetLang}
                    onChange={(e) => setFloatingTargetLang(e.target.value)}
                    className={`border rounded-lg px-2 py-0.5 text-xs font-medium focus:outline-none ${
                      isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-neutral-800 border-neutral-700 text-white'
                    }`}
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <textarea
                  value={floatingInput}
                  onChange={(e) => setFloatingInput(e.target.value)}
                  placeholder="Ketik teks untuk diterjemahkan mengambang..."
                  rows={2}
                  className={`w-full text-xs rounded-xl p-2 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none border ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
                  }`}
                />
              </div>

              <button
                onClick={handleFloatingTranslate}
                disabled={floatingLoading || !floatingInput.trim()}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow"
              >
                {floatingLoading ? (
                  <span>Proses AI...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Terjemahkan Instan</span>
                  </>
                )}
              </button>

              {/* Translated Output */}
              {floatingResult && (
                <div className={`border rounded-xl p-2.5 space-y-2 animate-fadeIn ${
                  isLight ? 'bg-emerald-50/90 border-emerald-200' : 'bg-neutral-950 border-neutral-800'
                }`}>
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 leading-normal select-all">
                    {floatingResult}
                  </p>

                  <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-emerald-200/50 dark:border-neutral-800">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(floatingResult);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1500);
                      }}
                      className={`p-1 rounded text-[10px] flex items-center gap-1 ${
                        isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                      }`}
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Tersalin' : 'Salin'}</span>
                    </button>

                    <button
                      onClick={handleInjectToChat}
                      className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 transition shadow"
                    >
                      <Send className="w-3 h-3" />
                      <span>Sisipkan ke Chat WA</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* MINIMIZED FLOATING BADGE / BUTTON */
          <div
            style={{ 
              top: isMinimized ? `${bubblePosition.y}px` : undefined, 
              left: isMinimized ? `${bubblePosition.x}px` : undefined,
              opacity: opacityValue
            }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
          >
            <button
              onClick={() => {
                setBubbleOpen(true);
                setIsMinimized(false);
              }}
              className="px-4 py-3 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-indigo-500/50 flex items-center gap-2 hover:scale-105 active:scale-95 transition border-2 border-white/20 animate-bounce"
              title="Buka Jendela Mengambang LinguaSync"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-bold text-xs">LinguaSync Overlay</span>
              <Maximize2 className="w-3.5 h-3.5 text-indigo-200" />
            </button>
          </div>
        )
      )}
    </div>
  );
};

