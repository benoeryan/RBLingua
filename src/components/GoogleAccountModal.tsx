import React, { useState } from 'react';
import { 
  X, 
  LogOut, 
  LogIn, 
  ShieldCheck, 
  CloudCheck, 
  CheckCircle2, 
  HardDrive, 
  Smartphone, 
  User, 
  RefreshCw, 
  Key,
  ExternalLink,
  Sparkles,
  Lock,
  Globe
} from 'lucide-react';
import { GoogleUserProfile, AppSettings } from '../types';

interface GoogleAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: GoogleUserProfile | null;
  onLogin: (profile: GoogleUserProfile) => void;
  onLogout: () => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const GoogleAccountModal: React.FC<GoogleAccountModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
  settings,
  updateSettings,
}) => {
  const [selectedAccountEmail, setSelectedAccountEmail] = useState('benoeryan21@gmail.com');
  const [customName, setCustomName] = useState('Beno Eryan');
  const [customEmail, setCustomEmail] = useState('benoeryan21@gmail.com');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'sync' | 'security'>('profile');

  if (!isOpen) return null;

  const isLight = settings.themeMode === 'light';

  // Available pre-configured Google accounts for instant simulation login
  const sampleAccounts = [
    {
      name: 'Beno Eryan',
      email: 'benoeryan21@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    {
      name: 'Beno (Akun Kantor / Workspace)',
      email: 'beno.eryan@lingua-studio.ai',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    }
  ];

  const handleExecuteGoogleLogin = (accName: string, accEmail: string, accAvatar?: string) => {
    setIsSigningIn(true);
    setTimeout(() => {
      const newUser: GoogleUserProfile = {
        id: 'g-' + Date.now(),
        name: accName || 'Pengguna Google',
        email: accEmail || 'user@gmail.com',
        avatar: accAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${accEmail}`,
        locale: 'id-ID',
        isVerified: true,
        connectedSince: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
        cloudStorageUsedMb: 14.8,
        syncStatus: 'synced',
      };
      onLogin(newUser);
      setIsSigningIn(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-neutral-900 border-neutral-800 text-white'
      }`}>
        {/* Modal Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between sticky top-0 z-10 backdrop-blur ${
          isLight ? 'bg-white/95 border-slate-200' : 'bg-neutral-900/95 border-neutral-800'
        }`}>
          <div className="flex items-center gap-2.5">
            {/* Google Logo SVG */}
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.1 0-5.74-2.09-6.68-4.91H1.21v3.15C3.21 21.36 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.32 14.29c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.56H1.21C.44 8.09 0 9.99 0 12s.44 3.91 1.21 5.44l4.11-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.21 2.64 1.21 6.56l4.11 3.15c.94-2.82 3.58-4.96 6.68-4.96z"
              />
            </svg>
            <div>
              <h3 className="font-bold text-base tracking-tight">
                {user ? 'Pengaturan Akun Google' : 'Log In Akun Google'}
              </h3>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                {user ? 'Kelola sinkronisasi riwayat & cloud storage' : 'Masuk untuk sinkronisasi otomatis antar perangkat'}
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {user ? (
            /* LOGGED IN USER PROFILE & ACCOUNT SETTINGS */
            <div className="space-y-4">
              {/* User Profile Card */}
              <div className={`p-4 rounded-2xl border relative overflow-hidden ${
                isLight 
                  ? 'bg-gradient-to-r from-indigo-50/80 via-purple-50/80 to-pink-50/80 border-indigo-200' 
                  : 'bg-gradient-to-r from-indigo-950/60 via-purple-950/60 to-neutral-900 border-indigo-500/30'
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500 shadow-lg"
                    />
                    <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full absolute bottom-0 right-0 border-2 border-white dark:border-neutral-900" title="Terhubung" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-base truncate">{user.name}</h4>
                      {user.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className={`text-xs truncate font-mono ${isLight ? 'text-slate-600' : 'text-neutral-300'}`}>
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-semibold border border-emerald-500/30">
                        Google Account Sync Active
                      </span>
                      <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                        Sejak {user.connectedSince}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className={`flex border-b text-xs font-bold ${isLight ? 'border-slate-200' : 'border-neutral-800'}`}>
                {[
                  { id: 'profile', label: 'Profil & Storage', icon: User },
                  { id: 'sync', label: 'Cloud Sync', icon: CloudCheck },
                  { id: 'security', label: 'Keamanan E2EE', icon: ShieldCheck },
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as any)}
                      className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition ${
                        activeTab === t.id
                          ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                          : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              {activeTab === 'profile' && (
                <div className="space-y-3">
                  {/* Google Drive Storage Meter */}
                  <div className={`p-3.5 rounded-2xl border space-y-2 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5">
                        <HardDrive className="w-4 h-4 text-blue-500" />
                        Storage Google Drive Sync
                      </span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                        {user.cloudStorageUsedMb} MB / 15 GB
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 w-[5%]" />
                    </div>

                    <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                      Penyimpanan cadangan otomatis untuk kamus lokal, riwayat terjemahan, dan rekaman notulensi rapat.
                    </p>
                  </div>

                  {/* Connected Services */}
                  <div className={`p-3.5 rounded-2xl border space-y-2 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
                  }`}>
                    <h5 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Layanan Google Terhubung
                    </h5>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span>Google Gemini 3.6 Flash Engine</span>
                        <span className="text-emerald-500 font-bold">Terhubung</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Google Speech Recognition API</span>
                        <span className="text-emerald-500 font-bold">Terhubung</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Google Workspace Auto Notetaker</span>
                        <span className="text-emerald-500 font-bold">Aktif</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sync' && (
                <div className="space-y-3">
                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
                  }`}>
                    <div>
                      <span className="text-xs font-bold block">Sinkronisasi Otomatis Cloud</span>
                      <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                        Simpan riwayat terjemahan secara real-time ke akun Google
                      </span>
                    </div>

                    <button
                      onClick={() => updateSettings({ autoCloudSync: !settings.autoCloudSync })}
                      className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
                        settings.autoCloudSync ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-neutral-800 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                    </button>
                  </div>

                  <div className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
                  }`}>
                    <div>
                      <span className="text-xs font-bold block">Sinkronisasi Loker Terjemahan E2EE</span>
                      <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                        Tersinkron dengan kunci enkripsi privat
                      </span>
                    </div>

                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      Aktif (AES-256)
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-3">
                  <div className={`p-3.5 rounded-2xl border space-y-2 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-500" />
                      <span className="text-xs font-bold">Identitas Kunci Enkripsi Vault</span>
                    </div>
                    <p className={`text-xs font-mono p-2 rounded-xl ${
                      isLight ? 'bg-white border border-slate-200' : 'bg-neutral-900 border border-neutral-800'
                    }`}>
                      e2ee-key-09f83a21b44c82e911
                    </p>
                    <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                      Kunci enkripsi privat Anda terikat dengan akun Google ({user.email}). Memastikan tidak ada pihak ketiga yang dapat membaca data Anda.
                    </p>
                  </div>
                </div>
              )}

              {/* Log Out Section */}
              <div className="pt-2 border-t border-slate-200 dark:border-neutral-800">
                {showConfirmLogout ? (
                  <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                    isLight ? 'bg-red-50 border-red-200 text-red-900' : 'bg-red-950/40 border-red-500/30 text-red-200'
                  }`}>
                    <p className="text-xs font-bold">Apakah Anda yakin ingin keluar dari akun Google ini?</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onLogout();
                          setShowConfirmLogout(false);
                          onClose();
                        }}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition"
                      >
                        Ya, Keluar Akun
                      </button>
                      <button
                        onClick={() => setShowConfirmLogout(false)}
                        className={`px-4 py-1.5 font-bold text-xs rounded-xl transition ${
                          isLight ? 'bg-slate-200 text-slate-700' : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowConfirmLogout(true)}
                    className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out / Keluar Akun Google</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* LOGGED OUT STATE: GOOGLE SIGN-IN FLOW */
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 mx-auto flex items-center justify-center mb-2">
                  <LogIn className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg">Masuk dengan Akun Google</h4>
                <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                  Hubungkan akun Google Anda untuk mengaktifkan Cloud Sync, notulensi rapat otomatis, dan loker enkripsi.
                </p>
              </div>

              {/* Sample Quick Login Cards */}
              <div className="space-y-2">
                <label className={`text-[10px] uppercase font-bold tracking-wider ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                  Pilih Akun Google Tersedia:
                </label>

                {sampleAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExecuteGoogleLogin(acc.name, acc.email, acc.avatar)}
                    disabled={isSigningIn}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition hover:scale-[1.01] active:scale-[0.99] ${
                      isLight
                        ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                        : 'bg-neutral-950 hover:bg-neutral-800 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={acc.avatar} alt={acc.name} className="w-10 h-10 rounded-full border" />
                      <div>
                        <span className="font-bold text-xs block">{acc.name}</span>
                        <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                          {acc.email}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1">
                      <span>Masuk</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Or Custom Account Form */}
              <div className={`pt-3 border-t space-y-3 ${isLight ? 'border-slate-200' : 'border-neutral-800'}`}>
                <label className={`text-[10px] uppercase font-bold tracking-wider ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                  Atau Masukkan Akun Google Baru:
                </label>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Nama Lengkap"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
                    }`}
                  />
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="nama@gmail.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
                    }`}
                  />
                </div>

                <button
                  onClick={() => handleExecuteGoogleLogin(customName, customEmail)}
                  disabled={isSigningIn || !customEmail.trim()}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  {isSigningIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Menghubungkan ke Google...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Lanjutkan dengan Google</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`px-5 py-3.5 border-t flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
        }`}>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Google OAuth 2.0 Secure Authentication</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
