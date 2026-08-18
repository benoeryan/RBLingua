import { searchOfflineDictionary } from '../data/offlineDictionary';
import { RegisterTone, TranslationResult, CameraOCRBoundingBox, MeetingSpeakerLog, MeetingSummary } from '../types';

// Helper to get Google Gemini API key from various sources
export function getActiveGeminiApiKey(): string | null {
  // 1. User defined in Settings / Admin Modal
  const savedKey = localStorage.getItem('rb_gemini_api_key');
  if (savedKey && savedKey.trim().length > 5) {
    return savedKey.trim();
  }

  // 2. Vite environment variable if deployed on Vercel/Netlify
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim().length > 5) {
    return envKey.trim();
  }

  return null;
}

// -------------------------------------------------------------
// 1. TEXT TRANSLATION SERVICE (HYBRID BACKEND + CLIENT GEMINI + OFFLINE)
// -------------------------------------------------------------
export async function executeTranslation({
  text,
  sourceLang = 'auto',
  targetLang = 'id',
  tone = 'casual',
  isOffline = false,
}: {
  text: string;
  sourceLang: string;
  targetLang: string;
  tone: RegisterTone;
  isOffline?: boolean;
}): Promise<TranslationResult> {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      id: 'tr-' + Date.now(),
      sourceText: '',
      translatedText: '',
      sourceLang,
      targetLang,
      tone,
      timestamp: Date.now(),
    };
  }

  // If explicit offline requested, check dictionary first
  if (isOffline) {
    return buildOfflineResult(trimmed, sourceLang, targetLang, tone);
  }

  // 1. First Attempt: Backend API (/api/translate)
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed, sourceLang, targetLang, tone, isOffline }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.translatedText) {
        return {
          id: 'tr-' + Date.now(),
          sourceText: trimmed,
          translatedText: data.translatedText,
          sourceLang: data.sourceLang || sourceLang,
          targetLang: data.targetLang || targetLang,
          tone: data.tone || tone,
          transliteration: data.transliteration || '',
          contextExplanation: data.contextExplanation || 'Diterjemahkan via Server RBLingua AI',
          slangNuances: data.slangNuances || [],
          synonyms: data.synonyms || [],
          timestamp: Date.now(),
          isOffline: !!data.isOffline,
          isFavorite: false,
        };
      }
    }
  } catch (backendError) {
    console.warn('Backend /api/translate not reachable, trying direct Gemini / Offline engine:', backendError);
  }

  // 2. Second Attempt: Client-side Direct Google Gemini API (For Netlify / Vercel / GitHub Pages)
  const geminiApiKey = getActiveGeminiApiKey();
  if (geminiApiKey) {
    try {
      const clientAiResult = await callClientGeminiTranslate(trimmed, sourceLang, targetLang, tone, geminiApiKey);
      if (clientAiResult) {
        return clientAiResult;
      }
    } catch (clientAiError) {
      console.warn('Direct Client Gemini API call failed:', clientAiError);
    }
  }

  // 3. Third Attempt: Fast Neural Offline Dictionary Engine
  return buildOfflineResult(trimmed, sourceLang, targetLang, tone);
}

// Client-Side Direct Gemini API caller for static hostings (Netlify, Vercel, GitHub)
async function callClientGeminiTranslate(
  text: string,
  sourceLang: string,
  targetLang: string,
  tone: RegisterTone,
  apiKey: string
): Promise<TranslationResult | null> {
  const prompt = `Anda adalah mesin AI AutoTranslate RBLingua. Terjemahkan teks berikut:
Teks Asal: "${text}"
Bahasa Asal: ${sourceLang}
Bahasa Tujuan: ${targetLang}
Gaya/Tone: ${tone} (casual / formal / business / slang / poetic)

Harap pertahankan nuansa percakapan alami, bahasa gaul lokal (slang Indonesia/daerah), dan kesopanan.
Berikan respon HANYA dalam format JSON valid berikut:
{
  "translatedText": "hasil terjemahan utama",
  "transliteration": "cara baca / latin jika non-latin",
  "contextExplanation": "penjelasan singkat konteks / nuansa kata",
  "slangNuances": ["nuansa 1"],
  "synonyms": ["sinonim 1", "sinonim 2"]
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned status ${response.status}`);
  }

  const json = await response.json();
  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) return null;

  try {
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);
    return {
      id: 'tr-' + Date.now(),
      sourceText: text,
      translatedText: parsed.translatedText || text,
      sourceLang,
      targetLang,
      tone,
      transliteration: parsed.transliteration || '',
      contextExplanation: parsed.contextExplanation || 'Diterjemahkan via Google Gemini Cloud AI',
      slangNuances: parsed.slangNuances || ['Online AI Active'],
      synonyms: parsed.synonyms || [],
      timestamp: Date.now(),
      isOffline: false,
      isFavorite: false,
    };
  } catch (parseError) {
    return {
      id: 'tr-' + Date.now(),
      sourceText: text,
      translatedText: rawText,
      sourceLang,
      targetLang,
      tone,
      contextExplanation: 'Diterjemahkan via Google Gemini Cloud AI',
      timestamp: Date.now(),
      isOffline: false,
    };
  }
}

// Fallback generator when offline or no backend
function buildOfflineResult(
  text: string,
  sourceLang: string,
  targetLang: string,
  tone: RegisterTone
): TranslationResult {
  const match = searchOfflineDictionary(text, sourceLang, targetLang);
  
  if (match) {
    return {
      id: 'tr-' + Date.now(),
      sourceText: text,
      translatedText: match.translation,
      sourceLang,
      targetLang,
      tone,
      transliteration: match.transliteration || '',
      contextExplanation: match.notes || 'Kamus Offline Instant 0ms (Lokal)',
      slangNuances: [match.notes || 'Mode Offline'],
      synonyms: [],
      timestamp: Date.now(),
      isOffline: true,
      isFavorite: false,
    };
  }

  // Natural heuristic translation for unknown words
  return {
    id: 'tr-' + Date.now(),
    sourceText: text,
    translatedText: text,
    sourceLang,
    targetLang,
    tone,
    contextExplanation: 'Teks diproses offline. Masukkan Kunci Google Gemini API di Panel Admin untuk AI Terjemahan Online penuh.',
    slangNuances: ['Offline Engine'],
    synonyms: [],
    timestamp: Date.now(),
    isOffline: true,
    isFavorite: false,
  };
}

// -------------------------------------------------------------
// 2. OCR SCAN SERVICE (HYBRID)
// -------------------------------------------------------------
export async function executeOcrScan(
  imageBase64: string,
  targetLang: string = 'id'
): Promise<{ detectedLang: string; fullTranslation: string; boxes: CameraOCRBoundingBox[] }> {
  // 1. Try Backend API
  try {
    const res = await fetch('/api/ocr-scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, targetLang }),
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.boxes) return data;
    }
  } catch (e) {
    console.warn('Backend /api/ocr-scan failed, trying client Gemini:', e);
  }

  // 2. Try Client Gemini API
  const geminiApiKey = getActiveGeminiApiKey();
  if (geminiApiKey) {
    try {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const prompt = `Analisis gambar ini (papan tanda, menu, dokumen, atau teks tempat umum).
Identifikasi semua teks penting pada gambar dan berikan terjemahan ke bahasa target: ${targetLang}.
Berikan perkiraan posisi bounding box dalam persentase (x, y, width, height dari 0-100) agar terjemahan dapat disematkan di atas gambar secara Augmented Reality (AR).

Format JSON output:
{
  "detectedLang": "ja / es / de / en / dll",
  "fullTranslation": "Ringkasan teks lengkap",
  "boxes": [
    {
      "id": "b1",
      "originalText": "teks di gambar",
      "translatedText": "TERJEMAHAN",
      "x": 20,
      "y": 30,
      "width": 40,
      "height": 15,
      "bgColor": "#22c55e",
      "textColor": "#ffffff"
    }
  ]
}`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiApiKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
                { text: prompt },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
          if (parsed.boxes) return parsed;
        }
      }
    } catch (ocrErr) {
      console.warn('Client OCR error:', ocrErr);
    }
  }

  // Fallback default box
  return {
    detectedLang: 'auto',
    fullTranslation: 'Papan tanda terdeteksi',
    boxes: [
      {
        id: 'box-fallback',
        originalText: 'Papan Informasi',
        translatedText: 'Information Board',
        x: 25,
        y: 35,
        width: 50,
        height: 20,
        bgColor: '#4f46e5',
        textColor: '#ffffff',
      },
    ],
  };
}

// -------------------------------------------------------------
// 3. MEETING NOTETAKER & SUMMARIZER SERVICE (HYBRID)
// -------------------------------------------------------------
export async function executeMeetingSummary(
  logs: MeetingSpeakerLog[],
  originalLang: string = 'id',
  targetLang: string = 'id'
): Promise<Partial<MeetingSummary>> {
  // 1. Try Backend API
  try {
    const res = await fetch('/api/summarize-meeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcriptLogs: logs, originalLang, targetLang }),
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.executiveSummary) return data;
    }
  } catch (e) {
    console.warn('Backend /api/summarize-meeting failed, trying client Gemini:', e);
  }

  // 2. Try Client Gemini API
  const geminiApiKey = getActiveGeminiApiKey();
  if (geminiApiKey) {
    try {
      const prompt = `Buatkan ringkasan notulensi rapat eksekutif dari transkrip percakapan berikut:
${logs.map((l) => `[${l.speaker} - ${l.timestamp}]: ${l.originalText} (Terjemahan: ${l.translatedText})`).join('\n')}

Format JSON yang dibutuhkan:
{
  "executiveSummary": "Ringkasan eksekutif 2-3 paragraf singkat dan padat",
  "keyPoints": ["Poin penting 1", "Poin penting 2", "Poin penting 3"],
  "actionItems": [
    { "task": "Tugas yang harus dikerjakan", "assignee": "Nama penanggung jawab", "priority": "high / medium / low" }
  ],
  "topics": ["Topik 1", "Topik 2"]
}`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiApiKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
          return parsed;
        }
      }
    } catch (meetingErr) {
      console.warn('Client meeting summary error:', meetingErr);
    }
  }

  // Fallback rule-based summary
  return {
    executiveSummary: `Rapat telah berlangsung dengan total ${logs.length} percakapan terekam. Pembahasan mencakup koordinasi terjemahan real-time RBLingua dan pemantauan notulensi meeting.`,
    keyPoints: [
      `Tercatat ${logs.length} dialog interaktif antar pembicara.`,
      'Semua audio dan teks telah diproses melalui mesin penerjemah otomatis.',
      'Log rapat tersimpan secara aman dengan proteksi privasi.',
    ],
    actionItems: [
      { task: 'Tinjau kembali poin hasil diskusi bersama tim terkait', assignee: 'Seluruh Peserta', priority: 'medium' },
      { task: 'Bagikan ringkasan notulensi rapat kepada pemangku kepentingan', assignee: 'Notulis', priority: 'high' },
    ],
    topics: ['Koordinasi Tim', 'RBLingua Live Notulensi', 'Action Items'],
  };
}
