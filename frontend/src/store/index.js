import { create } from "zustand";

const useStore = create((set) => ({
  theme: localStorage.getItem("theme") ?? "light",
  user: JSON.parse(localStorage.getItem("user")) ?? null,

  setTheme: (value) => {
    localStorage.setItem("theme", value);
    set({ theme: value });
  },

  setCredentials: (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      set({ user: userData });
    } else {
      localStorage.removeItem("user");
      set({ user: null });
    }
  },

  signOut: () => {
    localStorage.removeItem("user");
    set({ user: null });
  },
}));

export default useStore;
