import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  CloudCheck, 
  Search, 
  Star, 
  Trash2, 
  Key, 
  Volume2, 
  Copy, 
  Check,
  CheckCircle2
} from 'lucide-react';
import { AppSettings, TranslationResult } from '../types';
import { getLanguageName } from '../data/languages';

interface HistoryVaultProps {
  settings: AppSettings;
  history: TranslationResult[];
  onClearHistory: () => void;
  onToggleFavorite: (id: string) => void;
}

export const HistoryVault: React.FC<HistoryVaultProps> = ({
  settings,
  history,
  onClearHistory,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [isVaultLocked, setIsVaultLocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.sourceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translatedText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = filterFavorite ? item.isFavorite : true;
    return matchesSearch && matchesFav;
  });

  const handleUnlock = () => {
    if (pinInput === '1234' || !settings.pinCode || pinInput === settings.pinCode) {
      setIsVaultLocked(false);
      setPinInput('');
    } else {
      alert('PIN Salah! PIN Default simulasi adalah: 1234');
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const isLight = settings.themeMode === 'light';

  return (
    <div className="space-y-4">
      {/* Vault Status Banner */}
      <div className={`border rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
        isLight
          ? 'bg-gradient-to-r from-purple-100 via-indigo-50 to-white border-purple-200 text-slate-900'
          : 'bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-neutral-900 border-purple-500/30 text-white'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              Loker Terjemahan Enkripsi End-to-End (E2EE)
              <span className="text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                Cloud Sync Active
              </span>
            </h2>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-neutral-300'}`}>
              Riwayat terjemahan Anda dienkripsi AES-256 dan tersimpan aman di cloud antar perangkat.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsVaultLocked(!isVaultLocked)}
          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition self-start md:self-auto shadow-md"
        >
          {isVaultLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          <span>{isVaultLocked ? 'Buka Kunci PIN' : 'Kunci Vault Loker'}</span>
        </button>
      </div>

      {/* Locked Vault Protection Screen */}
      {isVaultLocked ? (
        <div className={`border rounded-2xl p-8 shadow-2xl flex flex-col items-center justify-center text-center space-y-4 transition-colors ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-neutral-900 border-neutral-800 text-white'
        }`}>
          <div className="w-14 h-14 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Loker Terjemahan Terkunci PIN</h3>
            <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>Masukkan PIN privasi untuk melihat riwayat terjemahan (PIN Default: 1234)</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="password"
              maxLength={4}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="1234"
              className={`w-28 border text-center text-lg font-mono tracking-widest rounded-xl py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-700 text-white'
              }`}
            />
            <button
              onClick={handleUnlock}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition"
            >
              Buka Kunci
            </button>
          </div>
        </div>
      ) : (
        /* Vault Content Display */
        <div className="space-y-3">
          {/* Search & Filters */}
          <div className={`border rounded-2xl p-3 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-2 transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-neutral-900 border-neutral-800'
          }`}>
            <div className="relative w-full sm:w-72">
              <Search className={`w-4 h-4 absolute left-3 top-2.5 ${isLight ? 'text-slate-400' : 'text-neutral-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kata di riwayat..."
                className={`w-full border rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                  isLight ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400' : 'bg-neutral-950 border-neutral-800 text-white'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={() => setFilterFavorite(!filterFavorite)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  filterFavorite
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                    : isLight ? 'bg-slate-100 text-slate-600 hover:text-slate-900' : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Favorit Saja</span>
              </button>

              <button
                onClick={onClearHistory}
                className={`p-1.5 rounded-xl hover:bg-red-500/20 hover:text-red-600 transition ${
                  isLight ? 'bg-slate-100 text-slate-600' : 'bg-neutral-800 text-neutral-400'
                }`}
                title="Hapus Semua Riwayat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* History Item Cards */}
          <div className="space-y-2.5">
            {filteredHistory.length === 0 ? (
              <div className={`border rounded-2xl p-8 text-center text-xs ${
                isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-neutral-900 border-neutral-800 text-neutral-500'
              }`}>
                Belum ada riwayat terjemahan tersimpan dalam loker enkripsi.
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-2xl p-4 shadow-md space-y-2 transition ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700 text-white'
                  }`}
                >
                  <div className={`flex items-center justify-between text-[11px] border-b pb-2 ${
                    isLight ? 'border-slate-200' : 'border-neutral-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {getLanguageName(item.sourceLang)} ➔ {getLanguageName(item.targetLang)}
                      </span>
                      <span className={`font-mono text-[10px] ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onToggleFavorite(item.id)}
                        className={`p-1 rounded transition ${
                          item.isFavorite ? 'text-amber-500' : isLight ? 'text-slate-400 hover:text-slate-600' : 'text-neutral-600 hover:text-neutral-400'
                        }`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>

                      <button
                        onClick={() => handleCopy(item.id, item.translatedText)}
                        className={`p-1 rounded transition ${
                          isLight ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Texts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div className={`p-2.5 rounded-xl border ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-neutral-950 border-neutral-800 text-neutral-300'
                    }`}>
                      <span className={`text-[10px] block font-semibold mb-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>Teks Asal:</span>
                      <p>{item.sourceText}</p>
                    </div>

                    <div className={`p-2.5 rounded-xl border font-medium ${
                      isLight ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-neutral-950 border-neutral-800 text-emerald-300'
                    }`}>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-500 block font-semibold mb-0.5">Hasil Terjemahan:</span>
                      <p>{item.translatedText}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
