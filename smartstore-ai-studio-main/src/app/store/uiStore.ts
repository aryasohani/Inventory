import { create } from "zustand";

type UiState = {
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  toggleChat: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (v: boolean) => void;
  toggleMobileSidebar: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  chatOpen: false,
  setChatOpen: (v) => set({ chatOpen: v }),
  toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  mobileSidebarOpen: false,
  setMobileSidebarOpen: (v) => set({ mobileSidebarOpen: v }),
  toggleMobileSidebar: () => set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
}));
