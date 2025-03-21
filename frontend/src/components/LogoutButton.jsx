import React, {useState} from "react";
import {motion} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import {User, LogOut, Volume2, VolumeX} from 'lucide-react';

const LogoutButton = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const user = useStore(state => state.user);
    const audioPlaying = useStore(state => state.audioPlaying);
    const toggleAudio = useStore(state => state.toggleAudio);
    const navigate = useNavigate();
    const logout = useStore(state => state.logout);
  
    const handleLogout = async () => {
      setShowConfirm(false);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      logout();
      navigate('/');
    };
    
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 }
      }
    };

    return (
      <>
        <motion.div 
          variants={itemVariants}
          className="fixed top-4 right-4 z-50 flex items-center gap-2"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAudio}
            className="px-3 py-2 bg-background-card rounded-full border border-secondary/10 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
            aria-label={audioPlaying ? "Mute audio" : "Play audio"}
          >
            {audioPlaying ? (
              <Volume2 className="w-4 h-4 text-secondary" />
            ) : (
              <VolumeX className="w-4 h-4 text-secondary" />
            )}
          </motion.button>
          
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-2 px-4 py-2 bg-background-card rounded-full border border-secondary/10 backdrop-blur-sm"
          >
            <User className="w-4 h-4 text-secondary" />
            <span className="text-text-primary text-sm">
              {user?.name || 'User'}
            </span>
          </motion.div>
  
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-full text-text-primary font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-primary/20"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </motion.div>
  
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-background-card p-6 rounded-xl shadow-xl border border-secondary/10 max-w-sm w-full"
            >
              <h3 className="text-lg font-medium text-text-primary mb-2">
                Confirm Logout
              </h3>
              <p className="text-text-secondary mb-6">
                Are you sure you want to log out of your account?
              </p>
              <div className="flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark rounded-full text-text-primary transition-all duration-300"
                >
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </>
    );
};

export default LogoutButton;