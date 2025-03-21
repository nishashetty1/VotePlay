import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const OTPInput = React.forwardRef(
  ({ length = 6, onComplete, attempts }, ref) => {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);

    const resetOTP = () => {
      setOtp(new Array(length).fill(""));
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    };

    React.useImperativeHandle(ref, () => ({
      resetOTP,
    }));

    useEffect(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, []);

    const handleChange = (e, index) => {
      const value = e.target.value;
      if (isNaN(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value.substr(value.length - 1);
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }

      const otpValue = newOtp.join("");
      if (otpValue.length === 6) {
        onComplete(otpValue);
      }
    };

    const handleKeyDown = (e, index) => {
      if (e.key === "Backspace") {
        if (!otp[index] && index > 0) {
          inputRefs.current[index - 1].focus();
        }
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }

      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1].focus();
      }

      if (e.key === "ArrowRight" && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    };

    const handlePaste = (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").slice(0, 6);

      if (!/^\d+$/.test(pastedData)) return;

      const newOtp = new Array(6).fill("");
      pastedData.split("").forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char;
        }
      });

      setOtp(newOtp);

      if (pastedData.length === 6) {
        onComplete(pastedData);
      }

      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex].focus();
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center space-y-6"
      >
        <div className="flex space-x-2">
          {otp.map((digit, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-8 h-10 text-center text-xl md:3xl font-bold border-2 border-secondary/20 rounded-lg bg-background-darker text-text-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 sm:w-10 sm:h-12 md:w-12 md:h-14 lg:w-14 lg:h-16"
                autoComplete="off"
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center space-y-2"
        >
          <p className="text-md text-text-secondary md:text-base lg:text-lg">
            Attempts remaining:{" "}
            <span className="font-bold text-primary">{attempts}</span>
          </p>
        </motion.div>
      </motion.div>
    );
  }
);

OTPInput.displayName = "OTPInput";

export default OTPInput;
