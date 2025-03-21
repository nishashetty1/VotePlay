import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Undo2 } from 'lucide-react';
import { SEO } from '.';

const NotFound = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <>
      <SEO
        title="VotePlay | 404 Page Not Found"
        description="The page you're looking for cannot be found. Return to VotePlay's voting simulation home page."
        keywords="404 error, page not found, error page, voteplay error"
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
          className="max-w-2xl w-full space-y-8 bg-background-card p-8 sm:p-10 rounded-2xl shadow-2xl border border-secondary/10 backdrop-blur-sm text-center relative z-10"
        >

          <div className="relative space-y-6">
            <motion.h1
              variants={itemVariants}
              className="text-8xl sm:text-9xl font-sanskrit bg-gradient-to-r from-primary via-secondary to-accent text-transparent bg-clip-text font-bold"
            >
              404
            </motion.h1>

            <motion.div variants={itemVariants} className="space-y-4">
              <p className="text-2xl sm:text-3xl font-sanskrit text-text-primary">
                Oops! Page Not Found
              </p>
              <p className="text-base sm:text-lg text-text-secondary font-body">
                The page you are looking for doesn't exist or has been moved.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-4"
            >
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 rounded-full text-text-primary font-medium transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2">
                  <Undo2 strokeWidth={2} />
                  Go Back Home
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl" />
          <div className="absolute bottom-10 right-10 w-20 h-20 bg-secondary/5 rounded-full blur-xl" />
        </div>
      </motion.div>
    </>);
};

export default NotFound;