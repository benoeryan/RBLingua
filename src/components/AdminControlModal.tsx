import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Users, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Key, 
  Lock, 
  Check, 
  Sparkles, 
  Sliders, 
  AlertCircle,
  Globe,
  Settings,
  UserCheck,
  UserX,
  Edit2,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { AppSettings, AdminUser, AdminAppSettings } from '../types';

interface AdminControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const AdminControlModal: React.FC<AdminControlModalProps> = ({
  isOpen,
  onClose,
  settings,
  updateSettings,
}) => {
  if (!isOpen) return null;

  const isLight = settings.themeMode === 'light';
  const [activeTab, setActiveTab] = useState<'admins' | 'branding' | 'config' | 'logs'>('admins');

  // Admin Users List State
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: 'adm-1',
      name: 'Beno Eryan (Super Admin)',
      email: 'benoeryan21@gmail.com',
      role: 'super_admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      lastLogin: '2026-08-04 22:50',
      createdAt: '2026-01-10',
    },
    {
      id: 'adm-2',
      name: 'Rian Prasetyo (System Admin)',
      email: 'admin.system@rblingua.ai',
      role: 'system_admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      lastLogin: '2026-08-04 21:15',
      createdAt: '2026-03-15',
    },
    {
      id: 'adm-3',
      name: 'Sari Wulandari (Translator Admin)',
      email: 'sari.translator@rblingua.ai',
      role: 'translator_admin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      status: 'active',
      lastLogin: '2026-08-03 18:30',
      createdAt: '2026-05-20',
    },
  ]);

  // New Admin Form State
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'super_admin' | 'system_admin' | 'translator_admin'>('translator_admin');

  // Branding Settings State
  const [appNameInput, setAppNameInput] = useState(settings.appName || 'RBLingua');
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.customAppLogoUrl || null);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  // App Config State
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState(
    () => localStorage.getItem('rb_gemini_api_key') || ''
  );
  const [testApiLoading, setTestApiLoading] = useState(false);
  const [testApiResult, setTestApiResult] = useState<{ success: boolean; message: string } | null>(null);
  const [customPromptInput, setCustomPromptInput] = useState(
    'Anda adalah AI Translator Profesional RBLingua. Terjemahkan teks dengan akurasi tinggi, pertahankan nuansa budaya, bahasa daerah, dan bahasa gaul slang.'
  );

  // Test API Key
  const handleTestApiKey = async () => {
    if (!geminiApiKeyInput.trim()) {
      setTestApiResult({ success: false, message: 'Harap masukkan Kunci API Gemini terlebih dahulu.' });
      return;
    }

    setTestApiLoading(true);
    setTestApiResult(null);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiApiKeyInput.trim())}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Halo, terjemahkan kata "Selamat" ke bahasa Inggris dalam 1 kata.' }] }],
        }),
      });

      if (res.ok) {
        setTestApiResult({ success: true, message: 'Koneksi Berhasil! Google Gemini AI siap digunakan.' });
        localStorage.setItem('rb_gemini_api_key', geminiApiKeyInput.trim());
      } else {
        const errorData = await res.json().catch(() => ({}));
        setTestApiResult({
          success: false,
          message: errorData?.error?.message || `Gagal terhubung (Status ${res.status}). Periksa validitas API key Anda.`,
        });
      }
    } catch (e: any) {
      setTestApiResult({ success: false, message: `Error koneksi: ${e.message || 'Periksa jaringan internet.'}` });
    } finally {
      setTestApiLoading(false);
    }
  };

  // Handle Save System Config
  const handleSaveConfig = () => {
    localStorage.setItem('rb_gemini_api_key', geminiApiKeyInput.trim());
    setSavedSuccessMsg('Kunci API & Konfigurasi Berhasil Disimpan!');
    setTimeout(() => setSavedSuccessMsg(null), 3000);
  };

  // Handle Logo Upload File
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save Branding Settings
  const handleSaveBranding = () => {
    updateSettings({
      appName: appNameInput,
      customAppLogoUrl: logoPreview,
    });
    setSavedSuccessMsg('Pengaturan Branding & Logo RBLingua Berhasil Disimpan!');
    setTimeout(() => setSavedSuccessMsg(null), 3000);
  };

  // Add Admin Handler
  const handleAddAdmin = () => {
    if (!newAdminName || !newAdminEmail) return;
    const newAdmin: AdminUser = {
      id: 'adm-' + Date.now(),
      name: newAdminName,
      email: newAdminEmail,
      role: newAdminRole,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newAdminName)}`,
      status: 'active',
      lastLogin: 'Belum Pernah',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAdmins((prev) => [...prev, newAdmin]);
    setNewAdminName('');
    setNewAdminEmail('');
    setShowAddAdminModal(false);
  };

  // Toggle Admin Status
  const handleToggleAdminStatus = (id: string) => {
    setAdmins((prev) =>
      prev.map((adm) =>
        adm.id === id
          ? { ...adm, status: adm.status === 'active' ? 'suspended' : 'active' }
          : adm
      )
    );
  };

  // Delete Admin
  const handleDeleteAdmin = (id: string) => {
    setAdmins((prev) => prev.filter((adm) => adm.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-4xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-neutral-900 border-neutral-800 text-white'
      }`}>
        {/* Header Modal */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isLight ? 'border-slate-200 bg-slate-50' : 'border-neutral-800 bg-neutral-950'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Panel Kontrol Admin RBLingua
                <span className="text-[10px] bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-mono border border-purple-500/30">
                  SuperAdmin Mode
                </span>
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                Kelola akun admin, konfigurasi branding, logo aplikasi, dan parameter AI RBLingua.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition ${
              isLight ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-neutral-800 text-neutral-300'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`px-4 pt-3 border-b flex items-center gap-2 overflow-x-auto ${
          isLight ? 'border-slate-200 bg-white' : 'border-neutral-800 bg-neutral-900'
        }`}>
          {[
            { id: 'admins', label: 'Kelola Akun Admin', icon: Users },
            { id: 'branding', label: 'Setting Logo & Nama App', icon: ImageIcon },
            { id: 'config', label: 'Konfigurasi Sistem & API', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition shrink-0 ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'border-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {savedSuccessMsg && (
            <div className="p-3 bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{savedSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: KELOLA AKUN ADMIN */}
          {activeTab === 'admins' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Daftar Administrator Sistem RBLingua ({admins.length} Admin)
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                    Daftar akun yang berhak mengakses panel kontrol dan mengelola konfigurasi aplikasi.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddAdminModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Admin Baru</span>
                </button>
              </div>

              {/* Admin Table / List */}
              <div className="space-y-2.5">
                {admins.map((adm) => (
                  <div
                    key={adm.id}
                    className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={adm.avatar} alt={adm.name} className="w-10 h-10 rounded-full object-cover border" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{adm.name}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            adm.role === 'super_admin'
                              ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                              : adm.role === 'system_admin'
                              ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                              : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {adm.role.replace('_', ' ')}
                          </span>
                        </div>
                        <p className={`text-xs ${isLight ? 'text-slate-600 font-medium' : 'text-neutral-400'}`}>{adm.email}</p>
                        <p className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
                          Login Terakhir: {adm.lastLogin} • Dibuat: {adm.createdAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleToggleAdminStatus(adm.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1 ${
                          adm.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30 hover:bg-red-500/20'
                        }`}
                      >
                        {adm.status === 'active' ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                        <span>{adm.status === 'active' ? 'Aktif' : 'Tersuspensi'}</span>
                      </button>

                      {adm.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDeleteAdmin(adm.id)}
                          className={`p-2 rounded-xl text-xs font-bold border transition hover:bg-red-500/20 hover:text-red-600 ${
                            isLight ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-neutral-800 border-neutral-700 text-neutral-300'
                          }`}
                          title="Hapus Admin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Admin Modal Form */}
              {showAddAdminModal && (
                <div className={`p-4 rounded-2xl border space-y-3 mt-4 ${
                  isLight ? 'bg-indigo-50/80 border-indigo-200' : 'bg-neutral-950 border-indigo-500/40'
                }`}>
                  <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Form Tambah Administrator RBLingua Baru
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className={`block font-bold mb-1 ${isLight ? 'text-slate-800' : 'text-neutral-300'}`}>Nama Lengkap</label>
                      <input
                        type="text"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        placeholder="Contoh: Ahmad Subagyo"
                        className={`w-full border rounded-xl px-3 py-2 focus:outline-none ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-neutral-900 border-neutral-700 text-white'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block font-bold mb-1 ${isLight ? 'text-slate-800' : 'text-neutral-300'}`}>Email Admin</label>
                      <input
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="admin@rblingua.ai"
                        className={`w-full border rounded-xl px-3 py-2 focus:outline-none ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-neutral-900 border-neutral-700 text-white'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block font-bold mb-1 ${isLight ? 'text-slate-800' : 'text-neutral-300'}`}>Peran / Role</label>
                      <select
                        value={newAdminRole}
                        onChange={(e) => setNewAdminRole(e.target.value as any)}
                        className={`w-full border rounded-xl px-3 py-2 focus:outline-none ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-neutral-900 border-neutral-700 text-white'
                        }`}
                      >
                        <option value="translator_admin">Translator Admin</option>
                        <option value="system_admin">System Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowAddAdminModal(false)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                        isLight ? 'bg-slate-200 text-slate-800' : 'bg-neutral-800 text-white'
                      }`}
                    >
                      Batal
                    </button>

                    <button
                      onClick={handleAddAdmin}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
                    >
                      Simpan Admin Baru
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SETTING BRANDING & UPLOAD LOGO */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border space-y-4 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
              }`}>
                <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <ImageIcon className="w-4 h-4 text-indigo-500" />
                  Kustomisasi Nama Aplikasi & Upload Logo Resmi
                </h3>

                {/* App Name Setting */}
                <div>
                  <label className={`block text-xs font-bold mb-1 ${isLight ? 'text-slate-800' : 'text-neutral-200'}`}>
                    Nama Aplikasi Resmi
                  </label>
                  <input
                    type="text"
                    value={appNameInput}
                    onChange={(e) => setAppNameInput(e.target.value)}
                    placeholder="RBLingua"
                    className={`w-full max-w-md border rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-neutral-900 border-neutral-700 text-white'
                    }`}
                  />
                  <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                    Nama ini akan muncul di Header Bar, Notulensi AI, dan seluruh laporan resmi.
                  </p>
                </div>

                {/* Logo Upload Section */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-neutral-800">
                  <label className={`block text-xs font-bold ${isLight ? 'text-slate-800' : 'text-neutral-200'}`}>
                    Logo Khusus Aplikasi (Custom Logo)
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Logo Preview Container */}
                    <div className={`w-20 h-20 rounded-2xl border-2 border-dashed flex items-center justify-center p-2 relative overflow-hidden ${
                      isLight ? 'bg-white border-slate-300' : 'bg-neutral-900 border-neutral-700'
                    }`}>
                      {logoPreview ? (
                        <img src={logoPreview} alt="App Logo" className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-center">
                          <Globe className="w-8 h-8 text-indigo-500 mx-auto" />
                          <span className="text-[9px] text-slate-400 block mt-1">Default Logo</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 text-xs">
                      <label className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer inline-flex items-center gap-2 transition shadow-md">
                        <Upload className="w-4 h-4" />
                        <span>Upload File Logo (PNG/JPG/SVG)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>

                      {logoPreview && (
                        <button
                          onClick={() => setLogoPreview(null)}
                          className={`ml-2 px-3 py-2 rounded-xl border text-xs font-bold transition ${
                            isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-neutral-800 border-neutral-700 text-neutral-300'
                          }`}
                        >
                          Hapus Custom Logo
                        </button>
                      )}

                      <p className={`text-[11px] ${isLight ? 'text-slate-600 font-medium' : 'text-neutral-400'}`}>
                        Rekomendasi ukuran: 512x512 piksel, latar belakang transparan (PNG).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-neutral-800 flex justify-end">
                  <button
                    onClick={handleSaveBranding}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan Branding RBLingua</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KONFIGURASI SISTEM & API */}
          {activeTab === 'config' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-2xl border space-y-4 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
              }`}>
                <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <Key className="w-4 h-4 text-indigo-500" />
                  Kunci API Gemini & Prompt Sistem RBLingua
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className={`block font-bold mb-1 ${isLight ? 'text-slate-800' : 'text-neutral-200'}`}>
                      Kunci Google Gemini API (AI Studio)
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="password"
                        placeholder="Masukkan API Key (cth: AIzaSy...)"
                        value={geminiApiKeyInput}
                        onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                        className={`flex-1 border rounded-xl px-3 py-2 font-mono text-xs focus:outline-none ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-neutral-900 border-neutral-700 text-white'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleTestApiKey}
                        disabled={testApiLoading}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition"
                      >
                        {testApiLoading ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Zap className="w-3.5 h-3.5" />
                        )}
                        <span>{testApiLoading ? 'Menguji...' : 'Uji Koneksi API'}</span>
                      </button>
                    </div>

                    {testApiResult && (
                      <div className={`mt-2 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                        testApiResult.success
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                          : 'bg-red-500/15 border-red-500/30 text-red-800 dark:text-red-300'
                      }`}>
                        {testApiResult.success ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        )}
                        <span>{testApiResult.message}</span>
                      </div>
                    )}

                    <p className={`text-[11px] mt-1.5 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
                      Kunci API ini otomatis tersimpan di browser untuk menerjemahkan secara instan di hosting statis (Netlify / Vercel / GitHub Pages).
                    </p>
                  </div>

                  <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                    isLight ? 'bg-indigo-50/70 border-indigo-100 text-slate-800' : 'bg-indigo-950/30 border-indigo-900/50 text-indigo-200'
                  }`}>
                    <p className="font-bold flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                      <Globe className="w-3.5 h-3.5" />
                      Petunjuk Khusus Netlify / Vercel:
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      Untuk memastikan penerjemah bekerja 100% tanpa perlu memasukkan API key manual di setiap browser pengguna, tambahkan environment variable di dashboard host Anda:
                      <br />
                      Nama variabel: <code className="font-mono font-bold bg-black/10 dark:bg-black/40 px-1 py-0.5 rounded">GEMINI_API_KEY</code> atau <code className="font-mono font-bold bg-black/10 dark:bg-black/40 px-1 py-0.5 rounded">VITE_GEMINI_API_KEY</code>.
                    </p>
                  </div>

                  <div>
                    <label className={`block font-bold mb-1 ${isLight ? 'text-slate-800' : 'text-neutral-200'}`}>
                      System Prompt AI AutoTranslate RBLingua
                    </label>
                    <textarea
                      rows={3}
                      value={customPromptInput}
                      onChange={(e) => setCustomPromptInput(e.target.value)}
                      className={`w-full border rounded-xl p-3 focus:outline-none ${
                        isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-neutral-900 border-neutral-700 text-white'
                      }`}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-neutral-800 flex justify-end">
                  <button
                    onClick={handleSaveConfig}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Simpan Konfigurasi Sistem</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
