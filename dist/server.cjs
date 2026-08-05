var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);

// src/data/offlineDictionary.ts
var OFFLINE_DICTIONARY = {
  // Indonesian to Javanese
  "id-jv": [
    { source: "apa kabar", targetLang: "jv", translation: "piye kabare?", notes: "Bahasa Jawa santai / Ngoko" },
    { source: "terima kasih", targetLang: "jv", translation: "matur nuwun", notes: "Bahasa Jawa santai/krama" },
    { source: "terima kasih banyak", targetLang: "jv", translation: "matur nuwun sanget", notes: "Bahasa Jawa krama alus" },
    { source: "mau ke mana", targetLang: "jv", translation: "arep menyang ngendi?", notes: "Ngoko" },
    { source: "saya mau makan", targetLang: "jv", translation: "aku arep mangan", notes: "Ngoko" },
    { source: "selamat pagi", targetLang: "jv", translation: "sugeng enjing", notes: "Krama alus" },
    { source: "selamat malam", targetLang: "jv", translation: "sugeng dalu", notes: "Krama alus" },
    { source: "kamu cantik banget", targetLang: "jv", translation: "kowe ayu banget", notes: "Ngoko" },
    { source: "jangan lupa makan", targetLang: "jv", translation: "aja lali mangan ya", notes: "Ngoko santai" },
    { source: "siap bos", targetLang: "jv", translation: "siap ndandani / nggih bos", notes: "Campuran santai" }
  ],
  // Indonesian to Sundanese
  "id-su": [
    { source: "apa kabar", targetLang: "su", translation: "kumaha damang?", notes: "Sunda lemes / halus" },
    { source: "terima kasih", targetLang: "su", translation: "hatur nuhun", notes: "Sunda umum" },
    { source: "terima kasih banyak", targetLang: "su", translation: "hatur nuhun pisan", notes: "Sunda lemes" },
    { source: "mau ke mana", targetLang: "su", translation: "bade ka mana?", notes: "Sunda lemes" },
    { source: "saya mau makan", targetLang: "su", translation: "abdi bade tuang", notes: "Sunda lemes" },
    { source: "kamu lagi apa", targetLang: "su", translation: "nuju naon?", notes: "Sunda lemes" },
    { source: "bagus banget", targetLang: "su", translation: "sae pisan", notes: "Sunda lemes" },
    { source: "makan dulu yuk", targetLang: "su", translation: "tuang heula yu", notes: "Sunda santai" }
  ],
  // Indonesian to Minang
  "id-min": [
    { source: "apa kabar", targetLang: "min", translation: "baa kaba?", notes: "Minang umum" },
    { source: "terima kasih", targetLang: "min", translation: "tarimo kasih", notes: "Minang" },
    { source: "mau ke mana", targetLang: "min", translation: "nak ka ma?", notes: "Minang santai" },
    { source: "saya mau makan", targetLang: "min", translation: "ambo nak makan", notes: "Minang" },
    { source: "sangat enak", targetLang: "min", translation: "lamuk bana / sabana lamak", notes: "Minang kuliner" },
    { source: "berapa harganya", targetLang: "min", translation: "pira haragonyo?", notes: "Minang transaksi" }
  ],
  // Indonesian to English
  "id-en": [
    { source: "halo", targetLang: "en", translation: "Hello", transliteration: "He-loh" },
    { source: "apa kabar", targetLang: "en", translation: "How are you?", notes: "General greeting" },
    { source: "terima kasih", targetLang: "en", translation: "Thank you", notes: "Polite" },
    { source: "sama-sama", targetLang: "en", translation: "You're welcome", notes: "Response to thanks" },
    { source: "selamat pagi", targetLang: "en", translation: "Good morning" },
    { source: "selamat malam", targetLang: "en", translation: "Good night" },
    { source: "sampai jumpa", targetLang: "en", translation: "See you later" },
    { source: "gimmick banget", targetLang: "en", translation: "That's so gimmicky / pure clout chasing", notes: "Slang conversion" },
    { source: "santai aja", targetLang: "en", translation: "Take it easy / Just chill", notes: "Casual informal" },
    { source: "mantap jiwa", targetLang: "en", translation: "Epic / Mindblowing!", notes: "Indonesian slang" },
    { source: "rapat hari ini", targetLang: "en", translation: "Today's meeting" }
  ],
  // English to Indonesian
  "en-id": [
    { source: "hello", targetLang: "id", translation: "Halo / Salam" },
    { source: "how are you", targetLang: "id", translation: "Apa kabar?" },
    { source: "thank you", targetLang: "id", translation: "Terima kasih" },
    { source: "you are welcome", targetLang: "id", translation: "Sama-sama" },
    { source: "good morning", targetLang: "id", translation: "Selamat pagi" },
    { source: "good night", targetLang: "id", translation: "Selamat malam" },
    { source: "let us grab a coffee", targetLang: "id", translation: "Yuk ngopi bareng / Mari minum kopi" },
    { source: "where is the bathroom", targetLang: "id", translation: "Di mana toilet / kamar kecil?" },
    { source: "how much is this", targetLang: "id", translation: "Berapa harganya ini?" }
  ],
  // Japanese
  "id-ja": [
    { source: "halo", targetLang: "ja", translation: "\u3053\u3093\u306B\u3061\u306F", transliteration: "Konnichiwa" },
    { source: "terima kasih", targetLang: "ja", translation: "\u3042\u308A\u304C\u3068\u3046\u3054\u3056\u3044\u307E\u3059", transliteration: "Arigatou gozaimasu" },
    { source: "apa kabar", targetLang: "ja", translation: "\u304A\u5143\u6C17\u3067\u3059\u304B\uFF1F", transliteration: "Ogenki desu ka?" },
    { source: "pintu keluar", targetLang: "ja", translation: "\u51FA\u53E3", transliteration: "Deguchi", notes: "Signs" },
    { source: "selamat makan", targetLang: "ja", translation: "\u3044\u305F\u3060\u304D\u307E\u3059", transliteration: "Itadakimasu" }
  ],
  // Arabic
  "id-ar": [
    { source: "halo", targetLang: "ar", translation: "\u0645\u0631\u062D\u0628\u0627", transliteration: "Marhaban" },
    { source: "apa kabar", targetLang: "ar", translation: "\u0643\u064A\u0641 \u062D\u0627\u0644\u0643\u061F", transliteration: "Kayfa haluk?" },
    { source: "terima kasih", targetLang: "ar", translation: "\u0634\u0643\u0631\u0627 \u062C\u0632\u064A\u0644\u0627", transliteration: "Shukran jazilan" },
    { source: "selamat pagi", targetLang: "ar", translation: "\u0635\u0628\u0627\u062D \u0627\u0644\u062E\u064A\u0631", transliteration: "Sabah al-khayr" }
  ]
};
function searchOfflineDictionary(text, srcLang, tgtLang) {
  const key = `${srcLang}-${tgtLang}`;
  const normalized = text.trim().toLowerCase();
  const matches = OFFLINE_DICTIONARY[key];
  if (matches) {
    const exact = matches.find((m) => m.source.toLowerCase() === normalized);
    if (exact) return exact;
    const partial = matches.find((m) => normalized.includes(m.source.toLowerCase()));
    if (partial) return partial;
  }
  return null;
}

// server.ts
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "20mb" }));
var ai = new import_genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", offlineEngineVersion: "v3.2-local-neural" });
});
app.post("/api/translate", async (req, res) => {
  try {
    const { text, sourceLang = "auto", targetLang = "id", tone = "casual", isOffline = false } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Teks terjemahan tidak boleh kosong" });
    }
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
          isOffline: true
        });
      }
      return res.json({
        sourceText: text,
        translatedText: `[OFFLINE] ${text}`,
        sourceLang,
        targetLang,
        tone,
        contextExplanation: "Diproses oleh Mesin Offline On-Device (Simulasi neural lokal)",
        slangNuances: ["Mode offline diaktifkan"],
        synonyms: [],
        isOffline: true
      });
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
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            translatedText: { type: import_genai.Type.STRING },
            transliteration: { type: import_genai.Type.STRING },
            contextExplanation: { type: import_genai.Type.STRING },
            slangNuances: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING }
            },
            synonyms: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING }
            }
          },
          required: ["translatedText"]
        }
      }
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
      isOffline: false
    });
  } catch (error) {
    console.error("Error in /api/translate:", error);
    const offlineFallback = searchOfflineDictionary(req.body.text || "", req.body.sourceLang, req.body.targetLang);
    return res.json({
      sourceText: req.body.text || "",
      translatedText: offlineFallback?.translation || req.body.text || "",
      sourceLang: req.body.sourceLang || "auto",
      targetLang: req.body.targetLang || "id",
      tone: req.body.tone || "casual",
      contextExplanation: "Mode Cadangan Cepat (Gagal terhubung ke Cloud AI)",
      isOffline: true
    });
  }
});
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
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            detectedLang: { type: import_genai.Type.STRING },
            fullTranslation: { type: import_genai.Type.STRING },
            boxes: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  id: { type: import_genai.Type.STRING },
                  originalText: { type: import_genai.Type.STRING },
                  translatedText: { type: import_genai.Type.STRING },
                  x: { type: import_genai.Type.NUMBER },
                  y: { type: import_genai.Type.NUMBER },
                  width: { type: import_genai.Type.NUMBER },
                  height: { type: import_genai.Type.NUMBER },
                  bgColor: { type: import_genai.Type.STRING },
                  textColor: { type: import_genai.Type.STRING }
                },
                required: ["id", "originalText", "translatedText", "x", "y", "width", "height"]
              }
            }
          },
          required: ["detectedLang", "boxes"]
        }
      }
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
  } catch (error) {
    console.error("Error in /api/ocr-scan:", error);
    return res.status(500).json({ error: "Gagal memindai gambar OCR" });
  }
});
app.post("/api/summarize-meeting", async (req, res) => {
  try {
    const { transcriptLogs, originalLang = "id", targetLang = "id" } = req.body;
    if (!transcriptLogs || !Array.isArray(transcriptLogs) || transcriptLogs.length === 0) {
      return res.status(400).json({ error: "Log transkrip percakapan rapat kosong" });
    }
    const conversationText = transcriptLogs.map((log) => `${log.speaker}: ${log.originalText}`).join("\n");
    const prompt = `Berikut adalah transkrip percakapan rapat real-time:

${conversationText}


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
          type: import_genai.Type.OBJECT,
          properties: {
            executiveSummary: { type: import_genai.Type.STRING },
            keyPoints: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING }
            },
            actionItems: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  task: { type: import_genai.Type.STRING },
                  assignee: { type: import_genai.Type.STRING },
                  priority: { type: import_genai.Type.STRING }
                },
                required: ["task"]
              }
            },
            topics: {
              type: import_genai.Type.ARRAY,
              items: { type: import_genai.Type.STRING }
            },
            translatedTranscripts: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  id: { type: import_genai.Type.STRING },
                  speaker: { type: import_genai.Type.STRING },
                  translatedText: { type: import_genai.Type.STRING }
                },
                required: ["speaker", "translatedText"]
              }
            }
          },
          required: ["executiveSummary", "keyPoints", "actionItems"]
        }
      }
    });
    let summaryData = {
      executiveSummary: "Ringkasan rapat berhasil dibuat.",
      keyPoints: [],
      actionItems: [],
      topics: ["Notulensi Rapat"],
      translatedTranscripts: []
    };
    if (response.text) {
      try {
        summaryData = JSON.parse(response.text.trim());
      } catch (e) {
        console.error("Failed to parse meeting summary:", e);
      }
    }
    return res.json(summaryData);
  } catch (error) {
    console.error("Error in /api/summarize-meeting:", error);
    return res.status(500).json({ error: "Gagal membuat notulensi rapat otomatis" });
  }
});
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voiceName = "Kore" } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text audio kosong" });
    }
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          }
        }
      }
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({ audioBase64: base64Audio });
    }
    return res.json({ message: "TTS generated client fallback" });
  } catch (error) {
    console.error("TTS endpoint fallback:", error);
    return res.json({ message: "Client WebSpeech API fallback" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AutoTranslate AI server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
