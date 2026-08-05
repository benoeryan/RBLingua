interface OfflineDictionaryEntry {
  source: string;
  targetLang: string;
  translation: string;
  transliteration?: string;
  notes?: string;
}

export const OFFLINE_DICTIONARY: Record<string, OfflineDictionaryEntry[]> = {
  // Indonesian to Javanese
  'id-jv': [
    { source: 'apa kabar', targetLang: 'jv', translation: 'piye kabare?', notes: 'Bahasa Jawa santai / Ngoko' },
    { source: 'terima kasih', targetLang: 'jv', translation: 'matur nuwun', notes: 'Bahasa Jawa santai/krama' },
    { source: 'terima kasih banyak', targetLang: 'jv', translation: 'matur nuwun sanget', notes: 'Bahasa Jawa krama alus' },
    { source: 'mau ke mana', targetLang: 'jv', translation: 'arep menyang ngendi?', notes: 'Ngoko' },
    { source: 'saya mau makan', targetLang: 'jv', translation: 'aku arep mangan', notes: 'Ngoko' },
    { source: 'selamat pagi', targetLang: 'jv', translation: 'sugeng enjing', notes: 'Krama alus' },
    { source: 'selamat malam', targetLang: 'jv', translation: 'sugeng dalu', notes: 'Krama alus' },
    { source: 'kamu cantik banget', targetLang: 'jv', translation: 'kowe ayu banget', notes: 'Ngoko' },
    { source: 'jangan lupa makan', targetLang: 'jv', translation: 'aja lali mangan ya', notes: 'Ngoko santai' },
    { source: 'siap bos', targetLang: 'jv', translation: 'siap ndandani / nggih bos', notes: 'Campuran santai' },
  ],

  // Indonesian to Sundanese
  'id-su': [
    { source: 'apa kabar', targetLang: 'su', translation: 'kumaha damang?', notes: 'Sunda lemes / halus' },
    { source: 'terima kasih', targetLang: 'su', translation: 'hatur nuhun', notes: 'Sunda umum' },
    { source: 'terima kasih banyak', targetLang: 'su', translation: 'hatur nuhun pisan', notes: 'Sunda lemes' },
    { source: 'mau ke mana', targetLang: 'su', translation: 'bade ka mana?', notes: 'Sunda lemes' },
    { source: 'saya mau makan', targetLang: 'su', translation: 'abdi bade tuang', notes: 'Sunda lemes' },
    { source: 'kamu lagi apa', targetLang: 'su', translation: 'nuju naon?', notes: 'Sunda lemes' },
    { source: 'bagus banget', targetLang: 'su', translation: 'sae pisan', notes: 'Sunda lemes' },
    { source: 'makan dulu yuk', targetLang: 'su', translation: 'tuang heula yu', notes: 'Sunda santai' },
  ],

  // Indonesian to Minang
  'id-min': [
    { source: 'apa kabar', targetLang: 'min', translation: 'baa kaba?', notes: 'Minang umum' },
    { source: 'terima kasih', targetLang: 'min', translation: 'tarimo kasih', notes: 'Minang' },
    { source: 'mau ke mana', targetLang: 'min', translation: 'nak ka ma?', notes: 'Minang santai' },
    { source: 'saya mau makan', targetLang: 'min', translation: 'ambo nak makan', notes: 'Minang' },
    { source: 'sangat enak', targetLang: 'min', translation: 'lamuk bana / sabana lamak', notes: 'Minang kuliner' },
    { source: 'berapa harganya', targetLang: 'min', translation: 'pira haragonyo?', notes: 'Minang transaksi' },
  ],

  // Indonesian to English
  'id-en': [
    { source: 'halo', targetLang: 'en', translation: 'Hello', transliteration: 'He-loh' },
    { source: 'apa kabar', targetLang: 'en', translation: 'How are you?', notes: 'General greeting' },
    { source: 'terima kasih', targetLang: 'en', translation: 'Thank you', notes: 'Polite' },
    { source: 'sama-sama', targetLang: 'en', translation: "You're welcome", notes: 'Response to thanks' },
    { source: 'selamat pagi', targetLang: 'en', translation: 'Good morning' },
    { source: 'selamat malam', targetLang: 'en', translation: 'Good night' },
    { source: 'sampai jumpa', targetLang: 'en', translation: 'See you later' },
    { source: 'gimmick banget', targetLang: 'en', translation: "That's so gimmicky / pure clout chasing", notes: 'Slang conversion' },
    { source: 'santai aja', targetLang: 'en', translation: 'Take it easy / Just chill', notes: 'Casual informal' },
    { source: 'mantap jiwa', targetLang: 'en', translation: 'Epic / Mindblowing!', notes: 'Indonesian slang' },
    { source: 'rapat hari ini', targetLang: 'en', translation: "Today's meeting" },
  ],

  // English to Indonesian
  'en-id': [
    { source: 'hello', targetLang: 'id', translation: 'Halo / Salam' },
    { source: 'how are you', targetLang: 'id', translation: 'Apa kabar?' },
    { source: 'thank you', targetLang: 'id', translation: 'Terima kasih' },
    { source: 'you are welcome', targetLang: 'id', translation: 'Sama-sama' },
    { source: 'good morning', targetLang: 'id', translation: 'Selamat pagi' },
    { source: 'good night', targetLang: 'id', translation: 'Selamat malam' },
    { source: 'let us grab a coffee', targetLang: 'id', translation: 'Yuk ngopi bareng / Mari minum kopi' },
    { source: 'where is the bathroom', targetLang: 'id', translation: 'Di mana toilet / kamar kecil?' },
    { source: 'how much is this', targetLang: 'id', translation: 'Berapa harganya ini?' },
  ],

  // Japanese
  'id-ja': [
    { source: 'halo', targetLang: 'ja', translation: 'こんにちは', transliteration: 'Konnichiwa' },
    { source: 'terima kasih', targetLang: 'ja', translation: 'ありがとうございます', transliteration: 'Arigatou gozaimasu' },
    { source: 'apa kabar', targetLang: 'ja', translation: 'お元気ですか？', transliteration: 'Ogenki desu ka?' },
    { source: 'pintu keluar', targetLang: 'ja', translation: '出口', transliteration: 'Deguchi', notes: 'Signs' },
    { source: 'selamat makan', targetLang: 'ja', translation: 'いただきます', transliteration: 'Itadakimasu' },
  ],

  // Arabic
  'id-ar': [
    { source: 'halo', targetLang: 'ar', translation: 'مرحبا', transliteration: 'Marhaban' },
    { source: 'apa kabar', targetLang: 'ar', translation: 'كيف حالك؟', transliteration: 'Kayfa haluk?' },
    { source: 'terima kasih', targetLang: 'ar', translation: 'شكرا جزيلا', transliteration: 'Shukran jazilan' },
    { source: 'selamat pagi', targetLang: 'ar', translation: 'صباح الخير', transliteration: 'Sabah al-khayr' },
  ]
};

export function searchOfflineDictionary(text: string, srcLang: string, tgtLang: string): OfflineDictionaryEntry | null {
  const key = `${srcLang}-${tgtLang}`;
  const normalized = text.trim().toLowerCase();
  
  const matches = OFFLINE_DICTIONARY[key];
  if (matches) {
    const exact = matches.find((m) => m.source.toLowerCase() === normalized);
    if (exact) return exact;
    
    // Partial substring match
    const partial = matches.find((m) => normalized.includes(m.source.toLowerCase()));
    if (partial) return partial;
  }

  return null;
}
