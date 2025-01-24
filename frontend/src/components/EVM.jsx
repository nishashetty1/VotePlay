import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../utils/auth";

const EVM = () => {
  // State Management
  const [light, setLight] = useState(false);
  const teams = useStore((state) => state.teams);
  const setTeams = useStore((state) => state.setTeams);
  const votedTeam = useStore((state) => state.votedTeam);
  const setVotedTeam = useStore((state) => state.setVotedTeam);

  const navigate = useNavigate();

  // Audio Refs
  const rollRef = useRef();
  const beepRef = useRef();
  const clickRef = useRef();

  // Audio Functions
  const playAudio = useCallback(async (audioRef) => {
    try {
      if (audioRef.current) {
        await audioRef.current.play();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }, []);

  // Vote Casting Function
  const castVote = useCallback(
    async (team) => {
      try {
        const token = getAuthToken();

        if (!token) {
          setError("Authentication required. Please login.");
          navigate("/login");
          return;
        }

        const teamResponse = await fetch(
          `http://localhost:5000/api/teams/${team._id}/vote`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!teamResponse.ok) {
          if (teamResponse.status === 401) {
            navigate("/login");
            throw new Error("Session expired. Please login again.");
          }
          throw new Error(`Failed to update team count`);
        }

        const updatedTeam = await teamResponse.json();

        const userResponse = await fetch(
          "http://localhost:5000/api/user/vote",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            navigate("/login");
            throw new Error("Session expired. Please login again.");
          }
          throw new Error(`Failed to update user vote count`);
        }

        setTeams(
          teams.map((item) =>
            item._id === updatedTeam._id ? updatedTeam : item
          )
        );

        setVotedTeam(team._id);
        setLight(true);
        await playAudio(clickRef);

        // Animation sequence
        const animations = [
          { delay: 1000, action: () => playAudio(rollRef) },
          { delay: 8000, action: () => playAudio(beepRef) },
          { delay: 10000, action: () => setVotedTeam(null) },
          { delay: 13000, action: () => navigate("/thank-you") },
        ];

        animations.forEach(({ delay, action }) => {
          setTimeout(action, delay);
        });

        // Scroll to VVPAT
        setTimeout(() => {
          const vvpat = document.querySelector(".vvpat");
          if (vvpat) {
            vvpat.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 1000);
      } catch (err) {
        console.error("Error casting vote:", err);
      }
    },
    [setTeams, setVotedTeam, playAudio, navigate]
  );

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-2xl font-sanskrit text-text-primary text-center mb-6">
          Electronic Voting Machine
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#f7f5f2] via-[#dbd6ce] to-[#d6d6d6]
             shadow-[2px_2px_2px_#a39687,_-2px_-2px_2px_#ffffff,_inset_2px_2px_4px_#ffffff,_inset_-2px_-2px_4px_#a39687]
             rounded-xl p-2 sm:p-6 
             border-2 border-[#c5b7a3]/40
             transform perspective-1000
             transition-shadow duration-300 overflow-hidden"
        >
          <table className="w-full border-collapse text-xs sm:text-sm md:text-base relative">
            {/* Table Header */}
            <thead>
              <tr className="bg-gradient-to-r from-[#ffffff] to-[#d6d6d6] h-8 sm:h-12 text-center shadow-sm">
                <th className="px-1 sm:px-2 py-1 sm:py-2 sm:table-cell font-bold text-gray-700">
                  Sr No
                </th>
                <th className="px-1 sm:px-2 py-1 sm:py-2 font-bold text-gray-700">
                  Candidate Name
                </th>
                <th className="px-1 sm:px-2 py-1 sm:py-2 md:table-cell font-bold text-gray-700">
                  Symbol
                </th>
                <th className="w-12 sm:w-16"></th>
                <th className="w-20 sm:w-24 font-bold text-gray-700">
                  Ballot Unit
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {teams.map((item, index) => (
                <tr
                  key={item._id}
                  className="h-16 sm:h-20 border-b border-[#e6e1d5] text-center transition-all duration-200"
                >
                  <td className="px-1 sm:px-2 py-1 sm:py-2 font-bold text-gray-700 sm:table-cell">
                    {index + 1}
                  </td>
                  <td className="px-1 sm:px-2 py-1 sm:py-2 font-semibold text-gray-700 text-xs sm:text-base">
                    {item.name}
                  </td>
                  <td className="px-1 sm:px-2 py-1 sm:py-2 md:table-cell">
                    <img
                      src={item.logo}
                      alt={`${item.name} logo`}
                      width={50}
                      height={50}
                      className="mx-auto w-10 md:w-12 h-auto drop-shadow-md hover:scale-110 transition-transform duration-200"
                      loading="lazy"
                    />
                  </td>
                  <td className="w-12 sm:w-16">
                    <div
                      className={`light h-4 w-4 sm:h-6 sm:w-6 rounded-full mx-auto transform transition-all duration-300 
                      ${light && votedTeam === item._id
                          ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5),0_0_25px_rgba(239,68,68,0.8),0_0_40px_rgba(239,68,68,0.6)] scale-115"
                          : "bg-red-950 shadow-inner"
                        }`}
                    />
                  </td>
                  <td className="w-20 sm:w-24">
                    <button
                      className={`btn h-7 w-16 sm:h-9 sm:w-20 rounded-3xl shadow-lg bg-blue-900 hover:bg-blue-800 active:scale-95 hover:shadow-xl
                      ${votedTeam !== null
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                        } 
                      transition-all duration-200 transform mx-auto text-xs sm:text-sm`}
                      onClick={() => castVote(item)}
                      disabled={votedTeam !== null}
                      aria-label={`Vote for ${item.name}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Instructions Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-[#f5f1e8]/50 rounded-lg border border-[#d4cfc3] text-center"
          >
            {votedTeam && (
              <p className="text-gray-700 text-sm">
                <span className="block mt-2 text-primary font-medium">
                  Vote recorded! Please check the VVPAT for verification.
                </span>
              </p>
            )}
          </motion.div>
        </motion.div>

        {/* Audio Elements */}
        <audio ref={rollRef} src="/assets/sound/vvpat_roll.mp3" preload="auto" />
        <audio ref={beepRef} src="/assets/sound/evm_beep.mp3" preload="auto" />
        <audio
          ref={clickRef}
          src="/assets/sound/button_click.mp3"
          preload="auto"
        />
      </div>
    </>
  );
};

export default EVM;
