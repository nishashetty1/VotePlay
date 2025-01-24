import { create } from "zustand";
import { getAuthToken } from "../utils/auth";

const API_BASE_URL = "http://localhost:5000/api";

export const useStatsStore = create((set) => ({
  userVotes: 0,
  totalVotes: 0,
  registeredVoters: 0,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    const token = getAuthToken();
    if (!token) return false;

    set({ isLoading: true });

    try {
      const response = await fetch(`${API_BASE_URL}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      set({
        userVotes: data.stats.userVotes,
        totalVotes: data.stats.totalVotes,
        registeredVoters: data.stats.registeredVoters,
        isLoading: false,
        error: null,
      });

      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
}));
