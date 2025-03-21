import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { useStore } from '../store/useStore';
import { EyeClosed, Eye } from 'lucide-react';
import { SEO } from '.';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();
  const { handleLogin, error, isLoading } = useStore();

  const onSubmit = async (data) => {
    const success = await handleLogin(data);
    if (success) {
      navigate('/video');
    }
  };

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

  if (isAuthenticated()) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <SEO
        title="VotePlay | Voter Login"
        description="Secure login portal for VotePlay's Indian voting simulation platform. Access your voter account and participate in the democratic process."
        keywords="voter login, secure authentication, voter portal, election simulation login, digital voting access"
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
        <div
          className="absolute inset-0 bg-[url('https://res.cloudinary.com/dftncwphd/image/upload/v1741840248/background_kwjbeh.webp')] opacity-10 bg-center bg-contain"
        />
        <div
          variants={itemVariants}
          className="max-w-md w-full space-y-8 bg-background-card p-8 sm:p-10 rounded-2xl shadow-2xl border border-secondary/10 backdrop-blur-sm"
        >

          <motion.div
            className="relative"
            variants={itemVariants}
          >
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-white to-green-600 opacity-30 blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.h2
              variants={itemVariants}
              className="relative text-3xl sm:text-4xl font-sanskrit text-text-primary text-center mb-8"
            >
              Login to your Account ✦
            </motion.h2>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="w-full px-4 py-3 rounded-lg bg-background-darker border border-secondary/20 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                placeholder="Enter your email"
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required"
                  })}
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-background-darker border border-secondary/20 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs">
                  {errors.password.message}
                </span>
              )}
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full group"
              type="submit"
              disabled={isLoading}
            >
              <div className="relative w-full px-6 py-3 bg-primary hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 rounded-full text-text-primary font-medium transition-all duration-300 transform hover:-translate-y-0.5">
                {isLoading ? "Processing..." : "Let's Vote !"}
              </div>
            </motion.button>
          </form>

          <motion.div
            variants={itemVariants}
            className="text-center text-text-secondary mt-6"
          >
            Not registered? {" "}
            <Link
              to="/signup"
              className="text-accent hover:text-accent-light font-medium transition-colors duration-300 "
            >
              Sign Up here
            </Link>
          </motion.div>

          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-10 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl" />
            <div className="absolute bottom-10 right-10 w-20 h-20 bg-secondary/5 rounded-full blur-xl" />
          </div>
        </div>
      </motion.div>
    </>);
};

export default Login;


