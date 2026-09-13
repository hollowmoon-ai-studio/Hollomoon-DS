import { Language } from '../../types';
import { AuraMessage, AuraLeadProfile, CroDiagnostic, RecommendedArchitecture, AuraSessionMemory, AuraMemoryRecallPoint, AuraSessionSummary, IndexedDBStats } from './auraTypes';
import { initialAuraGreeting, initialLeadProfile, defaultCroAudit, defaultRecommendedArchitecture } from './auraEngine';
import {
  isIndexedDBAvailable,
  saveSessionToIndexedDB,
  loadSessionFromIndexedDB,
  getActiveSessionIdFromIndexedDB,
  setActiveSessionIdInIndexedDB,
  listAllSessionsFromIndexedDB,
  deleteSessionFromIndexedDB,
  clearAllSessionsFromIndexedDB,
  migrateLocalStorageToIndexedDB,
  getIndexedDBMetrics,
} from './auraIndexedDB';

export const AURA_STORAGE_KEY = 'hollowmoon_aura_session_memory_v1';

export {
  isIndexedDBAvailable,
  saveSessionToIndexedDB,
  loadSessionFromIndexedDB,
  listAllSessionsFromIndexedDB,
  deleteSessionFromIndexedDB,
  clearAllSessionsFromIndexedDB,
  setActiveSessionIdInIndexedDB,
  getIndexedDBMetrics,
};

/**
 * Generate a fresh pristine session memory structure
 */
export function createDefaultSessionMemory(lang: Language, title?: string): AuraSessionMemory {
  const now = new Date().toISOString();
  const sessionNum = Math.floor(1000 + Math.random() * 9000);
  const derivedTitle =
    title ||
    (lang === 'es'
      ? `Sesión Estratégica #${sessionNum} (Logística & Operaciones)`
      : `Strategy Discovery #${sessionNum} (Enterprise Operations)`);

  return {
    sessionId: `aura-session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    sessionTitle: derivedTitle,
    createdAt: now,
    lastActiveAt: now,
    totalTurns: 0,
    messages: [initialAuraGreeting(lang)],
    leadProfile: { ...initialLeadProfile },
    croAudit: defaultCroAudit(lang),
    recommendedStack: defaultRecommendedArchitecture(lang),
    recallPoints: [
      {
        id: `rec-init-1`,
        category: 'preference',
        topic: 'Language & Engagement',
        detail: lang === 'es' ? 'Preferencia de idioma: Español corporativo.' : 'Engagement language: Executive English.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: `rec-init-2`,
        category: 'need',
        topic: 'Baseline Industry Model',
        detail: 'Auditing Enterprise Logistics & Supply Chain operations.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
    language: lang,
    storageEngine: isIndexedDBAvailable() ? 'indexeddb' : 'localstorage_fallback',
  };
}

/**
 * Synchronous initial boot loader: Reads fast cache from localStorage to prevent UI layout flash
 */
export function loadAuraSessionMemory(lang: Language): AuraSessionMemory {
  if (typeof window === 'undefined' || !window.localStorage) {
    return createDefaultSessionMemory(lang);
  }

  try {
    const raw = window.localStorage.getItem(AURA_STORAGE_KEY);
    if (!raw) {
      return createDefaultSessionMemory(lang);
    }

    const parsed = JSON.parse(raw) as Partial<AuraSessionMemory>;

    // Basic schema verification
    if (!parsed || !Array.isArray(parsed.messages) || parsed.messages.length === 0) {
      return createDefaultSessionMemory(lang);
    }

    return {
      sessionId: parsed.sessionId || `aura-session-${Date.now()}`,
      sessionTitle: parsed.sessionTitle || (lang === 'es' ? 'Sesión Activa de Consultoría' : 'Active Strategy Discovery'),
      createdAt: parsed.createdAt || new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      totalTurns: parsed.totalTurns || parsed.messages.length,
      messages: parsed.messages,
      leadProfile: parsed.leadProfile || { ...initialLeadProfile },
      croAudit: parsed.croAudit || defaultCroAudit(lang),
      recommendedStack: parsed.recommendedStack || defaultRecommendedArchitecture(lang),
      recallPoints: Array.isArray(parsed.recallPoints) && parsed.recallPoints.length > 0
        ? parsed.recallPoints
        : [
            {
              id: `rec-fallback-1`,
              category: 'preference',
              topic: 'Session Continuity',
              detail: 'Recalling active session context and prior dialogue.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ],
      bookedSlot: parsed.bookedSlot,
      language: parsed.language || lang,
      storageEngine: isIndexedDBAvailable() ? 'indexeddb' : 'localstorage_fallback',
    };
  } catch (err) {
    console.warn('Failed to parse AURA session memory cache:', err);
    return createDefaultSessionMemory(lang);
  }
}

/**
 * Asynchronous deep loader: Checks IndexedDB primary storage for full conversation context & multi-session state
 */
export async function loadAuraSessionMemoryAsync(lang: Language): Promise<AuraSessionMemory> {
  if (!isIndexedDBAvailable()) {
    return loadAuraSessionMemory(lang);
  }

  try {
    // 1. Check if an active session pointer exists in IndexedDB
    const activeId = await getActiveSessionIdFromIndexedDB();
    if (activeId) {
      const stored = await loadSessionFromIndexedDB(activeId);
      if (stored && Array.isArray(stored.messages) && stored.messages.length > 0) {
        return stored;
      }
    }

    // 2. Check if any session exists in IndexedDB
    const allSessions = await listAllSessionsFromIndexedDB();
    if (allSessions.length > 0) {
      const mostRecent = await loadSessionFromIndexedDB(allSessions[0].sessionId);
      if (mostRecent) {
        await setActiveSessionIdInIndexedDB(mostRecent.sessionId);
        return mostRecent;
      }
    }

    // 3. Migrate from localStorage if previous data exists
    const migrated = await migrateLocalStorageToIndexedDB();
    if (migrated) {
      return migrated;
    }

    // 4. Create fresh session and persist to IndexedDB
    const fresh = createDefaultSessionMemory(lang);
    await saveSessionToIndexedDB(fresh);
    return fresh;
  } catch (err) {
    console.warn('Asynchronous IndexedDB session load failed, falling back to local storage cache:', err);
    return loadAuraSessionMemory(lang);
  }
}

/**
 * Save session memory to IndexedDB (as primary high-capacity storage) and mirror to localStorage
 */
export async function saveAuraSessionMemory(memory: AuraSessionMemory): Promise<void> {
  // 1. Asynchronously persist complete unbounded history to IndexedDB
  if (isIndexedDBAvailable()) {
    try {
      await saveSessionToIndexedDB(memory);
    } catch (err) {
      console.warn('Failed to persist session to IndexedDB:', err);
    }
  }

  // 2. Mirror recent messages and profile to localStorage for instant boot
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      // Keep up to 50 most recent messages in localStorage mirror to prevent hitting the 5MB string quota
      const mirroredMessages = memory.messages.slice(-50);
      const payload: AuraSessionMemory = {
        ...memory,
        messages: mirroredMessages,
        lastActiveAt: new Date().toISOString(),
        totalTurns: memory.messages.length,
      };
      window.localStorage.setItem(AURA_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn('Failed to mirror AURA session to localStorage cache (IndexedDB holds authoritative record):', err);
    }
  }
}

/**
 * Clear session memory from IndexedDB and localStorage, returning fresh initialized session
 */
export async function clearAuraSessionMemory(lang: Language, currentSessionId?: string): Promise<AuraSessionMemory> {
  if (currentSessionId && isIndexedDBAvailable()) {
    try {
      await deleteSessionFromIndexedDB(currentSessionId);
    } catch (err) {
      console.warn('Failed to delete active session from IndexedDB:', err);
    }
  }

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(AURA_STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear AURA session cache in localStorage:', err);
    }
  }

  const fresh = createDefaultSessionMemory(lang);
  if (isIndexedDBAvailable()) {
    await saveSessionToIndexedDB(fresh);
  }
  return fresh;
}

/**
 * Export a session's complete audit trail, conversation context, and recall points as JSON
 */
export function exportSessionJson(session: AuraSessionMemory): string {
  const exportPayload = {
    hollowmoon_version: '2.0-enterprise',
    exported_at: new Date().toISOString(),
    session_id: session.sessionId,
    session_title: session.sessionTitle,
    language: session.language,
    lead_profile: session.leadProfile,
    cro_audit: session.croAudit,
    recommended_stack: session.recommendedStack,
    recalled_memory_nodes: session.recallPoints,
    conversation_turns_count: session.messages.length,
    conversation_history: session.messages,
  };
  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Trigger client browser download of session JSON file
 */
export function downloadSessionJsonFile(session: AuraSessionMemory): void {
  if (typeof window === 'undefined') return;
  try {
    const jsonStr = exportSessionJson(session);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTitle = (session.sessionTitle || 'aura-session')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    a.href = url;
    a.download = `hollowmoon-aura-${safeTitle}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to trigger session JSON download:', err);
  }
}

/**
 * Extract meaningful recall points from a user or assistant message
 */
export function extractRecallPoints(
  text: string,
  sender: 'user' | 'aura',
  existingPoints: AuraMemoryRecallPoint[],
  currentProfile?: AuraLeadProfile
): AuraMemoryRecallPoint[] {
  const points = [...existingPoints];
  const lower = text.toLowerCase();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const addPoint = (category: AuraMemoryRecallPoint['category'], topic: string, detail: string) => {
    // Avoid duplicate topics or details
    const existsIndex = points.findIndex((p) => p.topic.toLowerCase() === topic.toLowerCase());
    const newPoint: AuraMemoryRecallPoint = {
      id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category,
      topic,
      detail,
      timestamp,
    };

    if (existsIndex >= 0) {
      points[existsIndex] = newPoint; // update existing topic
    } else {
      points.push(newPoint);
    }
  };

  // 1. CRO & Friction audit discussions
  if (lower.includes('cro') || lower.includes('conversion') || lower.includes('friccion') || lower.includes('friction') || lower.includes('abandonment')) {
    addPoint(
      'metric',
      'CRO Friction Audit',
      lower.includes('latencia') || lower.includes('latency')
        ? 'Targeted sub-600ms latency fix & 2-step qualification form to recover drop-off.'
        : 'Identified ~74% operational friction; targeting +38-52% conversion lift and $148k recovery.'
    );
  }

  // 2. Industry & Domain detection
  const industries = [
    { name: 'Logistics & Freight', match: ['logistics', 'supply chain', 'freight', 'transporte', 'aduana', 'maritimo'] },
    { name: 'Healthcare & MedTech', match: ['health', 'salud', 'clinic', 'hospital', 'medtech', 'medico'] },
    { name: 'Fintech & Capital', match: ['fintech', 'finance', 'banco', 'bank', 'invest', 'pago', 'payment'] },
    { name: 'Legal & Compliance', match: ['legal', 'law', 'abogado', 'compliance', 'regulatorio'] },
    { name: 'Commerce & Retail', match: ['commerce', 'ecommerce', 'retail', 'tienda', 'shop'] },
  ];

  for (const ind of industries) {
    if (ind.match.some((m) => lower.includes(m))) {
      addPoint('need', 'Target Sector', `Operating footprint: ${ind.name}.`);
      break;
    }
  }

  // 3. Team size indicators
  const teamMatch = text.match(/(\d{1,4})\s*(people|members|employees|personas|empleados|engineers|staff)/i);
  if (teamMatch) {
    addPoint('preference', 'Team Scale', `Organization scale: ${teamMatch[1]} members.`);
  }

  // 4. Budget & Financial parameters
  const budgetMatch = text.match(/(\$\s*\d{1,3}(?:,\d{3})*(?:k|m)?|\d{1,3}k\s*(?:usd|dollars|dolares)?)/i);
  if (budgetMatch || lower.includes('presupuesto') || lower.includes('budget')) {
    addPoint('metric', 'Target Capital Allocation', `Discussed capital investment scope (${budgetMatch ? budgetMatch[0] : 'enterprise allocation'}).`);
  }

  // 5. Tech Stack & Architectural preferences
  if (lower.includes('stack') || lower.includes('architect') || lower.includes('next.js') || lower.includes('fastapi') || lower.includes('cloudflare') || lower.includes('gemini')) {
    addPoint(
      'architecture',
      'Architecture Preference',
      'Selected Hollowmoon OS autonomous suite with 100% IP code handover & zero SaaS seat tax.'
    );
  }

  // 6. Panama Hub / Zero-Trust Security
  if (lower.includes('panama') || lower.includes('soc2') || lower.includes('zero-trust') || lower.includes('compliance')) {
    addPoint(
      'decision',
      'Jurisdiction & Security',
      'Validated Panama fiber connectivity, ISO27001 rigor, and Americas timezone alignment.'
    );
  }

  // 7. Booking / Slot reservation
  if (lower.includes('reserv') || lower.includes('agend') || lower.includes('slot') || lower.includes('session') || lower.includes('sesion')) {
    addPoint(
      'decision',
      'Executive Discovery Session',
      currentProfile?.scheduledSlot
        ? `Reserved strategy slot: ${currentProfile.scheduledSlot}`
        : 'Requested 30-minute architectural discovery session with engineering partners.'
    );
  }

  // 8. Capture company name if mentioned
  if (currentProfile?.companyName && currentProfile.companyName.trim()) {
    addPoint('need', 'Client Company', `Entity: ${currentProfile.companyName.trim()}`);
  }

  // Keep most recent 12 points to prevent bloat while preserving depth
  return points.slice(-12);
}

/**
 * Format persistent session memory for inclusion in AI context prompts
 */
export function formatMemoryContextForPrompt(memory: AuraSessionMemory): string {
  const pointsSummary = memory.recallPoints
    .map((p, idx) => `${idx + 1}. [${p.topic}]: ${p.detail}`)
    .join('\n');

  const profileSummary = [
    memory.leadProfile.companyName ? `Company: ${memory.leadProfile.companyName}` : null,
    memory.leadProfile.contactName ? `Contact: ${memory.leadProfile.contactName}` : null,
    `Industry: ${memory.leadProfile.industry}`,
    `Team Size: ${memory.leadProfile.teamSize}`,
    `Identified Friction: ${memory.leadProfile.currentBottleneck}`,
    `Target Budget: ${memory.leadProfile.targetBudget}`,
    `Qualification Score: ${memory.leadProfile.qualificationScore}/100`,
    memory.leadProfile.scheduledSlot ? `Booked Strategy Slot: ${memory.leadProfile.scheduledSlot}` : null,
  ]
    .filter(Boolean)
    .join(' | ');

  return `
[PERSISTENT SESSION MEMORY (RECALL ACTIVE)]:
- Session ID: ${memory.sessionId} (Turns: ${memory.messages.length})
- Retained Client Profile: ${profileSummary}
- Key Recall Points:
${pointsSummary || 'None logged yet.'}
- INSTRUCTION FOR AURA: You have persistent memory of these points. Actively recall, cite, and connect your answer to prior discussed friction, team parameters, or architecture whenever relevant. Do not ask for details the client has already supplied.
`.trim();
}
