import { LanguageOption } from '../types';

export const LANGUAGES: LanguageOption[] = [
  // Indonesian & Regional Dialects
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'jv', name: 'Javanese', nativeName: 'Basa Jawa (Ngoko/Krama)', flag: '🇮🇩', isLocal: true, region: 'Jawa Tengah & Timur' },
  { code: 'su', name: 'Sundanese', nativeName: 'Basa Sunda', flag: '🇮🇩', isLocal: true, region: 'Jawa Barat & Banten' },
  { code: 'min', name: 'Minangkabau', nativeName: 'Baso Minang', flag: '🇮🇩', isLocal: true, region: 'Sumatera Barat' },
  { code: 'ban', name: 'Balinese', nativeName: 'Basa Bali', flag: '🇮🇩', isLocal: true, region: 'Bali' },
  { code: 'bug', name: 'Buginese', nativeName: 'Basa Ugi', flag: '🇮🇩', isLocal: true, region: 'Sulawesi Selatan' },
  { code: 'ace', name: 'Acehnese', nativeName: 'Bahasa Acèh', flag: '🇮🇩', isLocal: true, region: 'Aceh' },
  { code: 'btk', name: 'Batak', nativeName: 'Hata Batak', flag: '🇮🇩', isLocal: true, region: 'Sumatera Utara' },
  { code: 'mad', name: 'Madurese', nativeName: 'Basa Madura', flag: '🇮🇩', isLocal: true, region: 'Madura & Jawa Timur' },

  // World Languages
  { code: 'en', name: 'English', nativeName: 'English (US/UK)', flag: '🇺🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語 (Nihongo)', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어 (Hangug-eo)', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '中文 (简体)', flag: '🇨🇳' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '中文 (繁體)', flag: '🇹🇼' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية (Al-ʻArabīyah)', flag: '🇸🇦' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'tl', name: 'Tagalog / Filipino', nativeName: 'Wikang Tagalog', flag: '🇵🇭' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
];

export function getLanguageName(code: string): string {
  const lang = LANGUAGES.find((l) => l.code === code);
  return lang ? `${lang.flag} ${lang.name}` : code.toUpperCase();
}
