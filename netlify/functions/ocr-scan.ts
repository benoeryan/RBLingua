import { GoogleGenAI, Type } from '@google/genai';

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
    const { imageBase64, targetLang = 'id' } = body;

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: 'Gambar tidak ditemukan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || (process.env as any).VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          detectedLang: 'auto',
          fullTranslation: 'Papan tanda',
          boxes: [
            {
              id: 'b1',
              originalText: 'Information',
              translatedText: 'Informasi',
              x: 25,
              y: 35,
              width: 50,
              height: 20,
              bgColor: '#4f46e5',
              textColor: '#ffffff',
            },
          ],
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

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const prompt = `Analisis gambar ini dan berikan terjemahan OCR ke bahasa target: ${targetLang}. Berikan bounding boxes estimasi x, y, width, height (0-100).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedLang: { type: Type.STRING },
            fullTranslation: { type: Type.STRING },
            boxes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  originalText: { type: Type.STRING },
                  translatedText: { type: Type.STRING },
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  width: { type: Type.NUMBER },
                  height: { type: Type.NUMBER },
                  bgColor: { type: Type.STRING },
                  textColor: { type: Type.STRING },
                },
                required: ['id', 'originalText', 'translatedText', 'x', 'y', 'width', 'height'],
              },
            },
          },
          required: ['detectedLang', 'boxes'],
        },
      },
    });

    let ocrResult = { detectedLang: 'en', fullTranslation: '', boxes: [] };
    if (response.text) {
      try {
        ocrResult = JSON.parse(response.text.trim());
      } catch (e) {
        console.error(e);
      }
    }

    return new Response(JSON.stringify(ocrResult), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
