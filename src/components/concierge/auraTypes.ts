import { Language } from '../../types';

export interface AuraMessage {
  id: string;
  sender: 'aura' | 'user';
  text: string;
  timestamp: string;
  category?: 'cs' | 'cx' | 'cro' | 'sales' | 'system';
  suggestedPills?: string[];
}

export interface AuraLeadProfile {
  companyName: string;
  contactName: string;
  email: string;
  industry: string;
  teamSize: string;
  currentBottleneck: string;
  targetBudget: string;
  timeline: string;
  qualificationScore: number;
  status: 'exploring' | 'qualified' | 'priority_enterprise';
  scheduledSlot?: string;
}

export interface CroDiagnostic {
  frictionScore: number; // 0 to 100
  conversionPotential: string;
  topBottlenecks: { title: string; impact: string; fix: string }[];
  estimatedAnnualRecovery: string;
  speedMultiplier: string;
}

export interface ArchitectureModule {
  name: string;
  role: string;
  tech: string;
  benefit: string;
}

export interface RecommendedArchitecture {
  stackName: string;
  targetIndustry: string;
  modules: ArchitectureModule[];
  estimatedTimeline: string;
  keyDeliverable: string;
}

export interface AuraMemoryRecallPoint {
  id: string;
  category: 'need' | 'metric' | 'preference' | 'architecture' | 'decision';
  topic: string;
  detail: string;
  timestamp: string;
}

export interface AuraSessionSummary {
  sessionId: string;
  sessionTitle: string;
  createdAt: string;
  lastActiveAt: string;
  totalTurns: number;
  recallCount: number;
  industry: string;
  companyName?: string;
  qualificationScore: number;
  bookedSlot?: string;
}

export interface IndexedDBStats {
  supported: boolean;
  activeSessionId: string;
  totalSessions: number;
  estimatedBytes: number;
  storageEngine: 'indexeddb' | 'localstorage_fallback';
}

export interface AuraSessionMemory {
  sessionId: string;
  sessionTitle?: string;
  createdAt: string;
  lastActiveAt: string;
  totalTurns: number;
  messages: AuraMessage[];
  leadProfile: AuraLeadProfile;
  croAudit?: CroDiagnostic;
  recommendedStack?: RecommendedArchitecture;
  recallPoints: AuraMemoryRecallPoint[];
  bookedSlot?: string;
  language: Language;
  storageEngine?: 'indexeddb' | 'localstorage_fallback';
}
