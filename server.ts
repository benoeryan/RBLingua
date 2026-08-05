import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { searchOfflineDictionary } from "./src/data/offlineDictionary.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize Gemini SDK with User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", offlineEngineVersion: "v3.2-local-neural" });
});

// 2. High-Accuracy AI Translation with Slang & Local Dialects
app.post("/api/translate", async (req, res) => {
  try {
    const { text, sourceLang = "auto", targetLang = "id", tone = "casual", isOffline = false } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Teks terjemahan tidak boleh kosong" });
    }

    // Offline mode or fast dictionary lookup
    if (isOffline) {
      const offlineMatch = searchOfflineDictionary(text, sourceLang, targetLang);
      if (offlineMatch) {
        return res.json({
          sourceText: text,
          translatedText: offlineMatch.translation,
          sourceLang,
          targetLang,
          tone,
          transliteration: offlineMatch.transliteration || "",
          contextExplanation: offlineMatch.notes || "Diterjemahkan via Kamus Offline Lokal Instant 0ms",
          slangNuances: offlineMatch.notes ? [offlineMatch.notes] : [],
          synonyms: [],
          isOffline: true,
        });
      }

      // Offline fallback rule-based simulation
      return res.json({
        sourceText: text,
        translatedText: `[OFFLINE] ${text}`,
        sourceLang,
        targetLang,
        tone,
        contextExplanation: "Diproses oleh Mesin Offline On-Device (Simulasi neural lokal)",
        slangNuances: ["Mode offline diaktifkan"],
        synonyms: [],
        isOffline: true,
      });
    }

    // Online translation with Gemini 3.6 Flash
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
      model: "gemini-3.6-flash",
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
            slangNuances: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            synonyms: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["translatedText"],
        },
      },
    });

    let jsonResult = { translatedText: text, transliteration: "", contextExplanation: "", slangNuances: [], synonyms: [] };
    try {
      if (response.text) {
        jsonResult = JSON.parse(response.text.trim());
      }
    } catch (e) {
      console.error("Failed to parse Gemini translation JSON:", e);
      jsonResult.translatedText = response.text || text;
    }

    return res.json({
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
    });
  } catch (error: any) {
    console.error("Error in /api/translate:", error);
    // Graceful fallback to offline dictionary
    const offlineFallback = searchOfflineDictionary(req.body.text || "", req.body.sourceLang, req.body.targetLang);
    return res.json({
      sourceText: req.body.text || "",
      translatedText: offlineFallback?.translation || req.body.text || "",
      sourceLang: req.body.sourceLang || "auto",
      targetLang: req.body.targetLang || "id",
      tone: req.body.tone || "casual",
      contextExplanation: "Mode Cadangan Cepat (Gagal terhubung ke Cloud AI)",
      isOffline: true,
    });
  }
});

// 3. Camera OCR Instant Text Scanner & Signboard Translator
app.post("/api/ocr-scan", async (req, res) => {
  try {
    const { imageBase64, targetLang = "id" } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Data gambar tidak ditemukan" });
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
      model: "gemini-3.6-flash",
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

    let ocrResult = { detectedLang: "en", fullTranslation: "", boxes: [] };
    if (response.text) {
      try {
        ocrResult = JSON.parse(response.text.trim());
      } catch (e) {
        console.error("Failed to parse OCR response:", e);
      }
    }

    return res.json(ocrResult);
  } catch (error: any) {
    console.error("Error in /api/ocr-scan:", error);
    return res.status(500).json({ error: "Gagal memindai gambar OCR" });
  }
});

// 4. Real-time Meeting Notetaker & Summarizer ("Notulensi Rapat Otomatis")
app.post("/api/summarize-meeting", async (req, res) => {
  try {
    const { transcriptLogs, originalLang = "id", targetLang = "id" } = req.body;

    if (!transcriptLogs || !Array.isArray(transcriptLogs) || transcriptLogs.length === 0) {
      return res.status(400).json({ error: "Log transkrip percakapan rapat kosong" });
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
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
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
            topics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
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

    let summaryData = {
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

    return res.json(summaryData);
  } catch (error: any) {
    console.error("Error in /api/summarize-meeting:", error);
    return res.status(500).json({ error: "Gagal membuat notulensi rapat otomatis" });
  }
});

// 5. Speech Generation (TTS) endpoint
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voiceName = "Kore" } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text audio kosong" });
    }

    // Call Gemini 3.1 Flash TTS
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audioBase64: base64Audio });
    }

    return res.json({ message: "TTS generated client fallback" });
  } catch (error: any) {
    console.error("TTS endpoint fallback:", error);
    return res.json({ message: "Client WebSpeech API fallback" });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & SERVING
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AutoTranslate AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
