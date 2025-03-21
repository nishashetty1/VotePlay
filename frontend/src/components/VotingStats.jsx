import React from "react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const AnimatedCounter = ({ value, duration = 2 }) => {
  const [counter, setCounter] = React.useState(0);

  useEffect(() => {
    let startValue = 0;
    const increment = value / (duration * 60);
    const timer = setInterval(() => {
      startValue += increment;
      if (startValue > value) {
        setCounter(value);
        clearInterval(timer);
      } else {
        setCounter(Math.floor(startValue));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-5xl font-bold text-accent"
    >
      {counter}
    </motion.span>
  );
};

const VotingStats = ({ userVotes, totalVotes, registeredVoters }) => {
  return (
    <div className="mt-6 p-4 bg-background-darker rounded-lg border border-secondary/20">
      <h4 className="text-lg font-sanskrit text-text-primary mb-4">
        Voting Stats
      </h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="text-center">
          <AnimatedCounter value={userVotes} />
          <p className="text-sm text-text-secondary mt-5">Your Votes Casted</p>
        </div>
        <div className="text-center">
          <AnimatedCounter value={totalVotes} />
          <p className="text-sm text-text-secondary mt-5">Total Votes Casted</p>
        </div>
        <div className="text-center">
          <AnimatedCounter value={registeredVoters} />
          <p className="text-sm text-text-secondary mt-5">Registered Voters</p>
        </div>
      </div>
    </div>
  );
};

export default VotingStats;
