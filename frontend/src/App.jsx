import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Loading } from "./components";
import { useStore } from "./store/useStore.js";
import { AudioPlayer } from "./components";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    const selectedCategory = useStore.getState().selectedCategory;
    if (selectedCategory) {
      useStore.getState().fetchTeams(selectedCategory.id);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) return <Loading />;
  
  return (
    <>
      <AudioPlayer />
      <Outlet />
    </>
  );
};

export default App;