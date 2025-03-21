import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Coins, Vote, Download } from "lucide-react";
import { LogoutButton, FunFact, VotingStats, VotingInfoMessage, SEO } from ".";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { usePaymentStore } from "../store/paymentStore";
import { useStatsStore } from "../store/statsStore";

let userdigit;
(() => {
  userdigit = Math.floor(1000000 + Math.random() * 900);
})();

const Dashboard = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const user = useStore((state) => state.user);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const canvasRef = useRef(null);
  const [cardImage, setCardImage] = useState(null);

  const { fetchUserImage } = useStore();
  const { votecoins, fetchVotecoins } = usePaymentStore();
  const { userVotes, totalVotes, registeredVoters, fetchStats } =
    useStatsStore();

  useEffect(() => {
    fetchStats();
    fetchVotecoins();
  }, [fetchStats]);

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

      if (!orderData) {
        throw new Error("Failed to create order");
      }

      sessionStorage.setItem(
        "pending_credits",
        selectedPackage.credits.toString()
      );

      const cashfree = new window.Cashfree({
        mode: "production",
      });

      const checkoutOptions = {
        paymentSessionId: orderData.payment_session_id,
        redirectTarget: "_self",
        style: {
          backgroundColor: "#1E2328",
          color: "#F3F4F6",
          fontFamily: "Poppins, sans-serif",
          fontSize: "16px",
          errorColor: "#D04848",
          theme: "dark",
          input: {
            backgroundColor: "#161A1D",
            color: "#F3F4F6",
            borderColor: "#6895D2",
          },
          button: {
            backgroundColor: "#D04848",
            color: "#F3F4F6",
          },
        },
      };

      cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error("Payment initiation error:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  const handleCastVote = () => {
    if (votecoins < 5) {
      alert(
        "You need at least 5 VoteCoins to cast a vote. Please purchase more VoteCoins."
      );
      return;
    }
    navigate("/categories");
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
  }, [user?.image]);

  const generateCertificate = async () => {
    setIsLoading(true);
    try {
      if (!user?.name) {
        throw new Error("User name is required for certificate generation");
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/generate-certificate`,
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
      link.download = `VotePlay-Certificate-${user.name}.pdf`;
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

  useEffect(() => {
  if (!canvasRef.current) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  canvas.width = 1011;
  canvas.height = 639;

  const backgroundImg = new Image();
  backgroundImg.crossOrigin = "anonymous";
  backgroundImg.onload = () => {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    if (image) {
      const userImg = new Image();
      userImg.crossOrigin = "anonymous";
      userImg.onload = () => {
        ctx.drawImage(userImg, 39, 250, 236, 325);

        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = 76;
        tempCanvas.height = 100;
        tempCtx.drawImage(userImg, 0, 0, 75, 100);

        const imgData = tempCtx.getImageData(0, 0, 76, 100);
        for (let i = 0; i < imgData.data.length; i += 4) {
          const avg =
            (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
          imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = avg;
        }
        tempCtx.putImageData(imgData, 0, 0);

        ctx.drawImage(tempCanvas, 873, 175, 76, 100);

        addTextToCanvas();
      };
      userImg.src = image;
    } else {
      addTextToCanvas();
    }

    setCardImage(canvas.toDataURL("image/png"));
  };

  function addTextToCanvas() {
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "black";

    ctx.fillText(`VPS${userdigit}`, 30, 220);

    ctx.fillText(user?.name || "VotePlay User", 405, 314);
    ctx.fillText(
      user?.gender
        ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
        : "Gender",
      485,
      454
    );
    ctx.fillText(date || "DD/MM/YYYY", 560, 539);

    setCardImage(canvas.toDataURL("image/png"));
  }

  backgroundImg.src = "https://res.cloudinary.com/dftncwphd/image/upload/v1742050233/votingcard_ozkho5.png";
}, [user, image, userdigit, date]);

  return (
    <>
      <SEO
        title="VotePlay | Dashboard"
        description="Manage your VotePlay profile and cast your vote"
        keywords="voteplay dashboard, cast vote, profile management, buy votecoins"
        author="VotePlay"
        type="website"
        image="https://res.cloudinary.com/dftncwphd/image/upload/v1741840248/background_kwjbeh.webp"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-background-dark to-background-darker px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dftncwphd/image/upload/v1741840248/background_kwjbeh.webp')] opacity-10 bg-center bg-contain" />

        <LogoutButton />

        <div className="relative max-w-7xl mx-auto">
          <VotingInfoMessage year={year} />

          {/* Action Buttons */}
          <div className="mt-8 text-center flex gap-4 items-center justify-center flex-wrap">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCastVote}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-primary hover:bg-primary-dark rounded-full 
                text-text-primary font-medium transition-all duration-300 flex items-center justify-center gap-2"
              disabled={votecoins < 5}
            >
              <Vote className="w-5 h-5 sm:w-6 sm:h-6" />
              Cast Your Vote
              {votecoins < 5 && (
                <span className="ml-2 text-xs sm:text-sm opacity-75">
                  (Need {5 - votecoins} more VoteCoins)
                </span>
              )}
            </motion.button>

            <motion.button
              onClick={generateCertificate}
              disabled={isLoading || userVotes === 0}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-secondary hover:bg-secondary-dark rounded-full 
                text-text-primary font-medium transition-all duration-300 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-5 h-5 sm:w-6 sm:h-6" />
              {isLoading ? "Generating..." : "Generate Certificate"}
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Left Side - Voter ID Card */}
            <div className="space-y-6">
              <div className="bg-background-card p-6 rounded-2xl shadow-2xl border border-secondary/10 backdrop-blur-sm">
                <div className="relative">
                  <div className="relative bg-background-darker rounded-lg overflow-hidden">
                    {cardImage ? (
                      <img
                        src={cardImage}
                        alt="Voter ID Card"
                        className="w-full h-auto"
                      />
                    ) : (
                      <div className="flex items-center justify-center p-10">
                        <p>Generating voter ID card...</p>
                      </div>
                    )}
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                  </div>
                </div>

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

                <FunFact />
              </div>
            </div>

            {/* Right Side - VoteCoins & Stats */}
            <div className="space-y-6">
              <div className="bg-background-card p-6 rounded-2xl shadow-2xl border border-secondary/10 backdrop-blur-sm">
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

                <div className="space-y-2 mb-6">
                  {creditPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`px-6 py-3 bg-background-darker rounded-lg border ${
                        selectedPackage?.id === pkg.id
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

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={!selectedPackage}
                  className={`w-full px-6 py-3 rounded-full text-text-primary font-medium 
                    transition-all duration-300 flex items-center justify-center gap-2 ${
                      selectedPackage
                        ? "bg-secondary hover:bg-secondary-dark"
                        : "bg-secondary/50 cursor-not-allowed"
                    }`}
                >
                  <Coins className="w-5 h-5" />
                  Buy More VoteCoins
                </motion.button>

                <VotingStats
                  userVotes={userVotes}
                  totalVotes={totalVotes}
                  registeredVoters={registeredVoters}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Dashboard;
