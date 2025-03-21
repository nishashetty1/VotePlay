import { create } from "zustand";
import { getAuthToken } from "../utils/auth";
import axios from "axios";

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
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        set({
          userVotes: response.data.stats.userVotes,
          totalVotes: response.data.stats.totalVotes,
          registeredVoters: response.data.stats.registeredVoters,
          isLoading: false,
          error: null,
        });
        return true;
      }
      return false;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },
}));

(async () => {
  const { fetchStats } = useStatsStore.getState();
  fetchStats();
})();