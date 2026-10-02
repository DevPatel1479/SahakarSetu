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
      pendingSyncQueue: [],
      localRecords: [],
      syncHistory: [],
      toggleConnection: () => set(state => ({ isOnline: !state.isOnline })),
      
      triggerOfflineEvent: (eventType, payload = {}) => {
        const newEvent = {
          id: `EVT-${Date.now()}`,
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
      
      syncNow: async () => {
        const { isOnline, pendingSyncQueue } = get();
        if (!isOnline || pendingSyncQueue.length === 0) return;
        
        set(state => ({
          pendingSyncQueue: state.pendingSyncQueue.map(e => ({ ...e, status: 'syncing' }))
        }));
        
        try {
          const syncedEvents = [];
          for (const item of pendingSyncQueue) {
            const res = await fetch('http://localhost:8000/api/sync-events/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: item.id,
                edge_device_id: 'EDGE-DEMO-01',
                event_type: item.event_type,
                payload: item.payload,
                status: 'synced'
              })
            });
            if (res.ok) {
              syncedEvents.push({ ...item, status: 'synced', syncedAt: new Date().toISOString() });
            } else {
              console.error("Failed to sync event:", item.id);
            }
          }
          
          set(state => ({
            syncHistory: [...state.syncHistory, ...syncedEvents],
            pendingSyncQueue: state.pendingSyncQueue.filter(e => !syncedEvents.find(se => se.id === e.id))
          }));
        } catch (error) {
          console.error("Network error during sync", error);
          // Revert to pending
          set(state => ({
            pendingSyncQueue: state.pendingSyncQueue.map(e => ({ ...e, status: 'pending' }))
          }));
        }
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
