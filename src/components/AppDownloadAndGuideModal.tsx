import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Monitor, 
  Laptop, 
  Apple, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  Video,
  MessageSquare,
  Globe,
  Settings,
  Layers,
  Copy,
  Check,
  Radio,
  ExternalLink
} from 'lucide-react';
import { AppSettings } from '../types';

interface AppDownloadAndGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  initialTab?: 'download' | 'guide';
}

export const AppDownloadAndGuideModal: React.FC<AppDownloadAndGuideModalProps> = ({
  isOpen,
  onClose,
  settings,
  initialTab = 'download',
}) => {
  const [activeTab, setActiveTab] = useState<'download' | 'guide'>(initialTab);
  const [detectedPlatform, setDetectedPlatform] = useState<{
    name: string;
    iconName: 'android' | 'windows' | 'mac' | 'ios' | 'linux';
    downloadLabel: string;
    fileSize: string;
    version: string;
  }>({
    name: 'Mendeteksi...',
    iconName: 'windows',
    downloadLabel: 'Installer .exe',
    fileSize: '45.2 MB',
    version: 'v3.6.0 Pro',
  });

  const [downloadStarted, setDownloadStarted] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Auto detect user device platform
  useEffect(() => {
    const ua = navigator.userAgent || '';
    if (/android/i.test(ua)) {
      setDetectedPlatform({
        name: 'Android Mobile / Tablet',
        iconName: 'android',
        downloadLabel: 'Unduh APK Resmi (Android 8.0+)',
        fileSize: '24.5 MB',
        version: 'v3.6.2 Mobile',
      });
    } else if (/iPad|iPhone|iPod/.test(ua)) {
      setDetectedPlatform({
        name: 'Apple iOS (iPhone / iPad)',
        iconName: 'ios',
        downloadLabel: 'Tambahkan ke Home Screen (PWA App)',
        fileSize: '3.1 MB',
        version: 'v3.6.0 iOS WebApp',
      });
    } else if (/Macintosh|Mac OS X/.test(ua)) {
      setDetectedPlatform({
        name: 'macOS (Apple Silicon & Intel)',
        iconName: 'mac',
        downloadLabel: 'Unduh LinguaSync.dmg (macOS 12+)',
        fileSize: '52.8 MB',
        version: 'v3.6.0 Universal',
      });
    } else if (/Linux/i.test(ua)) {
      setDetectedPlatform({
        name: 'Linux Desktop (Ubuntu/Debian)',
        iconName: 'linux',
        downloadLabel: 'Unduh AppImage / .deb',
        fileSize: '48.1 MB',
        version: 'v3.6.0 Linux',
      });
    } else {
      setDetectedPlatform({
        name: 'Windows 10/11 PC',
        iconName: 'windows',
        downloadLabel: 'Unduh LinguaSync_Setup.exe (64-bit)',
        fileSize: '45.2 MB',
        version: 'v3.6.0 Windows Pro',
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const isLight = settings.themeMode === 'light';

  const handleSimulateDownload = (platformName: string) => {
    setDownloadStarted(platformName);
    setTimeout(() => {
      setDownloadStarted(null);
      alert(`[Simulasi Download] File installer ${platformName} berhasil diunduh! Silakan jalankan file instalasi di perangkat Anda.`);
    }, 1500);
  };

  const platformsList = [
    {
      id: 'windows',
      title: 'Windows PC (10 / 11)',
      desc: 'Pintasan Alt+T, Overlay WhatsApp Desktop & Zoom Notetaker',
      fileSize: '45.2 MB',
      icon: Monitor,
      color: 'from-blue-600 to-cyan-600',
      tag: 'Desktop Recommended',
    },
    {
      id: 'android',
      title: 'Android Mobile & Tablet',
      desc: 'Izin Draw Over Apps, Floating Chat Bubble & Voice Widget',
      fileSize: '24.5 MB',
      icon: Smartphone,
      color: 'from-emerald-600 to-teal-600',
      tag: 'Mobile Popular',
    },
    {
      id: 'mac',
      title: 'macOS (Apple Silicon M1/M2/M3 & Intel)',
      desc: 'Integrasi Menu Bar, Global Hotkey Cmd+Shift+T',
      fileSize: '52.8 MB',
      icon: Apple,
      color: 'from-purple-600 to-indigo-600',
      tag: 'macOS Native',
    },
    {
      id: 'linux',
      title: 'Linux (Ubuntu, Debian, Fedora)',
      desc: 'AppImage & paket .deb ringan tanpa dependensi berat',
      fileSize: '48.1 MB',
      icon: Laptop,
      color: 'from-amber-600 to-orange-600',
      tag: 'Open Source',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className={`w-full max-w-2xl max-h-[92vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-neutral-900 border-neutral-800 text-white'
      }`}>
        {/* Modal Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between sticky top-0 z-10 backdrop-blur ${
          isLight ? 'bg-white/95 border-slate-200' : 'bg-neutral-900/95 border-neutral-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight">
                Download Aplikasi & Panduan Integrasi
              </h3>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                Auto-deteksi perangkat, instalasi lintas platform & integrasi WhatsApp/Zoom
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition ${
              isLight ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className={`flex border-b text-xs font-bold ${isLight ? 'border-slate-200 bg-slate-50' : 'border-neutral-800 bg-neutral-950'}`}>
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'download'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download Aplikasi (Auto Deteksi)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'guide'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Tutorial Integrasi Perangkat</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'download' ? (
            /* TAB 1: AUTO DETECTED DOWNLOAD & ALL PLATFORMS */
            <div className="space-y-5">
              {/* AUTO-DETECTED HERO CARD */}
              <div className={`p-4 sm:p-5 rounded-3xl border relative overflow-hidden ${
                isLight
                  ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-indigo-200'
                  : 'bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-neutral-900 border-indigo-500/40'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                      <Radio className="w-3 h-3 animate-pulse" /> Auto-Deteksi Perangkat Anda
                    </div>
                    <h4 className="font-extrabold text-lg sm:text-xl tracking-tight">
                      {detectedPlatform.name}
                    </h4>
                    <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-neutral-300'}`}>
                      Versi: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{detectedPlatform.version}</span> • Ukuran File: {detectedPlatform.fileSize}
                    </p>
                  </div>

                  <button
                    onClick={() => handleSimulateDownload(detectedPlatform.name)}
                    disabled={downloadStarted !== null}
                    className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs rounded-2xl shadow-xl shadow-indigo-500/30 transition flex items-center justify-center gap-2 shrink-0"
                  >
                    {downloadStarted === detectedPlatform.name ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Mengunduh Installer...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>{detectedPlatform.downloadLabel}</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-indigo-500/20 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Bebas Virus & Digital Signed
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Auto-Cloud Sync Terhubung
                  </span>
                </div>
              </div>

              {/* ALL PLATFORMS GRID */}
              <div className="space-y-2.5">
                <h5 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                  Semua Pilihan Installer Perangkat:
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {platformsList.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border flex flex-col justify-between space-y-3 transition ${
                          isLight
                            ? 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                            : 'bg-neutral-950 hover:bg-neutral-800/80 border-neutral-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-xl text-white bg-gradient-to-tr ${item.color}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h6 className="font-bold text-xs">{item.title}</h6>
                              <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                                Ukuran: {item.fileSize}
                              </span>
                            </div>
                          </div>

                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                            {item.tag}
                          </span>
                        </div>

                        <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                          {item.desc}
                        </p>

                        <button
                          onClick={() => handleSimulateDownload(item.title)}
                          disabled={downloadStarted !== null}
                          className={`w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                            isLight
                              ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                          }`}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh File Instalasi</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: TUTORIAL INTEGRASI PERANGKAT & APLIKASI */
            <div className="space-y-4">
              <div className={`p-3.5 rounded-2xl border ${
                isLight ? 'bg-indigo-50/80 border-indigo-200' : 'bg-indigo-950/40 border-indigo-500/30'
              }`}>
                <h4 className="font-bold text-sm text-indigo-600 dark:text-indigo-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Petunjuk Integrasi Langsung ke Aplikasi Favorit Anda
                </h4>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-neutral-300'}`}>
                  LinguaSync dirancang untuk menyadap, membaca, dan menerjemahkan percakapan secara otomatis di atas berbagai aplikasi tanpa perlu berpindah jendela.
                </p>
              </div>

              {/* TUTORIAL STEPS ACCORDION LIST */}
              <div className="space-y-3">
                {/* 1. WHATSAPP & TELEGRAM */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
                }`}>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <MessageSquare className="w-4 h-4" />
                    <span>1. Integrasi Overlay WhatsApp & Telegram Chat</span>
                  </div>
                  <ol className={`text-xs space-y-1.5 list-decimal list-inside ${isLight ? 'text-slate-700' : 'text-neutral-300'}`}>
                    <li>Buka tombol <strong>Jendela Mengambang (Bubble)</strong> di header atas aplikasi LinguaSync.</li>
                    <li>Pada HP Android: Aktifkan izin <strong>"Display Over Other Apps"</strong> saat diminta sistem.</li>
                    <li>Di WhatsApp/Telegram, gelembung LinguaSync akan melayang di pinggir layar.</li>
                    <li>Cukup tekan tombol <strong>"Terjemahkan Instan"</strong> pada pesan apa pun untuk melihat hasil terjemahan langsung di dalam obrolan!</li>
                  </ol>
                </div>

                {/* 2. ZOOM, GOOGLE MEET, TEAMS & WEBEX */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
                }`}>
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400">
                    <Video className="w-4 h-4" />
                    <span>2. Integrasi Subtitel Melayang Live Meeting (Google Meet / Zoom / Teams / Webex)</span>
                  </div>
                  <ol className={`text-xs space-y-1.5 list-decimal list-inside font-medium ${isLight ? 'text-slate-900' : 'text-neutral-300'}`}>
                    <li>Pilih tab <strong>"Notulensi Rapat"</strong> di menu navigasi utama LinguaSync.</li>
                    <li>Pilih platform meeting Anda (misal: <strong>Google Meet, Zoom, Teams, Webex</strong>).</li>
                    <li>Pilih sumber audio input: <strong>"Dual Channel (Mikrofon + Audio Meeting)"</strong>.</li>
                    <li>Klik tombol <strong>"Buka Subtitel Melayang"</strong> untuk memunculkan bilah subtitel transparan yang dapat ditempatkan di atas jendela meeting Anda!</li>
                    <li>Subtitel bilingual (ucapan peserta + terjemahan AI langsung) akan muncul secara real-time saat lawan bicara berbicara.</li>
                  </ol>
                </div>

                {/* 3. WINDOWS & MACOS GLOBAL HOTKEY */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
                }`}>
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400">
                    <Zap className="w-4 h-4" />
                    <span>3. Pintasan Keyboard Global (Hotkeys Windows / Mac)</span>
                  </div>
                  <div className={`text-xs space-y-2 ${isLight ? 'text-slate-700' : 'text-neutral-300'}`}>
                    <p>
                      Tekan tombol pintasan berikut di mana pun Anda berada (misal di Microsoft Word, Browser, atau PDF) untuk memunculkan penerjemah cepat:
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="px-3 py-1 rounded-xl bg-neutral-800 text-indigo-300 font-mono text-xs font-bold border border-neutral-700">
                        Alt + T (Windows)
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-neutral-800 text-purple-300 font-mono text-xs font-bold border border-neutral-700">
                        Cmd + Shift + T (macOS)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`px-5 py-3.5 border-t flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-neutral-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Versi Stabil v3.6.0 • Dukungan Offline & Cloud Hybrid</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition"
          >
            Tutup Modal
          </button>
        </div>
      </div>
    </div>
  );
};
