import React, { useState, useEffect } from 'react';
import { HeaderBar } from './components/HeaderBar';
import { TextTranslator } from './components/TextTranslator';
import { CameraScanner } from './components/CameraScanner';
import { VoiceConversation } from './components/VoiceConversation';
import { MeetingNotetaker } from './components/MeetingNotetaker';
import { HistoryVault } from './components/HistoryVault';
import { FloatingOverlay } from './components/FloatingOverlay';
import { SettingsModal } from './components/SettingsModal';
import { GoogleAccountModal } from './components/GoogleAccountModal';
import { AppDownloadAndGuideModal } from './components/AppDownloadAndGuideModal';
import { AdminControlModal } from './components/AdminControlModal';
import { MobileDeviceFrame } from './components/MobileDeviceFrame';
import { AppSettings, TranslationMode, TranslationResult, GoogleUserProfile } from './types';

export default function App() {
  const [mode, setMode] = useState<TranslationMode>('text');
  const [showMobileFrame, setShowMobileFrame] = useState(false);
  const [floatingBubbleActive, setFloatingBubbleActive] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadModalTab, setDownloadModalTab] = useState<'download' | 'guide'>('download');

  const handleOpenDownloadModal = (tab: 'download' | 'guide' = 'download') => {
    setDownloadModalTab(tab);
    setIsDownloadModalOpen(true);
  };

  // Google User Profile State
  const [user, setUser] = useState<GoogleUserProfile | null>(() => {
    const saved = localStorage.getItem('linguasync_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      id: 'g-987234',
      name: 'Beno Eryan',
      email: 'benoeryan21@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      syncedCount: 142,
      lastSync: '2 menit yang lalu',
    };
  });

  const handleLogin = (newUser: GoogleUserProfile) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // App Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('linguasync_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      themeMode: 'dark',
      deviceView: 'desktop',
      theme: 'amoled',
      accentColor: 'indigo',
      fontSize: 'md',
      offlineMode: false,
      e2eeEnabled: true,
      autoCloudSync: true,
      speechRate: 1.0,
      speechPitch: 1.0,
      floatingBubbleEnabled: true,
      floatingBubbleStyle: 'glowing',
      preferredLocalLang: 'jv',
      pinLockEnabled: false,
      pinCode: '1234',
    };
  });

  // Saved Translation History State
  const [history, setHistory] = useState<TranslationResult[]>(() => {
    const saved = localStorage.getItem('linguasync_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'h-1',
        sourceText: 'Jujurly ini gimmick banget sih, tapi tetep gercep mabar bareng temen.',
        translatedText: 'Honestly this is pure marketing gimmick, but still fast-moving to play games with friends.',
        sourceLang: 'id',
        targetLang: 'en',
        tone: 'casual',
        contextExplanation: 'Terjemahan slang gaul Indonesia dengan penyesuaian makna konteks.',
        timestamp: Date.now() - 3600000,
        isOffline: false,
        isFavorite: true,
      },
      {
        id: 'h-2',
        sourceText: 'Kumaha damang teteh? Wilujeng sumping ka Bandung.',
        translatedText: 'How are you sister? Welcome to Bandung.',
        sourceLang: 'su',
        targetLang: 'en',
        tone: 'formal',
        contextExplanation: 'Bahasa Sunda lemes (halus) untuk sapaan sopan.',
        timestamp: Date.now() - 7200000,
        isOffline: true,
        isFavorite: false,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('linguasync_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('linguasync_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('linguasync_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('linguasync_user');
    }
  }, [user]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleSaveHistory = (result: TranslationResult) => {
    setHistory((prev) => [result, ...prev]);
  };

  const handleToggleFavorite = (id: string) => {
    setHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const handleClearHistory = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat terjemahan?')) {
      setHistory([]);
    }
  };

  const isLight = settings.themeMode === 'light';

  // Theme Class Mapping
  const themeClassMap = {
    amoled: isLight ? 'bg-slate-50 text-slate-900' : 'bg-black text-neutral-100',
    nordic: isLight ? 'bg-blue-50 text-slate-900' : 'bg-slate-950 text-slate-100',
    emerald: isLight ? 'bg-emerald-50 text-emerald-950' : 'bg-emerald-950 text-emerald-100',
    warm: isLight ? 'bg-amber-50 text-stone-900' : 'bg-stone-950 text-stone-100',
    sunset: isLight ? 'bg-purple-50 text-purple-950' : 'bg-purple-950 text-purple-100',
  };

  return (
    <MobileDeviceFrame deviceView={showMobileFrame ? settings.deviceView : 'desktop'} isLight={isLight}>
      <div className={`min-h-screen ${themeClassMap[settings.theme || 'amoled']} font-sans transition-colors duration-300 pb-12 relative`}>
        {/* Navigation & Header */}
        <HeaderBar
          mode={mode}
          setMode={setMode}
          settings={settings}
          updateSettings={updateSettings}
          onOpenSettings={() => setIsSettingsOpen(true)}
          showMobileFrame={showMobileFrame}
          setShowMobileFrame={setShowMobileFrame}
          floatingBubbleActive={floatingBubbleActive}
          setFloatingBubbleActive={setFloatingBubbleActive}
          user={user}
          onOpenAccountModal={() => setIsAccountModalOpen(true)}
          onOpenDownloadModal={handleOpenDownloadModal}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
        />

        {/* Main Body Screen */}
        <main className="max-w-4xl mx-auto px-3.5 py-4">
          {mode === 'text' && (
            <TextTranslator settings={settings} onSaveHistory={handleSaveHistory} />
          )}

          {mode === 'camera' && <CameraScanner settings={settings} />}

          {mode === 'voice' && <VoiceConversation settings={settings} />}

          {mode === 'meeting' && <MeetingNotetaker settings={settings} />}

          {mode === 'history' && (
            <HistoryVault
              settings={settings}
              history={history}
              onClearHistory={handleClearHistory}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </main>

        {/* Floating Bubble Widget (Jendela Mengambang over WhatsApp/Web) */}
        {floatingBubbleActive && <FloatingOverlay settings={settings} />}

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          updateSettings={updateSettings}
          user={user}
          onOpenAccountModal={() => setIsAccountModalOpen(true)}
        />

        {/* Google Account Login / Profile Management Modal */}
        <GoogleAccountModal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
          settings={settings}
          updateSettings={updateSettings}
        />

        {/* Admin Control & App Settings Panel Modal */}
        <AdminControlModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          settings={settings}
          updateSettings={updateSettings}
        />

        {/* App Download & Cross-Platform Integration Guide Modal */}
        <AppDownloadAndGuideModal
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
          settings={settings}
          initialTab={downloadModalTab}
        />
      </div>
    </MobileDeviceFrame>
  );
}

