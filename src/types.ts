export type TranslationMode = 'text' | 'camera' | 'voice' | 'meeting' | 'history';

export type RegisterTone = 'casual' | 'formal' | 'business' | 'slang' | 'poetic';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isLocal?: boolean;
  region?: string;
}

export interface TranslationResult {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  tone: RegisterTone;
  transliteration?: string;
  contextExplanation?: string;
  slangNuances?: string[];
  synonyms?: string[];
  timestamp: number;
  isOffline?: boolean;
  isFavorite?: boolean;
}

export interface CameraOCRBoundingBox {
  id: string;
  originalText: string;
  translatedText: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
  bgColor?: string;
  textColor?: string;
}

export interface MeetingSpeakerLog {
  id: string;
  speaker: string;
  timestamp: string;
  originalText: string;
  translatedText: string;
  sentiment?: 'positive' | 'neutral' | 'actionable' | 'concern';
}

export interface MeetingSummary {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  originalLang: string;
  targetLang: string;
  executiveSummary: string;
  keyPoints: string[];
  actionItems: { task: string; assignee?: string; priority?: 'high' | 'medium' | 'low' }[];
  transcripts: MeetingSpeakerLog[];
  topics: string[];
}

export type UITheme = 'amoled' | 'nordic' | 'emerald' | 'warm' | 'sunset';

export type ThemeMode = 'dark' | 'light';

export type DeviceViewMode = 'desktop' | 'tablet' | 'mobile';

export interface GoogleUserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  locale: string;
  isVerified: boolean;
  connectedSince: string;
  cloudStorageUsedMb: number;
  syncStatus: 'synced' | 'syncing' | 'offline';
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'system_admin' | 'translator_admin';
  avatar: string;
  status: 'active' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

export interface AdminAppSettings {
  appName: string;
  appLogoUrl: string | null; // custom logo
  defaultTone: RegisterTone;
  geminiModel: string;
  enablePublicRegistration: boolean;
  maxDailyRequestsPerUser: number;
  customSystemPrompt: string;
  telemetryEnabled: boolean;
  supportedMeetingApps: string[];
}

export interface AppSettings {
  theme: UITheme;
  themeMode: ThemeMode;
  deviceView: DeviceViewMode;
  accentColor: string;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  offlineMode: boolean;
  e2eeEnabled: boolean;
  autoCloudSync: boolean;
  speechRate: number; // 0.5 to 1.5
  speechPitch: number;
  floatingBubbleEnabled: boolean;
  floatingBubbleStyle: 'compact' | 'glowing' | 'icon';
  overlayOpacity: number; // 0.2 to 1.0
  preferredLocalLang: string;
  pinLockEnabled: boolean;
  pinCode?: string;
  customAppLogoUrl?: string | null;
  appName?: string;
}

export interface MockAppMessage {
  id: string;
  sender: string;
  avatar: string;
  time: string;
  text: string;
  isMe: boolean;
  translatedText?: string;
}
