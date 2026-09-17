export type RobinState =
  | 'IDLE'
  | 'LISTENING'
  | 'THINKING'
  | 'EXECUTING'
  | 'SPEAKING'
  | 'WARNING'
  | 'ERROR'
  | 'OFFLINE';

export type SupportedLanguage = 'en-US' | 'hi-IN' | 'ur-PK' | 'skr-PK';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  wakeWords: string[];
  sampleCommands: { text: string; translation: string }[];
}

export type VoicePersonality =
  | 'Professional'
  | 'Friendly'
  | 'Executive'
  | 'Futuristic'
  | 'Calm'
  | 'Technical'
  | 'Minimal'
  | 'Assistant';

export type RiskLevel = 'low' | 'medium' | 'high';

export type ToolPermission = 'ALLOWED' | 'PROMPT_ALWAYS' | 'RESTRICTED';

export interface CommandItem {
  id: string;
  timestamp: string;
  command: string;
  intent: string;
  tool: string;
  agent: string;
  action?: string;
  parameters?: Record<string, any>;
  riskLevel?: RiskLevel;
  status: 'SUCCESS' | 'RUNNING' | 'FAILED' | 'CONFIRMATION_REQUIRED' | 'CANCELLED';
  durationSec: number;
  voiceResponse: string;
  requiresConfirmation?: boolean;
  confirmationPrompt?: string | null;
  favorite?: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  category: 'VOICE' | 'INTENT' | 'TOOL' | 'EXECUTION' | 'RESULT' | 'SYSTEM' | 'SECURITY' | 'ERROR';
  level: 'info' | 'success' | 'warn' | 'error' | 'voice';
  title: string;
  message: string;
  details?: string;
}

export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  tier?: 'Tier 1 Autonomous' | 'Tier 2 Semi-Autonomous' | 'Tier 3 Supervised';
  description: string;
  enabled: boolean;
  status: 'idle' | 'executing' | 'standby';
  tools: string[];
  executionsCount: number;
  isDynamic?: boolean;
  registeredAt?: number;
}

export interface AgentSubcategoryGroup {
  name: string;
  count: number;
  agentIds: string[];
}

export interface AgentDivisionHierarchy {
  division: string;
  count: number;
  subcategories: AgentSubcategoryGroup[];
}

export interface ToolDefinition {
  id: string;
  name: string;
  category: 'PC' | 'File' | 'Browser' | 'Voice' | 'System' | 'Automation';
  enabled: boolean;
  permission: 'ALLOWED' | 'PROMPT_ALWAYS' | 'RESTRICTED';
  riskDefault: RiskLevel;
  lastUsed: string;
  description: string;
  commandsHandled: number;
}

export interface VirtualFile {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'folder';
  sizeBytes: number;
  sizeFormatted: string;
  extension?: string;
  content?: string;
  modified: string;
  isDeleted?: boolean;
  isFavorite?: boolean;
}

export interface WorkflowAction {
  id: string;
  name: string;
  tool: string;
  action: string;
  params: Record<string, any>;
  delayMs: number;
}

export interface CustomWorkflow {
  id: string;
  trigger: string;
  name: string;
  description: string;
  actions: WorkflowAction[];
  enabled: boolean;
  lastRun?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  category: 'dark' | 'light' | 'cyber' | 'neon' | 'glass' | 'minimal' | 'matrix' | 'midnight' | 'aurora' | 'custom';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgBase: string;
  panelBg: string;
  panelBorder: string;
  textBase: string;
  textDim: string;
  glowColor: string;
  panelOpacity: number;
  borderRadius: string;
  glowIntensity: number;
}

export interface SystemTelemetry {
  platform?: string;
  hostname?: string;
  cpuModel: string;
  cpuCores: number;
  cpuUsagePercent: number;
  ramTotalGB: string | number;
  ramUsedGB: string | number;
  ramUsagePercent: number;
  gpu: string;
  gpuUsagePercent: number;
  gpuTempC: number;
  diskTotalGB: number;
  diskUsedGB: number;
  diskUsagePercent: number;
  networkStatus: string;
  batteryPercent: number;
  batteryCharging: boolean;
  uptimeSeconds?: number;
  activeApps: { name: string; pid: number; memMB: number; status?: string; cpuPercent?: number }[];
}

export interface RobinSettings {
  voice: {
    voiceName: string;
    language: string;
    speed: number;
    volume: number;
    pitch: number;
    wakeWord: string;
    wakeWordEnabled: boolean;
    continuousListening: boolean;
  };
  personality: VoicePersonality;
  soundEffectsEnabled: boolean;
  emergencyStopHotkey: string;
  commandCenterHotkey: string;
  startupWithWindows: boolean;
  startMinimized: boolean;
  offlineMode: boolean;
  securityEnforceConfirmation: boolean;
  activeThemeId: string;
  sidebarCollapsed: boolean;
  firstRunWizardCompleted: boolean;
}

export interface MemoryItem {
  id: string;
  category: 'User preferences' | 'Common commands' | 'Favorite applications' | 'Theme settings' | 'Voice settings' | 'Frequently used folders' | 'Workflow templates';
  key: string;
  value: string;
  updatedAt: string;
}
