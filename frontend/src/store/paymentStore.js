import { create } from "zustand";
import { getAuthToken } from "../utils/auth";
import axios from "axios";

export const usePaymentStore = create((set) => ({
  votecoins: 0,
  isLoading: false,
  error: null,

  fetchVotecoins: async () => {
    const token = getAuthToken();
    if (!token) return false;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/user/votecoins`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        set({ votecoins: response.data.votecoins });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error fetching votecoins:", error);
      set({ error: error.message });
      return false;
    }
  },

  updateVotecoins: async (amount, operation = "add") => {
    const token = getAuthToken();
    if (!token) return false;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/votecoins`,
        {
          amount: Number(amount),
          operation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        set({ votecoins: response.data.votecoins });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating votecoins:", error);
      set({ error: error.message });
      return false;
    }
  },

  initiatePayment: async (selectedPackage) => {
    if (!selectedPackage) return false;
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/payment/create-order`,
        {
          amount: selectedPackage.amount,
          credits: selectedPackage.credits
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
  
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create order");
      }
  
      return {
        ...response.data,
        credits: selectedPackage.credits
      };
    } catch (error) {
      console.error("Payment initiation error:", error);
      set({ error: error.message });
      return false;
    }
  },
}));

const { fetchVotecoins } = usePaymentStore.getState();
fetchVotecoins();