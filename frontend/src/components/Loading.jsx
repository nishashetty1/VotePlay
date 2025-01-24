import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  // Variants for container animation
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  // Variants for the floating elements
  const floatingVariants = {
    initial: { y: 0 },
    animate: {
      y: [-20, 20, -20],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Variants for the rotating ring
  const ringVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  // Variants for the pulsing effect
  const pulseVariants = {
    initial: { scale: 0.8, opacity: 0.5 },
    animate: {
      scale: [0.8, 1.2, 0.8],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Variants for text animation
  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: [0, 1, 0],
      y: 0,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-b from-background-dark to-background-darker flex items-center justify-center overflow-hidden"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-xl" />
      </div>

      {/* Main loading container */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Rotating ring and content container */}
        <div className="relative w-48 h-48">
          {/* Rotating ring */}
          <motion.div
            className="absolute inset-0 border-4 border-primary/30 rounded-full"
            variants={ringVariants}
          />

          {/* Pulsing circle */}
          <motion.div
            className="absolute inset-0 bg-primary/20 rounded-full"
            variants={pulseVariants}
          />

          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Floating elements */}
            <motion.div
              className="absolute w-4 h-4 bg-primary rounded-full"
              variants={floatingVariants}
              style={{ left: "20%" }}
            />
            <motion.div
              className="absolute w-4 h-4 bg-secondary rounded-full"
              variants={floatingVariants}
              style={{ right: "20%" }}
            />

            {/* Sanskrit text */}
            <motion.h1
              className="text-xl font-sanskrit text-primary"
              variants={textVariants}
            >
              VotePlay
            </motion.h1>
          </div>
        </div>

        {/* Loading text - now properly centered below the ring */}
        <motion.div className="mt-8 text-center" variants={textVariants}>
          <p className="text-text-primary font-body text-lg">Loading</p>
          <div className="flex justify-center space-x-1 mt-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  y: [-4, 4, -4],
                  transition: {
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  },
                }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-6 text-text-secondary text-sm font-body text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Voting Simulator
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Loading;
