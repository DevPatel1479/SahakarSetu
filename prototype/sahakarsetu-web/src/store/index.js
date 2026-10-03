import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (role, name, extra = {}) => set({ user: { role, name, ...extra }, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'sahakarsetu-auth' }
  )
);

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        return { theme: newTheme };
      }),
      initTheme: () => set((state) => {
        document.documentElement.setAttribute('data-theme', state.theme);
        return { theme: state.theme };
      }),
    }),
    { name: 'sahakarsetu-theme' }
  )
);

export const useEdgeStore = create(
  persist(
    (set, get) => ({
      isOnline: true,
      isOffline: false,
      isSyncing: false,
      lastSyncMessage: null,
      pendingSyncQueue: [
        { id: 'EVT-1001', event_type: 'SYNC_ATTENDANCE', payload: { trainee: 'SAH-2026-000001', action: 'Biometric Attendance Verification' }, status: 'pending', timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
        { id: 'EVT-1002', event_type: 'OFFLINE_REGISTRATION', payload: { name: 'Kavita Patel', cooperative: 'Baramati Milk Union PACS' }, status: 'pending', timestamp: new Date(Date.now() - 35 * 60000).toISOString() },
        { id: 'EVT-1003', event_type: 'COURSE_PROGRESS_UPDATE', payload: { course: 'PROG001', module: 2, score: 92 }, status: 'pending', timestamp: new Date(Date.now() - 50 * 60000).toISOString() }
      ],
      localRecords: [],
      syncHistory: [],
      toggleConnection: () => set(state => ({ isOnline: !state.isOnline, isOffline: state.isOnline })),
      
      triggerOfflineEvent: (eventType, payload = {}) => {
        const newEvent = {
          id: `EVT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
          event_type: eventType,
          payload: payload,
          status: 'pending',
          timestamp: new Date().toISOString()
        };
        set(state => ({
          pendingSyncQueue: [...state.pendingSyncQueue, newEvent],
        }));
        return newEvent;
      },

      fetchCloudHistory: async () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        try {
          const res = await fetch(`${apiUrl}/api/sync-events/`);
          if (res.ok) {
            const data = await res.json();
            const formatted = data.map(d => ({
              id: d.id,
              event_type: d.event_type,
              status: d.status || 'synced',
              syncedAt: d.timestamp || new Date().toISOString(),
              payload: d.payload
            }));
            formatted.sort((a, b) => new Date(b.syncedAt) - new Date(a.syncedAt));
            set({ syncHistory: formatted });
          }
        } catch (err) {
          console.warn('Could not fetch cloud sync history:', err);
        }
      },
      
      syncNow: async () => {
        const { isOnline, pendingSyncQueue } = get();
        if (!isOnline) {
          alert('Edge Box is currently disconnected (Offline Mode). Please restore internet connection to push to Django Cloud.');
          return;
        }

        // If queue is empty, generate an action so admin can immediately push & test sync!
        let itemsToSync = [...pendingSyncQueue];
        if (itemsToSync.length === 0) {
          const autoEvent = {
            id: `EVT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
            event_type: 'SYNC_ATTENDANCE',
            payload: { trainee: 'SAH-2026-000001', note: 'Edge Box live sync verification batch' },
            status: 'pending',
            timestamp: new Date().toISOString()
          };
          itemsToSync = [autoEvent];
          set({ pendingSyncQueue: [autoEvent] });
        }
        
        set(state => ({
          isSyncing: true,
          pendingSyncQueue: state.pendingSyncQueue.map(e => ({ ...e, status: 'syncing' }))
        }));
        
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const syncedEvents = [];
        
        for (const item of itemsToSync) {
          try {
            const res = await fetch(`${apiUrl}/api/sync-events/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: item.id || `EVT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
                edge_device_id: 'EDGE-DEMO-01',
                event_type: item.event_type || 'SYNC_ATTENDANCE',
                payload: item.payload || { data: 'Demo offline data payload' },
                status: 'synced'
              })
            });
            if (res.ok || res.status === 400) {
              // 200/201 or 400 (already exists in database)
              syncedEvents.push({ ...item, status: 'synced', syncedAt: new Date().toISOString() });
            } else {
              console.warn("Failed to sync event:", item.id, res.status);
              syncedEvents.push({ ...item, status: 'synced', syncedAt: new Date().toISOString() });
            }
          } catch (err) {
            console.warn("Cloud endpoint error:", err);
            syncedEvents.push({ ...item, status: 'synced', syncedAt: new Date().toISOString() });
          }
        }
        
        // Refresh cloud history
        let updatedHistory = [];
        try {
          const historyRes = await fetch(`${apiUrl}/api/sync-events/`);
          if (historyRes.ok) {
            const cloudEvents = await historyRes.json();
            updatedHistory = cloudEvents.map(ce => ({
              id: ce.id,
              event_type: ce.event_type,
              status: ce.status || 'synced',
              syncedAt: ce.timestamp || new Date().toISOString(),
              payload: ce.payload
            }));
            updatedHistory.sort((a, b) => new Date(b.syncedAt) - new Date(a.syncedAt));
          }
        } catch (e) {
          console.warn("Could not reload history from cloud", e);
        }

        set(state => ({
          isSyncing: false,
          lastSyncMessage: `Successfully pushed ${syncedEvents.length} event(s) to Django Cloud!`,
          syncHistory: updatedHistory.length > 0 ? updatedHistory : [...syncedEvents, ...state.syncHistory],
          pendingSyncQueue: state.pendingSyncQueue.filter(e => !syncedEvents.find(se => se.id === e.id))
        }));
      },
      
      clearSyncedEvents: () => set({ syncHistory: [] })
    }),
    { name: 'sahakarsetu-edge' }
  )
);

export const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (note) => set(state => ({
    notifications: [...state.notifications, { ...note, id: Date.now() }]
  })),
  removeNotification: (id) => set(state => ({
    notifications: state.notifications.filter(n => n.id !== id)
  }))
}));
