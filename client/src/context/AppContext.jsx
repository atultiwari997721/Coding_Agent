import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const AppContext = createContext(undefined);

export function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const navigate = useNavigate();

  const checkSession = async () => {
    try {
      const { data } = await api.get("/api/auth/me");

      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
        navigate("/login", { replace: true });
      }
    } catch (error) {
      setUser(null);
      navigate("/login", { replace: true });
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  if (loadingUser) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        user,
        loadingUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error(
      "useAppContext must be used within an AppContextProvider"
    );
  }

  return context;
}