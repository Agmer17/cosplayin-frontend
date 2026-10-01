import { create } from "zustand";
import { DetailProfileDTO } from "../type/profile";

interface AuthState {
    user : DetailProfileDTO | null
    setUser : (user: DetailProfileDTO | null) => void
    clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => {
    set({ user });
  },

  clearUser: () => {
    set({ user: null });
  },
}));