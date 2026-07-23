import { create } from 'zustand';

interface NotificationState {
	readIds: string[];
	hiddenIds: string[];
	markRead: (id: string) => void;
	markAllRead: (ids: string[]) => void;
	hideAll: (ids: string[]) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
	readIds: [],
	hiddenIds: [],
	markRead: (id) => set((state) => ({ readIds: [...new Set([...state.readIds, id])] })),
	markAllRead: (ids) => set((state) => ({ readIds: [...new Set([...state.readIds, ...ids])] })),
	hideAll: (ids) => set((state) => ({ hiddenIds: [...new Set([...state.hiddenIds, ...ids])] })),
}));
