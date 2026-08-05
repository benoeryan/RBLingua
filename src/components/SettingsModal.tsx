import React from 'react';
import { 
  X, 
  Palette, 
  Type, 
  WifiOff, 
  Volume2, 
  Lock, 
  Check, 
  CheckCircle2, 
  Sliders,
  Sun,
  Moon,
  Smartphone,
  Tablet,
  Monitor,
  User,
  LogIn
} from 'lucide-react';
import { AppSettings, UITheme, GoogleUserProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  user: GoogleUserProfile | null;
  onOpenAccountModal: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  updateSettings,
  user,
  onOpenAccountModal,
}) => {
  if (!isOpen) return null;

  const isLight = settings.themeMode === 'light';

  const themes: { id: UITheme; label: string; accent: string }[] = [
    { id: 'amoled', label: 'Obsidian Black', accent: 'bg-indigo-600' },
    { id: 'nordic', label: 'Nordic Blue', accent: 'bg-blue-500' },
    { id: 'emerald', label: 'Cyber Emerald', accent: 'bg-emerald-500' },
    { id: 'warm', label: 'Warm Amber', accent: 'bg-amber-500' },
    { id: 'sunset', label: 'Sunset Purple', accent: 'bg-pink-500' },
  ];

  const offlinePacks = [
    { name: 'Bahasa Indonesia & Dialek Daerah (Sunda, Jawa, Minang, Bali)', size: '120 MB', status: 'Terpasang' },
    { name: 'English (US / UK / Global)', size: '85 MB', status: 'Terpasang' },
    { name: 'Japanese & Kanji OCR Pack', size: '110 MB', status: 'Terpasang' },
    { name: 'Spanish & European Dialects', size: '95 MB', status: 'Terpasang' },
    { name: 'Arabic & Phonetics Pack', size: '105 MB', status: 'Terpasang' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl flex flex-col transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-neutral-900 border-neutral-800 text-white'
      }`}>
        {/* Modal Header */}
        <div className={`p-4 border-b flex items-center justify-between sticky top-0 backdrop-blur z-10 ${
          isLight ? 'bg-white/95 border-slate-200' : 'bg-neutral-900/95 border-neutral-800'
        }`}>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-base">Kustomisasi Tema, Device & Pengaturan</h3>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-xl transition ${
              isLight ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 flex-1">
          {/* Account Banner */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            isLight ? 'bg-indigo-50/80 border-indigo-200' : 'bg-indigo-950/40 border-indigo-500/30'
          }`}>
            <div className="flex items-center gap-3">
              {user ? (
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="font-bold text-xs block">{user ? user.name : 'Belum Log In Google'}</span>
                <span className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                  {user ? user.email : 'Log in untuk sinkronisasi cloud'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenAccountModal();
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1"
            >
              {user ? <User className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
              <span>{user ? 'Kelola Akun' : 'Log In Google'}</span>
            </button>
          </div>

          {/* Light / Dark Mode Selector */}
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isLight ? 'text-slate-600' : 'text-neutral-300'
            }`}>
              <Sun className="w-4 h-4 text-amber-500" /> Mode Tema Antarmuka (Terang / Gelap)
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateSettings({ themeMode: 'light' })}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition ${
                  settings.themeMode === 'light'
                    ? 'border-amber-500 bg-amber-500/10 text-slate-900 font-bold shadow-md'
                    : isLight
                    ? 'border-slate-200 bg-slate-50 text-slate-600'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600">
                  <Sun className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-xs block font-bold">Mode Terang ☀️</span>
                  <span className="text-[10px] opacity-75">Tampilan bersih & kontras tinggi</span>
                </div>
              </button>

              <button
                onClick={() => updateSettings({ themeMode: 'dark' })}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition ${
                  settings.themeMode === 'dark'
                    ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold shadow-md'
                    : isLight
                    ? 'border-slate-200 bg-slate-50 text-slate-600'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Moon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-xs block font-bold">Mode Gelap (Yang Sekarang) 🌙</span>
                  <span className="text-[10px] opacity-75">OLED Obsidian & Slate Dark</span>
                </div>
              </button>
            </div>
          </div>

          {/* Device Responsive Layout Switcher */}
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isLight ? 'text-slate-600' : 'text-neutral-300'
            }`}>
              <Smartphone className="w-4 h-4 text-blue-500" /> Penyesuaian Tampilan Device
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'desktop', label: 'Desktop Full', icon: Monitor },
                { id: 'tablet', label: 'Tablet (iPad)', icon: Tablet },
                { id: 'mobile', label: 'Smartphone (HP)', icon: Smartphone },
              ].map((d) => {
                const Icon = d.icon;
                const active = settings.deviceView === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => updateSettings({ deviceView: d.id as any })}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 transition ${
                      active
                        ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold shadow-md'
                        : isLight
                        ? 'border-slate-200 bg-slate-50 text-slate-600'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[11px] font-medium">{d.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Accent Themes */}
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isLight ? 'text-slate-600' : 'text-neutral-300'
            }`}>
              <Palette className="w-4 h-4 text-purple-500" /> Palet Warna Aksentuasi
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => updateSettings({ theme: t.id })}
                  className={`p-2.5 rounded-2xl border text-left flex items-center justify-between transition ${
                    settings.theme === t.id
                      ? 'border-indigo-500 bg-indigo-500/10 font-bold shadow-sm'
                      : isLight
                      ? 'border-slate-200 bg-slate-50 text-slate-600'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                  }`}
                >
                  <span className="text-xs">{t.label}</span>
                  <span className={`w-3.5 h-3.5 rounded-full ${t.accent}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Typography / Font Size */}
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isLight ? 'text-slate-600' : 'text-neutral-300'
            }`}>
              <Type className="w-4 h-4 text-indigo-500" /> Ukuran Teks Tampilan
            </label>

            <div className={`flex items-center gap-2 p-1.5 rounded-2xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
            }`}>
              {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updateSettings({ fontSize: size })}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold uppercase transition ${
                    settings.fontSize === size
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Speech Speed Slider */}
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isLight ? 'text-slate-600' : 'text-neutral-300'
            }`}>
              <Volume2 className="w-4 h-4 text-amber-500" /> Kecepatan Suara Pelafalan (TTS)
            </label>

            <div className={`p-3 rounded-2xl border space-y-2 text-xs ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
            }`}>
              <div className="flex items-center justify-between">
                <span className={isLight ? 'text-slate-600' : 'text-neutral-400'}>Kecepatan Bicara:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{settings.speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={settings.speechRate}
                onChange={(e) => updateSettings({ speechRate: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Offline Models Manager */}
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isLight ? 'text-slate-600' : 'text-neutral-300'
            }`}>
              <WifiOff className="w-4 h-4 text-emerald-500" /> Paket Bahasa Offline Terpasang
            </label>

            <div className="space-y-2">
              {offlinePacks.map((pack, idx) => (
                <div key={idx} className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
                }`}>
                  <div>
                    <span className="font-bold block">{pack.name}</span>
                    <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>{pack.size}</span>
                  </div>

                  <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {pack.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PIN Lock */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
          }`}>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-500" />
              <div>
                <span className="text-xs font-bold block">Kunci PIN Privasi Vault</span>
                <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                  Gunakan PIN untuk mengunci Loker Terjemahan
                </span>
              </div>
            </div>

            <button
              onClick={() => updateSettings({ pinLockEnabled: !settings.pinLockEnabled })}
              className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
                settings.pinLockEnabled ? 'bg-purple-600 justify-end' : 'bg-slate-300 dark:bg-neutral-800 justify-start'
              }`}
            >
              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-end ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition"
          >
            Simpan & Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

