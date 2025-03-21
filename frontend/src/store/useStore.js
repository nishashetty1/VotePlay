import { create } from "zustand";
import axios from "axios";
import {
  setAuthToken,
  setUserData,
  getAuthToken,
  getUserData,
  removeAuthToken,
  removeUserData,
} from "../utils/auth";
import { validateImageFile, createFormData } from "../utils/imageUtils";

export const useStore = create((set, get) => ({
  selectedCategory: null,
  teams: [],
  votedTeam: null,
  isOtpSent: false,
  error: null,
  isLoading: false,
  verificationAttempts: 3,
  tempUserData: null,
  user: getUserData(),
  isAuthenticated: !!getAuthToken(),
  isVoting: false,
  startVideo: false,

  audioPlaying: false,
  audioPermissionAsked: false,
  toggleAudio: () => set((state) => ({ audioPlaying: !state.audioPlaying })),
  setAudioPlaying: (value) => set({ audioPlaying: value }),
  setAudioPermissionAsked: (value) => set({ audioPermissionAsked: value }),

  setTeams: (newTeams) => set({ teams: newTeams }),
  setVotedTeam: (teamId) => set({ votedTeam: teamId }),
  setIsOtpSent: (value) => set({ isOtpSent: value }),
  setError: (error) => set({ error }),
  setIsLoading: (value) => set({ isLoading: value }),
  setVerificationAttempts: (value) => set({ verificationAttempts: value }),
  setTempUserData: (data) => set({ tempUserData: data }),
  setIsVoting: (value) => set({ isVoting: value }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setStartVideo: (value) => set({ startVideo: value }),

  setAudio: (audio) => set({ audio }),

  resetAuthStates: () =>
    set({
      isOtpSent: false,
      error: null,
      isLoading: false,
      verificationAttempts: 3,
      tempUserData: null,
    }),

  fetchTeams: async (categoryId) => {
    if (!categoryId) {
      console.error("No category ID provided");
      return false;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        set({ teams: response.data });
        return true;
      }
      throw new Error("No data received");
    } catch (error) {
      console.error("Error fetching teams:", error);
      set({
        error: "Failed to fetch teams. Please try again.",
        teams: [],
      });
      return false;
    }
  },

  handleSignupSubmit: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const checkEmailResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/check-user`,
        { email: userData.email },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (checkEmailResponse.data.exists) {
        set({
          error: "This email is already registered. Please Login instead.",
          isLoading: false,
        });
        return false;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/request-otp`,
        {
          email: userData.email,
          userData: userData,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        set({
          isOtpSent: true,
          tempUserData: userData,
          error: null,
          verificationAttempts: 3,
        });
        return true;
      }

      throw new Error(
        response.data.message || "Failed to send verification code"
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send verification code";
      set({
        error: errorMessage,
        isOtpSent: false,
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  handleOTPVerification: async (email, otp) => {
    if (!email || !otp) {
      set({ error: "Email and OTP are required" });
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/verify-otp`,
        { email, otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setAuthToken(response.data.token);
        setUserData(response.data.user);

        set({
          isOtpSent: false,
          tempUserData: null,
          error: null,
          verificationAttempts: 3,
          user: response.data.user,
          isAuthenticated: true,
        });
        return true;
      }

      const newAttempts = get().verificationAttempts - 1;
      set({
        verificationAttempts: newAttempts,
        error:
          response.data.message ||
          `Invalid code. ${newAttempts} attempts remaining`,
        isLoading: false,
      });

      return false;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Verification failed. Please try again.";

      set({
        error: errorMessage,
        verificationAttempts: Math.max(0, get().verificationAttempts - 1),
        isLoading: false,
      });

      return false;
    }
  },

  logout: () => {
    removeAuthToken();
    removeUserData();
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  resendOTP: async (email) => {
    if (!email || !get().tempUserData) {
      set({ error: "Missing required information for resending OTP" });
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/request-otp`,
        {
          email,
          userData: get().tempUserData,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        set({
          error: null,
          verificationAttempts: 3,
          isOtpSent: true,
        });
        return true;
      }

      throw new Error(response.data.message || "Failed to resend code");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend verification code";
      set({ error: errorMessage });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  isOTPSessionValid: () => {
    const { isOtpSent, verificationAttempts, tempUserData } = get();
    return isOtpSent && verificationAttempts > 0 && tempUserData;
  },

  handleLogin: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setAuthToken(response.data.token);
        setUserData(response.data.user);

        set({
          user: response.data.user,
          isAuthenticated: true,
          error: null,
        });
        return true;
      }

      throw new Error(response.data.message || "Login failed");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      set({ error: errorMessage });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  submitFeedback: async (rating, feedback) => {
    const user = get().user;
    if (!user) {
      set({ error: "User not logged in" });
      return false;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/submit-feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            userName: user.name,
            rating,
            feedback,
          }),
        }
      );

      const data = await response.json();
      if (data.success)
        return true;
      throw new Error(data.message || "Failed to submit feedback");
    } catch (error) {
      set({
        error: error.message || "Failed to submit feedback",
        isLoading: false,
      });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserImage: async (file) => {
    try {
      validateImageFile(file);

      const formData = createFormData(file);

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/profile-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (response.data.success) {
        const updatedUser = { ...get().user, image: response.data.user.image };
        setUserData(updatedUser);
        set({ user: updatedUser });
        return true;
      }
      throw new Error("Failed to update image");
    } catch (error) {
      console.error("Image upload error:", error);
      throw new Error(error.message || "Failed to upload image");
    }
  },

  fetchUserImage: async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/user/profile-image`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      if (response.data.success && response.data.image) {
        const updatedUser = { ...get().user, image: response.data.image };
        setUserData(updatedUser);
        set({ user: updatedUser });
        return response.data.image;
      }
      return null;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  },
}));
