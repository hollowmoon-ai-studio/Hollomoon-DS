import { AuraSessionMemory, AuraSessionSummary, IndexedDBStats } from './auraTypes';
import { AURA_STORAGE_KEY } from './auraMemoryStorage';

const DB_NAME = 'hollowmoon_aura_indexeddb_v2';
const DB_VERSION = 1;
const STORE_SESSIONS = 'sessions';
const STORE_META = 'meta';
const META_ACTIVE_KEY = 'active_session_id';

/**
 * Safe feature detection for IndexedDB in browser environment
 */
export function isIndexedDBAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return typeof window.indexedDB !== 'undefined' && window.indexedDB !== null;
  } catch (err) {
    console.warn('IndexedDB check failed:', err);
    return false;
  }
}

let dbInstancePromise: Promise<IDBDatabase> | null = null;

/**
 * Open or initialize the IndexedDB database instance
 */
export function openAuraDB(): Promise<IDBDatabase> {
  if (!isIndexedDBAvailable()) {
    return Promise.reject(new Error('IndexedDB is not supported in this runtime environment'));
  }

  if (dbInstancePromise) {
    return dbInstancePromise;
  }

  dbInstancePromise = new Promise((resolve, reject) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. Sessions store: stores complete AuraSessionMemory objects
        if (!db.objectStoreNames.contains(STORE_SESSIONS)) {
          const sessionsStore = db.createObjectStore(STORE_SESSIONS, { keyPath: 'sessionId' });
          sessionsStore.createIndex('lastActiveAt', 'lastActiveAt', { unique: false });
          sessionsStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // 2. Meta store: active session pointers, settings, flags
        if (!db.objectStoreNames.contains(STORE_META)) {
          db.createObjectStore(STORE_META, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };

      request.onerror = (event) => {
        dbInstancePromise = null;
        reject((event.target as IDBOpenDBRequest).error || new Error('Failed to open Hollowmoon IndexedDB'));
      };

      request.onblocked = () => {
        console.warn('Hollowmoon IndexedDB database upgrade blocked by other open tabs');
      };
    } catch (err) {
      dbInstancePromise = null;
      reject(err);
    }
  });

  return dbInstancePromise;
}

/**
 * Persist an active or updated session to IndexedDB
 */
export async function saveSessionToIndexedDB(session: AuraSessionMemory): Promise<void> {
  if (!isIndexedDBAvailable()) {
    return;
  }

  try {
    const db = await openAuraDB();
    const tx = db.transaction([STORE_SESSIONS, STORE_META], 'readwrite');
    const sessionsStore = tx.objectStore(STORE_SESSIONS);
    const metaStore = tx.objectStore(STORE_META);

    const memoryPayload: AuraSessionMemory = {
      ...session,
      storageEngine: 'indexeddb',
      lastActiveAt: new Date().toISOString(),
      totalTurns: session.messages.length,
    };

    sessionsStore.put(memoryPayload);
    metaStore.put({ key: META_ACTIVE_KEY, value: session.sessionId });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(new Error('Transaction aborted'));
    });
  } catch (err) {
    console.warn('Failed to save session to IndexedDB:', err);
  }
}

/**
 * Retrieve a specific session from IndexedDB by sessionId
 */
export async function loadSessionFromIndexedDB(sessionId: string): Promise<AuraSessionMemory | null> {
  if (!isIndexedDBAvailable()) {
    return null;
  }

  try {
    const db = await openAuraDB();
    const tx = db.transaction(STORE_SESSIONS, 'readonly');
    const store = tx.objectStore(STORE_SESSIONS);
    const request = store.get(sessionId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result as AuraSessionMemory | undefined;
        resolve(result || null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to load session from IndexedDB:', err);
    return null;
  }
}

/**
 * Retrieve the active session ID recorded in IndexedDB
 */
export async function getActiveSessionIdFromIndexedDB(): Promise<string | null> {
  if (!isIndexedDBAvailable()) {
    return null;
  }

  try {
    const db = await openAuraDB();
    const tx = db.transaction(STORE_META, 'readonly');
    const store = tx.objectStore(STORE_META);
    const request = store.get(META_ACTIVE_KEY);

    return new Promise((resolve) => {
      request.onsuccess = () => {
        const record = request.result;
        resolve(record?.value || null);
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Set the currently active session pointer in IndexedDB
 */
export async function setActiveSessionIdInIndexedDB(sessionId: string): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  try {
    const db = await openAuraDB();
    const tx = db.transaction(STORE_META, 'readwrite');
    const store = tx.objectStore(STORE_META);
    store.put({ key: META_ACTIVE_KEY, value: sessionId });
  } catch (err) {
    console.warn('Failed to set active session pointer in IndexedDB:', err);
  }
}

/**
 * List all saved sessions with summary statistics for the multi-session switcher
 */
export async function listAllSessionsFromIndexedDB(): Promise<AuraSessionSummary[]> {
  if (!isIndexedDBAvailable()) {
    return [];
  }

  try {
    const db = await openAuraDB();
    const tx = db.transaction(STORE_SESSIONS, 'readonly');
    const store = tx.objectStore(STORE_SESSIONS);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const records = (request.result || []) as AuraSessionMemory[];
        const summaries: AuraSessionSummary[] = records
          .map((s) => {
            const defaultTitle = s.leadProfile?.companyName
              ? `${s.leadProfile.companyName} (${s.leadProfile.industry})`
              : `${s.leadProfile?.industry || 'Enterprise'} Strategic Session`;

            return {
              sessionId: s.sessionId,
              sessionTitle: s.sessionTitle || defaultTitle,
              createdAt: s.createdAt,
              lastActiveAt: s.lastActiveAt,
              totalTurns: s.messages ? s.messages.length : s.totalTurns || 0,
              recallCount: s.recallPoints ? s.recallPoints.length : 0,
              industry: s.leadProfile?.industry || 'Services',
              companyName: s.leadProfile?.companyName,
              qualificationScore: s.leadProfile?.qualificationScore || 50,
              bookedSlot: s.leadProfile?.scheduledSlot || s.bookedSlot,
            };
          })
          .sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime());

        resolve(summaries);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Failed to list sessions from IndexedDB:', err);
    return [];
  }
}

/**
 * Delete a specific session from IndexedDB
 */
export async function deleteSessionFromIndexedDB(sessionId: string): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  try {
    const db = await openAuraDB();
    const tx = db.transaction([STORE_SESSIONS, STORE_META], 'readwrite');
    const sessionsStore = tx.objectStore(STORE_SESSIONS);
    const metaStore = tx.objectStore(STORE_META);

    sessionsStore.delete(sessionId);

    // If deleting currently active session, remove pointer
    const activeReq = metaStore.get(META_ACTIVE_KEY);
    activeReq.onsuccess = () => {
      if (activeReq.result?.value === sessionId) {
        metaStore.delete(META_ACTIVE_KEY);
      }
    };

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to delete session from IndexedDB:', err);
  }
}

/**
 * Clear all sessions and pointers from IndexedDB
 */
export async function clearAllSessionsFromIndexedDB(): Promise<void> {
  if (!isIndexedDBAvailable()) return;

  try {
    const db = await openAuraDB();
    const tx = db.transaction([STORE_SESSIONS, STORE_META], 'readwrite');
    tx.objectStore(STORE_SESSIONS).clear();
    tx.objectStore(STORE_META).clear();

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Failed to clear IndexedDB:', err);
  }
}

/**
 * Migrate legacy or bootstrap data from localStorage into IndexedDB seamlessly
 */
export async function migrateLocalStorageToIndexedDB(): Promise<AuraSessionMemory | null> {
  if (!isIndexedDBAvailable() || typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AURA_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<AuraSessionMemory>;
    if (!parsed || !parsed.sessionId || !Array.isArray(parsed.messages)) {
      return null;
    }

    const migrated: AuraSessionMemory = {
      sessionId: parsed.sessionId,
      sessionTitle: parsed.sessionTitle || `${parsed.leadProfile?.industry || 'Enterprise'} Strategy Discovery`,
      createdAt: parsed.createdAt || new Date().toISOString(),
      lastActiveAt: parsed.lastActiveAt || new Date().toISOString(),
      totalTurns: parsed.messages.length,
      messages: parsed.messages,
      leadProfile: parsed.leadProfile || ({} as any),
      croAudit: parsed.croAudit,
      recommendedStack: parsed.recommendedStack,
      recallPoints: parsed.recallPoints || [],
      bookedSlot: parsed.bookedSlot,
      language: parsed.language || 'en',
      storageEngine: 'indexeddb',
    };

    await saveSessionToIndexedDB(migrated);
    await setActiveSessionIdInIndexedDB(migrated.sessionId);

    return migrated;
  } catch (err) {
    console.warn('Migration from localStorage to IndexedDB encountered an issue:', err);
    return null;
  }
}

/**
 * Calculate estimated storage metrics for diagnostics display
 */
export async function getIndexedDBMetrics(currentSessionId: string): Promise<IndexedDBStats> {
  if (!isIndexedDBAvailable()) {
    return {
      supported: false,
      activeSessionId: currentSessionId,
      totalSessions: 1,
      estimatedBytes: 0,
      storageEngine: 'localstorage_fallback',
    };
  }

  try {
    const sessions = await listAllSessionsFromIndexedDB();
    let approximateBytes = 0;

    // Use navigator.storage.estimate if supported for accurate physical storage
    if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        if (estimate.usage) {
          approximateBytes = estimate.usage;
        }
      } catch {
        // fallback to json length calculation
      }
    }

    if (approximateBytes === 0) {
      // Approximate from session objects
      approximateBytes = sessions.reduce((acc, s) => acc + (s.totalTurns * 280) + (s.recallCount * 120) + 1024, 0);
    }

    return {
      supported: true,
      activeSessionId: currentSessionId,
      totalSessions: Math.max(1, sessions.length),
      estimatedBytes: approximateBytes,
      storageEngine: 'indexeddb',
    };
  } catch {
    return {
      supported: true,
      activeSessionId: currentSessionId,
      totalSessions: 1,
      estimatedBytes: 1536,
      storageEngine: 'indexeddb',
    };
  }
}
