import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore.js";
import { Volume2, VolumeX, Music } from 'lucide-react';

const AudioPlayer = () => {
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const audioRef = useRef(null);
  const location = useLocation();
  
  const audioPlaying = useStore(state => state.audioPlaying);
  const setAudioPlaying = useStore(state => state.setAudioPlaying);
  const audioPermissionAsked = useStore(state => state.audioPermissionAsked);
  const setAudioPermissionAsked = useStore(state => state.setAudioPermissionAsked);
  const startVideo = useStore(state => state.startVideo);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  useEffect(() => {
    if (!audioPermissionAsked) {
      setShowAudioPrompt(true);
      setAudioPermissionAsked(true);
    }
  }, [audioPermissionAsked, setAudioPermissionAsked]);

  useEffect(() => {
    if (audioRef.current) {
      if (audioPlaying && location.pathname !== "/votenow" && !startVideo) {
        audioRef.current.play().catch(error => {
          console.error("Audio playback failed:", error);
          setAudioError(error.message);
          setAudioPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioPlaying, location.pathname, startVideo, setAudioPlaying]);

  useEffect(() => {
    const handleEnded = () => {
      if (audioRef.current && audioPlaying && !startVideo) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.error("Audio loop failed:", error);
          setAudioError(error.message);
          setAudioPlaying(false);
        });
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [audioPlaying, startVideo, setAudioPlaying]);

  const handleAudioPermission = (allow) => {
    setShowAudioPrompt(false);
    if (allow) {
      setAudioPlaying(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/assets/sound/background.mp3" loop={false} />
      
      <AnimatePresence>
        {showAudioPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              className="bg-background-card p-6 sm:p-8 rounded-3xl shadow-2xl border border-primary/20 max-w-md w-full relative overflow-hidden"
            >
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-secondary/10 rounded-full blur-xl"></div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 text-center sm:text-left">
                <div className="bg-primary/10 p-3 rounded-full mb-3 sm:mb-0 sm:mr-4 inline-flex">
                  <Music className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
                  Enhance Your Experience
                </h3>
              </div>
              
              <p className="text-text-secondary text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed text-center sm:text-left">
                Would you like to enable background music to enhance your experience? 
                You can toggle it anytime using the audio controls.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAudioPermission(false)}
                  className="order-2 sm:order-1 px-6 py-3.5 rounded-full border border-secondary/20 text-text-secondary hover:text-text-primary transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>No Sound</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAudioPermission(true)}
                  className="order-1 sm:order-2 px-6 py-3.5 bg-primary hover:bg-primary-dark rounded-full text-text-primary transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm sm:text-base mb-3 sm:mb-0"
                >
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Enable Music</span>
                </motion.button>
              </div>
              
              <p className="text-center text-xs text-text-secondary/60 mt-6">
                Your preference can be changed later using the volume icon
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {audioError && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-4 bg-red-500 text-white p-3 rounded-full text-sm shadow-lg flex items-center"
        >
          <VolumeX className="w-4 h-4 mr-2" />
          <span>Error loading audio file</span>
        </motion.div>
      )}
    </>
  );
};

export default AudioPlayer;