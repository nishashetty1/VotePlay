import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Loading } from "./components";
import { useStore } from "./store/useStore.js";

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchTeams = useStore((state) => state.fetchTeams);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (isLoading) return <Loading />;
  return (
    <>
      <Outlet />
    </>
  );
};
export default App;
