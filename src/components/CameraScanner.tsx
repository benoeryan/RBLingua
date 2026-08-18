import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  Eye, 
  RefreshCw,
  Layers,
  Info
} from 'lucide-react';
import { MOCK_STREET_SIGNS } from '../data/mockApps';
import { AppSettings, CameraOCRBoundingBox } from '../types';
import { getLanguageName } from '../data/languages';
import { executeOcrScan } from '../services/aiService';

interface CameraScannerProps {
  settings: AppSettings;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ settings }) => {
  const [selectedSample, setSelectedSample] = useState(MOCK_STREET_SIGNS[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState('id');
  const [loading, setLoading] = useState(false);
  const [ocrBoxes, setOcrBoxes] = useState<CameraOCRBoundingBox[]>(MOCK_STREET_SIGNS[0].boxes);
  const [copied, setCopied] = useState(false);
  
  const [selectedBox, setSelectedBox] = useState<CameraOCRBoundingBox | null>(null);
  const [useCameraStream, setUseCameraStream] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Switch sample sign
  const handleSelectSample = (sample: typeof MOCK_STREET_SIGNS[0]) => {
    setSelectedSample(sample);
    setCustomImage(null);
    setOcrBoxes(sample.boxes);
    setSelectedBox(null);
  };

  // Upload custom photo file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setCustomImage(base64);
        processOcrImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Live Camera Toggle
  const toggleLiveCamera = async () => {
    if (useCameraStream) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      setUseCameraStream(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setUseCameraStream(true);
      } catch (err) {
        alert('Tidak dapat mengakses kamera perangkat. Pastikan izin kamera telah diberikan.');
      }
    }
  };

  // Send photo to Gemini OCR endpoint
  const processOcrImage = async (base64Img: string) => {
    setLoading(true);
    try {
      const data = await executeOcrScan(base64Img, targetLang);
      if (data.boxes && data.boxes.length > 0) {
        setOcrBoxes(data.boxes);
      } else {
        alert('Teks pada gambar tidak terdeteksi.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    window.speechSynthesis.speak(utterance);
  };

  const isLight = settings.themeMode === 'light';

  return (
    <div className="space-y-4">
      {/* Control Banner */}
      <div className={`border rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-neutral-900 border-neutral-800 text-white'
      }`}>
        <div>
          <h2 className="text-base font-bold flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-500" />
            Kamera Pemindai Teks Instan & Signboard AR
          </h2>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
            Arahkan kamera atau unggah foto papan nama, menu, dan rambu jalan untuk terjemahan langsung di atas gambar.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLiveCamera}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              useCameraStream
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{useCameraStream ? 'Matikan Kamera' : 'Buka Kamera HP'}</span>
          </button>

          <label className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer transition ${
            isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
          }`}>
            <Upload className="w-4 h-4 text-purple-500" />
            <span>Unggah Foto</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Preset Sign Samples */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className={`text-xs font-semibold shrink-0 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>Contoh Papan Sign:</span>
        {MOCK_STREET_SIGNS.map((sample) => (
          <button
            key={sample.id}
            onClick={() => handleSelectSample(sample)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition flex items-center gap-1.5 ${
              selectedSample.id === sample.id && !customImage
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : isLight ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-300" />
            <span>{sample.title}</span>
          </button>
        ))}
      </div>

      {/* OCR CAMERA / IMAGE AR DISPLAY CANVAS */}
      <div className={`relative border rounded-2xl overflow-hidden shadow-2xl min-h-[380px] flex items-center justify-center transition-colors ${
        isLight ? 'bg-slate-100 border-slate-200' : 'bg-neutral-950 border-neutral-800'
      }`}>
        {useCameraStream ? (
          /* Live Stream Video */
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-[400px] object-cover"
          />
        ) : (
          /* Static / Sample Image Display */
          <div className="relative w-full max-w-2xl overflow-hidden">
            <img
              src={customImage || selectedSample.imageUrl}
              alt="Street sign"
              className="w-full h-[380px] object-cover rounded-2xl"
            />

            {/* AR BOUNDING BOX OVERLAYS */}
            {ocrBoxes.map((box) => (
              <div
                key={box.id}
                onClick={() => setSelectedBox(box)}
                style={{
                  top: `${box.y}%`,
                  left: `${box.x}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                  backgroundColor: box.bgColor || 'rgba(34, 197, 94, 0.85)',
                  color: box.textColor || '#ffffff',
                }}
                className="absolute rounded-lg border-2 border-white/80 p-1 flex items-center justify-center text-center cursor-pointer hover:scale-105 transition shadow-lg font-bold text-xs md:text-sm tracking-wide z-10 hover:z-20 animate-fadeIn"
              >
                <span>{box.translatedText}</span>
              </div>
            ))}

            {loading && (
              <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2 z-30">
                <Sparkles className="w-8 h-8 text-indigo-400 animate-spin" />
                <span className="text-xs font-bold">Memindai Teks AI & Mengukur Bounding Box...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected OCR Box Detail Panel */}
      {selectedBox && (
        <div className={`border rounded-2xl p-4 shadow-xl space-y-2 animate-fadeIn transition-colors ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-neutral-900 border-neutral-800 text-white'
        }`}>
          <div className={`flex items-center justify-between border-b pb-2 ${isLight ? 'border-slate-200' : 'border-neutral-800'}`}>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> Detil Teks Papan Sign Terpilih
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSpeak(selectedBox.translatedText)}
                className={`p-1.5 rounded-lg transition ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                }`}
                title="Dengarkan Suara"
              >
                <Volume2 className="w-4 h-4 text-indigo-500" />
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedBox.translatedText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className={`p-1.5 rounded-lg transition ${
                  isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className={`p-2.5 rounded-xl border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'
            }`}>
              <span className={`text-[10px] block font-semibold mb-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>Teks Asli di Gambar:</span>
              <p className="font-bold text-sm">{selectedBox.originalText}</p>
            </div>

            <div className={`p-2.5 rounded-xl border ${
              isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-neutral-950 border-neutral-800'
            }`}>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold mb-0.5">Hasil Terjemahan AR:</span>
              <p className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">{selectedBox.translatedText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
