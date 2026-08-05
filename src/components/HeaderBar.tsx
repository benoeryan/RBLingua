import React from 'react';
import { 
  Globe, 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  CloudCheck, 
  Smartphone, 
  Settings, 
  MessageSquareCode,
  Sparkles,
  Sun,
  Moon,
  Tablet,
  Monitor,
  User,
  LogIn,
  Download,
  HelpCircle,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { AppSettings, TranslationMode, GoogleUserProfile } from '../types';

interface HeaderBarProps {
  mode: TranslationMode;
  setMode: (m: TranslationMode) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenSettings: () => void;
  showMobileFrame: boolean;
  setShowMobileFrame: (val: boolean) => void;
  floatingBubbleActive: boolean;
  setFloatingBubbleActive: (val: boolean) => void;
  user: GoogleUserProfile | null;
  onOpenAccountModal: () => void;
  onOpenDownloadModal?: (tab?: 'download' | 'guide') => void;
  onOpenAdminModal?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  mode,
  setMode,
  settings,
  updateSettings,
  onOpenSettings,
  showMobileFrame,
  setShowMobileFrame,
  floatingBubbleActive,
  setFloatingBubbleActive,
  user,
  onOpenAccountModal,
  onOpenDownloadModal = (_tab?: 'download' | 'guide') => {},
  onOpenAdminModal = () => {},
}) => {
  const isLight = settings.themeMode === 'light';
  const appDisplayName = settings.appName || 'RBLingua';

  const toggleThemeMode = () => {
    updateSettings({ themeMode: isLight ? 'dark' : 'light' });
  };

  const cycleDeviceView = () => {
    if (settings.deviceView === 'desktop') {
      updateSettings({ deviceView: 'tablet' });
      setShowMobileFrame(true);
    } else if (settings.deviceView === 'tablet') {
      updateSettings({ deviceView: 'mobile' });
      setShowMobileFrame(true);
    } else {
      updateSettings({ deviceView: 'desktop' });
      setShowMobileFrame(false);
    }
  };

  return (
    <header className={`border-b sticky top-0 z-30 px-3 py-2.5 backdrop-blur-md transition-colors ${
      isLight ? 'bg-white/95 border-slate-300 text-slate-900 shadow-sm' : 'bg-neutral-900/90 border-neutral-800 text-white'
    }`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
        {/* Top Title & Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {settings.customAppLogoUrl ? (
              <img
                src={settings.customAppLogoUrl}
                alt={appDisplayName}
                className="w-9 h-9 rounded-xl object-contain border bg-white p-0.5 shadow-md"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Globe className="w-5 h-5 animate-pulse" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className={`font-bold text-base md:text-lg tracking-tight flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {appDisplayName}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-bold border border-indigo-500/30">
                    AI AutoTranslate
                  </span>
                </h1>
              </div>
              <p className={`text-[11px] font-medium ${isLight ? 'text-slate-700' : 'text-neutral-400'}`}>
                Penerjemah Real-Time, Subtitel Live Meeting & Telepon
              </p>
            </div>
          </div>

          {/* Quick Badges on Mobile */}
          <div className="flex items-center gap-1.5 md:hidden">
            {/* Admin Panel Button Mobile */}
            <button
              onClick={onOpenAdminModal}
              className="p-1.5 rounded-lg bg-purple-600 text-white shadow-sm"
              title="Panel Admin"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>

            {/* Download App & Tutorial Mobile */}
            <button
              onClick={() => onOpenDownloadModal('download')}
              className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-sm"
              title="Download App & Tutorial Integrasi"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleThemeMode}
              className={`p-1.5 rounded-lg border transition ${
                isLight ? 'bg-slate-100 text-amber-700 border-slate-300' : 'bg-neutral-800 text-amber-300 border-neutral-700'
              }`}
              title={isLight ? 'Ubah ke Mode Gelap' : 'Ubah ke Mode Terang'}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Google Account Profile Button Mobile */}
            <button
              onClick={onOpenAccountModal}
              className={`p-1 rounded-xl border flex items-center gap-1 transition ${
                isLight ? 'bg-slate-100 border-slate-300' : 'bg-neutral-800 border-neutral-700'
              }`}
            >
              {user ? (
                <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-indigo-500" />
              )}
            </button>

            <button
              onClick={onOpenSettings}
              className={`p-1.5 rounded-lg transition ${
                isLight ? 'bg-slate-100 text-slate-800' : 'bg-neutral-800 text-neutral-300'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Indicators & Control Center */}
        <div className="hidden md:flex items-center gap-2">
          {/* Admin Control Panel Button */}
          <button
            onClick={onOpenAdminModal}
            className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:opacity-90 text-white shadow-md shadow-purple-500/20 transition"
            title="Kelola Admin, Upload Logo & Configuration RBLingua"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span>Panel Admin</span>
          </button>

          {/* Download App & Tutorial Button */}
          <button
            onClick={() => onOpenDownloadModal('download')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-md shadow-emerald-500/20 transition"
            title="Download App Lintas Perangkat & Panduan Integrasi WhatsApp/Zoom"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download App</span>
          </button>

          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleThemeMode}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
              isLight
                ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                : 'bg-indigo-500/20 text-amber-300 border-indigo-500/40 hover:bg-indigo-500/30'
            }`}
            title="Ganti Mode Tema (Terang / Gelap)"
          >
            {isLight ? <Sun className="w-4 h-4 text-amber-700" /> : <Moon className="w-4 h-4 text-amber-300" />}
            <span className={isLight ? 'text-amber-950 font-bold' : ''}>{isLight ? 'Terang' : 'Gelap'}</span>
          </button>

          {/* Google Account Login / Profile Button */}
          <button
            onClick={onOpenAccountModal}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition ${
              user
                ? isLight
                  ? 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:opacity-90'
            }`}
          >
            {user ? (
              <>
                <div className="relative">
                  <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover border" />
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute bottom-0 right-0 border border-white" />
                </div>
                <span className="truncate max-w-[110px]">{user.name.split(' ')[0]}</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span>Login Google</span>
              </>
            )}
          </button>

          {/* Offline Toggle Badge */}
          <button
            onClick={() => updateSettings({ offlineMode: !settings.offlineMode })}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition ${
              settings.offlineMode
                ? isLight ? 'bg-amber-100 text-amber-950 border-amber-300' : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : isLight ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {settings.offlineMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{settings.offlineMode ? 'Offline' : 'Online AI'}</span>
          </button>

          {/* Floating Bubble Toggle */}
          <button
            onClick={() => setFloatingBubbleActive(!floatingBubbleActive)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition ${
              floatingBubbleActive
                ? isLight ? 'bg-pink-100 text-pink-950 border-pink-300' : 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                : isLight ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-neutral-800 text-neutral-300 border-neutral-700'
            }`}
          >
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span>Bubble</span>
          </button>

          {/* Device Switcher */}
          <button
            onClick={cycleDeviceView}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition ${
              showMobileFrame
                ? isLight ? 'bg-blue-100 text-blue-950 border-blue-300' : 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                : isLight ? 'bg-slate-100 text-slate-900 border-slate-300' : 'bg-neutral-800 text-neutral-300 border-neutral-700'
            }`}
            title="Penyesuaian Tampilan Tipe Device"
          >
            {settings.deviceView === 'mobile' ? (
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            ) : settings.deviceView === 'tablet' ? (
              <Tablet className="w-3.5 h-3.5 text-purple-600" />
            ) : (
              <Monitor className="w-3.5 h-3.5 text-indigo-600" />
            )}
            <span className="capitalize">{settings.deviceView}</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-lg border transition ${
              isLight ? 'bg-slate-100 text-slate-900 border-slate-300 hover:bg-slate-200' : 'bg-neutral-800 text-neutral-200 border-neutral-700 hover:bg-neutral-700'
            }`}
            title="Kustomisasi & Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Modes Bar */}
      <nav className="max-w-6xl mx-auto mt-2.5 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'text', label: 'Teks & Slang', icon: Sparkles },
          { id: 'camera', label: 'Kamera OCR', icon: Globe },
          { id: 'voice', label: 'Suara 2 Arah & Call', icon: Smartphone },
          { id: 'meeting', label: 'Notulensi & Meeting Subtitle', icon: MessageSquareCode },
          { id: 'history', label: 'Loker Riwayat', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = mode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as TranslationMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20'
                  : isLight
                  ? 'bg-slate-100 text-slate-800 hover:text-slate-950 hover:bg-slate-200 border border-slate-200'
                  : 'bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};

