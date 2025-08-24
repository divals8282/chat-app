import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { socketClient } from "./socket-io";
import { useLocation } from "react-router";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    socketClient
      .initializeConection()
      .then(() => {
        setIsLoading(false);
        navigate("/chat");
      })
      .catch((err) => {
        if (location.pathname === "/") {
          navigate("/sign-in");
        }
        setIsLoading(false);
        console.info(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isLoading ? "loading..." : <Outlet />;
}

export default App;
