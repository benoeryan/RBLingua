import { MockAppMessage } from '../types';

export interface MockAppTab {
  id: string;
  name: string;
  iconName: string;
  badge?: string;
}

export const MOCK_WHATSAPP_MESSAGES: MockAppMessage[] = [
  {
    id: 'wa-1',
    sender: 'Siti Rahma (Client)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    time: '10:14 AM',
    text: 'Halo Mas, kumaha damang? Nuju sibuk teu dinten ieu? Kedah ngarundingkeun proyek aplikasi sarang tim.',
    isMe: false,
  },
  {
    id: 'wa-2',
    sender: 'You',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    time: '10:15 AM',
    text: 'Damang Teteh! Santai wae, hayu urang bahas ayeuna.',
    isMe: true,
  },
  {
    id: 'wa-3',
    sender: 'Siti Rahma (Client)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    time: '10:16 AM',
    text: 'Awesome! We need to make sure the app handles complex Indonesian slang, local regional dialects, real-time meeting transcription, and offline translation without lagging.',
    isMe: false,
  },
  {
    id: 'wa-4',
    sender: 'Siti Rahma (Client)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    time: '10:18 AM',
    text: 'Jangan sampe pas koneksi ngedrop malah ga bisa translate ya, gimmick banget kalau gitu.',
    isMe: false,
  },
];

export const MOCK_WEB_ARTICLE = {
  title: 'Tech Asia 2026: The Rise of Real-Time AI Translation in Mobile Apps',
  source: 'tech-news.global',
  content: `Mobile accessibility has taken a giant leap with on-device neural model execution. Modern translation tools now seamlessly bridge local regional dialects like Sundanese, Javanese, and Minangkabau with international languages. Integrated floating overlays allow instant text translation inside messaging apps like WhatsApp and Telegram without switching windows.`,
};

export const MOCK_STREET_SIGNS = [
  {
    id: 'sign-jp-1',
    title: 'Papan Tanda Jalan Tokyo (Japanese Street Sign)',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800',
    originalText: '非常口 避難経路 緊急停止ボタン',
    detectedLang: 'ja',
    targetLang: 'id',
    boxes: [
      { id: 'b1', originalText: '非常口', translatedText: 'PINTU DARURAT', x: 20, y: 25, width: 35, height: 18, bgColor: 'rgba(34, 197, 94, 0.9)', textColor: '#ffffff' },
      { id: 'b2', originalText: '避難経路', translatedText: 'RUTE EVAKUASI', x: 20, y: 48, width: 45, height: 16, bgColor: 'rgba(59, 130, 246, 0.9)', textColor: '#ffffff' },
      { id: 'b3', originalText: '緊急停止ボタン', translatedText: 'TOMBOL HENTI DARURAT', x: 20, y: 70, width: 60, height: 16, bgColor: 'rgba(239, 68, 68, 0.9)', textColor: '#ffffff' },
    ]
  },
  {
    id: 'sign-es-1',
    title: 'Restoran & Toko Sepatu Madrid (Spanish Menu/Sign)',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    originalText: 'Plato del Día: Paella de Mariscos con Sangría Fresca',
    detectedLang: 'es',
    targetLang: 'id',
    boxes: [
      { id: 'b4', originalText: 'Plato del Día', translatedText: 'MENU SPESIAL HARI INI', x: 15, y: 20, width: 50, height: 15, bgColor: 'rgba(234, 179, 8, 0.9)', textColor: '#000000' },
      { id: 'b5', originalText: 'Paella de Mariscos', translatedText: 'PAELLA SEAFOOD BUMBU KHAS', x: 15, y: 40, width: 65, height: 18, bgColor: 'rgba(168, 85, 247, 0.9)', textColor: '#ffffff' },
      { id: 'b6', originalText: 'Sangría Fresca', translatedText: 'MINUMAN FRUIT SANGRIA DINGIN', x: 15, y: 65, width: 55, height: 16, bgColor: 'rgba(236, 72, 153, 0.9)', textColor: '#ffffff' },
    ]
  },
  {
    id: 'sign-de-1',
    title: 'Peringatan Area Publik Jerman (German Public Notice)',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    originalText: 'Achtung! Betreten der Baustelle verboten. Eltern haften für ihre Kinder.',
    detectedLang: 'de',
    targetLang: 'id',
    boxes: [
      { id: 'b7', originalText: 'Achtung!', translatedText: 'PERHATIAN / AWAS!', x: 25, y: 15, width: 50, height: 20, bgColor: 'rgba(239, 68, 68, 0.9)', textColor: '#ffffff' },
      { id: 'b8', originalText: 'Betreten verboten', translatedText: 'DILARANG MASUK PROYEK', x: 15, y: 42, width: 70, height: 20, bgColor: 'rgba(234, 179, 8, 0.9)', textColor: '#000000' },
    ]
  }
];
