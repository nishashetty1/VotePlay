import { create } from "zustand";
import { getAuthToken } from "../utils/auth";

const API_BASE_URL = "http://localhost:5000/api";

export const usePaymentStore = create((set) => ({
  votecoins: 0,
  isLoading: false,
  error: null,

  fetchVotecoins: async () => {
    const token = getAuthToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/user/votecoins`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      set({ votecoins: data.votecoins });
      return true;
    } catch (error) {
      return false;
    }
  },

  updateVotecoins: async (amount, operation = "add") => {
    const token = getAuthToken();
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/user/votecoins`, {
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

      set({ votecoins: data.votecoins });
      return true;
    } catch (error) {
      return false;
    }
  },

  initiatePayment: async (selectedPackage) => {
    if (!selectedPackage) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          amount: selectedPackage.amount * 100,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create order");
      }

      const orderData = await response.json();
      return orderData;
    } catch (error) {
      return false;
    }
  },
}));
