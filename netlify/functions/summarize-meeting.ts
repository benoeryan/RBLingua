import { GoogleGenAI } from '@google/genai';

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
    const { transcriptLogs, originalLang = 'id', targetLang = 'id' } = body;

    if (!transcriptLogs || !Array.isArray(transcriptLogs)) {
      return new Response(JSON.stringify({ error: 'Transkrip tidak valid' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || (process.env as any).VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          executiveSummary: `Rapat telah mencatat ${transcriptLogs.length} dialog peserta secara lokal.`,
          keyPoints: ['Pencatatan rapat berjalan dengan baik.', 'Audio telah diterjemahkan secara otomatis.'],
          actionItems: [{ task: 'Tinjau kembali log percakapan', assignee: 'Peserta', priority: 'medium' }],
          topics: ['Rapat RBLingua', 'Notulensi'],
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

    const prompt = `Buatkan ringkasan notulensi rapat eksekutif dari transkrip percakapan berikut:
${transcriptLogs.map((l: any) => `[${l.speaker} - ${l.timestamp}]: ${l.originalText} (Terjemahan: ${l.translatedText})`).join('\n')}

Format JSON:
{
  "executiveSummary": "Ringkasan eksekutif 2-3 paragraf",
  "keyPoints": ["Poin 1", "Poin 2"],
  "actionItems": [
    { "task": "Tugas", "assignee": "Penanggung jawab", "priority": "high" }
  ],
  "topics": ["Topik 1", "Topik 2"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let summaryResult = { executiveSummary: '', keyPoints: [], actionItems: [], topics: [] };
    if (response.text) {
      try {
        summaryResult = JSON.parse(response.text.trim());
      } catch (e) {
        console.error(e);
      }
    }

    return new Response(JSON.stringify(summaryResult), {
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
