import React, { useState } from "react";
import { Lightbulb } from "lucide-react";
import { useFactsStore } from "../store/factsStore";
import { motion } from "framer-motion";

const FunFact = () => {
  const getRandomFact = useFactsStore((state) => state.getRandomFact);
  const [fact, setFact] = useState(() => getRandomFact());

  return (
    <motion.div
      className="mt-6 p-4 sm:p-6 bg-background-darker rounded-3xl shadow-lg sm:shadow-2xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }}
    >
      <div className="flex items-center gap-4">
        <motion.div
          className="rounded-full bg-yellow-500 p-2 flex-shrink-0"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <Lightbulb className="w-4 h-4 text-background-darker" />
        </motion.div>
        <p className="text-sm sm:text-md text-text-primary font-body">
          <span className="text-accent font-bold">{fact.title}</span>{" "}
          {fact.description}
        </p>
      </div>
    </motion.div>
  );
};

export default FunFact;