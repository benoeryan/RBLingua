import type { Handler } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";
import { searchOfflineDictionary } from "../../src/data/offlineDictionary.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { "User-Agent": "aistudio-build" } },
});

const LANGUAGE_NAME_MAP: Record<string, string> = {
  id: "Indonesian",
  jv: "Javanese",
  su: "Sundanese",
  min: "Minangkabau",
  ban: "Balinese",
  bug: "Buginese",
  ace: "Acehnese",
  btk: "Batak",
  mad: "Madurese",
  en: "English",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese (Simplified)",
  "zh-TW": "Chinese (Traditional)",
  ar: "Arabic",
  es: "Spanish",
  fr: "French",
  de: "German",
  ru: "Russian",
  pt: "Portuguese",
  it: "Italian",
  nl: "Dutch",
  hi: "Hindi",
  th: "Thai",
  vi: "Vietnamese",
  tl: "Tagalog / Filipino",
  tr: "Turkish",
};

const getLanguageLabel = (code?: string) => LANGUAGE_NAME_MAP[code || ""] || (code || "target language");

const buildOfflineFallbackText = (text: string, sourceLang: string, targetLang: string) => {
  const sourceLabel = sourceLang === "auto" ? "detected source language" : getLanguageLabel(sourceLang);
  const targetLabel = getLanguageLabel(targetLang);
  return `[OFFLINE FALLBACK] Translation to ${targetLabel} unavailable. Keep original (${sourceLabel}): ${text}`;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { text, sourceLang = "auto", targetLang = "id", tone = "casual", isOffline = false } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return { statusCode: 400, body: JSON.stringify({ error: "Teks terjemahan tidak boleh kosong" }) };
    }

    if (isOffline) {
      const offlineMatch = searchOfflineDictionary(text, sourceLang, targetLang);
      if (offlineMatch) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sourceText: text,
            translatedText: offlineMatch.translation,
            sourceLang,
            targetLang,
            tone,
            transliteration: offlineMatch.transliteration || "",
            contextExplanation: offlineMatch.notes || "Diterjemahkan via Kamus Offline Lokal Instant 0ms",
            slangNuances: offlineMatch.notes ? [offlineMatch.notes] : [],
            synonyms: [],
            slangNuances: offlineFallback ? [] : ["Tambahkan pasangan kamus offline untuk hasil terjemahan lebih natural"],
        synonyms: [],
        isOffline: true,
          }),
        };
      }
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceText: text,
          translatedText: `[OFFLINE] ${text}`,
          sourceLang,
          targetLang,
          tone,
          contextExplanation: "Diproses oleh Mesin Offline On-Device (Simulasi neural lokal)",
          slangNuances: ["Mode offline diaktifkan"],
          synonyms: [],
          slangNuances: offlineFallback ? [] : ["Tambahkan pasangan kamus offline untuk hasil terjemahan lebih natural"],
        synonyms: [],
        isOffline: true,
        }),
      };
    }

    const systemInstruction = `Anda adalah mesin Auto Translate AI tingkat tinggi yang mampu menerjemahkan bahasa gaul/slang, bahasa daerah Indonesia (Sunda, Jawa, Minang, Bali, Bugis, Batak, Aceh, Madura), serta bahasa internasional (Inggris, Jepang, Korea, Arab, Mandarin, Spanyol, dll.) dengan akurasi sangat presisi.
Dengarkan instruksi tone/register:
- casual: santai, gaul, alami untuk perpesanan harian
- formal: resmi, baku, sopan
- business: profesional, gaya email & korporat
- slang: sangat kental gaya anak muda / daerah setempat
- poetic: puitis / sastra

Berikan output JSON dengan format persis:
{
  "translatedText": "hasil terjemahan utama",
  "transliteration": "cara baca / fonetik / latin jika bahasa non-latin (seperti Jepang/Korea/Arab/Jawa)",
  "contextExplanation": "penjelasan singkat konteks / perbedaan makna jika ada kata kiasan atau slang rumit",
  "slangNuances": ["nuansa 1", "nuansa 2"],
  "synonyms": ["opsi alternatif 1", "opsi alternatif 2"]
}`;

    const prompt = `Terjemahkan teks berikut:
Teks Asal: "${text}"
Bahasa Asal: ${sourceLang}
Bahasa Tujuan: ${targetLang}
Gaya/Tone: ${tone}

Pastikan jika teks mengandung slang lokal Indonesia (seperti "gimmick", "ngedrop", "gercep", "mabar", "baper") atau istilah daerah, terjemahkan dengan makna emosional dan konteks yang paling pas.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedText: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            contextExplanation: { type: Type.STRING },
            slangNuances: { type: Type.ARRAY, items: { type: Type.STRING } },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["translatedText"],
        },
      },
    });

    let jsonResult: any = { translatedText: text, transliteration: "", contextExplanation: "", slangNuances: [], synonyms: [] };
    try {
      if (response.text) {
        jsonResult = JSON.parse(response.text.trim());
      }
    } catch (e) {
      jsonResult.translatedText = response.text || text;
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceText: text,
        translatedText: jsonResult.translatedText,
        sourceLang,
        targetLang,
        tone,
        transliteration: jsonResult.transliteration || "",
        contextExplanation: jsonResult.contextExplanation || "Terjemahan AI Akurat Presisi Tinggi",
        slangNuances: jsonResult.slangNuances || [],
        synonyms: jsonResult.synonyms || [],
        isOffline: false,
      }),
    };
  } catch (error: any) {
    console.error("Error in translate function:", error);
    const body = JSON.parse(event.body || "{}");
    const offlineFallback = searchOfflineDictionary(body.text || "", body.sourceLang, body.targetLang);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sourceText: body.text || "",
        translatedText: offlineFallback?.translation || buildOfflineFallbackText(body.text || "", body.sourceLang || "auto", body.targetLang || "id"),
        sourceLang: body.sourceLang || "auto",
        targetLang: body.targetLang || "id",
        tone: body.tone || "casual",
        contextExplanation: offlineFallback ? "Mode Cadangan Cepat (Gagal terhubung ke Cloud AI)" : `Mode Cadangan Cepat: Kamus offline belum punya padanan untuk ${getLanguageLabel(body.targetLang || "id")}.`,
        slangNuances: offlineFallback ? [] : ["Tambahkan pasangan kamus offline untuk hasil terjemahan lebih natural"],
        synonyms: [],
        isOffline: true,
      }),
    };
  }
};
