import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Coins,
  Vote,
  AlertCircle,
  Download,
  ChartBar,
  Eye,
  EyeOff,
} from "lucide-react";
import { LogoutButton, FunFact, VotingStats, VotingInfoMessage, SEO } from ".";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { usePaymentStore } from "../store/paymentStore";
import { useStatsStore } from "../store/statsStore";
import { getAuthToken } from "../utils/auth";

let userdigit;
const generateRandomDigits = () => {
  userdigit = Math.floor(1000000 + Math.random() * 900);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const user = useStore((state) => state.user);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { teams, setIsVoting, fetchUserImage } = useStore();

  const sortedTeams = [...teams].sort((a, b) => b.count - a.count);
  const { votecoins, fetchVotecoins, updateVotecoins } = usePaymentStore();
  const { userVotes, totalVotes, registeredVoters, fetchStats } = useStatsStore();

  useEffect(() => {
    fetchVotecoins();
    fetchStats();
  }, []);

  const creditPackages = [
    { id: 1, credits: 5, amount: 1 },
    { id: 2, credits: 10, amount: 2 },
    { id: 3, credits: 75, amount: 11 },
  ];

  const handlePayment = async () => {
    if (!selectedPackage) return;

    try {
      const orderData = await usePaymentStore
        .getState()
        .initiatePayment(selectedPackage);
      if (!orderData) return;

      const options = {
        key: "rzp_test_D2V00W9hIBIH3c",
        amount: selectedPackage.amount * 100,
        currency: "INR",
        name: "India Voting Simulator",
        description: `Purchase ${selectedPackage.credits} Credits`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            await updateVotecoins(selectedPackage.credits, "add");
            await fetchVotecoins();
            setSelectedPackage(null);
          } catch (error) {
            console.error("Error updating votecoins:", error);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#528FF0",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
      });
      rzp.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
    }
  };

  const handleCastVote = async () => {
    if (votecoins < 5) {
      alert(
        "You need at least 5 VoteCoins to cast a vote. Please purchase more VoteCoins."
      );
      return;
    }

    try {
      const success = await updateVotecoins(5, "subtract");

      if (success) {
        setIsVoting(true);
        navigate("/votenow");
      } else {
        alert("Failed to process vote credits. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while processing your vote. Please try again.");
    }
  };

  const handleToggleResults = async () => {
    if (!showResults) {
      if (votecoins < 10) {
        alert(
          "You need at least 10 credits to view results. Please purchase more credits."
        );
        return;
      }

      try {
        setIsLoadingResults(true);
        const success = await updateVotecoins(10, "subtract");
        setShowResults(true);
      } catch (error) {
        console.error("Error fetching results:", error);
        alert("Failed to fetch results. Please try again.");
      } finally {
        setIsLoadingResults(false);
      }
    } else {
      setShowResults(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      await useStore.getState().updateUserImage(file);
    } catch (error) {
      alert(error.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      fetchUserImage();
    }
  };

  useEffect(() => {
    generateRandomDigits();
  }, []);

  useEffect(() => {
    if (user?.image) {
      setImage(user.image);
    } else {
      useStore
        .getState()
        .fetchUserImage()
        .then((image) => {
          if (image) {
            setImage(image);
          }
        });
    }
  }, [user.image]);

  const generateCertificate = async () => {
    setIsLoading(true);
    try {
      if (!user?.name) {
        throw new Error("User name is required for certificate generation");
      }
      const response = await fetch(
        "http://localhost:5000/api/generate-certificate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userName: user.name,
            userId: user._id,
            completionDate: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to generate certificate");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate-${user.name}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating certificate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  let year;
  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  const date = formatDate(user?.dob);

  return (
    <>
      <SEO
        title="VotePlay | Dashboard"
        description="Manage your VotePlay profile, view your voting history and update your account settings"
        keywords="voteplay dashboard, cast vote, profile management, buy votecoins, view results, generate certificate, view voting stats, view voter id card"
        author="VotePlay"
        type="website"
        image="/assets/background.webp"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-b from-background-dark to-background-darker px-4 sm:px-6 lg:px-8 py-8 flex items-center"
      >
        <div className="absolute inset-0 bg-[url('/assets/background.webp')] opacity-10 bg-center bg-contain" />

        {/* Logout Button */}
        <LogoutButton />

        {/* Main Content */}
        <div className="relative max-w-7xl mx-auto">
          {/* User Age message */}
          <VotingInfoMessage year={year} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Left Side - Voter ID Card */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-background-card p-6 rounded-2xl shadow-2xl border border-secondary/10 backdrop-blur-sm">
                <div className="relative">
                  {/* Voter ID Card Image Container */}
                  <div className="relative bg-background-darker rounded-lg overflow-hidden">
                    <img
                      src="/assets/votingcard.png"
                      alt="Voter ID Template"
                      className="w-full h-full object-contain"
                    />

                    {/* Profile Image Overlay */}
                    {image && (
                      <div className="absolute left-[3%] top-[38.2%] w-[25%] aspect-[3/4]">
                        <img
                          src={image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                        {/* B&W Small Image */}
                        <img
                          src={image}
                          alt="Profile B&W"
                          className="absolute left-[333.5%] bottom-[90.5%] w-[30%] aspect-[3/4] object-cover grayscale"
                        />
                      </div>
                    )}

                    {/* User Details Overlay */}
                    <div className="absolute inset-0  w-full h-full text-black font-semibold text-[3vmin]">
                      <p className="absolute left-[5%] top-[25%] text-[3.5vmin]">
                        {`VPS${userdigit}`}
                      </p>
                      <p className="absolute left-[40%] top-[37%]">
                        {user?.name || "User"}
                      </p>
                      <p className="absolute left-[49%] top-[65%]">
                        {user?.gender
                          ? user.gender.charAt(0).toUpperCase() +
                          user.gender.slice(1)
                          : "Gender"}
                      </p>
                      <p className="absolute left-[56%] top-[78%]">
                        {date || "DD/MM/YYYY"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upload Button */}
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full mt-6 cursor-pointer block"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <div
                    className={`w-full px-6 py-3 bg-primary hover:bg-primary-dark rounded-full 
    text-text-primary font-medium transition-all duration-300 
    flex items-center justify-center gap-2 outline-none
    ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                    {isUploading ? "Uploading..." : "Upload Profile Photo"}
                  </div>
                </motion.label>

                {/* Fun Fact */}
                <FunFact />
              </div>
            </motion.div>

            {/* Right Side - VoteCoins & Stats */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-background-card p-6 rounded-2xl shadow-2xl border border-secondary/10 backdrop-blur-sm">
                {/* Available VoteCoins */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-sanskrit text-text-primary">
                    Available VoteCoins
                  </h3>
                  <div className="flex items-center gap-2">
                    <Coins className="w-6 h-6 text-accent" />
                    <span className="text-2xl font-bold text-accent">
                      {votecoins}
                    </span>
                  </div>
                </div>

                {/* VoteCoin Packages */}
                <div className="space-y-2 mb-6">
                  {creditPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`px-6 py-3 bg-background-darker rounded-lg border ${selectedPackage?.id === pkg.id
                        ? "border-accent"
                        : "border-secondary/20 hover:border-secondary/40"
                        } transition-colors cursor-pointer`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="creditPackage"
                            checked={selectedPackage?.id === pkg.id}
                            onChange={() => setSelectedPackage(pkg)}
                            className="w-4 h-4 accent-accent"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="text-text-primary">
                            {pkg.credits} VoteCoins
                          </span>
                        </div>
                        <span className="text-accent font-semibold text-lg">
                          ₹{pkg.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Buy VoteCoins Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={!selectedPackage}
                  className={`w-full px-6 py-3 rounded-full text-text-primary font-medium transition-all duration-300 flex items-center justify-center gap-2 ${selectedPackage
                    ? "bg-secondary hover:bg-secondary-dark"
                    : "bg-secondary/50 cursor-not-allowed"
                    }`}
                >
                  <Coins className="w-5 h-5" />
                  Buy More VoteCoins
                </motion.button>

                {/* Voting Stats */}
                <VotingStats
                  userVotes={userVotes}
                  totalVotes={totalVotes}
                  registeredVoters={registeredVoters}
                />
              </div>
            </motion.div>
          </div>

          {/* Cast Vote Button */}
          <motion.div
            variants={itemVariants}
            className="mt-8 text-center flex gap-4 items-center justify-center flex-wrap"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCastVote}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-primary hover:bg-primary-dark rounded-full text-text-primary font-medium transition-all duration-300 flex items-center justify-center gap-2"
              disabled={votecoins < 5}
            >
              <Vote className="w-5 h-5 sm:w-6 sm:h-6" />
              Cast Your Vote
              {votecoins < 5 && (
                <span className="ml-2 text-xs sm:text-sm opacity-75 cursor-not-allowed whitespace-nowrap">
                  (Need {5 - votecoins} more VoteCoins)
                </span>
              )}
            </motion.button>

            {/* Show Results Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleToggleResults}
              disabled={!showResults && votecoins < 10}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-accent hover:bg-accent/90 rounded-full text-text-primary font-medium transition-all duration-300 flex items-center justify-center gap-2"
            >
              {showResults ? (
                <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
              {isLoadingResults
                ? "Loading..."
                : showResults
                  ? "Hide Results"
                  : "Show Results"}
              {!showResults && votecoins < 10 && (
                <span className="ml-2 text-xs sm:text-sm opacity-75 cursor-not-allowed whitespace-nowrap">
                  (Need {10 - votecoins} more VoteCoins)
                </span>
              )}
            </motion.button>

            {/* Generate Certificate Button */}
            <motion.button
              onClick={generateCertificate}
              disabled={isLoading || userVotes === 0}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-secondary hover:bg-secondary-dark rounded-full text-text-primary font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-5 h-5 sm:w-6 sm:h-6" />
              {isLoading ? "Generating..." : "Generate Certificate"}
            </motion.button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <div className="mt-4 flex items-center justify-center gap-2 text-text-secondary">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">
                Casting a vote costs 5 VoteCoins • Viewing results costs 10
                VoteCoins
              </span>
            </div>
          </motion.div>

          {/* Results Section */}
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 w-full"
            >
              <div className="bg-background-card p-6 rounded-2xl shadow-2xl border border-secondary/10 backdrop-blur-sm">
                <h3 className="text-2xl font-sanskrit text-text-primary mb-6 text-center">
                  Current Standings
                </h3>

                {/* Top 3 Teams */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {sortedTeams.slice(0, 3).map((team, index) => (
                    <motion.div
                      key={team._id}
                      className="relative bg-background-darker rounded-xl p-6 border border-secondary/20"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-background-dark font-bold">
                        #{index + 1}
                      </div>
                      <div className="flex flex-col items-center gap-4">
                        <img
                          src={team.logo}
                          alt={team.name}
                          className={`w-24 h-24 object-contain ${team.team === "NOTA" ? "filter invert" : ""
                            }`}
                        />
                        <h4 className="text-lg font-bold text-text-primary">
                          {team.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <ChartBar className="w-5 h-5 text-accent" />
                          <span className="text-2xl font-bold text-accent">
                            {team.count}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Other Teams */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sortedTeams.slice(3).map((team, index) => (
                    <motion.div
                      key={team._id}
                      className="bg-background-darker rounded-lg p-4 border border-secondary/20"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: (index + 3) * 0.1 }}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={team.logo}
                          alt={team.name}
                          className={`w-10 h-10 object-contain ${team.team === "NOTA" ? "filter invert" : ""
                            }`}
                        />
                        <div>
                          <h4 className="text-sm font-medium text-text-primary">
                            {team.name}
                          </h4>
                          <div className="flex items-center gap-1">
                            <ChartBar className="w-4 h-4 text-accent" />
                            <span className="font-bold text-accent">
                              {team.count}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Dashboard;
