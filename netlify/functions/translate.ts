import { GoogleGenAI, Type } from '@google/genai';
import { searchOfflineDictionary } from '../../src/data/offlineDictionary';

export default async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { text, sourceLang = 'auto', targetLang = 'id', tone = 'casual', isOffline = false } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return new Response(JSON.stringify({ error: 'Teks tidak boleh kosong' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || (process.env as any).VITE_GEMINI_API_KEY;

    if (!apiKey || isOffline) {
      const match = searchOfflineDictionary(text, sourceLang, targetLang);
      return new Response(
        JSON.stringify({
          sourceText: text,
          translatedText: match ? match.translation : text,
          sourceLang,
          targetLang,
          tone,
          transliteration: match?.transliteration || '',
          contextExplanation: match?.notes || 'Mode Offline Cepat',
          slangNuances: [match?.notes || 'Offline dictionary'],
          synonyms: [],
          isOffline: true,
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' },
      },
    });

    const systemInstruction = `Anda adalah mesin Auto Translate AI tingkat tinggi RBLingua. Terjemahkan teks dengan akurasi tinggi, pertahankan nuansa gaya bahasa/tone (${tone}), istilah daerah, dan slang.`;
    const prompt = `Terjemahkan teks berikut:
Teks: "${text}"
Bahasa Asal: ${sourceLang}
Bahasa Tujuan: ${targetLang}
Gaya/Tone: ${tone}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedText: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            contextExplanation: { type: Type.STRING },
            slangNuances: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            synonyms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['translatedText'],
        },
      },
    });

    let jsonResult = { translatedText: text, transliteration: '', contextExplanation: '', slangNuances: [], synonyms: [] };
    if (response.text) {
      try {
        jsonResult = JSON.parse(response.text.trim());
      } catch (e) {
        jsonResult.translatedText = response.text;
      }
    }

    return new Response(
      JSON.stringify({
        sourceText: text,
        translatedText: jsonResult.translatedText,
        sourceLang,
        targetLang,
        tone,
        transliteration: jsonResult.transliteration || '',
        contextExplanation: jsonResult.contextExplanation || 'Terjemahan AI Akurat',
        slangNuances: jsonResult.slangNuances || [],
        synonyms: jsonResult.synonyms || [],
        isOffline: false,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: err.message || 'Gagal menerjemahkan',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
