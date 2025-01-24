import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import "animate.css";   

const VVPAT = () => {
  const votedTeam = useStore((state) => state.votedTeam);
  const teams = useStore((state) => state.teams);

  const selectedTeam = teams.find((team) => team._id === votedTeam);

  const id = selectedTeam
    ? teams.findIndex((team) => team._id === votedTeam) + 1
    : null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-sanskrit text-text-primary text-center mb-6">
        VVPAT Verification
      </h2>

      <div className="vvpat relative w-full max-w-lg mx-auto">
        {/* Keep the transition for the container from the "new" component */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-full rounded-xl relative overflow-hidden"
        >
          <img
            src="./assets/VVPAT.png"
            alt="VVPAT"
            className="w-full h-full object-contain p-4 shadow-lg"
          />

          <AnimatePresence>
            {selectedTeam && (
              <div
                className="absolute bg-white shadow-lg rounded-md p-1 md:p-2 animate__animated animate__flipInX animate__delay-3s animate__slow"
                style={{
                  top: "26.5%",
                  left: "41%",
                  width: "18%",
                  height: "15%",
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="text-center font-body font-medium text-sm md:text-lg">
                    {selectedTeam.team}
                  </div>

                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-xs md:text-lg">
                      {id}
                    </span>
                    <img
                      src={selectedTeam.logo}
                      alt={`${selectedTeam.team} Logo`}
                      className="h-8 md:h-16 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-text-secondary text-center text-sm mt-4"
      >
        Please verify your vote in the VVPAT slip display window
      </motion.div>
    </div>
  );
};

export default VVPAT;
