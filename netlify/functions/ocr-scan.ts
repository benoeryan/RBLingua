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
    const { imageBase64, targetLang = "id" } = body;

    if (!imageBase64) {
      return { statusCode: 400, body: JSON.stringify({ error: "Data gambar tidak ditemukan" }) };
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

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

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
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
                required: ["id", "originalText", "translatedText", "x", "y", "width", "height"],
              },
            },
          },
          required: ["detectedLang", "boxes"],
        },
      },
    });

    let ocrResult: any = { detectedLang: "en", fullTranslation: "", boxes: [] };
    if (response.text) {
      try {
        ocrResult = JSON.parse(response.text.trim());
      } catch (e) {
        console.error("Failed to parse OCR response:", e);
      }
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ocrResult),
    };
  } catch (error: any) {
    console.error("Error in ocr-scan function:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Gagal memindai gambar OCR" }) };
  }
};
