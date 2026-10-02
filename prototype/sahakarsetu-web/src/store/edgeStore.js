import { create } from 'zustand';

export const useEdgeStore = create((set) => ({
  isOnline: true,
  syncQueue: [
    { id: 1, action: 'REGISTER_TRAINEE', status: 'pending', timestamp: '2026-10-01T10:15:00Z' },
    { id: 2, action: 'MARK_ATTENDANCE', status: 'pending', timestamp: '2026-10-01T11:20:00Z' }
  ],
  toggleConnection: () => set((state) => ({ isOnline: !state.isOnline })),
  triggerOfflineEvent: (event) => set((state) => ({ 
    syncQueue: [...state.syncQueue, { id: Date.now(), action: event, status: 'pending', timestamp: new Date().toISOString() }] 
  }))
}));
