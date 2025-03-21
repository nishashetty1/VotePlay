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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-full rounded-xl relative overflow-hidden"
        >
          <img
            src="https://res.cloudinary.com/dftncwphd/image/upload/v1741840248/VVPAT_c7dulr.png"
            alt="VVPAT"
            className="w-full h-full object-contain p-4 shadow-lg"
          />

          <AnimatePresence>
            {selectedTeam && (
              <div
                className="absolute bg-white shadow-lg rounded-md animate__animated animate__flipInX animate__delay-3s animate__slow"
                style={{
                  top: "26.5%",
                  left: "41%",
                  width: "18%",
                  height: "15%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.25rem",
                  overflow: "hidden"
                }}
              >
                <div className="w-full h-full flex flex-col items-center justify-between">
                  <div 
                    className="text-center font-body font-medium overflow-hidden text-ellipsis w-full"
                    style={{ 
                      fontSize: "clamp(0.4rem, 1.5vw, 0.7rem)",
                      lineHeight: 1.1,
                      marginBottom: "0.1rem"
                    }}
                  >
                    {selectedTeam.team}
                  </div>

                  <div className="flex items-center justify-center w-full flex-grow">
                    <div className="flex items-center justify-center" style={{ width: "85%", height: "85%" }}>
                      <img
                        src={selectedTeam.logo}
                        alt={`${selectedTeam.team} Logo`}
                        className="object-contain"
                        style={{ 
                          maxWidth: "100%", 
                          maxHeight: "100%",
                          width: "auto",
                          height: "auto"
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="w-full flex justify-start">
                    <span 
                      className="font-semibold"
                      style={{ fontSize: "clamp(0.4rem, 1.5vw, 0.7rem)" }}
                    >
                      {id}
                    </span>
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