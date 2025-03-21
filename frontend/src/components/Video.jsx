import React from "react";
import { motion } from "framer-motion";
import { Play, SkipForward } from "lucide-react";
import { FunFact, SEO } from ".";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { set } from "react-hook-form";

const Video = () => {
  const startVideo = useStore((state) => state.startVideo);
  const setStartVideo = useStore((state) => state.setStartVideo);
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const goToDashboard = () => {
    setStartVideo(false);
    navigate("/dashboard");
  };

  const startVideoHandler = () => {
    setStartVideo(true);
  };

  if (!startVideo) {
    return (
      <>
        <SEO
          title="VotePlay | Voter Education Video"
          description="Learn about the Indian voting process through the educational video by The Election Commission of India. Understand EVM usage and voting procedures before participating in the simulation."
          keywords="voter education video, EVM tutorial, voting process guide, election simulation training, digital voting instructions"
          author="VotePlay"
          type="website"
          image="https://res.cloudinary.com/dftncwphd/image/upload/v1741840248/background_kwjbeh.webp"
        />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="min-h-screen bg-gradient-to-b from-background-dark to-background-darker flex items-center justify-center px-4 sm:px-6 lg:px-8"
        >
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dftncwphd/image/upload/v1741840248/background_kwjbeh.webp')] opacity-10 bg-center bg-contain" />

          <motion.div
            variants={itemVariants}
            className="max-w-2xl w-full space-y-8 bg-background-card p-8 sm:p-10 rounded-2xl shadow-2xl border border-secondary/10 backdrop-blur-sm text-center"
          >
            <FunFact />
            <motion.div className="relative">
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-white to-green-600 opacity-30 blur-2xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <h2 className="relative text-2xl sm:text-3xl font-sanskrit text-text-primary mb-6">
                Start by Watching a Video by the Election Commission of India
              </h2>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startVideoHandler}
                className="relative group"
              >
                <div className="relative px-6 sm:px-8 py-3 bg-primary hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 rounded-full text-text-primary font-medium transition-all duration-300 transform hover:-translate-y-0.5 min-w-[120px] flex items-center gap-2">
                  Start Video
                  <Play size={20} />
                </div>
              </motion.button>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToDashboard}
                className="relative group"
              >
                <div className="relative px-6 sm:px-8 py-3 bg-secondary hover:bg-secondary-dark hover:shadow-lg hover:shadow-secondary/20 rounded-full text-text-primary font-medium transition-all duration-300 transform hover:-translate-y-0.5 min-w-[120px] flex items-center gap-2">
                  Skip Video <SkipForward size={20} />
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </>
    );
  } else {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-background-darker"
      >
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dftncwphd/image/upload/v1741840248/background_kwjbeh.webp')] opacity-10 bg-center bg-contain" />

        <video
          onEnded={goToDashboard}
          src="https://res.cloudinary.com/dftncwphd/video/upload/v1741840249/eci_video_npgyol.mp4"
          autoPlay
          muted={false}
          className="absolute inset-0 w-full h-full object-contain"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center bg-gradient-to-t from-background-darker to-transparent">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="source flex items-center bg-background-card rounded-full px-4 py-2 text-xs sm:text-sm font-medium border border-secondary/20 backdrop-blur-sm"
          >
            <p className="mr-2 text-text-primary">SOURCE:</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="12"
              width="13.5"
              viewBox="0 0 576 512"
              className="mr-2"
            >
              <path
                fill="#fa0132"
                d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"
              />
            </svg>
            <p className="text-text-primary">ELECTION COMMISSION OF INDIA</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goToDashboard}
            className="mt-4 sm:mt-0 relative group"
          >
            <div className="relative px-6 sm:px-8 py-3 bg-primary hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 rounded-full text-text-primary font-medium transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2">
              <span>Skip and Proceed</span>
              <SkipForward size={20} />
            </div>
          </motion.button>
        </div>
      </motion.div>
    );
  }
};

export default Video;
