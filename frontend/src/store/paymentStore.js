import { create } from "zustand";
import { getAuthToken } from "../utils/auth";

export const usePaymentStore = create((set) => ({
  votecoins: 0,
  isLoading: false,
  error: null,

  fetchVotecoins: async () => {
    const token = getAuthToken();
    if (!token) return false;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/votecoins`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      if (data.success) {
        set({ votecoins: data.votecoins });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error fetching votecoins:", error);
      return false;
    }
  },

  updateVotecoins: async (amount, operation = "add") => {
    const token = getAuthToken();
    if (!token) return false;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/votecoins`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          operation,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      if (data.success) {
        set({ votecoins: data.votecoins });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating votecoins:", error);
      return false;
    }
  },

  initiatePayment: async (selectedPackage) => {
    if (!selectedPackage) return false;
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          amount: selectedPackage.amount,
          credits: selectedPackage.credits
        }),
      });
  
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create order");
      }
  
      return {
        ...data,
        credits: selectedPackage.credits
      };
    } catch (error) {
      console.error("Payment initiation error:", error);
      return false;
    }
  },
  
}));