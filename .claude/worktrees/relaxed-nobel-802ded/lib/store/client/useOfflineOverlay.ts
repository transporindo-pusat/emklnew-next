import { create } from 'zustand';

interface OfflineOverlayState {
  isVisible: boolean;
  returnPath: string;
  show: (returnPath?: string) => void;
  hide: () => void;
}

// Exported as a plain store so Axios interceptors (non-React code) can call
// offlineOverlayStore.getState().show() without needing a hook.
export const offlineOverlayStore = create<OfflineOverlayState>((set) => ({
  isVisible: false,
  returnPath: '/dashboard',
  show: (returnPath = '/dashboard') => set({ isVisible: true, returnPath }),
  hide: () => set({ isVisible: false })
}));

export const useOfflineOverlay = () => offlineOverlayStore((state) => state);
