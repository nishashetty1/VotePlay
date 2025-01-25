import React, { useState, useEffect, useRef} from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Star, Send, LayoutDashboard } from "lucide-react";
import { useStore } from "../store/useStore";
import { SEO } from '.';
import { Helmet } from 'react-helmet-async';

const ThankYou = () => {
  const { register, handleSubmit } = useForm();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const user = useStore((state) => state.user);
  const submitFeedback = useStore((state) => state.submitFeedback);
  const feedbackSubmitted = useStore((state) => state.feedbackSubmitted);
  const navigate = useNavigate();
  const audioRef = useRef(new Audio("/assets/sound/ipl_tune.mp3"));

  const isVoting = useStore((state) => state.isVoting);
  const setIsVoting = useStore((state) => state.setIsVoting);

  useEffect(() => {
    if (!isVoting) {
      navigate("/dashboard", { replace: true });
      return;
    }

    if (location.key) {
      window.history.replaceState(null, "", "/thank-you");
    }

    const handlePopState = (e) => {
      e.preventDefault();
      navigate("/dashboard", { replace: true });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isVoting, navigate, location.key]);

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

  const onSubmit = async (data) => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    try {
      const success = await submitFeedback(rating, data.feedback);
      if (success) {
        audioRef.current.play();

        setTimeout(() => {
          setIsVoting(false);
          navigate("/dashboard", { replace: true });
        }, 4000);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  useEffect(() => {
    if (feedbackSubmitted) {
      const timer = setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [feedbackSubmitted, navigate]);

  return (
    <>
      <SEO
        title="VotePlay | Thank You for Voting"
        description="Thank you for participating in VotePlay's Indian voting simulation. Your vote has been recorded successfully."
        keywords="vote confirmation, voting complete, thank you page, successful vote, election simulation complete, ratings, feedback, suggestions"
        author="VotePlay"
        type="website"
        image="/assets/background.webp"
      />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-b from-background-dark to-background-darker flex items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className="absolute inset-0 bg-[url('/assets/background.webp')] opacity-10 bg-center bg-contain" />
        <div
          variants={itemVariants}
          className="max-w-md w-full space-y-8 bg-background-card p-8 sm:p-10 rounded-2xl shadow-2xl border border-secondary/10 backdrop-blur-sm"
        >
          <motion.div className="relative" variants={itemVariants}>
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-white to-green-600 opacity-30 blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.h2
              variants={itemVariants}
              className="relative text-3xl sm:text-4xl font-sanskrit text-text-primary text-center mb-4"
            >
              Thank You, <p className="text-accent"> {user?.name || User}! ✦</p>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-center text-text-secondary text-lg mb-8"
            >
              Share your experience with us.
            </motion.p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating Stars */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center space-x-2"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${star <= (hoveredRating || rating)
                        ? "fill-accent stroke-accent"
                        : "stroke-text-secondary"
                      } transition-colors duration-200`}
                  />
                </motion.button>
              ))}
            </motion.div>

            {/* Feedback Box */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Your Feedback
              </label>
              <textarea
                {...register("feedback")}
                className="w-full px-4 py-3 rounded-lg bg-background-darker border border-secondary/20 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 min-h-[100px] resize-none"
                placeholder="Please share your suggestions or feedback..."
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full group"
              type="submit"
            >
              <div className="relative w-full px-6 py-3 bg-primary hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 rounded-full text-text-primary font-medium transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Submit Feedback <Send strokeWidth={2} size={20} />
              </div>
            </motion.button>

            {/* Dashboard Button */}
            <motion.div variants={itemVariants}>
              <Link to="/dashboard" className="relative w-full group block">
                <div className="relative w-full px-6 py-3 bg-secondary hover:bg-secondary-dark hover:shadow-lg hover:shadow-secondary/20 rounded-full text-text-primary font-medium transition-all duration-300 transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2">
                  Go to Dashboard
                  <LayoutDashboard strokeWidth={2} size={20} />
                </div>
              </Link>
            </motion.div>
          </form>

          {/* Added decoration */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl" />
            <div className="absolute bottom-10 right-10 w-20 h-20 bg-secondary/5 rounded-full blur-xl" />
          </div>
        </div>
      </motion.div>
    </>);
};

export default ThankYou;
