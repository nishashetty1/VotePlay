import React from "react";
import { motion } from "framer-motion";
import { EVM, VVPAT, FunFact, SEO } from ".";
import { useStore } from "../store/useStore";
import { Navigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const VoteNow = () => {
  const { isVoting } = useStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const componentVariants = {
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

  if (!isVoting) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <SEO
        title="VotePlay | Cast Your Vote"
        description="Cast your vote using our simulated Electronic Voting Machine (EVM) and VVPAT system. Experience the authentic Indian voting process."
        keywords="electronic voting machine, EVM simulation, VVPAT system, secure voting, digital ballot, voting booth simulation, Indian election process"
        author="VotePlay"
        type="website"
        image="/assets/evm-interface.webp"
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-b from-background-dark to-background-darker relative"
      >
        {/* Background decoration similar to home page */}
        <div className="absolute inset-0 bg-[url('/assets/background.webp')] opacity-10 bg-center bg-contain" />

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl" />
          <div className="absolute bottom-10 right-10 w-20 h-20 bg-secondary/5 rounded-full blur-xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header Section */}
          <motion.div
            variants={componentVariants}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl font-sanskrit text-primary">
              मतदान प्रक्रिया
            </h1>
            <p className="text-lg text-text-primary font-body">
              Cast your vote securely using EVM and verify with VVPAT
            </p>
          </motion.div>

          {/* Main Content */}
          <motion.div
            variants={componentVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          >
            {/* EVM Section */}
            <motion.div
              variants={componentVariants}
              className="bg-background-card rounded-2xl shadow-xl border border-secondary/10 backdrop-blur-sm p-6"
            >
              <EVM />
            </motion.div>

            {/* VVPAT Section */}
            <motion.div
              variants={componentVariants}
              className="bg-background-card rounded-2xl shadow-xl border border-secondary/10 backdrop-blur-sm p-6"
            >
              <VVPAT />
              <FunFact />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>);
};

export default VoteNow;
