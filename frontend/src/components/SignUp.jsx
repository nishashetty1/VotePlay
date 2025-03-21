import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { OTPInput, SEO } from ".";
import { isAuthenticated } from "../utils/auth";
import { useStore } from "../store/useStore";
import { EyeClosed, Eye } from "lucide-react";
import { Helmet } from 'react-helmet-async';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const password = watch("password", "");

  const otpInputRef = useRef(null);

  const {
    isOtpSent,
    error,
    isLoading,
    verificationAttempts,
    tempUserData,
    handleSignupSubmit,
    handleOTPVerification,
    resendOTP,
  } = useStore();

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
    const userData = {
      name: data.fullName,
      email: data.email,
      password: data.password,
      gender: data.gender,
      dob: data.dob,
    };
    await handleSignupSubmit(userData);
  };

  const handleOTPComplete = async (completedOtp) => {
    const success = await handleOTPVerification(watch("email"), completedOtp);
    if (success) {
      navigate("/video");
    } else {
      otpInputRef.current?.resetOTP();
    }
  };

  const handleResendOTP = () => {
    resendOTP(watch("email"));
  };

  if (isAuthenticated()) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <SEO
        title="VotePlay | SignUp - Create Voter Account"
        description="Register on VotePlay's Indian voting simulation platform. Create your voter account and try out the simulation of an Indian Election Process."
        keywords="voter registration, create voter account, sign up, election simulation registration, digital voter ID, new voter account"
        author="VotePlay"
        type="website"
        image="https://res.cloudinary.com/dftncwphd/image/upload/v1741840248/background_kwjbeh.webp"
      />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-b from-background-dark to-background-darker flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div className="fixed inset-0 bg-[url('https://res.cloudinary.com/dftncwphd/image/upload/v1741840248/background_kwjbeh.webp')] opacity-10 bg-center bg-contain" />

        <div
          variants={itemVariants}
          className="max-w-md w-full space-y-8 bg-background-card p-8 sm:p-10 rounded-2xl shadow-2xl border border-secondary/10 backdrop-blur-sm m-4"
        >
          <motion.div className="relative" variants={itemVariants}>
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-white to-green-600 opacity-30 blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.h2 className="relative text-3xl sm:text-4xl font-sanskrit text-text-primary text-center mb-8">
              Create Account ✦
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
              <label className="block text-sm font-medium text-text-secondary">
                Full Name
              </label>
              <input
                {...register("fullName", { required: "Full name is required" })}
                className="w-full px-4 py-3 rounded-lg bg-background-darker border border-secondary/20 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <span className="text-red-500 text-xs">
                  {errors.fullName.message}
                </span>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
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
              <label className="block text-sm font-medium text-text-secondary">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Password must include uppercase, lowercase, number and special character",
                    },
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

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-background-darker border border-secondary/20 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeClosed size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </span>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Gender
              </label>
              <select
                {...register("gender", { required: "Please select your gender" })}
                className="w-full px-4 py-3 rounded-lg bg-background-darker border border-secondary/20 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
              >
                <option value="" className="bg-background-darker">
                  Select Gender
                </option>
                <option value="male" className="bg-background-darker">
                  Male
                </option>
                <option value="female" className="bg-background-darker">
                  Female
                </option>
                <option value="other" className="bg-background-darker">
                  Other
                </option>
              </select>
              {errors.gender && (
                <span className="text-red-500 text-xs">
                  {errors.gender.message}
                </span>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">
                Date of Birth
              </label>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                {...register("dob", { required: "Date of birth is required" })}
                className="w-full px-4 py-3 rounded-lg bg-background-darker border border-secondary/20 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                style={{
                  colorScheme: "dark",
                  WebkitCalendarPickerIndicator: {
                    filter: "invert(1)",
                  },
                }}
              />
              {errors.dob && (
                <span className="text-red-500 text-xs">{errors.dob.message}</span>
              )}
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full group mt-8"
              type="submit"
              disabled={isLoading}
            >
              <div className="relative w-full px-6 py-3 bg-primary hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/20 rounded-full text-text-primary font-medium transition-all duration-300 transform hover:-translate-y-0.5">
                {isLoading ? "Processing..." : "Sign Up"}
              </div>
            </motion.button>
          </form>

          <motion.div
            variants={itemVariants}
            className="text-center text-text-secondary mt-6"
          >
            Already registered?{" "}
            <Link
              to="/login"
              className="text-accent hover:text-accent-light font-medium transition-colors duration-300"
            >
              Login here
            </Link>
          </motion.div>

          {isOtpSent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-background-card p-8 rounded-2xl shadow-xl border border-secondary/10 max-w-md w-full mx-4"
              >
                <h3 className="text-xl font-medium text-text-primary mb-4 text-center">
                  Verify Your Email
                </h3>
                <p className="text-text-secondary text-sm mb-6 text-center">
                  Please enter the verification code sent to {tempUserData?.email}
                </p>

                {verificationAttempts > 0 ? (
                  <OTPInput
                    ref={otpInputRef}
                    onComplete={handleOTPComplete}
                    attempts={verificationAttempts}
                  />
                ) : null}

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm text-center mt-4"
                  >
                    {error}
                  </motion.p>
                )}

                {verificationAttempts > 0 ? (
                  <p className="text-text-secondary text-sm text-center mt-6">
                    Didn't receive the code?{" "}
                    <button
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-primary hover:text-primary-light transition-colors"
                    >
                      Resend
                    </button>
                  </p>
                ) : (
                  <motion.button
                    onClick={() => window.location.reload()}
                    className="w-full mt-6 px-6 py-3 bg-primary hover:bg-primary-dark rounded-full text-text-primary font-medium transition-all duration-300"
                  >
                    Start Over
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>);
};

export default SignUp;
