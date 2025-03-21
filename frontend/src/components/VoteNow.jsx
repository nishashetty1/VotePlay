import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EVM, VVPAT, FunFact, SEO } from ".";
import { useStore } from "../store/useStore";
import { useNavigate, Navigate } from "react-router-dom";

const VoteNow = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedCategory } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCategory) {
        navigate("/dashboard");
        return;
      }
  
      try {
        setIsLoading(true);
        setError(null);
        const success = await useStore.getState().fetchTeams(selectedCategory.id);
        if (!success) {
          throw new Error("Failed to fetch category data");
        }
      } catch (err) {
        setError("Failed to load voting data");
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  
    return () => {
      useStore.getState().setSelectedCategory(null);
      useStore.getState().setTeams([]);
    };
  }, [selectedCategory, navigate]);

  if (!selectedCategory) {
    return <Navigate to="/dashboard" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background-dark to-background-darker flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background-dark to-background-darker flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-primary rounded-lg text-white"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

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

  return (
    <>
      <SEO
        title={`VotePlay | Vote - ${selectedCategory?.name}`}
        description={`Cast your vote for your favorite ${selectedCategory?.name}`}
        keywords="electronic voting machine, EVM simulation, VVPAT system"
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
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dftncwphd/image/upload/v1741840248/background_kwjbeh.webp')] opacity-10 bg-center bg-contain" />

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl" />
          <div className="absolute bottom-10 right-10 w-20 h-20 bg-secondary/5 rounded-full blur-xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <motion.div
            variants={componentVariants}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl font-sanskrit text-primary">
              {selectedCategory?.name}
            </h1>
            <p className="text-lg text-text-primary font-body">
              Cast your vote securely using EVM and verify with VVPAT
            </p>
          </motion.div>

          <motion.div
            variants={componentVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          >
            <motion.div
              variants={componentVariants}
              className="bg-background-card rounded-2xl shadow-xl border border-secondary/10 backdrop-blur-sm p-6"
            >
              <EVM />
            </motion.div>

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
    </>
  );
};

export default VoteNow;
