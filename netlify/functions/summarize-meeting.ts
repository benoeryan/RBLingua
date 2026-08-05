import type { Handler } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { "User-Agent": "aistudio-build" } },
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { transcriptLogs, originalLang = "id", targetLang = "id" } = body;

    if (!transcriptLogs || !Array.isArray(transcriptLogs) || transcriptLogs.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Log transkrip percakapan rapat kosong" }) };
    }

    const conversationText = transcriptLogs
      .map((log: any) => `${log.speaker}: ${log.originalText}`)
      .join("\n");

    const prompt = `Berikut adalah transkrip percakapan rapat real-time:\n\n${conversationText}\n\n
Tugas Anda:
1. Buat Notulensi Rapat Otomatis yang sangat rapi dan akurat.
2. Buat Ringkasan Eksekutif (Executive Summary).
3. Ekstrak Poin-Poin Utama Diskusi (Key Discussion Points).
4. Ekstrak Action Items (Tugas & Penanggung Jawab jika ada, beserta prioritas High/Medium/Low).
5. Tentukan Topik Utama Rapat.
6. Terjemahkan juga setiap baris transkrip ke dalam bahasa target (${targetLang}).

Format JSON output wajib:
{
  "executiveSummary": "ringkasan eksekutif singkat padat dan jelas",
  "keyPoints": ["poin 1", "poin 2", "poin 3"],
  "actionItems": [
    { "task": "deskripsi tugas", "assignee": "nama pembicara", "priority": "high" }
  ],
  "topics": ["Topik 1", "Topik 2"],
  "translatedTranscripts": [
    { "id": "id1", "speaker": "Speaker Name", "translatedText": "terjemahan per baris" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            actionItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task: { type: Type.STRING },
                  assignee: { type: Type.STRING },
                  priority: { type: Type.STRING },
                },
                required: ["task"],
              },
            },
            topics: { type: Type.ARRAY, items: { type: Type.STRING } },
            translatedTranscripts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  speaker: { type: Type.STRING },
                  translatedText: { type: Type.STRING },
                },
                required: ["speaker", "translatedText"],
              },
            },
          },
          required: ["executiveSummary", "keyPoints", "actionItems"],
        },
      },
    });

    let summaryData: any = {
      executiveSummary: "Ringkasan rapat berhasil dibuat.",
      keyPoints: [],
      actionItems: [],
      topics: ["Notulensi Rapat"],
      translatedTranscripts: [],
    };

    if (response.text) {
      try {
        summaryData = JSON.parse(response.text.trim());
      } catch (e) {
        console.error("Failed to parse meeting summary:", e);
      }
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(summaryData),
    };
  } catch (error: any) {
    console.error("Error in summarize-meeting function:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Gagal membuat notulensi rapat otomatis" }) };
  }
};
